import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createQuestionExport } from "../../../../../../../../examtree/src/lib/export-engine";
import { generateQuestion } from "../../../../../generation-engine";
import { getSelectableQuestionLanguageIds } from "./foundation/parameter-generator";
import {
  extractPlaceholders,
  getTaskRegistryEntry,
  runPct002Pipeline,
  validatePct002Libraries,
} from "./index";
import type { Pct002CanonicalProblemId, Pct002Language } from "./types";

const PACKAGE_DIR = resolve(
  "src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-002",
);

const PILOT_LANGUAGES: readonly Pct002Language[] = ["hi", "pa"];
const RANDOM_SMOKE_SEEDS = [
  "random-01",
  "random-02",
  "random-03",
  "random-04",
  "random-05",
  "random-06",
] as const;

type AuditCase = {
  cpId: Pct002CanonicalProblemId;
  qlIds: string[];
};

type AuditSummary = {
  jsonParsePassed: boolean;
  forcedPilotAuditPassed: boolean;
  placeholderParityPassed: boolean;
  requiredPlaceholdersPassed: boolean;
  unresolvedPlaceholderCount: number;
  englishLeakageCount: number;
  explanationEnglishLeakageCount: number;
  metadataLanguagePassed: boolean;
  explanationLanguageLocalized: boolean;
  runtimeSupportsHiPa: boolean;
  forcedUnsupportedNonEnglishBlocked: boolean;
  randomHiSelectableOnly: boolean;
  randomPaSelectableOnly: boolean;
  sharedQuestionLanguageCount: number;
  totalEnglishQuestionLanguages: number;
  totalHindiQuestionLanguages: number;
  totalPunjabiQuestionLanguages: number;
  randomSelectionCounts: Record<"hi" | "pa", Record<string, number>>;
  forcedSamples: Array<{
    cpId: Pct002CanonicalProblemId;
    language: Pct002Language;
    questionLanguageId: string;
    stem: string;
    explanationPreview: string[];
    exportLanguage: unknown;
  }>;
  randomSamples: Array<{
    cpId: Pct002CanonicalProblemId;
    language: Pct002Language;
    seed: string;
    questionLanguageId: string;
    stem: string;
    exportLanguage: unknown;
  }>;
};

function loadJson(filename: string) {
  return JSON.parse(readFileSync(resolve(PACKAGE_DIR, filename), "utf8"));
}

function countQuestionLanguages(doc: any) {
  return Object.values(doc ?? {}).reduce((count, cp: any) => {
    return count + Object.keys(cp?.families ?? {}).length;
  }, 0);
}

function getAuditCases(questionLanguageEn: any): AuditCase[] {
  return Object.entries(questionLanguageEn).map(([cpId, cp]: [string, any]) => ({
    cpId: cpId as Pct002CanonicalProblemId,
    qlIds: Object.keys(cp?.families ?? {}),
  }));
}

