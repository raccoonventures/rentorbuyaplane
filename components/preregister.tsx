'use client';

import { Button } from '@/catalyst/button';
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from '@/catalyst/dialog';
import { Field, Label } from '@/catalyst/fieldset';
import { Input } from '@/catalyst/input';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

export const Preregister = () => {
	let [isOpen, setIsOpen] = useState(false);
	let [isSubmitted, setIsSubmitted] = useState(false);

	// react-hook-form
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm();

	const onSubmit = async (data: object) => {
		try {
			// Sending the data to the backend
			const backend = await fetch(`/api/preregister`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			// If fetch doesn't return a 200, we throw an error
			if (backend.status != 200) {
				throw new Error('Backend encountered an error');
			}

			setIsSubmitted(true);
		} catch (error) {}
	};

	return (
		<>
			<Button
				type="button"
				plain
				className="max-w-48 cursor-pointer"
				onClick={() => {
					setIsOpen(true);
					setIsSubmitted(false);
				}}
			>
				Learn more →
			</Button>
			<Dialog open={isOpen} onClose={setIsOpen}>
				<DialogTitle>
					Be the first to know when this feature becomes available
				</DialogTitle>
				<DialogDescription>
					We&apos;re hard at work building custom financial reports for
					RentOrBuyAPlane.com.
					<br />
					Leave your email below and we&apos;ll reach out once it&apos;s ready
					for you
				</DialogDescription>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogBody>
						<Field>
							<Label>Your email</Label>
							<Input
								placeholder="ryan@whoopf.com"
								disabled={isSubmitted}
								{...register('email', {
									required: true,
								})}
							/>
						</Field>
					</DialogBody>
					<DialogActions>
						{!isSubmitted && (
							<>
								<Button
									plain
									className="cursor-pointer"
									onClick={() => setIsOpen(false)}
								>
									Cancel
								</Button>
								<Button color="green" className="cursor-pointer" type="submit">
									Submit
								</Button>
							</>
						)}

						{isSubmitted && (
							<>
								<span className="text-zinc-200">
									You&apos;ve successfully preregistered!
								</span>
								<Button
									outline
									className="cursor-pointer"
									onClick={() => {
										setIsOpen(false);
										reset({
											email: '',
										});
									}}
								>
									Close
								</Button>
							</>
						)}
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
};
