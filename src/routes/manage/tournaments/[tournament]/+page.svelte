<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/ui/icon/Icon.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { DateFormatter, getDayOfWeek, getLocalTimeZone, now } from '@internationalized/date';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import time from '@/time';
	import icons from '@/icons';
	import { tournaments } from '@/database/schema';
	import LL from '$i18n/i18n-svelte.js';
	import { setBranding } from '../../../champion-select/index.js';

	let { data } = $props();
	let defaultLayout = [265, 440, 655];

	let todayDate = $state(now(getLocalTimeZone()));

	async function playTournament() {
		setBranding({
			logo: data.tournament.img,
			headline: data.tou,
			subtitle: data.tournament.name
		});
	}
</script>

<Resizable.Pane defaultSize={defaultLayout[2]}>
	<div class="flex h-full flex-col">
		<div class="flex items-center p-2">
			<div class="flex items-center gap-2">
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
						<Icon name={icons.controls.edit} />
						<span class="sr-only">Archive</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Archive</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
						<Icon name={icons.controls.delete} />
						<span class="sr-only">Move to junk</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Move to junk</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<Button onclick={playTournament}>
					<Icon name={icons.controls.play} />
					<span>{$LL.routes.manage.tournaments.play()}</span>
				</Button>
			</div>
		</div>
		<Separator class="my-0" />
		{#if data.tournament}
			<div class="flex h-full flex-1 flex-col overflow-hidden">
				<div class="flex items-start p-4">
					<div class="flex items-start gap-4 text-sm">
						<Avatar.Root>
							<Avatar.Image alt={data.tournament.id.toString().padStart(0, '0')} />
							<Avatar.Fallback>
								{data.tournament.id.toString().padStart(0, '0')}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid gap-1">
							<div class="font-semibold">NAME: {data.tournament.name}</div>
							<div class="line-clamp-1 text-xs">ID: {data.tournament.id}</div>
						</div>
					</div>
					{#if data.tournament.dateOfMatch}
						<div class="text-muted-foreground ml-auto text-xs">
							{$time(data.tournament.dateOfMatch.toUTCString()).fromNow()}
						</div>
					{/if}
				</div>
				<Separator />
				<div class="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-sm">
					{data.tournament.dateOfMatch}
				</div>
				<Separator class="mt-auto" />
				<div class="p-4 hidden">
					<form>
						<div class="grid gap-4">
							<Textarea class="p-4" placeholder={`Reply ${data.tournament.name}...`} />
							<div class="flex items-center">
								<Label for="mute" class="flex items-center gap-2 text-xs font-normal">
									<Switch id="mute" aria-label="Mute thread" /> Mute this thread
								</Label>
								<Button size="sm" class="ml-auto">Send</Button>
							</div>
						</div>
					</form>
				</div>
			</div>
		{/if}
	</div>
</Resizable.Pane>
