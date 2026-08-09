import { strict as assert } from "node:assert";
import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../../../question-studio-review-registry";
import {
  BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS,
  BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  listBlrCp007QuestionStudioReviewEntries,
} from "./question-studio-review-adapter";

const packages = listReasoningV1QuestionStudioReviewPackages();
const enabledPackages = listEnabledReasoningV1QuestionStudioPackages();
const entries = listBlrCp007QuestionStudioReviewEntries();

assert.equal(packages.length, 1);
assert.equal(packages[0]?.packageId, BLR_CP007_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(packages[0]?.enabled, false);
assert.equal(packages[0]?.reviewPreviewAvailable, true);
assert.equal(packages[0]?.persistenceAllowed, false);
assert.equal(packages[0]?.questionStudioVisible, false);
assert.equal(packages[0]?.questionBankEligible, false);
assert.equal(packages[0]?.mockTestEligible, false);
assert.equal(packages[0]?.publiclyPublishable, false);
assert.equal(enabledPackages.length, 0, "Review package must not enter the live enabled package list");

assert.equal(entries.length, 504);
assert.equal(new Set(entries.map((entry) => entry.questionId)).size, 504);
assert.equal(new Set(entries.map((entry) => entry.questionLanguageId)).size, 504);
assert.equal(entries.filter((entry) => entry.language === "en").length, 168);
assert.equal(entries.filter((entry) => entry.language === "hi").length, 168);
assert.equal(entries.filter((entry) => entry.language === "pa").length, 168);

const expectedQlCounts = {
  "BLR-QL-031": 48,
  "BLR-QL-032": 32,
  "BLR-QL-033": 24,
  "BLR-QL-034": 32,
  "BLR-QL-035": 32,
} as const;
const expectedDifficultyCounts = { Easy: 48, Medium: 104, Hard: 16 } as const;

for (const language of ["en", "hi", "pa"] as const) {
  const languageEntries = entries.filter((entry) => entry.language === language);
  for (const [qlId, expected] of Object.entries(expectedQlCounts)) {
    assert.equal(
      languageEntries.filter((entry) => entry.qlId === qlId).length,
      expected,
      `${language}/${qlId} count mismatch`,
    );
  }
  for (const [difficulty, expected] of Object.entries(expectedDifficultyCounts)) {
    assert.equal(
      languageEntries.filter((entry) => entry.difficultyBand === difficulty).length,
      expected,
      `${language}/${difficulty} count mismatch`,
    );
  }
}

const byLanguage = Object.fromEntries(
  (["en", "hi", "pa"] as const).map((language) => [
    language,
    new Map(
      entries
        .filter((entry) => entry.language === language)
        .map((entry) => [entry.canonicalItemId, entry]),
    ),
  ]),
) as Record<"en" | "hi" | "pa", Map<string, (typeof entries)[number]>>;

assert.deepEqual(
  [...byLanguage.en.keys()].sort(),
  [...byLanguage.hi.keys()].sort(),
  "Hindi canonical item coverage must match English",
);
assert.deepEqual(
  [...byLanguage.en.keys()].sort(),
  [...byLanguage.pa.keys()].sort(),
  "Punjabi canonical item coverage must match English",
);

for (const [itemId, english] of byLanguage.en) {
  const hindi = byLanguage.hi.get(itemId);
  const punjabi = byLanguage.pa.get(itemId);
  assert(hindi, `Missing Hindi preview for ${itemId}`);
  assert(punjabi, `Missing Punjabi preview for ${itemId}`);
  assert.equal(hindi.correctIndex, english.correctIndex);
  assert.equal(punjabi.correctIndex, english.correctIndex);
  assert.equal(hindi.qlId, english.qlId);
  assert.equal(punjabi.qlId, english.qlId);
  assert.equal(hindi.traceability.semanticFingerprint, english.traceability.semanticFingerprint);
  assert.equal(punjabi.traceability.semanticFingerprint, english.traceability.semanticFingerprint);
}

for (const entry of entries) {
  assert.equal(entry.validation.valid, true);
  assert.equal(entry.options.length, 4);
  assert.equal(entry.optionDetails.length, 4);
  assert.equal(entry.optionDetails.filter((option) => option.isCorrect).length, 1);
  assert.equal(entry.optionDetails[entry.correctIndex]?.isCorrect, true);
  assert.equal(entry.renderer.kind, "RELATION_GRAPH");
  assert.equal(entry.renderer.familyTreeAvailable, true);
  assert.equal(entry.renderer.diagramProofAvailable, true);
  assert.equal(entry.renderer.textFallbackAvailable, true);
  assert.equal(entry.parameters.runtimeMode, BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE);
  assert.equal(entry.parameters.questionBankStatus, "NOT_STORED");
  assert.equal(entry.parameters.testEligibility, "INELIGIBLE");
  assert.equal(entry.parameters.persistenceAllowed, false);
  assert.equal(entry.safety.integrationStatus, BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS);
  assert.equal(entry.safety.reviewOnly, true);
  assert.equal(entry.safety.questionStudioVisible, false);
  assert.equal(entry.safety.persistenceAllowed, false);
  assert.equal(entry.safety.questionBankEligible, false);
  assert.equal(entry.safety.mockTestEligible, false);
  assert.equal(entry.safety.publiclyPublishable, false);
}

const request = {
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  language: "pa" as const,
  qlId: "BLR-QL-031" as const,
  difficulty: "Medium" as const,
  seed: "blr-cp007-studio-proof",
  count: 12,
};
const first = previewReasoningV1QuestionStudioReview(request);
const second = previewReasoningV1QuestionStudioReview(request);
assert.deepEqual(first, second, "Question Studio review preview must be deterministic");
assert.equal(first.questions.length, 12);
assert(first.questions.every((question) => question.language === "pa"));
assert(first.questions.every((question) => question.qlId === "BLR-QL-031"));
assert(first.questions.every((question) => question.difficultyBand === "Medium"));
assert.equal(first.generationContext.persistenceAllowed, false);

const forcedSource = entries.find((entry) => entry.language === "hi")!;
const forced = previewReasoningV1QuestionStudioReview({
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  language: "hi",
  canonicalItemId: forcedSource.canonicalItemId,
  count: 1,
});
assert.equal(forced.questions[0]?.canonicalItemId, forcedSource.canonicalItemId);
assert.equal(forced.questions[0]?.questionLanguageId, forcedSource.questionLanguageId);
assert.match(forced.questions[0]?.stem ?? "", /[\u0900-\u097F]/u);

assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
    language: "en",
  }),
  /review-only; persistence and activation require a separate explicit approval gate/i,
);

