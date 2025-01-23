import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

const navigation = [
	{ name: 'Calculator', href: '/', notification: true },
	{ name: 'About', href: '/about' },
	{ name: 'Contact', href: '/contact' },
];

export default function Header() {
	return (
		<header
			className={`sticky top-0 z-50 grid grid-flow-row justify-center gap-2 bg-linear-to-b from-zinc-50/95 from-60% to-transparent px-3 pt-6 pb-6 md:grid-flow-col md:justify-between md:pb-12 dark:from-[#202124]/95`}
		>
			<Logo />
			<div>
				<ul className="grid grid-flow-col items-baseline justify-around gap-3 rounded-full bg-white/90 px-4 py-1 text-sm font-medium text-zinc-800 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm hover:ring-zinc-900/15 dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/15">
					{navigation.map((item) =>
						item.notification ? (
							<li
								key={item.name}
								className="relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm leading-6 font-semibold text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-50/5 dark:hover:text-zinc-50"
							>
								<Link href={item.href} className="relative">
									{item.name}
								</Link>
								<span className="relative mt-0.5 flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75 dark:bg-green-400"></span>
									<span className="relative inline-flex h-2 w-2 rounded-full bg-green-600 dark:bg-green-500"></span>
								</span>
							</li>
						) : (
							<li
								key={item.name}
								className="relative inline-flex items-center rounded-full px-3 py-1 text-sm leading-6 font-semibold text-zinc-600 hover:bg-zinc-900/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-50/5 dark:hover:text-zinc-50"
							>
								<Link href={item.href} className="relative">
									{item.name}
								</Link>
							</li>
						),
					)}
				</ul>
			</div>
		</header>
	);
}
