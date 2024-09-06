<script lang="ts">
	export let data;
</script>

<div class="m-auto w-full max-w-4xl">
	<h1 class="h1">Users</h1>
	<br />

	<ul class="space-y-2">
		{#each data.users as user}
			<li class="card flex p-4">
				<span class="mr-auto">{user.email}</span>
				{#if user.isAdmin}
					<span class="variant-filled-primary badge mr-2">Admin</span>
				{/if}
				<i class="opacity-70">#{user.id}</i>
			</li>
		{/each}
	</ul>
</div>
