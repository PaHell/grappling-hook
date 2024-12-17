<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { InputEvents } from './index.js';
	import { cn, uuid } from '$lib/utils.js';
	import './input.css';

	type $$Props = HTMLInputAttributes & {
		label: string;
		hideLabel?: boolean;
	};
	type $$Events = InputEvents;

	let className: $$Props['class'] = undefined;
	export let id: $$Props['id'] = undefined;
	export let value: $$Props['value'] = undefined;
	export let label: $$Props['label'];
	export let hideLabel = false;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props['readonly'] = undefined;

	let inputId = uuid();
</script>

<div class="input {className}">
	{#if !hideLabel}
		<label for={id ?? inputId}>{label}</label>
	{/if}
	<input
		id={id ?? inputId}
		bind:value
		{readonly}
		on:blur
		on:change
		on:click
		on:focus
		on:focusin
		on:focusout
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:mousemove
		on:paste
		on:input
		on:wheel|passive
		{...$$restProps}
	/>
</div>
