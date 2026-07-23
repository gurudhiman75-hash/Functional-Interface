import { strict as assert } from "node:assert";
import {
  getAvg001QuestionEntries,
  getAvg001QuestionLanguageIds,
} from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const bannedStemPhrases = [
  "obtained a total",
  "a number of transactions",
  "over several trips",
  "expenditure was recorded",
  "remaining observation",
  "total passenger count across all trips",
];

const bannedExplanationPhrases = [
  "the average gives the value",
  "the total contains",
  "the complete total is",
  "first reconstruct",
  "therefore, the",
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\$\$.*?\$\$/g, "[formula]")
    .replace(/₹?[\d,.]+(?:\.\d+)?/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: string) {
  return value
    .replace(/[{}]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-001",
);
assert.equal(entries.length, 24);

const failures: string[] = [];
const normalizedStems = new Set<string>();
const strategiesByMode = new Map<string, string[]>();
const skeletonsByMode = new Map<string, Set<string>>();

for (const entry of entries) {
  const stemKey = normalize(entry.template);
  if (normalizedStems.has(stemKey)) {
    failures.push(`${entry.qlId}: duplicate normalized stem`);
  }
  normalizedStems.add(stemKey);

  const words = wordCount(entry.template);
  if (words > 30) {
    failures.push(`${entry.qlId}: stem has ${words} words; maximum is 30`);
  }
  for (const phrase of bannedStemPhrases) {
    if (entry.template.toLowerCase().includes(phrase)) {
      failures.push(`${entry.qlId}: stem contains formal phrase "${phrase}"`);
    }
  }

  const strategies = strategiesByMode.get(entry.solveMode) ?? [];
  strategies.push(entry.explanationStrategyId);
  strategiesByMode.set(entry.solveMode, strategies);

  const pkg = runAvg001Pipeline({
    questionLanguageId: entry.qlId,
    seed: `avg-editorial:${entry.qlId}:0`,
  });
  const explanationText = pkg.explanation.lines.join(" ");
  for (const phrase of bannedExplanationPhrases) {
    if (explanationText.toLowerCase().includes(phrase)) {
      failures.push(
        `${entry.qlId}: explanation contains boilerplate phrase "${phrase}"`,
      );
    }
  }
  if (pkg.explanation.lines.length < 4 || pkg.explanation.lines.length > 8) {
    failures.push(
      `${entry.qlId}: explanation has ${pkg.explanation.lines.length} lines`,
    );
  }

  const skeletons =
    skeletonsByMode.get(entry.solveMode) ?? new Set<string>();
  skeletons.add(normalize(explanationText));
  skeletonsByMode.set(entry.solveMode, skeletons);
}

for (const [mode, strategies] of strategiesByMode) {
  const counts = new Map<string, number>();
  for (const strategy of strategies) {
    counts.set(strategy, (counts.get(strategy) ?? 0) + 1);
  }
  if (counts.size < 3) {
    failures.push(
      `${mode}: only ${counts.size} explanation strategies; expected at least 3`,
    );
  }
  for (const [strategy, count] of counts) {
    if (count > 2) {
      failures.push(
        `${mode}: strategy ${strategy} is reused ${count} times; maximum is 2`,
      );
    }
  }
  const skeletonCount = skeletonsByMode.get(mode)?.size ?? 0;
  if (skeletonCount < 3) {
    failures.push(
      `${mode}: only ${skeletonCount} normalized explanation structures`,
    );
  }
}

const entryIds = new Set(entries.map((entry) => entry.qlId));
assert.deepEqual(
  getAvg001QuestionLanguageIds().filter((id) => entryIds.has(id)),
  entries.map((entry) => entry.qlId),
);

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      uniqueStemCount: normalizedStems.size,
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

assert.equal(failures.length, 0, failures.join("\n"));
