"use client";

import { useState } from "react";

import { Button } from "@/catalyst/button";
import { Field, Label } from "@/catalyst/fieldset";

import { Input } from "@/catalyst/input";
import { Textarea } from "@/catalyst/textarea";
import { CONTACT_LIMITS } from "@/utils/contact";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", message: "" };

export function Contact() {
	const [status, setStatus] = useState<Status>("idle");
	const [formData, setFormData] = useState(EMPTY_FORM);

	// Derived on every render, so it never lags behind the latest keystroke.
	const isComplete =
		formData.name.trim() !== "" &&
		formData.email.trim() !== "" &&
		formData.message.trim() !== "";

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Typing again after a result clears the old message.
		setStatus((prev) => (prev === "sending" ? prev : "idle"));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isComplete || status === "sending") return;

		setStatus("sending");
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				setFormData(EMPTY_FORM);
				setStatus("success");
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		}
	};

	return (
		<>
			{/* Contact */}
			<section className="grid grid-flow-row gap-6 py-12 md:grid-flow-col">
				<div className="grid max-w-2xl grid-flow-row content-start justify-start gap-2">
					<div className="prose prose-lg prose-zinc dark:prose-invert grid justify-center tracking-tight">
						<h2>Questions, corrections, or feature ideas?</h2>
						<p>
							I read every message. If a number looks off, you&apos;ve found a bug, or
							there&apos;s an aircraft or feature you&apos;d like to see, drop it in
							the form below—or email contact@rentorbuyaplane.com directly. I built
							this for fellow pilots, so your feedback is genuinely what makes it
							better.
						</p>
					</div>
				</div>
				<form
					onSubmit={handleSubmit}
					className="grid w-full grid-flow-row gap-4 md:w-[30dvw]"
				>
					<Field>
						<Label>Your name</Label>
						<Input
							type="text"
							name="name"
							autoComplete="name"
							required
							maxLength={CONTACT_LIMITS.name}
							value={formData.name}
							onChange={handleChange}
						/>
					</Field>
					<Field>
						<Label>Your email</Label>
						<Input
							type="email"
							name="email"
							autoComplete="email"
							required
							maxLength={CONTACT_LIMITS.email}
							value={formData.email}
							onChange={handleChange}
						/>
					</Field>
					<Field>
						<Label>Your message</Label>
						<Textarea
							name="message"
							required
							maxLength={CONTACT_LIMITS.message}
							value={formData.message}
							onChange={handleChange}
						/>
					</Field>
					<Button
						color="green"
						type="submit"
						disabled={!isComplete || status === "sending"}
						className="cursor-pointer"
					>
						{status === "sending" ? "Sending…" : "Send message"}
					</Button>

					{status === "success" && (
						<p
							role="status"
							className="text-sm font-medium text-green-700 dark:text-green-400"
						>
							Thank you. Your message is sent. I will reply by email.
						</p>
					)}
					{status === "error" && (
						<p
							role="alert"
							className="text-sm font-medium text-red-700 dark:text-red-400"
						>
							Your message was not sent. Check your email address and try again. Or
							email contact@rentorbuyaplane.com directly.
						</p>
					)}
				</form>
			</section>
		</>
	);
}
