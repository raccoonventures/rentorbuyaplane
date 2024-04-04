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

import {
	Alert,
	AlertActions,
	AlertDescription,
	AlertTitle,
} from '@/catalyst/alert';
import { Button } from '@/catalyst/button';
import { ErrorMessage, Label } from '@/catalyst/fieldset';
import { Input } from '@/catalyst/input';
import { Select } from '@/catalyst/select';

import { Switch } from '@/catalyst/switch';

import Planes from '@/helpers/planes.json';

import Financials from '@/utils/financials';

export function Calculator({
	errors = { has: () => false, get: () => null },
}: CalculatorProps) {
	let [isOpen, setIsOpen] = useState(false);
	let [isComplete, setIsComplete] = useState(false);

	const [formData, setFormData] = useState<DetailedFormData>({
		aircraft: {
			type: 'Cessna 172',
			fuelBurn: 8,
			tbo: 2000,
			tsmoh: 0,
		},
		factors: {
			fuelPrice: 8,
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
					oil: 5,
					reserve: {
						engine: 15,
						maintenance: 25,
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
	});

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
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const keys = name.split('.');
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
	}, [
		formData.aircraft?.fuelBurn,
		formData.aircraft?.tbo,
		formData.aircraft?.tsmoh,
		formData.factors?.engineOverhaul,
		formData.factors?.fuelPrice,
		formData.costs?.acquisition?.price,
		formData.costs?.acquisition?.durationYears,
		formData.costs?.acquisition?.interestRate,
		formData.costs?.acquisition?.downPayment,
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
			<form onSubmit={handleSubmit}>
				<div className="grid grid-flow-col items-start gap-24 pb-12">
					{/* LEFT */}
					<div className="grid h-full grid-flow-row content-start items-start gap-8 rounded-lg border border-white/10 bg-white/5 p-8 hover:border-white/20">
						<h1 className="text-xl text-white">Start here</h1>
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
												<span className="text-gray-500 sm:text-sm">$</span>
											</div>
											<Input
												type="number"
												name="costs.acquisition.price"
												defaultValue={50000}
												onChange={handleChange}
											/>
										</div>
									</HeadlessField>

									<HeadlessField className="grid grid-flow-row gap-2">
										<Label>Fuel Burn</Label>
										<div className="relative">
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
												<span className="text-gray-500 sm:text-sm">GPH</span>
											</div>
											<Input
												type="number"
												name="aircraft.fuelBurn"
												onChange={handleChange}
												value={formData?.aircraft?.fuelBurn}
												defaultValue={8}
											/>
										</div>
									</HeadlessField>

									<HeadlessField className="grid grid-flow-row gap-2">
										<Label>Fuel Price</Label>
										<div className="relative">
											<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
												<span className="text-gray-500 sm:text-sm">$</span>
											</div>
											<Input
												type="number"
												name="factors.fuelPrice"
												onChange={handleChange}
												defaultValue={formData?.factors?.fuelPrice}
											/>
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
												<span className="text-gray-500 sm:text-sm">/Gal</span>
											</div>
										</div>
									</HeadlessField>
								</div>
							</div>
							{/* Partnership Details */}
							<div className="grid grid-flow-row gap-6">
								<h2 className="text-[#FF7124]">Partnership Details</h2>
								<div className="grid grid-flow-row gap-4">
									<HeadlessField className="grid grid-flow-row gap-2">
										<Label>Number of Partners</Label>
										<div className="relative">
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
												<span className="text-gray-500 sm:text-sm">
													Partners
												</span>
											</div>
											<Input
												type="number"
												name="partners.number"
												defaultValue={formData.partners?.number}
												onChange={handleChange}
											/>
										</div>
									</HeadlessField>

									<HeadlessField className="grid grid-flow-row gap-2">
										<Label>Hours Per Partner</Label>
										<div className="relative">
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
												<span className="text-gray-500 sm:text-sm">/year</span>
											</div>
											<Input
												type="number"
												name="partners.hoursPerPartner"
												onChange={handleChange}
												defaultValue={formData.partners?.hoursPerPartner}
											/>
										</div>
									</HeadlessField>
								</div>
							</div>
						</div>
					</div>

					{/* RIGHT */}
					<div className="grid grid-flow-row gap-12">
						{/* OWNERSHIP COSTS */}
						<div className="grid grid-flow-row items-start gap-8  rounded-lg border border-white/10 bg-white/5 p-8 hover:border-white/20">
							<h1 className="text-xl text-white">Ownership Costs</h1>
							<div className="grid grid-flow-col content-start  items-start gap-24">
								<div className="grid grid-flow-row gap-16">
									{/* Financing Details */}
									<div className="grid grid-flow-row gap-6">
										<h2 className="text-[#FF7124]">Financing Details</h2>
										<div className="grid grid-flow-row gap-4">
											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Down Payment</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<span className="text-gray-500 sm:text-sm">$</span>
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
														<span className="text-gray-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.acquisition.principal"
														onChange={handleChange}
														value={formData?.costs?.acquisition?.principal}
													/>
												</div>
											</HeadlessField>

											<div className="grid grid-flow-col items-baseline gap-2">
												<HeadlessField className="grid grid-flow-row gap-2">
													<Label>Duration (Years)</Label>
													<Input
														type="number"
														name="costs.acquisition.durationYears"
														defaultValue={
															formData?.costs?.acquisition?.durationYears
														}
														className="max-w-28"
														onChange={handleChange}
													/>
												</HeadlessField>

												<span className="px-0.5 text-gray-500 sm:text-sm">
													@
												</span>

												<HeadlessField className="grid grid-flow-row gap-2">
													<Label className="text-right">Interest Rate</Label>
													<div className="relative">
														<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-10">
															<span className="text-gray-500 sm:text-sm">
																%
															</span>
														</div>
														<Input
															type="number"
															name="costs.acquisition.interestRate"
															onChange={handleChange}
															className="max-w-28"
															defaultValue={
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
														<span className="text-gray-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="factors.engineOverhaul"
														onChange={handleChange}
														defaultValue={formData?.factors?.engineOverhaul}
													/>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Time Before Overhaul</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-gray-500 sm:text-sm">
															Hours
														</span>
													</div>
													<Input
														type="number"
														name="aircraft.tbo"
														onChange={handleChange}
														defaultValue={formData?.aircraft?.tbo}
													/>
												</div>
											</HeadlessField>

											<HeadlessField className="grid grid-flow-row gap-2">
												<Label>Time Since Major Overhaul</Label>
												<div className="relative">
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-gray-500 sm:text-sm">
															Hours
														</span>
													</div>
													<Input
														type="number"
														name="aircraft.tsmoh"
														onChange={handleChange}
														defaultValue={formData?.aircraft?.tsmoh}
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
														<span className="text-gray-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.fixed.hangar"
														onChange={handleChange}
														defaultValue={
															formData?.costs?.operation?.fixed?.hangar
														}
														value={formData?.costs?.operation?.fixed?.hangar}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-gray-500 sm:text-sm">
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
														<span className="text-gray-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.fixed.insurance"
														onChange={handleChange}
														defaultValue={
															formData?.costs?.operation?.fixed?.insurance
														}
														value={formData?.costs?.operation?.fixed?.insurance}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-gray-500 sm:text-sm">
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
														<span className="text-gray-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.fixed.annual"
														onChange={handleChange}
														defaultValue={
															formData?.costs?.operation?.fixed?.annual
														}
														value={formData?.costs?.operation?.fixed?.annual}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-gray-500 sm:text-sm">
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
														<span className="text-gray-500 sm:text-sm">$</span>
													</div>
													<Input
														type="number"
														name="costs.operation.fixed.financing"
														onChange={handleChange}
														value={formData?.costs?.operation?.fixed?.financing}
													/>
													<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
														<span className="text-gray-500 sm:text-sm">
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
													<span className="text-gray-500 sm:text-sm">$</span>
												</div>
												<Input
													type="number"
													name="costs.operation.variable.fuel"
													value={formData?.costs?.operation?.variable?.fuel}
													onChange={handleChange}
												/>
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
													<span className="text-gray-500 sm:text-sm">
														/hour
													</span>
												</div>
											</div>
										</HeadlessField>

										<HeadlessField className="grid grid-flow-row gap-2">
											<Label>Oil</Label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-gray-500 sm:text-sm">$</span>
												</div>
												<Input
													type="number"
													name="costs.operation.variable.oil"
													onChange={handleChange}
													defaultValue={
														formData?.costs?.operation?.variable?.oil
													}
												/>
											</div>
										</HeadlessField>

										<HeadlessField className="grid grid-flow-row gap-2">
											<Label>Engine Overhaul Reserve</Label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-gray-500 sm:text-sm">$</span>
												</div>
												<Input
													type="number"
													name="costs.operation.variable.reserve.engine"
													onChange={handleChange}
													defaultValue={
														formData?.costs?.operation?.variable?.reserve
															?.engine
													}
												/>
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
													<span className="text-gray-500 sm:text-sm">
														/hour
													</span>
												</div>
											</div>
										</HeadlessField>

										<HeadlessField className="grid grid-flow-row gap-2">
											<Label>Maintenance Reserve</Label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-gray-500 sm:text-sm">$</span>
												</div>
												<Input
													type="number"
													name="costs.operation.variable.reserve.maintenance"
													onChange={handleChange}
													defaultValue={
														formData?.costs?.operation?.variable?.reserve
															?.maintenance
													}
												/>
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
													<span className="text-gray-500 sm:text-sm">
														/hour
													</span>
												</div>
											</div>
										</HeadlessField>

										<HeadlessField className="grid grid-flow-row gap-2">
											<Label>Upgrades</Label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-gray-500 sm:text-sm">$</span>
												</div>
												<Input
													type="number"
													name="costs.operation.variable.upgrades"
													onChange={handleChange}
													defaultValue={
														formData?.costs?.operation?.variable?.upgrades
													}
												/>
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
													<span className="text-gray-500 sm:text-sm">
														/hour
													</span>
												</div>
											</div>
										</HeadlessField>

										<HeadlessField className="grid grid-flow-row gap-2">
											<Label>Cosmetic</Label>
											<div className="relative">
												<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
													<span className="text-gray-500 sm:text-sm">$</span>
												</div>
												<Input
													type="number"
													name="costs.operation.variable.cosmetic"
													onChange={handleChange}
													defaultValue={
														formData?.costs?.operation?.variable?.cosmetic
													}
												/>
												<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
													<span className="text-gray-500 sm:text-sm">
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
						<div className="rounded-lg border border-white/10 bg-white/5 p-8 hover:border-white/20">
							<div className="grid grid-flow-row gap-8">
								<h1 className="text-xl text-white">Rental Costs</h1>
								<div className="grid grid-flow-row gap-4">
									<HeadlessField className="grid grid-flow-row gap-2">
										<Label>Hourly Rate</Label>
										<div className="relative">
											<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
												<span className="text-gray-500 sm:text-sm">$</span>
											</div>
											<Input
												type="number"
												name="costs.rental.hourlyRate"
												onChange={handleChange}
												defaultValue={formData?.costs?.rental?.hourlyRate}
											/>
											<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-12">
												<span className="text-gray-500 sm:text-sm">/hour</span>
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

				{/* Sticky bar */}
				<div className="grid h-20 w-full items-center justify-center bg-green-200">
					<div className="max-w-min">
						<Button color="green" type="submit">
							Submit
						</Button>
					</div>
				</div>
			</form>

			<Alert open={isOpen} onClose={setIsOpen}>
				<AlertTitle>We got your message</AlertTitle>
				<AlertDescription>We&apos;ll be in touch shortly</AlertDescription>
				<AlertActions>
					<Button plain onClick={() => setIsOpen(false)}>
						Close
					</Button>
				</AlertActions>
			</Alert>
		</>
	);
}
