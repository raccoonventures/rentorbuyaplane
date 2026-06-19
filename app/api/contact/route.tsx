import { Analytics } from "@customerio/cdp-analytics-node";
import { NextResponse } from "next/server";

const analytics = new Analytics({
	writeKey: `${process.env.CIO_CDP_API_KEY}`,
	host: "https://cdp.customer.io",
});

export async function POST(request: Request) {
	const body = await request.json();
	console.log(body);

	analytics.identify({
		userId: body.email,
		traits: {
			name: body.name,
			email: body.email,
			unsubscribed: true,
		},
	});

	analytics.track({
		userId: body.email,
		event: "Contact Form Submitted",
		properties: body,
	});

	await analytics.closeAndFlush();
	return NextResponse.json({ message: "ok" });
}
