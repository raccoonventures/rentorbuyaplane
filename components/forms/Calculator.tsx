"use client";

import { useState } from "react";
import { Button } from "@/catalyst/button";
import { AdvancedWizard } from "@/components/forms/AdvancedWizard";
import { BasicCalculator } from "@/components/forms/BasicCalculator";
import { ResultCards } from "@/components/forms/ResultCards";
import { useCalculator } from "@/hooks/useCalculator";
import { toQueryString } from "@/utils/searchParamsHelpers";

type Mode = "basic" | "advanced";

export function Calculator() {
	const [mode, setMode] = useState<Mode>("basic");
	const state = useCalculator();
	const { formData, output, estimatedHours, handleHoursChange } = state;

	const openReport = () => {
		const queryString = toQueryString({ ...formData, output });
		window.open(`/api/pdf/report/generator?${queryString}`, "_blank");
	};

	return (
		<>
			{/* Mode toggle */}
			<div className="flex items-center justify-center pb-10">
				<div className="inline-flex rounded-full border border-black/10 bg-zinc-950/5 p-1 dark:border-white/10 dark:bg-white/5">
					{(["basic", "advanced"] as const).map((m) => (
						<button
							key={m}
							type="button"
							onClick={() => setMode(m)}
							className={`cursor-pointer rounded-full px-5 py-1.5 text-sm font-medium capitalize transition ${
								mode === m
									? "bg-[#FF7124] text-white shadow-sm"
									: "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
							}`}
						>
							{m}
						</button>
					))}
				</div>
			</div>

			<section>
				{mode === "basic" ? (
					<BasicCalculator state={state} onAdvanced={() => setMode("advanced")} />
				) : (
					<AdvancedWizard state={state} />
				)}
			</section>

			{/* Results */}
			<ResultCards
				output={output}
				estimatedHours={estimatedHours}
				onHoursChange={handleHoursChange}
			/>

			{/* CTA */}
			<div className="mx-auto max-w-7xl px-6 py-12 lg:flex lg:items-center lg:justify-between lg:px-8">
				<div className="grid grid-flow-row justify-start gap-4">
					<div className="flex items-center gap-x-4">
						<h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
							Download your ownership analysis
						</h2>
						<span className="mt-1 rounded-full bg-yellow-600/10 px-3 py-1 text-sm font-semibold text-yellow-500 ring-1 ring-yellow-600/20 ring-inset">
							Beta
						</span>
					</div>
					<p className="max-w-2xl text-xl tracking-tight text-zinc-950 dark:text-zinc-100">
						Grab a PDF report tailored to your inputs, with the rent-vs-buy chart and
						a full cost breakdown. It&apos;s still in beta, so expect a few rough
						edges.
					</p>
				</div>
				<div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
					<Button
						color="green"
						type="button"
						data-umami-event="get-report-button"
						className="cursor-pointer"
						onClick={openReport}
					>
						Download report
					</Button>
				</div>
			</div>
		</>
	);
}
