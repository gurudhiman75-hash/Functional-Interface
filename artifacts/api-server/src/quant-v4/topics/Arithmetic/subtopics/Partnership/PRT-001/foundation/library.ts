import questionLanguageSource from "../question-language.en.json" assert { type: "json" };
import questionLanguageHiSource from "../question-language.hi.json" assert { type: "json" };
import questionLanguagePaSource from "../question-language.pa.json" assert { type: "json" };
import questionLanguageE1Source from "../question-language.e1.en.json" assert { type: "json" };
import questionLanguageE1HiSource from "../question-language.e1.hi.json" assert { type: "json" };
import questionLanguageE1PaSource from "../question-language.e1.pa.json" assert { type: "json" };
import questionLanguageE2Source from "../question-language.e2.en.json" assert { type: "json" };
import questionLanguageE2HiSource from "../question-language.e2.hi.json" assert { type: "json" };
import questionLanguageE2PaSource from "../question-language.e2.pa.json" assert { type: "json" };
import questionLanguageE3ASource from "../question-language.e3a.en.json" assert { type: "json" };
import questionLanguageE3AHiSource from "../question-language.e3a.hi.json" assert { type: "json" };
import questionLanguageE3APaSource from "../question-language.e3a.pa.json" assert { type: "json" };
import questionLanguageE3BSource from "../question-language.e3b.en.json" assert { type: "json" };
import questionLanguageE3BHiSource from "../question-language.e3b.hi.json" assert { type: "json" };
import questionLanguageE3BPaSource from "../question-language.e3b.pa.json" assert { type: "json" };
import questionLanguageE4Source from "../question-language.e4.en.json" assert { type: "json" };
import questionLanguageE4HiSource from "../question-language.e4.hi.json" assert { type: "json" };
import questionLanguageE4PaSource from "../question-language.e4.pa.json" assert { type: "json" };
import questionLanguageE5Source from "../question-language.e5.en.json" assert { type: "json" };
import questionLanguageE5HiSource from "../question-language.e5.hi.json" assert { type: "json" };
import questionLanguageE5PaSource from "../question-language.e5.pa.json" assert { type: "json" };
import taskRegistrySource from "../task-registry.library.json" assert { type: "json" };
import taskRegistryE1Source from "../task-registry.e1.library.json" assert { type: "json" };
import taskRegistryE2Source from "../task-registry.e2.library.json" assert { type: "json" };
import taskRegistryE3ASource from "../task-registry.e3.library.json" assert { type: "json" };
import taskRegistryE3BSource from "../task-registry.e3b.library.json" assert { type: "json" };
import taskRegistryE4Source from "../task-registry.e4.library.json" assert { type: "json" };
import taskRegistryE5Source from "../task-registry.e5.library.json" assert { type: "json" };
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

function mergeQuestionLanguages(base: QuestionLanguageSource, ...overlays: QuestionLanguageSource[]): QuestionLanguageSource {
  let current = base;
  for (const overlay of overlays) {
    if (current.language !== overlay.language) throw new Error(`PRT-001 language overlay mismatch: ${current.language}/${overlay.language}`);
    current = { language: current.language, status: `${current.status}+${overlay.status}`, entries: { ...current.entries, ...overlay.entries } };
  }
  return current;
}

const questionLanguages = {
  en: mergeQuestionLanguages(questionLanguageSource as QuestionLanguageSource, questionLanguageE1Source as QuestionLanguageSource, questionLanguageE2Source as QuestionLanguageSource, questionLanguageE3ASource as QuestionLanguageSource, questionLanguageE3BSource as QuestionLanguageSource, questionLanguageE4Source as QuestionLanguageSource, questionLanguageE5Source as QuestionLanguageSource),
  hi: mergeQuestionLanguages(questionLanguageHiSource as QuestionLanguageSource, questionLanguageE1HiSource as QuestionLanguageSource, questionLanguageE2HiSource as QuestionLanguageSource, questionLanguageE3AHiSource as QuestionLanguageSource, questionLanguageE3BHiSource as QuestionLanguageSource, questionLanguageE4HiSource as QuestionLanguageSource, questionLanguageE5HiSource as QuestionLanguageSource),
  pa: mergeQuestionLanguages(questionLanguagePaSource as QuestionLanguageSource, questionLanguageE1PaSource as QuestionLanguageSource, questionLanguageE2PaSource as QuestionLanguageSource, questionLanguageE3APaSource as QuestionLanguageSource, questionLanguageE3BPaSource as QuestionLanguageSource, questionLanguageE4PaSource as QuestionLanguageSource, questionLanguageE5PaSource as QuestionLanguageSource),
};

