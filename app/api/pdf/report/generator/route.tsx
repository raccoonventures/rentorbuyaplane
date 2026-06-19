import type { NextRequest } from "next/server";

const commaNumber = require("comma-number");

import ReactPDF, {
	Document,
	G,
	Line,
	Page,
	Path,
	Polyline,
	StyleSheet,
	Svg,
	Text,
	View,
} from "@react-pdf/renderer";
import type { JSX } from "react";
import { getPreset } from "@/helpers/aircraft";
import { generateChartData } from "@/utils/charts";
import { setNestedObject } from "@/utils/searchParamsHelpers";

const ORANGE = "#FF7124";
const BLUE = "#2563eb";
const INK = "#18181b";
const MUTED = "#71717a";

const CATEGORY_LABEL: Record<string, string> = {
	trainer: "Trainer",
	single: "Single-engine",
	complex: "Complex single",
	twin: "Twin piston",
	turboprop: "Turboprop",
};

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		fontSize: 11,
		color: INK,
		paddingBottom: 48,
	},
	band: {
		backgroundColor: ORANGE,
		paddingVertical: 18,
		paddingHorizontal: 32,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	bandTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: 700 },
	bandMeta: { color: "#FFFFFF", fontSize: 10, opacity: 0.9 },
	section: { paddingHorizontal: 32, paddingTop: 18 },
	hero: {
		marginTop: 18,
		marginHorizontal: 32,
		padding: 16,
		borderRadius: 8,
		border: `1px solid ${ORANGE}`,
		backgroundColor: "#FFF4ED",
	},
	heroVerdict: { fontSize: 18, fontWeight: 700, color: INK },
	heroSub: { fontSize: 11, color: MUTED, marginTop: 4 },
	heading: {
		fontSize: 13,
		fontWeight: 700,
		marginBottom: 8,
		color: INK,
	},
	paragraph: { lineHeight: 1.5, color: INK },
	columns: { flexDirection: "row", justifyContent: "space-between", gap: 24 },
	column: { flex: 1 },
	subHeader: {
		fontSize: 11,
		fontWeight: 700,
		marginBottom: 4,
		color: ORANGE,
	},
	costItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 2,
		color: INK,
	},
	costItemTotal: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 5,
		marginTop: 4,
		borderTopWidth: 1,
		borderColor: "#e4e4e7",
		fontWeight: 700,
	},
	badge: {
		marginLeft: 8,
		paddingVertical: 2,
		paddingHorizontal: 6,
		fontWeight: 700,
		fontSize: 8,
		textTransform: "uppercase",
		borderRadius: 10,
		backgroundColor: "#dcfce7",
		color: "#15803d",
	},
	footer: {
		position: "absolute",
		bottom: 18,
		left: 32,
		right: 32,
		flexDirection: "row",
		justifyContent: "space-between",
		fontSize: 8,
		color: MUTED,
	},
});

const money = (n: number) => `$${commaNumber(Math.round(n || 0))}`;

function outputObjectValues(
	obj: {
		[key: string]: number | { [key: string]: number };
	},
	label: string,
): JSX.Element[] {
	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
	let totalValue = 0;
	const output: JSX.Element[] = [];

	for (const key in obj) {
		const value = obj[key];
		if (typeof value === "object" && value !== null) {
			for (const subKey in value) {
				const subValue = value[subKey];
				totalValue += subValue;
				output.push(
					<View style={styles.costItem} key={`${key}-${subKey}`}>
						<Text>{capitalize(subKey)}</Text>
						<Text>
							{money(subValue)} /{label}
						</Text>
					</View>,
				);
			}
		} else {
			totalValue += value;
			output.push(
				<View style={styles.costItem} key={key}>
					<Text>{capitalize(key)}</Text>
					<Text>
						{money(value)} /{label}
					</Text>
				</View>,
			);
		}
	}

	output.push(
		<View style={styles.costItemTotal} key="total">
			<Text>Total</Text>
			<Text>
				{money(totalValue)} /{label}
			</Text>
		</View>,
	);

	return output;
}

const Logo = () => (
	<Svg viewBox="0 0 24 24" width="34" height="34">
		<Path
			fill="none"
			stroke="#FFFFFF"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
			d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
		/>
	</Svg>
);

