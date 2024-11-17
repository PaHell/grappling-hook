<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable/index.js';
	import { Separator } from '$lib/components/ui/select/index.js';
	import { APP_NAME } from '$env/static/public';
	import Icon from '@/components/ui/icon/Icon.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { formatTimeAgo } from '../utils.js';
	import { cn } from '$lib/utils.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { mailStore } from '../store.js';
	import type { Mail } from '../data.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';

	let { children } = $props();
	let items: Mail[];
	let defaultLayout = [265, 440, 655];

	function get_badge_variant_from_label(label: string) {
		if (['work'].includes(label.toLowerCase())) {
			return 'default';
		}

		if (['personal'].includes(label.toLowerCase())) {
			return 'outline';
		}

		return 'secondary';
	}
</script>

<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30}>
	<Tabs.Root value="all">
		<div class="flex items-center px-4 py-2">
			<h1 class="text-xl font-bold">Tournaments</h1>
			<Tabs.List class="ml-auto">
				<Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200">All</Tabs.Trigger>
				<Tabs.Trigger value="upcoming" class="text-zinc-600 dark:text-zinc-200">
					Upcoming
				</Tabs.Trigger>
				<Tabs.Trigger value="past" class="text-zinc-600 dark:text-zinc-200">Past</Tabs.Trigger>
			</Tabs.List>
		</div>
		<Separator class="mb-0" />
		<div class="bg-black/20 p-4">
			<form>
				<div class="relative">
					<Icon
						name="search"
						class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
					/>
					<Input placeholder="Search" class="pl-8" />
				</div>
			</form>
		</div>
		<Tabs.Content value="all" class="m-0"></Tabs.Content>
		<Tabs.Content value="unread" class="m-0"></Tabs.Content>
		<ScrollArea class="h-screen">
			<div class="flex flex-col gap-2 p-4">
				{#each items as item}
					<button
						class={cn(
							'hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
							$mailStore.selected === item.id && 'bg-muted'
						)}
						onclick={() => mailStore.setMail(item.id)}
					>
						<div class="flex w-full flex-col gap-1">
							<div class="flex items-center">
								<div class="flex items-center gap-2">
									<div class="font-semibold">{item.name}</div>
									{#if !item.read}
										<span class="flex h-2 w-2 rounded-full bg-blue-600"></span>
									{/if}
								</div>
								<div
									class={cn(
										'ml-auto text-xs',
										$mailStore.selected === item.id ? 'text-foreground' : 'text-muted-foreground'
									)}
								>
									{formatTimeAgo(new Date(item.date))}
								</div>
							</div>
							<div class="text-xs font-medium">{item.subject}</div>
						</div>
						<div class="text-muted-foreground line-clamp-2 text-xs">
							{item.text.substring(0, 300)}
						</div>
						{#if item.labels.length}
							<div class="flex items-center gap-2">
								{#each item.labels as label}
									<Badge variant={get_badge_variant_from_label(label)}>
										{label}
									</Badge>
								{/each}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</ScrollArea>
	</Tabs.Root>
</Resizable.Pane>
<Resizable.Handle withHandle />
{@render children()}
