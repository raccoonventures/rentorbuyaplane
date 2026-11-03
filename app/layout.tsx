import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

import "./globals.css";

const SITE_URL = "https://rentorbuyaplane.com";
const SITE_NAME = "RentOrBuyAPlane.com";
const DESCRIPTION =
	"Estimate the cost of owning vs renting a plane, and discover the exact # of hours to break even";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Rent vs. Buy a Plane Calculator | RentOrBuyAPlane.com",
		template: `%s | ${SITE_NAME}`,
	},
	description: DESCRIPTION,
	alternates: { canonical: "./" },
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		locale: "en_US",
		title: "Rent vs. Buy a Plane Calculator",
		description: DESCRIPTION,
		url: "./",
		images: [
			{
				url: "/og.webp",
				width: 1200,
				height: 603,
				alt: "RentOrBuyAPlane.com: rent vs. buy a plane calculator",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Rent vs. Buy a Plane Calculator",
		description: DESCRIPTION,
		images: ["/og.webp"],
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
				<Script
					data-website-id={`${process.env.NEXT_PUBLIC_UMAMI_DATA_WEBSITE_ID}`}
					src="https://analytics.jpvalery.com/script.js"
				/>
			</body>
		</html>
	);
}