/** Native-PDF rent-vs-buy line chart with a break-even marker. */
function CostChart({
	rentPerHour,
	owningPerHour,
	owningFixed,
	breakEven,
}: {
	rentPerHour: number;
	owningPerHour: number;
	owningFixed: number;
	breakEven: number;
}) {
	const data = generateChartData(rentPerHour, owningPerHour, owningFixed);
	const renting = data[0].data as { x: number; y: number }[];
	const buying = data[1].data as { x: number; y: number }[];

	const W = 515;
	const H = 230;
	const L = 58;
	const R = 502;
	const T = 16;
	const B = 196;
	const xMax = 200;
	const yMax =
		Math.max(...renting.map((d) => d.y), ...buying.map((d) => d.y), 1) * 1.1;

	const sx = (x: number) => L + (x / xMax) * (R - L);
	const sy = (y: number) => B - (y / yMax) * (B - T);
	const toPoints = (series: { x: number; y: number }[]) =>
		series.map((d) => `${sx(d.x).toFixed(1)},${sy(d.y).toFixed(1)}`).join(" ");

	const yTicks = [0, yMax / 2, yMax];
	const xTicks = [0, 50, 100, 150, 200];
	const showBreakEven = breakEven > 0 && breakEven <= xMax;

	return (
		<Svg width={W} height={H}>
			{/* grid + axes */}
			<G>
				{yTicks.map((y) => (
					<Line
						key={`gy-${y}`}
						x1={L}
						y1={sy(y)}
						x2={R}
						y2={sy(y)}
						strokeWidth={0.5}
						stroke="#e4e4e7"
					/>
				))}
				{yTicks.map((y) => (
					<Text
						key={`yl-${y}`}
						x={L - 6}
						y={sy(y) + 3}
						fill={MUTED}
						style={{ fontSize: 7, textAlign: "right" }}
					>
						{money(y)}
					</Text>
				))}
				{xTicks.map((x) => (
					<Text
						key={`xl-${x}`}
						x={sx(x) - 6}
						y={B + 12}
						fill={MUTED}
						style={{ fontSize: 7 }}
					>
						{x}
					</Text>
				))}
				<Text x={(L + R) / 2 - 24} y={H - 2} style={{ fontSize: 8, color: MUTED }}>
					Flight hours / year
				</Text>
			</G>

			{/* break-even marker */}
			{showBreakEven && (
				<G>
					<Line
						x1={sx(breakEven)}
						y1={T}
						x2={sx(breakEven)}
						y2={B}
						strokeWidth={1.5}
						stroke="#22c55e"
						strokeDasharray="3 3"
					/>
					<Text
						x={sx(breakEven) + 3}
						y={T + 8}
						fill="#16a34a"
						style={{ fontSize: 7 }}
					>
						Break-even {breakEven}h
					</Text>
				</G>
			)}

			{/* series */}
			<Polyline
				points={toPoints(renting)}
				fill="none"
				stroke={ORANGE}
				strokeWidth={2}
			/>
			<Polyline
				points={toPoints(buying)}
				fill="none"
				stroke={BLUE}
				strokeWidth={2}
			/>

			{/* legend */}
			<G>
				<Line
					x1={L}
					y1={T - 2}
					x2={L + 14}
					y2={T - 2}
					stroke={ORANGE}
					strokeWidth={2}
				/>
				<Text x={L + 18} y={T + 1} fill={INK} style={{ fontSize: 7 }}>
					Renting
				</Text>
				<Line
					x1={L + 70}
					y1={T - 2}
					x2={L + 84}
					y2={T - 2}
					stroke={BLUE}
					strokeWidth={2}
				/>
				<Text x={L + 88} y={T + 1} fill={INK} style={{ fontSize: 7 }}>
					Buying
				</Text>
			</G>
		</Svg>
	);
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	// biome-ignore lint/suspicious/noExplicitAny: nested params rebuilt from the query string
	const params: any = {};
	searchParams.forEach((value, key) => {
		const nestedKeys = key.split(/\[|\]/).filter((k) => k);
		setNestedObject(params, nestedKeys, value);
	});

	const aircraft = params.aircraft ?? {};
	const output = params.output ?? {};
	const estimatedHours = output.estimatedHours ?? 0;
	const atLeast = estimatedHours === 200;
	const isBuyingBest = output.isBuyingBest;
	const category = getPreset(aircraft.type).category;
	const categoryLabel = CATEGORY_LABEL[category] ?? "Aircraft";

	const rentPerHour = output?.renting?.perHour ?? 0;
	const rentFixed = output?.renting?.fixed ?? 0;
	const owningPerHour = output?.owning?.perHour ?? 0;
	const owningFixed = output?.owning?.fixed?.perYear ?? 0;

	const rentTotal = rentPerHour * estimatedHours + rentFixed;
	const ownTotal = owningPerHour * estimatedHours + owningFixed;

	const MyDocument = () => (
		<Document
			title={`RentOrBuyAPlane — Report for ${aircraft.type}`}
			author="RentOrBuyAPlane.com"
			creator="RentOrBuyAPlane.com"
			producer="RentOrBuyAPlane.com"
			subject="Renting vs buying a plane financial report"
			language="en"
		>
			<Page size="A4" style={styles.page}>
				{/* Header band */}
				<View style={styles.band} fixed>
					<View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
						<Logo />
						<View>
							<Text style={styles.bandTitle}>Rent or Buy a Plane</Text>
							<Text style={styles.bandMeta}>Cost comparison report</Text>
						</View>
					</View>
					<View style={{ alignItems: "flex-end" }}>
						<Text style={styles.bandTitle}>{aircraft.type}</Text>
						<Text style={styles.bandMeta}>{categoryLabel}</Text>
					</View>
				</View>

				{/* Hero verdict */}
				<View style={styles.hero}>
					<Text style={styles.heroVerdict}>
						{isBuyingBest ? "Buying" : "Renting"} looks more cost-effective for you
					</Text>
					<Text style={styles.heroSub}>
						Flying {atLeast ? "at least " : ""}
						{estimatedHours} hours a year, you{isBuyingBest ? "'d" : ""} break even at{" "}
						{output.breakEven} hours.
					</Text>
					<Text style={styles.heroSub}>
						Below that, renting wins; above it, owning pays off.
					</Text>
				</View>

				{/* Intro */}
				<View style={styles.section}>
					<Text style={styles.paragraph}>
						Based on the numbers you entered for a {aircraft.type} burning{" "}
						{aircraft.fuelBurn} GPH, with an oil refill every {aircraft.oilRefill}{" "}
						hours and {commaNumber((aircraft.tbo ?? 0) - (aircraft.tsmoh ?? 0))} hours
						left before the next engine overhaul.
					</Text>
				</View>

				{/* Chart */}
				<View style={styles.section}>
					<Text style={styles.heading}>Annual cost by flight hours</Text>
					<CostChart
						rentPerHour={rentPerHour}
						owningPerHour={owningPerHour}
						owningFixed={owningFixed}
						breakEven={output.breakEven ?? 0}
					/>
				</View>

				{/* Side-by-side verdict numbers */}
				<View style={[styles.section, styles.columns]}>
					<View style={styles.column}>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={styles.heading}>Renting</Text>
							{!isBuyingBest && <Text style={styles.badge}>Best option</Text>}
						</View>
						<Text style={styles.paragraph}>
							{money(rentPerHour)} / hour (fuel{" "}
							{params.costs?.rental?.isWet ? "" : "not "}included)
						</Text>
						<Text style={[styles.paragraph, { marginTop: 4, fontWeight: 700 }]}>
							{atLeast ? "≥ " : "= "}
							{money(rentTotal)} / year
						</Text>
					</View>
					<View style={styles.column}>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={styles.heading}>Buying</Text>
							{isBuyingBest && <Text style={styles.badge}>Best option</Text>}
						</View>
						<Text style={styles.paragraph}>
							{money(owningPerHour)} / hour variable + {money(owningFixed)} / year
							fixed
						</Text>
						<Text style={[styles.paragraph, { marginTop: 4, fontWeight: 700 }]}>
							{atLeast ? "≥ " : "= "}
							{money(ownTotal)} / year
						</Text>
					</View>
				</View>

				{/* Cost breakdown tables */}
				<View style={[styles.section, styles.columns]}>
					<View style={styles.column}>
						<Text style={styles.subHeader}>Variable costs (per hour)</Text>
						{outputObjectValues(params.costs.operation.variable, "hour")}
					</View>
					<View style={styles.column}>
						<Text style={styles.subHeader}>
							Fixed costs (per {params.settings?.fixedCostsYearly ? "year" : "month"})
						</Text>
						{outputObjectValues(
							params.costs.operation.fixed,
							params.settings?.fixedCostsYearly ? "year" : "month",
						)}
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer} fixed>
					<Text>rentorbuyaplane.com</Text>
					<Text>
						Estimates only—adjust the inputs to match your real-world situation.
					</Text>
				</View>
			</Page>
		</Document>
	);

	const result = await ReactPDF.renderToStream(<MyDocument />);
	// @ts-expect-error
	return new Response(result);
}
