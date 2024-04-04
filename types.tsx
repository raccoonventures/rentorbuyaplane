export interface AircraftData {
	make?: string;
	type?: string;
	fuelBurn?: number;
	oilRefill?: number;
	tbo?: number;
	tsmoh?: number;
}

export interface FactorData {
	fuelPrice?: number;
	oilPrice?: number;
	engineOverhaul?: number;
}

export interface AcquisitionData {
	price?: number;
	downPayment?: number;
	principal?: number;
	durationYears?: number;
	interestRate?: number;
}

export interface RentalData {
	hourlyRate?: number;
	isWet?: boolean;
}

export interface FixedOperationData {
	hangar?: number;
	insurance?: number;
	annual?: number;
	financing?: number;
}

export interface ReserveData {
	engine?: number;
	maintenance?: number;
}

export interface VariableOperationData {
	fuel?: number;
	oil?: number;
	reserve?: ReserveData;
	upgrades?: number;
	cosmetic?: number;
}

export interface OperationData {
	fixed?: FixedOperationData;
	variable?: VariableOperationData;
}

export interface PartnerData {
	number?: number;
	hoursPerPartner?: number;
}

export interface SettingsData {
	fixedCostsYearly?: boolean;
}

export interface OutputData {
	renting?: {
		perHour?: number;
	};
	owning?: {
		perHour?: number;
		fixed?: {
			perYear?: number;
			perHourFlight?: number;
		};
	};
	breakEven?: number;
	estimatedHours?: number;
	isBuyingBest?: boolean;
}

export interface DetailedFormData {
	aircraft?: AircraftData;
	factors?: FactorData;
	costs?: {
		acquisition?: AcquisitionData;
		rental?: RentalData;
		operation?: OperationData;
	};
	partners?: PartnerData;
	settings?: SettingsData;
	output?: OutputData;
}
