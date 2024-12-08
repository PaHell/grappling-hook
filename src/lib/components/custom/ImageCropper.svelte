<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import LL from '$i18n/i18n-svelte';
	import './ImageCropper.css';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	let {
		label,
		placeholder,
		value = $bindable(null),
		class: classes = '',
		onchange = () => {},
		...others
	}: {
		label: string;
		placeholder?: string;
		value: string | null;
		class?: string;
		onchange?: (value: string | null) => void;
	} = $props();

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				value = reader.result as string;
				onchange(value);
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="image-cropper {classes}">
	{#if value}
		<img src={value} alt={label} />
	{/if}
	<Input
		{...others}
		id="image-cropper"
		type="file"
		{label}
		{placeholder}
		accept="image/*"
		onchange={handleFileChange}
	/>
	<label class="button" for="image-cropper">
		<span>{$LL.components.imageCropper.chooseImageFromLibrary()}</span>
	</label>
</div>
