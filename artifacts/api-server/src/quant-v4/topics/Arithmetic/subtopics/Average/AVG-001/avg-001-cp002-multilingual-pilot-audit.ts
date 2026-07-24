import { strict as assert } from "node:assert";

import { getAvg001QuestionEntries } from "./foundation/library";
import {
  AVG_001_CP002_MULTILINGUAL_PILOT,
  getAvg001Cp002LocalizedQlIds,
  runAvg001Cp002LocalizationPilot,
} from "./foundation/cp002-localization-pilot";
import { runAvg001Pipeline } from "./foundation/pipeline";

const cpEntries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-002");
const localizedQlIds = getAvg001Cp002LocalizedQlIds();
const failures: string[] = [];
const stemsByLanguage = new Map<string, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);
let generated = 0;

function fail(message: string) {
  failures.push(message);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function proseOnly(lines: string[]) {
  return lines.join("\n").replace(/\$\$[\s\S]*?\$\$/g, "");
}

if (cpEntries.length !== 62) fail(`expected 62 CP-002 QLs; got ${cpEntries.length}`);
if (localizedQlIds.length !== 62) fail(`expected 62 localized QL IDs; got ${localizedQlIds.length}`);
if (new Set(localizedQlIds).size !== 62) fail("localized QL IDs are not unique");
if (JSON.stringify(localizedQlIds) !== JSON.stringify(cpEntries.map((entry) => entry.qlId))) {
  fail("localized QL IDs do not match the active CP-002 QL order");
}

const expectedModeCounts = {
  findAverageOfConsecutiveSet: 14,
  findMiddleTermFromAverage: 12,
  findExtremeFromAverageAndCount: 12,
  findAverageOfOddOrEvenSet: 12,
  findTermCountFromAverageAndExtreme: 6,
  findCommonDifferenceFromAverageCountAndExtreme: 6,
};
for (const [mode, expected] of Object.entries(expectedModeCounts)) {
  const actual = cpEntries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) fail(`${mode}: expected ${expected} QLs; got ${actual}`);
}

