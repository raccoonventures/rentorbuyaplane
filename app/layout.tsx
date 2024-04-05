import { Logo } from '@/components/logo';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-zinc-50 p-4 md:p-12 lg:px-36 lg:py-24 dark:bg-[#202124]">
				<Logo />
				{children}
			</body>
		</html>
	);
}
