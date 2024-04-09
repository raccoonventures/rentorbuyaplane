'use client';

import { usePathname } from 'next/navigation';

import { Logo } from '@/components/layout/logo';

export default function Header() {
	const pathname = usePathname();

	// Check if the current page is the homepage
	const isHomePage = pathname === '/';

	return isHomePage ? (
		<header className="grid justify-start">
			<Logo />
		</header>
	) : (
		<header className="grid justify-center">
			<Logo />
		</header>
	);
}
