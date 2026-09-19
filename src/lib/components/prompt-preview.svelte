<script lang="ts">
	import type { AxisKey } from '$lib/axes';
	import { buildPrompt } from '$lib/prompt';

	// Shows what the personality controls actually produce: the bot's `common`
	// prompt, reassembled on every change. `highlight` marks the line whose axis
	// was touched last, so a move is easy to trace to its sentence.
	type Props = {
		botName: string;
		companyName: string;
		axes: Record<AxisKey, number>;
	};

	let { botName, companyName, axes }: Props = $props();

	const lines = $derived(buildPrompt({ botName, companyName, axes }));
	const text = $derived(lines.map((line) => line.text).join('\n\n'));

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// Clipboard blocked: the text is on screen and selectable anyway.
		}
	}
</script>

<div class="space-y-3">
	<div class="flex items-baseline justify-between gap-3">
		<div>
			<h3 class="text-sm font-semibold">Resulting prompt</h3>
			<p class="text-muted-foreground mt-0.5 text-xs">
				What the controls above resolve to, as the engine assembles it.
			</p>
		</div>
		<button
			type="button"
			onclick={copy}
			class="text-muted-foreground hover:text-foreground shrink-0 text-xs underline underline-offset-4 transition-colors"
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>

	<div class="bg-muted/50 space-y-2 rounded-md border p-4 font-mono text-xs leading-relaxed">
		{#each lines as line (line.key ?? 'preamble')}
			<p class={line.key ? '' : 'text-foreground font-semibold'}>{line.text}</p>
		{/each}
	</div>

	<p class="text-muted-foreground text-xs">
		{lines.length} fragments · {text.length} characters
	</p>
</div>
