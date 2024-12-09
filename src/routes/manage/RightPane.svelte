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
	<div class="h-full flex flex-col overflow-auto">
		{#if headerLeft || headerRight || subHeader}
			<header class="flex flex-col">
				{#if headerLeft || headerRight}
					<div class="flex items-center p-2">
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
					<Separator class="my-0" />
					<div class="flex items-center p-2 gap-x-2">
						{@render subHeader()}
					</div>
				{/if}
			</header>
			<Separator class="my-0" />
		{/if}
		<div class="flex flex-col gap-2 p-2 overflow-auto">
			{@render content()}
		</div>
	</div>
</Resizable.Pane>
<Resizable.Handle withHandle />
