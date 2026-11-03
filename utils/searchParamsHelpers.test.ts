import { describe, expect, it } from "vitest";
import { setNestedObject, toQueryString } from "./searchParamsHelpers";

/** Same parsing the PDF route does on a query string. */
function parse(query: string) {
	// biome-ignore lint/suspicious/noExplicitAny: arbitrary nested shape
	const params: any = {};
	new URLSearchParams(query).forEach((value, key) => {
		setNestedObject(
			params,
			key.split(/\[|\]/).filter((k) => k),
			value,
		);
	});
	return params;
}

describe("setNestedObject", () => {
	it("builds nested objects and keeps value types", () => {
		const out = parse(
			"aircraft[type]=Cessna%20172&output[estimatedHours]=50&output[isBuyingBest]=true",
		);
		expect(out).toEqual({
			aircraft: { type: "Cessna 172" },
			output: { estimatedHours: 50, isBuyingBest: true },
		});
	});

	it.each([
		"__proto__[polluted]=yes",
		"a[__proto__][polluted]=yes",
		"constructor[prototype][polluted]=yes",
		"a[constructor][prototype][polluted]=yes",
		"prototype[polluted]=yes",
	])("ignores unsafe key path: %s", (query) => {
		parse(query);
		expect(({} as Record<string, unknown>).polluted).toBeUndefined();
		expect(Object.prototype).not.toHaveProperty("polluted");
	});

	it("does not touch other values when an unsafe key is present", () => {
		expect(parse("__proto__[x]=1&a[b]=2")).toEqual({ a: { b: 2 } });
	});

	it("replaces a scalar with an object when a deeper path needs it", () => {
		expect(parse("a=1&a[b]=2")).toEqual({ a: { b: 2 } });
	});
});

describe("toQueryString", () => {
	it("round-trips through the parser", () => {
		const data = {
			aircraft: { type: "Cessna 172", fuelBurn: 8.5 },
			settings: { fixedCostsYearly: false },
		};
		expect(parse(toQueryString(data))).toEqual(data);
	});
});
