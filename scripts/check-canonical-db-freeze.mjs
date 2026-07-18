import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const apiRoot = path.join(root, "artifacts/api-server");
const failures = [];

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function exists(relativePath) {
  return access(path.join(root, relativePath)).then(() => true, () => false);
}

function reject(content, pattern, label, file) {
  if (pattern.test(content)) failures.push(`${file}: ${label}`);
}

const dbFile = "artifacts/api-server/src/lib/db.ts";
const dbSource = await read(dbFile);
reject(dbSource, /ADMIN_DATABASE_URL/, "transitional database variable is forbidden", dbFile);
reject(dbSource, /adminSqlClient|studentSqlClient|isDedicatedAdminDatabaseConfigured/, "multiple-client compatibility export is forbidden", dbFile);
reject(dbSource, /drizzle|@workspace\/db/, "legacy public-schema ORM is forbidden in runtime connection", dbFile);
const postgresClients = dbSource.match(/postgres\s*\(/g) ?? [];
if (postgresClients.length !== 1) failures.push(`${dbFile}: expected exactly one postgres client, found ${postgresClients.length}`);

for (const file of [
  "artifacts/api-server/.env.example",
  ".github/workflows/vendor-admin-panel.yml",
  "docs/admin-panel-integration.md",
]) {
  const content = await read(file);
  reject(content, /ADMIN_DATABASE_URL/, "only DATABASE_URL may configure PostgreSQL", file);
}

const routeIndexFile = "artifacts/api-server/src/routes/index.ts";
const routeIndex = await read(routeIndexFile);
for (const forbiddenImport of [
  "./admin-data",
  "./attempts",
  "./responses",
  "./tests",
  "./billing",
  "./leaderboard",
  "./generator",
  "./question-bank",
]) {
  if (routeIndex.includes(forbiddenImport)) failures.push(`${routeIndexFile}: forbidden legacy route ${forbiddenImport}`);
}
for (const requiredImport of [
  "./canonical-attempt-results",
  "./canonical-student-read",
  "./published-test-runner",
  "./admin-question-studio",
  "./admin-questions",
  "./admin-tests",
]) {
  if (!routeIndex.includes(requiredImport)) failures.push(`${routeIndexFile}: missing canonical route ${requiredImport}`);
}

const forbiddenFiles = [
  "artifacts/api-server/drizzle.config.ts",
  "artifacts/api-server/src/routes/admin-data.ts",
  "artifacts/api-server/src/routes/attempts.ts",
  "artifacts/api-server/src/routes/responses.ts",
  "artifacts/api-server/src/routes/tests.ts",
  "artifacts/api-server/src/routes/leaderboard.ts",
  "artifacts/api-server/src/routes/daily-challenge.ts",
  "artifacts/api-server/src/routes/analytics.ts",
  "artifacts/api-server/src/routes/billing.ts",
  "artifacts/api-server/src/routes/billing-webhook.ts",
  "artifacts/api-server/src/routes/purchase.ts",
  "artifacts/api-server/src/routes/packages.ts",
  "artifacts/api-server/src/routes/bundles.ts",
  "artifacts/api-server/src/routes/generator.ts",
  "artifacts/api-server/src/routes/pattern-generator.ts",
  "artifacts/api-server/src/routes/sections.ts",
  "artifacts/api-server/src/routes/topics.ts",
  "artifacts/api-server/src/routes/di-sets.ts",
  "artifacts/api-server/src/routes/question-bank.ts",
  "artifacts/api-server/src/routes/upload-questions.ts",
];
for (const file of forbiddenFiles) {
  if (await exists(file)) failures.push(`${file}: retired legacy file must not exist`);
}

const activeRuntimeFiles = [
  dbFile,
  routeIndexFile,
  "artifacts/api-server/src/routes/users.ts",
  "artifacts/api-server/src/routes/categories.ts",
  "artifacts/api-server/src/routes/subcategories.ts",
  "artifacts/api-server/src/routes/admin-session.ts",
  "artifacts/api-server/src/routes/admin-question-studio.ts",
  "artifacts/api-server/src/routes/admin-questions.ts",
  "artifacts/api-server/src/routes/admin-tests.ts",
  "artifacts/api-server/src/routes/published-tests.ts",
  "artifacts/api-server/src/routes/published-test-runner.ts",
  "artifacts/api-server/src/routes/canonical-attempt-results.ts",
  "artifacts/api-server/src/routes/canonical-student-read.ts",
];
for (const file of activeRuntimeFiles) {
  const content = await read(file);
  reject(content, /@workspace\/db/, "active runtime must not import legacy public-schema models", file);
  reject(content, /\bpublic\.(users|tests|attempts|responses|questions)\b/i, "legacy public-schema table reference is forbidden", file);
}

if (failures.length) {
  console.error("Canonical database freeze failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Canonical database freeze passed for ${path.relative(root, apiRoot)}.`);
