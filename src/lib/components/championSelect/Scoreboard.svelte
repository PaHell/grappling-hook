<script lang="ts">
	import { onMount } from 'svelte';

	export let order: [string, string];

	let config: CookieConfig;

	onMount(() => {
		setInterval(() => {
			const stored = localStorage.getItem('config');
			if (stored != null) {
				config = JSON.parse(stored);
				console.log(config);
				config = config;
			}
		}, 1000);
	});
</script>
