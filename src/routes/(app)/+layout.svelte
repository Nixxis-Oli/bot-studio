<script lang="ts">
	import { base } from '$app/paths';
	import { introHref } from '$lib/paths';
	import { page } from '$app/state';
	import { buildBreadcrumbs } from '$lib/breadcrumbs';
	import Badge from '$lib/components/ui/badge.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { navSections } from '$lib/nav';
	import { session } from '$lib/session.svelte';
	import { createSidebar, MAX_WIDTH, MIN_WIDTH } from '$lib/sidebar.svelte';
	import { cn } from '$lib/utils';
	import ProductTour from '$lib/components/product-tour.svelte';
	import { apps, palettes } from '$lib/apps';
	import { ToolbarActions } from '@nixxis-oli/ui';
	import PanelLeft from '@lucide/svelte/icons/panel-left';

	import { goto } from '$app/navigation';

	let { children }: { children: any } = $props();

	const crumbs = $derived(buildBreadcrumbs(page.url.pathname, page.data));


	const sidebar = createSidebar();

	// The tour walks the chat bots list, so its button belongs beside that
	// breadcrumb - not on a detail screen where its steps have no targets.
	const onListScreen = $derived(
		page.url.pathname === `${base}/chatbots` || page.url.pathname === `${base}/chatbots/`
	);

	// The pre-paint script in app.html sets --sidebar-width on :root; this
	// keeps it in step while the handle is dragged.
	$effect(() => {
		document.documentElement.style.setProperty('--sidebar-width', `${sidebar.width}px`);
	});

	// No server to gate the route in a prerendered build, so the guard runs
	// in the browser. It protects nothing real - the session is fake.
	$effect(() => {
		if (!session.user) {
			goto(`${base}/login`);
		}
	});
</script>

<svelte:window onkeydown={(event) => sidebar.handleShortcut(event)} />

<!--
	Offcanvas collapse, the way shadcn's own Sidebar does it: two cooperating
	layers rather than one shrinking element.

	1. A spacer in normal flow that animates its width to 0. This is what makes
	   the main content reflow smoothly instead of jumping.
	2. A fixed panel that slides to left:-{width}. Because it is fixed and keeps
	   its width throughout, its contents never reflow while animating - which is
	   what makes the motion look clean rather than squashed.

	Both run transition-[left,width] duration-200 ease-linear, so they stay in step.
