<script lang="ts">
	import Button from '@/components/custom/Button.svelte';
	import RightPane from '../../RightPane.svelte';
	let { data } = $props();
</script>

<RightPane>
	{#snippet content()}
		<div class="grid">
			<div class="bg-background">bg-background</div>
			<div class="bg-foreground text-secondary">bg-foreground</div>
			<div class="bg-card">bg-card</div>
			<div class="text-primary">text-primary</div>
			<div class="text-secondary">text-secondary</div>
			<div class="bg-accent">bg-accent</div>
			<div class="bg-accent-foreground">bg-accent-foreground</div>
			<div class="bg-warning">bg-warning</div>
			<div class="bg-warning-foreground">bg-warning-foreground</div>
			<div class="bg-danger">bg-danger</div>
			<div class="bg-danger-foreground">bg-danger-foreground</div>
			<div class="bg-border">bg-border</div>
		</div>
	{/snippet}
</RightPane>
