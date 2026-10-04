import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q } from "./cp005/english-approved-freeze-v13";
import { TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q } from "./cp005/localization/native-approved-freeze-v5";
import {
  generateTsd001QuestionStudioBatch,
  TSD_001_QUESTION_STUDIO_LANGUAGES,
  TSD_001_QUESTION_STUDIO_PACKAGE,
} from "./question-studio-adapter";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function signature(stem: string, options: readonly string[], correctIndex: number, answer: string): string {
  return JSON.stringify([stem, options, correctIndex, answer]);
}

const qls = [...new Set(TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q.map((row) => row.permanentQlId))].sort();
assert(qls.length === 13 && qls[0] === "TSD-QL-058" && qls[12] === "TSD-QL-070", "Studio proof lost CP005 QL range");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.enabled, "TSD-001 Studio package is not enabled");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.questionStudioReviewOnly === true, "TSD-001 must remain review-only in Studio");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.questionBankStatus === "NOT_STORED", "TSD-001 Studio package unlocked Bank storage");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.testEligibility === "INELIGIBLE", "TSD-001 Studio package unlocked tests");
assert(TSD_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable === false, "TSD-001 Studio package unlocked publication");

let checkedQuestions = 0;
for (const language of TSD_001_QUESTION_STUDIO_LANGUAGES) {
  for (const qlId of qls) {
    const authority = language === "en"
      ? TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q
          .filter((row) => row.permanentQlId === qlId)
          .map((row) => signature(row.stem, row.options, row.correctIndex, row.answerText))
      : TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q
          .filter((row) => row.source.permanentQlId === qlId && row.presentation.language === language)
          .map((row) => signature(row.presentation.stem, row.presentation.options, row.presentation.correctIndex, row.presentation.answerText));
    assert(authority.length === 6, `${qlId}/${language}: expected six frozen authority variants`);
    const allowed = new Set(authority);
    const batch = generateTsd001QuestionStudioBatch({
      packageId: "TSD-001",
      canonicalProblemId: "TSD-CP-005",
      questionLanguageId: qlId,
      language,
      seed: `studio-proof:${language}:${qlId}`,
      count: 12,
    });
    assert(batch.questions.length === 12, `${qlId}/${language}: Studio batch size mismatch`);
    for (const question of batch.questions) {
      assert(question.packageId === "TSD-001", `${qlId}/${language}: package id drift`);
      assert(question.canonicalProblemId === "TSD-CP-005", `${qlId}/${language}: checkpoint drift`);
      assert(question.questionLanguageId === qlId, `${qlId}/${language}: QL drift`);
      assert(question.language === language, `${qlId}/${language}: language drift`);
      assert(question.runtimeMode === "QUESTION_STUDIO_REVIEW_ACTIVE", `${qlId}/${language}: runtime mode drift`);
      assert(question.reviewStatus === "FROZEN_MULTILINGUAL_REVIEW_SURFACE", `${qlId}/${language}: review status drift`);
      assert(question.questionBankStatus === "NOT_STORED", `${qlId}/${language}: Bank unlocked`);
      assert(question.testEligibility === "INELIGIBLE", `${qlId}/${language}: tests unlocked`);
      assert(question.publiclyPublishable === false, `${qlId}/${language}: publication unlocked`);
      assert(question.traceability.sourceQuestionStudioEnabled === false, `${qlId}/${language}: frozen source lifecycle was rewritten`);
      assert(question.traceability.adapterQuestionStudioAccess === true, `${qlId}/${language}: adapter access missing`);
      assert(allowed.has(signature(question.stem, question.options, question.correctIndex, question.answer)), `${qlId}/${language}: Studio emitted content outside the frozen authority`);
      checkedQuestions += 1;
    }
  }
}

const deterministicA = generateTsd001QuestionStudioBatch({ packageId: "TSD-001", language: "hi", seed: "deterministic-proof", count: 25 });
const deterministicB = generateTsd001QuestionStudioBatch({ packageId: "TSD-001", language: "hi", seed: "deterministic-proof", count: 25 });
assert(JSON.stringify(deterministicA.questions) === JSON.stringify(deterministicB.questions), "TSD-001 Studio seeded output is not deterministic");

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_FROZEN_MULTILINGUAL_QUESTION_STUDIO_REVIEW_ADAPTER",
  packageId: "TSD-001",
  checkpointIds: ["TSD-CP-005"],
  permanentQlRange: "TSD-QL-058..TSD-QL-070",
  languages: TSD_001_QUESTION_STUDIO_LANGUAGES,
  uniqueFrozenQuestionsPerLanguage: 78,
  sampledAuthorityChecks: checkedQuestions,
  seededDeterminism: true,
  questionStudioReviewOnly: true,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
