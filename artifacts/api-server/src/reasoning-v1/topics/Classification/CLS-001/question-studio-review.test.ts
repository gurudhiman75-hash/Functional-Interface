import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../question-studio-review-registry";
import {
  CLS_001_QUESTION_STUDIO_PACKAGE_ID,
  CLS_001_QUESTION_STUDIO_QL_IDS,
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review";

assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 13);
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS.length, 13);
assert.equal(new Set(CLS_001_QUESTION_STUDIO_QL_IDS).size, 13);
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS[0], "CLS-QL-001");
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS.at(-1), "CLS-QL-013");
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount, 8);
assert.deepEqual(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLocales, ["en-IN", "hi-IN", "pa-IN"]);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.persistenceAllowed, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.manualApprovalRequired, true);

assert.ok(
  listReasoningV1QuestionStudioReviewPackages().some((entry) => entry.packageId === CLS_001_QUESTION_STUDIO_PACKAGE_ID),
  "CLS-001 must be registered in the shared Reasoning V1 Question Studio registry",
);
assert.ok(
  listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === CLS_001_QUESTION_STUDIO_PACKAGE_ID),
  "CLS-001 must be discoverable in enabled Question Studio packages",
);

let previews = 0;
for (const qlId of CLS_001_QUESTION_STUDIO_QL_IDS) {
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const input = { packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID, qlId, locale, seed: 17 } as const;
    const first = previewReasoningV1QuestionStudioReview(input) as any;
    const replay = previewReasoningV1QuestionStudioReview(input) as any;
    assert.deepEqual(replay, first, `${qlId}/${locale} preview must be deterministic`);
    assert.equal(first.packageId, "CLS-001");
    assert.equal(first.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(first.reviewOnly, true);
    assert.equal(first.questionStudioVisible, true);
    assert.equal(first.questionStudioDiscoverable, true);
    assert.equal(first.persistenceAllowed, false);
    assert.equal(first.question.qlId ?? first.question.permanentQlId, qlId);
    assert.equal(first.question.locale, locale);
    assert.equal(first.question.reviewOnly, true);
    assert.equal(first.question.questionStudioVisible, true);
    assert.equal(first.question.publiclyPublishable, false);
    assert.equal(first.question.metadata?.questionStudioDiscoverable, true);
    assert.equal(first.question.metadata?.questionBankWritable, false);
    assert.equal(first.question.metadata?.mockTestEligible, false);
    assert.equal(first.question.metadata?.publiclyPublishable, false);
    assert.equal(first.question.lifecycle?.questionStudioDiscoverable, true);
    assert.equal(first.question.lifecycle?.persistenceAllowed, false);
    assert.equal(first.question.lifecycle?.questionBankWritable, false);
    assert.equal(first.question.lifecycle?.testEligible, false);
    assert.equal(first.question.lifecycle?.mockTestEligible, false);
    assert.equal(first.question.lifecycle?.publiclyPublishable, false);
    previews += 1;
  }
}

assert.throws(
  () => previewReasoningV1QuestionStudioReview({
    packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "CLS-QL-014" as any,
    locale: "en-IN",
    seed: 17,
  } as any),
  /does not own 'CLS-QL-014'/u,
);

assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "CLS-QL-001",
    locale: "en-IN",
    seed: 17,
  }),
  /review generation only/u,
);

console.log(JSON.stringify({
  status: "CLS-001 CHAPTER CLOSURE + SHARED QUESTION STUDIO REVIEW INTEGRATION PASSED",
  permanentQlRange: "CLS-QL-001..CLS-QL-013",
  permanentQlCount: 13,
  checkpoints: 8,
  locales: ["en-IN", "hi-IN", "pa-IN"],
  deterministicPreviewCases: previews,
  questionStudioDiscoverable: true,
  reviewOnly: true,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
