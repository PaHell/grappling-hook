<script lang="ts">
	import RightPane from '../RightPane.svelte';
	let { data } = $props();
</script>

<RightPane>
	{#snippet content()}
		<p>Settings</p>
	{/snippet}
</RightPane>
