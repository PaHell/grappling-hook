<script lang="ts">
	import * as ResizablePrimitive from 'paneforge';
	import { cn } from '$lib/utils.js';
	import './resizable-handle.css';

	type $$Props = ResizablePrimitive.PaneResizerProps & {
		withHandle?: boolean;
	};

	export let withHandle: $$Props['withHandle'] = false;
	export let el: $$Props['el'] = undefined;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<ResizablePrimitive.PaneResizer bind:el class={cn('resizable-handle', className)}>
	<div>
		{#if withHandle}
			<div></div>
		{/if}
	</div>
</ResizablePrimitive.PaneResizer>
