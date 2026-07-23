import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries, getAvg001RegistryEntry } from "./foundation/library";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-004");
const originalEntries = entries.filter((entry) => Number(entry.qlId.slice(-3)) >= 209 && Number(entry.qlId.slice(-3)) <= 273);
const expansionEntries = entries.filter((entry) => Number(entry.qlId.slice(-3)) >= 406 && Number(entry.qlId.slice(-3)) <= 425);
const failures: string[] = [];

const originalIds = Array.from({ length: 65 }, (_, index) => `AVG-QL-${String(index + 209).padStart(3, "0")}`);
const expansionIds = Array.from({ length: 20 }, (_, index) => `AVG-QL-${String(index + 406).padStart(3, "0")}`);
if (JSON.stringify(originalEntries.map((entry) => entry.qlId)) !== JSON.stringify(originalIds)) failures.push("CP-004 original IDs changed");
if (JSON.stringify(expansionEntries.map((entry) => entry.qlId)) !== JSON.stringify(expansionIds)) failures.push("CP-004 expansion IDs are not AVG-QL-406–425");

const originalModeTargets: Record<string, number> = {
  findCombinedAverageOfTwoGroups: 16,
  findCombinedAverageOfThreeOrFourGroups: 12,
  findGroupCountFromCombinedAverage: 11,
  findMissingGroupAverage: 11,
  findAverageSpeedEqualDistance: 8,
  findAverageSpeedEqualTime: 7,
};
for (const [mode, expected] of Object.entries(originalModeTargets)) {
  const actual = originalEntries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) failures.push(`${mode}: ${actual}; expected ${expected}`);
}
const expansionModeTargets = { findGroupCountRatioFromCombinedAverage: 8, findAverageSpeedForUnequalDistances: 6, findAverageSpeedForUnequalTimes: 6 };
for (const [mode, expected] of Object.entries(expansionModeTargets)) {
  const actual = expansionEntries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) failures.push(`${mode}: ${actual}; expected ${expected}`);
}

const originalDifficultyTargets = { Easy: 21, Medium: 22, Hard: 22 };
for (const [difficulty, expected] of Object.entries(originalDifficultyTargets)) {
  const actual = originalEntries.filter((entry) => entry.difficulty === difficulty).length;
  if (actual !== expected) failures.push(`Original ${difficulty}: ${actual}; expected ${expected}`);
}
const expansionDifficultyTargets = { Easy: 7, Medium: 7, Hard: 6 };
for (const [difficulty, expected] of Object.entries(expansionDifficultyTargets)) {
  const actual = expansionEntries.filter((entry) => entry.difficulty === difficulty).length;
  if (actual !== expected) failures.push(`Expansion ${difficulty}: ${actual}; expected ${expected}`);
}

function placeholders(template: string) {
  return Array.from(template.matchAll(/\{([A-Za-z0-9_]+)\}/g), (match) => match[1]!).sort();
}
function normalize(template: string) {
  return template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/[^a-z{}]+/g, " ").replace(/\s+/g, " ").trim();
}

const normalized = new Map<string, string>();
const originalStrategyCounts: Record<string, Set<string>> = {};
for (const entry of entries) {
  const actualPlaceholders = [...new Set(placeholders(entry.template))].sort();
  const expectedPlaceholders = [...entry.requiredVariables].sort();
  if (JSON.stringify(actualPlaceholders) !== JSON.stringify(expectedPlaceholders)) failures.push(`${entry.qlId}: placeholder mismatch`);
  const registry = getAvg001RegistryEntry(entry.qlId);
  if (registry.cpId !== entry.cpId || registry.solveMode !== entry.solveMode || registry.answerType !== entry.answerType) failures.push(`${entry.qlId}: registry metadata mismatch`);
  const key = normalize(entry.template);
  const prior = normalized.get(key);
  if (prior) failures.push(`${entry.qlId}: normalized duplicate of ${prior}`);
  normalized.set(key, entry.qlId);
  if (originalEntries.includes(entry)) {
    const set = originalStrategyCounts[entry.solveMode] ?? new Set<string>();
    set.add(entry.explanationStrategyId);
    originalStrategyCounts[entry.solveMode] = set;
  }
}
for (const [mode, strategies] of Object.entries(originalStrategyCounts)) if (strategies.size < 3) failures.push(`${mode}: only ${strategies.size} original explanation strategies`);

console.log(JSON.stringify({ qlCount: entries.length, originalQlCount: originalEntries.length, expansionQlCount: expansionEntries.length, modeCounts: Object.fromEntries([...Object.keys(originalModeTargets), ...Object.keys(expansionModeTargets)].map((mode) => [mode, entries.filter((entry) => entry.solveMode === mode).length])), difficultyCounts: Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])), originalStrategyCounts: Object.fromEntries(Object.entries(originalStrategyCounts).map(([mode, strategies]) => [mode, strategies.size])), uniqueNormalizedStems: normalized.size, failures, status: failures.length ? "FAIL" : "PASS" }, null, 2));
assert.equal(entries.length, 85);
assert.equal(failures.length, 0, failures.join("\n"));
