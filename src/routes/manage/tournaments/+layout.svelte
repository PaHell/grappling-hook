<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/ui/icon/Icon.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { formatTimeAgo } from '../utils.js';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { mailStore } from '../store.js';
	import type { Mail } from '../data.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { db } from '$lib/database';
	import { tournaments as _tournaments, TableNames } from '$lib/database/schema';
	import { onMount } from 'svelte';
	import { eq, type InferSelectModel } from 'drizzle-orm';
	import LL from '$i18n/i18n-svelte.js';
	import icons from '@/icons.js';
	import Navigation from '@/components/Navigation.svelte';
	import { ask } from '@tauri-apps/plugin-dialog';
	import { get } from 'svelte/store';
	import TabNavigation from '@/components/TabNavigation.svelte';
	import { page } from '$app/stores';
	import SearchParamsNavigation from '@/components/SearchParamsNavigation.svelte';
	import { goto } from '$app/navigation';
	import { TournamentFilter } from './index.js';
	import { createDeleteDialog, createWindow } from '@/window.js';
	import { window } from '@tauri-apps/api';
	import { errorToString } from '@/error.js';

	type Tournament = InferSelectModel<typeof _tournaments>;

	let { data, children } = $props();
	let tournaments: Tournament[] = $state([]);
	let defaultLayout = [265, 440, 655];
	let error: string | null = null;

	const tabNavigation: { title: string; path: string }[] = [
		{ title: 'All', path: TournamentFilter.All },
		{ title: 'Upcoming', path: TournamentFilter.Upcoming },
		{ title: 'Past', path: TournamentFilter.Past }
	];

	onMount(async () => {
		await reloadTournaments();
		console.log({ tournaments });
	});

	async function reloadTournaments() {
		error = null;
		try {
			tournaments = await db.select().from(_tournaments);
		} catch (e) {
			error = errorToString(e);
		}
	}

	async function onAddTournament() {
		error = null;
		try {
			const result = await db
				.insert(_tournaments)
				.values({
					img: null,
					name: 'New Tournament',
					dateOfMatch: new Date()
				})
				.returning();
			console.log({ result });
			tournaments = [...tournaments, ...result];
		} catch (e) {
			error = errorToString(e);
		}
	}
</script>

<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30}>
	<header>
		<div class="flex items-center px-4 py-2">
			<h1 class="flex-1 text-xl font-bold truncate">Tournaments</h1>
			<Button onclick={onAddTournament}>
				<Icon name={icons.controls.add} class="me-2" />
				{$LL.models[TableNames.Tournaments].general.label(9999)}
			</Button>
		</div>
		<Separator class="my-0" />
		<div class="flex items-center">
			<SearchParamsNavigation
				key="filter"
				items={tabNavigation}
				textSelector={(i) => i.title}
				valueSelector={(i) => i.path}
				match={3}
				onchange={(e) => console.log('e', e)}
				class="me-auto"
			/>
			<Tooltip.Root openDelay={0}>
				<Tooltip.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon" class="me-2">
						<Icon name={icons.controls.search} />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="bottom" class="">
					{$LL.general.search()}
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</header>
	<Separator class="my-0" />
	<ScrollArea class="h-screen">
		<div class="flex flex-col gap-2 p-4">
			<Navigation
				items={tournaments}
				pathSelector={(i) => '/manage/tournaments/' + i.id}
				match={3}
				class="flex flex-col"
			>
				{#snippet children({ item, href, active })}
					<div class="flex relative">
						<Button
							variant="ghost"
							size="icon"
							class="absolute right-4"
							onclick={() => askDelete(item)}
						>
							<Icon name={icons.controls.delete} />
						</Button>
						<Button {href} {active} variant="ghost" class="flex-1 flex-col !h-auto">
							<img src={item.img} />
							<h5>{item.name}</h5>
							<p>{item.dateOfMatch}</p>
						</Button>
					</div>
				{/snippet}
			</Navigation>
		</div>
	</ScrollArea>
</Resizable.Pane>
<Resizable.Handle withHandle />
{@render children()}
