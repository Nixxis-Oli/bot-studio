<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
		variants: {
			variant: {
				default: 'border-transparent bg-primary text-primary-foreground',
				secondary: 'border-transparent bg-secondary text-secondary-foreground',
				success: 'border-transparent bg-success text-success-foreground',
				outline: 'text-foreground',
				muted: 'border-transparent bg-muted text-muted-foreground'
			}
		},
		defaultVariants: { variant: 'default' }
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = { variant?: BadgeVariant; class?: string; children: Snippet };

	let { variant = 'default', class: className, children }: Props = $props();
</script>

<span class={cn(badgeVariants({ variant }), className)}>{@render children()}</span>
