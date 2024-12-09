<script lang="ts">
	import Button from '$lib/components/custom/Button.svelte';
	import Navigation, { type NavigationProperties } from '@/components/custom/Navigation.svelte';

	type T = $$Generic;
	let {
		items,
		pathSelector,
		textSelector,
		match = 0,
		matchQuery,
		class: classes = '',
		onchange
	}: NavigationProperties<T> & {
		textSelector: (item: T) => string;
	} = $props();

	let active = $state(0);
	let offsetLeft = $state(0);
	let width = $state(0);
	$effect(() => {
		const offsetParent = refRoot?.getBoundingClientRect().left ?? 0;
		const tabRect = refRoot
			?.querySelector(`.tab:nth-child(${active + 1})`)
			?.getBoundingClientRect();
		offsetLeft = tabRect ? tabRect.left - offsetParent : 0;
		width = tabRect ? tabRect.width : 0;
	});
	let refRoot: HTMLDivElement | undefined = $state(undefined);
</script>

<div bind:this={refRoot} class="tabs flex relative {classes}">
	<div
		class="h-1 bg-accent absolute bottom-0 rounded-full transition-all duration-200 ease-in-out"
		style="width: {width}px; left: {offsetLeft}px;"
	></div>
	<Navigation
		{items}
		{pathSelector}
		{match}
		{matchQuery}
		{onchange}
		bind:active
		class="tabs flex {classes}"
	>
		{#snippet children({ item, href, active })}
			<div class="tab">
				<Button variant="transparent" {href} {active} label={textSelector(item)} />
			</div>
		{/snippet}
	</Navigation>
</div>
