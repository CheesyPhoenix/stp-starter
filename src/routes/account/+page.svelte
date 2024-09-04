<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { trpc } from "$lib/trpc/client.js";
	import { getToastStore } from "@skeletonlabs/skeleton";

	export let data;

	const toastStore = getToastStore();
</script>

<p>ID: {data.me.id}</p>
<p>Email: {data.me.email}</p>
<p>Admin: {data.me.isAdmin}</p>

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
