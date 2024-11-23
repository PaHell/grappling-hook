<script lang="ts">
	import { globalState, config } from '../../gameStore';

	export let team: string;
	let showBans: boolean = false;
	let bans: ChampionBan[] = [];

	globalState.subscribe((val: GlobalState) => {
		console.log('Updating Bans');
		showBans = !!val?.blueTeam?.bans?.length && !!val?.redTeam?.bans?.length;
		if (val?.[team]?.bans) {
			bans = val[team].bans;
			console.log({ bans });
		}
	});
</script>
