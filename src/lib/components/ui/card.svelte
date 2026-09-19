<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = { class?: string; children: Snippet } & HTMLAttributes<HTMLDivElement>;

	let { class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn('bg-card text-card-foreground rounded-xl border shadow-sm', className)}
	{...rest}
>
	{@render children()}
</div>
