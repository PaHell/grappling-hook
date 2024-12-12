<script lang="ts">
	import { layoutSizes } from '..';
	import RightPane from '../RightPane.svelte';
</script>

<RightPane>
	{#snippet content()}
		<p>UI DEV</p>
	{/snippet}
</RightPane>
