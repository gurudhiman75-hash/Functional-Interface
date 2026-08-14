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
import {
  generateBlr001StandardQuestionStudioBatch,
  listBlr001StandardQuestionStudioPackages,
} from "../question-studio-standard-integration";

const entries = listBlrCp007QuestionStudioReviewEntries();
assert.equal(entries.length, 504);
assert.equal(entries.filter((entry) => entry.language === "en").length, 168);
assert.equal(entries.filter((entry) => entry.language === "hi").length, 168);
assert.equal(entries.filter((entry) => entry.language === "pa").length, 168);
assert.equal(entries.every((entry) => entry.validation.valid), true);
assert.equal(new Set(entries.map((entry) => entry.questionLanguageId)).size, 504);

const standardPackage = listBlr001StandardQuestionStudioPackages().find(
  (entry) => entry.packageId === BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
);
assert.ok(standardPackage);
assert.equal(standardPackage?.enabled, true);
assert.equal(standardPackage?.runtimeMode, "STANDARD_QUESTION_STUDIO");
assert.equal("reviewStatus" in standardPackage!, false);
assert.equal("questionBankStatus" in standardPackage!, false);
assert.equal("testEligibility" in standardPackage!, false);
assert.equal("publiclyPublishable" in standardPackage!, false);

for (const language of ["en", "hi", "pa"] as const) {
  const result = generateBlr001StandardQuestionStudioBatch({
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    language,
    count: 3,
    seed: `cp007-standard-production:${language}`,
  });
  assert.equal(result.questions.length, 3);
  assert.equal(result.generationContext.persistenceAllowed, true);
  assert.equal(result.generationContext.runtimeMode, "STANDARD_QUESTION_STUDIO");
  assert.equal(result.generationContext.reviewStatus, "REVIEW_REQUIRED");
  assert.equal(result.generationContext.publiclyPublishable, true);
  for (const question of result.questions) {
    assert.equal(question.language, language);
    assert.equal(question.validation.valid, true);
    assert.equal(question.runtimeMode, "STANDARD_QUESTION_STUDIO");
    assert.equal(question.reviewStatus, "REVIEW_REQUIRED");
    assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(question.questionBankWritable, true);
    assert.equal(question.testEligibility, "ELIGIBLE");
    assert.equal(question.publiclyPublishable, true);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.automaticStudentPublication, false);
    assert.doesNotThrow(() => assertGeneratedQuestionBankEligible(question));
  }
}

const sample = generateBlr001StandardQuestionStudioBatch({
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  language: "en",
  count: 1,
  seed: "blr-production-contract",
}).questions[0]!;
const normalized = normalizeGeneratedQuestionPayload(sample, {
  itemId: "blr-production-contract",
  generationRunCode: "BLR-PRODUCTION-TEST",
});
assert.equal(normalized.options.length, 4);
assert.equal(normalized.correctIndex, sample.correctIndex);
assert.equal(normalized.answerModel.generation.packageId, BLR_CP007_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(normalized.answerModel.generation.language, sample.language);

const repoRoot = resolve(import.meta.dirname, "../../../../../../../..");
const commonRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio.ts"), "utf8");
const bulkRoute = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts"), "utf8");
const routeIndex = readFileSync(resolve(repoRoot, "artifacts/api-server/src/routes/index.ts"), "utf8");
const operationsPage = readFileSync(resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"), "utf8");
const engine = readFileSync(resolve(repoRoot, "artifacts/api-server/src/quant-v4/generation-engine.ts"), "utf8");

assert.match(commonRoute, /router\.post\("\/runs"/);
assert.match(commonRoute, /generation_run_items/);
assert.match(commonRoute, /generation_item_versions/);
assert.match(commonRoute, /platform\.audit_events/);
assert.match(commonRoute, /platform\.outbox_events/);
assert.match(commonRoute, /'unreviewed'::generation_item_status/);
assert.match(bulkRoute, /convertApprovedGenerationItem/);
assert.match(bulkRoute, /approvalMode/);
assert.match(engine, /generateBlr001StandardQuestionStudioBatch/);
assert.doesNotMatch(routeIndex, /adminQuestionStudioReasoningRouter/);
assert.doesNotMatch(routeIndex, /adminQuestionStudioReasoningCp006Router/);
assert.doesNotMatch(routeIndex, /adminQuestionStudioReasoningBlrChapterRouter/);
assert.doesNotMatch(operationsPage, /QuestionStudioReasoningReviewPanel/);

console.log(JSON.stringify({
  verdict: "BLR_CP007_PRODUCTION_LIFECYCLE_PROVED",
  multilingualRecordCount: entries.length,
  uniqueQuestionLanguageIdCount: new Set(entries.map((entry) => entry.questionLanguageId)).size,
  standardQuestionStudioWorkflow: true,
  normalPackagePresentation: true,
  standardRuntimePresentation: true,
  separateReasoningWorkflowRemoved: true,
  generationPersistenceEnabled: true,
  approvalGatePreserved: true,
  questionBankConversionEligibleAfterApproval: true,
  mockTestEligibleAfterApproval: true,
  publicationWorkflowEligibleAfterApproval: true,
  automaticStudentPublication: false,
}, null, 2));
