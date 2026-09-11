import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp008ReviewV2, GEO_RIV_001_CP008_QL_IDS_V2 } from "./geo-riv-001-cp008-review-generator-v2";

const banned = /associated with|listed among|therefore,|exam trap|shortcut|matches the reviewed relation|characteristic of this setting|river-association|originates at or near|has its source at or near|near near|rises in near|has a estuary|has a inland|has a no permanent|originates near [^\n.?!]*\bnear\b/i;
const statementAnswers = new Set<string>();
const countAnswers = new Set<string>();
const mouthAnswers = new Set<string>();
const chainSemantics = new Set<string>();
let auditedQuestions = 0;

for (const qlId of GEO_RIV_001_CP008_QL_IDS_V2) {
  for (let index = 0; index < 120; index += 1) {
    const seed = `cp008-v2-stress-${qlId}-${index}`;
    const question = generateGeoRiv001Cp008ReviewV2(qlId, seed);
    const replay = generateGeoRiv001Cp008ReviewV2(qlId, seed);
    assert.deepEqual(replay, question, `Non-deterministic V2 generation for ${qlId}/${seed}`);
    assert.equal(question.questionId.startsWith("GEO-RIV-001-CP008-V2-"), true);
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

    const learnerText = `${question.stem}\n${question.explanation}\n${question.options.join("\n")}`;
    assert.equal(banned.test(learnerText), false, `V2 editorial defect in ${question.questionId}: ${learnerText}`);

    if (qlId === "GEO-RIV-001-QL-067" && /which range\?/i.test(question.stem)) {
      assert.equal(question.options.every((option) => /Range$/i.test(option)), true, `Non-range distractor in ${question.questionId}`);
    }
    if (qlId === "GEO-RIV-001-QL-068") mouthAnswers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-071") chainSemantics.add(`${question.stem.toLowerCase()}|${question.canonicalAnswer.toLowerCase()}`);
    if (qlId === "GEO-RIV-001-QL-072") statementAnswers.add(question.canonicalAnswer);
    if (qlId === "GEO-RIV-001-QL-073") countAnswers.add(question.canonicalAnswer);
    auditedQuestions += 1;
  }
}

assert.deepEqual(statementAnswers, new Set(["Both I and II are correct", "Only I is correct", "Only II is correct", "Neither I nor II is correct"]));
assert.deepEqual(countAnswers, new Set(["None", "One", "Two", "Three"]));
for (const answer of ["Arabian Sea", "Bay of Bengal", "Delta", "Estuary"]) assert.ok(mouthAnswers.has(answer), `Missing V2 mouth answer ${answer}`);
assert.ok(chainSemantics.size >= 6, `Expected at least six distinct source-to-mouth chains, got ${chainSemantics.size}`);

console.log(JSON.stringify({ valid: true, auditedQuestions, qls: GEO_RIV_001_CP008_QL_IDS_V2, mouthAnswers: [...mouthAnswers].sort(), chainSemanticCount: chainSemantics.size, statementAnswers: [...statementAnswers].sort(), countAnswers: [...countAnswers].sort() }, null, 2));
