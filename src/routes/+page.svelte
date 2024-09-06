<script>
	import { Icon } from "@steeze-ui/svelte-icon";
	import { Github } from "@steeze-ui/simple-icons";
</script>

<div class="m-auto w-full max-w-4xl">
	<h1 class="h1">
		STP Starter
		<a
			href="https://github.com/CheesyPhoenix/stp-starter"
			class="anchor float-right h-6 w-6 text-base"
		>
			<Icon src={Github} title="View source code on GitHub"></Icon>
		</a>
	</h1>
	<br />

	<p>
		A simple, mobile-friendly, starter template, with ready-to-go auth, built on
		<a class="anchor" href="https://kit.svelte.dev/">SvelteKit</a>,
		<a class="anchor" href="https://trpc.io/">tRPC</a>,
		<a class="anchor" href="https://www.prisma.io/">Prisma</a> and
		<a class="anchor" href="https://www.skeleton.dev/">Skeleton</a>.
	</p>
</div>
