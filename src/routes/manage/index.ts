import { writable } from "svelte/store";

export const layoutSizes = writable([21, 35, 100 - 21 - 35]);