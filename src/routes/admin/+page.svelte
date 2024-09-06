<script lang="ts">
	export let data;
</script>

<div class="m-auto w-full max-w-4xl">
	<h1 class="h1">Overview</h1>
	<br />

	<div class="flex flex-wrap gap-4">
		<a href="/admin/users" class="card card-hover w-full max-w-72 p-4">
			<h3>Users</h3>
			<p class="text-right text-2xl font-bold">
				{data.userCount.toLocaleString("no")}
			</p>
		</a>
		<div class="card card-hover w-full max-w-72 p-4">
			<h3>Products</h3>
			<p class="text-right text-2xl font-bold">
				{(2573).toLocaleString("no")}
			</p>
		</div>
		<div class="card card-hover w-full max-w-72 p-4">
			<h3>Orders</h3>
			<p class="text-right text-2xl font-bold">
				{(357).toLocaleString("no")}
			</p>
		</div>
	</div>
</div>
