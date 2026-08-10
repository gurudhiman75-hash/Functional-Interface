import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  assertGeneratedQuestionBankEligible,
  normalizeGeneratedQuestionPayload,
} from "../../../../lib/admin-question-conversion.ts";
import { CALENDAR_PERMANENT_QL_IDS } from "./permanent-contracts.ts";
import {
  CAL_001_PACKAGE_ID,
  CAL_001_PRODUCTION_RELEASE,
  CAL_001_QUESTION_STUDIO_LANGUAGES,
} from "./question-studio-runtime.ts";
import {
  CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewCal001QuestionStudioReview,
} from "./question-studio-review-adapter.ts";

assert.equal(CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, CAL_001_PACKAGE_ID);
assert.equal(CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds.length, 36);
assert.deepEqual(CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE.persistenceAllowed, true);
assert.equal(CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE.bulkSyncSupported, false);
assert.equal(CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE.manualApprovalRequired, true);
assert.equal(CAL_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

const questionLanguageIds = new Set<string>();
let previewChecks = 0;
let conversionChecks = 0;

for (const qlId of CALENDAR_PERMANENT_QL_IDS) {
  for (const language of CAL_001_QUESTION_STUDIO_LANGUAGES) {
    const seed = `cal-production-integration:${qlId}:${language}`;
    const result = await previewCal001QuestionStudioReview({
      qlId,
      language,
      count: 1,
      seed,
    });
    assert.equal(result.questions.length, 1);
    const question = result.questions[0]!;

    assert.equal(question.packageId, CAL_001_PACKAGE_ID);
    assert.equal(question.qlId, qlId);
    assert.equal(question.language, language);
    assert.equal(question.questionLanguageId, question.questionId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.equal(question.validation.valid, true);
    assert.equal(question.runtimeMode, CAL_001_PRODUCTION_RELEASE.runtimeMode);
    assert.equal(question.reviewStatus, CAL_001_PRODUCTION_RELEASE.reviewStatus);
    assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
    assert.equal(question.testEligibility, "ELIGIBLE");
    assert.equal(question.publiclyPublishable, true);
    assert.equal(question.mockTestEligible, true);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.releaseAuthority, CAL_001_PRODUCTION_RELEASE.authority);
    assert.equal(questionLanguageIds.has(question.questionLanguageId), false);
    questionLanguageIds.add(question.questionLanguageId);

    assert.doesNotThrow(() => assertGeneratedQuestionBankEligible(question));
    const normalized = normalizeGeneratedQuestionPayload(question, {
      itemId: `calendar-production-${previewChecks}`,
      generationRunCode: "CAL-PRODUCTION-INTEGRATION",
    });
    const answerModel = normalized.answerModel as any;
    assert.equal(normalized.options.length, 4);
    assert.equal(normalized.correctIndex, question.correctIndex);
    assert.equal(answerModel.generation.packageId, CAL_001_PACKAGE_ID);
    assert.equal(answerModel.generation.language, language);

    previewChecks += 1;
    conversionChecks += 1;
  }
}

assert.equal(previewChecks, 108);
assert.equal(conversionChecks, 108);
assert.equal(questionLanguageIds.size, 108);

const stableA = await previewCal001QuestionStudioReview({
  qlId: "CAL-QL-036",
  language: "pa",
  count: 1,
  seed: "calendar-stable-production-id",
});
const stableB = await previewCal001QuestionStudioReview({
  qlId: "CAL-QL-036",
  language: "pa",
  count: 1,
  seed: "calendar-stable-production-id",
});
const changed = await previewCal001QuestionStudioReview({
  qlId: "CAL-QL-036",
  language: "pa",
  count: 1,
  seed: "calendar-changed-production-id",
});
assert.equal(stableA.questions[0]?.questionLanguageId, stableB.questions[0]?.questionLanguageId);
assert.notEqual(stableA.questions[0]?.questionLanguageId, changed.questions[0]?.questionLanguageId);

const repoRoot = resolve(import.meta.dirname, "../../../../../../..");
const route = readFileSync(
  resolve(repoRoot, "artifacts/api-server/src/routes/admin-question-studio-calendar.ts"),
  "utf8",
);
const routeIndex = readFileSync(
  resolve(repoRoot, "artifacts/api-server/src/routes/index.ts"),
  "utf8",
);
const api = readFileSync(
  resolve(repoRoot, "artifacts/admin-app/src/features/question-studio/calendar-review-api.ts"),
  "utf8",
);
const panel = readFileSync(
  resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioCalendarReviewPanel.tsx"),
  "utf8",
);
const operationsPage = readFileSync(
  resolve(repoRoot, "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"),
  "utf8",
);

assert.match(route, /reasoning\/calendar\/package/);
assert.match(route, /reasoning\/calendar\/preview/);
assert.match(route, /reasoning\/calendar\/runs/);
assert.match(route, /reasoning\/calendar\/status/);
assert.match(route, /sqlClient\.begin/);
assert.match(route, /generation_run_items/);
assert.match(route, /generation_item_versions/);
assert.match(route, /platform\.audit_events/);
assert.match(route, /platform\.outbox_events/);
assert.match(route, /'unreviewed'::generation_item_status/);
assert.match(route, /READY_FOR_STORAGE/);
assert.match(route, /manualApprovalRequired/);
assert.match(route, /automaticStudentPublication/);
assert.doesNotMatch(route, /INSERT INTO content\.questions/);
assert.doesNotMatch(route, /'approved'::generation_item_status/);
assert.match(routeIndex, /adminQuestionStudioCalendarRouter/);
assert.match(api, /reasoning\/calendar\/preview/);
assert.match(api, /reasoning\/calendar\/runs/);
assert.match(api, /reasoning\/calendar\/status/);
assert.match(panel, /Calendar · CAL-001/);
assert.match(panel, /Create review run/);
assert.match(panel, /no finite corpus synchronization step/);
assert.match(operationsPage, /QuestionStudioCalendarReviewPanel/);

console.log(
  JSON.stringify(
    {
      verdict: "CAL_001_FINISHED_PRODUCTION_INTEGRATION_PROVED",
      permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
      languages: CAL_001_QUESTION_STUDIO_LANGUAGES,
      previewChecks,
      conversionChecks,
      uniqueGeneratedQuestionLanguageIds: questionLanguageIds.size,
      auditedPersistenceEnabled: true,
      manualApprovalRequired: true,
      questionBankConversionEligibleAfterApproval: true,
      mockTestEligibleAfterApproval: true,
      automaticStudentPublication: false,
      adminProductionPanelMounted: true,
    },
    null,
    2,
  ),
);
