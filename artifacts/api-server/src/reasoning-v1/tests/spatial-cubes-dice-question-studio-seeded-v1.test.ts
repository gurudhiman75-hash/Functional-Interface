import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1,
  generateCubesDiceQuestionStudioBatchV1,
  generateCubesDiceQuestionStudioSeededV1,
  type CubesDiceStudioLanguageV1,
} from "../foundation/spatial/cubes-dice-question-studio-seeded-runtime-v1";
import type { CubesDicePermanentQlIdV1 } from "../foundation/spatial/cubes-dice-cp004-distractors-allocation-v1";

const QLS: readonly CubesDicePermanentQlIdV1[] = ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"];
const LANGUAGES: readonly CubesDiceStudioLanguageV1[] = ["en", "hi", "pa"];

assert.deepEqual(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.permanentQlIds, QLS);
assert.deepEqual(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.supportedLanguages, LANGUAGES);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.persistenceAllowed, false);
assert.equal(CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.automaticPublication, false);

const variantCoverage = new Map<string, Set<string>>();
const answerPositionCoverage = new Map<string, Set<number>>();
const reviewRows: Record<string, unknown>[] = [];
let canonicalQuestions = 0;
let languageSurfaces = 0;

for (const qlId of QLS) {
  for (let index = 0; index < 160; index += 1) {
    const seed = `CND-QS-SEEDED-V1:${qlId}:${index}`;
    const english = generateCubesDiceQuestionStudioSeededV1({ seed, qlId, language: "en" });
    const replay = generateCubesDiceQuestionStudioSeededV1({ seed, qlId, language: "en" });
    assert.deepEqual(replay, english, `${seed}: seeded replay must be deterministic.`);
    assert.equal(english.qlId, qlId);
    assert.equal(english.packageId, "SPA-001");
    assert.equal(english.chapterCode, "CND-001");
    assert.equal(english.renderer.kind, "SVG_WITH_SCALAR_OPTIONS");
    assert.equal(english.stimulusSvgs.length, 1);
    assert.match(english.stimulusSvgs[0], /^<svg\b/i);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map(String)).size, 4);
    assert.equal(english.options[english.correctIndex], english.canonicalAnswer);
    assert.equal(english.answer, english.optionLabels[english.correctIndex]);
    assert.equal(english.validation.exactSolverBacked, true);
    assert.equal(english.lifecycle.reviewOnly, true);
    assert.equal(english.lifecycle.questionStudioDiscoverable, false);
    assert.equal(english.lifecycle.persistenceAllowed, false);
    assert.equal(english.lifecycle.questionBankWritable, false);
    assert.equal(english.lifecycle.testEligible, false);
    assert.equal(english.lifecycle.publiclyPublishable, false);
    assert.equal(english.lifecycle.automaticStudentPublication, false);

    const variants = variantCoverage.get(qlId) ?? new Set<string>();
    variants.add(english.stemVariantId);
    variantCoverage.set(qlId, variants);
    const positions = answerPositionCoverage.get(qlId) ?? new Set<number>();
    positions.add(english.correctIndex);
    answerPositionCoverage.set(qlId, positions);
    canonicalQuestions += 1;

    for (const language of LANGUAGES) {
      const question = language === "en"
        ? english
        : generateCubesDiceQuestionStudioSeededV1({ seed, qlId, language });
      assert.equal(question.contentFingerprint, english.contentFingerprint);
      assert.equal(question.canonicalItemId, english.canonicalItemId);
      assert.deepEqual(question.stimulusSvgs, english.stimulusSvgs);
      assert.deepEqual(question.options, english.options);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.canonicalAnswer, english.canonicalAnswer);
      assert.equal(question.taskKind, english.taskKind);
      assert.equal(question.candidateId, english.candidateId);
      assert.equal(question.stemVariantId, english.stemVariantId);
      assert.equal(question.questionLanguageId, `${english.canonicalItemId}:${language}`);
      if (language === "hi") assert.match(question.stem, /\p{Script=Devanagari}/u);
      if (language === "pa") assert.match(question.stem, /\p{Script=Gurmukhi}/u);
      languageSurfaces += 1;

      if (index < 3) {
        reviewRows.push({
          qlId,
          language,
          seed,
          taskKind: question.taskKind,
          difficultyBand: question.difficultyBand,
          stemVariantId: question.stemVariantId,
          correctIndex: question.correctIndex,
          stem: question.stem,
          options: question.options,
          canonicalAnswer: question.canonicalAnswer,
          explanation: question.explanation,
          renderer: question.renderer,
        });
      }
    }
  }
}

for (const qlId of QLS) {
  assert.equal(variantCoverage.get(qlId)?.size, 6, `${qlId}: all six stem variants must be reachable.`);
  assert.equal(answerPositionCoverage.get(qlId)?.size, 4, `${qlId}: all four answer positions must be reachable.`);
}

for (const qlId of QLS) {
  for (const language of LANGUAGES) {
    const batch = generateCubesDiceQuestionStudioBatchV1({
      seed: `CND-QS-BATCH:${qlId}:${language}`,
      qlId,
      language,
      count: 24,
    });
    assert.equal(batch.length, 24);
    assert.equal(new Set(batch.map((question) => question.contentFingerprint)).size, 24);
    assert.ok(batch.every((question) => question.qlId === qlId && question.language === language));
  }
}

assert.equal(reviewRows.length, 27);
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  result: "PASS",
  authority: CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V1.authorityId,
  canonicalQuestionsReviewed: canonicalQuestions,
  languageSurfacesReviewed: languageSurfaces,
  permanentQlCount: QLS.length,
  languages: LANGUAGES,
  operatorReviewRows: reviewRows.length,
  variantCoverage: Object.fromEntries([...variantCoverage.entries()].map(([key, value]) => [key, [...value].sort()])),
  answerPositionCoverage: Object.fromEntries([...answerPositionCoverage.entries()].map(([key, value]) => [key, [...value].sort()])),
  reviewRows,
  governance: {
    reviewOnly: true,
    standardQuestionStudioRegistrationAuthorized: false,
    persistenceAllowed: false,
    automaticStudentPublication: false,
  },
};
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-question-studio-seeded-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({
  result: evidence.result,
  canonicalQuestionsReviewed: evidence.canonicalQuestionsReviewed,
  languageSurfacesReviewed: evidence.languageSurfacesReviewed,
  operatorReviewRows: evidence.operatorReviewRows,
  variantCoverage: evidence.variantCoverage,
  answerPositionCoverage: evidence.answerPositionCoverage,
}, null, 2));
