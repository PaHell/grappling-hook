import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/database/schema.ts',

	dbCredentials: {
		url: `:memory:`
	},

	verbose: true,
	strict: true,
	dialect: 'sqlite',
	out: "./src-tauri/migrations",
	migrations: {
		//table: '__migrations',
	},
});
