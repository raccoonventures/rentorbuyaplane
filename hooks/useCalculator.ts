"use client";

import { useEffect, useMemo, useState } from "react";
import { type AircraftPreset, getPreset } from "@/helpers/aircraft";
import type { DetailedFormData } from "@/types";
import Financials from "@/utils/financials";

/** Build a complete form state from an aircraft preset. */
function formDataFromPreset(preset: AircraftPreset): DetailedFormData {
	const downPayment = Math.round((preset.acquisitionPrice * 0.2) / 1000) * 1000;
	return {
		aircraft: {
			type: preset.type,
			fuelBurn: preset.fuelBurn,
			oilRefill: preset.oilRefill,
			tbo: preset.tbo,
			tsmoh: 0,
		},
		factors: {
			fuelPrice: preset.fuelPrice,
			oilPrice: preset.oilPrice,
			engineOverhaul: preset.overhaulCost,
		},
		costs: {
			acquisition: {
				price: preset.acquisitionPrice,
				downPayment,
				principal: preset.acquisitionPrice - downPayment,
				durationYears: 10,
				interestRate: 8,
			},
			rental: {
				hourlyRate: preset.rentalRate,
				isWet: false,
				fixedFees: 0,
			},
			operation: {
				fixed: {
					hangar: preset.hangar,
					insurance: preset.insurance,
					annual: preset.annual,
					financing: 0,
				},
				variable: {
					fuel: Math.ceil(preset.fuelBurn * preset.fuelPrice),
					oil: preset.oilPrice / preset.oilRefill,
					reserve: {
						engine: Math.ceil(preset.overhaulCost / preset.tbo),
						maintenance: preset.maintenanceReserve,
					},
					upgrades: 0,
					cosmetic: 0,
				},
			},
		},
		partners: { number: 1, hoursPerPartner: 52 },
		settings: { fixedCostsYearly: false },
	};
}

const INITIAL_TYPE = "Cessna 172";

/** Upper bound for the annual-hours input. */
export const MAX_HOURS = 500;

