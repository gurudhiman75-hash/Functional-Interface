import assert from "node:assert/strict";
import { solveLp010 } from "./lp-010.ts";
import {
  generateLp010LocalizedBatchV3,
  LP_010_HI_PA_LOCALIZATION_REVIEW_V3,
} from "./lp-010-localization-v3.ts";

for (const language of ["hi", "pa"] as const) {
  const caselets = generateLp010LocalizedBatchV3(language, "lp-010-localization-v3-proof", 100);
  assert.equal(caselets.length, 100);
  assert.deepEqual(new Set(caselets.map((caselet) => caselet.labels.times.length)), new Set([2, 4, 5, 6]));

  for (const caselet of caselets) {
    assert.equal(new Set(Object.values(caselet.labels.people)).size, 6, `${language} ${caselet.caseletId} has duplicate display names`);
    assert.deepEqual(solveLp010({ clues: caselet.clues }), [caselet.assignment]);
    assert.equal(caselet.labels.timePatternId, caselet.englishCaselet.labels.timePatternId);
    assert.deepEqual(caselet.labels.slotTimes, caselet.englishCaselet.labels.slotTimes);
    assert.equal(caselet.children.length, 4);

    const englishNames = Object.values(caselet.englishCaselet.labels.people);
    if (language === "hi" && englishNames.includes("Eshan")) assert.ok(Object.values(caselet.labels.people).includes("एशान"));
    if (language === "hi" && englishNames.includes("Ishan")) assert.ok(Object.values(caselet.labels.people).includes("ईशान"));

    for (const clue of caselet.clues) {
      if (language === "hi") {
        assert.doesNotMatch(clue.text, /scheduled|before is|same time of day/iu);
        if (clue.kind === "PERSON_SLOT") assert.match(clue.text, /को .* (?:AM|PM) पर है।$/u);
      } else {
        assert.doesNotMatch(clue.text, /scheduled|before is|same time of day/iu);
        if (clue.kind === "PERSON_SLOT") assert.match(clue.text, /ਨੂੰ .* (?:AM|PM) ਵਜੇ ਹੈ।$/u);
      }
    }

    for (let index = 0; index < caselet.children.length; index += 1) {
      const child = caselet.children[index]!;
      const englishChild = caselet.englishCaselet.children[index]!;
      assert.equal(child.questionId, englishChild.questionId);
      assert.equal(child.qlId, englishChild.qlId);
      assert.equal(child.difficultyBand, englishChild.difficultyBand);
      assert.equal(child.correctIndex, englishChild.correctIndex);
      assert.equal(child.answer, child.options[child.correctIndex]);
      assert.equal(new Set(child.options).size, 4);
      for (const clue of caselet.clues) assert.ok(child.stem.includes(clue.text));
      assert.equal(child.explanation.lines.length, caselet.clues.length + 1);
      const evidence = child.explanation.lines.join("\n\n");
      assert.ok(evidence.includes(child.answer));
      assert.equal((evidence.match(/\|---\|---\|/gu) ?? []).length, caselet.clues.length + 1);
      if (language === "hi") {
        assert.match(child.stem, /शर्तें:/u);
        assert.match(evidence, /चरण 1:/u);
        assert.match(evidence, /पूरा क्रम/u);
      } else {
        assert.match(child.stem, /ਸ਼ਰਤਾਂ:/u);
        assert.match(evidence, /ਕਦਮ 1:/u);
        assert.match(evidence, /ਪੂਰਾ ਕ੍ਰਮ/u);
      }
    }
  }
}

assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V3.supersedes, "LP_010_HI_PA_LOCALIZATION_REVIEW_V2");
assert.equal(LP_010_HI_PA_LOCALIZATION_REVIEW_V3.status, "HUMAN_REVIEW_CANDIDATE_V3");
console.log("LP-010 localization V3 passed: native rendering, unique display names, semantic parity and progressive explanations across 200 caselets / 800 questions.");
