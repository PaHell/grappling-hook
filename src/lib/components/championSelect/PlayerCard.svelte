<script lang="ts">
	import Spell from './Spell.svelte';
	import { globalState, config } from '../../gameStore';
	import { getChampion } from '$lib/riot';

	export let rtl: boolean = false;
	export let player: ChampionPick;
	export let role: string;
</script>
