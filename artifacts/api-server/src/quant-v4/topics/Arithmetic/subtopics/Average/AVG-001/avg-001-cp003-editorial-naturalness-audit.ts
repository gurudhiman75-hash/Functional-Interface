import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-003",
);
const failures: string[] = [];

const bannedStemPhrases = [
  "obtained a total",
  "a number of",
  "over several",
  "remaining observation",
  "what will be the",
  "calculate the revised",
];
const bannedExplanationPhrases = [
  "setup",
  "apply formula",
  "calculation step",
  "therefore, the requested answer",
];
const expansionModes = new Set([
  "findOriginalCountFromJoiningMemberShift",
  "findOriginalCountFromLeavingMemberShift",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\$\$.*?\$\$/g, "[formula]")
    .replace(/₹?[\d,.]+(?:\.\d+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: string) {
  return value.replace(/[{}]/g, "").trim().split(/\s+/).filter(Boolean).length;
}

function containsAnswer(text: string, answer: string) {
  return text.replace(/,/g, "").includes(answer.replace(/,/g, ""));
}

const stemKeys = new Map<string, string[]>();
const strategiesByMode = new Map<string, string[]>();
const skeletonsByMode = new Map<string, Set<string>>();

for (const entry of entries) {
  const key = normalize(entry.template);
  const ids = stemKeys.get(key) ?? [];
  ids.push(entry.qlId);
  stemKeys.set(key, ids);

  const words = wordCount(entry.template);
  if (words > 38) {
    failures.push(`${entry.qlId}: stem has ${words} words; maximum is 38`);
  }
  for (const phrase of bannedStemPhrases) {
    if (entry.template.toLowerCase().includes(phrase)) {
      failures.push(`${entry.qlId}: stem contains "${phrase}"`);
    }
  }

  const strategies = strategiesByMode.get(entry.solveMode) ?? [];
  strategies.push(entry.explanationStrategyId);
  strategiesByMode.set(entry.solveMode, strategies);

  const pkg = runAvg001Pipeline({
    questionLanguageId: entry.qlId,
    seed: `avg-cp003-editorial:${entry.qlId}:0`,
  });
  const explanation = pkg.explanation.lines.join(" ");
  for (const phrase of bannedExplanationPhrases) {
    if (explanation.toLowerCase().includes(phrase)) {
      failures.push(`${entry.qlId}: explanation contains "${phrase}"`);
    }
  }
  if (pkg.explanation.lines.length < 4 || pkg.explanation.lines.length > 7) {
    failures.push(
      `${entry.qlId}: explanation has ${pkg.explanation.lines.length} lines`,
    );
  }
  if (!containsAnswer(explanation, pkg.answer)) {
    failures.push(`${entry.qlId}: explanation does not contain answer`);
  }

  const skeletons = skeletonsByMode.get(entry.solveMode) ?? new Set<string>();
  skeletons.add(normalize(explanation));
  skeletonsByMode.set(entry.solveMode, skeletons);
}

for (const [, ids] of stemKeys) {
  if (ids.length > 1) {
    failures.push(`Duplicate normalized stems: ${ids.join(", ")}`);
  }
}

for (const [mode, strategies] of strategiesByMode) {
  const counts = new Map<string, number>();
  for (const strategy of strategies) {
    counts.set(strategy, (counts.get(strategy) ?? 0) + 1);
  }
  const requiredStrategies = expansionModes.has(mode) ? 1 : 3;
  const maximumReuse = expansionModes.has(mode) ? 6 : 4;
  const requiredSkeletons = expansionModes.has(mode) ? 1 : 2;
  if (counts.size < requiredStrategies) {
    failures.push(`${mode}: only ${counts.size} explanation strategies`);
  }
  for (const [strategy, count] of counts) {
    if (count > maximumReuse) {
      failures.push(`${mode}: strategy ${strategy} reused ${count} times`);
    }
  }
  const skeletonCount = skeletonsByMode.get(mode)?.size ?? 0;
  if (skeletonCount < requiredSkeletons) {
    failures.push(`${mode}: only ${skeletonCount} explanation structures`);
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      uniqueStemCount: stemKeys.size,
      modes: Object.fromEntries(
        [...strategiesByMode].map(([mode, strategies]) => [
          mode,
          {
            strategyCount: new Set(strategies).size,
            skeletonCount: skeletonsByMode.get(mode)?.size ?? 0,
          },
        ]),
      ),
      failureCount: failures.length,
      failures,
    },
    null,
    2,
  ),
);
assert.equal(entries.length, 98);
assert.equal(stemKeys.size, 98);
assert.equal(failures.length, 0, failures.join("\n"));
