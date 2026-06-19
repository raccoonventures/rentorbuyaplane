"use client";

import NumberFlow from "@number-flow/react";
import { Badge } from "@/catalyst/badge";
import { Chart } from "@/components/charts/compare";
import { MAX_HOURS } from "@/hooks/useCalculator";
import type { DetailedFormData, OutputData } from "@/types";

const commaNumber = require("comma-number");

interface ResultCardsProps {
	output: OutputData;
	formData: DetailedFormData;
	estimatedHours: number;
	onHoursChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onHoursStep: (delta: number) => void;
}

const winnerClass =
	"border-emerald-500 bg-emerald-500/10 dark:border-emerald-400/50 dark:bg-emerald-500/10";
const idleClass =
	"border-black/10 bg-white/50 dark:border-white/10 dark:bg-white/5";

function BreakdownRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-baseline justify-between gap-4">
			<dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
			<dd className="font-medium text-zinc-800 tabular-nums dark:text-zinc-200">
				{value}
			</dd>
		</div>
	);
}

function CompareCard({
	title,
	best,
	total,
	atLeast,
	perHourFlown,
	children,
}: {
	title: string;
	best: boolean;
	total: number;
	atLeast: boolean;
	perHourFlown: number | null;
	children: React.ReactNode;
}) {
	return (
		<div
			className={`flex flex-col rounded-lg border p-5 ${best ? winnerClass : idleClass}`}
		>
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
					{title}
				</h3>
				{best && (
					<Badge className="uppercase" color="lime">
						best option
					</Badge>
				)}
			</div>
			<div className="mt-3 flex items-baseline gap-1">
				<span className="text-sm text-zinc-500">{atLeast ? "≥" : ""}</span>
				<span className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
					$<NumberFlow value={total} locales="en-US" />
				</span>
				<span className="text-sm text-zinc-500">/year</span>
			</div>
			<dl className="mt-4 grid gap-1.5 border-t border-black/5 pt-3 text-sm dark:border-white/10">
				{children}
			</dl>
			{perHourFlown !== null && (
				<div className="mt-auto flex items-baseline justify-between gap-4 border-t border-black/5 pt-3 text-sm dark:border-white/10">
					<dt className="font-medium text-zinc-700 dark:text-zinc-300">
						Cost per hour flown
					</dt>
					<dd className="font-semibold text-zinc-950 tabular-nums dark:text-white">
						${commaNumber(perHourFlown)}/hr
					</dd>
				</div>
			)}
		</div>
	);
}

function HoursStepper({
	hours,
	onHoursChange,
	onHoursStep,
}: {
	hours: number;
	onHoursChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onHoursStep: (delta: number) => void;
}) {
	const btn =
		"flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-xl font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15";
	return (
		<div className="flex flex-col items-start gap-1.5 sm:items-end">
			<span className="text-sm text-zinc-500 dark:text-zinc-400">
				Hours flown per year
			</span>
			<div className="flex items-center gap-3">
				<button
					type="button"
					aria-label="Decrease hours"
					className={btn}
					disabled={hours <= 0}
					onClick={() => onHoursStep(-10)}
				>
					−
				</button>
				<div className="relative w-24 text-center">
					<NumberFlow
						value={hours}
						locales="en-US"
						className="text-4xl font-bold tracking-tight text-zinc-950 dark:text-white"
					/>
					<input
						type="number"
						name="estimatedHours"
						min={0}
						max={MAX_HOURS}
						value={hours}
						onChange={onHoursChange}
						aria-label="Hours flown per year"
						className="absolute inset-0 w-full bg-transparent text-center text-4xl font-bold tracking-tight text-transparent caret-zinc-900 outline-none [appearance:textfield] dark:caret-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
					/>
				</div>
				<button
					type="button"
					aria-label="Increase hours"
					className={btn}
					disabled={hours >= MAX_HOURS}
					onClick={() => onHoursStep(10)}
				>
					+
				</button>
			</div>
		</div>
	);
}

