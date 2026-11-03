import type { MetadataRoute } from "next";

const SITE_URL = "https://rentorbuyaplane.com";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{ url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
		{ url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
		{ url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
		{ url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
		{ url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
	];
}
