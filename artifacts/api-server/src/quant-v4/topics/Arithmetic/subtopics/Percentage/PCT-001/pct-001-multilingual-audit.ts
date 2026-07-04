import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createQuestionExport } from "../../../../../../../../examtree/src/lib/export-engine";
import { generateQuestion } from "../../../../../generation-engine";
import {
  extractPlaceholders,
  getRequiredVariables,
  generatePct001CoverageAudit,
  runPct001Pipeline,
  validatePct001Libraries,
} from "./index";
import { getPct001ActiveCanonicalProblemIds, getSelectableQuestionLanguageIds } from "./parameter-generator";
import type { Pct001CanonicalProblemId, Pct001Language } from "./types";

const PACKAGE_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001",
);

const LOCALIZED_CP_ID = "PCT-CP-001" as const;
const PILOT_LANGUAGES: readonly Pct001Language[] = ["hi", "pa"];
const RANDOM_SMOKE_SEEDS = [
  "random-01",
  "random-02",
  "random-03",
  "random-04",
  "random-05",
  "random-06",
] as const;

type AuditSummary = {
  jsonParsePassed: boolean;
  placeholderParityPassed: boolean;
  requiredPlaceholdersPassed: boolean;
  unresolvedPlaceholderCount: number;
  englishLeakageCount: number;
  explanationEnglishLeakageCount: number;
  metadataLanguagePassed: boolean;
  explanationLanguageLocalized: boolean;
  forcedLocalizedGenerationPassed: boolean;
  forcedUnsupportedNonEnglishBlocked: boolean;
  randomHiSelectableOnly: boolean;
  randomPaSelectableOnly: boolean;
  localizedCpIds: string[];
  totalEnglishQuestionLanguages: number;
  totalHindiQuestionLanguages: number;
  totalPunjabiQuestionLanguages: number;
  coverageAudit: {
    generationFailures: number;
    validationFailures: number;
    renderFailures: number;
    solverFailures: number;
    unusedQlIds: number;
    unusedEsIds: number;
  };
  randomSelectionCounts: Record<"hi" | "pa", Record<string, number>>;
  forcedSamples: Array<{
    language: Pct001Language;
    questionLanguageId: string;
    stem: string;
    explanationPreview: string[];
    exportLanguage: unknown;
  }>;
};

function loadJson(filename: string) {
  return JSON.parse(readFileSync(resolve(PACKAGE_DIR, filename), "utf8"));
}

function stripExplanationMath(text: string) {
  return text.replace(/\[\s*\\Rightarrow[\s\S]*?\]/g, " ");
}

