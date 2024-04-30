import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import type { Metadata } from 'next';
import Script from 'next/script';

import './globals.css';

export const metadata: Metadata = {
	title: 'RentOrBuyAPlane.com',
	description:
		'Estimate the cost of owning vs renting a plane, and discover the exact # of hours to break even',
	openGraph: {
		images: [
			{
				url: 'https://rentorbuyaplane.com/og.webp', // Must be an absolute URL
				width: 1200,
				height: 603,
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-zinc-50 p-4 md:p-12 lg:p-24 2xl:p-36 2xl:pt-24 dark:bg-[#202124]">
				<Header />
				<main className="p-3">{children}</main>
				<Footer />
			</body>
			<Script
				data-website-id={`${process.env.NEXT_PUBLIC_UMAMI_DATA_WEBSITE_ID}`}
				src="https://analytics.jpvalery.com/script.js"
			/>
		</html>
	);
}
