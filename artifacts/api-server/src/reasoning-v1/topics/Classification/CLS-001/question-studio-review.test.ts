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

interface PreviewLike {
  readonly packageId: string;
  readonly lifecycleStatus: string;
  readonly reviewOnly: boolean;
  readonly questionStudioVisible: boolean;
  readonly questionBankWritable: boolean;
  readonly testEligible: boolean;
  readonly mockTestEligible: boolean;
  readonly publiclyPublishable: boolean;
  readonly question: Readonly<Record<string, unknown>>;
}

assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "CLS-001");
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointCount, 8);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 13);
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS.length, 13);
assert.equal(new Set(CLS_001_QUESTION_STUDIO_QL_IDS).size, 13);
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS[0], "CLS-QL-001");
assert.equal(CLS_001_QUESTION_STUDIO_QL_IDS.at(-1), "CLS-QL-013");
assert.deepEqual(
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLocales,
  ["en-IN", "hi-IN", "pa-IN"],
);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.enabled, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(
  CLS_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication,
  false,
);

assert.ok(
  listReasoningV1QuestionStudioReviewPackages().some(
    (entry) => entry.packageId === CLS_001_QUESTION_STUDIO_PACKAGE_ID,
  ),
  "CLS-001 must be registered in the shared Reasoning review registry",
);
assert.ok(
  listEnabledReasoningV1QuestionStudioPackages().some(
    (entry) => entry.packageId === CLS_001_QUESTION_STUDIO_PACKAGE_ID,
  ),
  "CLS-001 must be discoverable in enabled Question Studio review packages",
);

let previewCount = 0;
for (const [qlIndex, qlId] of CLS_001_QUESTION_STUDIO_QL_IDS.entries()) {
  for (const locale of CLS_001_QUESTION_STUDIO_LOCALES) {
    const seed = 17 + qlIndex * 37;
    const optionCount = qlIndex % 2 === 0 ? 4 as const : 5 as const;
    const request = {
      packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
      qlId,
      locale,
      seed,
      optionCount,
    };
    const first = previewReasoningV1QuestionStudioReview(request) as PreviewLike;
    const replay = previewReasoningV1QuestionStudioReview(request) as PreviewLike;

    assert.deepEqual(
      replay,
      first,
      `${qlId}/${locale}: Question Studio preview must be deterministic`,
    );
    assert.equal(first.packageId, "CLS-001");
    assert.equal(first.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(first.reviewOnly, true);
    assert.equal(first.questionStudioVisible, true);
    assert.equal(first.questionBankWritable, false);
    assert.equal(first.testEligible, false);
    assert.equal(first.mockTestEligible, false);
    assert.equal(first.publiclyPublishable, false);

    assert.equal(first.question.qlId, qlId);
    assert.equal(first.question.permanentQlId, qlId);
    assert.equal(first.question.reviewOnly, true);
    assert.equal(first.question.questionStudioVisible, true);

    const metadata =
      first.question.metadata as Readonly<Record<string, unknown>>;
    assert.equal(metadata.questionStudioDiscoverable, true);
    assert.equal(metadata.questionBankWritable, false);
    assert.equal(metadata.testEligible, false);
    assert.equal(metadata.mockTestEligible, false);
    assert.equal(metadata.publiclyPublishable, false);
    assert.equal(metadata.automaticStudentPublication, false);
    previewCount += 1;
  }
}

assert.equal(previewCount, 39);

assert.throws(
  () => previewReasoningV1QuestionStudioReview({
    packageId: CLS_001_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "CLS-QL-014",
    locale: "en-IN",
    seed: 17,
  }),
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
  status: "CLS-001 SHARED QUESTION STUDIO REVIEW INTEGRATION PASSED",
  qlRange: "CLS-QL-001..013",
  qlCount: CLS_001_QUESTION_STUDIO_QL_IDS.length,
  locales: CLS_001_QUESTION_STUDIO_LOCALES,
  previewCases: previewCount,
  reviewOnly: true,
  questionStudioVisible: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
