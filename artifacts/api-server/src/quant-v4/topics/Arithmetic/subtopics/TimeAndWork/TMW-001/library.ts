import questionLanguageCp001 from "./question-language.cp001.en.json";
import taskRegistryCp001 from "./task-registry.cp001.library.json";
import { hasTmwCp001DistractorStrategy } from "./distractor-strategies.cp001";
import { getTmwCp001SolveModeDefinition, getTmwCp001SolveModeIds } from "./solve-mode-registry.cp001";
import {
  TMW_001_PACKAGE_ID,
  TMW_CP_001_ID,
  type TmwCp001QuestionLanguageEntry,
  type TmwCp001TaskRegistryEntry,
} from "./types";

const questionEntries = (questionLanguageCp001.entries as TmwCp001QuestionLanguageEntry[])
  .filter((entry) => entry.active);
const registryEntries = taskRegistryCp001.entries as TmwCp001TaskRegistryEntry[];
const questionById = new Map(questionEntries.map((entry) => [entry.qlId, entry]));
const registryById = new Map(registryEntries.map((entry) => [entry.qlId, entry]));

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function sameStringSets(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify(sortedUnique(left)) === JSON.stringify(sortedUnique(right));
}

export function extractTmwPlaceholders(template: string): string[] {
  return [...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!);
}

