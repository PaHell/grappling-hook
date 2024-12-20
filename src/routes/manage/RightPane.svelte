<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { type Snippet } from 'svelte';
	import { layoutSizes } from '.';

	let {
		headerLeft,
		headerRight,
		subHeader,
		content
	}: {
		headerLeft?: Snippet<[]>;
		headerRight?: Snippet<[]>;
		subHeader?: Snippet<[]>;
		content: Snippet<[]>;
	} = $props();
</script>

<Resizable.Pane defaultSize={$layoutSizes[2]} class="flex flex-col overflow-auto ps-1 pt-3 pe-3">
	{#if headerLeft || headerRight || subHeader}
		<header class="flex flex-col pb-3">
			{#if headerLeft || headerRight}
				<div class="flex items-center">
					<div class="flex items-center gap-3">
						{#if headerLeft}
							{@render headerLeft()}
						{/if}
					</div>
					<div class="ml-auto flex items-center gap-3">
						{#if headerRight}
							{@render headerRight()}
						{/if}
					</div>
				</div>
			{/if}
			{#if subHeader}
				<div class="flex items-center mt-3 gap-x-3">
					{@render subHeader()}
				</div>
			{/if}
		</header>
	{/if}
	{@render content()}
</Resizable.Pane>