function detectEnglishLeakage(text: string) {
  const sanitized = text
    .replace(/Rs\./g, "")
    .replace(/\\[A-Za-z]+/g, "")
    .replace(/[0-9%{}.,:;!?()\-+/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return /[A-Za-z]{2,}/.test(sanitized);
}

function explanationHasEnglishLeakage(lines: string[]) {
  return lines.some((line) => detectEnglishLeakage(line));
}

async function exportLanguageForQuestion(
  cpId: Pct002CanonicalProblemId,
  language: Pct002Language,
  seed: string,
  questionLanguageId?: string,
) {
  const generated = await generateQuestion({
    packageId: "PCT-002",
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

  const auditCases = getAuditCases(questionLanguageEn);
  const hiLocalizedIds = new Set(
    auditCases.flatMap(({ cpId, qlIds }) =>
      qlIds.filter((qlId) => Boolean(questionLanguageHi[cpId]?.families?.[qlId])),
    ),
  );
  const paLocalizedIds = new Set(
    auditCases.flatMap(({ cpId, qlIds }) =>
      qlIds.filter((qlId) => Boolean(questionLanguagePa[cpId]?.families?.[qlId])),
    ),
  );

  const libraryValidation = validatePct002Libraries();
  assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

  let placeholderParityPassed = true;
  let requiredPlaceholdersPassed = true;
  let unresolvedPlaceholderCount = 0;
  let englishLeakageCount = 0;
  let explanationEnglishLeakageCount = 0;
  let metadataLanguagePassed = true;
  let explanationLanguageLocalized = true;
  let forcedUnsupportedNonEnglishBlocked = true;
  let randomHiSelectableOnly = true;
  let randomPaSelectableOnly = true;
  const forcedSamples: AuditSummary["forcedSamples"] = [];
  const randomSamples: AuditSummary["randomSamples"] = [];
  const randomSelectionCounts: AuditSummary["randomSelectionCounts"] = {
    hi: {},
    pa: {},
  };

  for (const { cpId, qlIds } of auditCases) {
    const hiCaseIds = new Set(Object.keys(questionLanguageHi[cpId]?.families ?? {}));
    const paCaseIds = new Set(Object.keys(questionLanguagePa[cpId]?.families ?? {}));

    for (const qlId of qlIds) {
      const enTemplate = questionLanguageEn[cpId]?.families?.[qlId]?.template;
      const hiTemplate = questionLanguageHi[cpId]?.families?.[qlId]?.template;
      const paTemplate = questionLanguagePa[cpId]?.families?.[qlId]?.template;

      const enPlaceholders = new Set(extractPlaceholders(String(enTemplate ?? "")));
      const hiPlaceholders = new Set(extractPlaceholders(String(hiTemplate ?? "")));
      const paPlaceholders = new Set(extractPlaceholders(String(paTemplate ?? "")));
      const requiredVariables = getTaskRegistryEntry(cpId, qlId).requiredVariables;

      const sameSet = (left: Set<string>, right: Set<string>) =>
        left.size === right.size && [...left].every((value) => right.has(value));

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

      if (!hiCaseIds.has(qlId) || !paCaseIds.has(qlId)) {
        throw new Error(`Missing localized template coverage for ${cpId}/${qlId}.`);
      }

      for (const language of PILOT_LANGUAGES) {
        const pkg = runPct002Pipeline(cpId, {
          language,
          questionLanguageId: qlId,
          seed: `pct-002-multilingual-full:${language}:${qlId}`,
        });

        if (pkg.stem.includes("{")) {
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
          `pct-002-multilingual-export:${language}:${qlId}`,
          qlId,
        );
        if (exportedLanguage !== language) {
          metadataLanguagePassed = false;
        }

        forcedSamples.push({
          cpId,
          language,
          questionLanguageId: qlId,
          stem: pkg.stem,
          explanationPreview: pkg.explanation.lines.slice(0, 4),
          exportLanguage: exportedLanguage,
        });
      }
    }

    for (const language of PILOT_LANGUAGES) {
      const localizedSet = language === "hi" ? hiCaseIds : paCaseIds;
      const selectableIds = getSelectableQuestionLanguageIds(cpId, language);
      if (selectableIds.some((qlId) => !localizedSet.has(qlId))) {
        if (language === "hi") {
          randomHiSelectableOnly = false;
        } else {
          randomPaSelectableOnly = false;
        }
      }
    }
  }

  for (const language of PILOT_LANGUAGES) {
    try {
      runPct002Pipeline("PCT-CP-001", {
        language,
        questionLanguageId: "PCT-QL-151",
        seed: `pct-002-non-english-block:${language}`,
      });
      forcedUnsupportedNonEnglishBlocked = false;
    } catch (error) {
      void error;
    }

    for (const { cpId } of auditCases) {
      const localizedSet = new Set(
        Object.keys(
          (language === "hi" ? questionLanguageHi : questionLanguagePa)[cpId]?.families ?? {},
        ),
      );

      for (const seed of RANDOM_SMOKE_SEEDS) {
        const pkg = runPct002Pipeline(cpId, {
          language,
          seed: `pct-002-random:${language}:${cpId}:${seed}`,
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

        if (pkg.stem.includes("{")) {
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
          `pct-002-random-export:${language}:${cpId}:${seed}`,
        );
        if (exportedLanguage !== language) {
          metadataLanguagePassed = false;
        }

        randomSamples.push({
          cpId,
          language,
          seed,
          questionLanguageId: pkg.questionLanguageId,
          stem: pkg.stem,
          exportLanguage: exportedLanguage,
        });
      }
    }
  }

  const summary: AuditSummary = {
    jsonParsePassed: true,
    forcedPilotAuditPassed: true,
    placeholderParityPassed,
    requiredPlaceholdersPassed,
    unresolvedPlaceholderCount,
    englishLeakageCount,
    explanationEnglishLeakageCount,
    metadataLanguagePassed,
    explanationLanguageLocalized,
    runtimeSupportsHiPa: true,
    forcedUnsupportedNonEnglishBlocked,
    randomHiSelectableOnly,
    randomPaSelectableOnly,
    sharedQuestionLanguageCount: hiLocalizedIds.size,
    totalEnglishQuestionLanguages: countQuestionLanguages(questionLanguageEn),
    totalHindiQuestionLanguages: countQuestionLanguages(questionLanguageHi),
    totalPunjabiQuestionLanguages: countQuestionLanguages(questionLanguagePa),
    randomSelectionCounts,
    forcedSamples,
    randomSamples,
  };

  summary.forcedPilotAuditPassed =
    summary.placeholderParityPassed &&
    summary.requiredPlaceholdersPassed &&
    summary.unresolvedPlaceholderCount === 0 &&
    summary.englishLeakageCount === 0 &&
    summary.explanationEnglishLeakageCount === 0 &&
    summary.metadataLanguagePassed &&
    summary.sharedQuestionLanguageCount === summary.totalEnglishQuestionLanguages &&
    summary.totalHindiQuestionLanguages === summary.totalEnglishQuestionLanguages &&
    summary.totalPunjabiQuestionLanguages === summary.totalEnglishQuestionLanguages;

  assert.equal(summary.placeholderParityPassed, true, "Placeholder parity failed.");
  assert.equal(summary.requiredPlaceholdersPassed, true, "Required placeholder coverage failed.");
  assert.equal(summary.unresolvedPlaceholderCount, 0, "Rendered hi/pa content still contains unresolved placeholders.");
  assert.equal(summary.englishLeakageCount, 0, "Rendered hi/pa stems still contain English leakage.");
  assert.equal(summary.explanationEnglishLeakageCount, 0, "Rendered hi/pa explanations still contain English leakage.");
  assert.equal(summary.explanationLanguageLocalized, true, "PCT-002 hi/pa explanations are not localized.");
  assert.equal(summary.metadataLanguagePassed, true, "Export metadata.language does not match hi/pa.");
  assert.equal(summary.randomHiSelectableOnly, true, "Random hi selection escaped localized coverage.");
  assert.equal(summary.randomPaSelectableOnly, true, "Random pa selection escaped localized coverage.");
  assert.equal(
    summary.forcedUnsupportedNonEnglishBlocked,
    true,
    "Forced non-English generation for unsupported QLs was not blocked.",
  );
  assert.equal(
    summary.sharedQuestionLanguageCount,
    summary.totalEnglishQuestionLanguages,
    "Localized hi coverage does not match English coverage.",
  );
  assert.equal(
    summary.totalPunjabiQuestionLanguages,
    summary.totalEnglishQuestionLanguages,
    "Localized pa coverage does not match English coverage.",
  );

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
