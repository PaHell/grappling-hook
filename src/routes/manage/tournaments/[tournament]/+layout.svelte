<script lang="ts">
	let { data, children } = $props();
</script>

{#key data.tournamentId}
	{@render children()}
{/key}
