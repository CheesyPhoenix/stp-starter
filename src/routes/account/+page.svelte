<script lang="ts">
	import { beforeNavigate, goto, invalidate } from "$app/navigation";
	import { trpc } from "$lib/trpc/client.js";
	import { getToastStore } from "@skeletonlabs/skeleton";

	export let data;

	let email = data.me.email;
	let username = data.me.name;

	$: dirty = email !== data.me.email || username !== data.me.name;

	beforeNavigate(({ cancel }) => {
		if (
			dirty &&
			!confirm("You have unsaved changes. Are you sure you want to leave?")
		) {
			cancel();
		}
	});

	const toastStore = getToastStore();
</script>

<div class="m-auto w-full max-w-4xl">
	<h1 class="h1">Account</h1>
	<br />
	<form
		class="card p-4"
		on:submit|preventDefault={async () => {
			if (!dirty) return;

			data.me = await trpc()((client) =>
				client.account.updateProfile.mutate({ name: username, email })
			);

			toastStore.trigger({
				message: "Profile updated!",
				background: "variant-filled-success"
			});

			await invalidate("account:me");
		}}
	>
		<h2 class="h2 mb-2">
			Profile
			{#if data.me.isAdmin}
				<span class="variant-filled-primary badge float-right">Admin</span>
			{/if}
		</h2>

		<label class="label mb-2">
			<span>Username</span>
			<input
				class="input p-2 px-4 {username !== data.me.name
					? 'border-warning-500-400-token'
					: ''}"
				type="text"
				bind:value={username}
			/>
		</label>
		<label class="label mb-2">
			<span>Email</span>
			<input class="input p-2 px-4" type="email" bind:value={email} />
		</label>

		<br />

		<button
			type="submit"
			class="variant-filled-primary btn ml-auto block"
			disabled={!dirty}
		>
			Save
		</button>
	</form>
	<br />
	<div class="card p-4">
		<h2 class="h2 mb-4">Sessions</h2>

		<div class="mb-4 flex flex-col gap-2">
			{#each data.sessions.toSorted((a, b) => b.id - a.id) as session}
				<p class="card p-2">
					<span class="font-mono opacity-70">
						Created:
						{new Date(session.created).toLocaleString("nb")}
					</span>
					<span class="block font-mono opacity-70 md:float-right md:inline">
						Expires:
						{new Date(session.expires).toLocaleString("nb")}
					</span>
				</p>
			{/each}
		</div>
	</div>
	<br />
	<div class="flex justify-end">
		<button
			class="variant-filled-warning btn mt-2"
			on:click={async () => {
				await trpc()((client) => client.account.logout.mutate());
				await invalidate("account:me");
				toastStore.trigger({
					message: "Successfully logged out",
					background: "variant-filled-success"
				});
				await goto("/account/login");
			}}
		>
			Logout
		</button>
	</div>
</div>
