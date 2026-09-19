<script lang="ts">
	import { personalityAxes } from '$lib/axes';
	import { wordingFor } from '$lib/axis-wording';
	import AxisControl from '$lib/components/axis-control.svelte';
	import PromptPreview from '$lib/components/prompt-preview.svelte';
	import Badge from '$lib/components/ui/badge.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';
	import Select from '$lib/components/ui/select.svelte';
	import Slider from '$lib/components/ui/slider.svelte';
	import Switch from '$lib/components/ui/switch.svelte';
	import DateTooltip from '$lib/components/ui/date-tooltip.svelte';
	import { formatDate, formatDateTime, formatRelative } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const models = ['haiku', 'sonnet', 'nova-lite', 'nova-pro', 'mistral-large'];

	// Local edit buffer. Cancel restores it from the server-loaded bot, which is
	// why the draft is a plain copy rather than a binding onto `data`.
	function freshDraft() {
		return {
			name: data.bot.name,
			botName: data.bot.botName,
			companyName: data.bot.companyName,
			mainModel: data.bot.mainModel,
			lightModel: data.bot.lightModel,
			allowDebug: data.bot.allowDebug,
			maxTokens: data.bot.maxTokens,
			axes: { ...data.bot.axes }
		};
	}

	let draft = $state(freshDraft());
	let pending = $state(false);
	let saved = $state(false);

	// Static demo: nothing is written anywhere. The button exercises the
	// form's own state so the screen behaves as it would against an API.
	function save(event: SubmitEvent) {
		event.preventDefault();
		pending = true;

		setTimeout(() => {
			pending = false;
			saved = true;
		}, 300);
	}

	const dirty = $derived(JSON.stringify(draft) !== JSON.stringify(freshDraft()));
</script>

<svelte:head><title>{data.bot.name} - ConnectionCode</title></svelte:head>

