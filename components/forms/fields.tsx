"use client";

import { Field } from "@headlessui/react";
import { ErrorMessage, Label } from "@/catalyst/fieldset";
import { Input } from "@/catalyst/input";

interface NumberFieldProps {
	label: string;
	name: string;
	value: number | string | undefined;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** Left-hand adornment, e.g. "$" */
	prefix?: string;
	/** Right-hand adornment, e.g. "/hour", "GPH", "%" */
	suffix?: string;
	/** Short helper text rendered under the label */
	hint?: string;
	invalid?: boolean;
	error?: string;
	step?: string;
}

/**
 * Labelled numeric input with optional currency prefix / unit suffix and an
 * inline hint. Replaces the repeated relative-wrapper markup used throughout
 * the original calculator.
 */
export function NumberField({
	label,
	name,
	value,
	onChange,
	prefix,
	suffix,
	hint,
	invalid,
	error,
	step,
}: NumberFieldProps) {
	return (
		// `content-start` keeps the input pinned to the top of the grid cell so
		// rows stay aligned even when a neighbouring field has a hint below it.
		<Field className="grid grid-flow-row content-start gap-1.5">
			<Label>{label}</Label>
			<div className="relative">
				{prefix ? (
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<span className="z-10 text-base/6 text-zinc-500 sm:text-sm/6">
							{prefix}
						</span>
					</div>
				) : null}
				<Input
					type="number"
					name={name}
					value={value}
					onChange={onChange}
					invalid={invalid}
					step={step}
				/>
				{suffix ? (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8 xl:pr-10">
						<span className="z-10 text-base/6 text-zinc-500 sm:text-sm/6">
							{suffix}
						</span>
					</div>
				) : null}
			</div>
			{hint ? (
				<p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
			) : null}
			{invalid && error ? <ErrorMessage>{error}</ErrorMessage> : null}
		</Field>
	);
}

/** Orange section heading reused across the calculator. */
export function SectionHeading({ children }: { children: React.ReactNode }) {
	return <h2 className="font-medium text-[#FF7124]">{children}</h2>;
}
