<script lang="ts">
	import { BanState } from '.';
	import './BrandingDisplay.css';

	let {
		img,
		headline,
		subtitle
	}: {
		img: string | null;
		headline: string;
		subtitle: string | null;
	} = $props();
</script>

<div class="branding">
	{#if img}
		<img src={img} alt={img} />
	{/if}
	<h1 class="text">{headline}</h1>
	{#if subtitle}
		<h2 class="text">{subtitle}</h2>
	{/if}
</div>
