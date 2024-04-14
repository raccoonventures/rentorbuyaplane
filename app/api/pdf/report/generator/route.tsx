import { type NextRequest } from 'next/server';

import { Analytics } from '@customerio/cdp-analytics-node';
const analytics = new Analytics({
	writeKey: `${process.env.CIO_CDP_API_KEY}`,
	host: 'https://cdp.customer.io',
});

import ReactPDF, {
	Document,
	Page,
	Path,
	StyleSheet,
	Svg,
	Text,
	View,
} from '@react-pdf/renderer';

import { setNestedObject } from '@/utils/searchParamsHelpers';

const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		backgroundColor: '#F5F5F5',
		alignItems: 'flex-start',
		fontSize: 14,
		fontWeight: 400,
	},
	section: {
		padding: 10,
	},
	colFlex:{
		flexDirection: 'row',
		alignItems: 'center'
	},
	header: {
		fontSize: 20,
		fontWeight: 700,
	},
	badge: {
		display: 'flex',
		marginLeft: 12,
		marginTop: 2,
		paddingVertical: 2,
		paddingHorizontal: 6,
		fontWeight: 700,
		fontSize: 10,
		textTransform: 'uppercase',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 12,
		borderColor: '#a3e635',
		backgroundColor: '#a3e63533',
		color: '#4d7c0f',
	},
});

