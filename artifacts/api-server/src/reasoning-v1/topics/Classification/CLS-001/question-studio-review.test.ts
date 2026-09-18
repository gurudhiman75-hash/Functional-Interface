import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import {
  CLS_001_QUESTION_STUDIO_LOCALES,
  CLS_001_QUESTION_STUDIO_PACKAGE_ID,
  CLS_001_QUESTION_STUDIO_QL_IDS,
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review";

interface PreviewQuestionLike {
  readonly qlId?: string;
  readonly permanentQlId?: string | null;
  readonly locale?: string;
  readonly reviewOnly?: boolean;
  readonly questionStudioVisible?: boolean;
  readonly publiclyPublishable?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly lifecycle?: Readonly<Record<string, unknown>>;
}

function preview(qlId: string, locale: "en-IN" | "hi-IN" | "pa-IN", seed: number) {
  return previewReasoningV1QuestionStudioReview({
    packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
    qlId,
    locale,
    seed,
  }) as Readonly<{
    packageId: string;
    integrationAuthority: string;
    lifecycleStatus: string;
    reviewOnly: boolean;
    questionStudioVisible: boolean;
    question: PreviewQuestionLike;
  }>;
}

assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "CLS-001");
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.chapterCheckpointCount, 8);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount, 7);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.ownershipCheckpointId, "CLS-CP-008");
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 13);
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS.length, 13);
assert.equal(new Set(CLS_001_QUESTION_STUDIO_QL_IDS).size, 13);
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS[0], "CLS-QL-001");
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS.at(-1), "CLS-QL-013");
assert.deepEqual(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLocales, ["en-IN", "hi-IN", "pa-IN"]);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.sourceRuntimeQuestionStudioDiscoverable, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

assert.ok(
  listReasoningV1QuestionStudioReviewPackages().some((entry) => entry.packageId === CLS_001_QUESTION_STUDIO_PACKAGE_ID),
  "CLS-001 must be registered in the shared Reasoning V1 Question Studio registry",
);
assert.ok(
  listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === CLS_001_QUESTION_STUDIO_PACKAGE_ID),
  "CLS-001 must be discoverable in enabled Question Studio packages",
);

let previewCount = 0;
for (const [qlIndex, qlId] of CLS_001_QUESTION_STUDIO_QL_IDS.entries()) {
  for (const [localeIndex, locale] of CLS_001_QUESTION_STUDIO_LOCALES.entries()) {
    const seed = 100 + qlIndex * 37 + localeIndex * 11;
    const first = preview(qlId, locale, seed);
    const replay = preview(qlId, locale, seed);
    assert.deepEqual(replay, first, qlId + "/" + locale + " Question Studio preview must be deterministic");
    assert.equal(first.packageId, "CLS-001");
    assert.equal(first.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(first.reviewOnly, true);
    assert.equal(first.questionStudioVisible, true);
    assert.equal(first.question.qlId ?? first.question.permanentQlId, qlId);
    assert.equal(first.question.locale, locale);
    assert.equal(first.question.reviewOnly, true);
    assert.equal(first.question.questionStudioVisible, true);
    assert.equal(first.question.publiclyPublishable, false);
    assert.equal(first.question.metadata?.questionStudioDiscoverable, true);
    assert.equal(first.question.metadata?.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
    assert.equal(first.question.metadata?.questionBankWritable, false);
    assert.equal(first.question.metadata?.testEligible, false);
    assert.equal(first.question.metadata?.mockTestEligible, false);
    assert.equal(first.question.metadata?.publiclyPublishable, false);
    assert.equal(first.question.metadata?.automaticStudentPublication, false);
    assert.equal(first.question.lifecycle?.questionBankStatus, "NOT_STORED");
    assert.equal(first.question.lifecycle?.testEligibility, "INELIGIBLE");
    assert.equal(first.question.lifecycle?.mockTestEligible, false);
    assert.equal(first.question.lifecycle?.publiclyPublishable, false);
    previewCount += 1;
  }
}

assert.equal(previewCount, 39);

assert.throws(
  () => preview("CLS-QL-014", "en-IN", 17),
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
  status: "CLS-001 FINAL CHAPTER CLOSEOUT AND SHARED QUESTION STUDIO REVIEW INTEGRATION PASSED",
  qlRange: "CLS-QL-001..013",
  qlCount: 13,
  generationCheckpoints: 7,
  ownershipCheckpoint: "CLS-CP-008",
  locales: CLS_001_QUESTION_STUDIO_LOCALES,
  deterministicPreviewCases: previewCount,
  questionStudioVisible: true,
  reviewOnly: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
}, null, 2));
