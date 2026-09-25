import assert from "node:assert/strict";

import {
  generateScienceFinalLocalizedCorpusV1,
  SCI_001_FINAL_LOCALIZED_CP_IDS_V1,
  SCI_001_FINAL_LOCALIZED_LOCALES_V1,
} from "./science-final-multilingual-corpus-v1";

const expectedPerLocale = 5280;
const expectedTotalSurfaces = expectedPerLocale * SCI_001_FINAL_LOCALIZED_LOCALES_V1.length;

const surfaces = Object.fromEntries(
  SCI_001_FINAL_LOCALIZED_LOCALES_V1.map((locale) => [
    locale,
    generateScienceFinalLocalizedCorpusV1(locale),
  ]),
) as Record<(typeof SCI_001_FINAL_LOCALIZED_LOCALES_V1)[number], ReturnType<typeof generateScienceFinalLocalizedCorpusV1>>;

for (const locale of SCI_001_FINAL_LOCALIZED_LOCALES_V1) {
  const corpus = surfaces[locale];
  assert.equal(corpus.length, expectedPerLocale, `${locale}: SCI-001 corpus size drift`);
  assert.equal(new Set(corpus.map((q) => q.questionId)).size, corpus.length, `${locale}: duplicate question IDs`);
  assert.equal(new Set(corpus.map((q) => q.cpId)).size, 40, `${locale}: CP coverage drift`);

  for (const cpId of SCI_001_FINAL_LOCALIZED_CP_IDS_V1) {
    const cpNumber = Number(cpId.slice(-3));
    const expected = cpNumber <= 10 ? 348 : 60;
    const rows = corpus.filter((q) => q.cpId === cpId);
    assert.equal(rows.length, expected, `${locale}/${cpId}: expected ${expected} questions`);
  }

  for (const q of corpus) {
    assert.equal(q.chapterId, "SCI-001", `${q.questionId}: chapter drift`);
    assert.equal(q.locale, locale, `${q.questionId}: locale drift`);
    assert.equal(q.reviewOnly, true, `${q.questionId}: review-only lock lost`);
    assert.equal(q.runtimeRegistered, false, `${q.questionId}: source runtime opened`);
    assert.equal(q.options.length, 4, `${q.questionId}: four options required`);
    assert.equal(new Set(q.options).size, 4, `${q.questionId}: duplicate visible option`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4, `${q.questionId}: invalid correct index`);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}: answer mismatch`);
    assert.ok(q.stem.trim().length >= 8, `${q.questionId}: stem too thin`);
    assert.ok(q.explanation.trim().length >= 12, `${q.questionId}: explanation too thin`);
    assert.ok(q.sourceIds.length > 0, `${q.questionId}: source IDs missing`);
    assert.ok(q.sourceFactIds.length > 0, `${q.questionId}: source fact IDs missing`);
    assert.ok(q.qlId.trim().length > 0, `${q.questionId}: QL identity missing`);
  }
}

const english = surfaces.en;
for (const locale of ["hi", "pa"] as const) {
  const localized = surfaces[locale];
  assert.equal(localized.length, english.length, `${locale}: English parity length drift`);

  for (let index = 0; index < english.length; index += 1) {
    const en = english[index]!;
    const native = localized[index]!;
    assert.equal(native.englishQuestionId, en.questionId, `${native.questionId}: English identity drift`);
    assert.equal(native.cpId, en.cpId, `${native.questionId}: CP drift`);
    assert.equal(native.qlId, en.qlId, `${native.questionId}: QL drift`);
    assert.equal(native.difficulty, en.difficulty, `${native.questionId}: difficulty drift`);
    assert.equal(native.correctIndex, en.correctIndex, `${native.questionId}: correct-index drift`);
    assert.deepEqual(native.sourceIds, en.sourceIds, `${native.questionId}: source drift`);
    assert.deepEqual(native.sourceFactIds, en.sourceFactIds, `${native.questionId}: source-fact drift`);
  }
}

const cpCounts = Object.fromEntries(
  SCI_001_FINAL_LOCALIZED_CP_IDS_V1.map((cpId) => [
    cpId,
    english.filter((q) => q.cpId === cpId).length,
  ]),
);

const difficultyCounts = Object.fromEntries(
  ["Easy", "Medium", "Hard"].map((difficulty) => [
    difficulty,
    english.filter((q) => q.difficulty === difficulty).length,
  ]),
);

console.log(JSON.stringify({
  status: "PASS",
  chapterId: "SCI-001",
  cpCount: 40,
  locales: [...SCI_001_FINAL_LOCALIZED_LOCALES_V1],
  questionsPerLocale: expectedPerLocale,
  multilingualSurfaceCount: expectedTotalSurfaces,
  cpCounts,
  difficultyCounts,
  lifecycle: "source review-only / runtime closed",
}, null, 2));