export function normaliseTmwTemplate(template: string): string {
  return template
    .toLowerCase()
    .replace(/\{[A-Za-z0-9_]+\}/g, "{value}")
    .replace(/[^a-z0-9{}%/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getTmwCp001QuestionEntries(): TmwCp001QuestionLanguageEntry[] {
  return [...questionEntries];
}

export function getTmwCp001QuestionEntry(qlId: string): TmwCp001QuestionLanguageEntry {
  const entry = questionById.get(qlId);
  if (!entry) throw new Error(`Unknown active TMW-CP-001 QL: ${qlId}`);
  return entry;
}

export function getTmwCp001RegistryEntry(qlId: string): TmwCp001TaskRegistryEntry {
  const entry = registryById.get(qlId);
  if (!entry) throw new Error(`Missing TMW-CP-001 registry entry: ${qlId}`);
  return entry;
}

export function getTmwCp001QuestionLanguageIds(): string[] {
  return questionEntries.map((entry) => entry.qlId);
}

export function renderTmwTemplate(
  template: string,
  variables: Record<string, string | number>,
): string {
  const unresolved: string[] = [];
  const rendered = template.replace(/\{([A-Za-z0-9_]+)\}/g, (_, key: string) => {
    if (key in variables) return String(variables[key]);
    unresolved.push(key);
    return `{${key}}`;
  });
  if (unresolved.length > 0) {
    throw new Error(`Unresolved TMW-001 placeholders: ${unresolved.join(", ")}`);
  }
  return rendered;
}

export function validateTmwCp001Libraries(): { valid: boolean; failures: string[] } {
  const failures: string[] = [];
  const qlIds = questionEntries.map((entry) => entry.qlId);
  const registryQlIds = registryEntries.map((entry) => entry.qlId);

  if (questionLanguageCp001.packageId !== TMW_001_PACKAGE_ID) {
    failures.push(`Question-language packageId must be ${TMW_001_PACKAGE_ID}.`);
  }
  if (questionLanguageCp001.language !== "en") failures.push("CP-001 pilot must be English-first.");
  if (taskRegistryCp001.packageId !== TMW_001_PACKAGE_ID) {
    failures.push(`Task-registry packageId must be ${TMW_001_PACKAGE_ID}.`);
  }
  if (taskRegistryCp001.ownership !== "HUMAN_OWNED") {
    failures.push("Task-registry ownership must remain HUMAN_OWNED.");
  }
  if (new Set(qlIds).size !== qlIds.length) failures.push("Duplicate active QL IDs detected.");
  if (new Set(registryQlIds).size !== registryQlIds.length) failures.push("Duplicate task-registry QL IDs detected.");
  if (!sameStringSets(qlIds, registryQlIds)) failures.push("Question-language and task-registry QL sets differ.");

  const solveModes = questionEntries.map((entry) => entry.solveMode);
  if (!sameStringSets(solveModes, getTmwCp001SolveModeIds())) {
    failures.push("Question-language and solve-mode registry are not exhaustive mirrors.");
  }

  const normalisedTemplates = questionEntries.map((entry) => normaliseTmwTemplate(entry.template));
  if (new Set(normalisedTemplates).size !== normalisedTemplates.length) {
    failures.push("Normalised English template duplicates detected.");
  }

  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    if (!questionEntries.some((entry) => entry.difficulty === difficulty)) {
      failures.push(`TMW-CP-001 is missing ${difficulty} QL coverage.`);
    }
  }

  for (const entry of questionEntries) {
    if (entry.cpId !== TMW_CP_001_ID) failures.push(`${entry.qlId}: wrong CP ownership.`);
    if (!/^TMW-001-QL-\d{3,}$/.test(entry.qlId)) failures.push(`${entry.qlId}: invalid QL identity.`);
    if (entry.template.trim().length < 35) failures.push(`${entry.qlId}: template is too short.`);
    if (!entry.template.trim().endsWith("?")) failures.push(`${entry.qlId}: template must end with a question mark.`);
    if (!sameStringSets(extractTmwPlaceholders(entry.template), entry.requiredVariables)) {
      failures.push(`${entry.qlId}: placeholders do not match required variables.`);
    }
    if (entry.distractorStrategyIds.length !== 3 || new Set(entry.distractorStrategyIds).size !== 3) {
      failures.push(`${entry.qlId}: exactly three unique distractor strategies are required.`);
    }
    for (const strategyId of entry.distractorStrategyIds) {
      if (!hasTmwCp001DistractorStrategy(strategyId)) {
        failures.push(`${entry.qlId}: unknown distractor strategy ${strategyId}.`);
      }
    }

    const registry = registryById.get(entry.qlId);
    if (!registry) continue;
    if (registry.cpId !== entry.cpId) failures.push(`${entry.qlId}: CP mismatch.`);
    if (registry.solveMode !== entry.solveMode) failures.push(`${entry.qlId}: solve-mode mismatch.`);
    if (registry.answerType !== entry.answerType) failures.push(`${entry.qlId}: answer-type mismatch.`);
    if (!sameStringSets(registry.requiredVariables, entry.requiredVariables)) {
      failures.push(`${entry.qlId}: required-variable mismatch.`);
    }
    if (registry.formulaStrategyId !== entry.formulaStrategyId) failures.push(`${entry.qlId}: formula-strategy mismatch.`);
    if (registry.explanationStrategyId !== entry.explanationStrategyId) failures.push(`${entry.qlId}: explanation-strategy mismatch.`);
    if (!sameStringSets(registry.distractorStrategyIds, entry.distractorStrategyIds)) {
      failures.push(`${entry.qlId}: distractor-strategy mismatch.`);
    }
    if (registry.publiclyPublishable !== false) failures.push(`${entry.qlId}: runtime QL must remain non-publishable.`);

    const solveDefinition = getTmwCp001SolveModeDefinition(entry.solveMode);
    if (solveDefinition.ruleId !== registry.ruleId) failures.push(`${entry.qlId}: rule mismatch.`);
    if (solveDefinition.formulaStrategyId !== registry.formulaStrategyId) failures.push(`${entry.qlId}: formula definition mismatch.`);
    if (solveDefinition.explanationStrategyId !== registry.explanationStrategyId) failures.push(`${entry.qlId}: explanation definition mismatch.`);
    if (solveDefinition.independentVerifierId !== registry.independentVerifierId) failures.push(`${entry.qlId}: verifier definition mismatch.`);
  }

  return { valid: failures.length === 0, failures };
}
