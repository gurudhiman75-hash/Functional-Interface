import { TSD_CP009_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import {
  TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP009_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
  TSD_CP009_QUESTION_STUDIO_LANGUAGES,
  TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewTsdCp009QuestionStudioReview,
} from "./question-studio-review-adapter";
import { TSD_CP009_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 Question Studio proof failed: ${message}`);
}

assert(TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.sourceLocalizationStatus === "FROZEN", "Studio is not sourced from frozen localization");
assert(TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus === "NOT_STORED", "Question Bank lock changed");
assert(TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.testEligibility === "INELIGIBLE", "test eligibility changed");
assert(TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable === false, "public publishing lock changed");
assert(TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.manualApprovalRequired === true, "manual approval requirement changed");
assert(TSD_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.optionPolicy === "EXACTLY_FOUR_UNIQUE_OPTIONS", "option policy changed");

const familyIds = TSD_CP009_FROZEN_ENGLISH_REGISTRY.flatMap((ql) => ql.stemFamilies.map((family) => family.familyId));
assert(familyIds.length === 66, "expected 66 frozen English families");

for (const language of TSD_CP009_QUESTION_STUDIO_LANGUAGES) {
  const full = previewTsdCp009QuestionStudioReview({ language, count: TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE, seed: "cp009-studio-proof" });
  assert(full.questions.length === TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE, `${language}: capacity drifted`);
  assert(new Set(full.questions.map((question) => `${question.familyId}:${question.parameters.sourceCaseFamilyId}`)).size === full.questions.length, `${language}: duplicate family/case combinations`);
  assert(new Set(full.questions.map((question) => question.qlId)).size === TSD_CP009_PERMANENT_QL_IDS.length, `${language}: QL coverage incomplete`);
  assert(new Set(full.questions.map((question) => question.familyId)).size === 66, `${language}: family coverage incomplete`);
  for (const question of full.questions) {
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${language}/${question.questionId}: options are not four unique values`);
    assert(question.options.filter((option) => option === question.answer).length === 1, `${language}/${question.questionId}: canonical answer not present exactly once`);
    assert(question.correctIndex >= 0 && question.options[question.correctIndex] === question.answer, `${language}/${question.questionId}: correctIndex mismatch`);
    assert(question.validation.solverVerified === true && question.validation.independentVerifierAccepted === true, `${language}/${question.questionId}: verification gate missing`);
    assert(question.reviewStatus === "FROZEN_REVIEW_ONLY", `${language}/${question.questionId}: review status changed`);
  }
  for (const familyId of familyIds) {
    const sample = previewTsdCp009QuestionStudioReview({ language, familyId, count: 1, seed: `family-${familyId}` });
    assert(sample.questions[0]?.familyId === familyId, `${language}/${familyId}: family filter failed`);
  }
}

assert(TSD_CP009_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS === TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE * 3, "total multilingual capacity mismatch");

console.log("TSD-CP-009 QUESTION STUDIO REVIEW ADAPTER PROOF: PASS");
console.log(JSON.stringify({
  permanentQls: TSD_CP009_PERMANENT_QL_IDS.length,
  familiesPerLocale: 66,
  compatibleCombinationsPerLocale: TSD_CP009_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicMultilingualCombinations: TSD_CP009_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
  languages: TSD_CP009_QUESTION_STUDIO_LANGUAGES,
  fourUniqueOptions: true,
  exactSolverPlusIndependentVerifier: true,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
