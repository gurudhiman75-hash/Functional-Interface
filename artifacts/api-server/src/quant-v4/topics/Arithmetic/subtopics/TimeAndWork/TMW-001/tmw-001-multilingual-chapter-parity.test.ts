import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const registry = [
  ...TMW_CP001_REGISTRY,
  ...TMW_CP002_REGISTRY,
  ...TMW_CP003_REGISTRY,
  ...TMW_CP004_REGISTRY,
  ...TMW_CP005_REGISTRY,
  ...TMW_CP006_REGISTRY,
  ...TMW_CP007_REGISTRY,
  ...TMW_CP008_REGISTRY,
  ...TMW_CP009_REGISTRY,
  ...TMW_CP010_REGISTRY,
  ...TMW_CP_011_REGISTRY,
];

function ordinal(qlId: string): number {
  const match = /^TMW-QL-(\d{3})$/.exec(qlId);
  if (!match) throw new Error(`Malformed TMW QL ID: ${qlId}`);
  return Number(match[1]);
}

function checkpointNumber(qlId: string): number {
  const value = ordinal(qlId);
  if (value <= 20) return 1;
  if (value <= 34) return 2;
  if (value <= 57) return 3;
  if (value <= 81) return 4;
  if (value <= 105) return 5;
  if (value <= 127) return 6;
  if (value <= 143) return 7;
  if (value <= 156) return 8;
  if (value <= 174) return 9;
  if (value <= 192) return 10;
  return 11;
}

function auditSeed(qlId: string, index: number): string {
  const cp = checkpointNumber(qlId);
  return cp === 11
    ? `runtime-${qlId}-${index}`
    : `tmw-cp${String(cp).padStart(3, "0")}-localization:${qlId}:${index}`;
}

function canonicalSolution(question: any): unknown {
  const solution = question.solution ?? {};
  return {
    answer: solution.answer,
    answerValues: solution.answerValues,
    answerKey: solution.answerKey,
    answerType: solution.answerType,
    formulaLatex: solution.formulaLatex,
    workedLatex: solution.workedLatex,
  };
}

function canonicalOptions(question: any): unknown {
  return (question.optionAudit ?? []).map((option: any) => ({
    value: option.value,
    answerKey: option.answerKey,
    optionKey: option.optionKey,
    misconceptionId: option.misconceptionId,
  }));
}

function learnerText(question: any): string {
  return [
    question.stem,
    ...(question.options ?? []),
    question.solution?.answerText,
    question.explanation?.opening,
    question.explanation?.formula,
    ...(question.explanation?.givens ?? []),
    ...(question.explanation?.steps ?? []),
    question.explanation?.shortcut?.title,
    ...(question.explanation?.shortcut?.steps ?? []),
    question.explanation?.commonTrap?.optionLabel,
    question.explanation?.commonTrap?.optionText,
    question.explanation?.commonTrap?.explanation,
    question.explanation?.conclusion,
  ].filter((value) => typeof value === "string").join("\n");
}

