import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for production schema bootstrap");
}

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(here, "migrations", "20260821_learning_resources.sql");
const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

try {
  const [before] = await sql`
    SELECT
      to_regclass('content.learning_resources')::text AS learning_resources,
      to_regclass('content.learning_resource_exams')::text AS learning_resource_exams
  `;

  if (before?.learning_resources && before?.learning_resource_exams) {
    console.log("[render-build] learning resources schema already present");
  } else {
    console.log("[render-build] learning resources schema missing; applying checked-in migration");
    const migrationSql = await readFile(migrationPath, "utf8");
    await sql.unsafe(migrationSql);
  }

  const [after] = await sql`
    SELECT
      to_regclass('content.learning_resources')::text AS learning_resources,
      to_regclass('content.learning_resource_exams')::text AS learning_resource_exams
  `;

  if (!after?.learning_resources || !after?.learning_resource_exams) {
    throw new Error("Learning Resources migration completed without creating the required tables");
  }

  console.log("[render-build] learning resources schema verified");
} finally {
  await sql.end({ timeout: 5 });
}
