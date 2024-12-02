import { drizzle } from 'drizzle-orm/sqlite-proxy';
import Database from '@tauri-apps/plugin-sql';
import * as schema from './schema';
import { APP_DATABASE_FILENAME } from '$env/static/public';

let sqlite: Database;
export const loadDatabase: () => Promise<Database> = async () => {
      if (sqlite) return sqlite;
      sqlite = await Database.load("sqlite:" + APP_DATABASE_FILENAME);
      return sqlite;
};

/**
 * Represents the result of a SELECT query.
 */
export type SelectQueryResult = {
      [key: string]: any;
};

/**
 * The drizzle database instance.
 */
export const db = drizzle<typeof schema>(
      async (sql, params, method) => {
            let rows: any = [];
            let results = [];

            console.log("Executing SQL:", sql, "Params:", params);
            console.log("Query Method:", method);
            // If the query is a SELECT, use the select method
            if (isSelectQuery(sql)) {
                  rows = await sqlite.select(sql, params).catch((e) => {
                        console.error("SQL Error:", e);
                        return [];
                  });
                  console.log("Select Rows:", rows);

            } else {
                  // Check if the query contains a RETURNING clause
                  const isReturning = /\bRETURNING\b/i.test(sql);
                  if (isReturning) {
                        const tableName = sql.match(/INSERT\s+INTO\s+"([\w-]+)"/i)![1];
                        // Execute the INSERT query without RETURNING
                        const result = await sqlite.execute(
                              sql,
                              params
                        );
                        // Fetch the inserted rows manually using SELECT
                        rows = await sqlite.select(
                              `SELECT * FROM ${tableName} WHERE id = $1`,
                              [result.lastInsertId]
                        );
                  } else {
                        // Standard non-returning execute
                        const result = await sqlite.execute(sql, params);
                        return { rows: result.rowsAffected ? [{ rowsAffected: result.rowsAffected }] : [] };
                  }
            }

            rows = rows.map((row: any) => {
                  return Object.values(row);
            });

            // If the method is "all", return all rows
            results = method === "all" ? rows : rows[0];

            return { rows: results };
      },
      // Pass the schema to the drizzle instance
      { schema: schema, logger: true }
);

/**
 * Checks if the given SQL query is a SELECT query.
 * @param sql The SQL query to check.
 * @returns True if the query is a SELECT query, false otherwise.
 */
function isSelectQuery(sql: string): boolean {
      const selectRegex = /^\s*SELECT\b/i;
      return selectRegex.test(sql);
}