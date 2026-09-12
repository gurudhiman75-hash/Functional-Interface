import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const registrySource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  "utf8",
);
const engineRouteSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts"),
  "utf8",
);

for (const marker of [
  'import adminQuestionStudioEngineV1Router from "./admin-question-studio-engine-v1";',
  "router.use(adminQuestionStudioEngineV1Router);",
]) {
  assert(registrySource.includes(marker), `Question Studio registry missing multi-engine route marker: ${marker}`);
}

const sriIndex = registrySource.indexOf("router.use(adminQuestionStudioSriRouter);");
const engineIndex = registrySource.indexOf("router.use(adminQuestionStudioEngineV1Router);");
const dsfIndex = registrySource.indexOf("router.use(adminQuestionStudioDataSufficiencyCurrentRouter);");
const legacyIndex = registrySource.indexOf("router.use(adminQuestionStudioRouter);");
assert(sriIndex >= 0 && engineIndex > sriIndex, "Multi-engine route must follow SRI compatibility router.");
assert(dsfIndex > engineIndex, "Multi-engine route must precede DSF/legacy POST fallbacks.");
assert(legacyIndex > engineIndex, "Multi-engine route must precede legacy Question Studio router.");

for (const marker of [
  'router.post(\n  "/runs"',
  "nonQuantRunGate",
  "generateQuestionStudioQuestions",
  "content.generation_runs",
  "content.generation_run_items",
  "content.generation_item_versions",
  "platform.audit_events",
  "platform.outbox_events",
  "difficultyForRequest",
  "pkg?.difficultyFilterSupported === false",
  'if (!raw || raw === "Mixed") return undefined;',
]) {
  assert(engineRouteSource.includes(marker), `Multi-engine persistence route missing marker: ${marker}`);
}

for (const forbidden of [
  "convertApprovedGenerationItem",
  "accepted_question_id",
  "accepted_question_version_id",
  "INSERT INTO content.questions",
  "INSERT INTO content.question_versions",
]) {
  assert(!engineRouteSource.includes(forbidden), `REVIEW_ONLY generation route contains canonical Question Bank conversion marker: ${forbidden}`);
}

console.log("[COM003-QUESTION-STUDIO-REVIEW-ONLY-ROUTE-CONTRACT-V1]", {
  valid: true,
  routeOrder: "SRI -> MULTI_ENGINE -> DSF/LEGACY",
  reviewRunTables: 3,
  auditOutbox: true,
  difficultyFailClosed: true,
  canonicalQuestionBankConversion: false,
});
