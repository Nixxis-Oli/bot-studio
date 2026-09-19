import { PUBLIC_APP_BOT_STUDIO, PUBLIC_APP_MONITORING } from '$env/static/public';
import type { AppEntry, PaletteOption } from '@nixxis-oli/ui';

// Both applications declare the same catalogue. In production this would come
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
		id: 'reporting',
		name: 'Reporting',
		href: '#',
		initials: 'RE',
		color: '#2563eb',
		description: 'Scheduled reports and historical analysis.'
	},
	{
		id: 'agents',
		name: 'Agent desk',
		href: '#',
		initials: 'AG',
		color: '#dc2626',
		description: 'Where human agents pick up escalated conversations.'
	}
];

// The package stamps data-palette; app.css decides what each one means.
export const palettes: PaletteOption[] = [
	{ id: 'neutral', label: 'Neutral', swatch: '#343434' },
	{ id: 'blue', label: 'Blue', swatch: '#2a78d6' },
	{ id: 'emerald', label: 'Emerald', swatch: '#1baf7a' },
	{ id: 'amber', label: 'Amber', swatch: '#eda100' }
];
