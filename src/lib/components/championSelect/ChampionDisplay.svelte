<script lang="ts">
	import { PickState } from '.';
	import Icon from '../ui/icon/Icon.svelte';
	import './ChampionDisplay.css';

	let {
		state,
		value
	}: {
		state: PickState;
		value: string;
	} = $props();

	const stateClassMap: Record<PickState, string> = {
		[PickState.Idle]: 'pick-idle',
		[PickState.Active]: 'pick-active',
		[PickState.Locked]: 'pick-locked'
	};
</script>

<div class="champion {stateClassMap[state]}">
	<div>
		{#if value}
			<img src={value} alt={value} />
		{:else}
			<Icon name="prohibited-2-line" />
		{/if}
	</div>
</div>
