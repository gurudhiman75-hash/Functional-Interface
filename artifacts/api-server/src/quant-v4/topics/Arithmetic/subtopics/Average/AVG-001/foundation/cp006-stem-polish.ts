import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-339": "Three departments form one company. They contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} employees, with average monthly salaries of ₹{subgroupAverage1}, ₹{subgroupAverage2} and ₹{subgroupAverage3}. Find the overall average salary.",
  "AVG-QL-342": "Three teams form one tournament group. They contain {subgroupCount1}, {subgroupCount2} and {subgroupCount3} players, with averages of {subgroupAverage1}, {subgroupAverage2} and {subgroupAverage3} runs. Find the combined average.",
  "AVG-QL-362": "A region has {subgroupCount1} employees in one branch, with average daily sales of ₹{subgroupAverage1}. Find the total daily sales of that branch.",
  "AVG-QL-371": "A company has {parentCount} employees with an average monthly salary of ₹{parentAverage}. Of these, {subgroupCount1} employees average ₹{subgroupAverage1} and {subgroupCount2} employees average ₹{subgroupAverage2}. Find the average salary of the remaining {subgroupCount3} employees.",
  "AVG-QL-372": "A region has {parentCount} employees with average daily sales of ₹{parentAverage}. Of these, {subgroupCount1} employees average ₹{subgroupAverage1} and {subgroupCount2} employees average ₹{subgroupAverage2}. Find the average sales of the remaining {subgroupCount3} employees.",
  "AVG-QL-373": "A factory has {parentCount} workers with an average output of {parentAverage} units. Of these, {subgroupCount1} workers average {subgroupAverage1} units and {subgroupCount2} workers average {subgroupAverage2} units. Find the average output of the remaining {subgroupCount3} workers.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001Cp006StemPolish(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  if (entry.cpId !== "AVG-CP-006") return entry;
  const template = overrides[entry.qlId];
  return template ? { ...entry, template, requiredVariables: placeholders(template) } : entry;
}
