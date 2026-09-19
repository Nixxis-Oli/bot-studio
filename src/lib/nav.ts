import Activity from '@lucide/svelte/icons/activity';
import Bot from '@lucide/svelte/icons/bot';
import ChartColumn from '@lucide/svelte/icons/chart-column';
import FileText from '@lucide/svelte/icons/file-text';
import Headset from '@lucide/svelte/icons/headset';
import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
import Settings from '@lucide/svelte/icons/settings';
import type { Component } from 'svelte';

export interface NavItem {
	label: string;
	href: string;
	// Needed once the sidebar can collapse to an icon-only rail.
	icon: Component;
	ready?: boolean;
}

export interface NavSection {
	title: string;
	items: NavItem[];
}

export const navSections: NavSection[] = [
	{
		title: 'Operations',
		items: [
			{ label: 'Overview', href: '/overview', icon: LayoutDashboard },
			{ label: 'Chat bots', href: '/chatbots', icon: Bot, ready: true },
			{ label: 'Agent desk', href: '/agents', icon: Headset }
		]
	},
	{
		title: 'Insights',
		items: [
			{ label: 'Reporting', href: '/reporting', icon: ChartColumn },
			{ label: 'Supervision', href: '/supervision', icon: Activity }
		]
	},
	{
		title: 'Configuration',
		items: [
			{ label: 'Prompts', href: '/prompts', icon: FileText },
			{ label: 'Settings', href: '/settings', icon: Settings }
		]
	}
];
