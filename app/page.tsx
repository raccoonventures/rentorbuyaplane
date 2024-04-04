import { Calculator } from '@/components/Calculator';

export default function Home() {
	return (
		<main>
			<section className="pb-12">
				<h1 className="text-4xl font-bold text-slate-950 dark:text-white">
					RentOrBuyAPlane.com
				</h1>
			</section>
			<Calculator />
		</main>
	);
}