export function ResultCards({
	output,
	formData,
	estimatedHours,
	onHoursChange,
	onHoursStep,
}: ResultCardsProps) {
	const hours = estimatedHours;
	const atLeast = hours >= MAX_HOURS;
	const isBuyingBest = output.isBuyingBest ?? false;
	const breakEven = output.breakEven ?? 0;

	const rentPerHour = output.renting?.perHour ?? 0;
	const rentFixed = output.renting?.fixed ?? 0;
	const ownPerHour = output.owning?.perHour ?? 0;
	const ownFixed = output.owning?.fixed?.perYear ?? 0;

	const rentRate = formData.costs?.rental?.hourlyRate ?? 0;
	const rentFuel = formData.costs?.operation?.variable?.fuel ?? 0;
	const rentIsWet = formData.costs?.rental?.isWet ?? false;

	const rentTotal = rentPerHour * hours + rentFixed;
	const ownTotal = ownPerHour * hours + ownFixed;

	const rentPerHourFlown = hours > 0 ? Math.round(rentTotal / hours) : null;
	const ownPerHourFlown = hours > 0 ? Math.round(ownTotal / hours) : null;

	return (
		<section
			id="results"
			className="my-10 grid scroll-mt-6 grid-flow-row gap-8 rounded-lg border border-black/10 bg-zinc-950/5 p-6 lg:p-8 dark:border-white/10 dark:bg-white/5"
		>
			{/* Header: verdict + hours input */}
			<div className="grid gap-4 sm:flex sm:items-end sm:justify-between">
				<div>
					<h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
						Your result
					</h2>
					<p className="mt-1 max-w-prose text-sm text-zinc-500 dark:text-zinc-400">
						{breakEven > 0 ? (
							<>
								Break-even at{" "}
								<span className="font-semibold text-zinc-900 dark:text-zinc-100">
									{breakEven} hours
								</span>
								/year—{isBuyingBest ? "buying" : "renting"} is cheaper at your usage.
							</>
						) : (
							<>
								{isBuyingBest ? "Buying" : "Renting"} is cheaper across the board at
								these numbers.
							</>
						)}
					</p>
				</div>
				<HoursStepper
					hours={hours}
					onHoursChange={onHoursChange}
					onHoursStep={onHoursStep}
				/>
			</div>

			{/* Comparison */}
			<div className="grid gap-6 md:grid-cols-2">
				<CompareCard
					title="Rent a plane"
					best={!isBuyingBest}
					total={rentTotal}
					atLeast={atLeast}
					perHourFlown={rentPerHourFlown}
				>
					<BreakdownRow
						label={rentIsWet ? "Hourly rate (wet)" : "Hourly rate (dry)"}
						value={`$${commaNumber(rentRate)}/hr × ${hours} hrs`}
					/>
					{!rentIsWet && rentFuel ? (
						<BreakdownRow
							label="Fuel"
							value={`$${commaNumber(rentFuel)}/hr × ${hours} hrs`}
						/>
					) : null}
					{rentFixed ? (
						<BreakdownRow
							label="Fixed fees"
							value={`$${commaNumber(rentFixed)}/year`}
						/>
					) : null}
				</CompareCard>

				<CompareCard
					title="Buy a plane"
					best={isBuyingBest}
					total={ownTotal}
					atLeast={atLeast}
					perHourFlown={ownPerHourFlown}
				>
					<BreakdownRow
						label="Variable costs"
						value={`$${commaNumber(ownPerHour)}/hr × ${hours} hrs`}
					/>
					<BreakdownRow
						label="Fixed costs"
						value={`$${commaNumber(ownFixed)}/year`}
					/>
				</CompareCard>
			</div>

			{/* Chart */}
			<div className="border-t border-black/5 pt-2 dark:border-white/5">
				<Chart
					rentCost={rentPerHour}
					operationCost={ownPerHour}
					fixedCost={ownFixed}
					breakEven={breakEven}
				/>
			</div>
		</section>
	);
}
