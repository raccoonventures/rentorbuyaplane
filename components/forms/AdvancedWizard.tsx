"use client";

import { Field } from "@headlessui/react";
import { useState } from "react";
import { Button } from "@/catalyst/button";
import { Checkbox } from "@/catalyst/checkbox";
import { Label } from "@/catalyst/fieldset";
import { Select } from "@/catalyst/select";
import { Switch } from "@/catalyst/switch";
import { NumberField, SectionHeading } from "@/components/forms/fields";
import { aircraftTypes } from "@/helpers/aircraft";
import type { CalculatorState } from "@/hooks/useCalculator";

const STEPS = [
	"Aircraft",
	"Financing",
	"Fixed costs",
	"Hourly costs",
	"Renting",
] as const;

export function AdvancedWizard({ state }: { state: CalculatorState }) {
	const [step, setStep] = useState(0);
	const {
		formData,
		validationErrors,
		handleChange,
		handleSelectChange,
		handleIsWetSwitchChange,
		handleFixedCostsYearlySwitchChange,
	} = state;

	const period = formData.settings?.fixedCostsYearly ? "/year" : "/month";
	const isLastStep = step === STEPS.length - 1;

	return (
		<div className="grid grid-flow-row gap-8 rounded-lg border border-black/10 bg-zinc-950/5 p-6 lg:p-8 dark:border-white/10 dark:bg-white/5">
			{/* Step indicator */}
			<ol className="flex flex-wrap items-center gap-2">
				{STEPS.map((label, index) => {
					const active = index === step;
					const done = index < step;
					return (
						<li key={label}>
							<button
								type="button"
								onClick={() => setStep(index)}
								className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
									active
										? "bg-[#FF7124] text-white"
										: done
											? "bg-[#FF7124]/15 text-[#FF7124]"
											: "bg-black/5 text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
								}`}
							>
								<span className="grid size-5 place-items-center rounded-full border border-current text-xs">
									{index + 1}
								</span>
								<span className="hidden sm:inline">{label}</span>
							</button>
						</li>
					);
				})}
			</ol>

			{/* Step 1 — Aircraft & consumption */}
			{step === 0 && (
				<div className="grid grid-flow-row gap-6">
					<SectionHeading>The aircraft</SectionHeading>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Start with the aircraft itself—what it costs to buy and what it drinks.
						Picking a type fills everything with typical numbers.
					</p>
					<div className="grid grid-flow-row gap-4 sm:grid-cols-2">
						<Field className="grid grid-flow-row gap-1.5">
							<Label>Type</Label>
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
							label="Acquisition price"
							name="costs.acquisition.price"
							value={formData.costs?.acquisition?.price}
							onChange={handleChange}
							prefix="$"
						/>
						<NumberField
							label="Fuel burn"
							name="aircraft.fuelBurn"
							value={formData.aircraft?.fuelBurn}
							onChange={handleChange}
							suffix="GPH"
						/>
						<NumberField
							label="Fuel price"
							name="factors.fuelPrice"
							value={formData.factors?.fuelPrice}
							onChange={handleChange}
							prefix="$"
							suffix="/gal"
						/>
						<NumberField
							label="Oil refill every"
							name="aircraft.oilRefill"
							value={formData.aircraft?.oilRefill}
							onChange={handleChange}
							suffix="hours"
						/>
						<NumberField
							label="Oil price"
							name="factors.oilPrice"
							value={formData.factors?.oilPrice}
							onChange={handleChange}
							prefix="$"
							suffix="/qt"
						/>
					</div>
				</div>
			)}

			{/* Step 2 — Financing & overhaul */}
			{step === 1 && (
				<div className="grid grid-flow-row gap-6">
					<SectionHeading>Financing & engine</SectionHeading>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						How you'll pay for it, and the reserve that builds up toward the next
						engine overhaul with every hour flown.
					</p>
					<div className="grid grid-flow-row gap-4 sm:grid-cols-2">
						<NumberField
							label="Down payment"
							name="costs.acquisition.downPayment"
							value={formData.costs?.acquisition?.downPayment}
							onChange={handleChange}
							prefix="$"
						/>
						<NumberField
							label="Principal (financed)"
							name="costs.acquisition.principal"
							value={formData.costs?.acquisition?.principal}
							onChange={handleChange}
							prefix="$"
							hint="Calculated: price minus down payment."
						/>
						<NumberField
							label="Loan duration"
							name="costs.acquisition.durationYears"
							value={formData.costs?.acquisition?.durationYears}
							onChange={handleChange}
							suffix="years"
						/>
						<NumberField
							label="Interest rate"
							name="costs.acquisition.interestRate"
							value={formData.costs?.acquisition?.interestRate}
							onChange={handleChange}
							suffix="%"
						/>
						<NumberField
							label="Overhaul cost"
							name="factors.engineOverhaul"
							value={formData.factors?.engineOverhaul}
							onChange={handleChange}
							prefix="$"
						/>
						<NumberField
							label="Time between overhauls"
							name="aircraft.tbo"
							value={formData.aircraft?.tbo}
							onChange={handleChange}
							suffix="hours"
						/>
						<NumberField
							label="Time since major overhaul"
							name="aircraft.tsmoh"
							value={formData.aircraft?.tsmoh}
							onChange={handleChange}
							suffix="hours"
							invalid={validationErrors.tsmoh}
							error="Time since overhaul can't exceed time between overhauls"
						/>
					</div>
				</div>
			)}

			{/* Step 3 — Fixed costs */}
			{step === 2 && (
				<div className="grid grid-flow-row gap-6">
					<SectionHeading>Fixed costs</SectionHeading>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						The bills that arrive whether or not you fly.
					</p>
					<div className="grid grid-flow-row gap-4 sm:grid-cols-2">
						<NumberField
							label="Hangar / tie-down"
							name="costs.operation.fixed.hangar"
							value={formData.costs?.operation?.fixed?.hangar}
							onChange={handleChange}
							prefix="$"
							suffix={period}
						/>
						<NumberField
							label="Insurance"
							name="costs.operation.fixed.insurance"
							value={formData.costs?.operation?.fixed?.insurance}
							onChange={handleChange}
							prefix="$"
							suffix={period}
						/>
						<NumberField
							label="Annual inspection"
							name="costs.operation.fixed.annual"
							value={formData.costs?.operation?.fixed?.annual}
							onChange={handleChange}
							prefix="$"
							suffix={period}
						/>
						<NumberField
							label="Loan installment"
							name="costs.operation.fixed.financing"
							value={formData.costs?.operation?.fixed?.financing}
							onChange={handleChange}
							prefix="$"
							suffix={period}
							hint="Calculated from your financing terms."
						/>
					</div>
					<Field className="mt-2 grid grid-flow-col items-center justify-between gap-2">
						<Label>
							{formData.settings?.fixedCostsYearly
								? "Showing yearly figures"
								: "Showing monthly figures"}
						</Label>
						<Switch
							name="settings.fixedCostsYearly"
							checked={formData.settings?.fixedCostsYearly}
							onChange={handleFixedCostsYearlySwitchChange}
						/>
					</Field>
				</div>
			)}

			{/* Step 4 — Variable costs */}
			{step === 3 && (
				<div className="grid grid-flow-row gap-6">
					<SectionHeading>Hourly costs</SectionHeading>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Costs that scale with each hour in the air. The first three are calculated
						for you—override them if you know better.
					</p>
					<div className="grid grid-flow-row gap-4 sm:grid-cols-2">
						<NumberField
							label="Fuel"
							name="costs.operation.variable.fuel"
							value={formData.costs?.operation?.variable?.fuel}
							onChange={handleChange}
							prefix="$"
							suffix="/hour"
							hint="Fuel burn × fuel price."
						/>
						<NumberField
							label="Oil"
							name="costs.operation.variable.oil"
							value={formData.costs?.operation?.variable?.oil}
							onChange={handleChange}
							prefix="$"
							suffix="/hour"
							hint="Oil price ÷ refill interval."
						/>
						<NumberField
							label="Engine overhaul reserve"
							name="costs.operation.variable.reserve.engine"
							value={formData.costs?.operation?.variable?.reserve?.engine}
							onChange={handleChange}
							prefix="$"
							suffix="/hour"
							hint="Overhaul cost ÷ hours until overhaul."
						/>
						<NumberField
							label="Maintenance reserve"
							name="costs.operation.variable.reserve.maintenance"
							value={formData.costs?.operation?.variable?.reserve?.maintenance}
							onChange={handleChange}
							prefix="$"
							suffix="/hour"
						/>
						<NumberField
							label="Upgrades reserve"
							name="costs.operation.variable.upgrades"
							value={formData.costs?.operation?.variable?.upgrades}
							onChange={handleChange}
							prefix="$"
							suffix="/hour"
						/>
						<NumberField
							label="Cosmetic reserve"
							name="costs.operation.variable.cosmetic"
							value={formData.costs?.operation?.variable?.cosmetic}
							onChange={handleChange}
							prefix="$"
							suffix="/hour"
						/>
						<NumberField
							label="Owners / partners"
							name="partners.number"
							value={formData.partners?.number}
							onChange={handleChange}
							suffix="people"
							hint="Splits the fixed costs across co-owners."
						/>
						<NumberField
							label="Hours per partner"
							name="partners.hoursPerPartner"
							value={formData.partners?.hoursPerPartner}
							onChange={handleChange}
							suffix="/year"
						/>
					</div>
				</div>
			)}

			{/* Step 5 — Renting */}
			{step === 4 && (
				<div className="grid grid-flow-row gap-6">
					<SectionHeading>Renting</SectionHeading>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Finally, what renting the same aircraft would cost you. Set your annual
						hours with the results below.
					</p>
					<div className="grid grid-flow-row gap-4 sm:grid-cols-2">
						<NumberField
							label="Hourly rate"
							name="costs.rental.hourlyRate"
							value={formData.costs?.rental?.hourlyRate}
							onChange={handleChange}
							prefix="$"
							suffix="/hour"
						/>
						<NumberField
							label="Additional yearly fees"
							name="costs.rental.fixedFees"
							value={formData.costs?.rental?.fixedFees}
							onChange={handleChange}
							prefix="$"
							suffix="/year"
							hint="Club membership, dues, etc."
						/>
					</div>
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
				</div>
			)}

			{/* Step navigation */}
			<div className="mt-2 flex items-center justify-between border-t border-black/5 pt-6 dark:border-white/5">
				<Button
					plain
					type="button"
					disabled={step === 0}
					className="cursor-pointer disabled:cursor-not-allowed"
					onClick={() => setStep((s) => Math.max(0, s - 1))}
				>
					← Back
				</Button>
				<span className="text-sm text-zinc-500 dark:text-zinc-400">
					Step {step + 1} of {STEPS.length}
				</span>
				<Button
					type="button"
					color="orange"
					className="cursor-pointer"
					onClick={() =>
						isLastStep
							? document
									.getElementById("results")
									?.scrollIntoView({ behavior: "smooth" })
							: setStep((s) => Math.min(STEPS.length - 1, s + 1))
					}
				>
					{isLastStep ? "See results →" : "Next →"}
				</Button>
			</div>
		</div>
	);
}
