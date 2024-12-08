<script lang="ts">
	import type { Snippet } from 'svelte';
	import { BanState, ChampionSelectPhase } from '.';
	import Icon from '../custom/Icon.svelte';
	import './SplashDisplay.css';

	let {
		phase,
		value,
		children
	}: {
		phase: ChampionSelectPhase;
		value: string;
		children: Snippet<[]>;
	} = $props();

	const phaseClassMap: Record<ChampionSelectPhase, string> = {
		[ChampionSelectPhase.Ban]: 'phase-ban',
		[ChampionSelectPhase.Pick]: 'phase-pick'
	};
</script>

<div class="splash {phaseClassMap[phase]}">
	<div class="circle"></div>
	<div class="circle"></div>
	<div class="circle"></div>
	{#if value}
		<img src={value} alt={value} />
	{/if}
	{@render children()}
</div>
