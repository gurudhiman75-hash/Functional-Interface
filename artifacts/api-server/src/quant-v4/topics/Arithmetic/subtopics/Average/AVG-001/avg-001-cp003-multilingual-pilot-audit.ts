import { strict as assert } from "node:assert";

import { getAvg001QuestionEntries } from "./foundation/library";
import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot,
} from "./foundation/cp003-localization-pilot";
import { runAvg001Pipeline } from "./foundation/pipeline";

const cpEntries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-003");
const localizedQlIds = getAvg001Cp003LocalizedQlIds();
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

if (cpEntries.length !== 86) fail(`expected 86 CP-003 QLs; got ${cpEntries.length}`);
if (localizedQlIds.length !== 86) fail(`expected 86 localized QL IDs; got ${localizedQlIds.length}`);
if (new Set(localizedQlIds).size !== 86) fail("localized QL IDs are not unique");
if (JSON.stringify(localizedQlIds) !== JSON.stringify(cpEntries.map((entry) => entry.qlId))) {
  fail("localized QL IDs do not match the active CP-003 QL order");
}

const expectedModeCounts = {
  findNewAverageAfterAddition: 13,
  findNewAverageAfterRemoval: 12,
  findNewAverageAfterReplacement: 13,
  findAddedMemberValueFromShift: 13,
  findRemovedMemberValueFromShift: 12,
  findReplacementValueFromShift: 11,
  findInningsValueOrNewCricketAverage: 12,
};
for (const [mode, expected] of Object.entries(expectedModeCounts)) {
  const actual = cpEntries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) fail(`${mode}: expected ${expected} QLs; got ${actual}`);
}

for (const entry of cpEntries) {
  for (const language of AVG_001_CP003_MULTILINGUAL_PILOT.languages) {
    for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
      const seed = `avg-cp003-localization:${entry.qlId}:${seedIndex}`;
      const english = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
      const localized = runAvg001Cp003LocalizationPilot({ questionLanguageId: entry.qlId, seed, language });
      const repeated = runAvg001Cp003LocalizationPilot({ questionLanguageId: entry.qlId, seed, language });
      generated += 1;

      if (localized.language !== language) fail(`${entry.qlId}:${language}:${seedIndex}: wrong language`);
      if (localized.canonicalProblemId !== "AVG-CP-003") fail(`${entry.qlId}:${language}:${seedIndex}: wrong CP`);
      if (localized.maturity !== "MANUAL_REVIEW") fail(`${entry.qlId}:${language}:${seedIndex}: wrong maturity`);
      if (localized.publiclyPublishable) fail(`${entry.qlId}:${language}:${seedIndex}: pilot is publishable`);
      if (!localized.validation.valid || localized.validation.checks.some((check) => !check.passed)) {
        const failedChecks = localized.validation.checks.filter((check) => !check.passed).map((check) => check.name).join(",");
        fail(`${entry.qlId}:${language}:${seedIndex}: localization validation failed [${failedChecks}]`);
      }
      if (localized.traceability.localizationReleaseId !== AVG_001_CP003_MULTILINGUAL_PILOT.releaseId) {
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
      if (/\b(average|find|total|member|student|employee|score|runs|years|therefore|so)\b/i.test(prose)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: English prose fallback`);
      }
      if (localized.explanation.lines.length !== 4) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation does not have four lines`);
      }
      if (!localized.explanation.lines.some((line) => line.includes(localized.answer))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation omits answer evidence`);
      }
      if (!localized.explanation.lines.some((line) => /×|÷|\+|-/.test(line))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation omits substituted arithmetic`);
      }

      const yearsElapsed = Number(localized.parameters.values.yearsElapsed ?? 0);
      if (yearsElapsed > 0 && !localized.stem.includes(String(yearsElapsed))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: elapsed years missing from stem`);
      }
      if (/cricket/i.test(entry.scenarioVariant) && !localized.stem.includes(String(localized.parameters.values.inningsCount))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: innings count missing from cricket stem`);
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

const outsideEntry = getAvg001QuestionEntries().find((entry) => entry.cpId !== "AVG-CP-003");
if (outsideEntry) {
  assert.throws(
    () => runAvg001Cp003LocalizationPilot({ questionLanguageId: outsideEntry.qlId, seed: "outside-pilot", language: "hi" }),
    /outside the AVG-001 CP-003 multilingual pilot/,
  );
}

console.log(JSON.stringify({
  releaseId: AVG_001_CP003_MULTILINGUAL_PILOT.releaseId,
  status: AVG_001_CP003_MULTILINGUAL_PILOT.status,
  editorialStatus: AVG_001_CP003_MULTILINGUAL_PILOT.editorialStatus,
  qlCount: cpEntries.length,
  modeCounts: Object.fromEntries(Object.keys(expectedModeCounts).map((mode) => [mode, cpEntries.filter((entry) => entry.solveMode === mode).length])),
  languages: AVG_001_CP003_MULTILINGUAL_PILOT.languages,
  generated,
  duplicateStemGroups: Object.fromEntries(
    [...stemsByLanguage].map(([language, stems]) => [language, [...stems.values()].filter((ids) => ids.length > 1).length]),
  ),
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "FAIL" : "PASS — READY FOR MANUAL LANGUAGE REVIEW",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
