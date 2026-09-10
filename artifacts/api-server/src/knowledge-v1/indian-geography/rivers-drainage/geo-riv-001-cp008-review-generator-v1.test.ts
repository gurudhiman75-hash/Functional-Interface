import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp008ReviewV1, GEO_RIV_001_CP008_QL_IDS_V1 } from "./geo-riv-001-cp008-review-generator-v1";

const banned = /associated with|listed among|therefore,|exam trap|shortcut|matches the reviewed relation|characteristic of this setting|river-association|originates at or near|has its source at or near|near near|at near|at below|at west of/i;
const statementAnswers = new Set<string>();
const countAnswers = new Set<string>();
const mouthAnswers = new Set<string>();
let auditedQuestions = 0;

for (const qlId of GEO_RIV_001_CP008_QL_IDS_V1) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `cp008-stress-${qlId}-${index}`;
    const question = generateGeoRiv001Cp008ReviewV1(qlId, seed);
    const replay = generateGeoRiv001Cp008ReviewV1(qlId, seed);
    assert.deepEqual(replay, question, `Non-deterministic generation for ${qlId}/${seed}`);
    assert.equal(question.cpId, "GEO-RIV-001-CP008");
    assert.equal(question.qlId, qlId);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4, `Duplicate options: ${question.questionId}`);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.ok(question.sourceIds.length >= 1);
    assert.ok(question.sourceFactIds.length >= 1);
    assert.ok(question.upstreamFactIds.length >= 1);
    assert.equal(question.upstreamFactIds.some((id) => id.includes("cp006")), false);
    assert.equal(banned.test(`${question.stem}\n${question.explanation}\n${question.options.join("\n")}`), false, `Banned wording in ${question.questionId}`);
    if (qlId === "GEO-RIV-001-QL-068") mouthAnswers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-072") statementAnswers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-073") countAnswers.add(question.canonicalAnswer);
    auditedQuestions += 1;
  }
}

assert.deepEqual(new Set(GEO_RIV_001_CP008_QL_IDS_V1), new Set([
  "GEO-RIV-001-QL-065",
  "GEO-RIV-001-QL-066",
  "GEO-RIV-001-QL-067",
  "GEO-RIV-001-QL-068",
  "GEO-RIV-001-QL-069",
  "GEO-RIV-001-QL-070",
  "GEO-RIV-001-QL-071",
  "GEO-RIV-001-QL-072",
  "GEO-RIV-001-QL-073",
]));
assert.deepEqual(statementAnswers, new Set(["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]));
assert.deepEqual(countAnswers, new Set(["None", "One", "Two", "Three"]));
assert.ok(mouthAnswers.has("Arabian Sea"));
assert.ok(mouthAnswers.has("Bay of Bengal"));
assert.ok(mouthAnswers.has("Delta"));
assert.ok(mouthAnswers.has("Estuary"));

console.log(JSON.stringify({ valid: true, auditedQuestions, qls: GEO_RIV_001_CP008_QL_IDS_V1, mouthAnswers: [...mouthAnswers].sort(), statementAnswers: [...statementAnswers].sort(), countAnswers: [...countAnswers].sort() }, null, 2));
