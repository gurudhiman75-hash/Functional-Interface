import assert from "node:assert/strict";

import {
  generateChemistryLocalizedCpV1,
  type ChemistryLocalizedCpV1,
} from "./sci-chemistry-localization-generator-v1";

const cps: readonly ChemistryLocalizedCpV1[] = [
  "SCI-CP-011",
  "SCI-CP-012",
  "SCI-CP-013",
  "SCI-CP-014",
  "SCI-CP-015",
  "SCI-CP-016",
  "SCI-CP-017",
  "SCI-CP-018",
] as const;

const locales = ["en", "hi", "pa"] as const;
const nativeLocales = ["hi", "pa"] as const;

const devanagari = /[\u0900-\u097F]/;
const gurmukhi = /[\u0A00-\u0A7F]/;
const forbiddenEnglishProse = /\b(which|what|why|how|select|correct|incorrect|statement|option|answer|because|contains|particles|solution|atom|molecule|electron|proton|neutron|solid|liquid|gas|reaction|compound|element|period|group|metal|non-metal|acid|base|salt|ore)\b/i;
const internalLeakage = /\b(review[- ]only|runtimeRegistered|sourceFactIds|candidate v\d+|question line|ql id)\b/i;
const optionAnalysis = /\b(option|choice)\s*[ABCD]\b/i;

type LocaleKey = (typeof locales)[number];

const chapterDifficulty: Record<LocaleKey, Record<string, number>> = {
  en: { Easy: 0, Medium: 0, Hard: 0 },
  hi: { Easy: 0, Medium: 0, Hard: 0 },
  pa: { Easy: 0, Medium: 0, Hard: 0 },
};
const chapterPositions: Record<LocaleKey, number[]> = {
  en: [0, 0, 0, 0],
  hi: [0, 0, 0, 0],
  pa: [0, 0, 0, 0],
};
const chapterQlCounts: Record<LocaleKey, Map<string, number>> = {
  en: new Map<string, number>(),
  hi: new Map<string, number>(),
  pa: new Map<string, number>(),
};
const chapterIds: Record<LocaleKey, Set<string>> = {
  en: new Set<string>(),
  hi: new Set<string>(),
  pa: new Set<string>(),
};
const chapterStems: Record<LocaleKey, Set<string>> = {
  en: new Set<string>(),
  hi: new Set<string>(),
  pa: new Set<string>(),
};

