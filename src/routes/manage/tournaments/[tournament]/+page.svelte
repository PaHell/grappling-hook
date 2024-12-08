<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/custom/Icon.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { DateFormatter, getDayOfWeek, getLocalTimeZone, now } from '@internationalized/date';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import Button from '$lib/components/custom/Button.svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import time from '@/time';
	import icons from '@/icons';
	import { tournaments } from '@/database/schema';
	import LL from '$i18n/i18n-svelte.js';
	import {
		listenReady,
		setBranding,
		setCurrentAction,
		setTeams,
		setTimer
	} from '../../../champion-select/index.js';
	import { errorToString } from '@/error.js';
	import { db } from '@/database/index.js';
	import { tournaments as _tournaments, TableNames } from '$lib/database/schema';
	import { createDeleteDialog, createFormDialog, createWindow } from '@/window.js';
	import { eq, type InferSelectModel } from 'drizzle-orm';
	import { FormType } from '@/form.js';
	import { getAllWebviews } from '@tauri-apps/api/webview';
	import type { WebviewWindow } from '@tauri-apps/api/webviewWindow';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let defaultLayout = [265, 440, 655];
	let error: string | null = null;

	type Tournament = InferSelectModel<typeof _tournaments>;
	const _windowLabel = 'championSelect';
	let championSelect: WebviewWindow | undefined;
	onMount(async () => {});

	async function openEdit() {
		error = null;
		try {
			const item = data.tournament.name;
			const model = $LL.models[TableNames.Tournaments].general.label(1);
			let updated = await createFormDialog(
				FormType.Update,
				'/dialogs/forms/tournament',
				$LL.crud.edit.editModelItem({ model, item }),
				data.tournament
			);
			console.log('Updated', updated);
			await db
				.update(_tournaments)
				.set({
					...updated,
					dateOfMatch: updated.dateOfMatch ? new Date(updated.dateOfMatch) : null
				})
				.where(eq(_tournaments.id, data.tournament.id));
			console.log('Updated2', updated);
			await invalidateAll();
		} catch (e) {
			error = errorToString(e);
		}
	}

	async function askDelete() {
		error = null;
		try {
			const item = data.tournament.name;
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
			await db.delete(_tournaments).where(eq(_tournaments.id, data.tournament.id));
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
		await waitForChampionSelectWindow();
		await setBranding({
			logo: data.tournament.img,
			headline: data.settings?.orgName ?? APP_NAME,
			subtitle: data.tournament.name
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

<Resizable.Pane defaultSize={defaultLayout[2]}>
	<div class="flex h-full flex-col">
		<div class="flex items-center p-2">
			<div class="flex items-center gap-2">
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger onclick={openEdit} asChild let:builder>
						<Button
							builders={[builder]}
							variant="ghost"
							size="icon"
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
							variant="ghost"
							size="icon"
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
			</div>
			<div class="ml-auto flex items-center gap-2">
				<Button
					icon={icons.controls.play}
					label={$LL.routes.manage.tournaments.play()}
					onclick={playTournament}
				/>
			</div>
		</div>
		<Separator class="my-0" />
		{#if data.tournament}
			<div class="flex h-full flex-1 flex-col overflow-hidden">
				<div class="flex items-start p-4">
					<div class="flex items-center gap-4 text-sm">
						<img src={data.tournament.img} alt={data.tournament.name} class="max-h-12 max-w-12" />
						<div class="grid gap-0.5">
							<div class="font-semibold">NAME: {data.tournament.name}</div>
							<div class="line-clamp-1 text-xs">ID: {data.tournament.id}</div>
						</div>
					</div>
					{#if data.tournament.dateOfMatch}
						<div class="text-secondary ml-auto text-xs">
							{$time(data.tournament.dateOfMatch.toUTCString()).fromNow()}
						</div>
					{/if}
				</div>
				<Separator />
				<div class="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-sm">
					{data.tournament.dateOfMatch}
					<div class="grid">
						<div class="bg-background">bg-background</div>
						<div class="bg-card">bg-card</div>
						<div class="text-primary">text-primary</div>
						<div class="text-secondary">text-secondary</div>
						<div class="bg-accent">bg-accent</div>
						<div class="bg-accent-foreground">bg-accent-foreground</div>
						<div class="bg-warning">bg-warning</div>
						<div class="bg-warning-foreground">bg-warning-foreground</div>
						<div class="bg-danger">bg-danger</div>
						<div class="bg-danger-foreground">bg-danger-foreground</div>
						<div class="bg-border">bg-border</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</Resizable.Pane>
