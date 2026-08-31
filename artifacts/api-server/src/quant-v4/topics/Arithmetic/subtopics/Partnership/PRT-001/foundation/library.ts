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
import questionLanguageE8Source from "../question-language.e8.en.json" assert { type: "json" };
import questionLanguageE8HiSource from "../question-language.e8.hi.json" assert { type: "json" };
import questionLanguageE8PaSource from "../question-language.e8.pa.json" assert { type: "json" };
import stemVariantsE6Source from "../stem-variants.e6.en.json" assert { type: "json" };
import stemVariantsE6HiSource from "../stem-variants.e6.hi.json" assert { type: "json" };
import stemVariantsE6PaSource from "../stem-variants.e6.pa.json" assert { type: "json" };
import stemVariantsE7Source from "../stem-variants.e7.en.json" assert { type: "json" };
import stemVariantsE7HiSource from "../stem-variants.e7.hi.json" assert { type: "json" };
import stemVariantsE7PaSource from "../stem-variants.e7.pa.json" assert { type: "json" };
import stemVariantsE8Source from "../stem-variants.e8.en.json" assert { type: "json" };
import stemVariantsE8HiSource from "../stem-variants.e8.hi.json" assert { type: "json" };
import stemVariantsE8PaSource from "../stem-variants.e8.pa.json" assert { type: "json" };
import taskRegistrySource from "../task-registry.library.json" assert { type: "json" };
import taskRegistryE1Source from "../task-registry.e1.library.json" assert { type: "json" };
import taskRegistryE2Source from "../task-registry.e2.library.json" assert { type: "json" };
import taskRegistryE3ASource from "../task-registry.e3.library.json" assert { type: "json" };
import taskRegistryE3BSource from "../task-registry.e3b.library.json" assert { type: "json" };
import taskRegistryE4Source from "../task-registry.e4.library.json" assert { type: "json" };
import taskRegistryE5Source from "../task-registry.e5.library.json" assert { type: "json" };
import taskRegistryE8Source from "../task-registry.e8.library.json" assert { type: "json" };
import type { Prt001Language, Prt001TaskRegistryEntry } from "./types";

interface QuestionLanguageSource {
  language: Prt001Language;
  status: string;
  entries: Record<string, string>;
}

