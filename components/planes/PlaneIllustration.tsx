import type { PlaneCategory } from "@/helpers/aircraft";

const ORANGE = "#FF7124";

/**
 * Stylised top-down aircraft silhouettes, one per category. The fuselage and
 * wings use `currentColor` (so they adapt to light/dark text colour) while the
 * propellers / spinners use the brand orange. Categories are distinguished by
 * wing shape, engine count and tail.
 */
function Frame({
	children,
	label,
}: {
	children: React.ReactNode;
	label: string;
}) {
	return (
		<svg
			viewBox="0 0 160 160"
			className="h-full w-full text-zinc-700 dark:text-zinc-200"
			role="img"
			aria-label={label}
		>
			<title>{label}</title>
			{children}
		</svg>
	);
}

function Trainer() {
	return (
		<Frame label="High-wing trainer aircraft">
			{/* straight, wide high wing */}
			<rect x="14" y="58" width="132" height="16" rx="6" fill="currentColor" />
			{/* fuselage */}
			<rect x="71" y="24" width="18" height="112" rx="9" fill="currentColor" />
			{/* horizontal stabiliser */}
			<rect x="52" y="124" width="56" height="12" rx="6" fill="currentColor" />
			{/* nose propeller */}
			<line
				x1="62"
				y1="22"
				x2="98"
				y2="22"
				stroke={ORANGE}
				strokeWidth="5"
				strokeLinecap="round"
			/>
			<circle cx="80" cy="22" r="4" fill={ORANGE} />
		</Frame>
	);
}

function Single() {
	return (
		<Frame label="Low-wing single-engine aircraft">
			{/* tapered low wing */}
			<path
				d="M80 60 L150 78 L150 86 L80 76 L10 86 L10 78 Z"
				fill="currentColor"
			/>
			<rect x="71" y="22" width="18" height="116" rx="9" fill="currentColor" />
			<path d="M80 120 L112 132 L112 138 L48 138 L48 132 Z" fill="currentColor" />
			<line
				x1="62"
				y1="20"
				x2="98"
				y2="20"
				stroke={ORANGE}
				strokeWidth="5"
				strokeLinecap="round"
			/>
			<circle cx="80" cy="20" r="4" fill={ORANGE} />
		</Frame>
	);
}

function Complex() {
	return (
		<Frame label="Retractable-gear complex aircraft">
			{/* swept tapered wing */}
			<path
				d="M80 58 L150 88 L150 94 L80 74 L10 94 L10 88 Z"
				fill="currentColor"
			/>
			<rect x="71" y="20" width="18" height="118" rx="9" fill="currentColor" />
			<path d="M80 118 L114 134 L114 140 L46 140 L46 134 Z" fill="currentColor" />
			{/* pointed spinner */}
			<path d="M80 8 L86 22 L74 22 Z" fill={ORANGE} />
			<line
				x1="64"
				y1="22"
				x2="96"
				y2="22"
				stroke={ORANGE}
				strokeWidth="4"
				strokeLinecap="round"
			/>
		</Frame>
	);
}

function Twin() {
	return (
		<Frame label="Twin piston-engine aircraft">
			{/* wing */}
			<path
				d="M80 56 L150 76 L150 84 L80 72 L10 84 L10 76 Z"
				fill="currentColor"
			/>
			<rect x="71" y="22" width="18" height="116" rx="9" fill="currentColor" />
			<path d="M80 120 L112 132 L112 138 L48 138 L48 132 Z" fill="currentColor" />
			{/* two engine nacelles */}
			<rect x="40" y="48" width="14" height="30" rx="6" fill="currentColor" />
			<rect x="106" y="48" width="14" height="30" rx="6" fill="currentColor" />
			{/* nacelle propellers */}
			<line
				x1="38"
				y1="46"
				x2="56"
				y2="46"
				stroke={ORANGE}
				strokeWidth="5"
				strokeLinecap="round"
			/>
			<line
				x1="104"
				y1="46"
				x2="122"
				y2="46"
				stroke={ORANGE}
				strokeWidth="5"
				strokeLinecap="round"
			/>
			<circle cx="47" cy="46" r="3.5" fill={ORANGE} />
			<circle cx="113" cy="46" r="3.5" fill={ORANGE} />
		</Frame>
	);
}

function Turboprop() {
	return (
		<Frame label="Twin turboprop aircraft">
			{/* larger wing */}
			<path d="M80 54 L154 74 L154 84 L80 70 L6 84 L6 74 Z" fill="currentColor" />
			<rect x="69" y="18" width="22" height="120" rx="11" fill="currentColor" />
			{/* T-tail: wide horizontal stab high on the fin */}
			<rect x="40" y="128" width="80" height="12" rx="6" fill="currentColor" />
			{/* large engine nacelles */}
			<rect x="34" y="40" width="18" height="40" rx="8" fill="currentColor" />
			<rect x="108" y="40" width="18" height="40" rx="8" fill="currentColor" />
			{/* big turboprop blades */}
			<line
				x1="30"
				y1="38"
				x2="56"
				y2="38"
				stroke={ORANGE}
				strokeWidth="6"
				strokeLinecap="round"
			/>
			<line
				x1="104"
				y1="38"
				x2="130"
				y2="38"
				stroke={ORANGE}
				strokeWidth="6"
				strokeLinecap="round"
			/>
			<circle cx="43" cy="38" r="4.5" fill={ORANGE} />
			<circle cx="117" cy="38" r="4.5" fill={ORANGE} />
		</Frame>
	);
}

const BY_CATEGORY: Record<PlaneCategory, () => React.ReactElement> = {
	trainer: Trainer,
	single: Single,
	complex: Complex,
	twin: Twin,
	turboprop: Turboprop,
};

export function PlaneIllustration({
	category,
	className,
}: {
	category: PlaneCategory;
	className?: string;
}) {
	const Art = BY_CATEGORY[category] ?? Single;
	return (
		<div className={className}>
			<Art />
		</div>
	);
}
