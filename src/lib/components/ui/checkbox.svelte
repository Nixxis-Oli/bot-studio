<script lang="ts">
	import { cn } from '$lib/utils';
	import Check from '@lucide/svelte/icons/check';
	import { Checkbox } from 'bits-ui';

	// `onchange` is for the header checkbox, whose state is derived from the
	// selection rather than owned by it - binding would fight the derivation.
	//
	// `presentational` is for the one inside a card: there the whole card is the
	// control, so the box must only show state. Left interactive it would take
	// the click as well and toggle twice.
	type Props = {
		checked: boolean;
		label?: string;
		class?: string;
		presentational?: boolean;
		onchange?: (checked: boolean) => void;
	};

	let {
		checked = $bindable(),
		label,
		class: className,
		presentational = false,
		onchange
	}: Props = $props();
</script>

<Checkbox.Root
	{checked}
	onCheckedChange={(next) => {
		checked = next === true;
		onchange?.(checked);
	}}
	aria-label={presentational ? undefined : label}
	aria-hidden={presentational ? 'true' : undefined}
	tabindex={presentational ? -1 : 0}
	class={cn(
		'border-input focus-visible:ring-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-[4px] border shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
		presentational && 'pointer-events-none',
		className
	)}
>
	{#snippet children({ checked: isChecked })}
		{#if isChecked}
			<Check class="size-3.5" />
		{/if}
	{/snippet}
</Checkbox.Root>