<form onsubmit={save}>
	<header class="bg-card border-b px-8 py-5">
		<!-- The breadcrumb now lives in the app layout, so it shows on every screen. -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div>
				<h1 class="text-2xl font-semibold tracking-tight">{draft.name || 'Untitled'}</h1>
				<p class="text-muted-foreground font-mono text-xs">{data.bot.id}</p>
			</div>

			<div class="flex items-center gap-2">
				{#if dirty}
					<Badge variant="outline">Unsaved changes</Badge>
				{/if}
				<Button
					type="button"
					variant="outline"
					disabled={!dirty || pending}
					onclick={() => (draft = freshDraft())}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={!dirty || pending}>
					{pending ? 'Saving...' : 'Save'}
				</Button>
			</div>
		</div>
	</header>

	<div class="space-y-6 p-8">
		{#if saved}
			<Card class="border-primary/40 bg-primary/5 p-4 text-sm">
				<p class="font-semibold">Saved in the page only - this static demo writes nowhere.</p>
				<p class="text-muted-foreground mt-1">
					The data is a snapshot captured from the admin API, bundled with the build.
				</p>
			</Card>
		{/if}

		<div class="grid gap-6 lg:grid-cols-3">
			<div class="space-y-6 lg:col-span-2">
				<Card class="space-y-4 p-6">
					<h2 class="text-lg font-semibold">Identity</h2>

					<div class="space-y-2">
						<Label for="name">Context name</Label>
						<Input id="name" name="name" bind:value={draft.name} required />
					</div>

					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="botName">Bot name</Label>
							<Input id="botName" name="botName" bind:value={draft.botName} />
						</div>
						<div class="space-y-2">
							<Label for="companyName">Company name</Label>
							<Input id="companyName" name="companyName" bind:value={draft.companyName} />
						</div>
					</div>
				</Card>

				<Card class="space-y-5 p-6">
					<div>
						<h2 class="text-lg font-semibold">Personality</h2>
						<p class="text-muted-foreground mt-1 text-sm">
							The five <code class="font-mono">&lt;axis&gt;Level</code> settings the guided setup
							writes. Most run 1-5; warmth and initiative carry three positions.
						</p>
					</div>

					{#each personalityAxes as axis (axis.key)}
						<AxisControl
							name={axis.key}
							label={axis.label}
							low={axis.low}
							high={axis.high}
							levels={axis.levels}
							wording={wordingFor(axis.key, draft.axes[axis.key])}
							bind:value={draft.axes[axis.key]}
						/>
					{/each}

					<div class="border-t pt-5">
						<PromptPreview
							botName={draft.botName}
							companyName={draft.companyName}
							axes={draft.axes}
						/>
					</div>
				</Card>

				<Card class="space-y-4 p-6">
					<h2 class="text-lg font-semibold">Models</h2>

					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="mainModel">Main model</Label>
							<Select
								id="mainModel"
								name="mainModel"
								options={models}
								bind:value={draft.mainModel}
							/>
						</div>
						<div class="space-y-2">
							<Label for="lightModel">Light model</Label>
							<Select
								id="lightModel"
								name="lightModel"
								options={models}
								bind:value={draft.lightModel}
							/>
						</div>
					</div>

					<div class="space-y-2">
						<div class="flex items-baseline justify-between">
							<Label for="maxTokens">Max tokens</Label>
							<Badge variant="secondary">{draft.maxTokens}</Badge>
						</div>
						<Slider bind:value={draft.maxTokens} min={512} max={16384} step={512} />
						<input type="hidden" name="maxTokens" value={draft.maxTokens} />
					</div>

					<div class="flex items-center justify-between gap-4 border-t pt-4">
						<Label for="allowDebug">Allow debug output</Label>
						<Switch name="allowDebug" bind:checked={draft.allowDebug} />
					</div>
				</Card>
			</div>

			<aside class="space-y-6">
				<Card class="space-y-3 p-6">
					<h2 class="text-lg font-semibold">Metadata</h2>

					<dl class="space-y-3 text-sm">
						<div class="flex justify-between gap-3">
							<dt class="text-muted-foreground">Created</dt>
							<dd class="text-right font-medium">
								<DateTooltip
									label={formatDate(data.bot.createdAt)}
									detail={formatDateTime(data.bot.createdAt)}
								/>
							</dd>
						</div>
						<div class="flex justify-between gap-3">
							<dt class="text-muted-foreground">Modified</dt>
							<dd class="text-right font-medium">
								<DateTooltip
									label={formatRelative(data.bot.updatedAt)}
									detail={formatDateTime(data.bot.updatedAt)}
								/>
							</dd>
						</div>
						<div class="flex justify-between gap-3">
							<dt class="text-muted-foreground">Versions</dt>
							<dd class="font-medium">{data.bot.versionsCount}</dd>
						</div>
						<div class="flex justify-between gap-3">
							<dt class="text-muted-foreground">Default version</dt>
							<dd class="font-medium">{data.bot.defaultVersion ?? 'None'}</dd>
						</div>
					</dl>
				</Card>

				<Card class="space-y-3 p-6">
					<h2 class="text-lg font-semibold">Topics</h2>
					{#if data.bot.topics.length}
						<ul class="space-y-2 text-sm">
							{#each data.bot.topics as topic (topic.key)}
								<li class="flex items-center justify-between gap-2">
									<span class="truncate font-mono text-xs">{topic.key}</span>
									<span class="flex shrink-0 gap-1">
										{#if topic.default}
											<Badge variant="success">default</Badge>
										{/if}
										<Badge variant="muted">{topic.model}</Badge>
									</span>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-muted-foreground text-sm">No topic configured.</p>
					{/if}
				</Card>

				<Card class="space-y-3 p-6">
					<h2 class="text-lg font-semibold">Prompt modes</h2>
					{#if data.bot.promptModes.length}
						<div class="flex flex-wrap gap-1.5">
							{#each data.bot.promptModes as mode (mode)}
								<Badge variant="outline">{mode}</Badge>
							{/each}
						</div>
					{:else}
						<p class="text-muted-foreground text-sm">No prompt configured.</p>
					{/if}
				</Card>
			</aside>
		</div>
	</div>
</form>