const expectedIds = Array.from({ length: 211 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
assert.equal(registry.length, 211);
assert.deepEqual(registry.map((entry) => entry.qlId), expectedIds);

const qlsByLanguage: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const stemsByLanguage: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const checkpointCounts: Record<string, number> = {};
let englishPackages = 0;
let localizedPackages = 0;
let parityChecks = 0;
let invalidLocalizedPackages = 0;
let publishableLocalizedPackages = 0;

for (const entry of registry) {
  for (let index = 0; index < 12; index += 1) {
    const seed = auditSeed(entry.qlId, index);
    const english = runTmw001ChapterPipeline({
      questionLanguageId: entry.qlId,
      seed,
      language: "en",
    });
    assert.equal(english.validation?.valid, true, `${entry.qlId}:en:${english.validation?.errors?.join(" | ")}`);
    englishPackages += 1;

    for (const language of languages) {
      const localized = runTmw001ChapterPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const replay = runTmw001ChapterPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      assert.deepEqual(localized, replay, `${entry.qlId}:${language}: deterministic replay failed`);
      if (!localized.validation?.valid) invalidLocalizedPackages += 1;
      if (localized.publiclyPublishable) publishableLocalizedPackages += 1;
      assert.equal(localized.validation?.valid, true, `${entry.qlId}:${language}:${localized.validation?.errors?.join(" | ")}`);
      assert.equal(localized.questionLanguageId, english.questionLanguageId);
      assert.equal(localized.solveMode, english.solveMode);
      assert.equal(localized.seed, english.seed);
      assert.deepEqual(localized.parameters, english.parameters, `${entry.qlId}:${language}: parameter parity`);
      assert.deepEqual(canonicalSolution(localized), canonicalSolution(english), `${entry.qlId}:${language}: solution parity`);
      assert.deepEqual(canonicalOptions(localized), canonicalOptions(english), `${entry.qlId}:${language}: option authority parity`);
      assert.equal(localized.correctIndex, english.correctIndex, `${entry.qlId}:${language}: correct-index parity`);
      assert.equal(localized.mathematicalFingerprint, english.mathematicalFingerprint, `${entry.qlId}:${language}: fingerprint parity`);
      assert.equal(localized.language, language);
      assert.equal(localized.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(localized.sourceLanguage, "en");
      assert.equal(localized.editorialStatus, "PENDING");
      assert.equal(localized.publiclyPublishable, false);
      assert.equal(localized.options.length, 4);
      assert.equal(new Set(localized.options).size, 4);
      assert.equal(localized.options[localized.correctIndex], localized.solution.answerText);
      assert.equal(localized.optionAudit[localized.correctIndex]?.misconceptionId, "CORRECT");

      const text = learnerText(localized);
      const outsideMath = text.replace(/\\\([\s\S]*?\\\)/g, "");
      assert.equal(/TMW_|find[A-Z]|misconceptionId|publiclyPublishable/.test(outsideMath), false, `${entry.qlId}:${language}: internal learner wording`);
      assert.equal((text.match(/\\\(/g) ?? []).length, (text.match(/\\\)/g) ?? []).length, `${entry.qlId}:${language}: unbalanced MathJax`);
      if (language === "hi") {
        assert.match(outsideMath, /[\u0900-\u097F]/, `${entry.qlId}: Hindi script missing`);
        assert.equal(/[\u0A00-\u0A7F]/.test(outsideMath), false, `${entry.qlId}: Gurmukhi leaked into Hindi`);
      } else {
        assert.match(outsideMath, /[\u0A00-\u0A7F]/, `${entry.qlId}: Punjabi script missing`);
        assert.equal(/[\u0900-\u0963\u0966-\u097F]/.test(outsideMath), false, `${entry.qlId}: Devanagari leaked into Punjabi`);
      }

      qlsByLanguage[language].add(entry.qlId);
      stemsByLanguage[language].add(localized.stem);
      checkpointCounts[`CP-${String(checkpointNumber(entry.qlId)).padStart(3, "0")}:${language}`] =
        (checkpointCounts[`CP-${String(checkpointNumber(entry.qlId)).padStart(3, "0")}:${language}`] ?? 0) + 1;
      localizedPackages += 1;
      parityChecks += 1;
    }
  }
}

assert.equal(englishPackages, 2_532);
assert.equal(localizedPackages, 5_064);
assert.equal(parityChecks, 5_064);
assert.equal(invalidLocalizedPackages, 0);
assert.equal(publishableLocalizedPackages, 0);
assert.equal(qlsByLanguage.hi.size, 211);
assert.equal(qlsByLanguage.pa.size, 211);
assert.ok(stemsByLanguage.hi.size > 1_000);
assert.ok(stemsByLanguage.pa.size > 1_000);

console.log(JSON.stringify({
  chapter: "TMW-001",
  qlRange: "TMW-QL-001..TMW-QL-211",
  checkpoints: 11,
  qls: registry.length,
  seedsPerQl: 12,
  englishPackages,
  localizedPackages,
  parityChecks,
  invalidLocalizedPackages,
  publishableLocalizedPackages,
  hindiQls: qlsByLanguage.hi.size,
  punjabiQls: qlsByLanguage.pa.size,
  hindiDistinctStems: stemsByLanguage.hi.size,
  punjabiDistinctStems: stemsByLanguage.pa.size,
  checkpointCounts,
  status: "PASS",
}, null, 2));
