import { strict as assert } from "node:assert";
import coverage from "./coverage-targets.cp003.library.json";
import { AVG_001_CP_DIFFICULTY_TARGETS } from "./foundation/difficulty-calibration";
import { getAvg001QuestionEntries } from "./foundation/library";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-003");
const originalEntries = entries.filter((entry) => Number(entry.qlId.slice(-3)) >= 123 && Number(entry.qlId.slice(-3)) <= 208);
const expansionEntries = entries.filter((entry) => Number(entry.qlId.slice(-3)) >= 394 && Number(entry.qlId.slice(-3)) <= 405);
const failures: string[] = [];

if (originalEntries.length !== coverage.activeQlCount) failures.push(`Original QL count ${originalEntries.length}; expected ${coverage.activeQlCount}`);
const originalIds = Array.from({ length: 86 }, (_, index) => `AVG-QL-${String(index + 123).padStart(3, "0")}`);
const expansionIds = Array.from({ length: 12 }, (_, index) => `AVG-QL-${String(index + 394).padStart(3, "0")}`);
if (JSON.stringify(originalEntries.map((entry) => entry.qlId)) !== JSON.stringify(originalIds)) failures.push("CP-003 original IDs changed");
if (JSON.stringify(expansionEntries.map((entry) => entry.qlId)) !== JSON.stringify(expansionIds)) failures.push("CP-003 expansion IDs are not AVG-QL-394–405");

for (const [mode, target] of Object.entries(coverage.solveModeTargets)) {
  const count = originalEntries.filter((entry) => entry.solveMode === mode).length;
  if (count !== target) failures.push(`${mode}: ${count}; expected ${target}`);
}
const expansionModeTargets = { findOriginalCountFromJoiningMemberShift: 6, findOriginalCountFromLeavingMemberShift: 6 };
for (const [mode, target] of Object.entries(expansionModeTargets)) {
  const count = expansionEntries.filter((entry) => entry.solveMode === mode).length;
  if (count !== target) failures.push(`${mode}: ${count}; expected ${target}`);
}

const difficultyTargets = AVG_001_CP_DIFFICULTY_TARGETS["AVG-CP-003"];
for (const [difficulty, target] of Object.entries(difficultyTargets)) {
  const count = entries.filter((entry) => entry.difficulty === difficulty).length;
  if (count !== target) failures.push(`${difficulty}: ${count}; expected ${target}`);
}

const ageShiftEntries = originalEntries.filter((entry) => entry.scenarioVariant.includes("AfterYears") || entry.scenarioVariant.includes("ElapsedYears"));
if (ageShiftEntries.length < coverage.requiredScenarioSubfamilies.ageShiftMinimum) failures.push(`Age-shift QLs: ${ageShiftEntries.length}; expected at least ${coverage.requiredScenarioSubfamilies.ageShiftMinimum}`);
const cricketEntries = originalEntries.filter((entry) => entry.solveMode === "findInningsValueOrNewCricketAverage");
if (cricketEntries.length !== coverage.requiredScenarioSubfamilies.cricket) failures.push(`Cricket QLs: ${cricketEntries.length}; expected ${coverage.requiredScenarioSubfamilies.cricket}`);
for (const variant of coverage.requiredScenarioSubfamilies.requiredVariants) if (!originalEntries.some((entry) => entry.scenarioVariant === variant)) failures.push(`Missing required original scenario variant ${variant}`);

const exactTemplates = new Map<string, string[]>();
for (const entry of entries) {
  const normalized = entry.template.toLowerCase().replace(/\s+/g, " ").trim();
  const ids = exactTemplates.get(normalized) ?? [];
  ids.push(entry.qlId);
  exactTemplates.set(normalized, ids);
}
for (const ids of exactTemplates.values()) if (ids.length > 1) failures.push(`Exact duplicate stem template: ${ids.join(", ")}`);

console.log(JSON.stringify({ qlCount: entries.length, originalQlCount: originalEntries.length, expansionQlCount: expansionEntries.length, difficultyCounts: Object.fromEntries(Object.keys(difficultyTargets).map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])), ageShiftQlCount: ageShiftEntries.length, cricketQlCount: cricketEntries.length, failureCount: failures.length, failures }, null, 2));
assert.equal(entries.length, 98);
assert.equal(failures.length, 0, failures.join("\n"));
