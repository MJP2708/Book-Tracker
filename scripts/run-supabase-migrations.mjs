import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { loadEnvFromProjectRoot } from "./env-loader.mjs";

loadEnvFromProjectRoot();

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error("Missing SUPABASE_DB_URL. Example: postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres");
  process.exit(1);
}

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort((a, b) => a.localeCompare(b));

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();

  await client.query(`
    create table if not exists public.app_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  for (const fileName of migrationFiles) {
    const exists = await client.query("select 1 from public.app_migrations where name = $1", [fileName]);

    if (exists.rowCount) {
      console.log(`Skipping ${fileName} (already applied)`);
      continue;
    }

    const fullPath = path.join(migrationsDir, fileName);
    const sql = fs.readFileSync(fullPath, "utf8");

    console.log(`Applying ${fileName}...`);
    await client.query("begin");
    await client.query(sql);
    await client.query("insert into public.app_migrations (name) values ($1)", [fileName]);
    await client.query("commit");
    console.log(`Applied ${fileName}`);
  }

  console.log("Migration complete.");
} catch (error) {
  try {
    await client.query("rollback");
  } catch {
    // Ignore rollback errors.
  }
  console.error(error);
  process.exit(1);
} finally {
  await client.end();
}