for (const cpId of cps) {
  const surfaces = {
    en: generateChemistryLocalizedCpV1(cpId, "en"),
    hi: generateChemistryLocalizedCpV1(cpId, "hi"),
    pa: generateChemistryLocalizedCpV1(cpId, "pa"),
  } as const;

  for (const locale of locales) {
    const questions = surfaces[locale];
    assert.equal(questions.length, 60, `${cpId}/${locale}: expected 60 questions`);

    const cpDifficulty: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
    const cpPositions = [0, 0, 0, 0];
    const cpQlCounts = new Map<string, number>();
    const cpIds = new Set<string>();
    const cpStems = new Set<string>();

    questions.forEach((q, index) => {
      assert.equal(q.cpId, cpId, `${q.questionId}: CP drift`);
      assert.equal(q.locale, locale, `${q.questionId}: locale drift`);
      assert.equal(q.reviewOnly, true, `${q.questionId}: review-only lifecycle lost`);
      assert.equal(q.runtimeRegistered, false, `${q.questionId}: runtime opened before freeze`);
      assert.equal(q.localizationV1.reviewOnly, true, `${q.questionId}: localization lifecycle lost`);
      assert.equal(q.localizationV1.semanticInvariant, true, `${q.questionId}: semantic invariant not asserted`);
      assert.equal(q.localizationV1.cpInvariant, true, `${q.questionId}: CP invariant not asserted`);
      assert.equal(q.localizationV1.qlInvariant, true, `${q.questionId}: QL invariant not asserted`);
      assert.equal(q.localizationV1.difficultyInvariant, true, `${q.questionId}: difficulty invariant not asserted`);
      assert.equal(q.localizationV1.sourceInvariant, true, `${q.questionId}: source invariant not asserted`);
      assert.equal(q.localizationV1.optionOrderInvariant, true, `${q.questionId}: option-order invariant not asserted`);
      assert.equal(q.localizationV1.correctIndexInvariant, true, `${q.questionId}: correct-index invariant not asserted`);

      assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3, `${q.questionId}: invalid correct index`);
      assert.equal(q.options.length, 4, `${q.questionId}: expected four options`);
      assert.equal(new Set(q.options).size, 4, `${q.questionId}: duplicate visible options`);
      assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}: answer-key mismatch`);
      assert.ok(q.sourceIds.length > 0 && q.sourceFactIds.length > 0, `${q.questionId}: provenance missing`);
      assert.ok(q.stem.trim().length >= 10, `${q.questionId}: stem too thin`);
      assert.ok(q.explanation.trim().length >= 18, `${q.questionId}: explanation too thin`);

      assert.ok(!internalLeakage.test(q.stem), `${q.questionId}: internal metadata leaked into stem`);
      assert.ok(!internalLeakage.test(q.explanation), `${q.questionId}: internal metadata leaked into explanation`);
      assert.ok(!optionAnalysis.test(q.explanation), `${q.questionId}: option-by-option analysis leakage`);
      assert.ok(!/statement\s+i\s*\/\s*ii/i.test(q.qlName), `${q.questionId}: forced Statement I/II QL remains`);

      if (locale === "en") {
        assert.equal(q.localizationV1.englishQuestionId, q.questionId, `${q.questionId}: English self-linkage drift`);
      } else {
        const english = surfaces.en[index];
        assert.equal(q.localizationV1.englishQuestionId, english.questionId, `${q.questionId}: English linkage drift`);
        assert.equal(q.qlId, english.qlId, `${q.questionId}: QL drift`);
        assert.equal(q.difficulty, english.difficulty, `${q.questionId}: difficulty drift`);
        assert.equal(q.correctIndex, english.correctIndex, `${q.questionId}: correct-index drift`);
        assert.deepEqual(q.sourceIds, english.sourceIds, `${q.questionId}: source IDs drift`);
        assert.deepEqual(q.sourceFactIds, english.sourceFactIds, `${q.questionId}: source fact IDs drift`);
        assert.notEqual(q.stem, english.stem, `${q.questionId}: English stem was not localized`);
        assert.notEqual(q.explanation, english.explanation, `${q.questionId}: English explanation was not localized`);

        const script = locale === "hi" ? devanagari : gurmukhi;
        assert.ok(script.test(q.stem), `${q.questionId}: native script missing from stem`);
        assert.ok(script.test(q.explanation), `${q.questionId}: native script missing from explanation`);
        assert.ok(script.test(q.qlName), `${q.questionId}: QL name not localized`);

        const learnerText = [q.stem, ...q.options, q.explanation].join(" ");
        assert.ok(!forbiddenEnglishProse.test(learnerText), `${q.questionId}: accidental English prose leakage`);
      }

      assert.ok(!cpIds.has(q.questionId), `${cpId}/${locale}: duplicate question ID ${q.questionId}`);
      cpIds.add(q.questionId);
      assert.ok(!chapterIds[locale].has(q.questionId), `${locale}: cross-CP duplicate question ID ${q.questionId}`);
      chapterIds[locale].add(q.questionId);

      const normalizedStem = q.stem.trim().replace(/\s+/g, " ").toLowerCase();
      assert.ok(!cpStems.has(normalizedStem), `${cpId}/${locale}: duplicate stem ${q.stem}`);
      cpStems.add(normalizedStem);
      assert.ok(!chapterStems[locale].has(normalizedStem), `${locale}: cross-CP duplicate stem ${q.stem}`);
      chapterStems[locale].add(normalizedStem);

      cpQlCounts.set(q.qlId, (cpQlCounts.get(q.qlId) ?? 0) + 1);
      chapterQlCounts[locale].set(q.qlId, (chapterQlCounts[locale].get(q.qlId) ?? 0) + 1);
      cpDifficulty[q.difficulty] = (cpDifficulty[q.difficulty] ?? 0) + 1;
      chapterDifficulty[locale][q.difficulty] = (chapterDifficulty[locale][q.difficulty] ?? 0) + 1;
      cpPositions[q.correctIndex] += 1;
      chapterPositions[locale][q.correctIndex] += 1;
    });

    assert.equal(cpQlCounts.size, 10, `${cpId}/${locale}: expected 10 QLs`);
    assert.ok([...cpQlCounts.values()].every((n) => n === 6), `${cpId}/${locale}: every QL must contain six questions`);
    assert.deepEqual(cpDifficulty, { Easy: 18, Medium: 30, Hard: 12 }, `${cpId}/${locale}: difficulty profile drift`);
    assert.deepEqual(cpPositions, [15, 15, 15, 15], `${cpId}/${locale}: answer-position profile drift`);
  }

  for (const locale of nativeLocales) {
    const native = surfaces[locale];
    const english = surfaces.en;
    assert.equal(native.length, english.length, `${cpId}/${locale}: English/native count drift`);
    for (let i = 0; i < english.length; i += 1) {
      assert.equal(native[i].localizationV1.englishQuestionId, english[i].questionId, `${cpId}/${locale}: linkage ordering drift at index ${i}`);
    }
  }
}

for (const locale of locales) {
  assert.equal(chapterIds[locale].size, 480, `${locale}: expected 480 unique question IDs`);
  assert.equal(chapterStems[locale].size, 480, `${locale}: expected 480 unique stems`);
  assert.equal(chapterQlCounts[locale].size, 80, `${locale}: expected 80 QLs`);
  assert.ok([...chapterQlCounts[locale].values()].every((n) => n === 6), `${locale}: every Chemistry QL must contribute six questions`);
  assert.deepEqual(chapterDifficulty[locale], { Easy: 144, Medium: 240, Hard: 96 }, `${locale}: chapter-wide difficulty totals drifted`);
  assert.deepEqual(chapterPositions[locale], [120, 120, 120, 120], `${locale}: chapter-wide answer positions drifted`);
}

const allNative = nativeLocales.flatMap((locale) =>
  cps.flatMap((cpId) => [...generateChemistryLocalizedCpV1(cpId, locale)])
);
assert.equal(allNative.length, 960, "Chemistry must expose exactly 960 native localized questions");
assert.equal(new Set(allNative.map((q) => q.questionId)).size, 960, "Native localized question IDs must be unique across Hindi and Punjabi");
assert.ok(allNative.every((q) => !q.cpId.startsWith("SCI-CP-019")), "Biology leaked into Chemistry multilingual closure surface");
assert.ok(allNative.every((q) => q.reviewOnly && !q.runtimeRegistered), "Chemistry multilingual closure must remain review-only / runtime closed");

console.log(JSON.stringify({
  status: "PASS",
  scope: "SCI-CP-011 through SCI-CP-018 multilingual V1",
  cps: cps.length,
  locales: [...locales],
  questionsPerLocale: 480,
  qlsPerLocale: 80,
  nativeQuestions: allNative.length,
  difficultyPerLocale: { Easy: 144, Medium: 240, Hard: 96 },
  answerPositionsPerLocale: { A: 120, B: 120, C: 120, D: 120 },
  lifecycle: "review-only / runtime closed",
  biologyGate: "SCI-CP-019 remains blocked until this closure audit is approved and merged",
  nextGate: "human approval of final Chemistry multilingual closure",
}, null, 2));
