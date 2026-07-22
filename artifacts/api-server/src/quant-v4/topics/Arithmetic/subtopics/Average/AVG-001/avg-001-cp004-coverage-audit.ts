import { strict as assert } from "node:assert";
import {
  getAvg001QuestionEntries,
  getAvg001RegistryEntry,
} from "./foundation/library";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-004",
);
const failures: string[] = [];

const expectedIds = Array.from(
  { length: 65 },
  (_, index) => `AVG-QL-${String(index + 209).padStart(3, "0")}`,
);
if (JSON.stringify(entries.map((entry) => entry.qlId)) !== JSON.stringify(expectedIds)) {
  failures.push("CP-004 IDs are not the stable AVG-QL-209–273 range");
}

const modeTargets: Record<string, number> = {
  findCombinedAverageOfTwoGroups: 16,
  findCombinedAverageOfThreeOrFourGroups: 12,
  findGroupCountFromCombinedAverage: 11,
  findMissingGroupAverage: 11,
  findAverageSpeedEqualDistance: 8,
  findAverageSpeedEqualTime: 7,
};
for (const [mode, expected] of Object.entries(modeTargets)) {
  const actual = entries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) failures.push(`${mode}: ${actual}; expected ${expected}`);
}

const difficultyTargets = { Easy: 21, Medium: 22, Hard: 22 };
for (const [difficulty, expected] of Object.entries(difficultyTargets)) {
  const actual = entries.filter((entry) => entry.difficulty === difficulty).length;
  if (actual !== expected) failures.push(`${difficulty}: ${actual}; expected ${expected}`);
}

function placeholders(template: string) {
  return Array.from(
    template.matchAll(/\{([A-Za-z0-9_]+)\}/g),
    (match) => match[1]!,
  ).sort();
}

function normalize(template: string) {
  return template
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/g, "{value}")
    .replace(/[^a-z{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const normalized = new Map<string, string>();
const strategyCounts: Record<string, Set<string>> = {};

for (const entry of entries) {
  const actualPlaceholders = [...new Set(placeholders(entry.template))].sort();
  const expectedPlaceholders = [...entry.requiredVariables].sort();
  if (JSON.stringify(actualPlaceholders) !== JSON.stringify(expectedPlaceholders)) {
    failures.push(`${entry.qlId}: placeholder mismatch (${actualPlaceholders.join(", ")} versus ${expectedPlaceholders.join(", ")})`);
  }

  const registry = getAvg001RegistryEntry(entry.qlId);
  if (registry.cpId !== entry.cpId || registry.solveMode !== entry.solveMode || registry.answerType !== entry.answerType) {
    failures.push(`${entry.qlId}: registry metadata mismatch`);
  }

  const key = normalize(entry.template);
  const prior = normalized.get(key);
  if (prior) failures.push(`${entry.qlId}: normalized duplicate of ${prior}`);
  normalized.set(key, entry.qlId);

  const set = strategyCounts[entry.solveMode] ?? new Set<string>();
  set.add(entry.explanationStrategyId);
  strategyCounts[entry.solveMode] = set;
}

for (const [mode, strategies] of Object.entries(strategyCounts)) {
  if (strategies.size < 3) failures.push(`${mode}: only ${strategies.size} explanation strategies`);
}

console.log(JSON.stringify({
  qlCount: entries.length,
  idRange: [entries[0]?.qlId, entries.at(-1)?.qlId],
  modeCounts: Object.fromEntries(Object.keys(modeTargets).map((mode) => [mode, entries.filter((entry) => entry.solveMode === mode).length])),
  difficultyCounts: Object.fromEntries(Object.keys(difficultyTargets).map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])),
  strategyCounts: Object.fromEntries(Object.entries(strategyCounts).map(([mode, strategies]) => [mode, strategies.size])),
  uniqueNormalizedStems: normalized.size,
  failures,
  status: failures.length ? "FAIL" : "PASS",
}, null, 2));

assert.equal(entries.length, 65);
assert.equal(failures.length, 0, failures.join("\n"));
