<script lang="ts">
	import { layoutSizes } from '..';
	import RightPane from '../RightPane.svelte';
</script>

<RightPane defaultSize={$layoutSizes[2]}>
	{#snippet content()}
		<p>UI DEV</p>
	{/snippet}
</RightPane>
