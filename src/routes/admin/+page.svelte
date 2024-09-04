<script lang="ts">
	export let data;
</script>

<h2 class="h2">Overview</h2>
<br />
<div class="flex flex-wrap gap-4">
	<a href="/admin/users" class="card card-hover w-full max-w-xs p-4">
		<h3>Users</h3>
		<p class="text-right text-2xl font-bold">
			{data.userCount.toLocaleString("no")}
		</p>
	</a>
</div>
