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

<Resizable.Pane defaultSize={$layoutSizes[2]}>
	<div class="h-full flex flex-col overflow-auto ps-2 pe-3 pt-1">
		{#if headerLeft || headerRight || subHeader}
			<header class="flex flex-col pb-4">
				{#if headerLeft || headerRight}
					<div class="flex items-center">
						<div class="flex items-center gap-2">
							{#if headerLeft}
								{@render headerLeft()}
							{/if}
						</div>
						<div class="ml-auto flex items-center gap-2">
							{#if headerRight}
								{@render headerRight()}
							{/if}
						</div>
					</div>
				{/if}
				{#if subHeader}
					<div class="flex items-center mt-4 gap-x-2">
						{@render subHeader()}
					</div>
				{/if}
			</header>
		{/if}
		<div class="flex flex-col gap-4">
			{@render content()}
		</div>
	</div>
</Resizable.Pane>
