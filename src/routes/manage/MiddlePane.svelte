<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { tournaments as _tournaments } from '$lib/database/schema';
	import { type Snippet } from 'svelte';
	import { layoutSizes } from '.';

	let {
		title,
		headerRight,
		subNavigation,
		content
	}: {
		title: string;
		headerRight?: Snippet<[]>;
		subNavigation?: Snippet<[]>;
		content: Snippet<[]>;
	} = $props();
</script>

<Resizable.Pane defaultSize={$layoutSizes[1]} minSize={20} maxSize={35}>
	<header class="py-3 px-1">
		<div class="flex items-center">
			<h1 class="ps-2 flex-1 text-xl font-bold truncate">{title}</h1>
			{#if headerRight}
				{@render headerRight()}
			{/if}
		</div>
		{#if subNavigation}
			<div class="flex items-center gap-x-3 mt-3">
				{@render subNavigation()}
			</div>
		{/if}
	</header>
	<div class="flex flex-col gap-3 px-1">
		{@render content()}
	</div>
</Resizable.Pane>
<Resizable.Handle withHandle />
