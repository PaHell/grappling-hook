<script lang="ts">
	import { derived, get } from 'svelte/store';
	import { page } from '$app/stores'; // Access $page.searchParams
	import Icon from '@/components/ui/icon/Icon.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import LL from '$i18n/i18n-svelte.js';
	import icons from '@/icons.js';
	import Navigation from '@/components/Navigation.svelte';
	import { afterNavigate, goto } from '$app/navigation';

	type T = $$Generic;
	let {
		key,
		items,
		valueSelector,
		textSelector,
		match = 0,
		class: classes = '',
		onchange
	}: {
		key: string;
		items: T[];
		valueSelector: (item: T) => string;
		textSelector: (item: T) => string;
		match?: number;
		class?: string;
		onchange?: (item: T, index: number) => void;
	} = $props();

	// Get active tab from searchParams
	const activeTab = derived(page, ($page) => $page.url.searchParams.get(key) || '');

	// Update searchParams on tab change
	const handleTabChange = (value: string | undefined) => {
		console.log({ value });
		const currentUrl = get(page).url;
		const newUrl = new URL(currentUrl.href);
		newUrl.searchParams.set(key, value); // Update the 'tab' query parameter
		goto(newUrl.toString(), { replaceState: true }); // Update without reloading
	};
</script>

<Tabs.Root class={classes} value={$activeTab} onValueChange={handleTabChange}>
	<Tabs.List>
		{#each items as item}
			<Tabs.Trigger value={valueSelector(item)} class="text-zinc-600 dark:text-zinc-200">
				{textSelector(item)}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
</Tabs.Root>
