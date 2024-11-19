<script lang="ts" context="module">
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { matchPath } from './Navigation.svelte';
	import { browser } from '$app/environment';
</script>

<script lang="ts">
	interface $$Slots {
		default: {
			active: boolean;
			href: string;
		};
	}
	export let path = '';
	export let match = 0; // 0 = exact, >0 = from start

	let active = false;
	let currentPath = '';

	onMount(onNavigate);
	afterNavigate(onNavigate);

	function onNavigate() {
		if (!browser) return;
		currentPath = window.location.pathname;
		active = matchPath(path, currentPath, match);
	}
</script>

<slot {active} href={path} />

<style global lang="postcss">
</style>
