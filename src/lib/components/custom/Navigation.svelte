<script lang="ts" module>
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import type { Snippet } from 'svelte';

	export function matchPath(
		_path: string,
		_current: string,
		matchPathSegments: number,
		matchQuery: string | undefined
	): boolean {
		let [path, pathQueries] = _path.split('?');
		let [curr, currQueries] = _current.split('?');
		if (path.endsWith('/')) path = path.slice(0, -1);
		if (curr.endsWith('/')) curr = curr.slice(0, -1);
		if (matchPathSegments === 0 && !matchQuery) return path === curr;
		if (matchQuery) {
			const pathQuery = pathQueries?.split('&').find((q) => q.startsWith(matchQuery));
			const currQuery = currQueries?.split('&').find((q) => q.startsWith(matchQuery));
			if (!pathQuery || !currQuery || pathQuery !== currQuery) return false;
			if (matchPathSegments == 0) return true;
		}
		const currSplit = curr.split('/');
		const pathSplit = path.split('/');
		for (let i = 0; i <= matchPathSegments; i++) {
			if (currSplit[i] !== pathSplit[i]) return false;
		}
		return true;
	}

	export type NavigationProperties<T> = {
		items: T[];
		pathSelector: (item: T) => string;
		match?: number;
		matchQuery?: string;
		active?: number;
		class?: string;
		onchange?: (item: T, index: number) => void;
	};
</script>

<script lang="ts">
	type T = $$Generic;
	let {
		items,
		pathSelector,
		match = 0,
		matchQuery,
		active = $bindable(-1),
		class: classes = '',
		onchange,
		children
	}: NavigationProperties<T> & {
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
	$effect(onNavigate);
	let currentPath = '';

	afterNavigate(onNavigate);

	function onNavigate() {
		if (!browser) return;
		currentPath = window.location.pathname + window.location.search;
		active = paths.findIndex((path) => matchPath(path, currentPath, match, matchQuery));
		onchange?.(items[active], active);
	}
</script>

<div class="navigation {classes}">
	{#each items as item, i (i)}
		{@render children({ item, active: i == active, href: paths[i] })}
	{/each}
</div>
