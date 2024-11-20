<script lang="ts" module>
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	export function matchPath(_path: string, current: string, match: number): boolean {
		const [path] = _path.split('?');
		if (match == 0) return path === current;
		const currSplit = current.split('/');
		const pathSplit = path.split('/');
		for (let i = 0; i <= match; i++) {
			if (currSplit[i] !== pathSplit[i]) return false;
		}
		return true;
	}
</script>

<script lang="ts">
	type T = $$Generic;
	let {
		items,
		pathSelector,
		match = 0,
		active = $bindable(-1),
		class: classes = '',
		onchange,
		children
	}: {
		items: T[];
		pathSelector: (item: T) => string;
		match?: number;
		active?: number;
		class?: string;
		onchange?: (item: T, index: number) => void;
		children: Snippet<
			[
				{
					item: T;
					active: boolean;
					href: string;
				}
			]
		>;
	} = $props();

	let paths: string[] = $derived(items.map(pathSelector));
	let queryParams: string = $derived($page.url.searchParams.toString());
	$effect(onNavigate);
	let currentPath = '';

	afterNavigate(onNavigate);

	function onNavigate() {
		if (!browser) return;
		currentPath = window.location.pathname;
		active = paths.findIndex((path) => matchPath(path, currentPath, match));
		onchange?.(items[active], active);
	}
</script>

<div class="navigation {classes}">
	{#each items as item, i (i)}
		{@render children({ item, active: i == active, href: paths[i] + '?' + queryParams })}
	{/each}
</div>

<style lang="postcss" global>
	.navigation {
		&.navigation-tabs {
			@apply flex items-center justify-center;
		}
	}
</style>
