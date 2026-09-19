<script lang="ts">
	import { cn } from '$lib/utils';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import { Select } from 'bits-ui';

	// The real listbox rather than a styled native <select>: this is what the
	// shadcn-svelte Select costs on bits-ui - trigger, portal, content, viewport,
	// scroll buttons and items, every part dressed by hand.
	type Props = {
		value: string;
		options: string[];
		name?: string;
		id?: string;
		placeholder?: string;
		class?: string;
	};

	let {
		value = $bindable(),
		options,
		name,
		id,
		placeholder = 'Select...',
		class: className
	}: Props = $props();

	// bits-ui uses `items` for typeahead; Item itself takes a value plus a label.
	const items = $derived(options.map((option) => ({ value: option, label: option })));
</script>

<Select.Root type="single" bind:value {name} {items}>
	<Select.Trigger
		{id}
		class={cn(
			'border-input bg-background ring-offset-background data-[placeholder]:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
	>
		<Select.Value {placeholder} />
		<ChevronDown class="text-muted-foreground size-4 shrink-0" />
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			sideOffset={4}
			class="bg-popover text-popover-foreground z-50 max-h-60 w-[var(--bits-select-anchor-width)] min-w-[8rem] overflow-hidden rounded-md border shadow-md"
		>
			<Select.ScrollUpButton class="flex h-6 items-center justify-center">
				<ChevronUp class="size-4" />
			</Select.ScrollUpButton>

			<Select.Viewport class="p-1">
				{#each options as option (option)}
					<Select.Item
						value={option}
						label={option}
						class="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground flex cursor-default items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none select-none"
					>
						{#snippet children({ selected })}
							{option}
							{#if selected}
								<Check class="size-4" />
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>

			<Select.ScrollDownButton class="flex h-6 items-center justify-center">
				<ChevronDown class="size-4" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
