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

	function errorToString(error: unknown) {
		console.error(error);
		switch (typeof error) {
			case 'string':
				return error;
			case 'object':
				if (error instanceof Error) {
					return error.message;
				}
				return JSON.stringify(error);
			default:
				return String(error);
		}
	}

	async function reloadTournaments() {
		error = null;
		try {
			tournaments = await db.select().from(_tournaments);
		} catch (e) {
			error = errorToString(e);
		}
	}

	async function askDelete(tournament: Tournament) {
		error = null;
		const ll = get(LL);
		try {
			const confirmed = await ask(ll.crud.delete.areYouSure({ item: tournament.name }), {
				title: ll.crud.delete.deleteModel({ model: ll.models.tournaments.general.label(1) }),
				kind: 'warning'
			});
			if (!confirmed) return;
			await db.delete(_tournaments).where(eq(_tournaments.id, tournament.id));
			tournaments = tournaments.filter((t) => t.id !== tournament.id);
		} catch (e) {
			error = errorToString(e);
		}
	}

	async function onAddTournament() {
		error = null;
		try {
			const result = await db
				.insert(_tournaments)
				.values({ name: 'New Tournament', dateOfMatch: new Date() })
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
						<Button {href} {active} variant="ghost" class="flex-1 !h-auto">
							<pre class="text">{JSON.stringify(item, null, 4)}</pre>
						</Button>
					</div>
				{/snippet}
			</Navigation>
		</div>
	</ScrollArea>
</Resizable.Pane>
<Resizable.Handle withHandle />
{@render children()}
