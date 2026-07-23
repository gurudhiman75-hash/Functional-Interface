import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-357": "A factory has three production units with average outputs of {subgroupAverage1}, {subgroupAverage2} and {subgroupAverage3} units. The first two units have {subgroupCount1} and {subgroupCount2} machines, and the factory average is {overallAverage} units. Find the number of machines in the third unit.",
  "AVG-QL-370": "A tournament group has {parentCount} players with an average of {parentAverage} runs. Of these, {subgroupCount1} players average {subgroupAverage1} runs and {subgroupCount2} players average {subgroupAverage2} runs. Find the average of the remaining {subgroupCount3} players.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001Cp006FinalStemOverride(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  const template = overrides[entry.qlId];
  return template ? { ...entry, template, requiredVariables: placeholders(template) } : entry;
}
