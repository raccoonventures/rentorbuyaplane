import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'RentOrBuyAPlane.com',
	description:
		'Estimate the cost of owning vs renting a plane, and discover the exact # of hours to break even',
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
		</html>
	);
}
