<script lang="ts">
	import { Tooltip } from 'bits-ui';

	// The card is already an <a>, so the trigger must not be a button: nesting
	// interactive elements is invalid HTML. bits-ui's `child` snippet lets us
	// render a plain <span> and still receive the trigger's behaviour props.
	//
	// The span carries no styling of its own on purpose. An underline would make
	// it look like a control, and any cursor rule would override the pointer the
	// surrounding card link already shows.
	type Props = { label: string; detail: string; class?: string };

	let { label, detail, class: className }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<span {...props} class={className}>{label}</span>
			{/snippet}
		</Tooltip.Trigger>

		<Tooltip.Portal>
			<Tooltip.Content
				sideOffset={6}
				class="bg-foreground text-background z-50 rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md"
			>
				<!-- The arrow is an SVG polygon filled with currentColor, so it takes a
					 text colour, not a background - and floating-ui already places and
					 orients it, so it must not be rotated by hand. -->
				<Tooltip.Arrow class="text-foreground" width={11} height={5} />
				{detail}
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
