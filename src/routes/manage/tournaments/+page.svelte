<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { layoutSizes } from '..';
</script>

<Resizable.Pane defaultSize={$layoutSizes[2]}>
	<div class="flex h-full flex-col">
		<h4>No tournament selected.</h4>
	</div>
</Resizable.Pane>
