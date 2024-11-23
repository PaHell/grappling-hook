<script lang="ts">
	import { createWindow } from '@/window';
	import '../app.css';
	let { children } = $props();

	/*
	const championSelect = createWindow('ChampionSelect', false, {
		url: '/viewer'
	});
	*/
</script>

{@render children()}
