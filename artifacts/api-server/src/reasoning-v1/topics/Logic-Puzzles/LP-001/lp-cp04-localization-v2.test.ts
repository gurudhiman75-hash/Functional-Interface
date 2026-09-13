import assert from "node:assert/strict";
import { generateLpCp04LocalizedBatchV1 } from "./lp-cp04-localization-v1.ts";
import { generateLpCp04LocalizedBatchV2, LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2 } from "./lp-cp04-localization-v2.ts";

assert.equal(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2.status, "HUMAN_REVIEW_CANDIDATE_V2");
assert.deepEqual(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V2.permanentQlIds, ["LP-QL-047"]);

for (const language of ["hi", "pa"] as const) {
  const seed = `lp-cp04-localization-v2-proof:${language}`;
  const v1 = generateLpCp04LocalizedBatchV1(language, seed, 18);
  const v2 = generateLpCp04LocalizedBatchV2(language, seed, 18);
  assert.equal(v2.length, v1.length);

  for (let index = 0; index < v2.length; index += 1) {
    const before = v1[index]!;
    const after = v2[index]!;
    assert.equal(after.caseletId, before.caseletId);
    assert.equal(after.parentTopology, before.parentTopology);
    assert.equal(after.difficultyBand, before.difficultyBand);
    assert.equal(after.counterfactualChild.qlId, "LP-QL-047");
    assert.equal(after.counterfactualChild.correctIndex, before.counterfactualChild.correctIndex);
    assert.equal(after.counterfactualChild.options.length, before.counterfactualChild.options.length);
    assert.deepEqual(after.englishCaselet, before.englishCaselet);

    const text = [after.scenario, ...after.learnerFacingClues, after.counterfactualChild.stem, ...after.counterfactualChild.options, after.counterfactualChild.explanation.summary, ...after.counterfactualChild.explanation.lines].join("\n");
    assert.doesNotMatch(text, /छह व्यक्ति हैं:|सात व्यक्ति हैं:/u);
    assert.doesNotMatch(text, /ਛੇ ਵਿਅਕਤੀ ਹਨ:|ਸੱਤ ਵਿਅਕਤੀ ਹਨ:/u);
    if (language === "hi") {
      assert.doesNotMatch(text, /[A-Za-z]+ चुना जाता है|[A-Za-z]+ चुना गया है|[A-Za-z]+ नहीं चुना गया है/u);
    } else {
      assert.doesNotMatch(text, /[A-Za-z]+ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ|[A-Za-z]+ ਚੁਣਿਆ ਗਿਆ ਹੈ|[A-Za-z]+ ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ ਹੈ/u);
    }
  }
}

console.log("LP-QL-047 localization V2 native editorial guards passed without semantic changes.");
