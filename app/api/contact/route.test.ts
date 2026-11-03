import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { identify, track, closeAndFlush } = vi.hoisted(() => ({
	identify: vi.fn(),
	track: vi.fn(),
	closeAndFlush: vi.fn(async () => {}),
}));

vi.mock("@customerio/cdp-analytics-node", () => ({
	Analytics: class {
		identify = identify;
		track = track;
		closeAndFlush = closeAndFlush;
	},
}));

import { POST } from "./route";

function post(body: unknown) {
	return POST(
		new Request("http://localhost/api/contact", {
			method: "POST",
			body: typeof body === "string" ? body : JSON.stringify(body),
		}),
	);
}

const valid = {
	name: "Ada Pilot",
	email: "ada@example.com",
	message: "Please add the Piper Archer.",
};

describe("POST /api/contact", () => {
	beforeEach(() => vi.clearAllMocks());
	afterEach(() => vi.restoreAllMocks());

	it("accepts a valid submission and forwards it", async () => {
		const res = await post(valid);
		expect(res.status).toBe(200);
		expect(identify).toHaveBeenCalledOnce();
		expect(track).toHaveBeenCalledWith(
			expect.objectContaining({ event: "Contact Form Submitted" }),
		);
		expect(closeAndFlush).toHaveBeenCalledOnce();
	});

	it("never logs the submission", async () => {
		const log = vi.spyOn(console, "log").mockImplementation(() => {});
		await post(valid);
		expect(log).not.toHaveBeenCalled();
	});

	it("rejects malformed JSON", async () => {
		expect((await post("{nope")).status).toBe(400);
		expect(track).not.toHaveBeenCalled();
	});

	it.each([
		["null body", null],
		["missing field", { name: "A", email: "a@b.co" }],
		["non-string field", { ...valid, message: 42 }],
		["blank field", { ...valid, name: "   " }],
		["bad email", { ...valid, email: "not-an-email" }],
		["oversized message", { ...valid, message: "x".repeat(5001) }],
	])("rejects %s", async (_label, body) => {
		expect((await post(body)).status).toBe(400);
		expect(identify).not.toHaveBeenCalled();
		expect(track).not.toHaveBeenCalled();
	});

	it("forwards only the known fields", async () => {
		await post({ ...valid, extra: "ignored" });
		const props = track.mock.calls[0][0].properties;
		expect(props).toEqual(valid);
	});
});
