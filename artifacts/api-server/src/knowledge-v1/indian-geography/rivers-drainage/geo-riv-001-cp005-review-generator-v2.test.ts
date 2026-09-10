import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp005ReviewV2 } from "./geo-riv-001-cp005-review-generator-v2";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(index + 37).padStart(3, "0")}`);
const seen = new Map<string, Set<string>>();

for (const qlId of QLS) {
  const answers = new Set<string>();
  for (let index = 0; index < 800; index += 1) {
    const q = generateGeoRiv001Cp005ReviewV2(qlId, `cp005-v2-${qlId}-${index}`);
    assert.match(q.questionId, /CP005-V2/);
    assert.equal(q.options.length, 4, q.questionId);
    assert.equal(new Set(q.options).size, 4, q.questionId);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer, q.questionId);
    assert.ok(q.sourceIds.length > 0, q.questionId);
    assert.ok(q.sourceFactIds.length > 0, q.questionId);
    assert.doesNotMatch(`${q.stem}\n${q.explanation}`, /associated with|matches the reviewed relation|exam trap|shortcut|characteristic of this setting|near\s+near|Therefore,/i);
    answers.add(q.canonicalAnswer);
  }
  seen.set(qlId, answers);
}

for (const answer of ["Pranhita", "Godavari", "Tunga and Bhadra", "Krishna", "Sankh and Koel"]) {
  assert.equal(seen.get("GEO-RIV-001-QL-040")?.has(answer), true, `Missing formation mode: ${answer}`);
}
for (const target of ["Godavari", "Krishna", "Mahanadi", "Cauvery", "Pennar", "Brahmani", "Baitarani", "Subarnarekha"]) {
  assert.equal([...seen.get("GEO-RIV-001-QL-041")!].some((answer) => answer.startsWith(`${target} —`)), true, `Missing correct-pair target: ${target}`);
  assert.equal([...seen.get("GEO-RIV-001-QL-042")!].some((answer) => answer.startsWith(`${target} —`)), true, `Missing incorrect-pair target: ${target}`);
}
for (const answer of [
  "Wardha + Wainganga → Pranhita → Godavari",
  "Tunga + Bhadra → Tungabhadra → Krishna",
  "Sankh + Koel → Brahmani → Bay of Bengal",
  "Talakaveri → Cauvery/Kaveri → Bay of Bengal",
]) assert.equal(seen.get("GEO-RIV-001-QL-043")?.has(answer), true, `Missing chain: ${answer}`);
for (const answer of [
  "Both Statement I and Statement II are correct",
  "Only Statement I is correct",
  "Only Statement II is correct",
  "Neither Statement I nor Statement II is correct",
]) assert.equal(seen.get("GEO-RIV-001-QL-044")?.has(answer), true, `Missing statement mode: ${answer}`);
for (const answer of ["None", "One", "Two", "Three"]) assert.equal(seen.get("GEO-RIV-001-QL-045")?.has(answer), true, `Missing count mode: ${answer}`);

const a = generateGeoRiv001Cp005ReviewV2("GEO-RIV-001-QL-040", "cp005-replay-1");
const b = generateGeoRiv001Cp005ReviewV2("GEO-RIV-001-QL-040", "cp005-replay-1");
assert.deepEqual(a, b);
