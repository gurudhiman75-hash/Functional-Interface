import { strict as assert } from "node:assert";

import { generateGeoRiv001Cp002ReviewV3 } from "./geo-riv-001-cp002-review-generator-v3";

const seen = new Set<string>();
for (let index = 0; index < 1200; index += 1) {
  const question = generateGeoRiv001Cp002ReviewV3(
    "GEO-RIV-001-QL-013",
    `cp002-v3-confluence-${index}`,
  );
  seen.add(question.canonicalAnswer);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
}

for (const answer of ["Chandra and Bhaga", "Tandi", "Trimmu", "Harike", "Panjnad"]) {
  assert.ok(seen.has(answer), `V3 QL013 did not surface ${answer}`);
}

const inherited = generateGeoRiv001Cp002ReviewV3(
  "GEO-RIV-001-QL-010",
  "cp002-v3-inherited-source",
);
assert.equal(inherited.qlId, "GEO-RIV-001-QL-010");
assert.match(inherited.questionId, /CP002-V3/);
