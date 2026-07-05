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

const LOCALIZED_CP_IDS = [
  "PCT-CP-001",
  "PCT-CP-002",
  "PCT-CP-003",
  "PCT-CP-004",
  "PCT-CP-005",
  "PCT-CP-006",
] as const;
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

  let totalEnglishQuestionLanguages = 0;
  let totalHindiQuestionLanguages = 0;
  let totalPunjabiQuestionLanguages = 0;

  for (const cpId of LOCALIZED_CP_IDS) {
    const englishIds = Object.keys(questionLanguageEn[cpId]?.families ?? {});
    const hiIds = Object.keys(questionLanguageHi[cpId]?.families ?? {});
    const paIds = Object.keys(questionLanguagePa[cpId]?.families ?? {});

    totalEnglishQuestionLanguages += englishIds.length;
    totalHindiQuestionLanguages += hiIds.length;
    totalPunjabiQuestionLanguages += paIds.length;

    assert.equal(
      hiIds.length,
      englishIds.length,
      `Hindi ${cpId} coverage does not match English.`,
    );
    assert.equal(
      paIds.length,
      englishIds.length,
      `Punjabi ${cpId} coverage does not match English.`,
    );

    for (const qlId of englishIds) {
      const enTemplate = questionLanguageEn[cpId]?.families?.[qlId]?.template;
      const hiTemplate = questionLanguageHi[cpId]?.families?.[qlId]?.template;
      const paTemplate = questionLanguagePa[cpId]?.families?.[qlId]?.template;

      const enPlaceholders = new Set(extractPlaceholders(String(enTemplate ?? "")));
      const hiPlaceholders = new Set(extractPlaceholders(String(hiTemplate ?? "")));
      const paPlaceholders = new Set(extractPlaceholders(String(paTemplate ?? "")));
      const requiredVariables = getRequiredVariables(cpId, qlId);

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
        const pkg = runPct001Pipeline(cpId, {
          language,
          questionLanguageId: qlId,
          seed: `pct-001-multilingual:${language}:${cpId}:${qlId}`,
        });

        if (
          hasUnresolvedPlaceholder(pkg.stem) ||
          pkg.explanation.lines.some((line) => hasUnresolvedPlaceholder(line))
        ) {
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
          cpId,
          language,
          `pct-001-multilingual-export:${language}:${cpId}:${qlId}`,
          qlId,
        );
        if (exportedLanguage !== language) {
          metadataLanguagePassed = false;
        }

        if (forcedSamples.length < 12) {
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
  }

  try {
    runPct001Pipeline("PCT-CP-006", {
      language: "hi",
      questionLanguageId: "PCT-QL-999",
      seed: "pct-001-non-english-block:hi",
    });
    forcedUnsupportedNonEnglishBlocked = false;
  } catch {
    // expected
  }

  try {
    runPct001Pipeline("PCT-CP-006", {
      language: "pa",
      questionLanguageId: "PCT-QL-999",
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
    for (const cpId of LOCALIZED_CP_IDS) {
      const localizedIds = Object.keys(
        (language === "hi" ? questionLanguageHi : questionLanguagePa)[cpId]?.families ?? {},
      );
      const localizedSet = new Set(localizedIds);
      const selectableIds = getSelectableQuestionLanguageIds(cpId, language);

      if (selectableIds.some((qlId) => !localizedSet.has(qlId))) {
        if (language === "hi") {
          randomHiSelectableOnly = false;
        } else {
          randomPaSelectableOnly = false;
        }
      }

      for (const seed of RANDOM_SMOKE_SEEDS) {
        const pkg = runPct001Pipeline(cpId, {
          language,
          seed: `pct-001-random:${language}:${cpId}:${seed}`,
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

        if (
          hasUnresolvedPlaceholder(pkg.stem) ||
          pkg.explanation.lines.some((line) => hasUnresolvedPlaceholder(line))
        ) {
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
          cpId,
          language,
          `pct-001-random-export:${language}:${cpId}:${seed}`,
        );
        if (exportedLanguage !== language) {
          metadataLanguagePassed = false;
        }
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
    totalEnglishQuestionLanguages,
    totalHindiQuestionLanguages,
    totalPunjabiQuestionLanguages,
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
