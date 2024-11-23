<script lang="ts">
	import { onMount } from 'svelte';
	import { globalState, config, error, teams } from '../../lib/gameStore';
	import Countdown from '$lib/components/championSelect/Countdown.svelte';
	import Bans from '$lib/components/championSelect/Bans.svelte';
	import Scoreboard from '$lib/components/championSelect/Scoreboard.svelte';
	import Branding from '$lib/components/championSelect/Branding.svelte';
	import Picks from '$lib/components/championSelect/Picks.svelte';
	import { PB } from '@/pb';
	import { APP_URL_BACKEND } from '$env/static/public';

	import './page.css';

	let errorDetails = '';

	onMount(() => {
		PB.on('newState', (state) => {
			globalState.set(state.state);
			config.set(state.state.config);
		});
		PB.on('heartbeat', (hb) => {
			console.info(`Got new config: ${JSON.stringify(hb.config)}`);
			config.set(hb.config);
		});
		PB.start(APP_URL_BACKEND);
	});
</script>

<div id="champion-select">
	<div class="timer" style="grid-area: timer;"></div>
	{#each Array.from({ length: 2 }) as _, i}
		<div class="bans" style="grid-area: bans{i}">
			{#each Array.from({ length: 5 }) as _, i}
				<div></div>
			{/each}
		</div>
	{/each}
	<div class="splash" style="grid-area: splash;"></div>
	{#each Array.from({ length: 10 }) as _, i}
		<div class="player" style="grid-area: player{i};">
			<div class="summoners">
				<div class="summoner"></div>
				<div class="summoner"></div>
			</div>
			<div class="champion"></div>
			<div class="details"></div>
		</div>
	{/each}
</div>
