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
	import { db } from '$lib/database';
	import { tournaments as _tournaments, TableNames } from '$lib/database/schema';
	import { onMount } from 'svelte';
	import type { InferSelectModel } from 'drizzle-orm';
	import LL from '$i18n/i18n-svelte.js';
	import icons from '@/icons.js';
	import Navigation from '@/components/Navigation.svelte';

	let { data, children } = $props();
	let tournaments: InferSelectModel<typeof _tournaments>[] = $state([]);
	let defaultLayout = [265, 440, 655];

	onMount(async () => {
		tournaments = await db.query.tournaments.findMany().execute();
		console.log({ tournaments });
	});

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
		<header>
			<div class="flex items-center px-4 py-2">
				<h1 class="flex-1 text-xl font-bold truncate">Tournaments</h1>
				<Button>
					<Icon name={icons.controls.add} class="me-2" />
					{$LL.models[TableNames.Tournaments].general.label(9999)}
				</Button>
			</div>
			<Separator class="my-0" />
			<div class="flex items-center px-4 py-2">
				<Tabs.List class="me-auto">
					<Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200">All</Tabs.Trigger>
					<Tabs.Trigger value="upcoming" class="text-zinc-600 dark:text-zinc-200">
						Upcoming
					</Tabs.Trigger>
					<Tabs.Trigger value="past" class="text-zinc-600 dark:text-zinc-200">Past</Tabs.Trigger>
				</Tabs.List>
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button builders={[builder]} variant="ghost" size="icon">
							<Icon name={icons.controls.search} />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="bottom" class="">
						{$LL.general.search()}
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</header>
		<Separator class="my-0" />
		<Tabs.Content value="all" class="m-0"></Tabs.Content>
		<Tabs.Content value="unread" class="m-0"></Tabs.Content>
		<ScrollArea class="h-screen">
			<div class="flex flex-col gap-2 p-4">
				<pre>{JSON.stringify(tournaments, null, 2)}</pre>
				<Navigation
					items={tournaments}
					pathSelector={(i) => '/manage/tournaments/' + i.id}
					match={2}
				>
					{#snippet children({ item, href, active })}
						<button
							class={cn(
								'hover:bg-accent flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all',
								active && 'bg-muted'
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
								{item.name.substring(0, 300)}
							</div>
							{#if item.labels?.length}
								<div class="flex items-center gap-2">
									{#each item.labels as label}
										<Badge variant={get_badge_variant_from_label(label)}>
											{label}
										</Badge>
									{/each}
								</div>
							{/if}
						</button>
					{/snippet}
				</Navigation>
			</div>
		</ScrollArea>
	</Tabs.Root>
</Resizable.Pane>
<Resizable.Handle withHandle />
{@render children()}
