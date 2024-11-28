<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { emit, listen, type UnlistenFn } from '@tauri-apps/api/event';
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import { onDestroy, onMount } from 'svelte';
	import type { InferSelectModel } from 'drizzle-orm';
	import { tournaments } from '@/database/schema';
	import LL from '$i18n/i18n-svelte';
	import { z } from 'zod';
	import type { FormDialog } from '@/form';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm, superValidate } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';

	type Tournament = InferSelectModel<typeof tournaments>;
	let title = '';
	let data: Tournament = {
		id: 0,
		img: null,
		name: '',
		dateOfMatch: new Date()
	};
	const formSchema = z.object<Tournament>({
		id: z.number(),
		img: z.unknown(),
		name: z.string().min(2).max(50),
		dateOfMatch: z.date().nullable()
	});
	let form = superForm(data, {
		validators: zodClient(formSchema)
	});
	let { form: formData, enhance } = form;

	emit('ready', {});
	let unlisten: UnlistenFn;
	listen<FormDialog<Tournament>>('data', (event) => {
		data = event.payload.data;
		title = data.name;
		formData.set(data);
	});
	onDestroy(() => unlisten?.());

	async function submit() {
		emit('dialog', get(form.form));
		getCurrentWindow().close();
	}

	async function discard() {
		getCurrentWindow().close();
	}
</script>

{#key form}
	<form method="POST" use:enhance class="p-6">
		<h3 class="text-lg font-semibold">
			{$LL.crud.edit.editModelItem({
				model: $LL.models.tournaments.general.label(1),
				item: title
			})}
		</h3>
		<Form.Field {form} name="name">
			<Form.Control let:attrs>
				<Form.Label>Name</Form.Label>
				<Input {...attrs} bind:value={$formData.name} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Button type="reset" onclick={discard} variant="secondary">
			<span>{$LL.crud.edit.discard()}</span>
		</Button>
		<Button type="submit" onclick={submit}>
			<span>{$LL.crud.edit.saveChanges()}</span>
		</Button>
	</form>
{/key}