const Logo = () => (
	<Svg viewBox="0 0 441 55" width="320" height="40">
		<Path
			fill="none"
			d="M-5.924-5.652h400.032v54.971H-5.924z"
			transform="matrix(1.10091 0 0 1 6.522 5.652)"
		></Path>
		<Path
			fill="#FBBF24"
			d="M-1.323 34.883H6.58v-13.3c0-2.7 1.18-4.05 3.27-4.05 1.135 0 1.953.4 2.498 1l4.587-6.75c-1.09-1.25-2.634-1.85-4.723-1.85-2.317 0-4.133.7-5.632 2.05v-1.55h-7.903v24.45zm30.43.55c3.906 0 7.04-1.4 9.265-4.15l-4.133-4.55c-1.317 1.65-2.998 2.45-5.132 2.45-2.589 0-4.315-1.3-4.996-3.7l15.578-.1c.272-1.35.363-2.35.363-3.3 0-7.1-4.814-12.25-11.536-12.25-6.948 0-12.126 5.45-12.126 12.8 0 7.55 5.223 12.8 12.717 12.8zm-.5-19.35c2.226 0 3.634 1.25 4.133 3.7l-8.63.05c.637-2.4 2.272-3.75 4.497-3.75zm14.443 18.8h7.902v-13.8c0-2.25 1.363-3.65 3.27-3.65 1.862 0 3.225 1.4 3.225 3.65v13.8h7.903v-15.8c0-5.1-3.588-9.15-8.357-9.15-2.407 0-4.451.75-6.04 2.1v-1.6H43.05v24.45zm29.248 0h7.903v-17.2h4.905v-7.25H80.2V.333h-7.903v10.1h-4.905v7.25h4.905v17.2z"
			transform="matrix(1.10091 0 0 1 6.522 5.652)"
		></Path>
		<Path
			fill="#FF7124"
			d="M98.459 35.433c7.085 0 12.353-5.5 12.353-12.85 0-7.3-5.268-12.75-12.399-12.75-7.13 0-12.399 5.5-12.399 12.75 0 7.35 5.314 12.85 12.445 12.85zm-.046-7.75c-2.589 0-4.36-2.05-4.36-5 0-3 1.771-5.05 4.36-5.05 2.589 0 4.36 2 4.36 5s-1.726 5.05-4.36 5.05zm15.533 7.2h7.902v-13.3c0-2.7 1.181-4.05 3.27-4.05 1.136 0 1.953.4 2.498 1l4.587-6.75c-1.09-1.25-2.634-1.85-4.723-1.85-2.316 0-4.133.7-5.632 2.05v-1.55h-7.902v24.45z"
			transform="matrix(1.10091 0 0 1 6.522 5.652)"
		></Path>
		<Path
			fill="#FBBF24"
			d="M133.248 34.883h7.72v-1.4c1.5 1.15 3.453 1.9 5.496 1.9 6.45 0 10.9-5.35 10.9-12.7 0-7.4-4.45-12.75-10.9-12.75-1.998 0-3.86.6-5.313 1.65v-13.15h-7.903v36.45zm11.808-7.25c-2.588 0-4.36-2.05-4.36-5 0-2.9 1.772-4.95 4.315-4.95s4.36 2.1 4.36 4.95c0 2.95-1.817 5-4.315 5zm25.752 7.8c6.313 0 10.764-4.4 10.764-10.85v-14.15h-7.903v14.15c0 2.05-1.18 3.3-2.861 3.3-1.726 0-2.861-1.25-2.861-3.3v-14.15h-7.903v14.15c0 6.35 4.496 10.85 10.764 10.85zm16.168 9.8h7.948l3.815-10.35 9.13-24.45h-8.448l-3.816 14.05-3.815-14.05h-8.447l8.447 23.2-4.814 11.6z"
			transform="matrix(1.10091 0 0 1 6.522 5.652)"
		></Path>
		<Path
			fill="#FF7124"
			d="M218.768 35.383c2.271 0 4.27-.8 5.723-2.15v1.65h7.766v-24.45h-7.766v1.7c-1.454-1.4-3.452-2.2-5.723-2.2-6.177 0-10.627 5.35-10.627 12.75 0 7.35 4.45 12.7 10.627 12.7zm1.68-7.75c-2.497 0-4.314-2.05-4.314-5 0-2.85 1.817-4.95 4.36-4.95s4.315 2.05 4.315 4.95c0 2.95-1.772 5-4.36 5z"
			transform="matrix(1.10091 0 0 1 6.522 5.652)"
		></Path>
		<Path
			fill="#FBBF24"
			d="M236.89 45.233h7.72v-11.6c1.5 1.1 3.452 1.75 5.496 1.75 6.45 0 10.9-5.35 10.9-12.7 0-7.4-4.45-12.75-10.9-12.75-1.998 0-3.86.7-5.314 1.8v-1.3h-7.902v34.8zm11.763-17.6c-2.544 0-4.315-2.05-4.315-5s1.771-4.95 4.36-4.95c2.498 0 4.315 2.05 4.315 4.95 0 2.9-1.817 5-4.36 5zM264.276-1.567h7.903v36.45h-7.903zM286.076 35.383c2.271 0 4.27-.8 5.723-2.15v1.65h7.766v-24.45h-7.766v1.7c-1.454-1.4-3.452-2.2-5.723-2.2-6.177 0-10.627 5.35-10.627 12.75 0 7.35 4.45 12.7 10.627 12.7zm1.68-7.75c-2.497 0-4.314-2.05-4.314-5 0-2.85 1.817-4.95 4.36-4.95s4.315 2.05 4.315 4.95c0 2.95-1.772 5-4.36 5zm16.442 7.25h7.902v-13.8c0-2.25 1.363-3.65 3.27-3.65 1.862 0 3.225 1.4 3.225 3.65v13.8h7.902v-15.8c0-5.1-3.588-9.15-8.356-9.15-2.408 0-4.451.75-6.04 2.1v-1.6h-7.903v24.45zm37.696.55c3.906 0 7.04-1.4 9.265-4.15l-4.133-4.55c-1.317 1.65-2.998 2.45-5.132 2.45-2.59 0-4.315-1.3-4.996-3.7l15.578-.1c.272-1.35.363-2.35.363-3.3 0-7.1-4.814-12.25-11.536-12.25-6.949 0-12.126 5.45-12.126 12.8 0 7.55 5.223 12.8 12.717 12.8zm-.5-19.35c2.226 0 3.633 1.25 4.133 3.7l-8.63.05c.637-2.4 2.272-3.75 4.497-3.75z"
			transform="matrix(1.10091 0 0 1 6.522 5.652)"
		></Path>
		<Path
			fill="#FF7124"
			stroke="#FF7124"
			d="M35.6 38.4L32 22l7-7c3-3 4-7 3-9-2-1-6 0-9 3l-7 7-16.4-3.6c-1-.2-1.8.2-2.2 1l-.6 1c-.4 1-.2 2 .6 2.6L18 24l-4 6H8l-2 2 6 4 4 6 2-2v-6l6-4 7 10.6c.6.8 1.6 1 2.6.6l1-.4c.8-.6 1.2-1.4 1-2.4z"
			transform="matrix(1.10091 0 0 1 6.522 5.652) matrix(.90834 0 0 1 351.657 -1.98)"
		></Path>
	</Svg>
);

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	// Create an empty object to hold the parameters
	const params: any = {};

	// Iterate over the search parameters and add them to the object
	searchParams.forEach((value, key) => {
		// Split the key string by '[' and ']' to get the top-level key and sub-keys
		const nestedKeys = key.split(/\[|\]/).filter((k) => k);

		// Use the array of keys as the path for the setNestedObject function
		setNestedObject(params, nestedKeys, value);
	});

	console.log(typeof params.output.isBuyingBest);

	const MyDocument = () => (
		<Document
			title={`RentOrBuyAPlane — Report for ${params.aircraft.type}`}
			author="RentOrBuyAPlane.com"
			creator="RentOrBuyAPlane.com"
			producer="RentOrBuyAPlane.com"
			subject="Renting vs buying a plane financial report"
			language="en"
		>
			<Page size="A4" style={styles.page}>
				<View style={styles.section}>
					<Logo />
				</View>
				<View style={styles.section}>
					<Text>
						For a {params.aircraft.type} burning {params.aircraft.fuelBurn} GPH
						and requiring an oil refill every {params.aircraft.oilRefill}{' '}
						hours—and with {params.aircraft.tbo - params.aircraft.tsmoh} hours
						before an engine overhaul.
					</Text>
				</View>
				<View style={styles.section}>
					<View style={styles.colFlex}>
						<Text style={styles.header}>Renting</Text>
						{params.output.isBuyingBest ? (
							<></>
						) : (
							<View style={styles.badge}>
								<Text>Best Option</Text>
							</View>
						)}
					</View>
					<Text></Text>
				</View>
				<View style={styles.section}>
					<Text style={styles.header}>Buying</Text>
				</View>
			</Page>
		</Document>
	);

	const result = await ReactPDF.renderToStream(<MyDocument />);
	// @ts-ignore
	return new Response(result);
}
