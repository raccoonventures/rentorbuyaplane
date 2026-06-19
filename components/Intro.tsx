export default function Intro() {
	return (
		<section className="grid grid-flow-row gap-x-24 gap-y-6 py-6 text-zinc-900 md:py-12 lg:grid-flow-col dark:text-zinc-100">
			<p>
				Renting feels cheap until you add up the hours. Buying feels smart until you
				add up the bills. This calculator settles the argument with actual
				numbers—the real cost of owning a plane, including the fixed costs that show
				up whether you fly or not and the reserves most people forget.
			</p>

			<p>
				Start in <span className="font-semibold">Basic</span>: pick your aircraft,
				set your hours, and we&apos;ll fill in sensible defaults you can see at a
				glance. Want to get precise? Switch to{" "}
				<span className="font-semibold">Advanced</span> and walk through every
				cost—financing, overhaul reserves, insurance, the lot—until the break-even
				point reflects your real situation.
			</p>
		</section>
	);
}
