<script lang="ts">
	import { base } from '$app/paths';
	import Badge from '$lib/components/ui/badge.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Checkbox from '$lib/components/ui/checkbox.svelte';
	import ConfirmDialog from '$lib/components/ui/confirm-dialog.svelte';
	import DateTooltip from '$lib/components/ui/date-tooltip.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { formatDate, formatDateTime, formatRelative } from '$lib/format';
	import { cn } from '$lib/utils';
	import type { Chatbot } from '$lib/data';
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// A local copy, because the bulk actions below change it. The fixture behind
	// `data` is immutable, so "Reset" simply takes it again.
	// untrack: the copy is seeded once. Re-reading `data` reactively would undo
	// a bulk action the moment anything else on the page changed.
	let bots = $state<Chatbot[]>(untrack(() => [...data.chatbots]));

	let query = $state('');
	let selecting = $state(false);
	let selected = $state<string[]>([]);
	let confirmingDelete = $state(false);
	let notice = $state('');

	const filtered = $derived(
		bots.filter((bot) => {
			const needle = query.trim().toLowerCase();
			if (!needle) return true;
			return (
				bot.name.toLowerCase().includes(needle) ||
				bot.description.toLowerCase().includes(needle) ||
				bot.botName.toLowerCase().includes(needle)
			);
		})
	);

	const allVisibleSelected = $derived(
		filtered.length > 0 && filtered.every((bot) => selected.includes(bot.id))
	);
	const touched = $derived(bots.length !== data.chatbots.length || bots.some((bot, i) => bot.published !== data.chatbots[i]?.published));

	function toggle(id: string) {
		selected = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
	}

	function toggleAllVisible() {
		const visible = filtered.map((bot) => bot.id);
		selected = allVisibleSelected
			? selected.filter((id) => !visible.includes(id))
			: [...new Set([...selected, ...visible])];
	}

	function leaveSelection() {
		selecting = false;
		selected = [];
	}

	// Static demo: both actions change the local list only, never the snapshot.
	function publish() {
		const count = selected.length;
		bots = bots.map((bot) => (selected.includes(bot.id) ? { ...bot, published: true } : bot));
		notice = `${count} bot${count > 1 ? 's' : ''} marked as published — in this page only.`;
		leaveSelection();
	}

	function remove() {
		const count = selected.length;
		bots = bots.filter((bot) => !selected.includes(bot.id));
		notice = `${count} bot${count > 1 ? 's' : ''} removed from the list — in this page only.`;
		confirmingDelete = false;
		leaveSelection();
	}

	function reset() {
		bots = [...data.chatbots];
		notice = '';
		leaveSelection();
	}
</script>

<svelte:head><title>Chat bots - ConnectionCode</title></svelte:head>

<header class="bg-card border-b px-4 py-5 md:px-8 md:py-6">
	<div class="flex flex-wrap items-end justify-between gap-4">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Chat bots</h1>
			<p class="text-muted-foreground mt-1 text-sm">
				Read-only view of the contexts served by the admin API.
			</p>
		</div>

		<div class="flex w-full flex-wrap items-center gap-3 sm:w-auto">
			<Badge variant="muted">{bots.length} contexts</Badge>
			<div data-tour="filter" class="min-w-0 flex-1 sm:flex-none">
				<Input
					class="w-full sm:w-56"
					type="search"
					placeholder="Filter bots..."
					bind:value={query}
				/>
			</div>
			<Button
				variant={selecting ? 'secondary' : 'outline'}
				size="sm"
				onclick={() => (selecting ? leaveSelection() : (selecting = true))}
			>
				{selecting ? 'Done' : 'Select'}
			</Button>
		</div>
	</div>
</header>

