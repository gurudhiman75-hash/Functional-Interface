import assert from "node:assert/strict";

import { generateQuestion } from "../generation-engine-core";

async function qlFor(ordinal: number) {
  const result = await generateQuestion({
    packageId: "PCT-002",
    canonicalProblemId: "PCT-CP-007",
    language: "en",
    seed: "QUANT-V4-PCT002-DIVERSITY-ORDINAL-P4",
    count: 1,
    auditDiversityOrdinalByCanonicalProblemId: {
      "PCT-CP-007": ordinal,
    },
  });
  const question = result.questionPackages[0];
  assert.ok(question);
  assert.equal(question.canonicalProblemId, "PCT-CP-007");
  return String(question.questionLanguageId);
}

const first = await qlFor(0);
const second = await qlFor(1);
const firstAgain = await qlFor(0);

assert.notEqual(
  first,
  second,
  "PCT-002 CP007 must consume another curated QL before reusing the ordinal-0 QL.",
);
assert.equal(
  firstAgain,
  first,
  "PCT-002 diversity ordinal selection must remain deterministic.",
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_PCT002_DIVERSITY_ORDINAL_P4",
  canonicalProblemId: "PCT-CP-007",
  ordinal0Ql: first,
  ordinal1Ql: second,
  deterministic: true,
  productionDefaultChanged: false,
}));
