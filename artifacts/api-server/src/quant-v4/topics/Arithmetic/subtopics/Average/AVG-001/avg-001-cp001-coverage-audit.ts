import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries, getAvg001RegistryEntry } from "./foundation/library";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-001");
const originalEntries = entries.filter((entry) => Number(entry.qlId.slice(-3)) <= 72);
const expansionEntries = entries.filter((entry) => Number(entry.qlId.slice(-3)) >= 374);
const failures: string[] = [];

const originalIds = Array.from({ length: 72 }, (_, index) => `AVG-QL-${String(index + 1).padStart(3, "0")}`);
const expansionIds = Array.from({ length: 8 }, (_, index) => `AVG-QL-${String(index + 374).padStart(3, "0")}`);
if (JSON.stringify(originalEntries.map((entry) => entry.qlId)) !== JSON.stringify(originalIds)) failures.push("CP-001 original IDs changed");
if (JSON.stringify(expansionEntries.map((entry) => entry.qlId)) !== JSON.stringify(expansionIds)) failures.push("CP-001 expansion IDs are not AVG-QL-374–381");

const modeTargets: Record<string, number> = {
  findSumFromAverageAndCount: 18,
  findAverageFromSumAndCount: 18,
  findCountFromSumAndAverage: 18,
  findMissingValueFromAverage: 18,
  findAverageAfterUniformTransformation: 8,
};
for (const [mode, expected] of Object.entries(modeTargets)) {
  const actual = entries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) failures.push(`${mode}: ${actual}; expected ${expected}`);
}

const difficultyTargets = { Easy: 27, Medium: 27, Hard: 26 };
for (const [difficulty, expected] of Object.entries(difficultyTargets)) {
  const actual = entries.filter((entry) => entry.difficulty === difficulty).length;
  if (actual !== expected) failures.push(`${difficulty}: ${actual}; expected ${expected}`);
}

const normalizedStems = new Map<string, string>();
const placeholders = (template: string) => [...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!).sort();
const normalize = (template: string) => template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/[^a-z{}]+/g, " ").replace(/\s+/g, " ").trim();

for (const entry of entries) {
  const actualPlaceholders = [...new Set(placeholders(entry.template))].sort();
  if (JSON.stringify(actualPlaceholders) !== JSON.stringify([...entry.requiredVariables].sort())) failures.push(`${entry.qlId}: placeholder contract mismatch`);
  const normalized = normalize(entry.template);
  const prior = normalizedStems.get(normalized);
  if (prior) failures.push(`${entry.qlId}: duplicates normalized stem ${prior}`);
  normalizedStems.set(normalized, entry.qlId);
  const registry = getAvg001RegistryEntry(entry.qlId);
  if (registry.cpId !== entry.cpId || registry.qlId !== entry.qlId || registry.solveMode !== entry.solveMode || registry.answerType !== entry.answerType) failures.push(`${entry.qlId}: registry metadata mismatch`);
  if (JSON.stringify([...registry.requiredVariables].sort()) !== JSON.stringify([...entry.requiredVariables].sort())) failures.push(`${entry.qlId}: registry required-variable mismatch`);
}

const originalScenarioCounts = new Map<string, number>();
for (const entry of originalEntries) originalScenarioCounts.set(entry.scenarioVariant, (originalScenarioCounts.get(entry.scenarioVariant) ?? 0) + 1);
if (originalScenarioCounts.size !== 24) failures.push(`Original scenario variants: ${originalScenarioCounts.size}; expected 24`);
for (const [variant, count] of originalScenarioCounts) if (count !== 3) failures.push(`${variant}: ${count} original QLs; expected 3`);

for (const mode of Object.keys(modeTargets).filter((mode) => mode !== "findAverageAfterUniformTransformation")) {
  const strategyCounts = new Map<string, number>();
  for (const entry of originalEntries.filter((item) => item.solveMode === mode)) strategyCounts.set(entry.explanationStrategyId, (strategyCounts.get(entry.explanationStrategyId) ?? 0) + 1);
  if (strategyCounts.size !== 3) failures.push(`${mode}: ${strategyCounts.size} original explanation strategies; expected 3`);
  for (const [strategy, count] of strategyCounts) if (count !== 6) failures.push(`${mode}/${strategy}: ${count}; expected 6`);
}

console.log(JSON.stringify({ qlCount: entries.length, originalIdRange: [originalIds[0], originalIds.at(-1)], expansionIdRange: [expansionIds[0], expansionIds.at(-1)], modeCounts: Object.fromEntries(Object.keys(modeTargets).map((mode) => [mode, entries.filter((entry) => entry.solveMode === mode).length])), difficultyCounts: Object.fromEntries(Object.keys(difficultyTargets).map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])), uniqueStemCount: normalizedStems.size, failureCount: failures.length, failures }, null, 2));
assert.equal(entries.length, 80);
assert.equal(failures.length, 0, failures.join("\n"));
