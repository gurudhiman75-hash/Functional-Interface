import assert from "node:assert/strict";
import { generateLpCp03Batch, LP_CP03_POSSIBILITY_SET_V1, type LpCp03Caselet } from "./lp-cp03-possibility-set-v1.ts";

function truthCount(caselet: LpCp03Caselet, option: string): number {
  for (const person of caselet.people) {
    for (const group of caselet.groups) {
      if (`${person} is assigned to ${caselet.groupLabels[group]}.` !== option) continue;
      return caselet.validStates.filter((state) => state[person] === group).length;
    }
  }
  throw new Error(`Unknown option: ${option}`);
}

assert.equal(LP_CP03_POSSIBILITY_SET_V1.status, "HUMAN_REVIEW_CANDIDATE");
assert.equal(LP_CP03_POSSIBILITY_SET_V1.permanentQlId, null);
assert.equal(LP_CP03_POSSIBILITY_SET_V1.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_CP03_POSSIBILITY_SET_V1.questionBankWritable, false);
assert.equal(LP_CP03_POSSIBILITY_SET_V1.testEligible, false);
assert.equal(LP_CP03_POSSIBILITY_SET_V1.publicPublication, false);

const caselets = generateLpCp03Batch("lp-cp03-proof", 60);
assert.equal(caselets.length, 60);

const stateCounts = new Set<number>();
const correctIndexes = [0, 0, 0, 0];
const modeCounts = new Map<string, number>();
const scenarioProfiles = new Set<string>();

for (const caselet of caselets) {
  assert.ok(caselet.validStates.length >= 2 && caselet.validStates.length <= 6, `${caselet.caseletId}: expected 2..6 valid states`);
  stateCounts.add(caselet.validStates.length);
  assert.ok(caselet.clues.length >= 3, `${caselet.caseletId}: too few displayed clues`);
  assert.equal(caselet.children.length, 3);
  assert.match(caselet.scenario, /The six people are/u);
  assert.match(caselet.scenario, /The three two-person groups are/u);
  assert.match(caselet.scenario, /Each person is assigned to exactly one group/u);

  for (const child of caselet.children) {
    modeCounts.set(child.queryMode, (modeCounts.get(child.queryMode) ?? 0) + 1);
    assert.equal(child.options.length, 4);
    assert.equal(new Set(child.options).size, 4);
    assert.ok(child.correctIndex >= 0 && child.correctIndex <= 3);
    correctIndexes[child.correctIndex] += 1;
    assert.equal(child.answer, child.options[child.correctIndex]);
    assert.ok(child.explanation.lines.some((line) => line.includes("Possible case")), `${child.questionId}: case tables missing`);

    const semanticTruth = child.options.map((option) => truthCount(caselet, option));
    let semanticCorrectIndexes: number[];
    if (child.queryMode === "COULD_BE_TRUE") semanticCorrectIndexes = semanticTruth.map((count, index) => count > 0 ? index : -1).filter((index) => index >= 0);
    else if (child.queryMode === "CANNOT_BE_TRUE") semanticCorrectIndexes = semanticTruth.map((count, index) => count === 0 ? index : -1).filter((index) => index >= 0);
    else semanticCorrectIndexes = semanticTruth.map((count, index) => count === caselet.validStates.length ? index : -1).filter((index) => index >= 0);

    assert.deepEqual(semanticCorrectIndexes, [child.correctIndex], `${child.questionId}: semantic correct option mismatch`);
  }

  // Collect a rough scenario signature to guard against one repeated object surface.
  scenarioProfiles.add(caselet.scenario.split(".")[0] ?? caselet.scenario);
}

assert.equal(modeCounts.get("COULD_BE_TRUE"), 60);
assert.equal(modeCounts.get("CANNOT_BE_TRUE"), 60);
assert.equal(modeCounts.get("MUST_BE_TRUE"), 60);
assert.ok(stateCounts.size >= 2, "Expected more than one valid-state count across the review batch.");
assert.ok(scenarioProfiles.size >= 4, "Expected multiple scenario profiles.");
assert.ok(correctIndexes.every((count) => count > 20), `Answer positions are too concentrated: ${correctIndexes.join(", ")}`);

console.log(`LP CP03 possibility-set proof passed: ${caselets.length} caselets / ${caselets.length * 3} children; state counts ${[...stateCounts].sort().join(", ")}; correct positions ${correctIndexes.join("/")}.`);
