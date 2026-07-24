import { strict as assert } from "node:assert";
import { AVG_001_CP_DIFFICULTY_TARGETS } from "./foundation/difficulty-calibration";
import { getAvg001QuestionEntries, getAvg001RegistryEntry } from "./foundation/library";

const entries = getAvg001QuestionEntries().filter((entry) => entry.cpId === "AVG-CP-005");
const failures: string[] = [];
const expectedIds = Array.from({ length: 56 }, (_, index) => `AVG-QL-${String(index + 274).padStart(3, "0")}`);
const modeTargets: Record<string, number> = {
  findCorrectedAverageFromMistake: 10,
  findReportedAverageBeforeCorrection: 6,
  findCorrectValueFromAverageShift: 9,
  findIncorrectValueFromCorrection: 9,
  findEntryDifferenceFromAverageCorrection: 6,
  findAverageChangeFromEntryCorrection: 5,
  findNumberOfItemsFromTotalCorrection: 6,
  findCorrectedAverageFromMultipleMistakes: 5,
};
const difficultyTargets = AVG_001_CP_DIFFICULTY_TARGETS["AVG-CP-005"];

if (JSON.stringify(entries.map((entry) => entry.qlId)) !== JSON.stringify(expectedIds)) failures.push("CP-005 IDs are not AVG-QL-274–329");
for (const [mode, expected] of Object.entries(modeTargets)) {
  const family = entries.filter((entry) => entry.solveMode === mode);
  if (family.length !== expected) failures.push(`${mode}: ${family.length}; expected ${expected}`);
  if (new Set(family.map((entry) => entry.explanationStrategyId)).size < 3) failures.push(`${mode}: fewer than three explanation strategies`);
}
for (const [difficulty, expected] of Object.entries(difficultyTargets)) {
  const actual = entries.filter((entry) => entry.difficulty === difficulty).length;
  if (actual !== expected) failures.push(`${difficulty}: ${actual}; expected ${expected}`);
}

function placeholders(template: string) {
  return [...template.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!).sort();
}
function normalize(template: string) {
  return template.toLowerCase().replace(/\{[a-z0-9_]+\}/g, "{value}").replace(/[^a-z{}]+/g, " ").replace(/\s+/g, " ").trim();
}
const normalized = new Map<string, string>();
for (const entry of entries) {
  const actual = [...new Set(placeholders(entry.template))].sort();
  const required = [...entry.requiredVariables].sort();
  if (JSON.stringify(actual) !== JSON.stringify(required)) failures.push(`${entry.qlId}: placeholder contract mismatch`);
  const registry = getAvg001RegistryEntry(entry.qlId);
  if (registry.cpId !== entry.cpId || registry.solveMode !== entry.solveMode || registry.answerType !== entry.answerType || registry.difficulty !== entry.difficulty) failures.push(`${entry.qlId}: registry mismatch`);
  const key = normalize(entry.template);
  const prior = normalized.get(key);
  if (prior) failures.push(`${entry.qlId}: normalized duplicate of ${prior}`);
  normalized.set(key, entry.qlId);
}

console.log(JSON.stringify({ qlCount: entries.length, idRange: [entries[0]?.qlId, entries.at(-1)?.qlId], modeCounts: Object.fromEntries(Object.keys(modeTargets).map((mode) => [mode, entries.filter((entry) => entry.solveMode === mode).length])), difficultyCounts: Object.fromEntries(Object.keys(difficultyTargets).map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length])), uniqueNormalizedStems: normalized.size, failures, status: failures.length ? "FAIL" : "PASS" }, null, 2));
assert.equal(entries.length, 56);
assert.equal(failures.length, 0, failures.join("\n"));
