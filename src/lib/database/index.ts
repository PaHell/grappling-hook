import { drizzle } from 'drizzle-orm/sqlite-proxy';
import Database from '@tauri-apps/plugin-sql';
import * as schema from './schema';
import { APP_DATABASE_FILENAME } from '$env/static/public';
import { dev } from '$app/environment';

let sqlite: Database;
export const loadDatabase: () => Promise<Database> = async () => {
      if (sqlite) return sqlite;
      sqlite = await Database.load("sqlite:" + APP_DATABASE_FILENAME);
      return sqlite;
};

export const db = drizzle<typeof schema>(
      async (sql, params, method) => {
            let rows: any[] = [];
            let results = [];

            console.log("Executing SQL:", sql, "Params:", params, "Method:", method);

            rows = await sqlite.select(sql, params);
            console.log("Raw SELECT rows:", rows);

            rows = rows.map((row) => {
                  if (typeof row === 'object' && row !== null) {
                        return Object.values(row); // Keep as is
                  }
                  return row;
            });

            // Return rows based on method
            results = method === "all" ? rows : rows[0];
            return { rows: results };
      },
      { schema: schema, logger: !dev }
);