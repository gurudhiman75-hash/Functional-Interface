import { strict as assert } from "node:assert";
import {
  getAvg001QuestionEntries,
  getAvg001RegistryEntry,
} from "./foundation/library";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-001",
);
const failures: string[] = [];

const expectedIds = Array.from({ length: 72 }, (_, index) =>
  `AVG-QL-${String(index + 1).padStart(3, "0")}`,
);
if (JSON.stringify(entries.map((entry) => entry.qlId)) !== JSON.stringify(expectedIds)) {
  failures.push("CP-001 QL IDs are not the stable AVG-QL-001–072 range");
}

const expectedModeCounts: Record<string, number> = {
  findSumFromAverageAndCount: 18,
  findAverageFromSumAndCount: 18,
  findCountFromSumAndAverage: 18,
  findMissingValueFromAverage: 18,
};
for (const [mode, expected] of Object.entries(expectedModeCounts)) {
  const actual = entries.filter((entry) => entry.solveMode === mode).length;
  if (actual !== expected) failures.push(`${mode}: ${actual}; expected ${expected}`);
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const actual = entries.filter((entry) => entry.difficulty === difficulty).length;
  if (actual !== 24) failures.push(`${difficulty}: ${actual}; expected 24`);
}

const scenarioCounts = new Map<string, number>();
const normalizedStems = new Map<string, string>();
const placeholders = (template: string) =>
  [...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!).sort();
const normalize = (template: string) =>
  template
    .toLowerCase()
    .replace(/\{[a-z0-9_]+\}/g, "{value}")
    .replace(/[^a-z{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

for (const entry of entries) {
  scenarioCounts.set(
    entry.scenarioVariant,
    (scenarioCounts.get(entry.scenarioVariant) ?? 0) + 1,
  );

  const actualPlaceholders = [...new Set(placeholders(entry.template))].sort();
  const required = [...entry.requiredVariables].sort();
  if (JSON.stringify(actualPlaceholders) !== JSON.stringify(required)) {
    failures.push(`${entry.qlId}: placeholder contract mismatch`);
  }

  const normalized = normalize(entry.template);
  const prior = normalizedStems.get(normalized);
  if (prior) failures.push(`${entry.qlId}: duplicates normalized stem ${prior}`);
  normalizedStems.set(normalized, entry.qlId);

  const registry = getAvg001RegistryEntry(entry.qlId);
  for (const field of [
    "cpId",
    "qlId",
    "taskKind",
    "solveMode",
    "difficulty",
    "answerType",
    "contextDomain",
    "scenarioVariant",
    "explanationStrategyId",
    "displayPolicy",
    "active",
    "finalContext",
  ] as const) {
    if (registry[field] !== entry[field]) {
      failures.push(`${entry.qlId}: registry mismatch for ${field}`);
    }
  }
  if (
    JSON.stringify([...registry.requiredVariables].sort()) !==
    JSON.stringify([...entry.requiredVariables].sort())
  ) {
    failures.push(`${entry.qlId}: registry required-variable mismatch`);
  }
  if (
    JSON.stringify(registry.distractorStrategyIds) !==
    JSON.stringify(entry.distractorStrategyIds)
  ) {
    failures.push(`${entry.qlId}: registry distractor mismatch`);
  }
}

if (scenarioCounts.size !== 24) {
  failures.push(`Scenario variants: ${scenarioCounts.size}; expected 24`);
}
for (const [variant, count] of scenarioCounts) {
  if (count !== 3) failures.push(`${variant}: ${count} QLs; expected 3`);
}

for (const mode of Object.keys(expectedModeCounts)) {
  const modeEntries = entries.filter((entry) => entry.solveMode === mode);
  const strategyCounts = new Map<string, number>();
  for (const entry of modeEntries) {
    strategyCounts.set(
      entry.explanationStrategyId,
      (strategyCounts.get(entry.explanationStrategyId) ?? 0) + 1,
    );
  }
  if (strategyCounts.size !== 3) {
    failures.push(`${mode}: ${strategyCounts.size} explanation strategies; expected 3`);
  }
  for (const [strategy, count] of strategyCounts) {
    if (count !== 6) failures.push(`${mode}/${strategy}: ${count}; expected 6`);
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      stableIdRange: [expectedIds[0], expectedIds.at(-1)],
      modeCounts: Object.fromEntries(
        Object.keys(expectedModeCounts).map((mode) => [
          mode,
          entries.filter((entry) => entry.solveMode === mode).length,
        ]),
      ),
      difficultyCounts: Object.fromEntries(
        ["Easy", "Medium", "Hard"].map((difficulty) => [
          difficulty,
          entries.filter((entry) => entry.difficulty === difficulty).length,
        ]),
      ),
      scenarioVariantCount: scenarioCounts.size,
      uniqueStemCount: normalizedStems.size,
      failureCount: failures.length,
      failures,
    },
    null,
    2,
  ),
);

assert.equal(entries.length, 72);
assert.equal(failures.length, 0, failures.join("\n"));
