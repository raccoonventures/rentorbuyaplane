import { Calculator } from "@/components/forms/Calculator";
import Intro from "@/components/Intro";

const structuredData = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "RentOrBuyAPlane.com",
	url: "https://rentorbuyaplane.com",
	description:
		"Estimate the cost of owning vs renting a plane, and discover the exact number of hours to break even.",
	applicationCategory: "FinanceApplication",
	operatingSystem: "Any",
	browserRequirements: "Requires JavaScript",
	offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
	return (
		<>
			<script
				type="application/ld+json"
				// Escape "<" so the JSON can never close the script tag early.
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built in this file
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
				}}
			/>
			<Intro />
			<Calculator />
		</>
	);
}
