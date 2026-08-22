import {
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
  runtimeMode: string;
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
assert(TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations === 2376, "expected 2,376 reviewed deterministic combinations");
assert(JSON.stringify(TSD_CP007_QUESTION_STUDIO_LANGUAGES) === JSON.stringify(["en", "hi", "pa"]), "language registration changed");
assert(JSON.stringify(TSD_CP007_QUESTION_STUDIO_DIFFICULTIES) === JSON.stringify(["EASY", "MEDIUM"]), "difficulty registration changed");

let validatedQuestions = 0;
const seenFamilies = new Map<string, Set<string>>();

function validateQuestion(question: ReviewQuestion, language: TsdCp007QuestionStudioLanguage, qlId: TsdCp007QuestionStudioQlId) {
  validatedQuestions += 1;
  assert(question.qlId === qlId, `${language}/${qlId}: wrong QL returned`);
  assert(question.language === language, `${language}/${qlId}/${question.familyId}: language changed`);
  assert(question.options.length === 4, `${language}/${qlId}/${question.familyId}: expected four options`);
  assert(new Set(question.options).size === 4, `${language}/${qlId}/${question.familyId}: duplicate options`);
  assert(question.correctIndex >= 0 && question.correctIndex < 4, `${language}/${qlId}/${question.familyId}: invalid correct index`);
  assert(question.options[question.correctIndex] === question.answer, `${language}/${qlId}/${question.familyId}: answer ownership changed`);
  assert(question.explanation.conclusion === question.answer, `${language}/${qlId}/${question.familyId}: explanation conclusion differs from answer`);
  assert(question.explanation.steps.length >= 1, `${language}/${qlId}/${question.familyId}: explanation missing`);
  assert(!/[{}]/.test(question.stem), `${language}/${qlId}/${question.familyId}: unresolved stem placeholder`);
  assert(!/[{}]/.test(question.explanation.steps.join("\n")), `${language}/${qlId}/${question.familyId}: unresolved explanation placeholder`);
  assert(question.reviewStatus === "APPROVED_MULTILINGUAL_FROZEN", `${language}/${qlId}/${question.familyId}: review status changed`);
  assert(question.questionBankStatus === "NOT_STORED" && !question.questionBankWritable, `${language}/${qlId}/${question.familyId}: bank lock opened`);
  assert(question.testEligibility === "INELIGIBLE" && !question.testEligible, `${language}/${qlId}/${question.familyId}: test lock opened`);
  assert(!question.publiclyPublishable && !question.mockTestEligible, `${language}/${qlId}/${question.familyId}: publication lock opened`);
  assert(question.manualApprovalRequired && !question.automaticStudentPublication, `${language}/${qlId}/${question.familyId}: manual review lock changed`);
  assert(question.integrationAuthority === TSD_CP007_QUESTION_STUDIO_INTEGRATION_AUTHORITY, `${language}/${qlId}/${question.familyId}: integration authority changed`);
  assert(question.validation.valid && question.validation.frozenAuthority && question.validation.exactlyFourOptions && question.validation.uniqueOptions && question.validation.sourceLifecycleLocked, `${language}/${qlId}/${question.familyId}: validation flags failed`);
  if (language === "hi") {
    assert(/[\u0900-\u097F]/.test(question.stem), `${qlId}/${question.familyId}: Hindi script missing`);
    assert(!question.stem.includes("चाल"), `${qlId}/${question.familyId}: banned Hindi term चाल leaked into stem`);
    assert(!question.explanation.steps.join("\n").includes("चाल"), `${qlId}/${question.familyId}: banned Hindi term चाल leaked into explanation`);
  }
  if (language === "pa") assert(/[\u0A00-\u0A7F]/.test(question.stem), `${qlId}/${question.familyId}: Punjabi script missing`);
}

for (const language of TSD_CP007_QUESTION_STUDIO_LANGUAGES) {
  for (const qlId of TSD_CP007_PERMANENT_QL_IDS) {
    const key = `${language}:${qlId}`;
    const families = new Set<string>();
    seenFamilies.set(key, families);
    for (let pass = 0; pass < 8 && families.size < 6; pass += 1) {
      const result = previewTsdCp007QuestionStudioReview({
        language,
        qlId,
        seed: `proof:${language}:${qlId}:${pass}`,
        count: 12,
      });
      const questions = result.questions as readonly ReviewQuestion[];
      assert(questions.length === 12, `${key}: expected 12 generated review questions`);
      for (const question of questions) {
        families.add(question.familyId);
        validateQuestion(question, language, qlId);
      }
    }
    assert(families.size === 6, `${key}: did not exercise all six frozen family shapes`);
  }
}

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
  numericCasesPerFamily: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.numericCasesPerFamily,
  deterministicReviewCombinations: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.deterministicReviewCombinations,
  languages: TSD_CP007_QUESTION_STUDIO_LANGUAGES,
  validatedQuestions,
  questionStudioRegistrationStatus: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioRegistrationStatus,
  questionStudioStagingStatus: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioStagingStatus,
  questionBankWritable: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable,
  testEligible: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible,
  publiclyPublishable: TSD_CP007_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable,
}, null, 2));
