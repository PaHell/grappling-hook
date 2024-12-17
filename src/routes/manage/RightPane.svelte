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
	<div class="h-full flex flex-col overflow-auto px-1 pt-1">
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
		<div class="flex flex-col gap-3">
			{@render content()}
		</div>
	</div>
</Resizable.Pane>
