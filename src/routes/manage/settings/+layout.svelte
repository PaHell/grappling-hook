<script lang="ts">
	import LL from '$i18n/i18n-svelte.js';
	import MiddlePane from '../MiddlePane.svelte';

	let { children } = $props();
</script>

<MiddlePane title={$LL.models.settings.general.label()}>
	{#snippet headerRight()}{/snippet}
	{#snippet content()}{/snippet}
</MiddlePane>
{@render children()}
