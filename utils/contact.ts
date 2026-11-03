/** Limits shared by the contact form (client) and /api/contact (server). */
export const CONTACT_LIMITS = {
	name: 200,
	email: 320,
	message: 5000,
} as const;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
