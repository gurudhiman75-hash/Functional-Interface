import questionLanguage from "../question-language.en.json";
import cp002QuestionLanguage from "../question-language.cp002.en.json";
import taskRegistry from "../task-registry.library.json";
import cp002TaskRegistry from "../task-registry.cp002.library.json";
import type { Avg001QuestionLanguageEntry, Avg001SolveMode } from "./types";

const entries = [
  ...(questionLanguage.entries as Avg001QuestionLanguageEntry[]),
  ...(cp002QuestionLanguage.entries as Avg001QuestionLanguageEntry[]),
].filter((entry) => entry.active);

const registryById = new Map(
  [
    ...(taskRegistry.entries as Avg001QuestionLanguageEntry[]),
    ...(cp002TaskRegistry.entries as Avg001QuestionLanguageEntry[]),
  ].map((entry) => [entry.qlId, entry]),
);

export function getAvg001QuestionEntries() {
  return [...entries];
}

export function getAvg001QuestionEntry(qlId: string) {
  const entry = entries.find((item) => item.qlId === qlId);
  if (!entry) throw new Error(`Unknown active AVG-001 QL: ${qlId}`);
  return entry;
}

export function getAvg001RegistryEntry(qlId: string) {
  const entry = registryById.get(qlId);
  if (!entry) throw new Error(`Missing AVG-001 registry entry: ${qlId}`);
  return entry;
}

export function getAvg001QuestionLanguageIds() {
  return entries.map((entry) => entry.qlId);
}

export function getAvg001QlIdsForSolveMode(mode: Avg001SolveMode) {
  return entries
    .filter((entry) => entry.solveMode === mode)
    .map((entry) => entry.qlId);
}

export function renderTemplate(
  template: string,
  variables: Record<string, string | number>,
) {
  const unresolved: string[] = [];
  const rendered = template.replace(/\{([A-Za-z0-9_]+)\}/g, (_, key) => {
    if (!(key in variables)) {
      unresolved.push(key);
      return `{${key}}`;
    }
    return String(variables[key]);
  });
  if (unresolved.length) {
    throw new Error(
      `Unresolved AVG-001 placeholders: ${unresolved.join(", ")}`,
    );
  }
  return rendered;
}
