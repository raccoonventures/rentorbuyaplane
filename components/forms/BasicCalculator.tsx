"use client";

import { Field } from "@headlessui/react";
import { Checkbox } from "@/catalyst/checkbox";
import { Label } from "@/catalyst/fieldset";
import { Select } from "@/catalyst/select";
import { AssumptionsPanel } from "@/components/forms/AssumptionsPanel";
import { NumberField } from "@/components/forms/fields";
import { aircraftTypes } from "@/helpers/aircraft";
import type { CalculatorState } from "@/hooks/useCalculator";

export function BasicCalculator({
	state,
	onAdvanced,
}: {
	state: CalculatorState;
	onAdvanced: () => void;
}) {
	const {
		formData,
		preset,
		handleSelectChange,
		handleChange,
		handleIsWetSwitchChange,
	} = state;

	return (
		<div className="grid grid-flow-row items-start gap-8 lg:grid-cols-5">
			{/* Inputs */}
			<div className="grid grid-flow-row gap-8 rounded-lg border border-black/10 bg-zinc-950/5 p-6 lg:col-span-2 lg:p-8 dark:border-white/10 dark:bg-white/5">
				<div>
					<h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
						The essentials
					</h2>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Three answers and we'll estimate the rest.
					</p>
				</div>

				<Field className="grid grid-flow-row gap-1.5">
					<Label>Which aircraft?</Label>
					<Select
						name="aircraft.type"
						value={formData.aircraft?.type}
						onChange={handleSelectChange}
					>
						{aircraftTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</Select>
				</Field>

				<NumberField
					label="Rental rate"
					name="costs.rental.hourlyRate"
					value={formData.costs?.rental?.hourlyRate}
					onChange={handleChange}
					prefix="$"
					suffix="/hour"
					hint="What a comparable rental costs per hour."
				/>

				<Field className="grid grid-flow-col items-center justify-start gap-3">
					<Checkbox
						name="costs.rental.isWet"
						checked={formData.costs?.rental?.isWet}
						color="teal"
						onChange={handleIsWetSwitchChange}
					/>
					<Label>
						{formData.costs?.rental?.isWet
							? "Fuel is included (wet rate)"
							: "Fuel is not included (dry rate)"}
					</Label>
				</Field>

				<p className="text-sm text-zinc-500 dark:text-zinc-400">
					Then drag the hours slider below to see where you land.
				</p>
			</div>

			{/* Assumptions */}
			<div className="lg:col-span-3">
				<AssumptionsPanel
					formData={formData}
					preset={preset}
					onAdvanced={onAdvanced}
				/>
			</div>
		</div>
	);
}
