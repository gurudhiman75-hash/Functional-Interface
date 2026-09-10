import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp004ReviewV1 } from "./geo-riv-001-cp004-review-generator-v1";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(index + 28).padStart(3, "0")}`);

for (const qlId of QLS) {
  for (let index = 0; index < 220; index += 1) {
    const q = generateGeoRiv001Cp004ReviewV1(qlId, `cp004-${qlId}-${index}`);
    assert.equal(q.cpId, "GEO-RIV-001-CP004");
    assert.equal(q.options.length, 4, q.questionId);
    assert.equal(new Set(q.options).size, 4, q.questionId);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer, q.questionId);
    assert.equal(q.sourceIds.length > 0, true, q.questionId);
    assert.equal(q.sourceFactIds.length > 0, true, q.questionId);
    assert.equal(q.reviewOnly, true);
    assert.equal(q.runtimeRegistered, false);
    const visible = `${q.stem}\n${q.explanation}`;
    assert.doesNotMatch(visible, /matches the reviewed relation|exam trap|shortcut|characteristic of this setting|near\s+near|Therefore,/i);
    assert.doesNotMatch(visible, /both banks|neither bank/i);
  }
}

const bankStems = new Set<string>();
const confluenceAnswers = new Set<string>();
const chainAnswers = new Set<string>();
const statementAnswers = new Set<string>();
const countAnswers = new Set<string>();
for (let index = 0; index < 1800; index += 1) {
  const suffix = `mode-scan-${index}`;
  bankStems.add(generateGeoRiv001Cp004ReviewV1("GEO-RIV-001-QL-030", suffix).stem);
  confluenceAnswers.add(generateGeoRiv001Cp004ReviewV1("GEO-RIV-001-QL-031", suffix).canonicalAnswer);
  chainAnswers.add(generateGeoRiv001Cp004ReviewV1("GEO-RIV-001-QL-034", suffix).canonicalAnswer);
  statementAnswers.add(generateGeoRiv001Cp004ReviewV1("GEO-RIV-001-QL-035", suffix).canonicalAnswer);
  countAnswers.add(generateGeoRiv001Cp004ReviewV1("GEO-RIV-001-QL-036", suffix).canonicalAnswer);
}

for (const stem of [
  "Which of the following is a north-bank tributary of the Brahmaputra in Assam?",
  "Which of the following is a south-bank tributary of the Brahmaputra in Assam?",
  "Which pair consists only of north-bank tributaries of the Brahmaputra?",
  "Which pair consists only of south-bank tributaries of the Brahmaputra?",
]) assert.ok(bankStems.has(stem), `Missing bank mode: ${stem}`);

for (const answer of ["Dibang and Lohit", "Brahmaputra", "Siang/Dihang", "Bangladesh", "Ganga/Padma"]) {
  assert.ok(confluenceAnswers.has(answer), `Missing confluence mode: ${answer}`);
}
for (const answer of [
  "Tsangpo → Siang/Dihang → Brahmaputra → Jamuna",
  "Ranganadi → Subansiri → Brahmaputra",
  "Kameng → Jia Bharali → Brahmaputra",
  "Teesta → Brahmaputra/Jamuna → Ganga/Padma",
]) assert.ok(chainAnswers.has(answer), `Missing chain mode: ${answer}`);
for (const answer of [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
]) assert.ok(statementAnswers.has(answer), `Missing statement mode: ${answer}`);
for (const answer of ["None", "One", "Two", "Three"]) assert.ok(countAnswers.has(answer), `Missing count mode: ${answer}`);

const replayA = generateGeoRiv001Cp004ReviewV1("GEO-RIV-001-QL-030", "cp004-replay");
const replayB = generateGeoRiv001Cp004ReviewV1("GEO-RIV-001-QL-030", "cp004-replay");
assert.deepEqual(replayA, replayB);
