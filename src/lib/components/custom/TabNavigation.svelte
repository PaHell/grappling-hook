<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { page } from '$app/stores'; // Access $page.searchParams
	import Button from '$lib/components/custom/Button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import LL from '$i18n/i18n-svelte.js';
	import icons from '@/icons.js';
	import Navigation from '@/components/custom/Navigation.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import type { Snippet } from 'svelte';

	type T = $$Generic;
	let {
		items,
		pathSelector,
		textSelector,
		match = 0,
		matchQuery,
		class: classes = '',
		onchange,
		children: inputChildren
	}: {
		items: T[];
		pathSelector: (item: T) => string;
		textSelector: (item: T) => string;
		match?: number;
		matchQuery?: string;
		class?: string;
		onchange?: (item: T, index: number) => void;
		children?: Snippet<
			[
				{
					item: T;
					href: string;
					active: boolean;
				}
			]
		>;
	} = $props();
</script>

<Navigation {items} {pathSelector} {match} {matchQuery} {onchange} class="tabs flex {classes}">
	{#snippet children({ item, href, active })}
		<Button variant="ghost" {href} {active} label={textSelector(item)}>
			{#snippet children()}
				{#if inputChildren}
					{@render inputChildren({ item, href, active })}
				{:else}
					<span>{textSelector(item)}</span>
				{/if}
			{/snippet}
		</Button>
	{/snippet}
</Navigation>
