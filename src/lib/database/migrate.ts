import { readDir, BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { loadDatabase } from "./index";

export type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;

/**
 * Executes database migrations.
 *
 * @param db The database instance.
 * @returns A promise that resolves when the migrations are complete.
 */
export async function migrate() {
      const sqlite = await loadDatabase();
      const files = await readDir(`migrations`, { baseDir: BaseDirectory.Resource });
      let migrations = files.filter((file) => file.name?.endsWith(".sql"));

      // sort migrations by the first 4 characters of the file name
      migrations = migrations.sort((a, b) => {
            const aHash = a.name?.replace(".sql", "").slice(0, 4);
            const bHash = b.name?.replace(".sql", "").slice(0, 4);

            if (aHash && bHash) {
                  return aHash.localeCompare(bHash);
            }

            return 0;
      });

      console.log(`Found migrations: ${migrations.map(i => i.name).join(", ")}`)

      const migrationTableCreate = /*sql*/ `
		CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hash text NOT NULL UNIQUE,
			created_at numeric
		)
	`;

      await sqlite.execute(migrationTableCreate, []);

      for (const migration of migrations) {
            const hash = migration.name?.replace(".sql", "");

            const dbMigrations = (await sqlite.select(
      /*sql*/ `SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC`
            )) as unknown as { id: number; hash: string; created_at: number }[];

            const hasBeenRun = (hash: string) =>
                  !!dbMigrations.find((dbMigration) => {
                        return dbMigration?.hash === hash;
                  });

            if (!hasBeenRun(hash)) {
                  console.log("executing sql file from:" + "migrations/" + migration.name)
                  const fileContents = await readFile("migrations/" + migration.name, { baseDir: BaseDirectory.Resource });
                  const sql = new TextDecoder().decode(fileContents);
                  await sqlite.execute(sql);
                  await sqlite.execute(
        /*sql*/ `INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
                        [hash, Date.now()]
                  );
            }
      }

      console.info("Migrations complete");

      return Promise.resolve();
}