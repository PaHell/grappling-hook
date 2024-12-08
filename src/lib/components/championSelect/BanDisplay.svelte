<script lang="ts">
	import { BanState } from '.';
	import Icon from '../custom/Icon.svelte';
	import './BanDisplay.css';

	let {
		state,
		value
	}: {
		state: BanState;
		value: string;
	} = $props();

	const stateClassMap: Record<BanState, string> = {
		[BanState.Idle]: 'ban-idle',
		[BanState.Active]: 'ban-active',
		[BanState.Locked]: 'ban-selected'
	};
</script>

<div class="ban {stateClassMap[state]}">
	{#if value}
		<img src={value} alt={value} />
	{:else}
		<Icon name="prohibited-2-line" />
	{/if}
</div>
