import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function read(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

const algebra = read("src/quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-bank-activation-v1.ts");
const geometry = read("src/quant-v4/topics/AdvancedMathematics/subtopics/Geometry/GEO-GAP-CLOSURE-V1-STATUS.md");
const trg001 = read("src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-001/post-final5-full-internal-activation-v1.ts");
const trg002 = read("src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/exam-readiness-v4-approved-governance.ts");
const trigEngine = read("src/question-studio/shared-generation-engine-trigonometry.ts");
const mensurationDelivery = read("src/quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/mensuration-question-studio-delivery-v3.ts");
const mensurationRoute = read("src/routes/admin-question-studio-mensuration-full.ts");

// Algebra: manually approved Question Studio items can enter Question Bank, but downstream release is locked.
for (const fragment of [
  "QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1",
  'activationStatus: "ACTIVE_INTERNAL_BANK_ONLY"',
  "questionBankWritable: lifecycle.questionBankWritable",
  "testEligible: lifecycle.testEligible",
  "mockTestEligible: lifecycle.mockTestEligible",
  "publiclyPublishable: lifecycle.publiclyPublishable",
]) {
  assert.ok(algebra.includes(fragment), `Algebra lifecycle drift: ${fragment}`);
}

// Geometry: permanent multilingual freeze and normal Question Studio integration are already complete; downstream stays locked.
for (const fragment of [
  "Permanent QLs:** `75`",
  "Hindi/Punjabi:** `V2_APPROVED_AND_PROVEN_FROZEN`",
  "Question Studio package:** `GEO-001` — `ACTIVE_AND_DISCOVERABLE`",
  "questionBankWritable = false",
  "testEligible = false",
  "publiclyPublishable = false",
]) {
  assert.ok(geometry.includes(fragment), `Geometry lifecycle drift: ${fragment}`);
}

// TRG-001: current authority is later than the old Question-Studio-only stage.
for (const fragment of [
  'status: "ACTIVE_INTERNAL_FULL"',
  'activationScope: "QUESTION_STUDIO_QUESTION_BANK_TEST_BUILDER_INTERNAL"',
  "questionBankWritable: true",
  'testEligibility: "ELIGIBLE"',
  "testEligible: true",
  "testBuilderEligible: true",
  "publiclyPublishable: false",
]) {
  assert.ok(trg001.includes(fragment), `TRG-001 lifecycle drift: ${fragment}`);
}
assert.ok(trigEngine.includes("TRG001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1"));

// TRG-002: approved/frozen family is internally bank/test eligible but not public.
for (const fragment of [
  "questionBankStatus: 'WRITABLE'",
  "testEligibility: 'ELIGIBLE'",
  "publiclyPublishable: false",
]) {
  assert.ok(trg002.includes(fragment), `TRG-002 lifecycle drift: ${fragment}`);
}
assert.ok(trigEngine.includes("questionBankWritable: true"));
assert.ok(trigEngine.includes("mockTestEligible: true"));

// Mensuration: mixed maturity must stay fail-closed per item.
for (const fragment of [
  "PER_ITEM_FAIL_CLOSED",
  '"MEN-CP-007": ["APPROVED_EDITORIAL_ENGLISH"]',
  '"MEN-CP-008": ["ENGLISH_IMPLEMENTATION_FROZEN"]',
  '"MEN-CP-009": ["APPROVED_MULTILINGUAL_TEACHING_FROZEN"]',
  '"MEN-CP-010": ["ENGLISH_REVIEW_APPROVED", "EXAM_REALISM_REVIEW_APPROVED"]',
  '"MEN-CP-013": ["ENGLISH_REVIEW_APPROVED"]',
  "LOCALIZATION_REMAINS_CONTROLLED_REVIEW",
  "CP_NOT_BANK_ONLY_APPROVED",
  "QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1",
  "QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1",
]) {
  assert.ok(mensurationDelivery.includes(fragment), `Mensuration delivery boundary drift: ${fragment}`);
}
for (const fragment of [
  "generateMensurationDeliveredBatchV3",
  "MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3",
  "questionBankAcceptanceMode: question.questionBankAcceptanceMode",
  "testEligible: question.testEligible",
  "publiclyPublishable: question.publiclyPublishable",
  'questionBankWritePolicy: "ELIGIBLE_APPROVED_ITEMS_ONLY"',
]) {
  assert.ok(mensurationRoute.includes(fragment), `Mensuration route boundary drift: ${fragment}`);
}

assert.equal(mensurationRoute.includes("convertApprovedGenerationItem"), false,
  "Mensuration must use the shared approval/converter path, not own Question Bank conversion");
assert.equal(mensurationRoute.includes("INSERT INTO content.questions"), false,
  "Mensuration route must never write canonical Question Bank rows directly");
assert.equal(mensurationRoute.includes("INSERT INTO content.question_versions"), false,
  "Mensuration route must never write Question Bank versions directly");
assert.ok(mensurationRoute.includes("INSERT INTO content.generation_runs"));
assert.ok(mensurationRoute.includes("INSERT INTO content.generation_run_items"));
assert.ok(mensurationRoute.includes("INSERT INTO content.generation_item_versions"));

console.log("PASS_QUANT_V4_ADVANCED_MATHEMATICS_LIFECYCLE_P2", {
  algebra: "BANK_ONLY",
  geometry: "MULTILINGUAL_FROZEN_QS_ACTIVE_DOWNSTREAM_LOCKED",
  trigonometry: "INTERNAL_QUESTION_BANK_TEST_BUILDER_PUBLIC_LOCKED",
  mensuration: "PER_ITEM_FAIL_CLOSED_MIXED_REVIEW_AND_BANK_ONLY",
  mensurationPublicRelease: false,
});
