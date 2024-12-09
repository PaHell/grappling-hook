<script lang="ts">
	import './Button.css';
	import type { Snippet } from 'svelte';
	import type { Builder } from 'bits-ui';
	import { Button as ButtonPrimitive } from 'bits-ui';

	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import Icon from './Icon.svelte';

	export interface ButtonProperties {
		icon?: string;
		label: string;
		hideLabel?: boolean;
		variant?: 'default' | 'primary' | 'outline' | 'subtle' | 'transparent' | 'warning' | 'danger';
		size?: 'default' | 'large';
		active?: boolean;
		class?: string;
		builders?: Builder[] | undefined;
		children?: Snippet<[]>;
	}

	let {
		icon,
		label,
		hideLabel = false,
		variant = 'primary',
		size = 'default',
		active = false,
		class: classes,
		builders,
		children,
		...others
	}: ButtonProperties & HTMLButtonAttributes & HTMLAnchorAttributes = $props();
</script>

<ButtonPrimitive.Root
	{builders}
	class="button button-size-{size} button-variant-{variant} {active
		? 'button-active'
		: ''} {classes}"
	type="button"
	{...others}
>
	{#if children}
		{@render children()}
	{:else}
		{#if icon}
			<Icon name={icon} />
		{/if}
		{#if !hideLabel}
			<span>{label}</span>
		{/if}
	{/if}
</ButtonPrimitive.Root>
