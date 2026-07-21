import { strict as assert } from "node:assert";
import coverage from "./coverage-targets.cp003.library.json";
import { getAvg001QuestionEntries } from "./foundation/library";

const entries = getAvg001QuestionEntries().filter(
  (entry) => entry.cpId === "AVG-CP-003",
);
const failures: string[] = [];

if (entries.length !== coverage.activeQlCount) {
  failures.push(`QL count ${entries.length}; expected ${coverage.activeQlCount}`);
}

const expectedIds = Array.from(
  { length: 86 },
  (_, index) => `AVG-QL-${String(index + 123).padStart(3, "0")}`,
);
if (
  JSON.stringify(entries.map((entry) => entry.qlId)) !==
  JSON.stringify(expectedIds)
) {
  failures.push("CP-003 QL IDs are not the stable AVG-QL-123–208 range");
}

for (const [mode, target] of Object.entries(coverage.solveModeTargets)) {
  const count = entries.filter((entry) => entry.solveMode === mode).length;
  if (count !== target) failures.push(`${mode}: ${count}; expected ${target}`);
}

for (const [difficulty, target] of Object.entries(
  coverage.difficultyTargets,
)) {
  const count = entries.filter(
    (entry) => entry.difficulty === difficulty,
  ).length;
  if (count !== target) {
    failures.push(`${difficulty}: ${count}; expected ${target}`);
  }
}

const ageShiftEntries = entries.filter(
  (entry) =>
    entry.scenarioVariant.includes("AfterYears") ||
    entry.scenarioVariant.includes("ElapsedYears"),
);
if (
  ageShiftEntries.length <
  coverage.requiredScenarioSubfamilies.ageShiftMinimum
) {
  failures.push(
    `Age-shift QLs: ${ageShiftEntries.length}; expected at least ${coverage.requiredScenarioSubfamilies.ageShiftMinimum}`,
  );
}

const cricketEntries = entries.filter(
  (entry) =>
    entry.solveMode === "findInningsValueOrNewCricketAverage",
);
if (cricketEntries.length !== coverage.requiredScenarioSubfamilies.cricket) {
  failures.push(
    `Cricket QLs: ${cricketEntries.length}; expected ${coverage.requiredScenarioSubfamilies.cricket}`,
  );
}

for (const variant of coverage.requiredScenarioSubfamilies
  .requiredVariants) {
  if (!entries.some((entry) => entry.scenarioVariant === variant)) {
    failures.push(`Missing required scenario variant ${variant}`);
  }
}

const exactTemplates = new Map<string, string[]>();
for (const entry of entries) {
  const normalized = entry.template.toLowerCase().replace(/\s+/g, " ").trim();
  const ids = exactTemplates.get(normalized) ?? [];
  ids.push(entry.qlId);
  exactTemplates.set(normalized, ids);
}
for (const [template, ids] of exactTemplates) {
  if (ids.length > 1) {
    failures.push(`Exact duplicate stem template: ${ids.join(", ")}`);
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      ageShiftQlCount: ageShiftEntries.length,
      cricketQlCount: cricketEntries.length,
      failureCount: failures.length,
      failures,
    },
    null,
    2,
  ),
);
assert.equal(failures.length, 0, failures.join("\n"));
