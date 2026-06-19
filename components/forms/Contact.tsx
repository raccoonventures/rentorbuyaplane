"use client";

import { useState } from "react";

import { Button } from "@/catalyst/button";
import { Field, Label } from "@/catalyst/fieldset";

import { Input } from "@/catalyst/input";
import { Textarea } from "@/catalyst/textarea";

export function Contact() {
	const [_isOpen, _setIsOpen] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (
			formData.name !== "" &&
			formData.email !== "" &&
			formData.message !== ""
		) {
			setIsComplete(true);
		} else {
			setIsComplete(false);
		}
	};

	// Handle the submit
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				// Handle success response here
				console.log("Form submitted successfully");
				setIsComplete(true);
			} else {
				// Handle error response here
				console.error("Failed to submit form");
			}
		} catch (error) {
			console.error(error);
		}
		console.log(formData);
	};

	return (
		<>
			{/* Calculator */}
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
							onChange={handleChange}
						/>
					</Field>
					<Field>
						<Label>Your email</Label>
						<Input
							type="email"
							name="email"
							autoComplete="email"
							onChange={handleChange}
						/>
					</Field>
					<Field>
						<Label>Your message</Label>
						<Textarea name="message" onChange={handleChange} />
					</Field>
					<Button
						color="green"
						type="submit"
						disabled={!isComplete}
						className="cursor-pointer"
					>
						Send message
					</Button>
				</form>
			</section>
		</>
	);
}
