<script lang="ts">
	import "../app.css";
	import {
		AppRail,
		AppRailAnchor,
		AppBar,
		Toast,
		LightSwitch
	} from "@skeletonlabs/skeleton";
	import { Icon } from "@steeze-ui/svelte-icon";
	import {
		Home,
		Cog6Tooth,
		UserCircle,
		ShoppingBag,
		Bars3,
		Users,
		Folder,
		GlobeAlt
	} from "@steeze-ui/heroicons";
	import { page } from "$app/stores";
	import { slide } from "svelte/transition";
	import { initializeStores, Modal, storePopup } from "@skeletonlabs/skeleton";
	import {
		computePosition,
		autoUpdate,
		offset,
		shift,
		flip,
		arrow
	} from "@floating-ui/dom";

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;
</script>

<div class="flex h-dvh flex-col">
	<header class="z-10 shadow-2xl">
		<AppBar>
			<svelte:fragment slot="lead">
				<Icon src={GlobeAlt} class="h-8"></Icon>
			</svelte:fragment>
			<a href="/">
				<h2 class="h2 font-bold">STP Starter</h2>
			</a>
			<svelte:fragment slot="trail">
				<LightSwitch></LightSwitch>
				<a
					href="/account"
					class={$page.url.pathname === "/account"
						? "rounded-full p-0.5 bg-primary-active-token text-on-primary-token"
						: "rounded-full p-0.5 hover:bg-primary-hover-token"}
				>
					<Icon src={UserCircle} class="h-8"></Icon>
				</a>
			</svelte:fragment>
		</AppBar>
	</header>
	<div class="flex flex-grow overflow-hidden">
		<div class="z-10 shadow-lg">
			<AppRail>
				<AppRailAnchor href="/" selected={$page.url.pathname === "/"}>
					<div class="h-6">
						<Icon src={Home}></Icon>
					</div>
					<span>Home</span>
				</AppRailAnchor>
				<svelte:fragment slot="trail">
					{#if data.me?.isAdmin}
						<AppRailAnchor
							href="/admin"
							selected={$page.url.pathname.startsWith("/admin")}
							spacing=""
						>
							<div class="h-6">
								<Icon src={Cog6Tooth}></Icon>
							</div>
						</AppRailAnchor>
					{/if}
				</svelte:fragment>
			</AppRail>
		</div>
		{#if data.me?.isAdmin && $page.url.pathname.startsWith("/admin")}
			<section
				class="card w-72 overflow-y-auto p-4"
				transition:slide={{ axis: "x" }}
			>
				<nav class="list-nav">
					<p class="pl-1 text-2xl font-bold">Admin</p>
					<ul>
						<li class="space-y-1">
							<a
								href="/admin"
								class={$page.url.pathname === "/admin"
									? "bg-primary-active-token"
									: ""}
							>
								<span><Icon class="w-6" src={Bars3}></Icon></span>
								<span>Overview</span>
							</a>
							<a
								href="/admin/users"
								class={$page.url.pathname === "/admin/users"
									? "bg-primary-active-token"
									: ""}
							>
								<span><Icon class="w-6" src={Users}></Icon></span>
								<span>Users</span>
							</a>
						</li>
					</ul>
				</nav>
			</section>
		{/if}
		<div class="flex-grow overflow-y-auto p-4">
			<slot></slot>
		</div>
	</div>
</div>

<Modal></Modal>
<Toast position="br" />
