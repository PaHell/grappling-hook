<script lang="ts">
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/custom/Icon.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Button from '$lib/components/custom/Button.svelte';
	import time from '@/time';
	import icons from '@/icons';
	import LL from '$i18n/i18n-svelte.js';
	import {
		listenReady,
		setBranding,
		setCurrentAction,
		setTeams,
		setTimer
	} from '../../../champion-select/index.js';
	import { errorToString } from '@/error.js';
	import { tournaments as _tournaments, TableNames } from '$lib/database/schema';
	import { createDeleteDialog, createFormDialog, createWindow } from '@/window.js';
	import { FormType } from '@/form.js';
	import { getAllWebviews } from '@tauri-apps/api/webview';
	import type { WebviewWindow } from '@tauri-apps/api/webviewWindow';
	import { onDestroy } from 'svelte';
	import RightPane from '../../RightPane.svelte';
	import { get } from 'svelte/store';
	import type { InferSelectModel } from 'drizzle-orm';
	import { tournamentQueries, tournamentMutations } from '@/queries/tournaments.js';

	let { data } = $props();
	let tournament: InferSelectModel<typeof _tournaments> | undefined = $state();
	let error: string | null = null;
	const { getById } = tournamentQueries(data.queryClient);
	const { useUpdate, useDelete } = tournamentMutations(data.queryClient);

	const unsubGetById = getById(data.tournamentId).subscribe((res) => {
		if (!res.data) return;
		console.log('res.data', JSON.stringify(res.data, null, 4));
		tournament = res.data;
	});

	const _windowLabel = 'championSelect';
	let championSelect: WebviewWindow | undefined;

	onDestroy(() => {
		unsubGetById();
	});

	async function openEdit() {
		error = null;
		try {
			const model = $LL.models[TableNames.Tournaments].general.label(1);
			let updated = await createFormDialog(
				FormType.Update,
				'/dialogs/forms/tournament',
				$LL.crud.edit.editModel({ model }),
				tournament
			);
			await get(useUpdate).mutateAsync({
				...updated,
				dateOfMatch: updated.dateOfMatch ? new Date(updated.dateOfMatch) : null
			});
		} catch (e) {
			error = errorToString(e);
		}
	}

	async function askDelete() {
		error = null;
		if (!tournament) return;
		try {
			const item = tournament.name;
			const model = $LL.models[TableNames.Tournaments].general.label(1);
			const confirmed = await createDeleteDialog({
				title: $LL.crud.delete.deleteModelItem({ model, item }),
				headline: $LL.crud.delete.areYouSure({ item }),
				detail: $LL.crud.delete.lostForeverCannotBeUndone(),
				confirm: $LL.crud.delete.deleteModel({
					model
				}),
				deny: $LL.crud.delete.keep()
			});
			if (!confirmed) return;
			await get(useDelete).mutateAsync(data.tournamentId);
		} catch (e) {
			error = errorToString(e);
		}
	}

	function waitForChampionSelectWindow() {
		return new Promise<void>(async (resolve) => {
			championSelect = (await getAllWebviews()).find((wv) => wv.label === _windowLabel) as
				| WebviewWindow
				| undefined;
			if (championSelect) {
				console.log('Champion select window found');
				resolve();
				return;
			}
			championSelect = await createWindow(_windowLabel, false, {
				url: '/champion-select',
				title: $LL.routes.championSelect.title()
			});
			await listenReady(async () => {
				console.log('Champion select ready');
				resolve();
			});
		});
	}

	async function playTournament() {
		if (!tournament) return;
		await waitForChampionSelectWindow();
		await setBranding({
			logo: tournament.img,
			headline: data.settings?.orgName ?? APP_NAME,
			subtitle: tournament.name
		});
		await setTimer(60);
		await setCurrentAction('Player 1 is picking');
		await setTeams(0, {
			img: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Esports_organization_Fnatic_logo.svg/1200px-Esports_organization_Fnatic_logo.svg.png',
			name: 'Red Team',
			score: 3,
			players: [{ name: 'Player 1' }, { name: 'Player 2' }, { name: 'Player 3' }]
		});
		await setTeams(1, {
			img: 'https://upload.wikimedia.org/wikipedia/de/0/05/SK_Telecom_T1.png',
			name: 'Blue Team',
			score: 2,
			players: [
				{ name: 'Player 6' },
				{ name: 'Player 7' },
				{ name: 'Player 8' },
				{ name: 'Player 9' },
				{ name: 'Player 10' }
			]
		});
	}
