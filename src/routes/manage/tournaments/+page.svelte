<script lang="ts">
	import icons from '@/icons';
	import EmptyRightPaneContent from '../EmptyRightPaneContent.svelte';
	import RightPane from '../RightPane.svelte';
	import LL from '$i18n/i18n-svelte';
</script>

<RightPane>
	{#snippet content()}
		<EmptyRightPaneContent
			icon={icons.models.tournament}
			text={$LL.models.tournaments.general.noneSelected()}
		/>
	{/snippet}
</RightPane>
