import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../../../../../lib/admin-question-conversion";
import {
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSer001QuestionStudioReview,
} from "./question-studio-review-adapter";
import { SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 as ACTIVATION } from "./ser-001-internal-test-builder-activation-v1";
import { SER_CP007_PERMANENT_QL_IDS } from "../SER-PERMANENT-QL-REGISTRY";

const cwd = process.cwd();
const languages = ["en", "hi", "pa"] as const;

assert.equal(ACTIVATION.status, "ACTIVE_INTERNAL_TEST_BUILDER");
assert.equal(ACTIVATION.frozenTemplateCount, 140);
assert.equal(ACTIVATION.multilingualFrozenPayloadCount, 420);
assert.equal(ACTIVATION.permanentQlIds.length, 13);
assert.deepEqual([...ACTIVATION.permanentQlIds], [...SER_CP007_PERMANENT_QL_IDS]);
assert.deepEqual([...ACTIVATION.supportedLanguages], [...languages]);
assert.equal(ACTIVATION.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(ACTIVATION.questionBankWritable, true);
assert.equal(ACTIVATION.questionBankAcceptanceMode, "FULL_RELEASE");
assert.equal(ACTIVATION.testEligibility, "ELIGIBLE");
assert.equal(ACTIVATION.testEligible, true);
assert.equal(ACTIVATION.testBuilderEligible, true);
assert.equal(ACTIVATION.mockTestEligible, false);
assert.equal(ACTIVATION.publiclyPublishable, true);
assert.equal(ACTIVATION.publicReleaseAuthorized, false);
assert.equal(ACTIVATION.studentDeliveryAuthorized, false);
assert.equal(ACTIVATION.automaticStudentPublication, false);

// Source content authority remains frozen/review-only; activation is an overlay for new runs only.
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

let generatedCases = 0;
const qlLanguageCoverage = new Set<string>();
for (const language of languages) {
  for (const qlId of SER_CP007_PERMANENT_QL_IDS) {
    const batch = previewSer001QuestionStudioReview({
      language,
      qlId,
      count: 1,
      seed: `ser-activation:${language}:${qlId}`,
    });
    assert.equal(batch.questions.length, 1);
    const question = batch.questions[0]!;
    assert.equal(question.qlId, qlId);
    assert.equal(question.language, language);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert.ok(question.stem.trim().length > 0);
    assert.ok(question.explanation.steps.join(" ").trim().length > 0);
    assert.equal(question.validation.valid, true);
    qlLanguageCoverage.add(`${qlId}:${language}`);
    generatedCases += 1;
  }
}
assert.equal(generatedCases, 39);
assert.equal(qlLanguageCoverage.size, 39);

const releaseLifecycle = {
  questionBankStatus: ACTIVATION.questionBankStatus,
  questionBankWritable: ACTIVATION.questionBankWritable,
  questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
  runtimeMode: "FROZEN_REVIEW",
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
  testEligibility: ACTIVATION.testEligibility,
  testEligible: ACTIVATION.testEligible,
  testBuilderEligible: ACTIVATION.testBuilderEligible,
  mockTestEligible: ACTIVATION.mockTestEligible,
  publiclyPublishable: ACTIVATION.publiclyPublishable,
  publicReleaseAuthorized: ACTIVATION.publicReleaseAuthorized,
  studentDeliveryAuthorized: ACTIVATION.studentDeliveryAuthorized,
  automaticStudentPublication: ACTIVATION.automaticStudentPublication,
};
assert.equal(getGeneratedQuestionBankAcceptanceMode(releaseLifecycle), "FULL_RELEASE");
assert.equal(getGeneratedQuestionBankEligibilityIssue(releaseLifecycle), null);
assert.match(
  String(getGeneratedQuestionBankEligibilityIssue({ ...releaseLifecycle, testEligibility: "INELIGIBLE" })),
  /INELIGIBLE/,
);
assert.match(
  String(getGeneratedQuestionBankEligibilityIssue({ ...releaseLifecycle, publiclyPublishable: false })),
  /publiclyPublishable/,
);

const route = readFileSync(resolve(cwd, "src/routes/admin-question-studio-series.ts"), "utf8");
const workflowRoute = readFileSync(resolve(cwd, "src/routes/admin-question-studio-series-workflow.ts"), "utf8");
const registry = readFileSync(resolve(cwd, "src/routes/admin-question-studio-registry.ts"), "utf8");
const sharedEngine = readFileSync(resolve(cwd, "src/question-studio/shared-generation-engine-sri.ts"), "utf8");
const seriesApi = readFileSync(resolve(cwd, "../admin-app/src/features/question-studio/series-review-api.ts"), "utf8");
const seriesPanel = readFileSync(resolve(cwd, "../admin-app/src/pages/content/QuestionStudioSeriesReviewPanel.tsx"), "utf8");

assert.match(route, /ser001InternalQuestionBankPayloadV1/);
assert.match(route, /questionBankAcceptanceMode: ACTIVATION\.questionBankAcceptanceMode/);
assert.match(route, /testBuilderEligible: true/);
assert.match(route, /mockTestEligible: false/);
assert.match(route, /studentDeliveryAuthorized: false/);
assert.match(route, /automaticStudentPublication: false/);
assert.match(route, /reasoning-v1-ser-001-test-builder-v1/);
assert.match(workflowRoute, /router\.post\("\/runs"/);
assert.match(workflowRoute, /SER-001/);
assert.match(workflowRoute, /reasoning\/series\/runs/);
assert.match(registry, /adminQuestionStudioSeriesWorkflowRouter/);
assert.ok(registry.indexOf("adminQuestionStudioSeriesWorkflowRouter)") < registry.indexOf("adminQuestionStudioSeriesRouter)"));
assert.match(sharedEngine, /SER_001_QUESTION_STUDIO_PACKAGE/);
assert.match(sharedEngine, /Series — SER-001/);
assert.match(sharedEngine, /testBuilderEligible: true/);
assert.match(seriesApi, /import \{ createGenerationRun \} from '\.\/api'/);
assert.match(seriesApi, /packageId: 'SER-001'/);
assert.match(seriesApi, /canonicalProblemId: input\.qlId/);
assert.ok(!seriesApi.includes("'/admin/question-studio/reasoning/series/runs'"));
assert.match(seriesPanel, /Internal Test Builder active/);
assert.match(seriesPanel, /Mock-test release, student delivery, public release authorization and automatic student publication remain locked/);

const evidence = {
  status: "PASS_SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_V1",
  activationAuthority: ACTIVATION.authorityId,
  frozenTemplateCount: ACTIVATION.frozenTemplateCount,
  multilingualFrozenPayloadCount: ACTIVATION.multilingualFrozenPayloadCount,
  permanentQlIds: [...ACTIVATION.permanentQlIds],
  languages: [...ACTIVATION.supportedLanguages],
  targetedQlLanguageCases: generatedCases,
  questionBankStatus: ACTIVATION.questionBankStatus,
  questionBankWritable: ACTIVATION.questionBankWritable,
  questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
  testEligibility: ACTIVATION.testEligibility,
  testEligible: ACTIVATION.testEligible,
  testBuilderEligible: ACTIVATION.testBuilderEligible,
  mockTestEligible: ACTIVATION.mockTestEligible,
  publicReleaseAuthorized: ACTIVATION.publicReleaseAuthorized,
  studentDeliveryAuthorized: ACTIVATION.studentDeliveryAuthorized,
  automaticStudentPublication: ACTIVATION.automaticStudentPublication,
  sharedQuestionStudioWorkflow: true,
  legacyReviewAuthorityPreserved: true,
  nextGate: ACTIVATION.nextGate,
};

const evidencePath = resolve(cwd, "dist/reasoning-v1/series/ser-001-internal-activation-v1-evidence.json");
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(evidence.status, evidence);
