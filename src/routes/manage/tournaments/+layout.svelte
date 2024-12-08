<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/custom/Icon.svelte';
	import Button from '$lib/components/custom/Button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { db } from '$lib/database';
	import { tournaments as _tournaments, TableNames } from '$lib/database/schema';
	import { onMount } from 'svelte';
	import { eq, type InferSelectModel } from 'drizzle-orm';
	import LL from '$i18n/i18n-svelte.js';
	import icons from '@/icons.js';
	import Navigation from '@/components/custom/Navigation.svelte';
	import { ask } from '@tauri-apps/plugin-dialog';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { TournamentFilter } from './index.js';
	import { createDeleteDialog, createWindow } from '@/window.js';
	import { window } from '@tauri-apps/api';
	import { errorToString } from '@/error.js';
	import time from '@/time.js';
	import TabNavigation from '@/components/custom/TabNavigation.svelte';

	type Tournament = InferSelectModel<typeof _tournaments>;

	let { data, children } = $props();
	let tournaments: Tournament[] = $state([]);
	let defaultLayout = [265, 440, 655];
	let error: string | null = null;
	let searchOpened = $state(false);
	let searchValue = $state('');

	const tabNavigation: Record<TournamentFilter, string> = {
		[TournamentFilter.All]: 'All',
		[TournamentFilter.Upcoming]: 'Upcoming',
		[TournamentFilter.Past]: 'Past'
	};

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

<Resizable.Pane defaultSize={defaultLayout[1]} minSize={25} maxSize={35}>
	<header>
		<div class="flex items-center p-2">
			<h1 class="ps-1 flex-1 text-xl font-bold truncate">Tournaments</h1>
			<Button
				icon={icons.controls.add}
				label={$LL.models[TableNames.Tournaments].general.label(9999)}
				onclick={onAddTournament}
			/>
		</div>
		<Separator class="my-0" />
		<div class="flex items-center p-2 gap-x-2">
			{#if searchOpened}
				<Input
					label={$LL.general.search()}
					placeholder={$LL.routes.manage.tournaments.searchForTournament()}
					bind:value={searchValue}
					class="flex-1"
				/>
			{:else}
				<TabNavigation
					items={Object.entries(tabNavigation)}
					textSelector={(i) => i[1]}
					pathSelector={(i) =>
						'/manage/tournaments' +
						($page.params.tournament && '/' + $page.params.tournament) +
						'?filter=' +
						i[0]}
					match={0}
					matchQuery="filter"
					onchange={(e) => console.log('e', e)}
					class="me-auto"
				/>
			{/if}
			<Tooltip.Root openDelay={0}>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="ghost"
						size="icon"
						icon={searchOpened ? icons.controls.clear : icons.controls.search}
						label={$LL.general.search()}
						hideLabel
						onclick={() => (searchOpened = !searchOpened)}
					/>
				</Tooltip.Trigger>
				<Tooltip.Content side="bottom" class="">
					{$LL.general.search()}
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</header>
	<Separator class="my-0" />
	<div class="flex flex-col gap-2 p-2">
		<Navigation
			items={tournaments}
			pathSelector={(i) => '/manage/tournaments/' + i.id + $page.url.search}
			match={3}
			matchQuery="filter"
			class="flex flex-col"
		>
			{#snippet children({ item, href, active })}
				<Button
					variant="ghost"
					class="!justify-start !h-auto !gap-x-3 py-4"
					{href}
					label={item.name}
					{active}
				>
					{#if item.img}
						<img src={item.img} alt={item.name} class="max-h-12 max-w-12" />
					{:else}
						<div class="h-12 w-12 bg-white/5 flex items-center justify-center">
							<Icon name={icons.models.tournament} class="text-2xl text-secondary" />
						</div>
					{/if}
					<div>
						<h5 class="text">{item.name}</h5>
						{#if item.dateOfMatch}
							<p class="text text-sm">
								{$time(item.dateOfMatch).fromNow()} ({$time(item.dateOfMatch).format(
									$LL.general.formats.date()
								)})
							</p>
						{/if}
					</div>
				</Button>
			{/snippet}
		</Navigation>
	</div>
</Resizable.Pane>
<Resizable.Handle withHandle />
{@render children()}
