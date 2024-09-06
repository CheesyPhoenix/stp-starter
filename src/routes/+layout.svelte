<script lang="ts">
	import "../app.css";
	import { AppBar, Toast, LightSwitch } from "@skeletonlabs/skeleton";
	import { Icon } from "@steeze-ui/svelte-icon";
	import {
		Home,
		Cog6Tooth,
		UserCircle,
		Bars3,
		Users,
		GlobeAlt,
		User
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
	import NavLink from "./NavLink.svelte";
	import NavButton from "./NavButton.svelte";

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	let innerWidth: number;
	let adminPanelOpen = false;
	let adminPanelElement: HTMLElement;

	$: {
		if (adminPanelOpen && adminPanelElement) {
			adminPanelElement.focus();
		}
	}
</script>

<svelte:window bind:innerWidth />

<a
	href="#main"
	class="variant-filled-primary btn fixed -top-10 left-1/2 z-30 m-auto -translate-x-1/2 p-2 shadow-2xl duration-300 focus:top-2"
>
	Skip to content
</a>

<div class="flex min-h-dvh w-screen flex-col">
	<header class="z-20 shadow-2xl">
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
	<div class="flex flex-grow">
		<div
			class="bg-surface-100-800-token fixed bottom-0 left-0 z-20 block h-20 w-screen shadow-lg md:static md:h-auto md:w-20"
		>
			<nav
				class="top-0 flex justify-between md:sticky md:flex-col md:justify-normal"
			>
				<NavLink
					selected={!adminPanelOpen && $page.url.pathname === "/"}
					iconSrc={Home}
					visible
					title="Home"
					href="/"
				></NavLink>
				<NavLink
					selected={!adminPanelOpen &&
						$page.url.pathname.startsWith("/account")}
					iconSrc={User}
					visible
					title="Account"
					href="/account"
				></NavLink>
				<NavButton
					selected={adminPanelOpen || $page.url.pathname.startsWith("/admin")}
					iconSrc={Cog6Tooth}
					visible={data.me?.isAdmin ?? false}
					title="Admin"
					on:click={() => (adminPanelOpen = true)}
				></NavButton>
			</nav>
		</div>
		{#if data.me?.isAdmin && adminPanelOpen}
			<section
				tabindex="-1"
				class="card fixed bottom-20 z-10 w-full overflow-y-auto p-4 md:bottom-auto md:left-20 md:h-full md:w-72"
				transition:slide={{ axis: innerWidth < 1024 ? "y" : "x" }}
				bind:this={adminPanelElement}
				on:blur|capture={(e) => {
					//@ts-ignore
					if (!adminPanelElement.contains(e.relatedTarget)) {
						adminPanelOpen = false;
					}
				}}
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
		<main id="main" class="w-full overflow-y-auto overflow-x-hidden p-8">
			<slot></slot>
		</main>
	</div>
</div>

<Modal></Modal>
<Toast position="br" class="mb-20 pb-2 md:mb-0 md:pb-0" />
