import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp004ReviewV2 } from "./geo-riv-001-cp004-review-generator-v2";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(index + 28).padStart(3, "0")}`);
let sawDibangPair = false;

for (const qlId of QLS) {
  for (let index = 0; index < 300; index += 1) {
    const q = generateGeoRiv001Cp004ReviewV2(qlId, `cp004-v2-${qlId}-${index}`);
    assert.match(q.questionId, /CP004-V2/);
    assert.equal(q.options.length, 4, q.questionId);
    assert.equal(new Set(q.options).size, 4, q.questionId);
    assert.equal(q.options[q.correctIndex], q.canonicalAnswer, q.questionId);
    assert.doesNotMatch(`${q.stem}\n${q.explanation}`, /associated with the source|matches the reviewed relation|exam trap|shortcut/i);
    if (q.qlId === "GEO-RIV-001-QL-032" && q.canonicalAnswer === "Dibang — joins Siang/Dihang") sawDibangPair = true;
  }
}

assert.equal(sawDibangPair, true, "CP004 V2 must make the Dibang correct-pair target reachable");

const a = generateGeoRiv001Cp004ReviewV2("GEO-RIV-001-QL-032", "cp004-v2-replay-007");
const b = generateGeoRiv001Cp004ReviewV2("GEO-RIV-001-QL-032", "cp004-v2-replay-007");
assert.deepEqual(a, b);