-->
<div class="bg-background flex min-h-screen w-full">
	{#if sidebar.mobileOpen}
		<button
			type="button"
			aria-label="Close navigation"
			class="fixed inset-0 z-40 bg-black/50 md:hidden"
			onclick={() => sidebar.closeMobile()}
		></button>
	{/if}

	<div
		class={cn(
			'relative hidden shrink-0 bg-transparent md:block',
			sidebar.dragging ? '' : 'transition-[width] duration-200 ease-linear',
			sidebar.collapsed ? 'w-0' : 'w-(--sidebar-width)'
		)}
	></div>

	<aside
		data-tour="sidebar"
		data-state={sidebar.collapsed ? 'collapsed' : 'expanded'}
		class={cn(
			'bg-card fixed inset-y-0 z-50 flex h-svh w-(--sidebar-width) flex-col border-r md:z-20',
			sidebar.dragging ? '' : 'transition-[left] duration-200 ease-linear',
			sidebar.mobileOpen ? 'left-0' : 'left-[calc(var(--sidebar-width)*-1)]',
			sidebar.collapsed ? 'md:left-[calc(var(--sidebar-width)*-1)]' : 'md:left-0'
		)}
	>
		<a
			href={introHref}
			title="Back to the mockup index"
			class="hover:bg-accent flex h-[4.25rem] shrink-0 items-center gap-3 border-b px-5 transition-colors"
		>
			<div
				class="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-lg font-bold"
			>
				C
			</div>
			<div class="min-w-0">
				<p class="truncate font-semibold">ConnectionCode</p>
				<p class="text-muted-foreground text-xs">Administration</p>
			</div>
		</a>

		<nav class="flex-1 space-y-6 overflow-y-auto p-4">
			{#each navSections as section (section.title)}
				<div class="space-y-1">
					<p class="text-muted-foreground px-3 text-xs font-semibold tracking-wider uppercase">
						{section.title}
					</p>

					{#each section.items as item (item.href)}
						{@const active = page.url.pathname.startsWith(`${base}${item.href}`)}
						<a
							href="{base}{item.href}"
							class={cn(
								'flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors',
								active
									? 'bg-primary text-primary-foreground font-medium'
									: 'hover:bg-accent hover:text-accent-foreground'
							)}
						>
							<span class="flex min-w-0 items-center gap-3">
								<item.icon class="size-4 shrink-0" />
								<span class="truncate">{item.label}</span>
							</span>
							{#if !item.ready}
								<Badge variant="muted" class="shrink-0 px-1.5 py-0 text-[10px]">soon</Badge>
							{/if}
						</a>
					{/each}
				</div>
			{/each}
		</nav>

		<!-- Resize handle: a hairline with a wider hit area, draggable, focusable
			 and double-clickable to restore the default width. -->
		<!-- WAI-ARIA's window-splitter pattern: a focusable separator carrying
			 aria-valuenow IS a widget. Svelte's a11y lint treats `separator` as
			 always non-interactive and rejects it on a button, so the rule is
			 silenced here rather than the semantics being made wrong. -->
		<!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
		<button
			type="button"
			role="separator"
			aria-label="Resize sidebar"
			aria-orientation="vertical"
			aria-valuenow={sidebar.width}
			aria-valuemin={MIN_WIDTH}
			aria-valuemax={MAX_WIDTH}
			tabindex="0"
			onpointerdown={(event) => sidebar.startResize(event)}
			onkeydown={(event) => sidebar.handleResizeKey(event)}
			ondblclick={() => sidebar.resetWidth()}
			class="group absolute inset-y-0 -right-1 z-10 hidden w-2 cursor-col-resize touch-none focus:outline-none md:block"
		>
			<span
				class="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors bg-border group-hover:bg-primary group-focus-visible:bg-primary {sidebar.dragging ? 'bg-primary' : ''}"
			></span>
		</button>
	</aside>

	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Sticky so the trail, and the only way back to a hidden sidebar, stay on screen. -->
		<div
			class="bg-card/90 sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-3 backdrop-blur md:px-8"
		>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				class="-ms-1 size-8 shrink-0"
				onclick={() => sidebar.toggle()}
				title="Toggle sidebar (Ctrl+B)"
				aria-label="Toggle sidebar"
				aria-expanded={!sidebar.collapsed}
			>
				<PanelLeft class="size-4" />
			</Button>

			<div class="h-5 border-l"></div>

			<nav aria-label="Breadcrumb" class="min-w-0">
				<ol class="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
					{#each crumbs as crumb, index (crumb.href)}
						{#if index > 0}
							<li aria-hidden="true">/</li>
						{/if}
						<li>
							{#if index === crumbs.length - 1}
								<span class="text-foreground font-medium" aria-current="page">{crumb.label}</span>
							{:else}
								<a class="hover:text-foreground transition-colors" href={crumb.href}>
									{crumb.label}
								</a>
							{/if}
						</li>
					{/each}
				</ol>
			</nav>

			{#if onListScreen}
				<!-- The tour's second step points at the sidebar, so it has to be on
					 screen before that step is measured. -->
				<ProductTour onStepEnter={(id) => id === 'sidebar' && sidebar.reveal()} />
			{/if}

			<ToolbarActions
				{apps}
				{palettes}
				currentAppId="bot-studio"
				user={{ name: session.user ?? 'Signed in', email: session.user ?? undefined }}
				onSignOut={() => session.signOut()}
				class="ms-auto"
			/>
		</div>

		{@render children()}
	</div>
</div>
