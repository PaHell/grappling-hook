<script lang="ts">
	import { PlayerRole } from '.';
	import './PlayerDetails.css';

	let {
		playerName,
		championName,
		role
	}: {
		playerName: string;
		championName: string;
		role: PlayerRole;
	} = $props();

	const roleStringMap: Record<PlayerRole, string> = {
		[PlayerRole.Top]: 'Top',
		[PlayerRole.Jungle]: 'Jungle',
		[PlayerRole.Mid]: 'Mid',
		[PlayerRole.Bot]: 'Bottom',
		[PlayerRole.Support]: 'Support'
	};
</script>

<div class="details">
	<h3 class="text champion">{championName}</h3>
	<h5 class="text player">{playerName}</h5>
	<p class="text role">{roleStringMap[role]}</p>
</div>