interface StemVariantSource {
  language: Prt001Language;
  status: string;
  entries: Record<string, string[]>;
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

function mergeStemVariants(base: StemVariantSource, ...overlays: StemVariantSource[]): StemVariantSource {
  let current = base;
  for (const overlay of overlays) {
    if (current.language !== overlay.language) throw new Error(`PRT-001 stem-variant language mismatch: ${current.language}/${overlay.language}`);
    const overlap = Object.keys(current.entries).filter((id) => Object.prototype.hasOwnProperty.call(overlay.entries, id));
    if (overlap.length > 0) throw new Error(`PRT-001 stem-variant ownership overlap: ${overlap.join(", ")}`);
    current = { language: current.language, status: `${current.status}+${overlay.status}`, entries: { ...current.entries, ...overlay.entries } };
  }
  return current;
}

const questionLanguages = {
  en: mergeQuestionLanguages(questionLanguageSource as QuestionLanguageSource, questionLanguageE1Source as QuestionLanguageSource, questionLanguageE2Source as QuestionLanguageSource, questionLanguageE3ASource as QuestionLanguageSource, questionLanguageE3BSource as QuestionLanguageSource, questionLanguageE4Source as QuestionLanguageSource, questionLanguageE5Source as QuestionLanguageSource, questionLanguageE8Source as QuestionLanguageSource),
  hi: mergeQuestionLanguages(questionLanguageHiSource as QuestionLanguageSource, questionLanguageE1HiSource as QuestionLanguageSource, questionLanguageE2HiSource as QuestionLanguageSource, questionLanguageE3AHiSource as QuestionLanguageSource, questionLanguageE3BHiSource as QuestionLanguageSource, questionLanguageE4HiSource as QuestionLanguageSource, questionLanguageE5HiSource as QuestionLanguageSource, questionLanguageE8HiSource as QuestionLanguageSource),
  pa: mergeQuestionLanguages(questionLanguagePaSource as QuestionLanguageSource, questionLanguageE1PaSource as QuestionLanguageSource, questionLanguageE2PaSource as QuestionLanguageSource, questionLanguageE3APaSource as QuestionLanguageSource, questionLanguageE3BPaSource as QuestionLanguageSource, questionLanguageE4PaSource as QuestionLanguageSource, questionLanguageE5PaSource as QuestionLanguageSource, questionLanguageE8PaSource as QuestionLanguageSource),
};

const stemVariants = {
  en: mergeStemVariants(stemVariantsE6Source as StemVariantSource, stemVariantsE7Source as StemVariantSource, stemVariantsE8Source as StemVariantSource),
  hi: mergeStemVariants(stemVariantsE6HiSource as StemVariantSource, stemVariantsE7HiSource as StemVariantSource, stemVariantsE8HiSource as StemVariantSource),
  pa: mergeStemVariants(stemVariantsE6PaSource as StemVariantSource, stemVariantsE7PaSource as StemVariantSource, stemVariantsE8PaSource as StemVariantSource),
};

const registries = [
  taskRegistrySource as TaskRegistrySource,
  taskRegistryE1Source as TaskRegistrySource,
  taskRegistryE2Source as TaskRegistrySource,
  taskRegistryE3ASource as TaskRegistrySource,
  taskRegistryE3BSource as TaskRegistrySource,
  taskRegistryE4Source as TaskRegistrySource,
  taskRegistryE5Source as TaskRegistrySource,
  taskRegistryE8Source as TaskRegistrySource,
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

function hashStemSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getPrt001QuestionTemplates(questionLanguageId: string, language: Prt001Language = "en"): string[] {
  const baseTemplate = questionLanguages[language].entries[questionLanguageId];
  if (!baseTemplate) throw new Error(`missing ${language} PRT-001 QL: ${questionLanguageId}`);
  return [baseTemplate, ...(stemVariants[language].entries[questionLanguageId] ?? [])];
}

export function getPrt001QuestionTemplate(questionLanguageId: string, language: Prt001Language = "en", seed?: string): string {
  const templates = getPrt001QuestionTemplates(questionLanguageId, language);
  if (!seed || templates.length === 1) return templates[0]!;
  return templates[hashStemSeed(`${seed}:${language}:${questionLanguageId}:stem`) % templates.length]!;
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
  const expectedE6VariantIds = Array.from({ length: 20 }, (_, index) => `PRT-QL-${String(index + 13).padStart(3, "0")}`).sort();
  const expectedE8VariantIds = ["PRT-QL-104", "PRT-QL-105"];
  const expectedE7VariantIds = registryIds.filter((id) => !expectedE6VariantIds.includes(id) && !expectedE8VariantIds.includes(id));
  for (const language of ["en", "hi", "pa"] as const) {
    const library = questionLanguages[language];
    const variants = stemVariants[language];
    const e6Source = language === "en" ? stemVariantsE6Source as StemVariantSource : language === "hi" ? stemVariantsE6HiSource as StemVariantSource : stemVariantsE6PaSource as StemVariantSource;
    const e7Source = language === "en" ? stemVariantsE7Source as StemVariantSource : language === "hi" ? stemVariantsE7HiSource as StemVariantSource : stemVariantsE7PaSource as StemVariantSource;
    const e8Source = language === "en" ? stemVariantsE8Source as StemVariantSource : language === "hi" ? stemVariantsE8HiSource as StemVariantSource : stemVariantsE8PaSource as StemVariantSource;
    if (library.language !== language) failures.push(`${language} library language mismatch`);
    if (variants.language !== language) failures.push(`${language} combined stem-variant language mismatch`);
    const questionIds = Object.keys(library.entries).sort();
    if (!sameStrings(registryIds, questionIds)) failures.push(`task registry and ${language} QL IDs differ`);
    if (!sameStrings(Object.keys(e6Source.entries).sort(), expectedE6VariantIds)) failures.push(`${language} E6 stem variants must cover exactly PRT-QL-013..032`);
    if (!sameStrings(Object.keys(e7Source.entries).sort(), expectedE7VariantIds)) failures.push(`${language} E7 stem variants must cover every pre-E8 active QL outside E6`);
    if (!sameStrings(Object.keys(e8Source.entries).sort(), expectedE8VariantIds)) failures.push(`${language} E8 stem variants must cover exactly PRT-QL-104..105`);
    if (!sameStrings(Object.keys(variants.entries).sort(), registryIds)) failures.push(`${language} combined stem variants must cover every active QL`);
    for (const questionLanguageId of registryIds) {
      const entry = taskRegistry.entries[questionLanguageId]!;
      const templates = getPrt001QuestionTemplates(questionLanguageId, language);
      if (templates.length !== 3) failures.push(`${language}:${questionLanguageId} must have exactly three authored stem skeletons`);
      if (new Set(templates).size !== templates.length) failures.push(`${language}:${questionLanguageId} has duplicate stem skeletons`);
      for (const template of templates) {
        const placeholders = extractPrt001Placeholders(template);
        if (!sameStrings(placeholders, entry.requiredVariables)) failures.push(`${language}:${questionLanguageId} required variables do not match a stem template`);
      }
    }
  }
  return failures;
}
