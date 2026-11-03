import { Analytics } from "@customerio/cdp-analytics-node";
import { NextResponse } from "next/server";
import { CONTACT_LIMITS, EMAIL_PATTERN } from "@/utils/contact";

const analytics = new Analytics({
	writeKey: `${process.env.CIO_CDP_API_KEY}`,
	host: "https://cdp.customer.io",
});

type ContactPayload = { name: string; email: string; message: string };

/** Return a clean payload, or null when the body is not a valid contact form. */
function parseContact(body: unknown): ContactPayload | null {
	if (typeof body !== "object" || body === null) return null;
	const { name, email, message } = body as Record<string, unknown>;
	if (
		typeof name !== "string" ||
		typeof email !== "string" ||
		typeof message !== "string"
	) {
		return null;
	}

	const clean = {
		name: name.trim(),
		email: email.trim(),
		message: message.trim(),
	};
	if (!clean.name || !clean.email || !clean.message) return null;
	if (
		clean.name.length > CONTACT_LIMITS.name ||
		clean.email.length > CONTACT_LIMITS.email ||
		clean.message.length > CONTACT_LIMITS.message
	) {
		return null;
	}
	if (!EMAIL_PATTERN.test(clean.email)) return null;
	return clean;
}

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
	}

	const contact = parseContact(body);
	if (!contact) {
		return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
	}

	// Never log the submission: it holds personal data.
	analytics.identify({
		userId: contact.email,
		traits: {
			name: contact.name,
			email: contact.email,
			unsubscribed: true,
		},
	});

	analytics.track({
		userId: contact.email,
		event: "Contact Form Submitted",
		properties: contact,
	});

	await analytics.closeAndFlush();
	return NextResponse.json({ message: "ok" });
}
