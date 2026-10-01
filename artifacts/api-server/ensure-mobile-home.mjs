import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for production schema bootstrap");
}

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-home-configuration.sql");
const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

try {
  const [before] = await sql`
    SELECT to_regclass('platform.mobile_home_configuration')::text AS mobile_home_configuration
  `;

  if (before?.mobile_home_configuration) {
    console.log("[render-build] mobile home configuration schema already present");
  } else {
    console.log("[render-build] mobile home configuration schema missing; applying checked-in migration");
    const migrationSql = await readFile(migrationPath, "utf8");
    await sql.unsafe(migrationSql);
  }

  const [after] = await sql`
    SELECT to_regclass('platform.mobile_home_configuration')::text AS mobile_home_configuration
  `;

  if (!after?.mobile_home_configuration) {
    throw new Error("Mobile Home migration completed without creating platform.mobile_home_configuration");
  }

  console.log("[render-build] mobile home configuration schema verified");
} finally {
  await sql.end({ timeout: 5 });
}
