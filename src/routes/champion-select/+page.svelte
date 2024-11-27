<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { APP_URL_BACKEND } from '$env/static/public';

	import {
		type ChampionSelectData,
		type Summoner,
		type Team,
		type Pick,
		type Branding,
		listenTeams,
		listenBan,
		listenPick,
		listenSummoners,
		listenBranding,
		listenTimer,
		listenCurrentAction,
		sendReady,
		type Ban
	} from '.';
	import { players } from '@/database/schema';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import { set } from 'zod';
	import './page.css';
	import { message } from 'sveltekit-superforms';
	import type WebSocket from '@tauri-apps/plugin-websocket';
	import { invoke } from '@tauri-apps/api/core';
	import { listen } from '@tauri-apps/api/event';
	import type { Message } from '@tauri-apps/plugin-websocket';
	import BanDisplay from '@/components/championSelect/BanDisplay.svelte';
	import { BanState, ChampionSelectPhase, PlayerRole } from '@/components/championSelect';
	import Infobar from '@/components/championSelect/InfobarDisplay.svelte';
	import TeamDisplay from '@/components/championSelect/TeamDisplay.svelte';
	import SummonerDisplay from '@/components/championSelect/SummonerDisplay.svelte';
	import ChampionDisplay from '@/components/championSelect/ChampionDisplay.svelte';
	import PlayerDetails from '@/components/championSelect/PlayerDetails.svelte';
	import BrandingDisplay from '@/components/championSelect/BrandingDisplay.svelte';
	import SplashDisplay from '@/components/championSelect/SplashDisplay.svelte';

	// data
	let branding: Branding | undefined;
	let timer: number | undefined;
	let currentAction: string | undefined;
	let redTeam: Team | undefined;
	let redBans: Ban[] = [];
	let redPicks: Pick[] = [];
	let redSummoners: [Summoner, Summoner][] = [];
	let blueTeam: Team | undefined;
	let blueBans: Ban[] = [];
	let bluePicks: Pick[] = [];
	let blueSummoners: [Summoner, Summoner][] = [];
	let messages: object[] = [];
	// state
	let errorDetails = '';

	onMount(async () => {
		// Listen for WebSocket messages from Rust
		listen('league-client-websocket-message', (event) => {
			if (event?.payload) {
				const parsed = JSON.parse(event.payload);
				console.log('payload:parsed', parsed);
				messages = [...messages, parsed];
			} else {
				console.log('event without payload', event);
			}
		});
	});

	onDestroy(async () => {});

	let interval: NodeJS.Timeout | undefined;
	let unsubTimer: UnlistenFn;
	let unsubCurrentAction: UnlistenFn;
	let unsubTeams: UnlistenFn;
	let unsubBans: UnlistenFn;
	let unsubPicks: UnlistenFn;
	let unsubSummoners: UnlistenFn;
	let unsubBranding: UnlistenFn;

	onMount(async () => {
		unsubTimer = await listenTimer((event) => {
			console.log('timer', event.payload);
			timer = event.payload;
			interval && clearTimeout(interval);
			if (timer) {
				interval = setInterval(() => {
					if (timer) timer -= 1;
				}, 1000);
			}
		});
		unsubCurrentAction = await listenCurrentAction((event) => {
			console.log('currentAction', event.payload);
			currentAction = event.payload;
		});
		unsubTeams = await listenTeams((event) => {
			console.log('teams', event.payload);
			if (event.payload.team) redTeam = event.payload.data;
			else blueTeam = event.payload.data;
		});
		unsubBans = await listenBan((event) => {
			console.log('ban', event.payload);
			(event.payload.team ? redBans : blueBans)[event.payload.player] = event.payload.ban;
		});
		unsubPicks = await listenPick((event) => {
			console.log('pick', event.payload);
			(event.payload.team ? redPicks : bluePicks)[event.payload.player] = event.payload.pick;
		});
		unsubSummoners = await listenSummoners((event) => {
			console.log('summoners', event.payload);
			(event.payload.team ? redSummoners : blueSummoners)[event.payload.player] =
				event.payload.summoners;
		});
		unsubBranding = await listenBranding((event) => {
			console.log('branding', event.payload);
			branding = event.payload;
		});
		console.log('Sending ready');
		await sendReady();
	});

	onDestroy(() => {
		unsubTimer();
		unsubCurrentAction();
		unsubTeams();
		unsubBans();
		unsubPicks();
		unsubSummoners();
		unsubBranding();
	});
</script>

<div id="champion-select">
	<Infobar action={currentAction} {timer} />
	<SplashDisplay phase={ChampionSelectPhase.Ban} value="">
		{#snippet children()}
			<pre class="w-[40vw] h-[60vh] text-white">{JSON.stringify(
					messages.length ? messages[messages.length - 1] : {},
					null,
					2
				)}</pre>
		{/snippet}
	</SplashDisplay>
	<BrandingDisplay
		img={branding?.logo ?? null}
		headline={branding?.headline ?? ''}
		subtitle={branding?.subtitle ?? null}
	/>
	{#each Array(2) as _, teamIndex}
		{@const team = teamIndex ? redTeam : blueTeam}
		<div class="team" data-team={teamIndex}>
			<TeamDisplay img={team?.img ?? null} name={team?.name ?? ''} score={team?.score ?? 0} />
		</div>
		<div data-team={teamIndex} class="players">
			{#each team?.players ?? [] as _, playerIndex}
				<div class="player">
					<div class="summoners">
						{#each Array(2) as _, summonerIndex}
							<SummonerDisplay
								value={(teamIndex ? redSummoners : blueSummoners)?.[playerIndex]?.[summonerIndex]
									?.name ?? ''}
							/>
						{/each}
					</div>
					<ChampionDisplay
						state={playerIndex % 3}
						value={(teamIndex ? redPicks : bluePicks)[playerIndex]?.champion ?? ''}
					/>
					<PlayerDetails
						playerName={team?.players[playerIndex]?.name ?? ''}
						championName={(teamIndex ? redPicks : bluePicks)[playerIndex]?.champion ?? ''}
						role={PlayerRole.Top}
					/>
				</div>
			{/each}
		</div>
		<div class="bans" data-team={teamIndex}>
			{#each Array(5) as _, banIndex}
				<BanDisplay state={banIndex % 3} value="" />
			{/each}
		</div>
	{/each}
</div>
