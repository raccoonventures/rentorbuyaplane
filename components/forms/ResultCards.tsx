"use client";

import { Field } from "@headlessui/react";
import NumberFlow from "@number-flow/react";
import { Badge } from "@/catalyst/badge";
import { Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";
import { Chart } from "@/components/charts/compare";
import type { OutputData } from "@/types";

const commaNumber = require("comma-number");

interface ResultCardsProps {
	output: OutputData;
	estimatedHours: number;
	onHoursChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
	children,
}: {
	title: string;
	best: boolean;
	total: number;
	atLeast: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className={`rounded-lg border p-5 ${best ? winnerClass : idleClass}`}>
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
		</div>
	);
}

export function ResultCards({
	output,
	estimatedHours,
	onHoursChange,
}: ResultCardsProps) {
	const hours = estimatedHours;
	const atLeast = hours >= 200;
	const isBuyingBest = output.isBuyingBest ?? false;
	const breakEven = output.breakEven ?? 0;

	const rentPerHour = output.renting?.perHour ?? 0;
	const rentFixed = output.renting?.fixed ?? 0;
	const ownPerHour = output.owning?.perHour ?? 0;
	const ownFixed = output.owning?.fixed?.perYear ?? 0;

	const rentTotal = rentPerHour * hours + rentFixed;
	const ownTotal = ownPerHour * hours + ownFixed;

	return (
		<section className="my-10 grid grid-flow-row gap-8 rounded-lg border border-black/10 bg-zinc-950/5 p-6 lg:p-8 dark:border-white/10 dark:bg-white/5">
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
				<Field className="flex items-center gap-3">
					<Label className="text-sm whitespace-nowrap">Hours flown per year</Label>
					<div className="w-24">
						<Input
							type="number"
							name="estimatedHours"
							min={0}
							max={200}
							value={hours}
							onChange={onHoursChange}
						/>
					</div>
				</Field>
			</div>

			{/* Comparison */}
			<div className="grid gap-6 md:grid-cols-2">
				<CompareCard
					title="Rent a plane"
					best={!isBuyingBest}
					total={rentTotal}
					atLeast={atLeast}
				>
					<BreakdownRow
						label="Hourly rate"
						value={`$${commaNumber(rentPerHour)}/hr × ${hours} hrs`}
					/>
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
