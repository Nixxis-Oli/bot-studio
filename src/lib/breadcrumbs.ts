import { base } from '$app/paths';
import { navSections } from '$lib/nav';

export interface Crumb {
	label: string;
	href: string;
}

function labelFor(href: string): string | null {
	for (const section of navSections) {
		const match = section.items.find((item) => item.href === href);

		if (match) {
			return match.label;
		}
	}

	return null;
}

function titleCase(segment: string): string {
	return segment.charAt(0).toUpperCase() + segment.slice(1);
}

// Built from the URL plus whatever the current page loaded, so every screen gets
// a trail without each load function having to declare one. The leaf of a detail
// route is named after the record, falling back to its id.
//
// `pathname` carries the deployment base when the site is served from a
// subdirectory, so it is stripped before splitting and re-applied to each href.
export function buildBreadcrumbs(pathname: string, data: Record<string, unknown>): Crumb[] {
	const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
	const segments = withoutBase.split('/').filter(Boolean);
	const crumbs: Crumb[] = [];

	let href = '';

	segments.forEach((segment, index) => {
		href += `/${segment}`;

		const isLeaf = index === segments.length - 1;
		const record = data.bot as { name?: string } | undefined;

		const label =
			labelFor(href) ?? (isLeaf && record?.name ? record.name : null) ?? titleCase(segment);

		crumbs.push({ label, href: `${base}${href}` });
	});

	return crumbs;
}
