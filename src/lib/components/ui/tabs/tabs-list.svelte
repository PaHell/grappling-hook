<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import { setContext } from 'svelte';

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	on:change={(e) => console.log(e)}
	class={cn('text-secondary inline-flex items-center rounded justify-center', className)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
