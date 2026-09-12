import questionLanguageEn from "./question-language.en.json";
import questionLanguageHi from "./question-language.hi.json";
import questionLanguagePa from "./question-language.pa.json";
import taskRegistry from "./task-registry.library.json";
import type {
  Rap003CanonicalProblemId,
  Rap003Language,
  Rap003QuestionLanguageEntry,
  Rap003TaskRegistryEntry,
} from "./types";

type QuestionLanguageLibrary = Record<string, { families: Record<string, Rap003QuestionLanguageEntry> }>;

const questionLibraries: Record<Rap003Language, QuestionLanguageLibrary> = {
  en: questionLanguageEn as QuestionLanguageLibrary,
  hi: questionLanguageHi as QuestionLanguageLibrary,
  pa: questionLanguagePa as QuestionLanguageLibrary,
};
const registryEntries = taskRegistry.entries as Record<string, Rap003TaskRegistryEntry>;

/**
 * RAP-CP-013 is retained as historical runtime data but is no longer an active
 * Ratio & Proportion product surface. Standalone PRT-001 owns aptitude
 * Partnership generation. Direct legacy CP013 helpers remain available for
 * regression/history tests only.
 */
export function getRap003ActiveCanonicalProblemIds(): Rap003CanonicalProblemId[] {
  return ["RAP-CP-014", "RAP-CP-015", "RAP-CP-016", "RAP-CP-017", "RAP-CP-018", "RAP-CP-019", "RAP-CP-020", "RAP-CP-021", "RAP-CP-022"];
}

export function getRap003QuestionLanguageIds(cpId: Rap003CanonicalProblemId) {
  return Object.keys(questionLibraries.en[cpId]?.families ?? {});
}

export function getRap003QuestionEntry(cpId: Rap003CanonicalProblemId, qlId: string, language: Rap003Language = "en") {
  const entry = questionLibraries[language][cpId]?.families[qlId] ?? questionLibraries.en[cpId]?.families[qlId];
  if (!entry) throw new Error(`Missing RAP-003 question language entry: ${cpId}:${qlId}`);
  return entry;
}

export function getRap003RegistryEntry(qlId: string) {
  const entry = registryEntries[qlId];
  if (!entry) throw new Error(`Missing RAP-003 task registry entry: ${qlId}`);
  return entry;
}

export function renderRap003Template(template: string, variables: Record<string, string | number>) {
  const rendered = template.replace(/\{([^}]+)\}/g, (_, key: string) => {
    if (variables[key] === undefined) throw new Error(`Missing template variable: ${key}`);
    return String(variables[key]);
  });
  return rendered.charAt(0).toUpperCase() + rendered.slice(1);
}

export function validateRap003Libraries() {
  const failures: string[] = [];
  for (const cpId of getRap003ActiveCanonicalProblemIds()) {
    for (const qlId of getRap003QuestionLanguageIds(cpId)) {
      const question = getRap003QuestionEntry(cpId, qlId);
      const registry = registryEntries[qlId];
      if (!registry) failures.push(`Missing registry entry for ${qlId}`);
      if (registry && registry.cpId !== cpId) failures.push(`CP mismatch for ${qlId}`);
      if (registry && registry.taskKind !== question.taskKind) failures.push(`Task kind mismatch for ${qlId}`);
      const placeholders = [...question.template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
      for (const placeholder of placeholders) {
        if (!registry?.requiredVariables.includes(placeholder)) {
          failures.push(`Placeholder ${placeholder} missing from requiredVariables for ${qlId}`);
        }
      }
      for (const language of ["hi", "pa"] as const) {
        const localized = getRap003QuestionEntry(cpId, qlId, language);
        const enPlaceholders = [...question.template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!).sort();
        const localizedPlaceholders = [...localized.template.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!).sort();
        if (enPlaceholders.join("|") !== localizedPlaceholders.join("|")) {
          failures.push(`${language} placeholder parity mismatch for ${qlId}`);
        }
      }
    }
  }
  return { valid: failures.length === 0, failures };
}
