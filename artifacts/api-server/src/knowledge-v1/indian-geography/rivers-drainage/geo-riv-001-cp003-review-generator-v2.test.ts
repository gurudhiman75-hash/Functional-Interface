import { strict as assert } from "node:assert";

import { GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp003-editorial-review-v1";
import { generateGeoRiv001Cp003ReviewV2 } from "./geo-riv-001-cp003-review-generator-v2";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(index + 19).padStart(3, "0")}`);

for (const qlId of QLS) {
  for (let index = 0; index < 180; index += 1) {
    const q = generateGeoRiv001Cp003ReviewV2(qlId, `cp003-v2-${qlId}-${index}`);
    assert.match(q.questionId, /CP003-V2/);
    assert.equal(q.options.length, 4, q.questionId);
    assert.equal(new Set(q.options).size, 4, q.questionId);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer, q.questionId);
    assert.equal(q.sourceIds.length > 0, true, q.questionId);
    assert.equal(q.sourceFactIds.length > 0, true, q.questionId);
    const visible = `${q.stem}\n${q.explanation}`;
    assert.doesNotMatch(visible, /both banks|neither bank|both statement i|only statement i is|only statement ii is|neither statement i/i);
    assert.doesNotMatch(visible, /The correct pair is/i);
    assert.doesNotMatch(visible, /correctly matched with/i);
  }
}

const bankStems = new Set<string>();
for (let index = 0; index < 1000; index += 1) {
  const q = generateGeoRiv001Cp003ReviewV2("GEO-RIV-001-QL-021", `cp003-v2-bank-${index}`);
  if (/bank tributaries|bank tributary/i.test(q.stem)) bankStems.add(q.stem);
}
for (const expected of [
  "Which of the following is a right-bank tributary of the Ganga?",
  "Which of the following is a left-bank tributary of the Ganga?",
  "Which pair consists of right-bank tributaries of the Ganga?",
  "Which pair consists only of left-bank tributaries of the Ganga?",
]) {
  assert.ok(bankStems.has(expected), `Missing CP003 V2 bank mode: ${expected}`);
}

const bhagirathiJoin = GEO_RIV_001_CP003_REVIEWABLE_FACTS_V1.find(
  (fact) => fact.factId === "geo-riv-001-cp003-bhagirathi-alaknanda",
);
assert.ok(bhagirathiJoin);
assert.equal(bhagirathiJoin.relation, "joins_river");
assert.notEqual(bhagirathiJoin.relation, "tributary_of");

const replayA = generateGeoRiv001Cp003ReviewV2("GEO-RIV-001-QL-021", "cp003-v2-replay");
const replayB = generateGeoRiv001Cp003ReviewV2("GEO-RIV-001-QL-021", "cp003-v2-replay");
assert.deepEqual(replayA, replayB);
