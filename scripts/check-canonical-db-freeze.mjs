import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function exists(relativePath) {
  return access(path.join(root, relativePath)).then(() => true, () => false);
}

function reject(content, pattern, message, file) {
  if (pattern.test(content)) failures.push(`${file}: ${message}`);
}

const dbFile = "artifacts/api-server/src/lib/db.ts";
const dbSource = await read(dbFile);
reject(dbSource, /ADMIN_DATABASE_URL/, "transitional second-database variable is forbidden", dbFile);
reject(
  dbSource,
  /adminSqlClient|studentSqlClient|isDedicatedAdminDatabaseConfigured/,
  "multiple-client compatibility exports are forbidden",
  dbFile,
);
if (!dbSource.includes("process.env.DATABASE_URL")) {
  failures.push(`${dbFile}: canonical DATABASE_URL lookup is missing`);
}
const postgresClients = dbSource.match(/postgres\s*\(\s*connectionString\s*\)/g) ?? [];
if (postgresClients.length !== 1) {
  failures.push(`${dbFile}: expected exactly one canonical postgres client, found ${postgresClients.length}`);
}
reject(
  dbSource,
  /postgres\s*\(\s*process\.env\./,
  "database clients must use the validated canonical connection string",
  dbFile,
);

for (const file of [
  "artifacts/api-server/.env.example",
  "docs/admin-panel-integration.md",
  "render.yaml",
]) {
  if (!(await exists(file))) continue;
  reject(await read(file), /ADMIN_DATABASE_URL/, "only DATABASE_URL may configure PostgreSQL", file);
}

const routeIndexFile = "artifacts/api-server/src/routes/index.ts";
const routeIndex = await read(routeIndexFile);
for (const forbiddenImport of [
  "./admin-data",
  "./analytics",
  "./attempts",
  "./billing",
  "./billing-webhook",
  "./bundles",
  "./daily-challenge",
  "./di-sets",
  "./generator",
  "./leaderboard",
  "./packages",
  "./pattern-generator",
  "./purchase",
  "./question-bank",
  "./responses",
  "./sections",
  "./tests",
  "./topics",
  "./upload-questions",
]) {
  if (routeIndex.includes(forbiddenImport)) {
    failures.push(`${routeIndexFile}: forbidden retired route import ${forbiddenImport}`);
  }
}
for (const requiredImport of [
  "./users",
  "./canonical-attempt-results",
  "./canonical-student-read",
  "./attempt-reliability",
  "./student-test-series",
  "./published-test-runner",
  "./admin-question-studio",
  "./admin-questions",
  "./admin-tests",
  "./admin-test-series",
  "./retired-legacy",
]) {
  if (!routeIndex.includes(requiredImport)) {
    failures.push(`${routeIndexFile}: missing canonical route ${requiredImport}`);
  }
}

const forbiddenFiles = [
  "artifacts/api-server/drizzle.config.ts",
  "artifacts/api-server/src/routes/admin-data.ts",
  "artifacts/api-server/src/routes/analytics.ts",
  "artifacts/api-server/src/routes/attempts.ts",
  "artifacts/api-server/src/routes/billing.ts",
  "artifacts/api-server/src/routes/billing-webhook.ts",
  "artifacts/api-server/src/routes/bundles.ts",
  "artifacts/api-server/src/routes/daily-challenge.ts",
  "artifacts/api-server/src/routes/di-sets.ts",
  "artifacts/api-server/src/routes/generator.ts",
  "artifacts/api-server/src/routes/leaderboard.ts",
  "artifacts/api-server/src/routes/packages.ts",
  "artifacts/api-server/src/routes/pattern-generator.ts",
  "artifacts/api-server/src/routes/purchase.ts",
  "artifacts/api-server/src/routes/question-bank.ts",
  "artifacts/api-server/src/routes/responses.ts",
  "artifacts/api-server/src/routes/sections.ts",
  "artifacts/api-server/src/routes/tests.ts",
  "artifacts/api-server/src/routes/topics.ts",
  "artifacts/api-server/src/routes/upload-questions.ts",
];
for (const file of forbiddenFiles) {
  if (await exists(file)) failures.push(`${file}: retired legacy file must not exist`);
}

const compatibilityFile = "artifacts/api-server/src/routes/retired-legacy.ts";
const compatibilitySource = await read(compatibilityFile);
reject(
  compatibilitySource,
  /from\s+["'][^"']*(?:db|schema)|sqlClient|\bdb\./,
  "compatibility responses must remain database-free",
  compatibilityFile,
);
if (!compatibilitySource.includes("LEGACY_FEATURE_RETIRED")) {
  failures.push(`${compatibilityFile}: explicit retirement response code is missing`);
}

const migrationFile = "artifacts/api-server/migrate.ts";
const migrationSource = await read(migrationFile);
if (!migrationSource.includes("LEGACY_PUBLIC_SCHEMA_MIGRATION_RETIRED")) {
  failures.push(`${migrationFile}: retired migration safety marker is missing`);
}
reject(
  migrationSource,
  /\b(?:CREATE|ALTER|DROP|TRUNCATE|INSERT|UPDATE|DELETE)\s+(?:TABLE|INTO|FROM)?/i,
  "retired migration entrypoint must not execute schema or data writes",
  migrationFile,
);

const buildFile = "artifacts/api-server/build.mjs";
const buildSource = await read(buildFile);
if (!buildSource.includes("src/index.ts")) {
  failures.push(`${buildFile}: canonical API entrypoint is missing`);
}
for (const retiredPath of forbiddenFiles.filter((file) => file.includes("/src/routes/"))) {
  const basename = path.basename(retiredPath, ".ts");
  if (buildSource.includes(`routes/${basename}`)) {
    failures.push(`${buildFile}: retired route ${basename} re-entered the build graph`);
  }
}

if (failures.length > 0) {
  console.error("Canonical database freeze failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Canonical database freeze passed: one Neon connection, canonical routes only, retired public-schema writes disabled.");
