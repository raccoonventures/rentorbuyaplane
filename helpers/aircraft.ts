import Planes from "@/helpers/planes.json";

export type PlaneCategory =
	| "trainer"
	| "single"
	| "complex"
	| "twin"
	| "turboprop";

export interface AircraftPreset {
	type: string;
	category: PlaneCategory;
	acquisitionPrice: number;
	fuelBurn: number;
	fuelType: "avgas" | "jet-a";
	fuelPrice: number;
	oilRefill: number;
	oilPrice: number;
	tbo: number;
	overhaulCost: number;
	/** Monthly hangar / tie-down cost */
	hangar: number;
	/** Monthly insurance premium */
	insurance: number;
	/** Monthly amortized annual inspection cost */
	annual: number;
	/** Maintenance reserve, per flight hour */
	maintenanceReserve: number;
	/** Typical wet rental rate, per flight hour */
	rentalRate: number;
}

export const presets = Planes as AircraftPreset[];

export const aircraftTypes = presets.map((p) => p.type);

const DEFAULT_PRESET =
	presets.find((p) => p.type === "Other") ?? presets[presets.length - 1];

export function getPreset(type: string | undefined): AircraftPreset {
	return presets.find((p) => p.type === type) ?? DEFAULT_PRESET;
}
