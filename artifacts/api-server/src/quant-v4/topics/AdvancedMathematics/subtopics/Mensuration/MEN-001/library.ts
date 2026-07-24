import questionLanguage from "./question-language.en.json";
import taskRegistry from "./task-registry.library.json";
import {
  MEN_001_ACTIVE_CP_IDS,
  MEN_001_PACKAGE_ID,
  type Men001ActiveCanonicalProblemId,
  type Men001QuestionLanguageEntry,
  type Men001TaskRegistryEntry,
} from "./types";

const questionEntries = (questionLanguage.entries as Men001QuestionLanguageEntry[]).filter(
  (entry) => entry.active,
);
const registryEntries = taskRegistry.entries as Men001TaskRegistryEntry[];
const registryByQlId = new Map(registryEntries.map((entry) => [entry.qlId, entry]));

function sorted(values: readonly string[]) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function sameStrings(left: readonly string[], right: readonly string[]) {
  return JSON.stringify(sorted(left)) === JSON.stringify(sorted(right));
}

export function extractMen001Placeholders(template: string) {
  return [...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!);
}

export function getMen001QuestionEntries() {
  return [...questionEntries];
}

export function getMen001QuestionEntry(qlId: string) {
  const entry = questionEntries.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown active MEN-001 QL: ${qlId}`);
  return entry;
}

export function getMen001RegistryEntry(qlId: string) {
  const entry = registryByQlId.get(qlId);
  if (!entry) throw new Error(`Missing MEN-001 registry entry: ${qlId}`);
  return entry;
}

export function getMen001QuestionLanguageIds() {
  return questionEntries.map((entry) => entry.qlId);
}

export function getMen001ActiveCanonicalProblemIds(): Men001ActiveCanonicalProblemId[] {
  return [...MEN_001_ACTIVE_CP_IDS];
}

export function renderMen001Template(
  template: string,
  variables: Record<string, string | number>,
) {
  const unresolved: string[] = [];
  const rendered = template.replace(/\{([A-Za-z0-9_]+)\}/g, (_, key: string) => {
    if (key in variables) return String(variables[key]);
    unresolved.push(key);
    return `{${key}}`;
  });
  if (unresolved.length > 0) {
    throw new Error(`Unresolved MEN-001 placeholders: ${unresolved.join(", ")}`);
  }
  return rendered;
}

export function validateMen001Libraries() {
  const failures: string[] = [];
  const qlIds = questionEntries.map((entry) => entry.qlId);
  const registryQlIds = registryEntries.map((entry) => entry.qlId);

  if (questionLanguage.packageId !== MEN_001_PACKAGE_ID) {
    failures.push(`Question-language packageId must be ${MEN_001_PACKAGE_ID}.`);
  }
  if (taskRegistry.packageId !== MEN_001_PACKAGE_ID) {
    failures.push(`Task-registry packageId must be ${MEN_001_PACKAGE_ID}.`);
  }
  if (new Set(qlIds).size !== qlIds.length) failures.push("Duplicate active QL IDs detected.");
  if (new Set(registryQlIds).size !== registryQlIds.length) {
    failures.push("Duplicate task-registry QL IDs detected.");
  }
  if (!sameStrings(qlIds, registryQlIds)) {
    failures.push("Question-language and task-registry QL sets differ.");
  }

  for (const entry of questionEntries) {
    const registry = registryByQlId.get(entry.qlId);
    if (!registry) continue;
    if (entry.cpId !== registry.cpId) failures.push(`${entry.qlId}: CP mismatch.`);
    if (entry.solveMode !== registry.solveMode) failures.push(`${entry.qlId}: solve-mode mismatch.`);
    if (entry.answerDimension !== registry.answerDimension) {
      failures.push(`${entry.qlId}: answer-dimension mismatch.`);
    }
    if (!sameStrings(entry.requiredVariables, registry.requiredVariables)) {
      failures.push(`${entry.qlId}: required-variable contract mismatch.`);
    }
    const placeholders = extractMen001Placeholders(entry.template);
    if (!sameStrings(placeholders, entry.requiredVariables)) {
      failures.push(`${entry.qlId}: template placeholders do not match required variables.`);
    }
    if (!MEN_001_ACTIVE_CP_IDS.includes(entry.cpId as Men001ActiveCanonicalProblemId)) {
      failures.push(`${entry.qlId}: inactive CP exposed during runtime proof.`);
    }
  }

  return { valid: failures.length === 0, failures };
}
