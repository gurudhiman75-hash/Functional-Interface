import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP001_REVIEW_GENERATORS,
  generateGeoRiv001Cp001Review,
} from "./geo-riv-001-cp001-review-generator";

const qlIds = Object.keys(GEO_RIV_001_CP001_REVIEW_GENERATORS).sort();
assert.deepEqual(
  qlIds,
  Array.from({ length: 9 }, (_, index) =>
    `GEO-RIV-001-QL-${String(index + 1).padStart(3, "0")}`,
  ),
);

for (const qlId of qlIds) {
  const first = generateGeoRiv001Cp001Review(qlId, `${qlId}-replay-proof`);
  const second = generateGeoRiv001Cp001Review(qlId, `${qlId}-replay-proof`);
  assert.deepEqual(first, second);
  assert.equal(first.chapterId, "GEO-RIV-001");
  assert.equal(first.cpId, "GEO-RIV-001-CP001");
  assert.equal(first.qlId, qlId);
  assert.equal(first.options.length, 4);
  assert.equal(new Set(first.options).size, 4);
  assert.equal(first.options[first.correctIndex], first.canonicalAnswer);
  assert.equal(first.sourceIds.length > 0, true);
  assert.equal(first.sourceFactIds.length > 0, true);
  assert.equal(first.reviewOnly, true);
  assert.equal(first.runtimeRegistered, false);
}

for (const qlId of qlIds) {
  const correctPositions = new Set<number>();
  for (let index = 0; index < 16; index += 1) {
    const question = generateGeoRiv001Cp001Review(
      qlId,
      `${qlId}-position-${index}`,
    );
    correctPositions.add(question.correctIndex);
    assert.equal(question.stem.trim().length > 10, true);
    assert.equal(question.explanation.trim().length > 20, true);
  }
  assert.equal(
    correctPositions.size > 1,
    true,
    `${qlId} appears structurally pinned to one answer position`,
  );
}

assert.throws(
  () => generateGeoRiv001Cp001Review("GEO-RIV-001-QL-001", ""),
  /deterministic seed/,
);
assert.throws(
  () => generateGeoRiv001Cp001Review("GEO-RIV-001-QL-999", "seed"),
  /Unknown GEO-RIV-001 CP001 QL/,
);

const ql005 = generateGeoRiv001Cp001Review(
  "GEO-RIV-001-QL-005",
  "river-classification-unique-answer",
);
assert.equal(
  ql005.options.every((option) => !/Himalayan river|Peninsular river/.test(option)),
  true,
  "QL005 answer options should be river names, not repeated class labels",
);

const ql008 = generateGeoRiv001Cp001Review(
  "GEO-RIV-001-QL-008",
  "statement-pair-proof",
);
assert.equal(ql008.stem.includes("Statement"), true);
assert.equal(ql008.solverAuthority, "STATEMENT_COMPOSITION_VERIFIER");

const ql009 = generateGeoRiv001Cp001Review(
  "GEO-RIV-001-QL-009",
  "multi-statement-proof",
);
assert.equal(ql009.stem.includes("How many"), true);
assert.equal(ql009.solverAuthority, "STATEMENT_COMPOSITION_VERIFIER");
