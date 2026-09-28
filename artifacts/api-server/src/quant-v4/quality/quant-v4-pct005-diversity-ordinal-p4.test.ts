import assert from "node:assert/strict";

import { generateQuestion } from "../generation-engine-core";

async function qlFor(ordinal: number) {
  const result = await generateQuestion({
    packageId: "PCT-005",
    canonicalProblemId: "PCT-CP-002",
    language: "en",
    difficulty: "Medium",
    seed: "QUANT-V4-PCT005-DIVERSITY-ORDINAL-P4",
    count: 1,
    auditDiversityOrdinalByCanonicalProblemId: {
      "PCT-CP-002": ordinal,
    },
  });
  const question = result.questionPackages[0];
  assert.ok(question);
  assert.equal(question.canonicalProblemId, "PCT-CP-002");
  return String(question.questionLanguageId);
}

const first = await qlFor(0);
const second = await qlFor(1);
const firstAgain = await qlFor(0);

assert.notEqual(first, second, "PCT-005 CP002 must consume another Medium QL before reuse.");
assert.equal(firstAgain, first, "PCT-005 diversity ordinal selection must remain deterministic.");

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_PCT005_DIVERSITY_ORDINAL_P4",
  canonicalProblemId: "PCT-CP-002",
  difficulty: "Medium",
  ordinal0Ql: first,
  ordinal1Ql: second,
  deterministic: true,
  productionDefaultChanged: false,
}));