console.log(JSON.stringify({
  packageId: BLR_CP007_QUESTION_STUDIO_PACKAGE_ID,
  integrationStatus: BLR_CP007_QUESTION_STUDIO_INTEGRATION_STATUS,
  runtimeMode: BLR_CP007_QUESTION_STUDIO_RUNTIME_MODE,
  reviewPackageCount: packages.length,
  enabledPackageCount: enabledPackages.length,
  previewableRecordCount: entries.length,
  languageCounts: {
    en: entries.filter((entry) => entry.language === "en").length,
    hi: entries.filter((entry) => entry.language === "hi").length,
    pa: entries.filter((entry) => entry.language === "pa").length,
  },
  qlCountsPerLanguage: expectedQlCounts,
  difficultyCountsPerLanguage: expectedDifficultyCounts,
  deterministicPreview: true,
  multilingualCanonicalParity: true,
  validationFailureCount: entries.filter((entry) => !entry.validation.valid).length,
  questionStudioVisibleCount: entries.filter((entry) => entry.safety.questionStudioVisible).length,
  persistenceAllowedCount: entries.filter((entry) => entry.safety.persistenceAllowed).length,
  questionBankEligibleCount: entries.filter((entry) => entry.safety.questionBankEligible).length,
  mockTestEligibleCount: entries.filter((entry) => entry.safety.mockTestEligible).length,
  publiclyPublishableCount: entries.filter((entry) => entry.safety.publiclyPublishable).length,
  verdict: "BLR_CP007_QUESTION_STUDIO_REVIEW_ADAPTER_PROVED__ACTIVATION_LOCKED",
}, null, 2));
