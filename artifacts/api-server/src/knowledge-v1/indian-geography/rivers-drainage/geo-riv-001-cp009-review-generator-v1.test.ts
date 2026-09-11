import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp009ReviewV1, GEO_RIV_001_CP009_QL_IDS_V1 } from "./geo-riv-001-cp009-review-generator-v1";

const qls = new Set<string>();
const statementAnswers = new Set<string>();
const countAnswers = new Set<string>();
const directRivers = new Set<string>();
const sourceRivers = new Set<string>();
const setRivers = new Set<string>();
let auditedQuestions = 0;

for (const qlId of GEO_RIV_001_CP009_QL_IDS_V1) {
  for (let index = 0; index < 120; index += 1) {
    const question = generateGeoRiv001Cp009ReviewV1(qlId, `cp009-v1-stress-${qlId}-${index}`);
    auditedQuestions += 1;
    qls.add(question.qlId);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(question.sourceFactIds.length > 0);
    assert.ok(question.sourceIds.length > 0);
    assert.equal(question.sourceFactIds.some((id) => id.includes("cp006")), false);

    const learnerText = `${question.stem} ${question.options.join(" ")} ${question.explanation}`;
    assert.doesNotMatch(learnerText, /associated with|linked with|matches the reviewed relation|listed among|joining relation|Therefore,|Correct fact:|The pair is incorrect\.|exam trap|shortcut/i);
    assert.doesNotMatch(learnerText, /river basin.*flows through|basin state/i);

    if (qlId === "GEO-RIV-001-QL-074") directRivers.add(question.stem.match(/the (.+?) flow through/i)?.[1] ?? "");
    if (qlId === "GEO-RIV-001-QL-076") sourceRivers.add(question.stem.match(/The (.+?) (?:rises|originates)/)?.[1] ?? "");
    if (qlId === "GEO-RIV-001-QL-077") setRivers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-081") statementAnswers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-082") countAnswers.add(question.canonicalAnswer);
  }
}

assert.equal(auditedQuestions, 1080);
assert.equal(qls.size, 9);
assert.ok(directRivers.size >= 9);
assert.ok(sourceRivers.size >= 5);
assert.ok(setRivers.size >= 9);
assert.deepEqual([...statementAnswers].sort(), ["Both I and II are correct", "Neither I nor II is correct", "Only I is correct", "Only II is correct"].sort());
assert.deepEqual([...countAnswers].sort(), ["None", "One", "Three", "Two"].sort());

console.log(JSON.stringify({ valid: true, auditedQuestions, qls: [...qls], directRiverCount: directRivers.size, sourceRiverCount: sourceRivers.size, setRiverCount: setRivers.size, statementAnswers: [...statementAnswers], countAnswers: [...countAnswers] }, null, 2));