export function useCalculator() {
	const [formData, setFormData] = useState<DetailedFormData>(() =>
		formDataFromPreset(getPreset(INITIAL_TYPE)),
	);
	const [estimatedHours, setEstimatedHours] = useState<number>(50);

	const preset = useMemo(
		() => getPreset(formData.aircraft?.type),
		[formData.aircraft?.type],
	);

	// Apply a new aircraft preset (keeps the user's estimated hours).
	const applyPreset = (type: string) => {
		setFormData(formDataFromPreset(getPreset(type)));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		applyPreset(e.target.value);
	};

	const handleIsWetSwitchChange = (checked: boolean) => {
		setFormData((prev) => ({
			...prev,
			costs: {
				...prev.costs,
				rental: { ...prev?.costs?.rental, isWet: checked },
			},
		}));
	};

	const handleFixedCostsYearlySwitchChange = (checked: boolean) => {
		setFormData((prev) => {
			const fixed = prev?.costs?.operation?.fixed ?? {};
			const factor = checked ? 12 : 1 / 12;
			return {
				...prev,
				costs: {
					...prev.costs,
					operation: {
						...prev?.costs?.operation,
						fixed: {
							...fixed,
							hangar: (fixed.hangar ?? 0) * factor,
							insurance: (fixed.insurance ?? 0) * factor,
							annual: (fixed.annual ?? 0) * factor,
							financing: (fixed.financing ?? 0) * factor,
						},
					},
				},
				settings: { ...prev.settings, fixedCostsYearly: checked },
			};
		});
	};

	// Generic deep-update by dot-notation field name (e.g. "costs.acquisition.price").
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value: rawValue } = e.target;
		const keys = name.split(".");
		const value = rawValue === "" ? 0 : Number(rawValue);

		setFormData((prev) => {
			// biome-ignore lint/suspicious/noExplicitAny: arbitrary-depth nested update
			const updateNested = (data: any, path: string[], val: any): any => {
				const [key, ...rest] = path;
				if (rest.length === 0) return { ...data, [key]: val };
				return { ...data, [key]: updateNested(data?.[key] ?? {}, rest, val) };
			};
			return updateNested(prev, keys, value);
		});
	};

	const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const clamped = Math.min(MAX_HOURS, Math.max(0, Number(e.target.value) || 0));
		setEstimatedHours(clamped);
	};

	const stepHours = (delta: number) => {
		setEstimatedHours((h) => Math.min(MAX_HOURS, Math.max(0, h + delta)));
	};

	// Recompute the derived (but user-overridable) cost fields whenever their
	// upstream inputs change. Mirrors the original calculator behaviour but in a
	// single consolidated effect.
	// biome-ignore lint/correctness/useExhaustiveDependencies: deps are scoped to the upstream inputs on purpose; depending on the whole formData would loop since the effect calls setFormData
	useEffect(() => {
		setFormData((prev) => {
			const fuelBurn = prev.aircraft?.fuelBurn ?? 0;
			const fuelPrice = prev.factors?.fuelPrice ?? 0;
			const oilRefill = prev.aircraft?.oilRefill ?? 0;
			const oilPrice = prev.factors?.oilPrice ?? 0;
			const price = prev.costs?.acquisition?.price ?? 0;
			const downPayment = prev.costs?.acquisition?.downPayment ?? 0;
			const interestRate = prev.costs?.acquisition?.interestRate ?? 0;
			const durationYears = prev.costs?.acquisition?.durationYears ?? 0;
			const overhaulCost = prev.factors?.engineOverhaul ?? 0;
			const tbo = prev.aircraft?.tbo ?? 0;
			const tsmoh = prev.aircraft?.tsmoh ?? 0;
			const yearly = prev.settings?.fixedCostsYearly;

			const principal = Math.max(price - downPayment, 0);
			const installmentsMonthly =
				interestRate && durationYears
					? Financials.calculateMonthlyPayment(
							principal,
							durationYears,
							interestRate,
						)
					: 0;
			const financing = yearly ? installmentsMonthly * 12 : installmentsMonthly;

			const fuel =
				fuelBurn && fuelPrice
					? fuelBurn * fuelPrice
					: (prev.costs?.operation?.variable?.fuel ?? 0);
			const oil =
				oilRefill && oilPrice
					? oilPrice / oilRefill
					: (prev.costs?.operation?.variable?.oil ?? 0);
			const timeToOverhaul = tbo - tsmoh;
			const engine =
				timeToOverhaul > 0
					? Math.ceil(overhaulCost / timeToOverhaul)
					: (prev.costs?.operation?.variable?.reserve?.engine ?? 0);

			return {
				...prev,
				costs: {
					...prev.costs,
					acquisition: {
						...prev.costs?.acquisition,
						principal,
					},
					operation: {
						...prev.costs?.operation,
						fixed: { ...prev.costs?.operation?.fixed, financing },
						variable: {
							...prev.costs?.operation?.variable,
							fuel,
							oil,
							reserve: {
								...prev.costs?.operation?.variable?.reserve,
								engine,
							},
						},
					},
				},
			};
		});
	}, [
		formData.aircraft?.fuelBurn,
		formData.aircraft?.oilRefill,
		formData.aircraft?.tbo,
		formData.aircraft?.tsmoh,
		formData.factors?.engineOverhaul,
		formData.factors?.fuelPrice,
		formData.factors?.oilPrice,
		formData.costs?.acquisition?.price,
		formData.costs?.acquisition?.downPayment,
		formData.costs?.acquisition?.durationYears,
		formData.costs?.acquisition?.interestRate,
		formData.settings?.fixedCostsYearly,
	]);

	const validationErrors = useMemo(() => {
		const tsmoh = formData?.aircraft?.tsmoh ?? 0;
		const tbo = formData?.aircraft?.tbo ?? 0;
		return { tsmoh: tsmoh >= tbo };
	}, [formData?.aircraft?.tsmoh, formData?.aircraft?.tbo]);

	const output = useMemo(
		() => Financials.computeOutput(formData, estimatedHours),
		[formData, estimatedHours],
	);

	return {
		formData,
		estimatedHours,
		preset,
		output,
		validationErrors,
		handleChange,
		handleSelectChange,
		handleHoursChange,
		stepHours,
		handleIsWetSwitchChange,
		handleFixedCostsYearlySwitchChange,
		applyPreset,
	};
}

export type CalculatorState = ReturnType<typeof useCalculator>;
