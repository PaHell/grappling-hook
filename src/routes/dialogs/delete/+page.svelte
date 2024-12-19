<script lang="ts">
	import Button from '@/components/custom/Button.svelte';
	import { emit, listen, type UnlistenFn } from '@tauri-apps/api/event';
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import type { DialogData } from '.';
	import { onDestroy, onMount } from 'svelte';

	let data: DialogData = {
		title: '',
		headline: '',
		detail: '',
		confirm: '',
		deny: ''
	};

	let unlisten: UnlistenFn;

	emit('ready', {});
	listen<DialogData>('data', (event) => {
		console.log({ event });
		data = event.payload;
	});
	onMount(async () => {});
	onDestroy(() => unlisten?.());

	async function sendDialogEvent(value: boolean) {
		emit('dialog', { value });
		getCurrentWindow().close();
	}
</script>

<div class="w-screen h-screen flex items-center justify-center">
	<div class="grid gap-4 px-6 pb-2">
		<div class="flex flex-col space-y-2 text-center sm:text-left">
			<h3 class="text-lg font-semibold">
				{data.headline}
			</h3>
			<p class="text-secondary text-sm">{data.detail}</p>
		</div>
		<div class="flex items-center justify-end space-x-2">
			<Button label={data.deny} onclick={() => sendDialogEvent(false)} />
			<Button label={data.confirm} onclick={() => sendDialogEvent(true)} variant="danger" />
		</div>
	</div>
</div>
