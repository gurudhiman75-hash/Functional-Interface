import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for production schema bootstrap");
}

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(here, "migrations", "20260820_student_exam_preferences.sql");
const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

try {
  const [before] = await sql`
    SELECT to_regclass('identity.student_exam_preferences')::text AS student_exam_preferences
  `;

  if (before?.student_exam_preferences) {
    console.log("[render-build] student exam preferences schema already present");
  } else {
    console.log("[render-build] student exam preferences schema missing; applying checked-in migration");
    const migrationSql = await readFile(migrationPath, "utf8");
    await sql.unsafe(migrationSql);
  }

  const [after] = await sql`
    SELECT to_regclass('identity.student_exam_preferences')::text AS student_exam_preferences
  `;

  if (!after?.student_exam_preferences) {
    throw new Error("Student exam preferences migration completed without creating the required table");
  }

  console.log("[render-build] student exam preferences schema verified");
} finally {
  await sql.end({ timeout: 5 });
}
