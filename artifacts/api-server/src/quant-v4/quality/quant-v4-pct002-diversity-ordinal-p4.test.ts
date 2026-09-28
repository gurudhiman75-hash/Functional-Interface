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


async function cp002QlFor(ordinal: number) {
  const result = await generateQuestion({
    packageId: "PCT-002",
    canonicalProblemId: "PCT-CP-002",
    language: "en",
    seed: "QUANT-V4-PCT002-FULL-POOL-DIVERSITY-P6",
    count: 1,
    auditDiversityOrdinalByCanonicalProblemId: {
      "PCT-CP-002": ordinal,
    },
  });
  const question = result.questionPackages[0];
  assert.ok(question);
  return String(question.questionLanguageId);
}

const cp002Ordinals = await Promise.all(
  Array.from({ length: 9 }, (_, ordinal) => cp002QlFor(ordinal)),
);
assert.equal(
  new Set(cp002Ordinals).size,
  cp002Ordinals.length,
  "PCT-002 CP002 must consume distinct QLs across the full authored pool before reuse when audit diversity is active.",
);

const explicitDifficultyResult = await generateQuestion({
  packageId: "PCT-002",
  canonicalProblemId: "PCT-CP-002",
  language: "en",
  seed: "QUANT-V4-PCT002-EXPLICIT-DIFFICULTY-P6",
  count: 1,
  difficulty: "Easy",
  auditDiversityOrdinalByCanonicalProblemId: {
    "PCT-CP-002": 1,
  },
});
assert.equal(
  explicitDifficultyResult.questionPackages[0]?.difficultyBand,
  "Easy",
  "Explicit difficulty must continue to constrain PCT-002 audit diversity selection.",
);
