<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { page } from "$app/stores";
	import { trpc } from "$lib/trpc/client";
	import { slide } from "svelte/transition";

	let email = "";
	let password = "";

	$: isRegister = $page.url.searchParams.get("isRegister") === "true";

	let confirmPassword = "";

	let error: string | null = null;
	$: {
		if (isRegister || !isRegister) {
			error = null;
		}
	}
</script>

<div class="m-auto w-full max-w-4xl">
	<h1 class="h1 mb-1">
		{#if isRegister}
			Register
		{:else}
			Login
		{/if}
	</h1>
	<p class="italic">
		Log in with the demo user by using the email <u>demo@stp-starter.cpnx.eu</u>
		with any password
	</p>
	<br />

	<div class="card p-4">
		<form
			class="flex flex-col"
			on:submit|preventDefault={async () => {
				error = "";
				if (isRegister && password !== confirmPassword) {
					error = "Passwords do not match";
					return;
				}
				if (isRegister) {
					const res = await trpc()((client) =>
						client.account.register.mutate({ email, password })
					);

					if (!res.success) {
						error = res.error;
						return;
					}
				} else {
					const res = await trpc()((client) =>
						client.account.login.mutate({ email, password })
					);

					if (!res.success) {
						error = res.error;
						return;
					}
				}

				await invalidate("account:me");

				const callbackPath = $page.url.searchParams.get("callbackPath");
				if (callbackPath === null) {
					goto("/account");
				} else {
					const url = new URL(callbackPath, $page.url.origin);
					goto(url.pathname);
				}
			}}
		>
			<label class="label mb-2">
				<span>Email</span>
				<input
					type="email"
					class="input p-2 px-4"
					placeholder="email@example.com"
					bind:value={email}
				/>
			</label>
			<label class="label mb-2">
				<span>Password</span>
				<input
					type="password"
					class="input p-2 px-4"
					placeholder="•••••••"
					bind:value={password}
				/>
			</label>
			{#if isRegister}
				<label class="label mb-2" transition:slide>
					<span>Confirm password</span>
					<input
						type="password"
						class="input p-2 px-4"
						placeholder="•••••••"
						bind:value={confirmPassword}
					/>
				</label>
			{/if}
			{#if error}
				<span class="variant-filled-error badge mb-2" transition:slide>
					{error}
				</span>
			{/if}
			<div class="mt-2 flex justify-end gap-2">
				{#if isRegister}
					<a href="?isRegister=false" class="anchor mr-auto mt-auto">
						Already have an account? Go to login »
					</a>
				{/if}
				{#if !isRegister}
					<a class="variant-filled-surface btn" href="?isRegister=true">
						Register
					</a>
				{/if}
				<button class="variant-filled-primary btn" type="submit">
					{!isRegister ? "Login" : "Register"}
				</button>
			</div>
		</form>
	</div>
</div>
