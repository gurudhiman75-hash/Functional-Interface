import assert from "node:assert/strict";
import { generateLp010LocalizedBatchV6 } from "./lp-010-localization-v6.ts";
import { LP_010_HI_PA_LOCALIZATION_FREEZE_V6 } from "./lp-010-localization-freeze-v6.ts";

assert.equal(LP_010_HI_PA_LOCALIZATION_FREEZE_V6.sourceEnglishAuthorityId, "LP_010_ENGLISH_FREEZE_V1");
assert.equal(LP_010_HI_PA_LOCALIZATION_FREEZE_V6.sourceLocalizationAuthorityId, "LP_010_HI_PA_LOCALIZATION_REVIEW_V6");
assert.deepEqual(LP_010_HI_PA_LOCALIZATION_FREEZE_V6.permanentQlIds, ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"]);
assert.deepEqual(LP_010_HI_PA_LOCALIZATION_FREEZE_V6.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(LP_010_HI_PA_LOCALIZATION_FREEZE_V6.localizationFreezeStatus, "FROZEN_V6");
assert.equal(LP_010_HI_PA_LOCALIZATION_FREEZE_V6.questionStudioLanguageActivation, "ALLOWED_AFTER_INTEGRATION_PROOF");

for (const language of ["hi", "pa"] as const) {
  const caselets = generateLp010LocalizedBatchV6(language, "lp-010-localization-freeze-v6", 100);
  assert.equal(caselets.length, 100);
  assert.deepEqual(new Set(caselets.map((caselet) => caselet.labels.times.length)), new Set([2, 4, 5, 6]));

  for (const caselet of caselets) {
    const english = caselet.englishCaselet;
    assert.deepEqual(caselet.assignment, english.assignment, `${caselet.caseletId} assignment drifted`);
    assert.equal(caselet.difficultyBand, english.difficultyBand, `${caselet.caseletId} difficulty drifted`);
    assert.equal(caselet.labels.timePatternId, english.labels.timePatternId, `${caselet.caseletId} time pattern drifted`);
    assert.deepEqual(caselet.labels.times, english.labels.times, `${caselet.caseletId} clock-time set drifted`);
    assert.equal(new Set(Object.values(caselet.labels.people)).size, 6, `${caselet.caseletId} localized names are not unique`);
    assert.match(caselet.questionSetup, language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u);

    assert.equal(caselet.children.length, english.children.length);
    for (let index = 0; index < caselet.children.length; index += 1) {
      const child = caselet.children[index]!;
      const source = english.children[index]!;
      assert.equal(child.qlId, source.qlId, `${child.questionId} QL drifted`);
      assert.equal(child.difficultyBand, source.difficultyBand, `${child.questionId} difficulty drifted`);
      assert.equal(child.correctIndex, source.correctIndex, `${child.questionId} answer position drifted`);
      assert.equal(child.options[child.correctIndex], child.answer, `${child.questionId} localized answer mismatch`);
      assert.match(child.stem, language === "hi" ? /शर्तें:/u : /ਸ਼ਰਤਾਂ:/u);
      const evidence = child.explanation.lines.join("\n\n");
      assert.match(evidence, /\|---\|---\|/u, `${child.questionId} lost progressive tables`);
      assert.ok(evidence.includes(child.answer), `${child.questionId} explanation no longer states the localized answer`);
      assert.doesNotMatch(evidence, /option analysis|shortcut|trap|use all the clues|apply all the clues/iu);
    }
  }
}

console.log("LP-010 localization freeze V6 passed: Hindi/Punjabi preserve frozen English semantics, 2/4/5/6-time layouts, QLs, difficulties, answer positions and progressive explanations.");
