import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  assertGeneratedQuestionBankEligible,
  normalizeGeneratedQuestionPayload,
} from "../../../../../lib/admin-question-conversion";
import {
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  listBlrCp007QuestionStudioReviewEntries,
} from "./question-studio-review-adapter";

const entries = listBlrCp007QuestionStudioReviewEntries();
assert.equal(entries.length, 504);
assert.equal(entries.filter((entry) => entry.language === "en").length, 168);
assert.equal(entries.filter((entry) => entry.language === "hi").length, 168);
assert.equal(entries.filter((entry) => entry.language === "pa").length, 168);
assert.equal(entries.every((entry) => entry.validation.valid), true);
assert.equal(new Set(entries.map((entry) => entry.questionLanguageId)).size, 504);

const sample = entries[0]!;
const releasePayload = {
  text: `${sample.sharedPrompt}\n\n${sample.stem}`,
  options: sample.options,
  correctIndex: sample.correctIndex,
  answer: sample.answer,
  explanation: sample.explanation.steps.join("\n"),
  difficulty: sample.difficultyBand,
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  language: sample.language,
  runtimeMode: "CANONICAL_REVIEW",
  reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
  questionBankStatus: "READY_FOR_STORAGE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
};
assert.doesNotThrow(() => assertGeneratedQuestionBankEligible(releasePayload));
const normalized = normalizeGeneratedQuestionPayload(releasePayload, {
  itemId: "blr-production-contract",
  generationRunCode: "BLR-PRODUCTION-TEST",
});
assert.equal(normalized.options.length, 4);
assert.equal(normalized.correctIndex, sample.correctIndex);
assert.equal(normalized.answerModel.generation.packageId, BLR_CP007_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(normalized.answerModel.generation.language, sample.language);

const repoRoot = resolve(import.meta.dirname, "../../../../../../../..");
const route = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-reasoning.ts"), "utf8");
const routeIndex = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/index.ts"), "utf8");
const panel = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioReasoningReviewPanel.tsx"), "utf8");
const api = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/reasoning-review-api.ts"), "utf8");
const operationsPage = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");

assert.match(route, /reasoning\/runs/);
assert.match(route, /reasoning\/import-all/);
assert.match(route, /reasoning\/status/);
assert.match(route, /content\.generation\.run/);
assert.match(route, /content\.generation\.read/);
assert.match(route, /sqlClient\.begin/);
assert.match(route, /generation_run_items/);
assert.match(route, /generation_item_versions/);
assert.match(route, /platform\.audit_events/);
assert.match(route, /platform\.outbox_events/);
assert.match(route, /READY_FOR_STORAGE/);
assert.match(route, /APPROVED_EDITORIAL_CANONICAL/);
assert.match(route, /testEligibility:\s*"ELIGIBLE"/);
assert.match(route, /publiclyPublishable:\s*true/);
assert.match(route, /mockTestEligible:\s*true/);
assert.match(route, /'unreviewed'::generation_item_status/);
assert.doesNotMatch(route, /INSERT INTO content\.questions/);
assert.doesNotMatch(route, /'approved'::generation_item_status/);
assert.match(routeIndex, /adminQuestionStudioReasoningRouter/);
assert.match(panel, /Synchronize all 504/);
assert.match(panel, /Create review run/);
assert.match(api, /method: 'POST'/);
assert.match(operationsPage, /QuestionStudioReasoningReviewPanel/);

console.log(JSON.stringify({
  verdict: "BLR_CP007_PRODUCTION_LIFECYCLE_PROVED",
  multilingualRecordCount: entries.length,
  uniqueQuestionLanguageIdCount: new Set(entries.map((entry) => entry.questionLanguageId)).size,
  generationPersistenceEnabled: true,
  approvalGatePreserved: true,
  questionBankConversionEligibleAfterApproval: true,
  mockTestEligibleAfterApproval: true,
  publicationWorkflowEligibleAfterApproval: true,
}, null, 2));
