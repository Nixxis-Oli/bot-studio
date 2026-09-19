<script lang="ts">
	import { base } from '$app/paths';
	import Card from '$lib/components/ui/card.svelte';
</script>

<svelte:head><title>Reporting - ConnectionCode</title></svelte:head>

<header class="bg-card border-b px-8 py-6">
	<h1 class="text-2xl font-semibold tracking-tight">Reporting</h1>
</header>

<div class="p-8">
	<Card class="p-10 text-center">
		<p class="font-semibold">Not part of the mockup</p>
		<p class="text-muted-foreground mt-1 text-sm">
			Only <a class="text-primary underline underline-offset-4" href="{base}/chatbots">Chat bots</a> talks
			to the real admin API.
		</p>
	</Card>
</div>
