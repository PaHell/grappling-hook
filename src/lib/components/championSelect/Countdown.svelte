<script lang="ts">
	import { globalState } from '../../gameStore';

	let time: number = 0;
	let phase: string | null = null;

	globalState.subscribe((val: GlobalState) => {
		time = val.timer ? val.timer : 0;
		if (val?.blueTeam?.bans?.find((b) => b.isActive) || val?.redTeam?.bans?.find((b) => b.isActive))
			phase = 'Ban';
		else if (
			val?.blueTeam?.picks?.find((b) => b.isActive) ||
			val?.redTeam?.picks?.find((b) => b.isActive)
		)
			phase = 'Pick';
		else if (val?.blueTeam?.picks?.length && val?.redTeam?.picks?.length) phase = 'Final';
		else phase = null;
	});
</script>
