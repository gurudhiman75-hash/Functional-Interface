import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageSourceRoot = resolve(process.cwd(), "src");
const sourceRoot = existsSync(resolve(packageSourceRoot, "routes"))
  ? packageSourceRoot
  : resolve(process.cwd(), "artifacts/api-server/src");

const route = readFileSync(
  resolve(sourceRoot, "routes/admin-questions.ts"),
  "utf8",
);

assert.match(route, /getGeneratedItemApprovalDisposition/);
assert.match(route, /disposition\.mode !== "question_bank"/);
assert.match(route, /skippedCount/);
assert.match(route, /v\.payload/);
assert.doesNotMatch(
  route,
  /SELECT id::text AS id\s+FROM content\.generation_run_items\s+WHERE status = 'approved'/,
);

console.log("[RECONCILE-APPROVED-LIFECYCLE-CONTRACT-V1]", {
  valid: true,
  reviewOnlySkipped: true,
  explicitBankAuthorityRequired: true,
});
