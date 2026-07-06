import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  extractPlaceholders,
  getCommonQuestionLanguageIds,
  getQuestionLanguageIds,
  getRequiredVariables,
  validateRap001Libraries,
} from "./library";
import {
  getRap001ActiveCanonicalProblemIds,
  getSelectableQuestionLanguageIds,
} from "./parameter-generator";
import { runRap001Pipeline } from "./pipeline";
import type { Rap001CanonicalProblemId, Rap001Language } from "./types";

const API_ROOT = existsSync(resolve(process.cwd(), "src/quant-v4"))
  ? process.cwd()
  : resolve(process.cwd(), "artifacts/api-server");
const PACKAGE_DIR = resolve(
  API_ROOT,
  "src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/RAP-001",
);

const ACTIVE_CP_IDS = getRap001ActiveCanonicalProblemIds();
const LANGUAGES: readonly Rap001Language[] = ["en", "hi", "pa"];
const NON_ENGLISH_LANGUAGES: readonly Exclude<Rap001Language, "en">[] = ["hi", "pa"];
const SEEDS_PER_QL_LANGUAGE = 30;

type Failure = {
  cpId: Rap001CanonicalProblemId;
  questionLanguageId: string;
  language: Rap001Language;
  seed: string;
  check:
    | "validation"
    | "metadata-language"
    | "placeholder-occurrence-parity"
    | "wrong-ql"
    | "english-leakage"
    | "source-english-leakage"
    | "garbled-output"
    | "mojibake-output"
    | "source-mojibake-output"
    | "unresolved-placeholder"
    | "random-selection"
    | "unsupported-ql-not-blocked";
  location: "stem" | "explanation" | "package" | "source-stem" | "source-explanation";
  text: string;
};

type AuditSummary = {
  jsonParsePassed: boolean;
  libraryValidationPassed: boolean;
  placeholderParityPassed: boolean;
  placeholderOccurrenceParityPassed: boolean;
  requiredPlaceholdersPassed: boolean;
  englishQuestionLanguageCount: number;
  activeQuestionLanguageCount: number;
  localizedQuestionLanguageCounts: Record<"hi" | "pa", number>;
  sourceLeakageCounts: Record<"hi" | "pa", number>;
  sourceMojibakeCounts: Record<"hi" | "pa", number>;
  generatedPackages: number;
  generatedPerLanguage: Record<Rap001Language, number>;
  forcedLocalizedGenerationPassed: boolean;
  forcedUnsupportedNonEnglishBlocked: boolean;
  randomSelectableOnly: Record<"hi" | "pa", boolean>;
  failureCounts: Record<string, number>;
  sampleOutputs: Array<{
    language: Rap001Language;
    questionLanguageId: string;
    stem: string;
    explanationPreview: string[];
  }>;
};

function loadJson(filename: string) {
  return JSON.parse(readFileSync(resolve(PACKAGE_DIR, filename), "utf8"));
}

function stripExplanationMath(text: string) {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\[\s*\\Rightarrow[\s\S]*?\]/g, " ");
}

function hasUnresolvedPlaceholder(text: string) {
  return /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(stripExplanationMath(text));
}

