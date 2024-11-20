<script lang="ts">
	import Icon from '@/components/ui/icon/Icon.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import LL from '$i18n/i18n-svelte.js';
	import icons from '@/icons.js';
	import Navigation from '@/components/Navigation.svelte';
	import type { Snippet } from 'svelte';

	type T = $$Generic;
	let {
		items,
		pathSelector,
		textSelector,
		match = 0,
		class: classes = '',
		onchange
	}: {
		items: T[];
		pathSelector: (item: T) => string;
		textSelector: (item: T) => string;
		match?: number;
		class?: string;
		onchange?: (item: T, index: number) => void;
	} = $props();
</script>

<Tabs.Root class={classes} onValueChange={(e) => console.log('e', e)}>
	<Tabs.List>
		<Navigation {items} {pathSelector} {match} {onchange}>
			{#snippet children({ item, href })}
				<Tabs.Trigger value={href} class="text-zinc-600 dark:text-zinc-200"
					>{textSelector(item)}</Tabs.Trigger
				>
			{/snippet}
		</Navigation>
	</Tabs.List>
</Tabs.Root>
