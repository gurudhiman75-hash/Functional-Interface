import { TSD_CP008_QUESTION_STUDIO_COMPATIBLE_CASES } from "./question-studio-review-adapter";
import {
  TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP008_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
  TSD_CP008_QUESTION_STUDIO_LANGUAGES,
  TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewTsdCp008QuestionStudioReview,
} from "./question-studio-review-adapter-final";
import { TSD_CP008_QL099_SAME_DIRECTION_GUARDS } from "./localization-final";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 Question Studio proof failed: ${message}`);
}

const familyIds = Object.keys(TSD_CP008_QUESTION_STUDIO_COMPATIBLE_CASES);
const finalCaseCounts = familyIds.map((familyId) => previewTsdCp008QuestionStudioReview({
  language: "en",
  familyId,
  count: 1,
  seed: `capacity-${familyId}`,
}).availableCombinationsUnderFilters);

assert(familyIds.length === 54, `expected 54 frozen families, got ${familyIds.length}`);
assert(finalCaseCounts.every((count) => count >= 1 && count <= 6), "final compatible natural case count must stay within 1..6");
assert(Math.min(...finalCaseCounts) === 2, `expected minimum 2 compatible cases/family, got ${Math.min(...finalCaseCounts)}`);
assert(Math.max(...finalCaseCounts) === 6, `expected maximum 6 compatible cases/family, got ${Math.max(...finalCaseCounts)}`);
assert(TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE === 277, `expected exactly 277 final-compatible review combinations per locale, got ${TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE}`);
assert(TSD_CP008_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS === 831, `expected exactly 831 multilingual deterministic review combinations, got ${TSD_CP008_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS}`);
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations === 831, "package multilingual capacity changed");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.naturalnessPolicy === "INTEGER_PRESENTATION_FOR_KMH_INPUTS_AND_ANSWERS", "final km/h naturalness policy changed");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.ql099SameDirectionSemanticPolicy === "CASE_CONDITIONAL_FIRST_TRAIN_FASTER_GUARD", "QL099 conditional semantic policy changed");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.frozenQlCount === 9, "frozen QL count changed");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioRegistrationStatus === "REGISTERED_REVIEW_ONLY", "Studio registration is not review-only");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioStagingStatus === "REVIEW_QUEUE_ENABLED", "Studio review queue is not enabled");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus === "NOT_STORED", "bank storage opened");
assert(!TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, "bank writes opened");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.testEligibility === "INELIGIBLE" && !TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, "test eligibility opened");
assert(!TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, "public publication opened");
assert(!TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, "mock-test publication opened");
assert(TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.manualApprovalRequired, "manual approval guard lost");
assert(!TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, "automatic student publication opened");

let validated = 0;
for (const language of TSD_CP008_QUESTION_STUDIO_LANGUAGES) {
  const result = previewTsdCp008QuestionStudioReview({
    language,
    seed: `cp008-exhaustive-${language}`,
    count: TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  });
  assert(result.questions.length === 277, `${language}: exhaustive count mismatch`);
  assert(new Set(result.questions.map((question) => question.questionId)).size === result.questions.length, `${language}: duplicate question IDs`);
  assert(new Set(result.questions.map((question) => question.familyId)).size === 54, `${language}: not all 54 families rendered`);
  for (const question of result.questions) {
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${question.questionId}: options are not four unique values`);
    assert(question.correctIndex >= 0 && question.correctIndex < 4, `${question.questionId}: correct index out of range`);
    assert(question.options[question.correctIndex] === question.answer, `${question.questionId}: correct option does not own answer`);
    assert(!/[{}]/.test(question.stem), `${question.questionId}: unresolved stem placeholder`);
    assert(!/[{}]/.test(question.explanation.steps.join(" ")), `${question.questionId}: unresolved explanation placeholder`);
    assert(!/(?:\d+\/\d+)\s*(?:km\/h|किमी\/घंटा|ਕਿਮੀ\/ਘੰਟਾ)/u.test(question.answer), `${question.questionId}: fractional km/h answer leaked`);
    assert(question.validation.exactSolverVerified === true, `${question.questionId}: solver validation missing`);
    assert(question.validation.independentVerifierValid === true, `${question.questionId}: independent verifier validation missing`);
    assert(question.validation.examNaturalCase === true && question.validation.compatibleCase === true, `${question.questionId}: natural compatibility validation missing`);
    assert(question.validation.fourUniqueOptions === true && question.validation.correctAnswerOwnedByOption === true, `${question.questionId}: option validation flags failed`);
    assert(question.validation.questionBankWritable === false && question.validation.testEligible === false && question.validation.publiclyPublishable === false, `${question.questionId}: downstream lifecycle lock opened`);
    if (language === "hi") {
      assert(/\p{Script=Devanagari}/u.test(question.stem), `${question.questionId}: Hindi stem lacks Devanagari`);
      assert(!/चाल/.test(`${question.stem} ${question.explanation.steps.join(" ")}`), `${question.questionId}: deprecated Hindi चाल leaked`);
      if (question.qlId === "TSD-QL-099") {
        const sameDirection = /एक ही दिशा में/.test(question.stem);
        assert(question.stem.includes(TSD_CP008_QL099_SAME_DIRECTION_GUARDS.hi) === sameDirection, `${question.questionId}: Hindi QL099 guard does not match selected case direction`);
      }
    }
    if (language === "pa") {
      assert(/\p{Script=Gurmukhi}/u.test(question.stem), `${question.questionId}: Punjabi stem lacks Gurmukhi`);
      if (question.qlId === "TSD-QL-099") {
        const sameDirection = /ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ/.test(question.stem);
        assert(question.stem.includes(TSD_CP008_QL099_SAME_DIRECTION_GUARDS.pa) === sameDirection, `${question.questionId}: Punjabi QL099 guard does not match selected case direction`);
      }
    }
    validated += 1;
  }
}

assert(validated === 831, `expected exactly 831 exhaustively validated multilingual questions, got ${validated}`);

for (const familyId of familyIds) {
  const available = previewTsdCp008QuestionStudioReview({ language: "en", familyId, count: 1, seed: `family-count-${familyId}` }).availableCombinationsUnderFilters;
  const sample = previewTsdCp008QuestionStudioReview({ language: "en", familyId, count: available, seed: `family-${familyId}` });
  assert(sample.questions.every((question) => question.familyId === familyId), `${familyId}: family filter leaked`);
}

console.log("TSD-CP-008 QUESTION STUDIO FINAL EXHAUSTIVE REVIEW PROOF: PASS");
console.log(JSON.stringify({
  frozenQls: 9,
  frozenFamiliesPerLocale: 54,
  naturalCasesPerQl: 6,
  minimumCompatibleCasesPerFamily: Math.min(...finalCaseCounts),
  maximumCompatibleCasesPerFamily: Math.max(...finalCaseCounts),
  compatibleReviewCombinationsPerLocale: TSD_CP008_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicReviewCombinations: TSD_CP008_QUESTION_STUDIO_DETERMINISTIC_REVIEW_COMBINATIONS,
  validatedQuestions: validated,
  fractionalKmhAnswers: 0,
  ql099CaseConditionalSameDirectionGuard: true,
  questionStudioRegistrationStatus: TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioRegistrationStatus,
  questionStudioStagingStatus: TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioStagingStatus,
  questionBankWritable: TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable,
  testEligible: TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible,
  publiclyPublishable: TSD_CP008_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable,
}, null, 2));