for (const entry of cpEntries) {
  for (const language of AVG_001_CP002_MULTILINGUAL_PILOT.languages) {
    for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
      const seed = `avg-cp002-localization:${entry.qlId}:${seedIndex}`;
      const english = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
      const localized = runAvg001Cp002LocalizationPilot({ questionLanguageId: entry.qlId, seed, language });
      const repeated = runAvg001Cp002LocalizationPilot({ questionLanguageId: entry.qlId, seed, language });
      generated += 1;

      if (localized.language !== language) fail(`${entry.qlId}:${language}:${seedIndex}: wrong language`);
      if (localized.canonicalProblemId !== "AVG-CP-002") fail(`${entry.qlId}:${language}:${seedIndex}: wrong CP`);
      if (localized.maturity !== "MANUAL_REVIEW") fail(`${entry.qlId}:${language}:${seedIndex}: wrong maturity`);
      if (localized.publiclyPublishable) fail(`${entry.qlId}:${language}:${seedIndex}: pilot is publishable`);
      if (!localized.validation.valid || localized.validation.checks.some((check) => !check.passed)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: localization validation failed`);
      }
      if (localized.traceability.localizationReleaseId !== AVG_001_CP002_MULTILINGUAL_PILOT.releaseId) {
        fail(`${entry.qlId}:${language}:${seedIndex}: missing localization release ID`);
      }
      if (localized.traceability.sourceEnglishReleaseId !== english.traceability.releaseId) {
        fail(`${entry.qlId}:${language}:${seedIndex}: wrong English source release`);
      }
      if (localized.answer !== english.answer) fail(`${entry.qlId}:${language}:${seedIndex}: answer changed`);
      if (localized.correctIndex !== english.correctIndex) fail(`${entry.qlId}:${language}:${seedIndex}: correct index changed`);
      if (JSON.stringify(localized.options) !== JSON.stringify(english.options)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: options changed`);
      }
      if (localized.mathematicalFingerprint !== english.mathematicalFingerprint) {
        fail(`${entry.qlId}:${language}:${seedIndex}: mathematical fingerprint changed`);
      }
      if (JSON.stringify(localized.parameters.values) !== JSON.stringify(english.parameters.values)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: mathematical parameters changed`);
      }
      if (localized.stem === english.stem) fail(`${entry.qlId}:${language}:${seedIndex}: English stem fallback`);
      if (/[{}]|undefined|NaN|Infinity|null/.test(localized.stem)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: unresolved/internal stem token`);
      }
      if (/[A-Za-z]/.test(localized.stem)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: Latin text remains in stem`);
      }

      const prose = proseOnly(localized.explanation.lines);
      const devanagariLetters = /[\u0900-\u0963\u0970-\u097F]/;
      const gurmukhiLetters = /[\u0A01-\u0A74]/;
      const expectedScript = language === "hi" ? devanagariLetters : gurmukhiLetters;
      const wrongScript = language === "hi" ? gurmukhiLetters : devanagariLetters;
      if (!expectedScript.test(localized.stem) || !expectedScript.test(prose)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: expected script missing`);
      }
      if (wrongScript.test(`${localized.stem}\n${prose}`)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: cross-script contamination`);
      }
      if (/\b(average|find|term|terms|first|last|middle|smallest|largest|difference|therefore|so)\b/i.test(prose)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: English prose fallback`);
      }
      if (localized.explanation.lines.length !== 4) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation does not have four lines`);
      }
      if (!localized.explanation.lines.some((line) => line.includes(localized.answer))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation omits answer evidence`);
      }
      if (!localized.explanation.lines.some((line) => /\\times|\\div|×|÷|\+|-/.test(line))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation omits substituted arithmetic`);
      }

      if (
        localized.stem !== repeated.stem ||
        localized.answer !== repeated.answer ||
        localized.correctIndex !== repeated.correctIndex ||
        JSON.stringify(localized.options) !== JSON.stringify(repeated.options) ||
        JSON.stringify(localized.explanation) !== JSON.stringify(repeated.explanation)
      ) {
        fail(`${entry.qlId}:${language}:${seedIndex}: localized generation is not deterministic`);
      }

      if (seedIndex === 0) {
        const normalized = normalize(localized.stem);
        const languageMap = stemsByLanguage.get(language)!;
        languageMap.set(normalized, [...(languageMap.get(normalized) ?? []), entry.qlId]);
      }
    }
  }
}

for (const [language, stems] of stemsByLanguage) {
  for (const [stem, qlIds] of stems) {
    if (qlIds.length > 1) fail(`${language}: exact cross-QL duplicate ${qlIds.join(", ")} :: ${stem}`);
  }
}

const outsideEntry = getAvg001QuestionEntries().find((entry) => entry.cpId !== "AVG-CP-002");
if (outsideEntry) {
  assert.throws(
    () => runAvg001Cp002LocalizationPilot({ questionLanguageId: outsideEntry.qlId, seed: "outside-pilot", language: "hi" }),
    /outside the AVG-001 CP-002 multilingual pilot/,
  );
}

console.log(JSON.stringify({
  releaseId: AVG_001_CP002_MULTILINGUAL_PILOT.releaseId,
  status: AVG_001_CP002_MULTILINGUAL_PILOT.status,
  editorialStatus: AVG_001_CP002_MULTILINGUAL_PILOT.editorialStatus,
  qlCount: cpEntries.length,
  modeCounts: Object.fromEntries(Object.keys(expectedModeCounts).map((mode) => [mode, cpEntries.filter((entry) => entry.solveMode === mode).length])),
  languages: AVG_001_CP002_MULTILINGUAL_PILOT.languages,
  generated,
  duplicateStemGroups: Object.fromEntries(
    [...stemsByLanguage].map(([language, stems]) => [language, [...stems.values()].filter((ids) => ids.length > 1).length]),
  ),
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "FAIL" : "PASS — READY FOR MANUAL LANGUAGE REVIEW",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
