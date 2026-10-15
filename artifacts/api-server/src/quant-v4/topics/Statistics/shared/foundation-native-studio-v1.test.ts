import assert from "node:assert/strict";
import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "../../../../question-studio/engine-registry";
for (let n = 1; n <= 20; n++)
  for (const language of ["hi", "pa"]) {
    const questionLanguageId = `STAT-QL-${String(n).padStart(3, "0")}`;
    const packageId = n <= 6 ? "STAT-001" : n <= 12 ? "STAT-002" : "STAT-003";
    const result = await generateQuestionStudioQuestions({
      questionLanguageId,
      language,
      seed: `NATIVE-STUDIO:${n}`,
      count: 1,
    });
    assert.equal(result.engineId, "quant-v4");
    assert.equal(result.questions.length, 1);
    const q = result.questions[0]!;
    assert.equal(q.packageId, packageId);
    assert.equal(q.questionLanguageId, questionLanguageId);
    assert.equal(q.language, language);
    assert.equal(q.reviewStatus, "NATIVE_REVIEW_CANDIDATE");
    assert.equal(q.productionReleaseAuthorized, false);
  }
const cards = listQuestionStudioPackages();
for (let n = 1; n <= 14; n++) {
  const card = cards.find(
    (c) => c.packageId === `STAT-${String(n).padStart(3, "0")}`,
  )!;
  assert(card);
  assert.deepEqual(
    card.supportedLanguages,
    n <= 3 ? ["en", "hi", "pa"] : ["en"],
  );
}
console.log(
  JSON.stringify({
    status: "PASS_STATISTICS_FOUNDATION_NATIVE_STUDIO_V1",
    routedQlLanguages: 40,
    untouchedEnglishOnlyPackages: 11,
  }),
);
