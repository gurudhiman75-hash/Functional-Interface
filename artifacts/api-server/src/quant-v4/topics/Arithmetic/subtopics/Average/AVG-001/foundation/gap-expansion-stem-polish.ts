import type { Avg001QuestionLanguageEntry } from "./types";

const overrides: Record<string, string> = {
  "AVG-QL-374": "The average of {count} test scores is {oldAverage}. If each score is increased by {change}, find the new average.",
  "AVG-QL-382": "An equally spaced number set has an average of {average}, a {extremeLabel} term of {extremeValue}, and a common difference of {commonDifference}. How many terms does it contain?",
  "AVG-QL-386": "An equally spaced value series has an average of {average}, a {extremeLabel} term of {extremeValue}, and a common difference of {commonDifference}. How many terms does it contain?",
  "AVG-QL-388": "An equally spaced number set contains {count} terms and has an average of {average}. Its {extremeLabel} term is {extremeValue}. Find the common difference.",
  "AVG-QL-392": "An equally spaced value series contains {count} terms and has an average of {average}. Its {extremeLabel} term is {extremeValue}. Find the common difference.",
};

function placeholders(text: string) {
  return [...new Set([...text.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!))];
}

export function applyAvg001GapExpansionStemPolish(entry: Avg001QuestionLanguageEntry): Avg001QuestionLanguageEntry {
  const template = overrides[entry.qlId];
  if (!template) return entry;
  const polished = { ...entry, template, requiredVariables: placeholders(template) };
  return entry.qlId === "AVG-QL-374"
    ? { ...polished, unitKind: "none", finalContext: "average score" }
    : polished;
}
