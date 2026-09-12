import assert from "node:assert/strict";
import { solveLp010 } from "./lp-010.ts";
import {
  generateLp010LocalizedBatchV2,
  LP_010_HI_PA_LOCALIZATION_REVIEW_V2,
} from "./lp-010-localization-v2.ts";

for (const language of ["hi", "pa"] as const) {
  const caselets = generateLp010LocalizedBatchV2(language, "lp-010-localization-v2-proof", 100);
  assert.equal(caselets.length, 100);
  assert.deepEqual(new Set(caselets.map((caselet) => caselet.labels.times.length)), new Set([2, 4, 5, 6]));

  for (const caselet of caselets) {
    assert.deepEqual(solveLp010({ clues: caselet.clues }), [caselet.assignment]);
    assert.equal(caselet.labels.timePatternId, caselet.englishCaselet.labels.timePatternId);
    assert.deepEqual(caselet.labels.slotTimes, caselet.englishCaselet.labels.slotTimes);
    assert.equal(caselet.children.length, 4);

    if (language === "hi") {
      assert.match(caselet.questionSetup, /इनके नाम/u);
      assert.match(caselet.questionSetup, /प्रत्येक व्यक्ति को एक अलग स्थान दिया गया है/u);
      assert.doesNotMatch(caselet.questionSetup, /विद्यार्थीों|अधिकारीों|शोधकर्ताों/u);
    } else {
      assert.match(caselet.questionSetup, /ਇਨ੍ਹਾਂ ਦੇ ਨਾਮ/u);
      assert.match(caselet.questionSetup, /ਹਰੇਕ ਵਿਅਕਤੀ ਨੂੰ ਇੱਕ ਵੱਖਰਾ ਸਥਾਨ ਦਿੱਤਾ ਗਿਆ ਹੈ/u);
      assert.doesNotMatch(caselet.questionSetup, /ਉਮੀਦਵਾਰਆਂ|ਅਧਿਕਾਰੀਆਂਆਂ/u);
    }

    for (let index = 0; index < caselet.children.length; index += 1) {
      const child = caselet.children[index]!;
      const englishChild = caselet.englishCaselet.children[index]!;
      assert.equal(child.qlId, englishChild.qlId);
      assert.equal(child.correctIndex, englishChild.correctIndex);
      assert.equal(child.difficultyBand, englishChild.difficultyBand);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.ok(child.explanation.lines.join("\n").includes(child.answer));
      if (child.qlId === "LP-QL-039") {
        if (language === "hi") assert.match(child.stem, /दो व्यक्तियों के दिन और समय/u);
        else assert.match(child.stem, /ਦੋ ਵਿਅਕਤੀਆਂ ਦੇ ਦਿਨ ਅਤੇ ਸਮੇਂ/u);
      }
    }
  }
}

assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V2.supersedes, "LP_010_HI_PA_LOCALIZATION_REVIEW_V1");
assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V2.status, "HUMAN_REVIEW_CANDIDATE_V2");
console.log("LP-010 localization V2 wording proof passed for 200 caselets / 800 questions.");
