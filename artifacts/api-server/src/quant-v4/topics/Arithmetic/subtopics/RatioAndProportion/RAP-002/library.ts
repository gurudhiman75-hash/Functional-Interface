import questionLanguageEn from "./question-language.en.json";
import taskRegistry from "./task-registry.library.json";
import type {
  Rap002CanonicalProblemId,
  Rap002QuestionLanguageEntry,
  Rap002TaskRegistryEntry,
} from "./types";

type QuestionLanguageLibrary = Record<string, { families: Record<string, Rap002QuestionLanguageEntry> }>;

const questionLibrary = questionLanguageEn as QuestionLanguageLibrary;
const registryEntries = taskRegistry.entries as Record<string, Rap002TaskRegistryEntry>;

export function getRap002ActiveCanonicalProblemIds(): Rap002CanonicalProblemId[] {
  return ["RAP-CP-007", "RAP-CP-008", "RAP-CP-009", "RAP-CP-010"];
}

export function getRap002QuestionLanguageIds(cpId: Rap002CanonicalProblemId) {
  return Object.keys(questionLibrary[cpId]?.families ?? {});
}

export function getRap002QuestionEntry(cpId: Rap002CanonicalProblemId, qlId: string) {
  const entry = questionLibrary[cpId]?.families[qlId];
  if (!entry) throw new Error(`Missing RAP-002 question language entry: ${cpId}:${qlId}`);
  return entry;
}

export function getRap002RegistryEntry(qlId: string) {
  const entry = registryEntries[qlId];
  if (!entry) throw new Error(`Missing RAP-002 task registry entry: ${qlId}`);
  return entry;
}

export function renderRap002Template(template: string, variables: Record<string, string | number>) {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => {
    if (variables[key] === undefined) throw new Error(`Missing template variable: ${key}`);
    return String(variables[key]);
  });
}

export function validateRap002Libraries() {
  const failures: string[] = [];
  for (const cpId of getRap002ActiveCanonicalProblemIds()) {
    for (const qlId of getRap002QuestionLanguageIds(cpId)) {
      const question = getRap002QuestionEntry(cpId, qlId);
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
    }
  }
  return { valid: failures.length === 0, failures };
}
