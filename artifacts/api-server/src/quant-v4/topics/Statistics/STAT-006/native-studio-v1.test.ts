import assert from "node:assert/strict";
import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "../../../../question-studio/engine-registry";
for (let index = 52; index <= 69; index++)
  for (const language of ["hi", "pa"])
    for (const exam of ["SSC_CGL_TIER_II", "SSC_CGL_JSO"]) {
      const questionLanguageId = `STAT-QL-${String(index).padStart(3, "0")}`;
      const result = await generateQuestionStudioQuestions({
        questionLanguageId,
        language,
        exam,
        count: 1,
        seed: `STAT006-NATIVE-STUDIO:${index}`,
      });
      assert.equal(result.engineId, "quant-v4");
      assert.equal(result.questions.length, 1);
      const q = result.questions[0]!;
      assert.equal(q.packageId, "STAT-006");
      assert.equal(q.questionLanguageId, questionLanguageId);
      assert.equal(q.examProfile, exam);
      assert.equal(q.language, language);
      assert.equal(q.reviewStatus, "NATIVE_REVIEW_CANDIDATE");
      assert.equal(q.productionReleaseAuthorized, false);
      assert.equal(q.options[q.correctIndex], q.answer);
      assert.equal(q.canonicalAnswer.value, q.answer);
    }
const cards = listQuestionStudioPackages();
const card = cards.find((q) => q.packageId === "STAT-006")!;
assert.deepEqual(card.supportedLanguages, ["en", "hi", "pa"]);
assert(card.supportedRuntimeModes.includes("STAT006_NATIVE_REVIEW_V1"));
assert.equal(
  (card.metadata?.languageReviewStatus as Record<string, string>).hi,
  "NATIVE_REVIEW_CANDIDATE",
);
assert.equal(
  (card.metadata?.languageReviewStatus as Record<string, string>).pa,
  "NATIVE_REVIEW_CANDIDATE",
);
const en = await generateQuestionStudioQuestions({
  packageId: "STAT-006",
  language: "en",
  count: 18,
  seed: "STAT006-STUDIO-EN",
  exam: "SSC_CGL_JSO",
});
assert.equal(en.questions.length, 18);
assert.equal(new Set(en.questions.map((q) => q.permanentQlId)).size, 18);
assert(
  en.questions.every(
    (q) =>
      q.language === "en" &&
      q.examProfile === "SSC_CGL_JSO" &&
      q.reviewStatus === "ENGLISH_REVIEW_CANDIDATE",
  ),
);
console.log(
  JSON.stringify({
    status: "PASS_STAT006_NATIVE_STUDIO_V1",
    routedQlLanguageProfiles: 72,
    englishQuestions: 18,
  }),
);