{#if selecting}
	<!-- Sticky under the breadcrumb bar so the actions stay reachable while scrolling. -->
	<div class="bg-muted/60 sticky top-[3.25rem] z-10 border-b px-4 py-3 backdrop-blur md:px-8">
		<div class="flex flex-wrap items-center gap-3">
			<Checkbox
				checked={allVisibleSelected}
				label="Select every visible bot"
				onchange={toggleAllVisible}
			/>

			<span class="text-sm">
				<span class="font-medium">{selected.length}</span>
				<span class="text-muted-foreground">of {filtered.length} selected</span>
			</span>

			<div class="ms-auto flex items-center gap-2">
				<Button variant="outline" size="sm" disabled={!selected.length} onclick={publish}>
					Publish
				</Button>
				<Button
					variant="destructive"
					size="sm"
					disabled={!selected.length}
					onclick={() => (confirmingDelete = true)}
				>
					Delete
				</Button>
			</div>
		</div>
	</div>
{/if}

<div class="space-y-5 p-4 md:p-8">
	{#if notice}
		<Card class="border-primary/40 bg-primary/5 flex flex-wrap items-center gap-3 p-4 text-sm">
			<span class="font-medium">{notice}</span>
			{#if touched}
				<button type="button" class="ms-auto text-xs underline underline-offset-4" onclick={reset}>
					Reset demo data
				</button>
			{/if}
		</Card>
	{/if}

	{#if data.error}
		<Card class="border-destructive/40 bg-destructive/5 p-4">
			<p class="text-destructive font-semibold">The admin API could not be reached.</p>
			<p class="text-muted-foreground mt-1 text-sm">{data.error}</p>
		</Card>
	{:else if filtered.length === 0}
		<Card class="p-10 text-center">
			<p class="font-semibold">
				{query ? `No bot matches "${query}"` : 'No bot left in the list'}
			</p>
			<p class="text-muted-foreground mt-1 text-sm">
				{query ? 'Clear the filter to see every context.' : 'Reset the demo data to bring them back.'}
			</p>
			{#if !query && touched}
				<Button variant="outline" size="sm" class="mt-4" onclick={reset}>Reset demo data</Button>
			{/if}
		</Card>
	{:else}
		<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
			{#each filtered as bot, index (bot.id)}
				{@const isSelected = selected.includes(bot.id)}

				{#snippet body()}
					<Card
						class={cn(
							'flex h-full flex-col gap-4 p-5 text-left transition-colors',
							isSelected ? 'border-primary ring-primary/30 ring-2' : 'hover:border-primary/40'
						)}
					>
						<div class="flex items-start justify-between gap-3">
							<div class="flex min-w-0 items-start gap-3">
								{#if selecting}
									<Checkbox checked={isSelected} presentational class="mt-1" />
								{/if}
								<div class="min-w-0">
									<h2 class="truncate text-lg font-semibold">{bot.name || 'Untitled'}</h2>
									<p class="text-muted-foreground font-mono text-xs">{bot.id}</p>
								</div>
							</div>
							<Badge variant={bot.published ? 'success' : 'muted'}>
								{bot.published ? 'Published' : 'Draft'}
							</Badge>
						</div>

						<p class="text-muted-foreground min-h-10 text-sm">{bot.description}</p>

						{#if bot.models.length}
							<div class="flex flex-wrap gap-1.5">
								{#each bot.models as model (model)}
									<Badge variant="outline">{model}</Badge>
								{/each}
							</div>
						{/if}

						<dl class="grid grid-cols-2 gap-3 border-t pt-4 text-xs">
							<div>
								<dt class="text-muted-foreground">Created</dt>
								<dd class="mt-0.5 font-medium">
									{#if selecting}
										{formatDate(bot.createdAt)}
									{:else}
										<DateTooltip
											label={formatDate(bot.createdAt)}
											detail={formatDateTime(bot.createdAt)}
										/>
									{/if}
								</dd>
							</div>
							<div>
								<dt class="text-muted-foreground">Modified</dt>
								<dd class="mt-0.5 font-medium">
									{#if selecting}
										{formatRelative(bot.updatedAt)}
									{:else}
										<DateTooltip
											label={formatRelative(bot.updatedAt)}
											detail={formatDateTime(bot.updatedAt)}
										/>
									{/if}
								</dd>
							</div>
						</dl>

						<div class="text-muted-foreground flex gap-4 text-xs">
							<span>{bot.topicsCount} topics</span>
							<span>{bot.promptModes.length} prompts</span>
							<span>{bot.versionsCount} versions</span>
						</div>
					</Card>
				{/snippet}

				<!-- In selection mode the card must toggle, not navigate - and a link
					 cannot hold a checkbox, so it becomes a button. -->
				{#if selecting}
					<button
						type="button"
						class="block w-full"
						aria-pressed={isSelected}
						onclick={() => toggle(bot.id)}
						data-tour={index === 0 ? 'first-card' : undefined}
					>
						{@render body()}
					</button>
				{:else}
					<a
						href="{base}/chatbots/{bot.id}"
						class="block"
						data-tour={index === 0 ? 'first-card' : undefined}
					>
						{@render body()}
					</a>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<ConfirmDialog
	bind:open={confirmingDelete}
	title="Delete {selected.length} bot{selected.length > 1 ? 's' : ''}?"
	description="This demo removes them from the list only. Nothing is written to the admin API, and Reset brings them back."
	confirmLabel="Delete"
	onconfirm={remove}
/>
