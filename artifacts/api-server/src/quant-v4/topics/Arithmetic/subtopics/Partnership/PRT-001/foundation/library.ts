import questionLanguageSource from "../question-language.en.json" assert { type: "json" };
import questionLanguageHiSource from "../question-language.hi.json" assert { type: "json" };
import questionLanguagePaSource from "../question-language.pa.json" assert { type: "json" };
import taskRegistrySource from "../task-registry.library.json" assert { type: "json" };
import type { Prt001Language, Prt001TaskRegistryEntry } from "./types";

interface QuestionLanguageSource {
  language: Prt001Language;
  status: string;
  entries: Record<string, string>;
}

interface TaskRegistrySource {
  chapterId: "PRT-001";
  ownership: "HUMAN_OWNED";
  status: string;
  entries: Record<string, Prt001TaskRegistryEntry>;
}

const questionLanguages = {
  en: questionLanguageSource as QuestionLanguageSource,
  hi: questionLanguageHiSource as QuestionLanguageSource,
  pa: questionLanguagePaSource as QuestionLanguageSource,
};
const taskRegistry = taskRegistrySource as TaskRegistrySource;

export function extractPrt001Placeholders(template: string): string[] {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderPrt001Template(
  template: string,
  variables: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = variables[key];
    if (value === undefined)
      throw new Error(`missing template variable: ${key}`);
    return String(value);
  });
}

export function getPrt001QuestionLanguageIds(): string[] {
  return Object.keys(taskRegistry.entries)
    .filter(
      (questionLanguageId) => taskRegistry.entries[questionLanguageId]!.active,
    )
    .sort();
}

export function getPrt001TaskEntries(): Array<{
  questionLanguageId: string;
  entry: Prt001TaskRegistryEntry;
}> {
  return getPrt001QuestionLanguageIds().map((questionLanguageId) => ({
    questionLanguageId,
    entry: getPrt001TaskEntry(questionLanguageId),
  }));
}

export function getPrt001TaskEntry(
  questionLanguageId: string,
): Prt001TaskRegistryEntry {
  const entry = taskRegistry.entries[questionLanguageId];
  if (!entry?.active)
    throw new Error(`unknown or inactive PRT-001 QL: ${questionLanguageId}`);
  return entry;
}

export function getPrt001QuestionTemplate(
  questionLanguageId: string,
  language: Prt001Language = "en",
): string {
  const template = questionLanguages[language].entries[questionLanguageId];
  if (!template)
    throw new Error(`missing ${language} PRT-001 QL: ${questionLanguageId}`);
  return template;
}

function sameStrings(
  left: readonly string[],
  right: readonly string[],
): boolean {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return (
    leftSet.size === rightSet.size &&
    [...leftSet].every((value) => rightSet.has(value))
  );
}

export function validatePrt001PilotLibraries(): string[] {
  const failures: string[] = [];
  if (taskRegistry.chapterId !== "PRT-001")
    failures.push("task registry chapter mismatch");
  if (taskRegistry.ownership !== "HUMAN_OWNED")
    failures.push("task registry must be human-owned");
  const registryIds = Object.keys(taskRegistry.entries).sort();
  for (const language of ["en", "hi", "pa"] as const) {
    const library = questionLanguages[language];
    if (library.language !== language)
      failures.push(`${language} library language mismatch`);
    const questionIds = Object.keys(library.entries).sort();
    if (!sameStrings(registryIds, questionIds))
      failures.push(`task registry and ${language} QL IDs differ`);
    for (const questionLanguageId of registryIds) {
      const entry = taskRegistry.entries[questionLanguageId]!;
      const template = library.entries[questionLanguageId];
      if (!template) continue;
      const placeholders = extractPrt001Placeholders(template);
      if (!sameStrings(placeholders, entry.requiredVariables)) {
        failures.push(
          `${language}:${questionLanguageId} required variables do not match its template`,
        );
      }
    }
  }
  return failures;
}
