import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src-sveltekit/src/lib/database/schema.ts',

	dbCredentials: {
		url: `:memory:`
	},

	verbose: true,
	strict: true,
	dialect: 'sqlite',
	out: "./src-tauri/migrations",
});
