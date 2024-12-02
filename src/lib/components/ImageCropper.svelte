<script lang="ts">
	import { DateFormatter, type DateValue, parseDate } from '@internationalized/date';
	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import LL from '$i18n/i18n-svelte';
	import './ImageCropper.css';
	import { event } from '@tauri-apps/api';

	let {
		label,
		placeholder,
		value = $bindable(null),
		class: classes = '',
		onchange = (value: string | null) => {},
		...others
	}: {
		label: string;
		placeholder?: string;
		value: unknown;
		class?: string;
		onchange?: (value: string | null) => void;
	} = $props();
</script>

<div class="image-cropper {classes}">
	<Input {...others} id="image-cropper" type="file" {label} {placeholder} />
	<label class="button" for="image-cropper">
		<span>{$LL.components.imageCropper.chooseImageFromLibrary()}</span>
	</label>
</div>
