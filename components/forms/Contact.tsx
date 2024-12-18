'use client';

import { useState } from 'react';

import { Button } from '@/catalyst/button';
import { Field, Label } from '@/catalyst/fieldset';

import { Input } from '@/catalyst/input';
import { Textarea } from '@/catalyst/textarea';

export function Contact() {
	let [isOpen, setIsOpen] = useState(false);
	let [isComplete, setIsComplete] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: '',
	});

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (formData.name != '' && formData.email != '' && formData.message != '') {
			setIsComplete(true);
		} else {
			setIsComplete(false);
		}
	};

	// Handle the submit
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				// Handle success response here
				console.log('Form submitted successfully');
				setIsComplete(true);
			} else {
				// Handle error response here
				console.error('Failed to submit form');
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
					<div className="prose prose-lg prose-zinc grid justify-center tracking-tight dark:prose-invert">
						<h2>Have questions or feedback about rentorbuyaplane.com?</h2>
						<p>
							We&apos;d love to hear from you! Reach out to us using the form
							below or directly at contact@rentorbuyaplane.com. Our team is
							dedicated to providing excellent support and assistance for all
							your aviation inquiries. Join us in exploring the world of
							aircraft ownership – we&apos;re here to help you navigate the
							skies!
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
