<script lang="ts">
	import Icon from '@/components/custom/Icon.svelte';

	const {
		icon,
		text
	}: {
		icon: string;
		text: string;
	} = $props();
</script>

<div class="h-full flex flex-col items-center justify-center pb-6">
	<Icon name={icon} class="!text-[2.5rem] text-secondary mb-3" />
	<h4 class="text text-xl text-secondary">{text}</h4>
</div>
