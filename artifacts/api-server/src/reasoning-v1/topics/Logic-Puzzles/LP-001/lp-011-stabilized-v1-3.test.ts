import assert from "node:assert/strict";
import { solveLp011 } from "./lp-011.ts";
import {
  LP_011_STABILIZED_V1_3,
  generateLp011BatchStabilizedV1_3,
} from "./lp-011-stabilized-v1-3.ts";

const caselets = generateLp011BatchStabilizedV1_3("lp-011-v1-3-proof", 90);

assert.equal(LP_011_STABILIZED_V1_3.status, "HUMAN_REVIEW_CANDIDATE");
assert.equal(LP_011_STABILIZED_V1_3.changesPuzzleSemantics, false);
assert.equal(LP_011_STABILIZED_V1_3.changesQlSemantics, false);

const qls = ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"];
const difficulties = { Easy: 0, Medium: 0, Hard: 0 };
const profiles = new Set<string>();

for (const caselet of caselets) {
  difficulties[caselet.difficultyBand] += 1;
  profiles.add(caselet.scenarioProfileId);

  assert.doesNotMatch(caselet.scenario, /Five cartons|Each carton/u, `${caselet.caseletId} mixes cartons with Box labels.`);
  assert.doesNotMatch(caselet.scenario, /The five .* values are/u, `${caselet.caseletId} contains machine-facing 'values are' wording.`);
  assert.doesNotMatch(caselet.scenario, /is used exactly once/u, `${caselet.caseletId} contains mechanical uniqueness wording.`);

  const solved = solveLp011(caselet.clues, 2);
  assert.equal(solved.length, 1, `${caselet.caseletId} must remain uniquely solved after wording normalization.`);

  assert.deepEqual(caselet.children.map((child) => child.qlId), qls);
  for (const clue of caselet.clues) {
    assert.doesNotMatch(clue.text, /as its colour|as its subject/u, `${caselet.caseletId} has unnatural clue wording.`);
  }
  for (const child of caselet.children) {
    assert.equal(new Set(child.options).size, 4, `${child.questionId} must keep four distinct options.`);
    assert.equal(child.options[child.correctIndex], child.answer, `${child.questionId} answer/index mismatch.`);
    assert.doesNotMatch(child.stem, /belongs to Box|has .* as its colour|has .* as its subject/u, `${child.questionId} has unnatural stem wording.`);
    assert.ok(child.explanation.lines.some((line) => line.includes("final table")), `${child.questionId} must retain the final table explanation.`);
  }
}

assert.deepEqual(difficulties, { Easy: 30, Medium: 30, Hard: 30 });
assert.ok(profiles.size >= 5, `Expected at least five LP-011 scenario profiles, found ${profiles.size}.`);

console.log(`LP-011 V1.3 proof passed: ${caselets.length} caselets / ${caselets.length * 4} child questions.`);
console.log(`Profiles covered: ${profiles.size}; difficulty distribution: ${JSON.stringify(difficulties)}.`);
