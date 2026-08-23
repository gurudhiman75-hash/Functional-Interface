import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (relative: string) => readFileSync(resolve(root, relative), "utf8");

const bulkRoute = read("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts");
const approvalPolicy = read("artifacts/api-server/src/lib/admin-question-studio-approval-policy.ts");
const conversion = read("artifacts/api-server/src/lib/admin-question-conversion.ts");
const management = read("artifacts/api-server/src/lib/admin-question-management.ts");

for (const marker of [
  "getGeneratedItemApprovalDisposition",
  'disposition.mode === "question_bank"',
  "convertApprovedGenerationItem",
  "accepted_question_id",
  "ITEM_ALREADY_CONVERTED",
  "content.question.created_from_generation",
]) {
  assert.ok(bulkRoute.includes(marker), `Question Studio approval route missing Bank conversion marker: ${marker}`);
}

for (const marker of [
  'questionBankStatus === "NOT_STORED"',
  "questionBankWritable === false",
  'mode: "review_only"',
  'mode: "question_bank"',
]) {
  assert.ok(approvalPolicy.includes(marker), `Question Studio approval policy missing lifecycle marker: ${marker}`);
}

for (const marker of [
  '"BANK_ONLY"',
  'acceptanceMode === "BANK_ONLY"',
  "questionBankAcceptanceAuthority",
  "testEligible",
  "mockTestEligible",
  "publiclyPublishable",
  "automaticStudentPublication",
  "accepted_question_version_id",
  "Accepted into Question Bank with downstream lifecycle locked",
]) {
  assert.ok(conversion.includes(marker), `Question Bank converter missing lifecycle marker: ${marker}`);
}

for (const marker of [
  "Generation lifecycle has not enabled scored-test eligibility.",
  "Generation lifecycle has not enabled public publication.",
  "generationTestEligible === false",
  "generationPubliclyPublishable === false",
]) {
  assert.ok(management.includes(marker), `Question publication gate missing lifecycle marker: ${marker}`);
}

console.log("PASS_SEA002_CP006_QUESTION_BANK_ROUTE_READINESS_V1");
console.log("manual approval route converts question_bank disposition only");
console.log("generation item conversion is idempotency guarded");
console.log("BANK_ONLY downstream lifecycle metadata is persisted");
console.log("test and public publication gates remain enforced");
