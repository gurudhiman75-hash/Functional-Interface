import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp008ReviewV3, GEO_RIV_001_CP008_QL_IDS_V3 } from "./geo-riv-001-cp008-review-generator-v3";

let auditedQuestions = 0;
let falseExplanationCount = 0;

for (const qlId of GEO_RIV_001_CP008_QL_IDS_V3) {
  for (let index = 0; index < 140; index += 1) {
    const seed = `cp008-v3-stress-${qlId}-${index}`;
    const question = generateGeoRiv001Cp008ReviewV3(qlId, seed);
    const replay = generateGeoRiv001Cp008ReviewV3(qlId, seed);
    assert.deepEqual(replay, question, `Non-deterministic V3 generation for ${qlId}/${seed}`);
    assert.equal(question.questionId.startsWith("GEO-RIV-001-CP008-V3-"), true);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.upstreamFactIds.some((id) => id.includes("cp006")), false);

    if (qlId === "GEO-RIV-001-QL-072" || qlId === "GEO-RIV-001-QL-073") {
      assert.equal(/is incorrect:\s|Incorrect —/.test(question.explanation), false, `Ambiguous false-statement explanation in ${question.questionId}: ${question.explanation}`);
      if (/incorrect/i.test(question.explanation)) {
        falseExplanationCount += 1;
        assert.match(question.explanation, /Correct fact:/, `Missing canonical correction in ${question.questionId}`);
      }
    }
    auditedQuestions += 1;
  }
}

assert.ok(falseExplanationCount > 0, "V3 stress scan did not exercise false-statement explanations");
console.log(JSON.stringify({ valid: true, auditedQuestions, falseExplanationCount }, null, 2));
