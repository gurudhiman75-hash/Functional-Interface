import { strict as assert } from "node:assert";

import { runAvg001Cp001LocalizationPilot } from "./foundation/cp001-localization-quality-runtime";
import { runAvg001Cp002LocalizationPilot } from "./foundation/cp002-localization-quality-runtime";
import { runAvg001Cp003LocalizationPilot } from "./foundation/cp003-localization-quality-runtime";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import type { Avg001QuestionPackage } from "./foundation/types";

const failures: string[] = [];
const englishExplanations = new Map<string, string[]>();
const englishProse = new Map<string, string[]>();
const localizedExplanations = new Map<string, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);
const localizedProse = new Map<string, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);
const localizedStemStructures = new Map<string, Map<string, string[]>>([
  ["hi", new Map()],
  ["pa", new Map()],
]);

function fail(message: string) {
  failures.push(message);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/₹?[\d,.]+(?:\/\d+)?/g, "#").replace(/\s+/g, " ").trim();
}

function arithmeticLine(line: string) {
  return /\$\$|\\times|\\div|×|÷|[+\-]=?|=/.test(line);
}

function proseSignature(pkg: Avg001QuestionPackage) {
  return normalize(pkg.explanation.lines.filter((line) => !arithmeticLine(line)).join(" "));
}

function add(map: Map<string, string[]>, key: string, qlId: string) {
  map.set(key, [...(map.get(key) ?? []), qlId]);
}

function assertNoDuplicateGroups(label: string, map: Map<string, string[]>) {
  for (const [signature, qlIds] of map) {
    if (qlIds.length > 1) fail(`${label}: duplicate group ${qlIds.join(", ")} :: ${signature}`);
  }
}

function localizedRunner(cpId: string) {
  if (cpId === "AVG-CP-001") return runAvg001Cp001LocalizationPilot;
  if (cpId === "AVG-CP-002") return runAvg001Cp002LocalizationPilot;
  if (cpId === "AVG-CP-003") return runAvg001Cp003LocalizationPilot;
  throw new Error(`No localized quality runtime for ${cpId}`);
}

const entries = getAvg001QuestionEntries();
for (const entry of entries) {
  const seed = `avg-language-quality:${entry.qlId}`;
  const english = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
  const repeatedEnglish = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });

  if (!english.validation.valid || english.validation.checks.some((check) => !check.passed)) {
    fail(`${entry.qlId}: English package fails validation`);
  }
  if (english.traceability.explanationAuthorship !== "AVG-001 deterministic human-authored presentation v1") {
    fail(`${entry.qlId}: English explanation authorship marker missing`);
  }
  if (english.explanation.lines.length < 4 || english.explanation.lines.length > 8) {
    fail(`${entry.qlId}: English explanation has ${english.explanation.lines.length} lines`);
  }
  if (!english.explanation.lines.some((line) => line.includes(english.answer))) {
    fail(`${entry.qlId}: English explanation omits answer evidence`);
  }
  if (!english.explanation.lines.some(arithmeticLine)) {
    fail(`${entry.qlId}: English explanation omits arithmetic`);
  }
  if (JSON.stringify(english.explanation) !== JSON.stringify(repeatedEnglish.explanation)) {
    fail(`${entry.qlId}: English explanation is not deterministic`);
  }

  add(englishExplanations, normalize(english.explanation.lines.join("\n")), entry.qlId);
  add(englishProse, proseSignature(english), entry.qlId);

  if (entry.cpId === "AVG-CP-001" || entry.cpId === "AVG-CP-002" || entry.cpId === "AVG-CP-003") {
    const runner = localizedRunner(entry.cpId);
    for (const language of ["hi", "pa"] as const) {
      const localized = runner({ questionLanguageId: entry.qlId, seed, language });
      const repeated = runner({ questionLanguageId: entry.qlId, seed, language });
      const languageExplanations = localizedExplanations.get(language)!;
      const languageProse = localizedProse.get(language)!;
      const languageStems = localizedStemStructures.get(language)!;

      if (!localized.validation.valid || localized.validation.checks.some((check) => !check.passed)) {
        const failed = localized.validation.checks.filter((check) => !check.passed).map((check) => check.name).join(",");
        fail(`${entry.qlId}:${language}: localized validation fails [${failed}]`);
      }
      if (localized.traceability.explanationAuthorship !== "AVG-001 deterministic human-authored presentation v1") {
        fail(`${entry.qlId}:${language}: explanation authorship marker missing`);
      }
      if (localized.answer !== english.answer || localized.correctIndex !== english.correctIndex) {
        fail(`${entry.qlId}:${language}: answer or correct index changed`);
      }
      if (JSON.stringify(localized.options) !== JSON.stringify(english.options)) {
        fail(`${entry.qlId}:${language}: options changed`);
      }
      if (JSON.stringify(localized.parameters.values) !== JSON.stringify(english.parameters.values)) {
        fail(`${entry.qlId}:${language}: mathematical parameters changed`);
      }
      if (localized.mathematicalFingerprint !== english.mathematicalFingerprint) {
        fail(`${entry.qlId}:${language}: mathematical fingerprint changed`);
      }
      if (JSON.stringify(localized.explanation) !== JSON.stringify(repeated.explanation) || localized.stem !== repeated.stem) {
        fail(`${entry.qlId}:${language}: localized presentation is not deterministic`);
      }

      add(languageExplanations, normalize(localized.explanation.lines.join("\n")), entry.qlId);
      add(languageProse, proseSignature(localized), entry.qlId);
      add(languageStems, normalize(localized.stem), entry.qlId);
    }
  }
}

assertNoDuplicateGroups("English full explanation", englishExplanations);
assertNoDuplicateGroups("English prose structure", englishProse);
for (const language of ["hi", "pa"] as const) {
  assertNoDuplicateGroups(`${language} full explanation`, localizedExplanations.get(language)!);
  assertNoDuplicateGroups(`${language} prose structure`, localizedProse.get(language)!);
  for (const [signature, qlIds] of localizedStemStructures.get(language)!) {
    if (qlIds.length > 3) fail(`${language}: over-repeated normalized stem structure ${qlIds.join(", ")} :: ${signature}`);
  }
}

console.log(JSON.stringify({
  englishQlCount: entries.length,
  localizedQlCountPerLanguage: entries.filter((entry) => ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(entry.cpId)).length,
  englishExactExplanationGroups: englishExplanations.size,
  englishProseGroups: englishProse.size,
  hindiExactExplanationGroups: localizedExplanations.get("hi")!.size,
  hindiProseGroups: localizedProse.get("hi")!.size,
  punjabiExactExplanationGroups: localizedExplanations.get("pa")!.size,
  punjabiProseGroups: localizedProse.get("pa")!.size,
  failureCount: failures.length,
  failures: failures.slice(0, 250),
  verdict: failures.length ? "FAIL" : "PASS — STEMS CONTEXTUAL AND EVERY EXPLANATION PROSE SIGNATURE UNIQUE",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
