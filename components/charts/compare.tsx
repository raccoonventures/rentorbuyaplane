'use client';
import { ResponsiveLine } from '@nivo/line';
const commaNumber = require('comma-number');

import { generateChartData } from '@/utils/charts';
import theme from './theme';

const themeOutput = theme();
console.log(themeOutput);

export function Chart(properties: any) {
	const chartData = generateChartData(
		properties.rentCost,
		properties.operationCost,
		properties.fixedCost,
	);

	// @ts-ignore
	const CustomTooltip = ({ point }) => {
		const { serieId, data } = point;

		// Assuming `data.x` is your hours and `data.y` is your cost
		const hours = data.x;
		const cost = data.y;

		return (
			<div className="rounded-lg border border-zinc-950/50 bg-zinc-50 p-2 text-zinc-950 dark:border-zinc-50 dark:bg-zinc-800/95 dark:text-zinc-50">
				Flying for <span className="font-bold">{hours}</span> hours will cost
				you <span className="font-bold">${commaNumber(cost)}</span> when{' '}
				<span className="font-bold">{serieId}</span>
			</div>
		);
	};

	return (
		<section className=" h-96 min-h-[800px]">
			<ResponsiveLine
				data={chartData}
				margin={{ top: 150, right: 75, bottom: 150, left: 75 }}
				curve={'natural'}
				lineWidth={4}
				xScale={{ type: 'linear' }}
				enableGridX={false}
				gridXValues={[10, 25, 50, 75, 100, 125, 150, 175, 200]}
				yScale={{
					type: 'linear',
					min: 'auto',
					max: 'auto',
					stacked: false,
					reverse: false,
				}}
				yFormat=" >-.2f"
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Flight Hours',
					legendOffset: 36,
					legendPosition: 'middle',
					truncateTickAt: 0,
				}}
				axisLeft={{
					tickSize: 10,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Total cost',
					legendOffset: -60,
					legendPosition: 'middle',
					truncateTickAt: 0,
				}}
				colors={['#0ea5e9', '#2563eb']}
				pointSize={1}
				pointColor={{ from: 'color', modifiers: [] }}
				useMesh={true}
				legends={[
					{
						anchor: 'bottom',
						direction: 'row',
						justify: false,
						translateX: 16,
						translateY: 80,
						itemsSpacing: 0,
						itemDirection: 'left-to-right',
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 8,
						symbolShape: 'circle',
						symbolBorderColor: 'rgba(0, 0, 0, .5)',
						effects: [
							{
								on: 'hover',
								style: {
									itemBackground: 'rgba(0, 0, 0, .03)',
									itemOpacity: 1,
								},
							},
						],
					},
				]}
				tooltip={CustomTooltip}
				{...(properties.breakEven != undefined && {
					markers: [
						{
							axis: 'x',
							legend: 'Break-Even',
							lineStyle: {
								stroke: '#22c55e',
								strokeWidth: 4,
								strokeLinecap: 'round',
							},
							text: { fill: 'blue' },
							value: properties.breakEven,
						},
					],
				})}
				// @ts-ignore
				theme={themeOutput}
			/>
		</section>
	);
}
