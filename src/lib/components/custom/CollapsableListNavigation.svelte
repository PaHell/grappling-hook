<script lang="ts">
	import Button from '$lib/components/custom/Button.svelte';
	import Navigation, { type NavigationProperties } from '@/components/custom/Navigation.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import './CollapsableListNavigation.css';

	type T = $$Generic;
	let {
		items,
		iconSelector,
		pathSelector,
		textSelector,
		match = 0,
		matchQuery,
		class: classes = '',
		isCollapsed = false,
		onchange
	}: NavigationProperties<T> & {
		iconSelector?: (item: T) => string;
		textSelector: (item: T) => string;
		isCollapsed: boolean;
	} = $props();

	let active = $state(0);
	let offsetTop = $state(0);
	let height = $state(0);
	$effect(update);

	let refRoot: HTMLDivElement | undefined = $state(undefined);

	function update() {
		isCollapsed;
		const offsetParent = refRoot?.getBoundingClientRect().top ?? 0;
		const tabRect = refRoot
			?.querySelector(`.tab:nth-child(${active + 1})`)
			?.getBoundingClientRect();
		offsetTop = tabRect ? tabRect.top - offsetParent : 0;
		height = tabRect ? tabRect.height : 0;
	}
</script>

<div bind:this={refRoot} class="collapsable-list-navigation {classes}">
	<div
		class="indicator"
		class:collapsed={isCollapsed}
		style="height: {height}px; top: {offsetTop}px;"
	>
		<div></div>
	</div>
	<Navigation {items} {pathSelector} {match} {matchQuery} {onchange} bind:active>
		{#snippet children({ item, href, active })}
			<div class="tab">
				{#if isCollapsed}
					<Tooltip.Root openDelay={0}>
						<Tooltip.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								{href}
								{active}
								variant="subtle"
								size="large"
								icon={iconSelector?.(item)}
								label={textSelector(item)}
								hideLabel
							/>
						</Tooltip.Trigger>
						<Tooltip.Content side="right" class="flex items-center gap-4">
							{textSelector(item)}
						</Tooltip.Content>
					</Tooltip.Root>
				{:else}
					<Button
						{href}
						{active}
						variant="subtle"
						class="w-full !justify-start"
						icon={iconSelector?.(item)}
						label={textSelector(item)}
					/>
				{/if}
			</div>
		{/snippet}
	</Navigation>
</div>
