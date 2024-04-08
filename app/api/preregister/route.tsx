import { Analytics } from '@customerio/cdp-analytics-node';
import { NextResponse } from 'next/server';

const analytics = new Analytics({
	writeKey: `${process.env.CIO_CDP_API_KEY}`,
	host: 'https://cdp.customer.io',
});

export async function POST(request: Request) {
	const body = await request.json();

	analytics.track({
		userId: body.email,
		event: 'Preregistered',
		properties: {},
	});

	await analytics.closeAndFlush();

	return NextResponse.json({ message: 'ok' });
}
