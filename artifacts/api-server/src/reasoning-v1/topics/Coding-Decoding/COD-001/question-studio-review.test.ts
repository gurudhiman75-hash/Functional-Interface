import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import {
  COD_001_QUESTION_STUDIO_PACKAGE_ID,
  COD_001_QUESTION_STUDIO_QL_IDS,
  COD_001_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review";

interface PreviewQuestionLike {
  readonly qlId?: string;
  readonly permanentQlId?: string | null;
  readonly locale?: string;
  readonly reviewOnly?: boolean;
  readonly questionStudioVisible?: boolean;
  readonly publiclyPublishable?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

function preview(qlId: string, locale: "en-IN" | "hi-IN" | "pa-IN", seed = 17) {
  return previewReasoningV1QuestionStudioReview({
    packageId: COD_001_QUESTION_STUDIO_PACKAGE_ID,
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

assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "COD-001");
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 203);
assert.equal(COD_001_QUESTION_STUDIO_QL_IDS.length, 203);
assert.equal(new Set(COD_001_QUESTION_STUDIO_QL_IDS).size, 203);
assert.equal(COD_001_QUESTION_STUDIO_QL_IDS[0], "COD-QL-001");
assert.equal(COD_001_QUESTION_STUDIO_QL_IDS.at(-1), "COD-QL-203");
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount, 10);
assert.deepEqual(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLocales, ["en-IN", "hi-IN", "pa-IN"]);
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);

assert.ok(
  listReasoningV1QuestionStudioReviewPackages().some((entry) => entry.packageId === COD_001_QUESTION_STUDIO_PACKAGE_ID),
  "COD-001 must be registered in the shared Reasoning V1 Question Studio registry",
);
assert.ok(
  listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === COD_001_QUESTION_STUDIO_PACKAGE_ID),
  "COD-001 must be discoverable in enabled Question Studio packages",
);

const legacyPreview = preview("COD-QL-001", "en-IN");
assert.equal(legacyPreview.packageId, "COD-001");
assert.equal(legacyPreview.lifecycleStatus, "REVIEW_ONLY");
assert.equal(legacyPreview.reviewOnly, true);
assert.equal(legacyPreview.questionStudioVisible, true);
assert.equal(legacyPreview.question.qlId ?? legacyPreview.question.permanentQlId, "COD-QL-001");
assert.equal(legacyPreview.question.locale, "en-IN");
assert.equal(legacyPreview.question.questionStudioVisible, true);
assert.equal(legacyPreview.question.metadata?.questionStudioDiscoverable, true);
assert.equal(legacyPreview.question.metadata?.questionBankWritable, false);
assert.equal(legacyPreview.question.metadata?.mockTestEligible, false);
assert.equal(legacyPreview.question.metadata?.publiclyPublishable, false);

for (const qlId of ["COD-QL-200", "COD-QL-201", "COD-QL-202", "COD-QL-203"] as const) {
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const first = preview(qlId, locale);
    const replay = preview(qlId, locale);
    assert.deepEqual(replay, first, `${qlId}/${locale} Question Studio preview must be deterministic`);
    assert.equal(first.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(first.reviewOnly, true);
    assert.equal(first.questionStudioVisible, true);
    assert.equal(first.question.qlId ?? first.question.permanentQlId, qlId);
    assert.equal(first.question.locale, locale);
    assert.equal(first.question.reviewOnly, true);
    assert.equal(first.question.questionStudioVisible, true);
    assert.equal(first.question.publiclyPublishable, false);
    assert.equal(first.question.metadata?.questionStudioDiscoverable, true);
    assert.equal(first.question.metadata?.questionBankWritable, false);
    assert.equal(first.question.metadata?.mockTestEligible, false);
    assert.equal(first.question.metadata?.publiclyPublishable, false);
  }
}

assert.throws(
  () => preview("COD-QL-204", "en-IN"),
  /does not own 'COD-QL-204'/u,
);

assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: COD_001_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "COD-QL-200",
    locale: "en-IN",
    seed: 17,
  }),
  /review generation only/u,
);

console.log(JSON.stringify({
  status: "COD-001 SHARED QUESTION STUDIO REVIEW INTEGRATION PASSED",
  packageId: COD_001_QUESTION_STUDIO_PACKAGE_ID,
  qlRange: "COD-QL-001..203",
  qlCount: COD_001_QUESTION_STUDIO_QL_IDS.length,
  checkpoints: COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount,
  locales: COD_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLocales,
  sourceGapPreviewCases: 4 * 3,
  questionStudioVisible: true,
  reviewOnly: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
