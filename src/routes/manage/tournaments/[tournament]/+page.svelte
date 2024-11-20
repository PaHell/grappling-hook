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

	let { data } = $props();
	let defaultLayout = [265, 440, 655];

	let todayDate = $state(now(getLocalTimeZone()));
</script>

<Resizable.Pane defaultSize={defaultLayout[2]}>
	<div class="flex h-full flex-col">
		<div class="mb-1 flex items-center p-2">
			<div class="flex items-center gap-2">
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="archive_tooltip"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Icon name={icons.controls.delete} class="size-4" />
						<span class="sr-only">Archive</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Archive</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="move_to_junk_tooltip"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Icon name={icons.controls.delete} class="size-4" />
						<span class="sr-only">Move to junk</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Move to junk</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="move_to_trash_tooltip"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Icon name={icons.controls.delete} class="size-4" />
						<span class="sr-only">Move to trash</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Move to trash</Tooltip.Content>
				</Tooltip.Root>
				<Separator orientation="vertical" class="mx-1 h-6" />
				<Tooltip.Root openDelay={0} group>
					<Popover.Root portal={null}>
						<Tooltip.Trigger asChild let:builder={tooltip_builder} id="snooze_popover">
							<Popover.Trigger asChild let:builder={popover_builder} id="snooze_popover">
								<Button builders={[tooltip_builder, popover_builder]} variant="ghost" size="icon">
									<Icon name={icons.controls.delete} class="size-4" />
									<span class="sr-only">Snooze</span>
								</Button>
							</Popover.Trigger>
						</Tooltip.Trigger>
						<Popover.Content class="flex w-[535px] p-0">
							<div class="flex flex-col gap-2 border-r px-2 py-4">
								<div class="px-4 text-sm font-medium">Snooze until</div>
								<div class="grid min-w-[250px] gap-1">
									<Button variant="ghost" class="justify-start font-normal">
										Later today
										<span class="text-muted-foreground ml-auto">
											{1}
										</span>
									</Button>
									<Button variant="ghost" class="justify-start font-normal">
										Tomorrow
										<span class="text-muted-foreground ml-auto">
											{1}
										</span>
									</Button>
									<Button variant="ghost" class="justify-start font-normal">
										This weekend
										<span class="text-muted-foreground ml-auto">
											{1}
										</span>
									</Button>
									<Button variant="ghost" class="justify-start font-normal">
										Next week
										<span class="text-muted-foreground ml-auto">
											{1}
										</span>
									</Button>
								</div>
							</div>
							<div class="p-2">
								<Calendar bind:value={todayDate} initialFocus />
							</div>
						</Popover.Content>
					</Popover.Root>
					<Tooltip.Content>Snooze</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="reply_tooltip"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Icon name={icons.controls.delete} class="size-4" />
						<span class="sr-only">Reply</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Reply</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="reply_all_tooltip"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Icon name={icons.controls.delete} class="size-4" />
						<span class="sr-only">Reply all</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Reply all</Tooltip.Content>
				</Tooltip.Root>
				<Tooltip.Root openDelay={0} group>
					<Tooltip.Trigger
						id="forward_tooltip"
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Icon name={icons.controls.delete} class="size-4" />
						<span class="sr-only">Forward</span>
					</Tooltip.Trigger>
					<Tooltip.Content>Forward</Tooltip.Content>
				</Tooltip.Root>
			</div>
			<Separator orientation="vertical" class="mx-2 h-6" />
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					id="more_options_dropdown"
					class={buttonVariants({ variant: 'ghost', size: 'icon' })}
				>
					<Icon name={icons.controls.delete} class="size-4" />
					<span class="sr-only">More</span>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>Mark as unread</DropdownMenu.Item>
					<DropdownMenu.Item>Star thread</DropdownMenu.Item>
					<DropdownMenu.Item>Add label</DropdownMenu.Item>
					<DropdownMenu.Item>Mute thread</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<Separator />
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