function detectEnglishLeakage(text: string) {
  const sanitized = stripExplanationMath(text)
    .replace(/Rs\./g, "")
    .replace(/\\[A-Za-z]+/g, "")
    .replace(/[0-9%{}.,:;!?()\-+/\\=\[\]$]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return /[A-Za-z]{2,}/.test(sanitized);
}

function detectSourceEnglishLeakage(text: string) {
  const sanitized = String(text)
    .replace(/\{[A-Za-z_][A-Za-z0-9_]*\}/g, "")
    .replace(/RAP-[A-Z]+-\d+/g, "")
    .replace(/Rs\./g, "")
    .replace(/[0-9%{}.,:;!?()\-+/\\=\[\]$]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return /[A-Za-z]{2,}/.test(sanitized);
}

function hasGarbledQuestionMarks(text: string) {
  const sanitized = stripExplanationMath(text);
  return sanitized.includes("?") || /\?{3,}/.test(sanitized);
}

function hasMojibake(text: string) {
  return /[Ãàï¿½]/.test(text);
}

function countBy(values: readonly string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function sameArray(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function walkStrings(value: unknown, visit: (text: string, path: string) => void, path = "$") {
  if (typeof value === "string") {
    visit(value, path);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key === "difficulty" || key === "explanationId" || key === "aliasOf") continue;
    walkStrings(child, visit, `${path}.${key}`);
  }
}

async function main() {
  const questionLanguageEn = loadJson("question-language.en.json");
  const questionLanguageHi = loadJson("question-language.hi.json");
  const questionLanguagePa = loadJson("question-language.pa.json");
  loadJson("explanation.en.json");
  loadJson("explanation.hi.json");
  loadJson("explanation.pa.json");
  loadJson("task-registry.library.json");

  const libraryValidation = validateRap001Libraries();
  assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

  const failures: Failure[] = [];
  let placeholderParityPassed = true;
  let placeholderOccurrenceParityPassed = true;
  let requiredPlaceholdersPassed = true;
  let generatedPackages = 0;
  let forcedLocalizedGenerationPassed = true;
  let forcedUnsupportedNonEnglishBlocked = true;
  const randomSelectableOnly = { hi: true, pa: true };
  const generatedPerLanguage: Record<Rap001Language, number> = { en: 0, hi: 0, pa: 0 };
  const sampleOutputs: AuditSummary["sampleOutputs"] = [];
  const sourceLeakageCounts = { hi: 0, pa: 0 };
  const sourceMojibakeCounts = { hi: 0, pa: 0 };
  const sameSet = (left: Set<string>, right: Set<string>) =>
    left.size === right.size && [...left].every((value) => right.has(value));

  const englishQuestionLanguageCount = ACTIVE_CP_IDS.reduce(
    (count, cpId) => count + getQuestionLanguageIds(cpId, "en").length,
    0,
  );
  let activeQuestionLanguageCount = 0;

  for (const [language, questionLibrary, explanationLibrary] of [
    ["hi", questionLanguageHi, loadJson("explanation.hi.json")],
    ["pa", questionLanguagePa, loadJson("explanation.pa.json")],
  ] as const) {
    for (const [libraryName, libraryValue, location] of [
      ["question-language", questionLibrary, "source-stem"],
      ["explanation", explanationLibrary, "source-explanation"],
    ] as const) {
      walkStrings(libraryValue, (text, path) => {
        if (detectSourceEnglishLeakage(text)) {
          sourceLeakageCounts[language] += 1;
          if (failures.filter((failure) => failure.check === "source-english-leakage").length < 40) {
            failures.push({
              cpId: "RAP-CP-001",
              questionLanguageId: "source",
              language,
              seed: `${libraryName}:${path}`,
              check: "source-english-leakage",
              location,
              text,
            });
          }
        }
        if (hasMojibake(text)) {
          sourceMojibakeCounts[language] += 1;
          failures.push({
            cpId: "RAP-CP-001",
            questionLanguageId: "source",
            language,
            seed: `${libraryName}:${path}`,
            check: "source-mojibake-output",
            location,
            text,
          });
        }
      });
    }
  }

  for (const cpId of ACTIVE_CP_IDS) {
    const activeIds = getCommonQuestionLanguageIds(cpId);
    const selectableHi = getSelectableQuestionLanguageIds(cpId, "hi");
    const selectablePa = getSelectableQuestionLanguageIds(cpId, "pa");

    activeQuestionLanguageCount += activeIds.length;
    assert.deepEqual(selectableHi, activeIds, `${cpId} Hindi localized set must match the active RAP set.`);
    assert.deepEqual(selectablePa, activeIds, `${cpId} Punjabi localized set must match the active RAP set.`);

    for (const questionLanguageId of activeIds) {
      const enTemplate = questionLanguageEn[cpId]?.families?.[questionLanguageId]?.template;
      const hiTemplate = questionLanguageHi[cpId]?.families?.[questionLanguageId]?.template;
      const paTemplate = questionLanguagePa[cpId]?.families?.[questionLanguageId]?.template;

      const enPlaceholders = new Set(extractPlaceholders(String(enTemplate ?? "")));
      const hiPlaceholders = new Set(extractPlaceholders(String(hiTemplate ?? "")));
      const paPlaceholders = new Set(extractPlaceholders(String(paTemplate ?? "")));
      const enPlaceholderOccurrences = extractPlaceholders(String(enTemplate ?? "")).sort();
      const hiPlaceholderOccurrences = extractPlaceholders(String(hiTemplate ?? "")).sort();
      const paPlaceholderOccurrences = extractPlaceholders(String(paTemplate ?? "")).sort();
      const requiredVariables = getRequiredVariables(cpId, questionLanguageId);

      placeholderParityPassed =
        placeholderParityPassed &&
        sameSet(enPlaceholders, hiPlaceholders) &&
        sameSet(enPlaceholders, paPlaceholders);

      if (!sameArray(enPlaceholderOccurrences, hiPlaceholderOccurrences)) {
        placeholderOccurrenceParityPassed = false;
        failures.push({
          cpId,
          questionLanguageId,
          language: "hi",
          seed: "source-placeholder-occurrence",
          check: "placeholder-occurrence-parity",
          location: "source-stem",
          text: `en=${enPlaceholderOccurrences.join(",")} hi=${hiPlaceholderOccurrences.join(",")}`,
        });
      }
      if (!sameArray(enPlaceholderOccurrences, paPlaceholderOccurrences)) {
        placeholderOccurrenceParityPassed = false;
        failures.push({
          cpId,
          questionLanguageId,
          language: "pa",
          seed: "source-placeholder-occurrence",
          check: "placeholder-occurrence-parity",
          location: "source-stem",
          text: `en=${enPlaceholderOccurrences.join(",")} pa=${paPlaceholderOccurrences.join(",")}`,
        });
      }

      requiredPlaceholdersPassed =
        requiredPlaceholdersPassed &&
        requiredVariables.every(
          (name) =>
            enPlaceholders.has(name) &&
            hiPlaceholders.has(name) &&
            paPlaceholders.has(name),
        );

      for (const language of LANGUAGES) {
        for (let seedIndex = 0; seedIndex < SEEDS_PER_QL_LANGUAGE; seedIndex += 1) {
          const seed = `rap-001-multilingual:${language}:${cpId}:${questionLanguageId}:${seedIndex}`;
          const pkg = runRap001Pipeline(cpId, {
            language,
            questionLanguageId,
            seed,
          });

          generatedPackages += 1;
          generatedPerLanguage[language] += 1;

          if (pkg.language !== language) {
            failures.push({
              cpId,
              questionLanguageId,
              language,
              seed,
              check: "metadata-language",
              location: "package",
              text: `Expected ${language}, got ${pkg.language}`,
            });
          }

          if (pkg.questionLanguageId !== questionLanguageId) {
            failures.push({
              cpId,
              questionLanguageId,
              language,
              seed,
              check: "wrong-ql",
              location: "package",
              text: `Expected ${questionLanguageId}, got ${pkg.questionLanguageId}`,
            });
          }

          if (!pkg.validation.valid) {
            forcedLocalizedGenerationPassed = false;
            failures.push({
              cpId,
              questionLanguageId,
              language,
              seed,
              check: "validation",
              location: "package",
              text: pkg.validation.checks
                .filter((check) => !check.passed)
                .map((check) => check.message)
                .join("; "),
            });
          }

          if (hasUnresolvedPlaceholder(pkg.stem)) {
            failures.push({
              cpId,
              questionLanguageId,
              language,
              seed,
              check: "unresolved-placeholder",
              location: "stem",
              text: pkg.stem,
            });
          }

          const explanationText = pkg.explanation.lines.join("\n");
          if (hasUnresolvedPlaceholder(explanationText)) {
            failures.push({
              cpId,
              questionLanguageId,
              language,
              seed,
              check: "unresolved-placeholder",
              location: "explanation",
              text: explanationText,
            });
          }

          if (language !== "en") {
            if (detectEnglishLeakage(pkg.stem)) {
              failures.push({
                cpId,
                questionLanguageId,
                language,
                seed,
                check: "english-leakage",
                location: "stem",
                text: pkg.stem,
              });
            }
            if (detectEnglishLeakage(explanationText)) {
              failures.push({
                cpId,
                questionLanguageId,
                language,
                seed,
                check: "english-leakage",
                location: "explanation",
                text: explanationText,
              });
            }
            if (hasGarbledQuestionMarks(pkg.stem)) {
              failures.push({
                cpId,
                questionLanguageId,
                language,
                seed,
                check: "garbled-output",
                location: "stem",
                text: pkg.stem,
              });
            }
            if (hasGarbledQuestionMarks(explanationText)) {
              failures.push({
                cpId,
                questionLanguageId,
                language,
                seed,
                check: "garbled-output",
                location: "explanation",
                text: explanationText,
              });
            }
            if (hasMojibake(pkg.stem)) {
              failures.push({
                cpId,
                questionLanguageId,
                language,
                seed,
                check: "mojibake-output",
                location: "stem",
                text: pkg.stem,
              });
            }
            if (hasMojibake(explanationText)) {
              failures.push({
                cpId,
                questionLanguageId,
                language,
                seed,
                check: "mojibake-output",
                location: "explanation",
                text: explanationText,
              });
            }
          }

          if (sampleOutputs.length < 12) {
            sampleOutputs.push({
              language,
              questionLanguageId,
              stem: pkg.stem,
              explanationPreview: pkg.explanation.lines.slice(0, 4),
            });
          }
        }
      }
    }

    const inactiveEnglishIds = getQuestionLanguageIds(cpId, "en").filter(
      (questionLanguageId) => !activeIds.includes(questionLanguageId),
    );
    const unsupportedQuestionLanguageId = inactiveEnglishIds[0];
    if (unsupportedQuestionLanguageId) {
      for (const language of NON_ENGLISH_LANGUAGES) {
        try {
          runRap001Pipeline(cpId, {
            language,
            questionLanguageId: unsupportedQuestionLanguageId,
            seed: `rap-001-unsupported:${language}:${cpId}:${unsupportedQuestionLanguageId}`,
          });
          forcedUnsupportedNonEnglishBlocked = false;
          failures.push({
            cpId,
            questionLanguageId: unsupportedQuestionLanguageId,
            language,
            seed: `rap-001-unsupported:${language}:${cpId}:${unsupportedQuestionLanguageId}`,
            check: "unsupported-ql-not-blocked",
            location: "package",
            text: `Unsupported non-English QL ${unsupportedQuestionLanguageId} was generated.`,
          });
        } catch {
          // expected
        }
      }
    }
  }

  for (const language of NON_ENGLISH_LANGUAGES) {
    for (const cpId of ACTIVE_CP_IDS) {
      const selectableIds = new Set(getSelectableQuestionLanguageIds(cpId, language));
      for (let seedIndex = 0; seedIndex < 30; seedIndex += 1) {
        const seed = `rap-001-random:${language}:${cpId}:${seedIndex}`;
        const pkg = runRap001Pipeline(cpId, { language, seed });
        if (!selectableIds.has(pkg.questionLanguageId)) {
          randomSelectableOnly[language] = false;
          failures.push({
            cpId,
            questionLanguageId: pkg.questionLanguageId,
            language,
            seed,
            check: "random-selection",
            location: "package",
            text: `Random ${language} selection produced unsupported QL ${pkg.questionLanguageId}.`,
          });
        }
      }
    }
  }

  const failureCounts = countBy(failures.map((failure) => failure.check));

  const summary: AuditSummary = {
    jsonParsePassed: true,
    libraryValidationPassed: libraryValidation.valid,
    placeholderParityPassed,
    placeholderOccurrenceParityPassed,
    requiredPlaceholdersPassed,
    englishQuestionLanguageCount,
    activeQuestionLanguageCount,
    localizedQuestionLanguageCounts: {
      hi: ACTIVE_CP_IDS.reduce((count, cpId) => count + getSelectableQuestionLanguageIds(cpId, "hi").length, 0),
      pa: ACTIVE_CP_IDS.reduce((count, cpId) => count + getSelectableQuestionLanguageIds(cpId, "pa").length, 0),
    },
    sourceLeakageCounts,
    sourceMojibakeCounts,
    generatedPackages,
    generatedPerLanguage,
    forcedLocalizedGenerationPassed,
    forcedUnsupportedNonEnglishBlocked,
    randomSelectableOnly,
    failureCounts,
    sampleOutputs,
  };

  console.log(JSON.stringify(summary, null, 2));

  const blockingFailures = failures.filter(
    (failure) => failure.check !== "source-english-leakage",
  );

  if (failures.length > 0) {
    for (const failure of failures) {
      const label = failure.check.startsWith("source-") ? "WARN" : "FAIL";
      console.error(
        `${label} ${failure.cpId}:${failure.questionLanguageId}:${failure.language}:${failure.seed}:${failure.location}:${failure.check}`,
      );
      console.error(failure.text);
    }
  }

  if (blockingFailures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
