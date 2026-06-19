"use client";

import * as Headless from "@headlessui/react";
import clsx from "clsx";

function GasPumpIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 256"
			className={className}
			aria-hidden="true"
		>
			<rect width="256" height="256" fill="none" />
			<path
				d="M56,216V56A16,16,0,0,1,72,40h80a16,16,0,0,1,16,16V216"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
			<line
				x1="32"
				y1="216"
				x2="192"
				y2="216"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
			<path
				d="M168,112h24a16,16,0,0,1,16,16v40a16,16,0,0,0,16,16h0a16,16,0,0,0,16-16V86.63a16,16,0,0,0-4.69-11.32L216,56"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
			<line
				x1="136"
				y1="112"
				x2="88"
				y2="112"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
		</svg>
	);
}

/**
 * Wet/dry rental rate switch. "On" means the rate is wet (fuel included);
 * the gas pump turns green. "Off" is a dry rate (fuel billed separately);
 * the pump turns red/grey.
 */
export function FuelRateToggle({
	isWet,
	onChange,
}: {
	isWet: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<Headless.Field className="flex items-center gap-3">
			<Headless.Switch
				checked={isWet}
				onChange={onChange}
				className={clsx(
					"group relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
					isWet
						? "bg-emerald-500 focus-visible:ring-emerald-500"
						: "bg-zinc-300 focus-visible:ring-zinc-400 dark:bg-zinc-600",
				)}
			>
				<span
					className={clsx(
						"inline-flex size-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200",
						isWet ? "translate-x-6" : "translate-x-1",
					)}
				>
					<GasPumpIcon
						className={clsx(
							"size-3.5 transition-colors",
							isWet ? "text-emerald-600" : "text-red-500 dark:text-red-400",
						)}
					/>
				</span>
			</Headless.Switch>
			<Headless.Label className="cursor-pointer text-sm text-zinc-700 select-none dark:text-zinc-200">
				{isWet ? "Fuel is included (wet rate)" : "Fuel is not included (dry rate)"}
			</Headless.Label>
		</Headless.Field>
	);
}
