import assert from "node:assert/strict";

import { generateQuestion } from "../generation-engine-core";

async function qlFor(ordinal: number) {
  const result = await generateQuestion({
    packageId: "PCT-006",
    canonicalProblemId: "PCT-CP-001",
    language: "en",
    difficulty: "Easy",
    seed: "QUANT-V4-PCT006-DIVERSITY-ORDINAL-P4",
    count: 1,
    auditDiversityOrdinalByCanonicalProblemId: {
      "PCT-CP-001": ordinal,
    },
  });
  const question = result.questionPackages[0];
  assert.ok(question);
  assert.equal(question.canonicalProblemId, "PCT-CP-001");
  return String(question.questionLanguageId);
}

const first = await qlFor(0);
const second = await qlFor(1);
const firstAgain = await qlFor(0);

assert.notEqual(first, second, "PCT-006 CP001 must consume another Easy QL before reuse.");
assert.equal(firstAgain, first, "PCT-006 diversity ordinal selection must remain deterministic.");

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_PCT006_DIVERSITY_ORDINAL_P4",
  canonicalProblemId: "PCT-CP-001",
  difficulty: "Easy",
  ordinal0Ql: first,
  ordinal1Ql: second,
  deterministic: true,
  productionDefaultChanged: false,
}));
