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

console.log("Canonical commerce test lookup contract passed.");
