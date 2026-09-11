import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp009ReviewV2, GEO_RIV_001_CP009_QL_IDS_V2 } from "./geo-riv-001-cp009-review-generator-v2";

let auditedQuestions = 0;
let exactSetQuestions = 0;
let incorrectPairQuestions = 0;

for (const qlId of GEO_RIV_001_CP009_QL_IDS_V2) {
  for (let index = 0; index < 160; index += 1) {
    const question = generateGeoRiv001Cp009ReviewV2(qlId, `cp009-v2-stress-${qlId}-${index}`);
    auditedQuestions += 1;
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(question.sourceFactIds.length > 0);
    assert.equal(question.sourceFactIds.some((id) => id.includes("cp006")), false);

    const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
    assert.doesNotMatch(learnerText, /state set|reviewed Indian course|associated with|linked with|matches the reviewed relation|Correct fact:|The pair is incorrect\.|exam trap|shortcut|Therefore,/i);

    if (qlId === "GEO-RIV-001-QL-077") {
      exactSetQuestions += 1;
      assert.match(question.stem, /^Which river's course in India passes through only the following states:/);
    }
    if (qlId === "GEO-RIV-001-QL-079") {
      incorrectPairQuestions += 1;
      assert.match(question.explanation, /In India, it flows through/);
      assert.doesNotMatch(question.explanation, /reviewed/i);
    }
  }
}

assert.equal(auditedQuestions, 1440);
assert.equal(exactSetQuestions, 160);
assert.equal(incorrectPairQuestions, 160);
console.log(JSON.stringify({ valid: true, auditedQuestions, exactSetQuestions, incorrectPairQuestions }, null, 2));
