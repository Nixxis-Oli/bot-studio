<script lang="ts">
	import { cn } from '$lib/utils';
	import { Switch } from 'bits-ui';

	type Props = { checked: boolean; name?: string; class?: string };

	let { checked = $bindable(), name, class: className }: Props = $props();
</script>

<Switch.Root
	bind:checked
	{name}
	class={cn(
		'focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
		className
	)}
>
	<Switch.Thumb
		class="bg-background pointer-events-none block size-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
	/>
</Switch.Root>
