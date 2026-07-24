import { strict as assert } from "node:assert";

import { getAvg001QuestionEntries } from "./foundation/library";
import {
  AVG_001_CP001_MULTILINGUAL_PILOT,
  getAvg001Cp001LocalizedQlIds,
  runAvg001Cp001LocalizationPilot,
} from "./foundation/cp001-localization-pilot";
import { runAvg001Pipeline } from "./foundation/pipeline";

const cpEntries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-001");
const localizedQlIds = getAvg001Cp001LocalizedQlIds();
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

if (cpEntries.length !== 80) fail(`expected 80 CP-001 QLs; got ${cpEntries.length}`);
if (localizedQlIds.length !== 80) fail(`expected 80 localized template IDs; got ${localizedQlIds.length}`);
if (new Set(localizedQlIds).size !== 80) fail("localized QL IDs are not unique");

const expectedQlIds = cpEntries.map((entry) => entry.qlId);
if (JSON.stringify(localizedQlIds) !== JSON.stringify(expectedQlIds)) {
  fail("localized QL IDs do not match the active CP-001 QL order");
}

for (const entry of cpEntries) {
  for (const language of AVG_001_CP001_MULTILINGUAL_PILOT.languages) {
    for (let seedIndex = 0; seedIndex < 3; seedIndex += 1) {
      const seed = `avg-cp001-localization:${entry.qlId}:${seedIndex}`;
      const english = runAvg001Pipeline({
        questionLanguageId: entry.qlId,
        seed,
        language: "en",
      });
      const localized = runAvg001Cp001LocalizationPilot({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const repeated = runAvg001Cp001LocalizationPilot({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      generated += 1;

      if (localized.language !== language) fail(`${entry.qlId}:${language}:${seedIndex}: wrong package language`);
      if (localized.canonicalProblemId !== "AVG-CP-001") fail(`${entry.qlId}:${language}:${seedIndex}: wrong CP`);
      if (localized.maturity !== "MANUAL_REVIEW") fail(`${entry.qlId}:${language}:${seedIndex}: wrong maturity`);
      if (localized.publiclyPublishable) fail(`${entry.qlId}:${language}:${seedIndex}: pilot is publishable`);
      if (!localized.validation.valid || localized.validation.checks.some((check) => !check.passed)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: localization validation failed`);
      }
      if (localized.traceability.localizationReleaseId !== AVG_001_CP001_MULTILINGUAL_PILOT.releaseId) {
        fail(`${entry.qlId}:${language}:${seedIndex}: missing localization release ID`);
      }
      if (localized.traceability.sourceEnglishReleaseId !== english.traceability.releaseId) {
        fail(`${entry.qlId}:${language}:${seedIndex}: wrong English source release`);
      }
      if (localized.answer !== english.answer) fail(`${entry.qlId}:${language}:${seedIndex}: answer changed`);
      if (localized.correctIndex !== english.correctIndex) fail(`${entry.qlId}:${language}:${seedIndex}: correct index changed`);
      if (JSON.stringify(localized.options) !== JSON.stringify(english.options)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: numeric options changed`);
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
        fail(`${entry.qlId}:${language}:${seedIndex}: Latin-script text remains in stem`);
      }

      const prose = proseOnly(localized.explanation.lines);
      const expectedScript = language === "hi" ? /[\u0900-\u097F]/ : /[\u0A00-\u0A7F]/;
      const wrongScript = language === "hi" ? /[\u0A00-\u0A7F]/ : /[\u0900-\u097F]/;
      if (!expectedScript.test(localized.stem) || !expectedScript.test(prose)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: expected script missing`);
      }
      if (wrongScript.test(`${localized.stem}\n${prose}`)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: cross-script contamination`);
      }
      if (/\b(average|find|total|student|students|marks|units|value|remaining|new|therefore|so)\b/i.test(prose)) {
        fail(`${entry.qlId}:${language}:${seedIndex}: English prose fallback in explanation`);
      }
      if (localized.explanation.lines.length !== 4) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation does not have four lines`);
      }
      if (!localized.explanation.lines.some((line) => line.includes(localized.answer))) {
        fail(`${entry.qlId}:${language}:${seedIndex}: explanation omits answer evidence`);
      }
      if (!localized.explanation.lines.some((line) => /\\times|\\div|×|÷|\\mathbin/.test(line))) {
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
    if (qlIds.length > 1) fail(`${language}: exact cross-QL stem duplicate ${qlIds.join(", ")} :: ${stem}`);
  }
}

for (const entry of getAvg001QuestionEntries().filter((item) => item.cpId !== "AVG-CP-001")) {
  assert.throws(
    () => runAvg001Cp001LocalizationPilot({
      questionLanguageId: entry.qlId,
      seed: "outside-pilot",
      language: "hi",
    }),
    /outside the AVG-001 CP-001 multilingual pilot/,
  );
  break;
}

console.log(JSON.stringify({
  releaseId: AVG_001_CP001_MULTILINGUAL_PILOT.releaseId,
  status: AVG_001_CP001_MULTILINGUAL_PILOT.status,
  editorialStatus: AVG_001_CP001_MULTILINGUAL_PILOT.editorialStatus,
  qlCount: cpEntries.length,
  languages: AVG_001_CP001_MULTILINGUAL_PILOT.languages,
  generated,
  duplicateStemGroups: Object.fromEntries(
    [...stemsByLanguage].map(([language, stems]) => [
      language,
      [...stems.values()].filter((qlIds) => qlIds.length > 1).length,
    ]),
  ),
  failureCount: failures.length,
  failures: failures.slice(0, 200),
  verdict: failures.length ? "FAIL" : "PASS — READY FOR MANUAL LANGUAGE REVIEW",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
