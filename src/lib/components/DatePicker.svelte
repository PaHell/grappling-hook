<script lang="ts">
	import { DateFormatter, type DateValue, parseDate } from '@internationalized/date';
	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import LL from '$i18n/i18n-svelte';
	import './DatePicker.css';
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
		value: string | null;
		class?: string;
		onchange?: (value: string | null) => void;
	} = $props();

	// Derived values for input and calendar
	let valueInput = $derived(valueToInput(value));

	function valueToInput(date: string | null): string {
		console.log('parseValueToInput', date);
		return date?.split('T')[0] ?? '';
	}

	function inputToValue(date: string): string | null {
		console.log('parseInputToValue', date);
		if (!date) return null;
		return new Date(date + 'Z').toISOString(); // Convert Z to UTC
	}

	function onChange(event: Event & { currentTarget: HTMLInputElement }) {
		value = inputToValue(event.currentTarget.value);
		onchange(value);
	}

	function onInput(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				focusPrevious(event);
			} else {
				focusNext(event);
			}
		}
	}

	const focusNext = (event: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		if (event.currentTarget.selectionStart === 0) {
			focusMonth(event.currentTarget);
			event.preventDefault();
		} else if (event.currentTarget.selectionStart === 5) {
			focusDay(event.currentTarget);
			event.preventDefault();
		}
	};

	const focusPrevious = (event: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
		if (event.currentTarget.selectionStart === 5) {
			focusYear(event.currentTarget);
			event.preventDefault();
		} else if (event.currentTarget.selectionStart === 8) {
			focusMonth(event.currentTarget);
			event.preventDefault();
		}
	};

	const focusYear = (elem: HTMLInputElement) => elem.setSelectionRange(0, 4);
	const focusMonth = (elem: HTMLInputElement) => elem.setSelectionRange(5, 7);
	const focusDay = (elem: HTMLInputElement) => elem.setSelectionRange(8, 10);

	function onFocus(event: Event & { currentTarget: HTMLInputElement }) {
		focusYear(event.currentTarget);
	}
</script>

<div class="date-picker {classes}">
	<Input
		{label}
		{placeholder}
		value={valueInput}
		onkeydown={onInput}
		onchange={onChange}
		onfocusin={onFocus}
		{...others}
	/>
</div>
