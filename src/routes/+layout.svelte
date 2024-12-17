<script lang="ts">
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import '../app.css';
	let { data, children } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	{@render children()}
</QueryClientProvider>
