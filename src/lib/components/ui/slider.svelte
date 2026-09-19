<script lang="ts">
	import { cn } from '$lib/utils';
	import { Slider } from 'bits-ui';

	// bits-ui's Slider has no `name` prop, unlike its Switch: it never renders a
	// hidden input, so form submission is on us (see the caller's hidden field).
	type Props = {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		class?: string;
	};

	let { value = $bindable(), min = 1, max = 5, step = 1, class: className }: Props = $props();
</script>

<Slider.Root
	type="single"
	bind:value
	{min}
	{max}
	{step}
	class={cn('relative flex h-5 w-full touch-none items-center select-none', className)}
>
	{#snippet children()}
		<span class="bg-secondary relative h-1.5 w-full grow overflow-hidden rounded-full">
			<Slider.Range class="bg-primary absolute h-full" />
		</span>
		<Slider.Thumb
			index={0}
			class="border-primary bg-background ring-ring block size-4 cursor-grab rounded-full border-2 shadow transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:cursor-grabbing"
		/>
	{/snippet}
</Slider.Root>
