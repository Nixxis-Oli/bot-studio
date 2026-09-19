<script lang="ts">
	import Button from '$lib/components/ui/button.svelte';
	import { AlertDialog } from 'bits-ui';

	// bits-ui ships a dedicated AlertDialog, which already carries the right role
	// and traps focus on the cancel action - the correct primitive for a
	// destructive confirmation.
	type Props = {
		open: boolean;
		title: string;
		description: string;
		confirmLabel?: string;
		onconfirm: () => void;
	};

	let {
		open = $bindable(),
		title,
		description,
		confirmLabel = 'Confirm',
		onconfirm
	}: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<AlertDialog.Content
			class="bg-popover text-popover-foreground fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-lg border p-6 shadow-xl"
		>
			<div class="space-y-1.5">
				<AlertDialog.Title class="text-lg font-semibold">{title}</AlertDialog.Title>
				<AlertDialog.Description class="text-muted-foreground text-sm">
					{description}
				</AlertDialog.Description>
			</div>

			<div class="flex justify-end gap-2">
				<AlertDialog.Cancel>
					{#snippet child({ props })}
						<Button {...props} variant="outline">Cancel</Button>
					{/snippet}
				</AlertDialog.Cancel>
				<AlertDialog.Action onclick={onconfirm}>
					{#snippet child({ props })}
						<Button {...props} variant="destructive">{confirmLabel}</Button>
					{/snippet}
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
