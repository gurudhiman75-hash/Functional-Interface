// Number System's generation POST must bypass unrelated ARG/COM/SRI lazy
// authorities. Preserve all existing package lifecycle route owners.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const registry = readFileSync(
  "artifacts/api-server/src/routes/admin-question-studio-registry.ts",
  "utf8",
);
const start = registry.indexOf('router.post("/runs", (req, res, next) =>');
const legacy = registry.indexOf('router.use(adminQuestionStudioBulkHardeningRouter);');
assert.ok(start > 0 && legacy > start, "Number System fast-path precedes heavyweight fallbacks");
const fastPath = registry.slice(start, legacy);

test("NUM-001 is handled by existing canonical multi-engine authority", () => {
  assert.match(fastPath, /packageId === "TRG-002" \\|\\| packageId === "NUM-001"/);
  assert.match(fastPath, /adminQuestionStudioEngineV1Router\\(req, res, next\\)/);
});

test("NUM-002 retains CP014 then CP013 then the existing legacy owner", () => {
  assert.match(fastPath, /if \\(packageId === "NUM-002"\\)/);
  const cp014 = fastPath.indexOf("adminQuestionStudioCp014Router(req, res,");
  const cp013 = fastPath.indexOf("adminQuestionStudioCp013Router(req, res,");
  const legacyOwner = fastPath.indexOf("adminQuestionStudioAverageRouter(req, res, next)");
  assert.ok(cp014 >= 0 && cp013 > cp014 && legacyOwner > cp013);
});

test("the single selected NUM-002 CP gets forwarded to legacy selectors", () => {
  assert.match(fastPath, /selectedCpIds.length === 1/);
  assert.match(fastPath, /canonicalProblemId: selectedCpIds\\[0\\]/);
});

test("lazy failed imports must be retried on another request", () => {
  assert.match(registry, /routerPromise = null;/);
});
