import { strict as assert } from "node:assert";

import { generateGeoRiv001Cp003ReviewV1 } from "./geo-riv-001-cp003-review-generator-v1";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(index + 19).padStart(3, "0")}`);

for (const qlId of QLS) {
  for (let index = 0; index < 120; index += 1) {
    const q = generateGeoRiv001Cp003ReviewV1(qlId, `cp003-${qlId}-${index}`);
    assert.equal(q.cpId, "GEO-RIV-001-CP003");
    assert.equal(q.qlId, qlId);
    assert.equal(q.options.length, 4, q.questionId);
    assert.equal(new Set(q.options).size, 4, q.questionId);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer, q.questionId);
    assert.equal(q.sourceIds.length > 0, true, q.questionId);
    assert.equal(q.sourceFactIds.length > 0, true, q.questionId);
    assert.equal(q.explanation.length >= 30, true, q.questionId);
    assert.equal(q.reviewOnly, true);
    assert.equal(q.runtimeRegistered, false);
    assert.doesNotMatch(`${q.stem}\n${q.explanation}`, /associated with the source|matches the reviewed relation|exam trap|shortcut|near\s+near|Therefore,/i);
  }
}

const panchAnswers = new Set(
  Array.from({ length: 500 }, (_, index) =>
    generateGeoRiv001Cp003ReviewV1("GEO-RIV-001-QL-022", `cp003-panch-${index}`).canonicalAnswer,
  ),
);
assert.deepEqual(
  panchAnswers,
  new Set(["Vishnuprayag", "Nandprayag", "Karnaprayag", "Rudraprayag", "Devprayag"]),
);

const chainAnswers = new Set(
  Array.from({ length: 500 }, (_, index) =>
    generateGeoRiv001Cp003ReviewV1("GEO-RIV-001-QL-025", `cp003-chain-${index}`).canonicalAnswer,
  ),
);
assert.equal(chainAnswers.size, 5);

const pairAnswers = new Set(
  Array.from({ length: 500 }, (_, index) =>
    generateGeoRiv001Cp003ReviewV1("GEO-RIV-001-QL-026", `cp003-statement-pair-${index}`).canonicalAnswer,
  ),
);
assert.deepEqual(
  pairAnswers,
  new Set([
    "Both Statement I and Statement II are correct",
    "Only Statement I is correct",
    "Only Statement II is correct",
    "Neither Statement I nor Statement II is correct",
  ]),
);

const countAnswers = new Set(
  Array.from({ length: 600 }, (_, index) =>
    generateGeoRiv001Cp003ReviewV1("GEO-RIV-001-QL-027", `cp003-statement-count-${index}`).canonicalAnswer,
  ),
);
assert.deepEqual(countAnswers, new Set(["None", "One", "Two", "Three"]));

const replayA = generateGeoRiv001Cp003ReviewV1("GEO-RIV-001-QL-025", "cp003-replay");
const replayB = generateGeoRiv001Cp003ReviewV1("GEO-RIV-001-QL-025", "cp003-replay");
assert.deepEqual(replayA, replayB);

assert.throws(
  () => generateGeoRiv001Cp003ReviewV1("GEO-RIV-001-QL-999", "unknown"),
  /Unknown GEO-RIV-001 CP003 QL/i,
);
