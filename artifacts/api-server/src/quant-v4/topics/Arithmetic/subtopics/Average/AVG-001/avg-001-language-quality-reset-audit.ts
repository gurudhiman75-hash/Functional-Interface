import { strict as assert } from "node:assert";

import "./avg-001-cp004-multilingual-pilot-audit";
import { runAvg001Cp001LocalizationPilot } from "./foundation/cp001-localization-quality-runtime";
import { runAvg001Cp002LocalizationPilot } from "./foundation/cp002-localization-quality-runtime";
import { runAvg001Cp003LocalizationPilot } from "./foundation/cp003-localization-quality-runtime";
import { runAvg001Cp004LocalizationPilot } from "./foundation/cp004-localization-quality-runtime";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";
import type { Avg001QuestionPackage } from "./foundation/types";

const AUTHORSHIP = "AVG-001 deterministic human-authored presentation v2";
const STEM_VARIATION = "AVG-001 localized stem variation finalizer v1";
const CP003_AUTHORSHIP = "AVG-CP-003 context-authored explanations v1";
const CP003_FINAL_POLISH = "AVG-CP-003 manually differentiated prose v1";
const CP004_AUTHORSHIP = "AVG-CP-004 context-authored localization v1";
const LOCALIZED_CP_IDS = ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003", "AVG-CP-004"];
const CP003_MANUALLY_DIFFERENTIATED = new Set([
  "AVG-QL-156",
  "AVG-QL-160",
  "AVG-QL-394",
  "AVG-QL-395",
  "AVG-QL-398",
  "AVG-QL-399",
  "AVG-QL-400",
  "AVG-QL-401",
  "AVG-QL-404",
  "AVG-QL-405",
]);
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
  return value
    .toLowerCase()
    .replace(/₹?[\d,.]+(?:\/\d+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function arithmeticLine(line: string) {
  return /\$\$|\\times|\\div|×|÷/.test(line) || /\d[\d,.]*\s*[+\-]\s*\d/.test(line);
}

function answerToken(pkg: Avg001QuestionPackage) {
  const match = String(pkg.answer)
    .replaceAll(",", "")
    .match(/-?\d+(?:\.\d+)?(?::-?\d+(?:\.\d+)?)?/);
  return match?.[0] ?? String(pkg.answer).trim();
}

function containsCalculatedAnswer(pkg: Avg001QuestionPackage) {
  const answer = answerToken(pkg);
  return pkg.explanation.lines.some((line) => {
    if (!arithmeticLine(line)) return false;
    const compact = line.replaceAll(",", "").replaceAll(" ", "").replaceAll("₹", "");
    const marker = `=${answer}`;
    let index = compact.indexOf(marker);
    while (index >= 0) {
      const next = compact[index + marker.length] ?? "";
      if (!/[0-9.:]/.test(next)) return true;
      index = compact.indexOf(marker, index + 1);
    }
    return false;
  });
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
  if (cpId === "AVG-CP-004") return runAvg001Cp004LocalizationPilot;
  throw new Error(`No localized quality runtime for ${cpId}`);
}

function checkAuthorship(pkg: Avg001QuestionPackage, scope: string) {
  if (pkg.traceability.explanationAuthorship !== AUTHORSHIP) {
    fail(`${scope}: explanation authorship marker missing`);
  }
  if (typeof pkg.traceability.explanationOpeningVariant !== "number") {
    fail(`${scope}: explanation opening variant missing`);
  }
  if (typeof pkg.traceability.explanationConclusionVariant !== "number") {
    fail(`${scope}: explanation conclusion variant missing`);
  }
  if (
    pkg.canonicalProblemId === "AVG-CP-003" &&
    pkg.traceability.cp003ExplanationAuthorship !== CP003_AUTHORSHIP
  ) {
    fail(`${scope}: CP-003 context-authored explanation marker missing`);
  }
  if (
    CP003_MANUALLY_DIFFERENTIATED.has(pkg.questionLanguageId) &&
    pkg.traceability.cp003ExplanationFinalPolish !== CP003_FINAL_POLISH
  ) {
    fail(`${scope}: CP-003 manually differentiated prose marker missing`);
  }
  if (
    pkg.language !== "en" &&
    pkg.canonicalProblemId === "AVG-CP-004" &&
    pkg.traceability.cp004LocalizationAuthorship !== CP004_AUTHORSHIP
  ) {
    fail(`${scope}: CP-004 context-authored localization marker missing`);
  }
}

function checkExplanation(pkg: Avg001QuestionPackage, scope: string) {
  if (pkg.explanation.lines.length < 4 || pkg.explanation.lines.length > 8) {
    fail(`${scope}: explanation has ${pkg.explanation.lines.length} lines`);
  }
  if (!pkg.explanation.lines.some((line) => line.includes(pkg.answer))) {
    fail(`${scope}: explanation omits answer evidence`);
  }
  if (!pkg.explanation.lines.some(arithmeticLine)) {
    fail(`${scope}: explanation omits substituted arithmetic`);
  }
  if (!containsCalculatedAnswer(pkg)) {
    fail(`${scope}: no arithmetic line calculates the displayed answer`);
  }
}

const entries = getAvg001QuestionEntries();
for (const entry of entries) {
  const seed = `avg-language-quality:${entry.qlId}`;
  const english = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
  const repeatedEnglish = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });

  if (!english.validation.valid || english.validation.checks.some((check) => !check.passed)) {
    const failed = english.validation.checks.filter((check) => !check.passed).map((check) => check.name).join(",");
    fail(`${entry.qlId}: English package fails validation [${failed}]`);
  }
  checkAuthorship(english, entry.qlId);
  checkExplanation(english, entry.qlId);
  if (JSON.stringify(english.explanation) !== JSON.stringify(repeatedEnglish.explanation)) {
    fail(`${entry.qlId}: English explanation is not deterministic`);
  }

  add(englishExplanations, normalize(english.explanation.lines.join("\n")), entry.qlId);
  add(englishProse, proseSignature(english), entry.qlId);

  if (LOCALIZED_CP_IDS.includes(entry.cpId)) {
    const runner = localizedRunner(entry.cpId);
    for (const language of ["hi", "pa"] as const) {
      const localized = runner({ questionLanguageId: entry.qlId, seed, language });
      const repeated = runner({ questionLanguageId: entry.qlId, seed, language });
      const scope = `${entry.qlId}:${language}`;
      const languageExplanations = localizedExplanations.get(language)!;
      const languageProse = localizedProse.get(language)!;
      const languageStems = localizedStemStructures.get(language)!;

      if (!localized.validation.valid || localized.validation.checks.some((check) => !check.passed)) {
        const failed = localized.validation.checks.filter((check) => !check.passed).map((check) => check.name).join(",");
        fail(`${scope}: localized validation fails [${failed}]`);
      }
      if (localized.traceability.localizedStemVariationFinalizer !== STEM_VARIATION) {
        fail(`${scope}: localized stem variation marker missing`);
      }
      checkAuthorship(localized, scope);
      checkExplanation(localized, scope);
      if (localized.answer !== english.answer || localized.correctIndex !== english.correctIndex) {
        fail(`${scope}: answer or correct index changed`);
      }
      if (JSON.stringify(localized.options) !== JSON.stringify(english.options)) {
        fail(`${scope}: options changed`);
      }
      if (JSON.stringify(localized.parameters.values) !== JSON.stringify(english.parameters.values)) {
        fail(`${scope}: mathematical parameters changed`);
      }
      if (localized.mathematicalFingerprint !== english.mathematicalFingerprint) {
        fail(`${scope}: mathematical fingerprint changed`);
      }
      if (
        JSON.stringify(localized.explanation) !== JSON.stringify(repeated.explanation) ||
        localized.stem !== repeated.stem
      ) {
        fail(`${scope}: localized presentation is not deterministic`);
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
  assertNoDuplicateGroups(`${language} normalized stem structure`, localizedStemStructures.get(language)!);
}

console.log(JSON.stringify({
  authorship: AUTHORSHIP,
  localizedStemVariation: STEM_VARIATION,
  cp003Authorship: CP003_AUTHORSHIP,
  cp004Authorship: CP004_AUTHORSHIP,
  englishQlCount: entries.length,
  localizedQlCountPerLanguage: entries.filter((entry) => LOCALIZED_CP_IDS.includes(entry.cpId)).length,
  englishExactExplanationGroups: englishExplanations.size,
  englishProseGroups: englishProse.size,
  hindiExactExplanationGroups: localizedExplanations.get("hi")!.size,
  hindiProseGroups: localizedProse.get("hi")!.size,
  hindiStemStructureGroups: localizedStemStructures.get("hi")!.size,
  punjabiExactExplanationGroups: localizedExplanations.get("pa")!.size,
  punjabiProseGroups: localizedProse.get("pa")!.size,
  punjabiStemStructureGroups: localizedStemStructures.get("pa")!.size,
  failureCount: failures.length,
  failures: failures.slice(0, 300),
  verdict: failures.length
    ? "FAIL"
    : "PASS — UNIQUE LOCALIZED STEMS, UNIQUE PROSE AND DECISIVE ARITHMETIC",
}, null, 2));

assert.equal(failures.length, 0, failures.join("\n"));
