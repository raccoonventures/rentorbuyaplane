import type { Metadata } from "next";
import { Contact } from "@/components/forms/Contact";

export const metadata: Metadata = {
	title: "Contact",
	description:
		"Report a bug, correct a number, or suggest an aircraft or feature for the rent-vs-buy airplane calculator.",
	alternates: { canonical: "/contact" },
};

const ContactPage = () => {
	return (
		<section className="grid grid-flow-row items-center justify-center gap-8">
			<Contact />
		</section>
	);
};

export default ContactPage;
