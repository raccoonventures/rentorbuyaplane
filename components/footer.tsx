import Link from 'next/link';

const navigation = [{ name: 'Home', href: '/' }];

export default function Footer() {
	return (
		<footer className="pt-12">
			<div className="mx-auto grid max-w-7xl grid-flow-row items-center px-6 py-12 md:flex md:grid-flow-row md:items-center md:justify-between lg:px-8">
				<div className="flex justify-center space-x-6 md:order-2">
					{navigation.map((item) => (
						<div key={item.name} className="">
							<Link
								href={item.href}
								className="text-xs leading-5 text-zinc-500 hover:text-zinc-200"
							>
								{item.name}
							</Link>
						</div>
					))}
				</div>
				<div className="md:order-1">
					<p className="text-center text-xs leading-5 text-zinc-500">
						&copy; 2024{' '}
						<Link href="https://raccoonv.com">Raccoon Ventures, Inc.</Link> All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
