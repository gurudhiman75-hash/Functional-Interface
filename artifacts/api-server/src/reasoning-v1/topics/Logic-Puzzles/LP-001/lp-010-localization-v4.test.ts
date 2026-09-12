import assert from "node:assert/strict";
import { solveLp010 } from "./lp-010.ts";
import {
  generateLp010LocalizedBatchV4,
  LP_010_HI_PA_LOCALIZATION_REVIEW_V4,
} from "./lp-010-localization-v4.ts";

for (const language of ["hi", "pa"] as const) {
  const caselets = generateLp010LocalizedBatchV4(language, "lp-010-localization-v4-proof", 100);
  assert.equal(caselets.length, 100);
  for (const caselet of caselets) {
    assert.equal(new Set(Object.values(caselet.labels.people)).size, 6);
    assert.deepEqual(solveLp010({ clues: caselet.clues }), [caselet.assignment]);
    assert.equal(caselet.labels.timePatternId, caselet.englishCaselet.labels.timePatternId);
    assert.ok((caselet.questionSetup.match(/;/gu) ?? []).length >= 5, `${language} ${caselet.caseletId} day-time domain is not clearly separated`);
    for (let index = 0; index < caselet.children.length; index += 1) {
      const child = caselet.children[index]!;
      const englishChild = caselet.englishCaselet.children[index]!;
      assert.equal(child.qlId, englishChild.qlId);
      assert.equal(child.correctIndex, englishChild.correctIndex);
      assert.equal(child.difficultyBand, englishChild.difficultyBand);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.ok(child.stem.startsWith(caselet.questionSetup));
      assert.equal(child.explanation.lines.length, caselet.clues.length + 1);
    }
  }
}

assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V4.supersedes, "LP_010_HI_PA_LOCALIZATION_REVIEW_V3");
assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V4.status, "HUMAN_REVIEW_CANDIDATE_V4");
console.log("LP-010 localization V4 passed: readable semicolon-separated day-time domains with V3 semantic/native guarantees retained.");
