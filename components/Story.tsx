'use client';

import { Transition } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';

interface CarouselItem {
	desc: string;
}

const savedCarouselItems = [
	{
		desc: `Welcome to rentorbuyaplane.com, your go-to destination for answering
					the age-old aviation question: should you rent or buy a plane? Our
					intuitive and powerful cost calculator takes the guesswork out of
					aircraft ownership decisions. Whether you're a seasoned pilot or
					dreaming of taking flight, our tool provides personalized insights
					based on your unique flying needs.`,
	},
	{
		desc: `Wondering about the economics of owning a plane versus renting? Our
					calculator factors in crucial metrics like your anticipated flight
					hours, gallons-per-hour consumption, fuel prices, maintenance costs,
					and financing expenses. By crunching these numbers, we'll reveal
					the financial feasibility of owning your own aircraft compared to
					renting one.`,
	},
	{
		desc: `At rentorbuyaplane.com, we're committed to simplicity and
					transparency. Our user-friendly interface empowers you to make
					informed decisions. Simply input your flight parameters, and within
					seconds, discover whether owning a plane aligns with your budget and
					lifestyle.`,
	},
	{
		desc: `Explore the benefits of aircraft ownership tailored to your
					circumstances. Our tool doesn't just calculate costs; it unveils
					opportunities. Unleash your aviation ambitions and uncover when owning
					a plane becomes more cost-effective than renting.`,
	},
];

export default function Carousel({ items }: { items: CarouselItem[] }) {
	// Effects and animation
	const duration: number = 20000;
	const itemsRef = useRef<HTMLDivElement>(null);
	const frame = useRef<number>(0);
	const firstFrameTime = useRef(performance.now());
	const [active, setActive] = useState<number>(0);
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		firstFrameTime.current = performance.now();
		frame.current = requestAnimationFrame(animate);
		return () => {
			cancelAnimationFrame(frame.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	const animate = (now: number) => {
		let timeFraction = (now - firstFrameTime.current) / duration;
		if (timeFraction <= 1) {
			setProgress(timeFraction * 100);
			frame.current = requestAnimationFrame(animate);
		} else {
			timeFraction = 1;
			setProgress(0);
			setActive((active + 1) % items.length);
		}
	};

	const heightFix = () => {
		if (itemsRef.current && itemsRef.current.parentElement) {
			itemsRef.current.parentElement.style.height = `${itemsRef.current.clientHeight}px`;
			itemsRef.current.parentElement.style.width = `100%`;
		}
	};

	useEffect(() => {
		heightFix();
	}, []);

	return (
		<div className="w-full max-w-7xl">
			{/* Item image */}
			<div className="transition-all delay-300 duration-150 ease-in-out">
				<div className="relative flex flex-col" ref={itemsRef}>
					{items.map((item, index) => (
						<Transition
							key={index}
							show={active === index}
							enter="transition ease-in-out duration-500 delay-200"
							enterFrom="opacity-0 w-full"
							enterTo="opacity-100 w-full"
							leave="transition ease-in-out duration-300 absolute"
							leaveFrom="opacity-100 w-full"
							leaveTo="opacity-0 w-full"
							beforeEnter={() => heightFix()}
						>
							{/* Slide */}
							<div className="mx-auto w-full sm:px-6 lg:px-8">
								<div className="rounded-3x relative min-h-[66dvh] overflow-hidden bg-gray-900 px-12 py-24 shadow-xl md:min-h-0">
									<p className="mt-6 text-lg font-semibold text-white sm:text-xl sm:leading-8">
										{item.desc}
									</p>
								</div>
							</div>
						</Transition>
					))}
				</div>
			</div>
			{/* Buttons */}
			<div className="mx-auto grid w-full grid-flow-col justify-stretch gap-0 px-2 md:mt-8 md:max-w-5xl md:gap-4 md:px-0">
				{items.map((item, index) => (
					<button
						key={index}
						className="group rounded-sm p-2 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-lime-300"
						onClick={() => {
							setActive(index);
							setProgress(0);
						}}
					>
						<div
							className={`flex flex-col items-center space-y-1 text-center md:space-y-2 ${active === index ? '' : 'opacity-50 transition-opacity group-hover:opacity-100 group-focus:opacity-100'}`}
						>
							<div
								className="relative block h-1 w-full rounded-full bg-slate-200"
								role="progressbar"
								aria-valuenow={active === index ? progress : 0}
							>
								<span
									className="absolute inset-0 rounded-[inherit] bg-lime-500"
									style={{ width: active === index ? `${progress}%` : '0%' }}
								></span>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
