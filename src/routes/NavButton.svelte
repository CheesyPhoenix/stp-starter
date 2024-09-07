<script lang="ts">
	import type { IconSource } from "@steeze-ui/heroicons";
	import { Icon } from "@steeze-ui/svelte-icon";
	import { onMount, tick } from "svelte";

	export let selected: boolean;
	export let visible: boolean;
	export let iconSrc: IconSource;
	export let title: string;
	export let buttonElement: HTMLButtonElement | null = null;

	let animVisible = visible;
	let showEl = visible;

	let mounted = false;
	onMount(() => (mounted = true));

	let timeout: ReturnType<typeof setTimeout> | null = null;
	$: {
		if (mounted && visible !== animVisible) {
			if (visible) {
				showEl = true;
				animVisible = false;
				tick().then(() => {
					requestAnimationFrame(() =>
						requestAnimationFrame(() => (animVisible = true))
					);
				});
			} else {
				animVisible = false;
				if (timeout !== null) clearTimeout(timeout);
				timeout = setTimeout(() => {
					showEl = false;
				}, 300);
			}
		}
	}
</script>

{#if showEl}
	<button
		bind:this={buttonElement}
		on:click
		on:blur|capture
		class="flex basis-0 flex-col items-center justify-center duration-300 hover:bg-primary-hover-token md:flex-grow-0 md:basis-auto
        {selected ? 'bg-primary-active-token ' : ' '}
        {animVisible
			? 'h-20 w-20 flex-grow opacity-100 md:flex-grow-0'
			: 'w-0 flex-grow-0 overflow-hidden opacity-0 md:h-0 md:w-20'}"
	>
		<div class="h-6">
			<Icon src={iconSrc}></Icon>
		</div>
		<span>{title}</span>
	</button>
{/if}
