import assert from "node:assert/strict";
import { generateLp006ProjectionBatchV1 } from "./lp-006-projection-extension-v1.ts";
import {
  LP_006_PROJECTION_EXTENSION_V2,
  generateLp006ProjectionBatchV2,
} from "./lp-006-projection-extension-v2.ts";

const seed = "lp-006-projection-v2-proof";
const count = 72;
const v1 = generateLp006ProjectionBatchV1(seed, count);
const v2 = generateLp006ProjectionBatchV2(seed, count);

assert.equal(LP_006_PROJECTION_EXTENSION_V2.status, "PROVISIONAL_REVIEW_CANDIDATE");
assert.deepEqual(LP_006_PROJECTION_EXTENSION_V2.provisionalQlIds, ["LP-QL-045", "LP-QL-046"]);
assert.equal(v1.length, v2.length);

for (let index = 0; index < count; index += 1) {
  const before = v1[index]!;
  const after = v2[index]!;
  assert.deepEqual(after.assignment, before.assignment);
  assert.deepEqual(after.clues, before.clues);
  assert.equal(after.questionSetup, before.questionSetup);
  assert.equal(after.projectionChildren.length, before.projectionChildren.length);

  for (let childIndex = 0; childIndex < before.projectionChildren.length; childIndex += 1) {
    const oldChild = before.projectionChildren[childIndex]!;
    const newChild = after.projectionChildren[childIndex]!;
    assert.equal(newChild.qlId, oldChild.qlId);
    assert.equal(newChild.stem, oldChild.stem);
    assert.deepEqual(newChild.options, oldChild.options);
    assert.equal(newChild.correctIndex, oldChild.correctIndex);
    assert.equal(newChild.answer, oldChild.answer);
    assert.deepEqual(newChild.proof, oldChild.proof);

    const numberedSteps = newChild.explanation.lines.filter((line) => /^\*\*Step \d+\*\*/u.test(line));
    if (numberedSteps.length) {
      assert.match(numberedSteps[0]!, /^\*\*Step 1\*\*\n\nStart with this clue:/u);
      for (const later of numberedSteps.slice(1)) {
        assert.doesNotMatch(later, /\n\nStart with this clue:/u);
      }
    }
  }
}

console.log(`LP-006 projection V2 proof passed: ${count} caselets / ${count * 2} projection questions.`);
console.log("Hidden state, clues, stems, options, answers and proof metadata are unchanged from V1.");
