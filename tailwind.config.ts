import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				background: "rgba(var(--background) / <alpha-value>)",
				card: "rgba(var(--card) / <alpha-value>)",
				primary: "rgba(var(--primary) / <alpha-value>)",
				secondary: "rgba(var(--secondary) / <alpha-value>)",
				accent: {
					DEFAULT: "rgba(var(--accent) / <alpha-value>)",
					foreground: "rgba(var(--accent-foreground) / <alpha-value>)"
				},
				warning: {
					DEFAULT: "rgba(var(--warning) / <alpha-value>)",
					foreground: "rgba(var(--warning-foreground) / <alpha-value>)"
				},
				danger: {
					DEFAULT: "rgba(var(--danger) / <alpha-value>)",
					foreground: "rgba(var(--danger-foreground) / <alpha-value>)"
				},
				border: "rgba(var(--border) / <alpha-value>)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: ['Spiegel', ...fontFamily.sans],
				serif: ['"Beaufort for LOL"', ...fontFamily.serif],
				branding: 'League',

			}
		}
	},
};

export default config;
