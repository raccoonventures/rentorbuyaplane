"use client";

import { PlaneIllustration } from "@/components/planes/PlaneIllustration";
import type { AircraftPreset } from "@/helpers/aircraft";
import type { DetailedFormData } from "@/types";

const commaNumber = require("comma-number");

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-baseline justify-between gap-4 border-b border-black/5 py-1.5 dark:border-white/5">
			<dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
			<dd className="text-sm font-medium text-zinc-900 tabular-nums dark:text-zinc-100">
				{value}
			</dd>
		</div>
	);
}

const money = (n: number | undefined) => `$${commaNumber(Math.round(n ?? 0))}`;

export function AssumptionsPanel({
	formData,
	preset,
	onAdvanced,
}: {
	formData: DetailedFormData;
	preset: AircraftPreset;
	onAdvanced: () => void;
}) {
	const acq = formData.costs?.acquisition ?? {};
	const fixed = formData.costs?.operation?.fixed ?? {};
	const variable = formData.costs?.operation?.variable ?? {};
	const factors = formData.factors ?? {};
	const aircraft = formData.aircraft ?? {};

	const hourlyTotal =
		(variable.fuel ?? 0) +
		(variable.oil ?? 0) +
		(variable.reserve?.engine ?? 0) +
		(variable.reserve?.maintenance ?? 0) +
		(variable.upgrades ?? 0) +
		(variable.cosmetic ?? 0);
	const fixedTotal =
		(fixed.hangar ?? 0) +
		(fixed.insurance ?? 0) +
		(fixed.annual ?? 0) +
		(fixed.financing ?? 0);
	const fixedPeriod = formData.settings?.fixedCostsYearly ? "/year" : "/mo";

	return (
		<div className="grid h-full grid-flow-row gap-6 rounded-lg border border-black/10 bg-zinc-950/5 p-6 lg:p-8 dark:border-white/10 dark:bg-white/5">
			<div className="flex items-center gap-4">
				<PlaneIllustration
					category={preset.category}
					className="size-16 shrink-0"
				/>
				<div>
					<h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
						What we're assuming
					</h2>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Typical numbers for a {aircraft.type}. Switch to Advanced to change any of
						them.
					</p>
				</div>
			</div>

			<div className="grid grid-flow-row gap-x-10 gap-y-0 sm:grid-cols-2">
				<dl>
					<Row label="Acquisition price" value={money(acq.price)} />
					<Row
						label="Down payment"
						value={`${money(acq.downPayment)} · ${acq.durationYears}yr @ ${acq.interestRate}%`}
					/>
					<Row label="Monthly loan payment" value={money(fixed.financing)} />
					<Row
						label="Fuel"
						value={`${aircraft.fuelBurn} GPH @ ${money(factors.fuelPrice)}/gal`}
					/>
					<Row label="Engine overhaul" value={money(factors.engineOverhaul)} />
				</dl>
				<dl>
					<Row label="Hangar / tie-down" value={`${money(fixed.hangar)}/mo`} />
					<Row label="Insurance" value={`${money(fixed.insurance)}/mo`} />
					<Row label="Annual inspection" value={`${money(fixed.annual)}/mo`} />
					<Row
						label="Maintenance reserve"
						value={`${money(variable.reserve?.maintenance)}/hr`}
					/>
					<Row
						label="Engine reserve"
						value={`${money(variable.reserve?.engine)}/hr`}
					/>
				</dl>
			</div>

			<dl className="grid gap-x-10 gap-y-0 border-t border-black/10 pt-3 sm:grid-cols-2 dark:border-white/10">
				<div className="flex items-baseline justify-between gap-4 py-1.5">
					<dt className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Hourly operating expenses
					</dt>
					<dd className="text-sm font-semibold text-zinc-950 tabular-nums dark:text-white">
						{money(hourlyTotal)}/hr
					</dd>
				</div>
				<div className="flex items-baseline justify-between gap-4 py-1.5">
					<dt className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
						Fixed costs total
					</dt>
					<dd className="text-sm font-semibold text-zinc-950 tabular-nums dark:text-white">
						{money(fixedTotal)}
						{fixedPeriod}
					</dd>
				</div>
			</dl>

			<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Figures are ballpark starting points—adjust them to your situation.
				</p>
				<button
					type="button"
					onClick={onAdvanced}
					className="cursor-pointer text-sm font-medium text-[#FF7124] hover:underline"
				>
					Fine-tune every number in Advanced →
				</button>
			</div>
		</div>
	);
}
