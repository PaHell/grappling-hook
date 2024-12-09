<script lang="ts">
	import Button from '@/components/custom/Button.svelte';
	import RightPane from '../../RightPane.svelte';
	let { data } = $props();

	const variants = ['default', 'primary', 'outline', 'subtle', 'transparent', 'warning', 'danger'];
	const sizes = ['default', 'large'];
	const states = [{}, { active: true }, { disabled: true }];
</script>

<RightPane>
	{#snippet content()}
		<div class="grid grid-cols-[auto_auto_auto] gap-4 me-auto mb-auto">
			{#each variants as variant}
				{#each states as state}
					{#each sizes as size}
						<Button {variant} {size} label={variant} {...state} />
						<Button {variant} {size} icon="mouse-line" label={variant} hideLabel {...state} />
						<Button {variant} {size} icon="mouse-line" label={variant} {...state} />
					{/each}
				{/each}
			{/each}
		</div>
	{/snippet}
</RightPane>
