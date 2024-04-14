export function generateChartData(
	rentCost: number,
	operatingCost: number,
	fixedCost: number,
) {
	const rentingData = [];
	const buyingData = [];

	//for (let i = 0; i <= 200; i++) {
	for (let i = 10; i <= 200; i += 10) {
		rentingData.push({
			x: i,
			y: rentCost * i,
		});

		buyingData.push({
			x: i,
			y: operatingCost * i + fixedCost,
		});
	}

	const chartData = [
		{
			id: 'renting',
			color: 'hsl(198.63, 88.66%, 48.43%)',
			data: rentingData,
		},
		{
			id: 'buying',
			color: 'hsl(270.74, 91.01%, 65.1%)',
			data: buyingData,
		},
	];

	return chartData;
}
