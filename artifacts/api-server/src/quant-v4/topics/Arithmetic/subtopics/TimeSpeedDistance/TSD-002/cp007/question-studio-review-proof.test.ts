import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import {
  TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES,
  TSD_CP007_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  TSD_CP007_QUESTION_STUDIO_DIFFICULTIES,
  TSD_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  TSD_CP007_QUESTION_STUDIO_LANGUAGES,
  TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewTsdCp007QuestionStudioReview,
  type TsdCp007QuestionStudioLanguage,
  type TsdCp007QuestionStudioQlId,
} from "./question-studio-review-adapter";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 Question Studio review proof failed: ${message}`);
}

type ReviewQuestion = Readonly<{
  qlId: string;
  familyId: string;
  language: string;
  locale: string;
  difficultyBand: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
  reviewStatus: string;
  questionBankStatus: string;
  questionBankWritable: boolean;
  testEligibility: string;
  testEligible: boolean;
  publiclyPublishable: boolean;
  mockTestEligible: boolean;
  manualApprovalRequired: boolean;
  automaticStudentPublication: boolean;
  integrationAuthority: string;
  validation: Readonly<{
    valid: boolean;
    frozenAuthority: boolean;
    compatibleCase: boolean;
    exactlyFourOptions: boolean;
    uniqueOptions: boolean;
    sourceLifecycleLocked: boolean;
  }>;
}>;

assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.enabled, "review package is not enabled");
assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, "package must remain review-only");
assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, "package is not visible in Question Studio");
assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, "package is not discoverable in Question Studio");
assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus === "NOT_STORED", "question bank lock opened");
assert(!TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, "question bank became writable");
assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.testEligibility === "INELIGIBLE", "test eligibility opened");
assert(!TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, "public publication opened");
assert(JSON.stringify(TSD_CP007_QUESTION_STUDIO_LANGUAGES) === JSON.stringify(["en", "hi", "pa"]), "language registration changed");
assert(JSON.stringify(TSD_CP007_QUESTION_STUDIO_DIFFICULTIES) === JSON.stringify(["EASY", "MEDIUM"]), "difficulty registration changed");

const familyIds = TSD_CP007_FROZEN_ENGLISH_REGISTRY.flatMap((ql) => ql.stemFamilies.map((family) => family.familyId));
assert(familyIds.length === 66 && new Set(familyIds).size === 66, "expected 66 unique frozen family IDs");
assert(Object.keys(TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES).length === 66, "compatible-case map must cover all 66 families");
for (const familyId of familyIds) {
  const cases = TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES[familyId];
  assert(Boolean(cases?.length), `${familyId}: no compatible executable cases`);
  assert((cases?.length ?? 0) <= 12, `${familyId}: compatible case count exceeds latent pool`);
  assert(new Set(cases).size === cases.length, `${familyId}: duplicate compatible case index`);
  assert(cases.every((caseIndex) => Number.isInteger(caseIndex) && caseIndex >= 1 && caseIndex <= 12), `${familyId}: invalid compatible case index`);
}

const computedPerLocale = familyIds.reduce((sum, familyId) => sum + TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES[familyId]!.length, 0);
assert(TSD_CP007_QUESTION_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE === computedPerLocale, "per-locale compatible combination count is stale");
assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations === computedPerLocale * 3, "multilingual deterministic combination count is stale");

let validatedQuestions = 0;

function validateQuestion(question: ReviewQuestion, language: TsdCp007QuestionStudioLanguage, qlId: TsdCp007QuestionStudioQlId, familyId: string) {
  validatedQuestions += 1;
  assert(question.qlId === qlId, `${language}/${qlId}: wrong QL returned`);
  assert(question.familyId === familyId, `${language}/${qlId}/${familyId}: wrong family returned`);
  assert(question.language === language, `${language}/${qlId}/${familyId}: language changed`);
  assert(question.options.length === 4, `${language}/${qlId}/${familyId}: expected four options`);
  assert(new Set(question.options).size === 4, `${language}/${qlId}/${familyId}: duplicate options`);
  assert(question.correctIndex >= 0 && question.correctIndex < 4, `${language}/${qlId}/${familyId}: invalid correct index`);
  assert(question.options[question.correctIndex] === question.answer, `${language}/${qlId}/${familyId}: answer ownership changed`);
  assert(question.explanation.conclusion === question.answer, `${language}/${qlId}/${familyId}: explanation conclusion differs from answer`);
  assert(question.explanation.steps.length >= 1, `${language}/${qlId}/${familyId}: explanation missing`);
  assert(!/[{}]/.test(question.stem), `${language}/${qlId}/${familyId}: unresolved stem placeholder`);
  assert(!/[{}]/.test(question.explanation.steps.join("\n")), `${language}/${qlId}/${familyId}: unresolved explanation placeholder`);
  assert(question.reviewStatus === "APPROVED_MULTILINGUAL_FROZEN", `${language}/${qlId}/${familyId}: review status changed`);
  assert(question.questionBankStatus === "NOT_STORED" && !question.questionBankWritable, `${language}/${qlId}/${familyId}: bank lock opened`);
  assert(question.testEligibility === "INELIGIBLE" && !question.testEligible, `${language}/${qlId}/${familyId}: test lock opened`);
  assert(!question.publiclyPublishable && !question.mockTestEligible, `${language}/${qlId}/${familyId}: publication lock opened`);
  assert(question.manualApprovalRequired && !question.automaticStudentPublication, `${language}/${qlId}/${familyId}: manual review lock changed`);
  assert(question.integrationAuthority === TSD_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY, `${language}/${qlId}/${familyId}: integration authority changed`);
  assert(question.validation.valid && question.validation.frozenAuthority && question.validation.compatibleCase && question.validation.exactlyFourOptions && question.validation.uniqueOptions && question.validation.sourceLifecycleLocked, `${language}/${qlId}/${familyId}: validation flags failed`);
  if (language === "hi") {
    assert(/[\u0900-\u097F]/.test(question.stem), `${qlId}/${familyId}: Hindi script missing`);
    assert(!question.stem.includes("चाल"), `${qlId}/${familyId}: banned Hindi term चाल leaked into stem`);
    assert(!question.explanation.steps.join("\n").includes("चाल"), `${qlId}/${familyId}: banned Hindi term चाल leaked into explanation`);
  }
  if (language === "pa") assert(/[\u0A00-\u0A7F]/.test(question.stem), `${qlId}/${familyId}: Punjabi script missing`);
}

for (const language of TSD_CP007_QUESTION_STUDIO_LANGUAGES) {
  for (const ql of TSD_CP007_FROZEN_ENGLISH_REGISTRY) {
    const qlId = ql.qlId as TsdCp007QuestionStudioQlId;
    assert(TSD_CP007_PERMANENT_QL_IDS.includes(qlId), `${qlId}: non-permanent QL entered Studio proof`);
    for (const family of ql.stemFamilies) {
      const compatibleCases = TSD_CP007_QUESTION_STUDIO_COMPATIBLE_CASES[family.familyId]!;
      const result = previewTsdCp007QuestionStudioReview({
        language,
        qlId,
        familyId: family.familyId,
        seed: `proof:${language}:${family.familyId}`,
        count: compatibleCases.length,
      });
      const questions = result.questions as readonly ReviewQuestion[];
      assert(questions.length === compatibleCases.length, `${language}/${family.familyId}: compatible-case batch size changed`);
      for (const question of questions) validateQuestion(question, language, qlId, family.familyId);
    }
  }
}

assert(validatedQuestions === TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations, "proof did not exercise every registered multilingual compatible combination");

for (const difficulty of TSD_CP007_QUESTION_STUDIO_DIFFICULTIES) {
  const sample = previewTsdCp007QuestionStudioReview({ language: "hi", difficulty, seed: `difficulty:${difficulty}`, count: 20 });
  const questions = sample.questions as readonly ReviewQuestion[];
  assert(questions.every((question) => question.difficultyBand === difficulty), `${difficulty}: difficulty filter leaked another band`);
}

console.log("TSD-CP-007 QUESTION STUDIO REVIEW PROOF: PASS");
console.log(JSON.stringify({
  packageId: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.packageId,
  checkpointId: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointId,
  permanentQls: TSD_CP007_PERMANENT_QL_IDS.length,
  frozenFamiliesPerLocale: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.frozenFamiliesPerLocale,
  latentNumericCasePool: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.latentNumericCasePool,
  minimumCompatibleCasesPerFamily: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.minimumCompatibleCasesPerFamily,
  maximumCompatibleCasesPerFamily: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.maximumCompatibleCasesPerFamily,
  compatibleReviewCombinationsPerLocale: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.compatibleReviewCombinationsPerLocale,
  deterministicReviewCombinations: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations,
  languages: TSD_CP007_QUESTION_STUDIO_LANGUAGES,
  validatedQuestions,
  questionStudioRegistrationStatus: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioRegistrationStatus,
  questionStudioStagingStatus: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioStagingStatus,
  questionBankWritable: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable,
  testEligible: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible,
  publiclyPublishable: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable,
}, null, 2));
