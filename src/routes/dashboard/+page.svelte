<script lang="ts">
	import { accounts, mails } from './data.js';
	import MainLayout from './(components)/main-layout.svelte';

	export let data;
</script>

<MainLayout
	{accounts}
	{mails}
	defaultLayout={data.layout}
	defaultCollapsed={data.collapsed}
	navCollapsedSize={4}
/>
