import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp008ReviewV5, GEO_RIV_001_CP008_QL_IDS_V5 } from "./geo-riv-001-cp008-review-generator-v5";

let auditedQuestions = 0;
let incorrectPairQuestions = 0;
let statementQuestions = 0;

for (const qlId of GEO_RIV_001_CP008_QL_IDS_V5) {
  for (let index = 0; index < 140; index += 1) {
    const question = generateGeoRiv001Cp008ReviewV5(qlId, `cp008-v5-stress-${qlId}-${index}`);
    auditedQuestions += 1;

    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.options.length, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(question.sourceFactIds.length > 0);
    assert.ok(question.upstreamFactIds.length > 0);
    assert.equal(question.upstreamFactIds.some((id) => id.includes("cp006")), false);

    const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
    assert.doesNotMatch(learnerText, /near near|has a estuary|has a delta|at near|associated with the source|matches the reviewed relation|listed among|joining relation|Therefore,|The pair is incorrect\.|Correct fact:/i);

    if (qlId === "GEO-RIV-001-QL-070") {
      incorrectPairQuestions += 1;
      assert.doesNotMatch(question.explanation, /^The pair is incorrect\./i);
      assert.doesNotMatch(question.explanation, /—.* is incorrect\./);
      assert.ok(question.explanation.length >= 20);
    }

    if (qlId === "GEO-RIV-001-QL-072" || qlId === "GEO-RIV-001-QL-073") {
      statementQuestions += 1;
      assert.doesNotMatch(question.explanation, /Correct fact:/i);
    }

    if (qlId === "GEO-RIV-001-QL-071") assert.equal(question.difficulty, "Medium");
  }
}

assert.equal(auditedQuestions, 1260);
assert.equal(incorrectPairQuestions, 140);
assert.equal(statementQuestions, 280);

console.log(JSON.stringify({ valid: true, auditedQuestions, incorrectPairQuestions, statementQuestions }, null, 2));
