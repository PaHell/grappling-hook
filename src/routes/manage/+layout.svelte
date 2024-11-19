<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/ui/icon/Icon.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { LocalizedString } from 'typesafe-i18n';
	import type { TranslationFunctions } from '../../i18n/i18n-types';
	import { TableNames } from '@/database/schema.js';
	import icons from '@/icons.js';
	import LL from '../../i18n/i18n-svelte.js';
	import Navigation from '@/components/Navigation.svelte';
	import { goto } from '$app/navigation';

	let defaultLayout = [265, 440, 655];
	let defaultCollapsed = false;
	let isCollapsed = $state(defaultCollapsed);
	let navCollapsedSize: number;
	let { children } = $props();

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

	function onPageChange(item: SidebarItem, index: number) {
		console.log('Page change', item, index);
	}

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}
</script>

<Resizable.PaneGroup direction="horizontal" {onLayoutChange} class="h-full items-stretch">
	<Resizable.Pane
		defaultSize={defaultLayout[0]}
		collapsedSize={navCollapsedSize}
		collapsible
		minSize={15}
		maxSize={20}
		{onCollapse}
		{onExpand}
	>
		<div
			class={cn(
				'flex h-[52px] gap-x-1.5 items-center justify-center',
				isCollapsed ? 'h-[52px]' : 'px-2'
			)}
		>
			<Icon name="logo" class="size-5" />
			<h5 class="font-medium">{APP_NAME}</h5>
		</div>
		<Separator />
		<div
			data-collapsed={isCollapsed}
			class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
		>
			<nav
				class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
			>
				<Navigation
					items={sidebarItems}
					pathSelector={(i) => i.path}
					match={2}
					onchange={onPageChange}
				>
					{#snippet children({ item, href, active })}
						{#if isCollapsed}
							<Tooltip.Root openDelay={0}>
								<Tooltip.Trigger asChild let:builder>
									<Button
										{href}
										{active}
										builders={[builder]}
										variant="ghost"
										size="icon"
										class="size-9"
									>
										<Icon name={item.icon} class="size-4" />
										<span>{item.title($LL)}</span>
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content side="right" class="flex items-center gap-4">
									{item.title($LL)}
									{#if item.label}
										<span class="text-muted-foreground ml-auto">
											{item.label($LL)}
										</span>
									{/if}
								</Tooltip.Content>
							</Tooltip.Root>
						{:else}
							<Button {href} {active} variant="ghost" class="w-full justify-start">
								<Icon name={item.icon} class="mr-2 size-4" />
								{item.title($LL)}
								{#if item.label}
									<span>{item.label($LL)}</span>
								{/if}
							</Button>
						{/if}
					{/snippet}
				</Navigation>
			</nav>
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	{@render children()}
</Resizable.PaneGroup>