function hasUnresolvedPlaceholder(text: string) {
  return /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(text);
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

function explanationHasEnglishLeakage(lines: string[]) {
  return lines.some((line) => detectEnglishLeakage(line));
}

async function exportLanguageForQuestion(
  cpId: Pct001CanonicalProblemId,
  language: Pct001Language,
  seed: string,
  questionLanguageId?: string,
) {
  const generated = await generateQuestion({
    packageId: "PCT-001",
    canonicalProblemId: cpId,
    questionLanguageId,
    language,
    count: 1,
    seed,
  });
  const previewQuestion = generated.questions[0];
  const exportPayload = createQuestionExport([previewQuestion], {
    format: "json",
    content: "explanations",
    includeMetadata: true,
    generatedAt: new Date("2026-07-04T00:00:00.000Z"),
    language,
  });
  const parsedExport = JSON.parse(await exportPayload.blob.text());
  return parsedExport.questions?.[0]?.metadata?.language;
}

async function main() {
  const questionLanguageEn = loadJson("question-language.en.json");
  const questionLanguageHi = loadJson("question-language.hi.json");
  const questionLanguagePa = loadJson("question-language.pa.json");
  loadJson("explanation.en.json");
  loadJson("explanation.hi.json");
  loadJson("explanation.pa.json");
  loadJson("task-registry.library.json");

  const libraryValidation = validatePct001Libraries();
  assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

  const englishIds = Object.keys(questionLanguageEn[LOCALIZED_CP_ID]?.families ?? {});
  const hiIds = Object.keys(questionLanguageHi[LOCALIZED_CP_ID]?.families ?? {});
  const paIds = Object.keys(questionLanguagePa[LOCALIZED_CP_ID]?.families ?? {});

  let placeholderParityPassed = true;
  let requiredPlaceholdersPassed = true;
  let unresolvedPlaceholderCount = 0;
  let englishLeakageCount = 0;
  let explanationEnglishLeakageCount = 0;
  let metadataLanguagePassed = true;
  let explanationLanguageLocalized = true;
  let forcedLocalizedGenerationPassed = true;
  let forcedUnsupportedNonEnglishBlocked = true;
  let randomHiSelectableOnly = true;
  let randomPaSelectableOnly = true;

  const forcedSamples: AuditSummary["forcedSamples"] = [];
  const randomSelectionCounts: AuditSummary["randomSelectionCounts"] = {
    hi: {},
    pa: {},
  };

  const sameSet = (left: Set<string>, right: Set<string>) =>
    left.size === right.size && [...left].every((value) => right.has(value));

  assert.equal(englishIds.length, 120, `Expected 120 English QLs for ${LOCALIZED_CP_ID}.`);
  assert.equal(hiIds.length, englishIds.length, "Hindi CP-001 coverage does not match English.");
  assert.equal(paIds.length, englishIds.length, "Punjabi CP-001 coverage does not match English.");

  for (const qlId of englishIds) {
    const enTemplate = questionLanguageEn[LOCALIZED_CP_ID]?.families?.[qlId]?.template;
    const hiTemplate = questionLanguageHi[LOCALIZED_CP_ID]?.families?.[qlId]?.template;
    const paTemplate = questionLanguagePa[LOCALIZED_CP_ID]?.families?.[qlId]?.template;

    const enPlaceholders = new Set(extractPlaceholders(String(enTemplate ?? "")));
    const hiPlaceholders = new Set(extractPlaceholders(String(hiTemplate ?? "")));
    const paPlaceholders = new Set(extractPlaceholders(String(paTemplate ?? "")));
    const requiredVariables = getRequiredVariables(LOCALIZED_CP_ID, qlId);

    placeholderParityPassed =
      placeholderParityPassed &&
      sameSet(enPlaceholders, hiPlaceholders) &&
      sameSet(enPlaceholders, paPlaceholders);

    requiredPlaceholdersPassed =
      requiredPlaceholdersPassed &&
      requiredVariables.every(
        (name) =>
          enPlaceholders.has(name) &&
          hiPlaceholders.has(name) &&
          paPlaceholders.has(name),
      );

    for (const language of PILOT_LANGUAGES) {
      const pkg = runPct001Pipeline(LOCALIZED_CP_ID, {
        language,
        questionLanguageId: qlId,
        seed: `pct-001-multilingual:${language}:${qlId}`,
      });

      if (hasUnresolvedPlaceholder(pkg.stem) || pkg.explanation.lines.some((line) => hasUnresolvedPlaceholder(line))) {
        unresolvedPlaceholderCount += 1;
      }
      if (detectEnglishLeakage(pkg.stem)) {
        englishLeakageCount += 1;
      }
      if (explanationHasEnglishLeakage(pkg.explanation.lines)) {
        explanationEnglishLeakageCount += 1;
        explanationLanguageLocalized = false;
      }
      if (!pkg.validation.valid) {
        forcedLocalizedGenerationPassed = false;
      }

      const exportedLanguage = await exportLanguageForQuestion(
        LOCALIZED_CP_ID,
        language,
        `pct-001-multilingual-export:${language}:${qlId}`,
        qlId,
      );
      if (exportedLanguage !== language) {
        metadataLanguagePassed = false;
      }

      if (forcedSamples.length < 8) {
        forcedSamples.push({
          language,
          questionLanguageId: qlId,
          stem: pkg.stem,
          explanationPreview: pkg.explanation.lines.slice(0, 4),
          exportLanguage: exportedLanguage,
        });
      }
    }
  }

  try {
    runPct001Pipeline("PCT-CP-002", {
      language: "hi",
      questionLanguageId: "PCT-QL-010",
      seed: "pct-001-non-english-block:hi",
    });
    forcedUnsupportedNonEnglishBlocked = false;
  } catch {
    // expected
  }

  try {
    runPct001Pipeline("PCT-CP-002", {
      language: "pa",
      questionLanguageId: "PCT-QL-010",
      seed: "pct-001-non-english-block:pa",
    });
    forcedUnsupportedNonEnglishBlocked = false;
  } catch {
    // expected
  }

  const localizedCpIds = getPct001ActiveCanonicalProblemIds().filter(
    (cpId) =>
      getSelectableQuestionLanguageIds(cpId, "hi").length > 0 &&
      getSelectableQuestionLanguageIds(cpId, "pa").length > 0,
  );

  for (const language of PILOT_LANGUAGES) {
    const selectableIds = getSelectableQuestionLanguageIds(LOCALIZED_CP_ID, language);
    const localizedSet = new Set(language === "hi" ? hiIds : paIds);

    if (selectableIds.some((qlId) => !localizedSet.has(qlId))) {
      if (language === "hi") {
        randomHiSelectableOnly = false;
      } else {
        randomPaSelectableOnly = false;
      }
    }

    for (const seed of RANDOM_SMOKE_SEEDS) {
      const pkg = runPct001Pipeline(LOCALIZED_CP_ID, {
        language,
        seed: `pct-001-random:${language}:${seed}`,
      });

      randomSelectionCounts[language][pkg.questionLanguageId] =
        (randomSelectionCounts[language][pkg.questionLanguageId] ?? 0) + 1;

      if (!localizedSet.has(pkg.questionLanguageId)) {
        if (language === "hi") {
          randomHiSelectableOnly = false;
        } else {
          randomPaSelectableOnly = false;
        }
      }

      if (hasUnresolvedPlaceholder(pkg.stem) || pkg.explanation.lines.some((line) => hasUnresolvedPlaceholder(line))) {
        unresolvedPlaceholderCount += 1;
      }
      if (detectEnglishLeakage(pkg.stem)) {
        englishLeakageCount += 1;
      }
      if (explanationHasEnglishLeakage(pkg.explanation.lines)) {
        explanationEnglishLeakageCount += 1;
        explanationLanguageLocalized = false;
      }

      const exportedLanguage = await exportLanguageForQuestion(
        LOCALIZED_CP_ID,
        language,
        `pct-001-random-export:${language}:${seed}`,
      );
      if (exportedLanguage !== language) {
        metadataLanguagePassed = false;
      }
    }
  }

  const coverageAudit = generateCoverageAuditSummary();

  const summary: AuditSummary = {
    jsonParsePassed: true,
    placeholderParityPassed,
    requiredPlaceholdersPassed,
    unresolvedPlaceholderCount,
    englishLeakageCount,
    explanationEnglishLeakageCount,
    metadataLanguagePassed,
    explanationLanguageLocalized,
    forcedLocalizedGenerationPassed,
    forcedUnsupportedNonEnglishBlocked,
    randomHiSelectableOnly,
    randomPaSelectableOnly,
    localizedCpIds,
    totalEnglishQuestionLanguages: englishIds.length,
    totalHindiQuestionLanguages: hiIds.length,
    totalPunjabiQuestionLanguages: paIds.length,
    coverageAudit,
    randomSelectionCounts,
    forcedSamples,
  };

  console.log(JSON.stringify(summary, null, 2));
}

function generateCoverageAuditSummary() {
  const audit = generatePct001CoverageAudit(500, "en").audit;
  return {
    generationFailures: audit.generationFailures,
    validationFailures: audit.validationFailures,
    renderFailures: audit.renderFailures,
    solverFailures: audit.solverFailures,
    unusedQlIds: audit.unusedQlIds.length,
    unusedEsIds: audit.unusedEsIds.length,
  };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
