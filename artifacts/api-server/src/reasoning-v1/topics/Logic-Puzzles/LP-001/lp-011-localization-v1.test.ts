import assert from "node:assert/strict";
import { solveLp011 } from "./lp-011.ts";
import { generateLp011BatchStabilizedV1_3 } from "./lp-011-stabilized-v1-3.ts";
import { generateLp011LocalizedBatchV1, LP_011_HI_PA_LOCALIZATION_REVIEW_V1 } from "./lp-011-localization-v1.ts";

assert.equal(LP_011_HI_PA_LOCALIZATION_REVIEW_V1.status, "HUMAN_REVIEW_CANDIDATE_V1");
assert.deepEqual(LP_011_HI_PA_LOCALIZATION_REVIEW_V1.permanentQlIds, ["LP-QL-041", "LP-QL-042", "LP-QL-043", "LP-QL-044"]);

const seed = "lp-011-localization-parity";
const count = 36;
const english = generateLp011BatchStabilizedV1_3(seed, count);

for (const language of ["hi", "pa"] as const) {
  const localized = generateLp011LocalizedBatchV1(language, seed, count);
  assert.equal(localized.length, english.length);

  for (let index = 0; index < count; index += 1) {
    const source = english[index]!;
    const candidate = localized[index]!;
    assert.equal(candidate.language, language);
    assert.equal(candidate.caseletId, source.caseletId);
    assert.equal(candidate.scenarioProfileId, source.scenarioProfileId);
    assert.equal(candidate.difficultyBand, source.difficultyBand);
    assert.deepEqual(candidate.assignment, source.assignment);
    assert.deepEqual(candidate.clues.map(({ text: _text, ...rest }) => rest), source.clues.map(({ text: _text, ...rest }) => rest));
    assert.equal(solveLp011(candidate.clues, 2).length, 1, `${candidate.caseletId}: localized clues lost unique semantics`);
    assert.equal(candidate.children.length, 4);

    assert.doesNotMatch(candidate.scenario, /Which|from bottom|Each box|different colour|different item/u);
    for (let childIndex = 0; childIndex < 4; childIndex += 1) {
      const before = source.children[childIndex]!;
      const child = candidate.children[childIndex]!;
      assert.equal(child.qlId, before.qlId);
      assert.equal(child.correctIndex, before.correctIndex);
      assert.equal(child.difficultyBand, before.difficultyBand);
      assert.equal(new Set(child.options).size, 4, `${child.questionId}: localized duplicate options`);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.doesNotMatch(child.stem, /Which|At which|from the bottom|Box [A-E]|colour belongs|subject belongs/u);
      assert.ok(child.explanation.lines.some((line) => line.includes("|")), `${child.questionId}: localized final table missing`);
      assert.ok(child.explanation.lines.some((line) => line.includes(child.answer)), `${child.questionId}: localized answer not explained`);
    }
  }
}

console.log(`LP-011 localization V1 parity passed: ${count} English caselets rebuilt in Hindi and Punjabi with stable semantics and answer indexes.`);
