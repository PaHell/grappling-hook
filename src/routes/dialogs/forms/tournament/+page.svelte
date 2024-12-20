<script lang="ts">
	import Button from '@/components/custom/Button.svelte';
	import { emit, listen, type UnlistenFn } from '@tauri-apps/api/event';
	import { getCurrentWindow } from '@tauri-apps/api/window';
	import { onDestroy, onMount } from 'svelte';
	import type { InferSelectModel } from 'drizzle-orm';
	import { tournaments } from '@/database/schema';
	import LL from '$i18n/i18n-svelte';
	import { z } from 'zod';
	import { FormType, type FormDialog } from '@/form';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm, superValidate } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { get } from 'svelte/store';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import DatePicker from '@/components/custom/DatePicker.svelte';
	import ImageCropper from '@/components/custom/ImageCropper.svelte';

	type Tournament = InferSelectModel<typeof tournaments>;
	let type = FormType.Create;
	let title = '';
	let data: Tournament = {
		id: 0,
		img: null,
		name: '',
		dateOfMatch: ''
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
		type = event.payload.type;
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
	<form method="POST" use:enhance class="h-full flex flex-col p-6">
		<h3 class="text-lg font-semibold">
			{type === FormType.Create
				? $LL.crud.create.createNewModel({
						model: $LL.models.tournaments.general.label(1)
					})
				: $LL.crud.edit.editModelItem({
						model: $LL.models.tournaments.general.label(1),
						item: title
					})}
		</h3>
		<div class="grid grid-cols-3 gap-3 mt-3">
			<Form.Field {form} name="img" class="col-span-3">
				<Form.Control let:attrs>
					<ImageCropper
						label={$LL.models.tournaments.img.label()}
						placeholder={$LL.models.tournaments.img.placeholder()}
						bind:value={$formData.img}
						{...attrs}
					/>
				</Form.Control>
				<Form.Description class="!mt-0" />
				<Form.FieldErrors class="!mt-0" />
			</Form.Field>
			<Form.Field {form} name="name" class="col-span-3">
				<Form.Control let:attrs>
					<Input
						label={$LL.models.tournaments.name.label()}
						placeholder={$LL.models.tournaments.name.placeholder()}
						bind:value={$formData.name}
						autofocus
						{...attrs}
					/>
				</Form.Control>
				<Form.Description class="!mt-0" />
				<Form.FieldErrors class="!mt-0" />
			</Form.Field>
			<Form.Field {form} name="dateOfMatch" class="col-span-3">
				<Form.Control let:attrs>
					<DatePicker
						label={$LL.models.tournaments.dateOfMatch.label()}
						placeholder={$LL.models.tournaments.dateOfMatch.placeholder()}
						bind:value={$formData.dateOfMatch}
						{...attrs}
					/>
				</Form.Control>
				<Form.Description class="!mt-0" />
				<Form.FieldErrors class="!mt-0" />
			</Form.Field>
		</div>
		<div class="flex justify-end space-x-3 mt-auto">
			<Button
				type="reset"
				label={$LL.crud[type === FormType.Create ? 'create' : 'edit'].discard()}
				onclick={discard}
			/>
			<Button
				type="submit"
				variant="primary"
				label={type === FormType.Create
					? $LL.crud.create.createModel({
							model: $LL.models.tournaments.general.label(1)
						})
					: $LL.crud.edit.saveChanges()}
				onclick={submit}
			/>
		</div>
	</form>
{/key}
