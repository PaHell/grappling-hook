<script lang="ts">
	import { globalState, config, teams } from '../../gameStore';
	import PlayerCard from './PlayerCard.svelte';

	export let team: string;
	let picks: ChampionBan[] = [];

	globalState.subscribe((val: GlobalState) => {
		console.log('Updating Picks');
		if (val?.[team]?.picks) {
			picks = val[team].picks;
			console.log(picks);
		}
	});

	const roleIcons = [
		'/img/roles/top.svg',
		'/img/roles/jngl.svg',
		'/img/roles/mid.svg',
		'/img/roles/adc.svg',
		'/img/roles/supp.svg'
	];
</script>
