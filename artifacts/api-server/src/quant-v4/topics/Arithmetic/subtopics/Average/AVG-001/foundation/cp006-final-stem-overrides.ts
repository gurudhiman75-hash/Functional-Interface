import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-349": "Three groups have averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Two counts are {subgroupCount1}, {subgroupCount2}; the combined average is {overallAverage}. Find the third count.",
  "AVG-QL-357": "A region has branches of {subgroupCount1}, {subgroupCount2}, {subgroupCount3} members with averages {subgroupAverage1}, {subgroupAverage2}, {subgroupAverage3}. Find the regional total.",
  "AVG-QL-370": "Overall count is {parentCount} and average is {parentAverage}. Two groups are {subgroupCount1} at {subgroupAverage1} and {subgroupCount2} at {subgroupAverage2}. Find the last {subgroupCount3} average.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001Cp006FinalStemOverride(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  const template = overrides[entry.qlId];
  return template ? { ...entry, template, requiredVariables: placeholders(template) } : entry;
}
