import Image from "next/image";

const redditUsers = [
	"BillySpacs",
	"fenuxjde",
	"theanswriz42",
	"Capt-Soliman",
	"Sufficient_Rate1032",
	"FridayMcNight",
	"Rhyick",
	"Ictalbot",
	"sarge46",
	"Badjo",
	"KITTYONFYRE",
	"lavionverte",
	"Zestyclose-Glove2559",
	"iguanayou",
];

const AboutPage = () => {
	return (
		<section className="grid grid-flow-row items-center justify-center gap-16 py-8">
			{/* Why this exists */}
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<div className="prose prose-lg prose-zinc dark:prose-invert grid justify-center tracking-tight">
					<h2 id="why-this-exists">Why this exists</h2>
					<p>
						I&apos;m Jp—a private pilot who got tired of guessing. Every rental
						invoice felt like money set on fire, but buying a plane looked terrifying
						and the spreadsheets never agreed with each other. I wanted one honest
						answer to a simple question: at how many hours a year does owning actually
						beat renting? I couldn&apos;t find a calculator that did the math the way
						a pilot thinks about it, so I built this one.
					</p>
				</div>
				<Image
					alt="photo of a Cessna 150 with a clear blue sky in background"
					src="/about-sky.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
			</div>

			{/* What it does */}
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<Image
					alt="man refueling a Cessna airplane on the ground"
					src="/about-refill.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
				<div className="prose prose-lg prose-zinc dark:prose-invert grid justify-center tracking-tight">
					<h2 id="what-it-does">What it does</h2>
					<p>
						Pick an aircraft and tell it how much you fly. It splits ownership into
						the costs that hit whether you fly or not—hangar, insurance, the annual,
						your loan—and the costs that scale with every hour: fuel, oil, and the
						reserves you should be setting aside for the engine overhaul and
						maintenance. Then it stacks that against what renting the same plane would
						run you, and shows the break-even point where the lines cross.
					</p>
				</div>
			</div>

			{/* What it doesn't do */}
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<div className="prose prose-lg prose-zinc dark:prose-invert grid justify-center tracking-tight">
					<h2 id="what-it-doesnt-do">What it doesn&apos;t do</h2>
					<p>
						It won&apos;t do your taxes, predict resale value, or factor in the grin
						you get walking out to a plane that&apos;s yours. The defaults are
						reasonable starting points, not gospel—real insurance quotes, maintenance
						surprises, and partnership arrangements vary wildly. Treat the result as a
						well-informed gut check, not financial advice, and always sanity-check the
						numbers against your own quotes.
					</p>
				</div>
				<Image
					alt="photography through the windshield of a small airplane flying over a desert"
					src="/about-windshield.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
			</div>

			{/* Who's behind it */}
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<Image
					alt="portrait of Jp, developer of rentorbuyaplane.com"
					src="/jp-valery-avatar.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
				<div className="prose prose-lg prose-zinc dark:prose-invert grid justify-center tracking-tight">
					<h2 id="whos-behind-it">Who&apos;s behind it</h2>
					<p>
						This is a side project I build under Raccoon Ventures Inc., somewhere
						between a hangar-flying conversation and a calculator. If a number looks
						off or you&apos;d like to see a feature, I genuinely want to hear it—reach
						out through the contact page. Blue skies and tailwinds.
					</p>
				</div>
			</div>

			<div className="prose prose-lg prose-zinc dark:prose-invert mx-auto mt-12 grid justify-center text-center tracking-tight">
				<h4>
					Thanks to these folks from the /r/flying subreddit for kicking the tires
					and pushing back on the numbers
				</h4>
				<p>
					{redditUsers.map((value, index) => (
						<span key={value}>
							{value}
							{index !== redditUsers.length - 1 ? ", " : " "}
						</span>
					))}
				</p>
			</div>
		</section>
	);
};

export default AboutPage;
