import { i18n } from '$lib/i18n';
import type { Handle } from '@sveltejs/kit';
import { sequence } from "@sveltejs/kit/hooks"

// add your own hooks as part of the sequence here
//export const handle = sequence(i18n.handle())
//const handleParaglide: Handle = i18n.handle();
//export const handle: Handle = handleParaglide;
export const reroute = i18n.reroute();
