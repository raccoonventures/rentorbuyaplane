import Image from 'next/image';

const redditUsers = [
	'BillySpacs',
	'fenuxjde',
	'theanswriz42',
	'Capt-Soliman',
	'Sufficient_Rate1032',
	'FridayMcNight',
	'Rhyick',
	'Ictalbot',
	'sarge46',
	'Badjo',
	'KITTYONFYRE',
	'lavionverte',
	'Zestyclose-Glove2559',
	'iguanayou',
];

const AboutPage = () => {
	return (
		<section className="grid grid-flow-row items-center justify-center gap-8">
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
					<h2 id="our-mission">Our Mission</h2>
					<p>
						Welcome to rentorbuyaplane.com, your trusted resource for navigating
						the complexities of aircraft ownership. Our mission is to provide
						aviators, from seasoned pilots to aspiring enthusiasts, with the
						tools and insights needed to determine whether owning a plane is
						more cost-effective than renting.
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
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<Image
					alt="portrait of Jp, developer of rentorbuyaplane.com"
					src="/jp-valery-avatar.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
				<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
					<h2 id="meet-our-founder">Meet Our Founder</h2>
					<p>
						rentorbuyaplane.com is the brainchild of Jp, a dedicated aviation
						enthusiast and the visionary behind Raccoon Ventures Inc. With a
						profound passion for flight and a Private Pilot License, Jp combines
						his love for aviation with his expertise in web development to
						create a valuable resource for fellow avgeeks.
					</p>
				</div>
			</div>

			<div className="grid grid-flow-col items-center justify-start gap-12">
				<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
					<h2 id="our-commitment">Our Commitment</h2>
					<p>
						At rentorbuyaplane.com, we are committed to empowering our community
						with transparent and accurate information. We understand that
						aircraft ownership involves various financial considerations, from
						fuel and maintenance costs to financing and depreciation. Our goal
						is to simplify this process, providing clarity through our intuitive
						cost calculator.
					</p>
				</div>

				<Image
					alt="man refueling a Cessna airplane on the ground"
					src="/about-refill.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
			</div>
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<Image
					alt="photo of a pilot smiling in the cockpit"
					src="/about-pilot.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
				<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
					<h2 id="why-choose-us-">Why Choose Us?</h2>
					<p>
						Choosing between renting and buying a plane is a significant
						decision. Our calculator takes into account key factors such as
						anticipated flight hours, fuel consumption rates, insurance costs,
						and more. By analyzing these variables, we deliver personalized
						insights to help you make informed choices about your aviation
						journey.
					</p>
				</div>
			</div>

			<div className="grid grid-flow-col items-center justify-start gap-12">
				<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
					<h2 id="how-it-works">How It Works</h2>
					<p>
						Using our cost calculator is easy. Simply enter your flight
						parameters, and within moments, receive a detailed breakdown of the
						financial implications of owning versus renting an aircraft. Our
						tool enables you to explore different scenarios and understand when
						aircraft ownership becomes economically advantageous.
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
			<div className="grid grid-flow-col items-center justify-start gap-12">
				<Image
					alt="pilot and copilot in a cockpit during a sunset"
					src="/about-cockpit.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
				<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
					<h2 id="join-our-community">Join Our Community</h2>
					<p>
						Join our growing community of aviation enthusiasts! Whether
						you&#39;re a seasoned pilot looking to expand your fleet or a
						first-time flyer dreaming of ownership, rentorbuyaplane.com is here
						to support you. Connect with us, share your experiences, and embark
						on your aviation adventure with confidence.
					</p>
				</div>
			</div>

			<div className="grid grid-flow-col items-center justify-start gap-12">
				<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
					<h2 id="get-in-touch">Get in Touch</h2>
					<p>
						Ready to take flight with rentorbuyaplane.com? Explore our
						resources, try our cost calculator, and unlock the true potential of
						aircraft ownership. Have questions or feedback? Reach out to Jp and
						the team – we&#39;re passionate about aviation and committed to
						helping you achieve your aviation goals.
					</p>
				</div>

				<Image
					alt="small airplane with retractable gear flying over dunes of sand"
					src="/about-flyover.webp"
					width="180"
					height="180"
					className="rounded-full"
				/>
			</div>
			<div className="prose prose-lg prose-zinc mx-auto mt-24 grid justify-center text-center tracking-tight dark:prose-invert">
				<h4>
					Thanks to the following users from the /r/flying subreddit for their
					feedback
				</h4>
				<p>
					{redditUsers.map((value, index) => (
						<span key={value}>
							{value}
							{index != redditUsers.length - 1 ? ', ' : ' '}
						</span>
					))}
				</p>
			</div>
		</section>
	);
};

export default AboutPage;
