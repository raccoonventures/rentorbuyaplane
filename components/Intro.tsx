import Image from 'next/image';

export default function Intro() {
	return (
		<section className="grid grid-flow-col gap-24 px-6 pb-12">
			<div className="grid max-w-4xl grid-flow-row gap-6 text-zinc-900 dark:text-zinc-100">
				<p>
					Welcome to rentorbuyaplane.com, your go-to destination for answering
					the age-old aviation question: should you rent or buy a plane? Our
					intuitive and powerful cost calculator takes the guesswork out of
					aircraft ownership decisions. Whether you&apos;re a seasoned pilot or
					dreaming of taking flight, our tool provides personalized insights
					based on your unique flying needs.
				</p>
				<p>
					Wondering about the economics of owning a plane versus renting? Our
					calculator factors in crucial metrics like your anticipated flight
					hours, gallons-per-hour consumption, fuel prices, maintenance costs,
					and financing expenses. By crunching these numbers, we&apos;ll reveal
					the financial feasibility of owning your own aircraft compared to
					renting one.
				</p>
				{/*
				<p>
					At rentorbuyaplane.com, we&apos;re committed to simplicity and
					transparency. Our user-friendly interface empowers you to make
					informed decisions. Simply input your flight parameters, and within
					seconds, discover whether owning a plane aligns with your budget and
					lifestyle.
				</p>
				<p>
					Explore the benefits of aircraft ownership tailored to your
					circumstances. Our tool doesn&apos;t just calculate costs; it unveils
					opportunities. Unleash your aviation ambitions and uncover when owning
					a plane becomes more cost-effective than renting.
				</p>
				<p>
					Ready to take control of your aviation destiny? Try our plane cost
					calculator today and soar towards smarter ownership decisions.
				</p>
				*/}
			</div>
			<div className="hidden max-w-4xl items-center justify-center lg:grid">
				<Image
					alt="illustration of an isometric plane"
					src="/isometric-plane.png"
					width="180"
					height="180"
				/>
			</div>
		</section>
	);
}
