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
			(monthlyInterestRate /
				(1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)));

		return Math.ceil(monthlyPayment);
	},
	findBreakEven(rentingPerHour, owningPerHour, owningFixedTotal) {
		const denominator = Math.ceil(rentingPerHour) - Math.ceil(owningPerHour);
		if (denominator == 0) {
			return 0;
		}
		const formula = Math.ceil(owningFixedTotal) / denominator;
		if (formula < 0) {
			return 0;
		} else {
			return formula;
		}
	},
};
