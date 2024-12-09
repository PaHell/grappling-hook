<script lang="ts">
	import { page } from '$app/stores';
	import LL from '$i18n/i18n-svelte.js';
	import Navigation from '@/components/custom/Navigation.svelte';
	import MiddlePane from '../MiddlePane.svelte';
	import Button from '@/components/custom/Button.svelte';
	import icons from '@/icons';
	import { layoutSizes } from '..';

	let { data, children } = $props();

	type SideBarItem = {
		icon: string;
		title: string;
		path: string;
	};

	const sidebarItems: SideBarItem[] = [
		{
			title: 'Buttons',
			icon: 'mouse-line',
			path: '/manage/ui-dev/buttons'
		},
		{
			title: 'Colors',
			icon: 'palette-line',
			path: '/manage/ui-dev/colors'
		}
	];
</script>

<MiddlePane defaultSize={$layoutSizes[1]} title={$LL.models.settings.general.label()}>
	{#snippet headerRight()}{/snippet}
	{#snippet content()}
		<Navigation items={sidebarItems} pathSelector={(i) => i.path} match={0} class="flex flex-col">
			{#snippet children({ item, href, active })}
				<Button
					variant="subtle"
					size="large"
					class="!justify-start"
					{href}
					label={item.title}
					icon={item.icon}
					{active}
				/>
			{/snippet}
		</Navigation>
	{/snippet}
</MiddlePane>
{@render children()}
