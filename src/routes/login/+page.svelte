<script lang="ts">
	import { session } from '$lib/session.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import Label from '$lib/components/ui/label.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let pending = $state(false);

	function submit(event: SubmitEvent) {
		event.preventDefault();

		if (!email.trim() || !password) {
			error = 'Enter both an email and a password.';
			return;
		}

		pending = true;
		session.signIn(email.trim());
	}
</script>

<svelte:head><title>Sign in - ConnectionCode</title></svelte:head>

<div class="grid min-h-screen lg:grid-cols-2">
	<aside class="bg-primary text-primary-foreground hidden flex-col justify-between p-12 lg:flex">
		<div class="flex items-center gap-3">
			<div
				class="bg-primary-foreground text-primary flex size-9 items-center justify-center rounded-lg font-bold"
			>
				C
			</div>
			<span class="text-lg font-semibold">ConnectionCode</span>
		</div>

		<div class="space-y-4">
			<h1 class="text-4xl font-bold tracking-tight">Conversation platform, supervised.</h1>
			<p class="max-w-md text-primary-foreground/70">
				Bots, agent desk, reporting and live supervision in a single administration console.
			</p>
		</div>

		<p class="text-primary-foreground/50 text-sm">shadcn mockup - throwaway</p>
	</aside>

	<main class="flex items-center justify-center p-6">
		<Card class="w-full max-w-sm p-8">
			<header class="space-y-2">
				<h2 class="text-2xl font-semibold tracking-tight">Sign in</h2>
				<p class="text-muted-foreground text-sm">
					Any email and password will do - this mockup fakes the session.
				</p>
			</header>

			<form
				class="mt-6 space-y-4"
				onsubmit={submit}
			>
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="you@nixxis.com"
						bind:value={email}
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" name="password" placeholder="********" bind:value={password} required />
				</div>

				{#if error}
					<p class="text-destructive text-sm">{error}</p>
				{/if}

				<Button type="submit" class="w-full" disabled={pending}>
					{pending ? 'Signing in...' : 'Sign in'}
				</Button>
			</form>

			<p class="text-muted-foreground mt-6 text-center text-xs">
				The real app uses hosted OAuth. This screen only sets a cookie.
			</p>
		</Card>
	</main>
</div>
