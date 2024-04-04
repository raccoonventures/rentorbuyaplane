import { Calculator } from '@/components/Calculator';

export default function Home() {
	return (
		<main className="grid min-h-screen grid-flow-row items-center justify-center p-24">
			<section className="pb-12">
				<h1 className="text-4xl font-bold text-white">RentOrBuyAPlane.com</h1>
			</section>
			<Calculator />
		</main>
	);
}