</script>

<RightPane>
	{#snippet headerLeft()}
		<Tooltip.Root openDelay={0} group>
			<Tooltip.Trigger onclick={openEdit} asChild let:builder>
				<Button
					builders={[builder]}
					icon={icons.controls.edit}
					label={$LL.crud.edit.editModel({
						model: $LL.models.tournaments.general.label(1)
					})}
					hideLabel
					onclick={openEdit}
				/>
			</Tooltip.Trigger>
			<Tooltip.Content
				>{$LL.crud.edit.editModel({
					model: $LL.models.tournaments.general.label(1)
				})}</Tooltip.Content
			>
		</Tooltip.Root>
		<Tooltip.Root openDelay={0} group>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					icon={icons.controls.delete}
					label={$LL.crud.delete.deleteModel({
						model: $LL.models.tournaments.general.label(1)
					})}
					hideLabel
					onclick={askDelete}
				/>
			</Tooltip.Trigger>
			<Tooltip.Content
				>{$LL.crud.delete.deleteModel({
					model: $LL.models.tournaments.general.label(1)
				})}</Tooltip.Content
			>
		</Tooltip.Root>
	{/snippet}
	{#snippet headerRight()}
		<Button
			variant="primary"
			icon={icons.controls.play}
			label={$LL.routes.manage.tournaments.play()}
			onclick={playTournament}
		/>
	{/snippet}
	{#snippet subHeader()}
		{#if tournament}
			<div class="flex items-center gap-4 text-sm">
				{#if tournament.img}
					<img src={tournament.img} alt={tournament.name} class="max-h-12 max-w-12" />
				{:else}
					<div class="w-12 h-12 bg-foreground/5 rounded flex items-center justify-center">
						<Icon name={icons.models.tournament} class="!text-2xl text-secondary" />
					</div>
				{/if}
				<div class="grid gap-0.25">
					<div class="text text-lg font-semibold">{tournament.name}</div>
					<div class="text">ID: {tournament?.id}</div>
				</div>
			</div>
			{#if tournament.dateOfMatch}
				<div class="text-secondary ml-auto text-xs">
					{$time(tournament.dateOfMatch.toUTCString()).fromNow()}<br />
					({$time(tournament.dateOfMatch.toUTCString()).format($LL.general.formats.date())})
				</div>
			{/if}
		{/if}
	{/snippet}
	{#snippet content()}
		<div class="flex flex-col gap-3">
			{#if tournament}
				<div class="flex items-center">
					{#each Array.from({ length: 3 }) as _, stage}
						<div class="min-w-48">
							{#each Array.from({ length: 3 - stage }) as _, game}
								<div class="flex items-center space-x-2 p-4">
									<h3 class="text text-lg leading-8">
										{stage * (4 - stage) + (game + 1)}.
									</h3>
									<div class="space-y-2 flex-1">
										{#each Array.from({ length: 2 }) as _, team}
											<div class="flex gap-x-2 w-full items-center">
												<div
													class="w-8 h-8 flex-shrink-0 bg-foreground/5 rounded flex items-center justify-center"
												>
													<Icon name={icons.models.game} class="!text-xl text-secondary" />
												</div>
												<h3 class="text text-lg leading-8 flex-1">Team {team + 1}</h3>
												<p>0</p>
											</div>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/snippet}
</RightPane>
