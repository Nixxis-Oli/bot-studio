<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import { createTour, spotlightPath, type TourStep } from '$lib/tour.svelte';
	import CircleHelp from '@lucide/svelte/icons/circle-help';
	import X from '@lucide/svelte/icons/x';
	import { Popover, Portal } from 'bits-ui';

	// A guided walkthrough built on bits-ui alone. Popover does the anchoring and
	// the flipping through its customAnchor prop; the step machine, the backdrop
	// and the spotlight are ours - see $lib/tour.svelte.ts.
	const steps: TourStep[] = [
		{
			id: 'welcome',
			title: 'Welcome to ConnectionCode',
			description: 'A short tour of the chat bots screen. Two minutes, no more.'
		},
		{
			id: 'sidebar',
			target: '[data-tour="sidebar"]',
			placement: 'right',
			title: 'Navigation',
			description: 'Every section lives here. Ctrl+B hides the panel when you need room.',
			whenHidden: {
				target: '[data-tour="sidebar-toggle"]',
				placement: 'bottom',
				title: 'Navigation',
				description: 'The panel is hidden right now. This button brings it back - it holds every section of the application.'
			}
		},
		{
			id: 'filter',
			target: '[data-tour="filter"]',
			placement: 'bottom',
			title: 'Find a bot',
			description: 'Filters on name, description and bot name as you type.'
		},
		{
			id: 'card',
			target: '[data-tour="first-card"]',
			placement: 'bottom',
			title: 'Open a bot',
			description: 'Each card opens the edit screen: identity, personality, models.'
		}
	];

	const tour = createTour(steps);

	// The spotlight is drawn in viewport coordinates, so it has to follow
	// scrolling and resizing. The popover repositions itself.
	$effect(() => {
		if (!tour.open) {
			return;
		}

		const remeasure = () => tour.measure();

		window.addEventListener('scroll', remeasure, true);
		window.addEventListener('resize', remeasure);

		return () => {
			window.removeEventListener('scroll', remeasure, true);
			window.removeEventListener('resize', remeasure);
		};
	});

	function onkeydown(event: KeyboardEvent) {
		if (!tour.open) {
			return;
		}

		if (event.key === 'Escape') {
			tour.dismiss();
		} else if (event.key === 'ArrowRight') {
			tour.next();
		} else if (event.key === 'ArrowLeft') {
			tour.prev();
		}
	}
</script>

<svelte:window {onkeydown} />

<Button variant="outline" size="sm" onclick={() => tour.start()}>
	<CircleHelp class="size-4" />
	Take the tour
</Button>

{#snippet card()}
	<div class="flex items-start justify-between gap-3">
		<h2 class="font-semibold">{tour.copy?.title}</h2>
		<button
			type="button"
			onclick={() => tour.dismiss()}
			aria-label="Close tour"
			class="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
		>
			<X class="size-4" />
		</button>
	</div>

	<p class="text-muted-foreground text-sm">{tour.copy?.description}</p>

	<div class="flex items-center justify-between gap-3 border-t pt-3">
		<span class="text-muted-foreground text-xs">{tour.progress}</span>

		<div class="flex gap-2">
			{#if !tour.isFirst}
				<Button variant="outline" size="sm" onclick={() => tour.prev()}>Back</Button>
			{/if}
			<Button size="sm" onclick={() => tour.next()}>
				{tour.isLast ? 'Done' : tour.isFirst ? 'Start' : 'Next'}
			</Button>
		</div>
	</div>
{/snippet}

<!--
	Every overlay is portalled to <body>. The trigger sits in a bar carrying
	backdrop-blur, and backdrop-filter makes an ancestor the containing block for
	position:fixed descendants - without this, the backdrop, the spotlight and the
	panels are all laid out against that bar rather than the viewport.
-->
{#if tour.open}
	<Portal>
	<!-- Clipped with the even-odd rule, so the highlighted element keeps its own
		 colours and stays sharp through the blur. -->
	<div
		class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
		style:clip-path={spotlightPath(tour.rect, tour.viewport.w, tour.viewport.h)}
		onclick={() => tour.dismiss()}
		role="presentation"
	></div>

	{#if tour.rect}
		<div
			class="ring-background/70 pointer-events-none fixed z-40 rounded-[10px] ring-2"
			style:left="{tour.rect.x - 8}px"
			style:top="{tour.rect.y - 8}px"
			style:width="{tour.rect.width + 16}px"
			style:height="{tour.rect.height + 16}px"
		></div>
	{/if}
	</Portal>
{/if}

{#if tour.open && tour.rect && tour.copy}
	<!-- Anchored to the highlighted element. Popover keeps it in view, flipping
		 side when there is no room. -->
	<Popover.Root open>
		<Popover.Portal>
		<Popover.Content
			customAnchor={tour.copy.target}
			side={tour.copy.placement ?? 'bottom'}
			sideOffset={14}
			trapFocus={false}
			escapeKeydownBehavior="ignore"
			interactOutsideBehavior="ignore"
			class="bg-popover text-popover-foreground z-50 w-80 max-w-[calc(100vw-2rem)] space-y-3 rounded-lg border p-4 shadow-xl"
		>
			<Popover.Arrow class="text-popover" width={12} height={6} />
			{@render card()}
		</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
{:else if tour.open}
	<!-- No target - absent, hidden or scrolled out of view: a centred panel
		 rather than an anchor onto nothing. -->
	<Portal>
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div
			class="bg-popover text-popover-foreground w-80 max-w-[calc(100vw-2rem)] space-y-3 rounded-lg border p-4 shadow-xl"
		>
			{@render card()}
		</div>
	</div>
	</Portal>
{/if}
