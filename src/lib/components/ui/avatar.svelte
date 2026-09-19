<script lang="ts">
	import { cn } from '$lib/utils';
	import { Avatar } from 'bits-ui';

	// bits-ui gives the behaviour (image load/error state, fallback timing).
	// The looks are ours, exactly as in the button above.
	type Props = { src?: string; fallback: string; class?: string };

	let { src, fallback, class: className }: Props = $props();
</script>

<Avatar.Root
	class={cn(
		'bg-secondary text-secondary-foreground relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold',
		className
	)}
>
	{#if src}
		<Avatar.Image {src} alt={fallback} class="size-full object-cover" />
	{/if}
	<Avatar.Fallback>{fallback}</Avatar.Fallback>
</Avatar.Root>
