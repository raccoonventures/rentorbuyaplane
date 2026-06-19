module.exports = {
	calculateMonthlyPayment(principal, durationYears, interestRate) {
		const monthlyInterestRate = interestRate / 100 / 12; // Convert percentage to decimal and annual rate to monthly
		const numberOfPayments = durationYears * 12;

		// If interest rate is 0, return the simple division of principal over number of payments
		if (monthlyInterestRate === 0) {
			return principal / numberOfPayments;
		}

		const monthlyPayment =
			principal *
			(monthlyInterestRate / (1 - (1 + monthlyInterestRate) ** -numberOfPayments));

		return Math.ceil(monthlyPayment);
	},
	findBreakEven(rentingPerHour, rentingFixed, owningPerHour, owningFixedTotal) {
		const denominator = Math.ceil(rentingPerHour) - Math.ceil(owningPerHour);
		if (denominator === 0) {
			return 0;
		}
		const formula =
			(Math.ceil(owningFixedTotal) - Math.ceil(rentingFixed)) / denominator;
		if (formula < 0) {
			return 0;
		}
		return Math.round(formula);
	},

	/**
	 * Pure rent-vs-buy comparison. Reads the (already derived) cost fields from
	 * `formData` and the user's estimated annual hours, and returns the full
	 * output object consumed by the result cards, the chart, and the PDF report.
	 */
	computeOutput(formData, estimatedHours) {
		const rental = formData?.costs?.rental ?? {};
		const variable = formData?.costs?.operation?.variable ?? {};
		const fixed = formData?.costs?.operation?.fixed ?? {};
		const fixedYearly = formData?.settings?.fixedCostsYearly;

		// Renting: a wet rate is all-in, a dry rate needs fuel added on top.
		const rentingPerHour =
			rental.isWet && rental.hourlyRate
				? rental.hourlyRate
				: (rental.hourlyRate ?? 0) + (variable.fuel ?? 0);
		const rentingFixed = rental.fixedFees ?? 0;

		// Owning, per flight hour: every variable cost stacked together.
		const owningPerHour =
			(variable.fuel ?? 0) +
			(variable.oil ?? 0) +
			(variable.reserve?.engine ?? 0) +
			(variable.reserve?.maintenance ?? 0) +
			(variable.upgrades ?? 0) +
			(variable.cosmetic ?? 0);

		// Owning, fixed per year: hangar + insurance + annual + financing.
		const fixedSum =
			(Number(fixed.hangar) || 0) +
			(Number(fixed.insurance) || 0) +
			(Number(fixed.annual) || 0) +
			(Number(fixed.financing) || 0);
		const owningFixedTotal = fixedYearly ? fixedSum : fixedSum * 12;

		const partners = formData?.partners?.number || 1;
		const hoursPerPartner = formData?.partners?.hoursPerPartner || 1;
		const owningFixedPerHour = owningFixedTotal / (partners * hoursPerPartner);

		const breakEven = this.findBreakEven(
			rentingPerHour,
			rentingFixed,
			owningPerHour,
			owningFixedTotal,
		);

		const hours =
			estimatedHours === undefined || estimatedHours === null
				? undefined
				: estimatedHours;
		// Compare the actual totals at the requested hours. Relying on
		// `hours > breakEven` is wrong when there is no positive break-even:
		// findBreakEven clamps to 0 both when buying always wins and when renting
		// always wins, which would otherwise flag buying as best for any hours > 0.
		const rentingTotal = rentingPerHour * (hours ?? 0) + rentingFixed;
		const owningTotal = owningPerHour * (hours ?? 0) + owningFixedTotal;
		const isBuyingBest = hours !== undefined && owningTotal < rentingTotal;

		return {
			renting: {
				perHour: Math.ceil(rentingPerHour),
				fixed: rentingFixed,
			},
			owning: {
				perHour: Math.ceil(owningPerHour),
				fixed: {
					perYear: Math.ceil(owningFixedTotal),
					perHourFlight: Math.ceil(owningFixedPerHour),
				},
			},
			breakEven,
			isBuyingBest,
			estimatedHours: hours,
		};
	},
};
