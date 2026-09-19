<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = { class?: string; children: Snippet } & HTMLLabelAttributes;

	let { class: className, children, ...rest }: Props = $props();
</script>

<label class={cn('text-sm leading-none font-medium', className)} {...rest}>
	{@render children()}
</label>
