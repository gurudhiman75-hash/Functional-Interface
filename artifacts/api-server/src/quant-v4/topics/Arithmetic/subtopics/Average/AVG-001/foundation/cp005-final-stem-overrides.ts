import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-276": "For {count} people, the reported average age was {reportedAverage} years. After correcting {incorrectValue} years to {correctValue} years, find the new average.",
  "AVG-QL-278": "A register shows an average daily sales figure of ₹{reportedAverage} for {count} shops. One entry of ₹{incorrectValue} should be ₹{correctValue}. Find the correct average.",
  "AVG-QL-279": "For {count} innings, the calculated average was {reportedAverage} runs. After replacing {incorrectValue} runs with {correctValue} runs, find the new average.",
  "AVG-QL-293": "The average output of {count} machines changes from {reportedAverage} units to {correctedAverage} units when an entry of {incorrectValue} units is corrected. Find the actual value.",
  "AVG-QL-324": "Replacing {incorrectValue} years with {correctValue} years changes the average by {averageChange} years. How many people were included?",
  "AVG-QL-325": "For {count} machines, the reported average output is {reportedAverage} units. Values {incorrectValue} and {incorrectValue2} should be {correctValue} and {correctValue2}. Find the correct average.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001Cp005FinalStemOverride(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  const template = overrides[entry.qlId];
  return template ? { ...entry, template, requiredVariables: placeholders(template) } : entry;
}
