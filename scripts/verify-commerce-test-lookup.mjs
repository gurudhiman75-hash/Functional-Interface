import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../artifacts/api-server/src/routes/canonical-commerce-access-guard.ts", import.meta.url), "utf8");

assert.match(source, /async function canonicalTestId\(identifier: string\)/);
assert.match(source, /if \(uuid\.test\(normalized\)\)\s*\{/);
assert.match(source, /WHERE id = \$\{normalized\}::uuid\s+AND deleted_at IS NULL/);
assert.match(source, /WHERE lower\(public_code\) = lower\(\$\{normalized\}\)\s+AND deleted_at IS NULL/);
assert.doesNotMatch(source, /\$\{isUuid\}::boolean/, "test lookup must not use the composite boolean/UUID/public-code query");
assert.match(source, /router\.get\("\/commerce\/access\/tests\/:id", authenticate,/);
assert.match(source, /return requireTestAccess\(\{ firebaseUid, testId \}\);/);


const validUuid = "89d983e5-84e4-4f7d-9e4b-bd9e02002a59";
const uuidValidatorSources = [
  "artifacts/api-server/src/routes/canonical-commerce-access-guard.ts",
  "artifacts/api-server/src/routes/admin-taxonomy-coverage.ts",
  "artifacts/api-server/src/routes/admin-taxonomy.ts",
  "artifacts/api-server/src/current-affairs/production-recovery-runtime.ts",
];
for (const file of uuidValidatorSources) {
  const contents = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const match = contents.match(/\/\^\[0-9a-f\]\{8\}.*?\$\/i/);
  assert.ok(match, `Expected UUID validation regex in ${file}`);
  const uuidRegex = new RegExp(match[0].slice(1, -2), "i");
  assert.equal(uuidRegex.test(validUuid), true, `Existing canonical UUID must pass validator in ${file}`);
  assert.equal(uuidRegex.test("T-CF-SANDBOX-20261009"), false, `Public code must not pass validator in ${file}`);
  assert.equal(uuidRegex.test("89d983e5-84e4-4f7d-9e4b"), false, `Truncated UUID must not pass validator in ${file}`);
}

console.log("Canonical commerce test lookup and UUID validators passed.");
