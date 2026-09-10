import assert from "node:assert/strict";
import { generateLp009LocalizedBatchV3 } from "./lp-009-localization-v3.ts";
import { LP_009_HI_PA_LOCALIZATION_FREEZE_V3 } from "./lp-009-localization-freeze-v3.ts";

assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.status, "HI_PA_HUMAN_REVIEWED_V3_LOCALIZATION_FROZEN");
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.approvedOn, "2026-09-10");
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.approvalBasis, "EXPLICIT_HUMAN_REVIEW_APPROVAL");
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.approvalRecord, "LP-009-HI-PA-LOCALIZATION-APPROVAL-V3");
assert.deepEqual(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.permanentQlIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.questionBankWritable, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.testEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.mockTestEligible, false);
assert.equal(LP_009_HI_PA_LOCALIZATION_FREEZE_V3.publiclyPublishable, false);

for (const language of ["hi", "pa"] as const) {
  const caselets = generateLp009LocalizedBatchV3(language, `lp-009-freeze-v3:${language}`, 100);
  assert.equal(caselets.length, 100);
  assert.equal(caselets.flatMap((caselet) => caselet.children).length, 400);
  for (const caselet of caselets) {
    assert.equal(caselet.language, language);
    assert.equal(caselet.children.length, 4);
    assert.deepEqual(caselet.assignment, caselet.englishCaselet.assignment);
    assert.equal(caselet.difficultyBand, caselet.englishCaselet.difficultyBand);
    for (let index = 0; index < caselet.children.length; index += 1) {
      const child = caselet.children[index]!;
      const englishChild = caselet.englishCaselet.children[index]!;
      assert.equal(child.qlId, englishChild.qlId);
      assert.equal(child.correctIndex, englishChild.correctIndex);
      assert.equal(child.explanation.lines.length, englishChild.explanation.lines.length);
      assert.match(child.explanation.lines.join("\n"), /\|---\|---\|/u);
      assert.doesNotMatch(child.explanation.lines.join("\n"), /option\s*[A-D]|विकल्प\s*[A-D]|ਚੋਣ\s*[A-D]/iu);
    }
  }
}

console.log("LP-009 Hindi/Punjabi localization Freeze V3 passed: explicit human approval, 800 localized questions, frozen semantic parity, progressive explanations and downstream lifecycle locks are green.");
