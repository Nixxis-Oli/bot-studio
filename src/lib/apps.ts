import {
	PUBLIC_APP_BOT_STUDIO,
	PUBLIC_APP_MONITORING,
	PUBLIC_APP_ORGANIZATION
} from '$env/static/public';
import type {
	AppEntry,
	OrganizationEntry,
	PaletteOption,
	UserSummary
} from '@nixxis-oli/ui';

// Every application declares the same catalogue. In production this would come
// from one endpoint; duplicating it here is what proves the shared toolbar does
// not own it.
//
// The URLs come from the environment so the switcher points at localhost in
// development and at the deployed sites in CI.
export const apps: AppEntry[] = [
	{
		id: 'bot-studio',
		name: 'Bot studio',
		href: PUBLIC_APP_BOT_STUDIO,
		initials: 'BS',
		color: '#7c3aed',
		description: 'Design, configure and publish conversational bots.'
	},
	{
		id: 'monitoring',
		name: 'Monitoring',
		href: PUBLIC_APP_MONITORING,
		initials: 'MO',
		color: '#059669',
		description: 'Live queues, response times and escalations.'
	},
	{
		id: 'organization',
		name: 'Organization',
		href: PUBLIC_APP_ORGANIZATION,
		initials: 'OR',
		color: '#2563eb',
		description: 'Members, access rights and organization settings.'
	},
	{
		id: 'reporting',
		name: 'Reporting',
		href: '#',
		initials: 'RE',
		color: '#0891b2',
		description: 'Scheduled reports and historical analysis.',
		ready: false
	},
	{
		id: 'agents',
		name: 'Agent desk',
		href: '#',
		initials: 'AG',
		color: '#dc2626',
		description: 'Where human agents pick up escalated conversations.',
		ready: false
	}
];

// The organizations this account belongs to. Same story as the catalogue above:
// a real deployment reads them from one endpoint, per signed-in user.
export const organizations: OrganizationEntry[] = [
	{ id: 'acme', name: 'ACME' },
	{ id: 'globex', name: 'Globex', ready: false },
	{ id: 'initech', name: 'Initech', ready: false }
];

export const currentOrganizationId = 'acme';

// The signed-in account. Same story as the catalogue above: one endpoint per
// signed-in user in a real deployment. Declared identically in every
// application so the avatar in the shared menu does not change as you move
// between them.
export const currentUser: UserSummary = {
	name: 'Olivier Lambert',
	email: 'o.lambert@nixxis.com'
};

/**
 * The mock login accepts any address. An address that is not the known account
 * still gets a readable name rather than a raw email, so the avatar never falls
 * back to a single letter.
 */
export function userFor(email: string | null): UserSummary {
	if (!email || email === currentUser.email) {
		return currentUser;
	}

	const name = email
		.split('@')[0]
		.split(/[._-]+/)
		.filter(Boolean)
		.map((part) => part[0].toUpperCase() + part.slice(1))
		.join(' ');

	return { name: name || email, email };
}

// The package stamps data-palette; app.css decides what each one means.
export const palettes: PaletteOption[] = [
	{ id: 'neutral', label: 'Neutral', swatch: '#343434' },
	{ id: 'blue', label: 'Blue', swatch: '#2a78d6' },
	{ id: 'emerald', label: 'Emerald', swatch: '#1baf7a' },
	{ id: 'amber', label: 'Amber', swatch: '#eda100' }
];
