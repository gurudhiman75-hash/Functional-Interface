import assert from "node:assert/strict";
import { evaluateDmDecision, rankDmCandidates } from "./decision-engine.ts";
import { buildDmCandidate, formatDmRequirement, generateDmQuestion } from "./generator.ts";
import { dmScenariosForCheckpoint } from "./scenario-library.ts";

const cutoffs = dmScenariosForCheckpoint("DM-CP-008").find((scenario) =>
  scenario.baseConditions.some((condition) => condition.field === "writtenScore")
  && scenario.baseConditions.some((condition) => condition.field === "sectionalScore"),
)!;
for (const condition of cutoffs.baseConditions) {
  if (typeof condition.value !== "number" || !["writtenScore", "sectionalScore", "interviewScore", "overallScore", "experienceYears"].includes(condition.field)) continue;
  for (const offset of [-2, -1, 0, 1, 2]) {
    const candidate = { ...buildDmCandidate(cutoffs, "BOUNDARY_PASS", 5, "en"), [condition.field]: condition.value + offset };
    const expected = condition.value + offset >= condition.value ? "SELECT" : "REJECT";
    assert.equal(evaluateDmDecision(candidate, cutoffs).outcome, expected, condition.field + " at cut-off offset " + offset);
  }
}

const relaxations = dmScenariosForCheckpoint("DM-CP-009");
for (const scenario of relaxations) {
  assert.equal(new Set(scenario.ruleNotes.map((note) => note.en)).size, scenario.ruleNotes.length, scenario.scenarioId + " must explain each relaxation separately");
  for (const [mode, ruleId] of [
    ["AGE_EXCEPTION", "AGE_EXPERIENCE_RELAXATION_REFER_COMMITTEE"],
    ["MARKS_EXCEPTION", "POSTGRADUATE_MARKS_RELAXATION_REFER_COMMITTEE"],
    ["BOTH_RELAXATION", "BOTH_RELAXATIONS_REFER_COMMITTEE"],
  ] as const) {
    const result = evaluateDmDecision(buildDmCandidate(scenario, mode, 19, "en"), scenario);
    assert.equal(result.outcome, "REFER_TO_COMMITTEE", scenario.scenarioId + " " + mode);
    assert.equal(result.matchedRuleId, ruleId, scenario.scenarioId + " priority path " + mode);
  }
}

const rankedScenario = dmScenariosForCheckpoint("DM-CP-010").find((scenario) =>
  scenario.ranking?.seatCount === 1 && scenario.ranking.priorityOrder[0]?.field === "qualificationRank",
)!;
const generated = generateDmQuestion({ scenario: rankedScenario, locale: "en", seed: 137, mode: "ALL_PASS" });
assert.ok(!generated.stem.includes("Two training seats"), "the context must not contradict the computed seat count");
const reversed = rankDmCandidates([...generated.candidateGroup!].reverse(), rankedScenario);
assert.deepEqual(reversed.selected.map((candidate) => candidate.name), generated.selectedCandidates);
assert.equal(
  generated.selectedCandidates![0],
  [...generated.candidateGroup!].sort((left, right) => right.qualificationRank! - left.qualificationRank!)[0]!.name,
  "the first published ranking criterion decides before candidate input order",
);
assert.equal(generated.options[generated.correctIndex], generated.selectedCandidates!.join(" and "));
for (const locale of ["en", "hi", "pa"] as const) {
  const stemForms = new Set(Array.from({ length: 18 }, (_, seed) =>
    generateDmQuestion({ scenario: rankedScenario, locale, seed, mode: "ALL_PASS" }).stem.split("\n").at(-1),
  ));
  assert.equal(stemForms.size, 18, locale + " should expose 18 distinct priority-selection stem forms");
}

const eligiblePool = generated.candidateGroup!.filter((candidate) => evaluateDmDecision(candidate, rankedScenario).outcome === "SELECT");
const winner = eligiblePool[0]!;
const tied = {
  ...winner,
  name: "Tie-break applicant",
  applicationOrder: Number(winner.applicationOrder) + 1,
};
const earlier = { ...winner, applicationOrder: Number(winner.applicationOrder) + 2 };
const tieResolved = rankDmCandidates([tied, earlier], rankedScenario);
assert.equal(tieResolved.selected[0]!.name, tied.name, "the explicit earlier-application tie-break decides the result, independent of input order");

const benefitScenario = dmScenariosForCheckpoint("DM-CP-007").find((scenario) =>
  scenario.baseConditions.some((condition) => condition.field === "familyIncome" && condition.operator === "LTE"),
)!;
const incomeCondition = benefitScenario.baseConditions.find((condition) => condition.field === "familyIncome")!;
for (const offset of [-1, 0, 1]) {
  const candidate = { ...buildDmCandidate(benefitScenario, "BOUNDARY_PASS", 4, "en"), familyIncome: Number(incomeCondition.value) + offset };
  assert.equal(evaluateDmDecision(candidate, benefitScenario).outcome, offset <= 0 ? "SELECT" : "REJECT", "fictional scheme income limit boundary");
}

assert.equal(dmScenariosForCheckpoint("DM-CP-007").length, 25);
assert.ok(dmScenariosForCheckpoint("DM-CP-007").every((scenario) => scenario.context.en.includes("fictional scheme")));
const employmentCondition = dmScenariosForCheckpoint("DM-CP-007")[0]!.baseConditions.find((condition) => condition.field === "employmentStatus")!;
assert.equal(formatDmRequirement(employmentCondition, "en"), "Employment status: student or unemployed");
console.log("DM-001 Wave 2 checks passed: cutoff boundaries, dependent relaxations, fictional benefit contexts and computed priority ranking.");