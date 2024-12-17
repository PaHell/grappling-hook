<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/custom/Icon.svelte';
	import Button from '$lib/components/custom/Button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { LocalizedString } from 'typesafe-i18n';
	import type { TranslationFunctions } from '../../i18n/i18n-types';
	import { TableNames } from '@/database/schema.js';
	import icons from '@/icons.js';
	import LL from '../../i18n/i18n-svelte.js';
	import Navigation from '@/components/custom/Navigation.svelte';
	import type { LayoutData } from './$types';
	import CollapsableListNavigation from '@/components/custom/CollapsableListNavigation.svelte';
	import { dev } from '$app/environment';
	import { layoutSizes } from '.';

	let isCollapsed = $state(false);
	let navCollapsedSize = 5;
	let { data, children } = $props();

	type SidebarItem = {
		icon: string;
		title: (ll: TranslationFunctions) => LocalizedString;
		label?: (ll: TranslationFunctions) => LocalizedString;
		path: string;
	};

	const sidebarItems: SidebarItem[] = [
		{
			title: (ll) => ll.models[TableNames.Tournaments].general.label(999),
			icon: icons.models.tournament,
			path: '/manage/tournaments'
		},
		{
			title: (ll) => ll.models[TableNames.Games].general.label(999),
			icon: icons.models.game,
			path: '/manage/games'
		},
		{
			title: (ll) => ll.models[TableNames.Teams].general.label(999),
			icon: icons.models.team,
			path: '/manage/teams'
		},
		{
			title: (ll) => ll.models[TableNames.Players].general.label(999),
			icon: icons.models.player,
			path: '/manage/players'
		},
		{
			title: (ll) => ll.models[TableNames.Settings].general.label(),
			icon: icons.models.settings,
			path: '/manage/settings'
		}
	];

	if (dev) {
		sidebarItems.push({
			title: () => 'UI Dev',
			icon: icons.app,
			path: '/manage/ui-dev'
		});
	}

	function onPageChange(item: SidebarItem, index: number) {
		console.log('Page change', item, index);
	}

	function onLayoutChange(sizes: number[]) {
		if (sizes.length !== 3) return;
		console.log('Layout change', sizes);
		layoutSizes.set([sizes[0], sizes[1], sizes[2]]);
	}

	function onCollapse() {
		console.log('Collapsed');
		isCollapsed = true;
	}

	function onExpand() {
		console.log('Expanded');
		isCollapsed = false;
	}
</script>

<Resizable.PaneGroup direction="horizontal" {onLayoutChange} class="h-full items-stretch px-1">
	<Resizable.Pane
		collapsedSize={navCollapsedSize}
		collapsible
		minSize={21}
		maxSize={21}
		{onCollapse}
		{onExpand}
	>
		<div class="flex h-[52px] gap-x-1.5 items-center justify-center">
			<Icon name={icons.app} class="icon-large" />
			{#if !isCollapsed}
				<h5 class="font-branding text-lg h-7">{APP_NAME}</h5>
			{/if}
		</div>
		<div
			data-collapsed={isCollapsed}
			class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
		>
			<nav
				class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
			>
				<CollapsableListNavigation
					items={sidebarItems}
					iconSelector={(i) => i.icon}
					textSelector={(i) => i.title($LL)}
					pathSelector={(i) => i.path}
					match={2}
					{isCollapsed}
					onchange={onPageChange}
				/>
			</nav>
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	{@render children()}
</Resizable.PaneGroup>
