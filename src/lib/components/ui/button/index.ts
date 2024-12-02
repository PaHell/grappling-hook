import type { Button as ButtonPrimitive } from "bits-ui";
import { type VariantProps, tv } from "tailwind-variants";
import Root from "./button.svelte";

const buttonVariants = tv({
	base: "focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
			outline:
				"relative border-2 border-transparent bg-accent-foreground/5 rounded-md transition-colors duration-200 ease-in-out",
			secondary: "bg-accent-foreground/5 text-secondary-foreground hover:bg-accent-foreground/10",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-2 text-xs",
			lg: "h-12 px-4",
			icon: "h-9 w-9",
		},
		active: {
			true: "bg-red-500",
			false: ""
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default",
		active: false
	},
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
	active?: boolean;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants,
};
