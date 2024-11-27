<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { emit, listen, type UnlistenFn } from '@tauri-apps/api/event';
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import { onDestroy, onMount } from 'svelte';
	import type { InferSelectModel } from 'drizzle-orm';
	import { tournaments } from '@/database/schema';
	import LL from '$i18n/i18n-svelte';
	import type { FormDialog } from '..';

	type Tournament = InferSelectModel<typeof tournaments>;
	let data: Tournament = {
		id: 0,
		name: '',
		dateOfMatch: new Date()
	};
	let title = '';

	let unlisten: UnlistenFn;

	emit('ready', {});
	listen<FormDialog<Tournament>>('data', (event) => {
		console.log({ event });
		data = event.payload;
		title = data.name;
	});
	onMount(async () => {});
	onDestroy(() => unlisten?.());

	async function sendDialogEvent(value: Tournament) {
		emit('dialog', { value });
		getCurrentWindow().close();
	}
</script>

<div class="w-screen h-screen flex items-center justify-center">
	<div class="grid gap-4 px-6 pb-2">
		<div class="flex flex-col space-y-2 text-center sm:text-left">
			<h3 class="text-lg font-semibold">
				{$LL.crud.edit.title({ model: title })}
			</h3>
			<p class="text-muted-foreground text-sm">{data.detail}</p>
		</div>
		<div class="flex items-center justify-end space-x-2">
			<Button onclick={() => sendDialogEvent(false)} variant="secondary">
				<span>{data.deny}</span>
			</Button>
			<Button onclick={() => sendDialogEvent(true)}>
				<span>{data.confirm}</span>
			</Button>
		</div>
	</div>
</div>
