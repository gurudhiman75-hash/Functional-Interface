import questionLanguage from "../question-language.en.json";
import cp002QuestionLanguage from "../question-language.cp002.en.json";
import cp003QuestionLanguage from "../question-language.cp003.en.json";
import taskRegistry from "../task-registry.library.json";
import cp002TaskRegistry from "../task-registry.cp002.library.json";
import cp003TaskRegistry from "../task-registry.cp003.library.json";
import { cp001ExpansionEntries } from "./cp001-expansion-library";
import { cp004Entries } from "./cp004-library";
import { applyAvg001EditorialStem } from "./editorial-stem-overrides";
import type { Avg001QuestionLanguageEntry, Avg001SolveMode } from "./types";

function applyCp004RuntimeMetadata(
  entry: Avg001QuestionLanguageEntry,
): Avg001QuestionLanguageEntry {
  if (
    entry.cpId !== "AVG-CP-004" ||
    entry.solveMode !== "findGroupCountFromCombinedAverage"
  ) {
    return entry;
  }

  const variant = entry.scenarioVariant;
  const unitKind = /Salary|Sales|Revenue|Expense/i.test(variant)
    ? "currency"
    : /Weight/i.test(variant)
      ? "kg"
      : /Age/i.test(variant)
        ? "years"
        : /Marks|Scores/i.test(variant)
          ? "marks"
          : /Output/i.test(variant)
            ? "units"
            : "none";

  return {
    ...entry,
    unitKind,
  };
}

const entries = [
  ...(questionLanguage.entries as Avg001QuestionLanguageEntry[]),
  ...cp001ExpansionEntries,
  ...(cp002QuestionLanguage.entries as Avg001QuestionLanguageEntry[]),
  ...(cp003QuestionLanguage.entries as Avg001QuestionLanguageEntry[]),
  ...cp004Entries,
]
  .map(applyCp004RuntimeMetadata)
  .map(applyAvg001EditorialStem)
  .filter((entry) => entry.active);

const registryById = new Map(
  [
    ...(taskRegistry.entries as Avg001QuestionLanguageEntry[]),
    ...cp001ExpansionEntries,
    ...(cp002TaskRegistry.entries as Avg001QuestionLanguageEntry[]),
    ...(cp003TaskRegistry.entries as Avg001QuestionLanguageEntry[]),
    ...cp004Entries,
  ]
    .map(applyCp004RuntimeMetadata)
    .map(applyAvg001EditorialStem)
    .map((entry) => [entry.qlId, entry]),
);

const PLACEHOLDER_ALIASES: Record<string, string> = {
  elapsedYears: "yearsElapsed",
  yearsElapsed: "elapsedYears",
};

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
    if (key in variables) return String(variables[key]);

    const alias = PLACEHOLDER_ALIASES[key];
    if (alias && alias in variables) return String(variables[alias]);

    unresolved.push(key);
    return `{${key}}`;
  });
  if (unresolved.length) {
    throw new Error(
      `Unresolved AVG-001 placeholders: ${unresolved.join(", ")}`,
    );
  }
  return rendered;
}
