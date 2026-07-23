import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-355": "Three departments average {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. First two counts are {subgroupCount1}, {subgroupCount2}; overall average is {overallAverage}. Find the third count.",
  "AVG-QL-357": "Three production units average {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. First two counts are {subgroupCount1}, {subgroupCount2}; factory average is {overallAverage}. Find the third count.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001Cp006FinalStemOverride(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  const template = overrides[entry.qlId];
  return template ? { ...entry, template, requiredVariables: placeholders(template) } : entry;
}