const registries = [
  taskRegistrySource as TaskRegistrySource,
  taskRegistryE1Source as TaskRegistrySource,
  taskRegistryE2Source as TaskRegistrySource,
  taskRegistryE3ASource as TaskRegistrySource,
  taskRegistryE3BSource as TaskRegistrySource,
  taskRegistryE4Source as TaskRegistrySource,
  taskRegistryE5Source as TaskRegistrySource,
];
const [baseTaskRegistry, ...overlayRegistries] = registries;
if (!baseTaskRegistry) throw new Error("PRT-001 base task registry is missing");
for (const overlay of overlayRegistries) {
  if (baseTaskRegistry.chapterId !== overlay.chapterId || baseTaskRegistry.ownership !== overlay.ownership) throw new Error("PRT-001 task registry overlay metadata mismatch");
}
const taskRegistry: TaskRegistrySource = {
  chapterId: baseTaskRegistry.chapterId,
  ownership: baseTaskRegistry.ownership,
  status: registries.map((item) => item.status).join("+"),
  entries: Object.assign({}, ...registries.map((item) => item.entries)),
};

export function extractPrt001Placeholders(template: string): string[] {
  return [...template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

export function renderPrt001Template(template: string, variables: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
    const value = variables[key];
    if (value === undefined) throw new Error(`missing template variable: ${key}`);
    return String(value);
  });
}

export function getPrt001QuestionLanguageIds(): string[] {
  return Object.keys(taskRegistry.entries).filter((questionLanguageId) => taskRegistry.entries[questionLanguageId]!.active).sort();
}

export function getPrt001TaskEntries(): Array<{ questionLanguageId: string; entry: Prt001TaskRegistryEntry }> {
  return getPrt001QuestionLanguageIds().map((questionLanguageId) => ({ questionLanguageId, entry: getPrt001TaskEntry(questionLanguageId) }));
}

export function getPrt001TaskEntry(questionLanguageId: string): Prt001TaskRegistryEntry {
  const entry = taskRegistry.entries[questionLanguageId];
  if (!entry?.active) throw new Error(`unknown or inactive PRT-001 QL: ${questionLanguageId}`);
  return entry;
}

export function getPrt001QuestionTemplate(questionLanguageId: string, language: Prt001Language = "en"): string {
  const template = questionLanguages[language].entries[questionLanguageId];
  if (!template) throw new Error(`missing ${language} PRT-001 QL: ${questionLanguageId}`);
  return template;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  return leftSet.size === rightSet.size && [...leftSet].every((value) => rightSet.has(value));
}

export function validatePrt001PilotLibraries(): string[] {
  const failures: string[] = [];
  if (taskRegistry.chapterId !== "PRT-001") failures.push("task registry chapter mismatch");
  if (taskRegistry.ownership !== "HUMAN_OWNED") failures.push("task registry must be human-owned");
  const registryIds = Object.keys(taskRegistry.entries).sort();
  for (const language of ["en", "hi", "pa"] as const) {
    const library = questionLanguages[language];
    if (library.language !== language) failures.push(`${language} library language mismatch`);
    const questionIds = Object.keys(library.entries).sort();
    if (!sameStrings(registryIds, questionIds)) failures.push(`task registry and ${language} QL IDs differ`);
    for (const questionLanguageId of registryIds) {
      const entry = taskRegistry.entries[questionLanguageId]!;
      const template = library.entries[questionLanguageId];
      if (!template) continue;
      const placeholders = extractPrt001Placeholders(template);
      if (!sameStrings(placeholders, entry.requiredVariables)) failures.push(`${language}:${questionLanguageId} required variables do not match its template`);
    }
  }
  return failures;
}