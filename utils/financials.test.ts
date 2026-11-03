import { describe, expect, it } from "vitest";
import Financials from "./financials";

describe("calculateMonthlyPayment", () => {
	it("splits the principal evenly when the rate is 0%", () => {
		expect(Financials.calculateMonthlyPayment(120000, 10, 0)).toBe(1000);
	});

	it("uses the amortization formula and rounds up", () => {
		// $100k, 10 years, 8% => $1,213.28 per month, rounded up.
		expect(Financials.calculateMonthlyPayment(100000, 10, 8)).toBe(1214);
	});
});

describe("findBreakEven", () => {
	it("returns the hours where both totals are equal", () => {
		// 150/h renting vs 80/h owning + 14,000 fixed => 14,000 / 70 = 200 h.
		expect(Financials.findBreakEven(150, 0, 80, 14000)).toBe(200);
	});

	it("accounts for fixed rental fees", () => {
		// (14,000 - 3,500) / 70 = 150 h.
		expect(Financials.findBreakEven(150, 3500, 80, 14000)).toBe(150);
	});

	it("returns 0 when the per-hour costs are equal", () => {
		expect(Financials.findBreakEven(100, 0, 100, 5000)).toBe(0);
	});

	it("returns 0 when there is no positive break-even", () => {
		// Owning costs more per hour AND more in fixed costs: renting always wins.
		expect(Financials.findBreakEven(100, 0, 150, 5000)).toBe(0);
	});
});

// Wet rental 150/h. Owning: 40 fuel + 2 oil + 20 engine + 18 maintenance = 80/h.
// Fixed: (400 + 300 + 100) per month = 9,600 per year.
function baseForm(overrides: Record<string, unknown> = {}) {
	return {
		costs: {
			rental: { hourlyRate: 150, isWet: true, fixedFees: 0 },
			operation: {
				fixed: { hangar: 400, insurance: 300, annual: 100, financing: 0 },
				variable: {
					fuel: 40,
					oil: 2,
					reserve: { engine: 20, maintenance: 18 },
					upgrades: 0,
					cosmetic: 0,
				},
			},
		},
		partners: { number: 1, hoursPerPartner: 52 },
		settings: { fixedCostsYearly: false },
		...overrides,
	};
}

describe("computeOutput", () => {
	it("computes per-hour and yearly figures", () => {
		const out = Financials.computeOutput(baseForm(), 100);
		expect(out.renting.perHour).toBe(150);
		expect(out.owning.perHour).toBe(80);
		expect(out.owning.fixed.perYear).toBe(9600);
		expect(out.owning.fixed.perHourFlight).toBe(Math.ceil(9600 / 52));
		expect(out.breakEven).toBe(137);
	});

	it("recommends renting below the break-even point", () => {
		expect(Financials.computeOutput(baseForm(), 50).isBuyingBest).toBe(false);
	});

	it("recommends buying above the break-even point", () => {
		expect(Financials.computeOutput(baseForm(), 300).isBuyingBest).toBe(true);
	});

	it("adds fuel to a dry rental rate", () => {
		const form = baseForm();
		form.costs.rental.isWet = false;
		// 150 dry + 40 fuel.
		expect(Financials.computeOutput(form, 100).renting.perHour).toBe(190);
	});

	it("treats fixed costs as yearly when the setting is on", () => {
		const form = baseForm({ settings: { fixedCostsYearly: true } });
		expect(Financials.computeOutput(form, 100).owning.fixed.perYear).toBe(800);
	});

	it("divides fixed costs between partners", () => {
		const form = baseForm({ partners: { number: 2, hoursPerPartner: 50 } });
		// 9,600 / (2 * 50) = 96 per flight hour.
		expect(Financials.computeOutput(form, 100).owning.fixed.perHourFlight).toBe(
			96,
		);
	});

	it("does not flag buying as best when renting is always cheaper", () => {
		const form = baseForm();
		form.costs.rental = { hourlyRate: 50, isWet: true, fixedFees: 0 };
		const out = Financials.computeOutput(form, 100);
		expect(out.breakEven).toBe(0);
		expect(out.isBuyingBest).toBe(false);
	});

	it("flags buying as best when owning is always cheaper", () => {
		const form = baseForm();
		form.costs.operation.fixed = {
			hangar: 0,
			insurance: 0,
			annual: 0,
			financing: 0,
		};
		const out = Financials.computeOutput(form, 10);
		expect(out.breakEven).toBe(0);
		expect(out.isBuyingBest).toBe(true);
	});

	it("survives an empty form", () => {
		expect(() => Financials.computeOutput({}, 0)).not.toThrow();
	});
});
