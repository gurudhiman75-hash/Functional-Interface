import assert from "node:assert/strict";
import { generateLpCp04LocalizedBatchV3, LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3 } from "./lp-cp04-localization-v3.ts";

assert.equal(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3.status, "HUMAN_REVIEW_CANDIDATE_V3");
assert.deepEqual(LP_CP04_HI_PA_LOCALIZATION_REVIEW_V3.permanentQlIds, ["LP-QL-047"]);

for (const language of ["hi", "pa"] as const) {
  const batch = generateLpCp04LocalizedBatchV3(language, `lp-cp04-localization-v3-proof:${language}`, 18);
  for (const caselet of batch) {
    const source: any = caselet.englishCaselet;
    if (caselet.parentTopology === "LP-001_GROUPING") {
      const forbidden = language === "hi"
        ? /इन छह व्यक्तियों के नाम हैं:|तीन समूह हैं:|प्रत्येक व्यक्ति को केवल एक समूह/gu
        : /ਇਨ੍ਹਾਂ ਛੇ ਵਿਅਕਤੀਆਂ ਦੇ ਨਾਮ ਹਨ:|ਤਿੰਨ ਸਮੂਹ ਹਨ:|ਹਰ ਵਿਅਕਤੀ ਨੂੰ ਕੇਵਲ ਇੱਕ ਸਮੂਹ/gu;
      assert.equal(forbidden.test(caselet.scenario), false, `${language}:${caselet.caseletId}: stale metadata-style setup`);
      for (const person of source.people) assert.ok(caselet.scenario.includes(person), `${language}:${caselet.caseletId}: missing person ${person}`);
      const groupLabels = Object.values(source.groupLabels) as string[];
      assert.equal(groupLabels.length, 3);
    }
    assert.equal(caselet.counterfactualChild.correctIndex, source.counterfactualChild.correctIndex);
    assert.equal(caselet.counterfactualChild.qlId, "LP-QL-047");
  }
}

console.log("LP-QL-047 localization V3 native setup polish passed; semantic routing unchanged.");
