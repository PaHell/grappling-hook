<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { layoutSizes } from '..';
	import RightPane from '../RightPane.svelte';
</script>

<RightPane>
	{#snippet content()}
		<div class="flex h-full flex-col">
			<h4>No tournament selected.</h4>
		</div>
	{/snippet}
</RightPane>
