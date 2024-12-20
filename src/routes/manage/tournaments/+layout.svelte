<script lang="ts">
	import Icon from '@/components/custom/Icon.svelte';
	import Button from '$lib/components/custom/Button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { tournaments as _tournaments, TableNames } from '$lib/database/schema';
	import { onDestroy } from 'svelte';
	import { type InferSelectModel } from 'drizzle-orm';
	import LL from '$i18n/i18n-svelte.js';
	import icons from '@/icons.js';
	import Navigation from '@/components/custom/Navigation.svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { TournamentFilter } from './index.js';
	import { createFormDialog } from '@/window.js';
	import { errorToString } from '@/error.js';
	import time from '@/time.js';
	import TabNavigation from '@/components/custom/TabNavigation.svelte';
	import MiddlePane from '../MiddlePane.svelte';
	import { FormType } from '@/form.js';
	import { tournamentMutations, tournamentQueries } from '@/queries/tournaments.js';

	let { data, children } = $props();
	let tournaments: InferSelectModel<typeof _tournaments>[] = $state([]);
	let error: string | null = null;
	let refSearchInput: Input | undefined = $state();
	let searchOpened = $state(false);
	let searchValue = $state('');

	const { getAll } = tournamentQueries(data.queryClient);
	const { useCreate } = tournamentMutations(data.queryClient);
	const unsubGetAll = getAll().subscribe((res) => {
		if (!res.data) return;
		console.log('res.data', JSON.stringify(res.data, null, 4));
		tournaments = res.data;
	});

	const tabNavigation: Record<TournamentFilter, string> = {
		[TournamentFilter.All]: 'All',
		[TournamentFilter.Upcoming]: 'Upcoming',
		[TournamentFilter.Past]: 'Past'
	};

	onDestroy(() => {
		unsubGetAll();
	});

	function toggleSearch() {
		searchOpened = !searchOpened;
		if (searchOpened) {
			refSearchInput?.focus();
		} else {
			searchValue = '';
		}
	}

	async function openCreate() {
		error = null;
		try {
			let form = await createFormDialog(
				FormType.Create,
				'/dialogs/forms/tournament',
				$LL.crud.create.createModel({
					model: $LL.models[TableNames.Tournaments].general.label(1)
				}),
				{
					img: null,
					name: '',
					dateOfMatch: new Date()
				}
			);
			await get(useCreate).mutateAsync({
				...form,
				dateOfMatch: new Date(form.dateOfMatch)
			});
		} catch (e) {
			error = errorToString(e);
		}
	}
</script>

<MiddlePane title={$LL.models.tournaments.general.label(9999)}>
	{#snippet headerRight()}
		<Button
			variant="primary"
			icon={icons.controls.add}
			label={$LL.models[TableNames.Tournaments].general.label(9999)}
			onclick={openCreate}
		/>
	{/snippet}
	{#snippet subNavigation()}
		{#if searchOpened}
			<Input
				bind:this={refSearchInput}
				label={$LL.general.search()}
				placeholder={$LL.routes.manage.tournaments.searchForTournament()}
				bind:value={searchValue}
				class="flex-1"
				hideLabel
				autofocus
			/>
		{:else}
			<TabNavigation
				items={Object.entries(tabNavigation)}
				textSelector={(i) => i[1]}
				pathSelector={(i) =>
					'/manage/tournaments' +
					($page.params.tournament ? '/' + $page.params.tournament : '') +
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
					icon={searchOpened ? icons.controls.clear : icons.controls.search}
					label={$LL.general.search()}
					hideLabel
					onclick={toggleSearch}
				/>
			</Tooltip.Trigger>
			<Tooltip.Content side="bottom" class="">
				{$LL.general.search()}
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
	{#snippet content()}
		<Navigation
			items={tournaments}
			pathSelector={(i) => '/manage/tournaments/' + i.id + $page.url.search}
			match={3}
			matchQuery="filter"
			class="flex flex-col gap-y-px"
		>
			{#snippet children({ item, href, active })}
				<Button
					variant="subtle"
					class="!justify-start !h-auto !gap-x-3 !p-2"
					{href}
					label={item.name}
					{active}
				>
					{#if item.img}
						<img src={item.img} alt={item.name} class="max-h-12 max-w-12 flex-shrink-0" />
					{:else}
						<div
							class="h-12 w-12 bg-foreground/5 rounded flex-shrink-0 flex items-center justify-center"
						>
							<Icon name={icons.models.tournament} class="!text-2xl text-secondary" />
						</div>
					{/if}
					<div class="overflow-hidden">
						<h5 class="text truncate">{item.name}</h5>
						{#if item.dateOfMatch}
							<p class="text text-sm truncate">
								{$time(item.dateOfMatch).fromNow()} ({$time(item.dateOfMatch).format(
									$LL.general.formats.date()
								)})
							</p>
						{/if}
					</div>
				</Button>
			{/snippet}
		</Navigation>
	{/snippet}
</MiddlePane>
{@render children()}
