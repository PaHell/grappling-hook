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

<Resizable.Pane defaultSize={$layoutSizes[1]} minSize={25} maxSize={35}>
	<header>
		<div class="flex items-center p-2">
			<h1 class="ps-1 flex-1 text-xl font-bold truncate">{title}</h1>
			{#if headerRight}
				{@render headerRight()}
			{/if}
		</div>
		{#if subNavigation}
			<Separator class="my-0" />
			<div class="flex items-center p-2 gap-x-2">
				{@render subNavigation()}
			</div>
		{/if}
	</header>
	<Separator class="my-0" />
	<div class="flex flex-col gap-2 p-2">
		{@render content()}
	</div>
</Resizable.Pane>
<Resizable.Handle withHandle />
