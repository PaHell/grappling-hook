<script lang="ts">
	import Icon from '../custom/Icon.svelte';
	import './TeamDisplay.css';

	let {
		img,
		name,
		score
	}: {
		img: string | null;
		name: string;
		score: number;
	} = $props();
</script>

{#if img}
	<img src={img} alt={img} />
{/if}
<div>
	<h1 class="text">{name}</h1>
	{#each Array(score) as _}
		<div></div>
	{/each}
</div>
