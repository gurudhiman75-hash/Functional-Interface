import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-004",
);
const failures: string[] = [];

const oldGenericPhrases = [
  "Convert each group average into its group total.",
  "The group totals are",
  "Add the totals and use the combined count",
  "The lower and higher group averages balance around the combined average.",
  "Use the two weighted deviations to find the unknown group size.",
];

const technicalStemPatterns: Array<[RegExp, string]> = [
  [/\bweighted average\b/i, "uses technical 'weighted average' wording"],
  [/\brespective averages\b/i, "uses formal 'respective averages' wording"],
  [/\bdetermine the\b/i, "uses formal 'determine' wording"],
  [/\bgroup [A-D]\b/i, "uses abstract Group A/B/C/D labels"],
  [/\bfirst set\b/i, "uses abstract set wording"],
  [/\bcombined group\b/i, "uses technical combined-group wording"],
  [/\bmissing group average\b/i, "uses internal missing-group wording"],
  [/\bsecond-group\b/i, "uses hyphenated internal group wording"],
  [/\bthe counts are\b/i, "uses catalogue-like count wording"],
  [/\bhave sizes\b/i, "uses catalogue-like group-size wording"],
];

function normalizeExplanation(lines: string[]) {
  return lines
    .slice(0, -1)
    .join(" ")
    .toLowerCase()
    .replace(/\$\$.*?\$\$/g, "{equation}")
    .replace(/₹?[\d,]+(?:\.\d+)?(?:\/\d+)?/g, "{number}")
    .replace(/\b(?:boys|girls|students|workers|employees|outlets|parcels|trips|people|branches|machines|packages|players|residents|farms|values|groups|members)\b/g, "{entity}")
    .replace(/\s+/g, " ")
    .trim();
}

function openingSignature(template: string) {
  return template
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/g, "{value}")
    .replace(/₹/g, "")
    .replace(/[^a-z{}]+/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 10)
    .join(" ");
}

const explanationsByMode = new Map<string, Map<string, string>>();
const stemSignaturesByMode = new Map<string, Set<string>>();

for (const entry of entries) {
  for (const [pattern, reason] of technicalStemPatterns) {
    if (pattern.test(entry.template)) failures.push(`${entry.qlId}: ${reason}`);
  }

  const packageResult = runAvg001Pipeline({
    questionLanguageId: entry.qlId,
    seed: `avg-cp004-variety:${entry.qlId}`,
  });
  const lines = packageResult.explanation.lines
    .map((line) => line.trim())
    .filter(Boolean);
  const joined = lines.join(" ");

  if (!lines.length) failures.push(`${entry.qlId}: empty explanation`);
  if (lines.length < 4 || lines.length > 6) {
    failures.push(`${entry.qlId}: explanation has ${lines.length} lines`);
  }
  if (!lines.some((line) => /\$\$/.test(line))) {
    failures.push(`${entry.qlId}: explanation has no substituted calculation`);
  }
  if (!joined.replace(/,/g, "").includes(packageResult.answer.replace(/,/g, ""))) {
    failures.push(`${entry.qlId}: explanation omits the final answer`);
  }
  for (const phrase of oldGenericPhrases) {
    if (joined.includes(phrase)) {
      failures.push(`${entry.qlId}: retains old generic explanation phrase`);
    }
  }

  const modeMap =
    explanationsByMode.get(entry.solveMode) ?? new Map<string, string>();
  const structure = normalizeExplanation(lines);
  const priorForStrategy = modeMap.get(entry.explanationStrategyId);
  if (!priorForStrategy) modeMap.set(entry.explanationStrategyId, structure);
  explanationsByMode.set(entry.solveMode, modeMap);

  const signatures =
    stemSignaturesByMode.get(entry.solveMode) ?? new Set<string>();
  signatures.add(openingSignature(entry.template));
  stemSignaturesByMode.set(entry.solveMode, signatures);
}

for (const [mode, strategies] of explanationsByMode) {
  if (strategies.size < 3) {
    failures.push(`${mode}: only ${strategies.size} rendered explanation strategies`);
  }
  const uniqueStructures = new Set(strategies.values());
  if (uniqueStructures.size < 3) {
    failures.push(`${mode}: explanation strategy IDs collapse to ${uniqueStructures.size} rendered structures`);
  }
}

const minimumStemStructures: Record<string, number> = {
  findCombinedAverageOfTwoGroups: 6,
  findCombinedAverageOfThreeOrFourGroups: 4,
  findGroupCountFromCombinedAverage: 5,
  findMissingGroupAverage: 5,
  findAverageSpeedEqualDistance: 5,
  findAverageSpeedEqualTime: 5,
};

for (const [mode, minimum] of Object.entries(minimumStemStructures)) {
  const actual = stemSignaturesByMode.get(mode)?.size ?? 0;
  if (actual < minimum) {
    failures.push(`${mode}: only ${actual} structural stem openings; expected at least ${minimum}`);
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      renderedExplanationStrategies: Object.fromEntries(
        Array.from(explanationsByMode, ([mode, strategies]) => [
          mode,
          {
            strategyIds: strategies.size,
            renderedStructures: new Set(strategies.values()).size,
          },
        ]),
      ),
      stemStructures: Object.fromEntries(
        Array.from(stemSignaturesByMode, ([mode, signatures]) => [
          mode,
          signatures.size,
        ]),
      ),
      technicalStemPatternCount: technicalStemPatterns.length,
      maxStemLength: Math.max(...entries.map((entry) => entry.template.length)),
      failureCount: failures.length,
      failures,
      status: failures.length ? "FAIL" : "PASS",
    },
    null,
    2,
  ),
);

assert.equal(entries.length, 65);
assert.equal(failures.length, 0, failures.join("\n"));
