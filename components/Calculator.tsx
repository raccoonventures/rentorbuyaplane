'use client';

type Errors = {
	has: (key: string) => boolean;
	get: (key: string) => any;
};

import { DetailedFormData } from '@/types';

interface CalculatorProps {
	errors?: Errors;
}

interface FormData {
	[key: string]: {
		[key: string]: string;
	};
}

import { Field as HeadlessField } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
const commaNumber = require('comma-number');

import { Button } from '@/catalyst/button';
import { ErrorMessage, Label } from '@/catalyst/fieldset';
import { Input } from '@/catalyst/input';
import { Select } from '@/catalyst/select';

import { Switch } from '@/catalyst/switch';

import Planes from '@/helpers/planes.json';

import { Badge } from '@/catalyst/badge';
import Financials from '@/utils/financials';

export function Calculator() {
	let [isOpen, setIsOpen] = useState(false);
	let [isComplete, setIsComplete] = useState(false);

	const [formData, setFormData] = useState<DetailedFormData>({
		aircraft: {
			type: 'Cessna 172',
			fuelBurn: 8,
			oilRefill: 50,
			tbo: 2000,
			tsmoh: 0,
		},
		factors: {
			fuelPrice: 8,
			oilPrice: 20,
			engineOverhaul: 30000,
		},
		costs: {
			acquisition: {
				price: 50000,
				downPayment: 10000,
				principal: 40000,
				durationYears: 10.0,
				interestRate: 8,
			},
			rental: {
				hourlyRate: 200.0,
				isWet: true,
			},
			operation: {
				fixed: {
					hangar: 300,
					insurance: 150,
					annual: 70,
					financing: 0,
				},
				variable: {
					fuel: 64,
					oil: 0.4,
					reserve: {
						engine: 15,
						maintenance: 10,
					},
					upgrades: 0,
					cosmetic: 0,
				},
			},
		},
		partners: {
			number: 1,
			hoursPerPartner: 52,
		},
		output: {
			isBuyingBest: false,
		},
	});

	// Handle Type Select
	let [selectPlaneType, setSelectPlaneType] = useState('');
	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectPlaneType(e.target.value);

		// Update the formData state for aircraft.type
		setFormData((prevData) => ({
			...prevData,
			aircraft: {
				...prevData.aircraft,
				type: e.target.value,
			},
		}));
	};

	// Handle Rentals IsWet Switch
	const handleIsWetSwitchChange = (checked: boolean) => {
		setFormData((prevData) => ({
			...prevData,
			costs: {
				...prevData.costs,
				rental: {
					...prevData?.costs?.rental,
					isWet: checked,
				},
			},
		}));
	};

	// Handle YearlyCosts Switch
	const handleFixedCostsYearlySwitchChange = (checked: boolean) => {
		setFormData((prevData) => {
			const hangar = prevData?.costs?.operation?.fixed?.hangar ?? 0;
			const insurance = prevData?.costs?.operation?.fixed?.insurance ?? 0;
			const annual = prevData?.costs?.operation?.fixed?.annual ?? 0;
			const financing = prevData?.costs?.operation?.fixed?.financing ?? 0;

			return {
				...prevData,
				costs: {
					...prevData.costs,
					operation: {
						...prevData?.costs?.operation,
						fixed: {
							...prevData?.costs?.operation?.fixed,
							hangar: checked ? hangar * 12 : hangar / 12,
							insurance: checked ? insurance * 12 : insurance / 12,
							annual: checked ? annual * 12 : annual / 12,
							financing: checked ? financing * 12 : financing / 12,
						},
					},
				},
				settings: {
					...prevData.settings,
					fixedCostsYearly: checked,
				},
			};
		});
	};

	// Handle any changes in the form
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value: rawValue } = e.target;
		const keys = name.split('.');
		// Parse value as an integer if name is 'output.estimatedHours'
		const value =
			name === 'output.estimatedHours' ? parseInt(rawValue, 10) : rawValue;
		// Updaten FormData
		setFormData((prevData) => {
			// A recursive function to handle deep updates
			const updateNestedData = (
				data: any,
				keysArray: string[],
				value: any,
			): any => {
				const key = keysArray[0];
				// If we're at the last key, update the value
				if (keysArray.length === 1) {
					return { ...data, [key]: value };
				}
				// Otherwise, continue updating deeper in the object
				return {
					...data,
					[key]: updateNestedData(data[key] || {}, keysArray.slice(1), value),
				};
			};

			// Create a new form data object with the updated values
			return updateNestedData(prevData, keys, value);
		});
	};

	useEffect(() => {
		// Logic for calculating fuel cost
		const fuelBurn = formData.aircraft?.fuelBurn ?? 0;
		const fuelPrice = formData.factors?.fuelPrice ?? 0;
		if (fuelBurn && fuelPrice) {
			const fuelCost = fuelBurn * fuelPrice;
			setFormData((prevData) => ({
				...prevData,
				costs: {
					...prevData.costs,
					operation: {
						...prevData?.costs?.operation,
						variable: {
							...prevData?.costs?.operation?.variable,
							fuel: fuelCost,
						},
					},
				},
			}));
		}

		// Logic for calculating oil cost
		const oilRefill = formData.aircraft?.oilRefill ?? 0;
		const oilPrice = formData.factors?.oilPrice ?? 1;
		if (oilRefill && oilPrice) {
			const oilCost = oilPrice / oilRefill;
			setFormData((prevData) => ({
				...prevData,
				costs: {
					...prevData.costs,
					operation: {
						...prevData?.costs?.operation,
						variable: {
							...prevData?.costs?.operation?.variable,
							oil: oilCost,
						},
					},
				},
			}));
		}

		// Logic for calculating down payment and monthly payments
		const acquisitionPrice = formData.costs?.acquisition?.price ?? 0;
		const interestRate = formData.costs?.acquisition?.interestRate ?? 0;
		const durationYears = formData.costs?.acquisition?.durationYears ?? 0;

		if (acquisitionPrice) {
			const downPayment = formData?.costs?.acquisition?.downPayment
				? formData.costs.acquisition.downPayment
				: acquisitionPrice * 0.2;
			const calculatedPrincipal = acquisitionPrice - downPayment;
			const principal = calculatedPrincipal > 0 ? calculatedPrincipal : 0;
			const installments: number =
				interestRate && durationYears
					? Financials.calculateMonthlyPayment(
							principal,
							durationYears,
							interestRate,
						)
					: 0;

			setFormData((prevData) => ({
				...prevData,
				costs: {
					...prevData.costs,
					acquisition: {
						...prevData?.costs?.acquisition,
						downPayment: downPayment,
						principal: principal,
					},
					operation: {
						...prevData?.costs?.operation,
						fixed: {
							...prevData?.costs?.operation?.fixed,
							financing: installments,
						},
					},
				},
			}));
		}

		// Logic for calculating Engine Overhaul Reserve
		const overhaulCost = formData.factors?.engineOverhaul ?? 0;
		const tbo = formData?.aircraft?.tbo ?? 0;
		const tsmoh = formData?.aircraft?.tsmoh ?? 0;
		const timeToNextOverhaul = tbo - tsmoh;

		if (timeToNextOverhaul > 0) {
			const engineOverhaulReserve = overhaulCost / timeToNextOverhaul;
			setFormData((prevData) => ({
				...prevData,
				costs: {
					...prevData.costs,
					operation: {
						...prevData?.costs?.operation,
						variable: {
							...prevData?.costs?.operation?.variable,
							reserve: {
								...prevData?.costs?.operation?.variable?.reserve,
								engine: Math.ceil(engineOverhaulReserve),
							},
						},
					},
				},
			}));
		}

		const estimatedHours = formData.output?.estimatedHours ?? 0;
		const breakEven = formData.output?.breakEven ?? 0;
		if (estimatedHours > breakEven) {
			setFormData((prevData) => ({
				...prevData,
				output: {
					...prevData.output,
					isBuyingBest: true,
				},
			}));
		} else {
			setFormData((prevData) => ({
				...prevData,
				output: {
					...prevData.output,
					isBuyingBest: false,
				},
			}));
		}
	}, [
		formData.aircraft?.fuelBurn,
		formData.aircraft?.oilRefill,
		formData.aircraft?.tbo,
		formData.aircraft?.tsmoh,
		formData.factors?.engineOverhaul,
		formData.factors?.fuelPrice,
		formData.factors?.oilPrice,
		formData.costs?.acquisition?.price,
		formData.costs?.acquisition?.durationYears,
		formData.costs?.acquisition?.interestRate,
		formData.costs?.acquisition?.downPayment,
		formData.output?.breakEven,
		formData.output?.estimatedHours,
	]);

	const validationErrors = useMemo(() => {
		const errors = {
			tsmoh: false,
		};
		const tsmoh = formData?.aircraft?.tsmoh ?? 0;
		const tbo = formData?.aircraft?.tbo ?? 0;

		errors.tsmoh = tsmoh >= tbo;

		// ... include any other validation logic here

		return errors;
	}, [formData?.aircraft?.tsmoh, formData?.aircraft?.tbo]);

	// Generating the output
	const calculatedOutput = useMemo(() => {
		// Safely access nested properties with fallbacks
		const rentingPerHour =
			formData.costs?.rental?.isWet && formData.costs?.rental?.hourlyRate
				? formData.costs.rental.hourlyRate
				: (formData.costs?.rental?.hourlyRate ?? 0) +
					(formData.costs?.operation?.variable?.fuel ?? 0);

		const fixedCosts = formData.costs?.operation?.fixed ?? {};
		const variableCosts = formData.costs?.operation?.variable ?? {};
		const owningPerHour =
			(variableCosts?.fuel ?? 0) +
			(variableCosts?.oil ?? 0) +
			(variableCosts?.reserve?.engine ?? 0) +
			(variableCosts?.reserve?.maintenance ?? 0) +
			(variableCosts?.upgrades ?? 0) +
			(variableCosts?.cosmetic ?? 0);

		const owningFixedTotal = formData.settings?.fixedCostsYearly
			? (fixedCosts?.hangar ?? 0) +
				(fixedCosts?.insurance ?? 0) +
				(fixedCosts?.annual ?? 0) +
				(fixedCosts?.financing ?? 0)
			: ((fixedCosts?.hangar ?? 0) +
					(fixedCosts?.insurance ?? 0) +
					(fixedCosts?.annual ?? 0) +
					(fixedCosts?.financing ?? 0)) *
				12;

		const owningFixedPerHour =
			owningFixedTotal /
			((formData?.partners?.number ?? 1) *
				(formData?.partners?.hoursPerPartner ?? 1));

		const breakEven = Financials.findBreakEven(
			rentingPerHour,
			owningPerHour,
			owningFixedTotal,
		);

		return {
			renting: {
				...formData.output?.renting,
				perHour: Math.ceil(rentingPerHour),
			},
			owning: {
				...formData.output?.owning,
				perHour: Math.ceil(owningPerHour),
				fixed: {
					...formData.output?.owning?.fixed,
					perYear: Math.ceil(owningFixedTotal),
					perHourFlight: Math.ceil(owningFixedPerHour),
				},
			},
			breakEven: breakEven,
		};
	}, [
		formData.costs?.rental?.isWet,
		formData.costs?.rental?.hourlyRate,
		formData.costs?.operation?.fixed,
		formData.costs?.operation?.variable,
		formData.partners?.number,
		formData.partners?.hoursPerPartner,
		formData.settings?.fixedCostsYearly,
		formData?.output,
	]);

	useEffect(() => {
		// Check if the calculated values differ from the current formData output values
		const shouldUpdateBreakEven =
			formData.output?.breakEven !== calculatedOutput.breakEven;
		const shouldUpdateRenting =
			formData.output?.renting?.perHour !== calculatedOutput.renting.perHour;
		const shouldUpdateOwningPerHour =
			formData.output?.owning?.perHour !== calculatedOutput.owning.perHour;
		const shouldUpdateOwningFixedPerYear =
			formData.output?.owning?.fixed?.perYear !==
			calculatedOutput.owning.fixed.perYear;
		const shouldUpdateOwningFixedPerHourFlight =
			formData.output?.owning?.fixed?.perHourFlight !==
			calculatedOutput.owning.fixed.perHourFlight;

		if (
			shouldUpdateBreakEven ||
			shouldUpdateRenting ||
			shouldUpdateOwningPerHour ||
			shouldUpdateOwningFixedPerYear ||
			shouldUpdateOwningFixedPerHourFlight
		) {
			// Only update formData if there's an actual change in the calculated values
			setFormData((prevData) => ({
				...prevData,
				output: {
					...prevData.output,
					breakEven: calculatedOutput.breakEven,
					renting: {
						...prevData.output?.renting,
						perHour: calculatedOutput.renting.perHour,
					},
					owning: {
						...prevData?.output?.owning,
						perHour: calculatedOutput.owning.perHour,
						fixed: {
							...prevData?.output?.owning?.fixed,
							perYear: calculatedOutput.owning.fixed.perYear,
							perHourFlight: calculatedOutput.owning.fixed.perHourFlight,
						},
					},
				},
			}));
		}
	}, [calculatedOutput, formData.output, setFormData]);

	// Handle the submit
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		/* try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				// Handle success response here
				console.log('Form submitted successfully');
				setIsOpen(true);
			} else {
				// Handle error response here
				console.error('Failed to submit form');
			}
		} catch (error) {
			console.error(error);
		}*/
		console.log(formData);
	};

	return (
		<>
			{/* Calculator */}
			<section>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-flow-row items-start gap-12 pb-12 lg:grid-flow-col">
						{/* LEFT */}
						<div className="grid h-full grid-flow-row content-start items-start gap-16 rounded-lg border border-black/10 bg-zinc-950/5 p-6 hover:border-black/20 lg:p-8 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
							<div className="grid grid-flow-row gap-8">
								<h1 className="text-xl font-semibold dark:text-white">
									About the plane
								</h1>
								<div className="grid grid-flow-row gap-16">
									{/* Aircraft Details */}
									<div className="grid grid-flow-row gap-6">
										<h2 className="text-[#FF7124]">Aircraft Details</h2>
										<div className="grid grid-flow-row gap-4">
											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Type</Label>
												<Select
													name="aircraft.type"
													value={selectPlaneType}
													onChange={handleSelectChange}
												>
													{Planes.map((plane, index) => (
														<option key={index} value={plane}>
															{plane}
														</option>
													))}
												</Select>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Acquisition Price</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.acquisition.price"
														value={50000}
														onChange={handleChange}
													/>
												</div>
											</HeadlessField>
										</div>
									</div>
									{/* Consumption Details */}
									<div className="grid grid-flow-row gap-6">
										<h2 className="text-[#FF7124]">Consumption Details</h2>
										<div className="grid grid-flow-row gap-4">
											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Fuel Burn</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															GPH
														</span>
													</div>
													<Input
														type="number"
														name="aircraft.fuelBurn"
														onChange={handleChange}
														value={formData?.aircraft?.fuelBurn}
													/>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Fuel Price</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="factors.fuelPrice"
														onChange={handleChange}
														value={formData?.factors?.fuelPrice}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/gal
														</span>
													</div>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Oil refill every</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															hours
														</span>
													</div>
													<Input
														type="number"
														name="aircraft.oilRefill"
														onChange={handleChange}
														value={formData?.aircraft?.oilRefill}
													/>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Oil Price</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="factors.oilPrice"
														onChange={handleChange}
														value={formData?.factors?.oilPrice}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/qt
														</span>
													</div>
												</div>
											</HeadlessField>
										</div>
									</div>
								</div>
							</div>
							<div className="grid grid-flow-row gap-8">
								<h1 className="text-xl font-semibold dark:text-white">
									About the owner
									{(formData?.partners?.number ?? 0) > 1 ? 's' : ''}
								</h1>
								{/* Partnership Details */}

								<div className="grid grid-flow-row gap-4">
									<HeadlessField className="grid grid-flow-row gap-2">
										<Label>Number of Partners</Label>
										<div className="relative">
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
												<span className="text-zinc-500 sm:text-sm">
													Partner
													{(formData?.partners?.number ?? 0) > 1 ? 's' : ''}
												</span>
											</div>
											<Input
												type="number"
												name="partners.number"
												value={formData.partners?.number}
												onChange={handleChange}
											/>
										</div>
									</HeadlessField>

									<HeadlessField className="grid grid-flow-row gap-2">
										<Label>Hours Per Partner</Label>
										<div className="relative">
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
												<span className="text-zinc-500 sm:text-sm">/year</span>
											</div>
											<Input
												type="number"
												name="partners.hoursPerPartner"
												onChange={handleChange}
												value={formData.partners?.hoursPerPartner}
											/>
										</div>
									</HeadlessField>
								</div>
							</div>
						</div>

						{/* RIGHT */}
						<div className="grid grid-flow-row gap-12">
							{/* OWNERSHIP COSTS */}
							<div className="grid grid-flow-row items-start gap-8  rounded-lg border border-black/10 bg-zinc-950/5 p-6 hover:border-black/20 lg:p-8 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
								<h1 className="text-xl font-semibold dark:text-white">
									Ownership Costs
								</h1>
								<div className="grid grid-flow-row content-start items-start  gap-24 lg:grid-flow-col">
									<div className="grid grid-flow-row gap-16">
										{/* Financing Details */}
										<div className="grid grid-flow-row gap-6">
											<h2 className="text-[#FF7124]">Financing Details</h2>
											<div className="grid grid-flow-row gap-4">
												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Down Payment</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-zinc-500 sm:text-sm">
																$
															</span>
														</div>
														<Input
															type="number"
															name="costs.acquisition.downPayment"
															onChange={handleChange}
															value={formData?.costs?.acquisition?.downPayment}
														/>
													</div>
												</HeadlessField>

												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Principal</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-zinc-500 sm:text-sm">
																$
															</span>
														</div>
														<Input
															type="number"
															name="costs.acquisition.principal"
															onChange={handleChange}
															value={formData?.costs?.acquisition?.principal}
														/>
													</div>
												</HeadlessField>

												<div className="grid max-w-64 grid-flow-col items-baseline gap-2 lg:max-w-none">
													<HeadlessField className="grid grid-flow-row gap-2">
														<Label>Duration (Years)</Label>
														<Input
															type="number"
															name="costs.acquisition.durationYears"
															value={
																formData?.costs?.acquisition?.durationYears
															}
															className="max-w-28"
															onChange={handleChange}
														/>
													</HeadlessField>

													<span className="px-0.5 text-zinc-500 sm:text-sm">
														@
													</span>

													<HeadlessField className="grid grid-flow-row gap-2">
														<Label className="text-right">Interest Rate</Label>
														<div className="relative">
															<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-14">
																<span className="text-zinc-500 sm:text-sm">
																	%
																</span>
															</div>
															<Input
																type="number"
																name="costs.acquisition.interestRate"
																onChange={handleChange}
																className="max-w-28"
																value={
																	formData?.costs?.acquisition?.interestRate
																}
															/>
														</div>
													</HeadlessField>
												</div>
											</div>
										</div>
										{/* Overhaul */}
										<div className="grid grid-flow-row gap-6">
											<h2 className="text-[#FF7124]">Engine Overhaul</h2>
											<div className="grid grid-flow-row gap-4">
												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Overhaul Cost</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-zinc-500 sm:text-sm">
																$
															</span>
														</div>
														<Input
															type="number"
															name="factors.engineOverhaul"
															onChange={handleChange}
															value={formData?.factors?.engineOverhaul}
														/>
													</div>
												</HeadlessField>

												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Time Before Overhaul</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
															<span className="text-zinc-500 sm:text-sm">
																Hours
															</span>
														</div>
														<Input
															type="number"
															name="aircraft.tbo"
															onChange={handleChange}
															value={formData?.aircraft?.tbo}
														/>
													</div>
												</HeadlessField>

												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Time Since Major Overhaul</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
															<span className="text-zinc-500 sm:text-sm">
																Hours
															</span>
														</div>
														<Input
															type="number"
															name="aircraft.tsmoh"
															onChange={handleChange}
															value={formData?.aircraft?.tsmoh}
															invalid={validationErrors?.tsmoh}
														/>
													</div>
													{validationErrors.tsmoh && (
														<ErrorMessage>
															TSMOH cannot be greater than TBO
														</ErrorMessage>
													)}
												</HeadlessField>
											</div>
										</div>
									</div>
									<div className="grid grid-flow-row gap-16">
										{/* Fixed Operation Costs */}
										<div className="grid grid-flow-row gap-6">
											<h2 className="text-[#FF7124]">Fixed Operation Costs</h2>
											<div className="grid grid-flow-row gap-4">
												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Hangar</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-zinc-500 sm:text-sm">
																$
															</span>
														</div>
														<Input
															type="number"
															name="costs.operation.fixed.hangar"
															onChange={handleChange}
															value={formData?.costs?.operation?.fixed?.hangar}
														/>
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
															<span className="text-zinc-500 sm:text-sm">
																{formData?.settings?.fixedCostsYearly
																	? '/year'
																	: '/month'}
															</span>
														</div>
													</div>
												</HeadlessField>

												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Insurance</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-zinc-500 sm:text-sm">
																$
															</span>
														</div>
														<Input
															type="number"
															name="costs.operation.fixed.insurance"
															onChange={handleChange}
															value={
																formData?.costs?.operation?.fixed?.insurance
															}
														/>
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
															<span className="text-zinc-500 sm:text-sm">
																{formData?.settings?.fixedCostsYearly
																	? '/year'
																	: '/month'}
															</span>
														</div>
													</div>
												</HeadlessField>

												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Annual Inspection</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-zinc-500 sm:text-sm">
																$
															</span>
														</div>
														<Input
															type="number"
															name="costs.operation.fixed.annual"
															onChange={handleChange}
															value={formData?.costs?.operation?.fixed?.annual}
														/>
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
															<span className="text-zinc-500 sm:text-sm">
																{formData?.settings?.fixedCostsYearly
																	? '/year'
																	: '/month'}
															</span>
														</div>
													</div>
												</HeadlessField>

												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Installments</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
															<span className="text-zinc-500 sm:text-sm">
																$
															</span>
														</div>
														<Input
															type="number"
															name="costs.operation.fixed.financing"
															onChange={handleChange}
															value={
																formData?.costs?.operation?.fixed?.financing
															}
														/>
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
															<span className="text-zinc-500 sm:text-sm">
																{formData?.settings?.fixedCostsYearly
																	? '/year'
																	: '/month'}
															</span>
														</div>
													</div>
												</HeadlessField>

												<HeadlessField className="mt-4 grid grid-flow-col justify-between gap-2">
													<Label>Use Yearly intervals</Label>
													<Switch
														name="settings.fixedCostsYearly"
														onChange={handleFixedCostsYearlySwitchChange}
													/>
												</HeadlessField>
											</div>
										</div>
									</div>

									{/* Variable Operation Costs */}
									<div className="grid grid-flow-row gap-6">
										<h2 className="text-[#FF7124]">Variable Operation Costs</h2>
										<div className="grid grid-flow-row gap-4">
											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Fuel</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.variable.fuel"
														value={formData?.costs?.operation?.variable?.fuel}
														onChange={handleChange}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/hour
														</span>
													</div>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Oil</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.variable.oil"
														onChange={handleChange}
														value={formData?.costs?.operation?.variable?.oil}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/hour
														</span>
													</div>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Engine Overhaul Reserve</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.variable.reserve.engine"
														onChange={handleChange}
														value={
															formData?.costs?.operation?.variable?.reserve
																?.engine
														}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/hour
														</span>
													</div>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Maintenance Reserve</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.variable.reserve.maintenance"
														onChange={handleChange}
														value={
															formData?.costs?.operation?.variable?.reserve
																?.maintenance
														}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/hour
														</span>
													</div>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Upgrades</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.variable.upgrades"
														onChange={handleChange}
														value={
															formData?.costs?.operation?.variable?.upgrades
														}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/hour
														</span>
													</div>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Cosmetic</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-zinc-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.variable.cosmetic"
														onChange={handleChange}
														value={
															formData?.costs?.operation?.variable?.cosmetic
														}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-zinc-500 sm:text-sm">
															/hour
														</span>
													</div>
												</div>
											</HeadlessField>
										</div>
									</div>
								</div>
							</div>

							{/* RENTAL COSTS */}
							<div className="rounded-lg border border-black/10 bg-zinc-950/5 p-6 hover:border-black/20 lg:p-8 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
								<div className="grid grid-flow-row gap-8">
									<h1 className="text-xl font-semibold dark:text-white">
										Rental Costs
									</h1>
									<div className="grid grid-flow-row gap-4">
										<HeadlessField className="grid grid-flow-row gap-2">
											<Label>Hourly Rate</Label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-zinc-500 sm:text-sm">$</span>
												</div>
												<Input
													type="number"
													name="costs.rental.hourlyRate"
													onChange={handleChange}
													value={formData?.costs?.rental?.hourlyRate}
												/>
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
													<span className="text-zinc-500 sm:text-sm">
														/hour
													</span>
												</div>
											</div>
										</HeadlessField>

										<HeadlessField className="grid grid-flow-col justify-between gap-2">
											<Label>Is fuel included?</Label>
											<Switch
												name="costs.rental.isWet"
												defaultChecked
												onChange={handleIsWetSwitchChange}
											/>
										</HeadlessField>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* CTA */}

					<div className="mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:justify-between lg:px-8">
						<h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
							Get a copy of these results
							<br />
							Download now for free
						</h2>
						<div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
							<Button color="green" type="submit">
								Submit
							</Button>
							<a
								href="#"
								className="text-sm font-semibold leading-6 text-zinc-950 dark:text-zinc-50"
							>
								Learn more <span aria-hidden="true">→</span>
							</a>
						</div>
					</div>
				</form>
			</section>

			{/* Output Results */}
			<section className="grid grid-flow-row items-center justify-center">
				<div className="grid grid-flow-row items-center justify-center py-16">
					<h2 className="pb-6 text-center text-lg font-bold text-zinc-950 dark:text-zinc-50">
						{' '}
						{formData.output?.estimatedHours == undefined
							? 'How many hours do you plan on flying per year?'
							: `You plan on flying ${formData.output.estimatedHours == 200 ? `at least ${formData.output.estimatedHours}` : formData.output.estimatedHours} hours per year`}{' '}
					</h2>
					<div className="grid grid-flow-col items-center gap-2">
						<span className="w-10 text-right text-zinc-600 dark:text-zinc-200">
							0
						</span>
						<input
							name="output.estimatedHours"
							type="range"
							min={0}
							max={200}
							onChange={handleChange}
							className="w-[40dvw]"
						/>
						<span className="w-10 text-left text-zinc-600 dark:text-zinc-200">
							200+
						</span>
					</div>
				</div>

				<div className="grid grid-flow-row items-center justify-center gap-4 md:grid-flow-col lg:gap-12">
					{/* Renting */}
					<div
						className={`h-full w-full rounded-lg  border md:min-w-96 lg:p-8 ${!formData.output?.isBuyingBest ? 'scale-110 border-emerald-500 bg-emerald-800/10 p-6 hover:border-emerald-950 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:hover:border-emerald-400' : 'border-black/10 bg-zinc-950/5 p-6 hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'} `}
					>
						<div className="grid grid-flow-row gap-8">
							<div className="flex items-center gap-2">
								<h1 className="text-xl font-semibold dark:text-white">
									Rent a plane
								</h1>
								{!formData.output?.isBuyingBest && (
									<Badge className="mt-0.5 uppercase" color="lime">
										best option
									</Badge>
								)}
							</div>
							<div className="grid min-h-48 grid-flow-row content-start gap-4">
								<div className="flex items-baseline gap-x-2  text-zinc-200">
									<span>
										<span className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl dark:text-white ">
											${commaNumber(formData?.output?.renting?.perHour)}
										</span>
										<span className="text-sm text-zinc-800 dark:text-zinc-400">
											/hour
										</span>
									</span>
									<dt className="group relative grid grid-flow-col items-center text-zinc-600 dark:text-zinc-200">
										<span className="cursor-help">of renting</span>
										<span className="absolute -right-2 top-8 z-[999] w-max max-w-48 scale-0 rounded bg-zinc-700 px-3 py-2 text-center text-xs font-normal text-white shadow-xl group-hover:scale-100">
											The hourly rate for renting the plane
										</span>
									</dt>
								</div>
							</div>
						</div>
					</div>
					{/* or */}
					<div className="hidden h-10 w-10 items-center justify-center lg:grid">
						<span className="text-2xl font-bold uppercase italic text-white/50">
							or
						</span>
					</div>
					{/* Owning */}

					<div
						className={`h-full w-full rounded-lg  border md:min-w-96 lg:p-8 ${formData.output?.isBuyingBest ? 'scale-110 border-emerald-500 bg-emerald-800/10 p-6 hover:border-emerald-950 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:hover:border-emerald-400' : 'border-black/10 bg-zinc-950/5 p-6 hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'} `}
					>
						<div className="grid grid-flow-row gap-8">
							<div className="flex items-center gap-2">
								<h1 className="text-xl font-semibold dark:text-white">
									Buy a plane
								</h1>
								{formData.output?.isBuyingBest && (
									<Badge className="mt-0.5 uppercase" color="lime">
										best option
									</Badge>
								)}
							</div>
							<div className="grid min-h-48 grid-flow-row content-start gap-4">
								<div className="flex flex-col items-baseline  gap-x-2 text-zinc-200 md:flex-row">
									<span>
										<span className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl dark:text-white">
											${commaNumber(formData?.output?.owning?.perHour)}
										</span>
										<span className="text-sm text-zinc-800 dark:text-zinc-400">
											/hour
										</span>
									</span>
									<dt className="group relative grid grid-flow-col items-center text-zinc-600 dark:text-zinc-200">
										<span className="cursor-help">
											of variable operation costs
										</span>
										<span className="absolute -right-2 top-8 z-[999] w-max max-w-48 scale-0 rounded bg-zinc-700 px-3 py-2 text-center text-xs font-normal text-white shadow-xl group-hover:scale-100">
											The hourly costs for fuel, oil, and reserve funds for
											overhaul and maintenance
										</span>
									</dt>
								</div>
								<span className="text-4xl font-bold text-zinc-800 dark:text-zinc-400">
									+
								</span>
								<div className="flex flex-col items-baseline gap-x-2 text-zinc-200  md:flex-row">
									<span>
										<span className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl dark:text-white">
											${commaNumber(formData?.output?.owning?.fixed?.perYear)}
										</span>
										<span className="text-sm text-zinc-800 dark:text-zinc-400">
											/year
										</span>
									</span>
									<dt className="group relative grid grid-flow-col items-center text-zinc-600 dark:text-zinc-200">
										<span className="cursor-help">of fixed costs</span>
										<span className="absolute -right-2 top-8 z-[999] w-max max-w-48 scale-0 rounded bg-zinc-700 px-3 py-2 text-center text-xs font-normal text-white shadow-xl group-hover:scale-100">
											The yearly total for insurance, annual inspection,
											financing, and hangaring
										</span>
									</dt>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
