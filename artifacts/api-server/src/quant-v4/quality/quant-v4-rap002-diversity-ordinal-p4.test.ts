import assert from "node:assert/strict";

import { generateQuestion } from "../generation-engine-core";

async function qlFor(cpId: "RAP-CP-008" | "RAP-CP-012", difficulty: "Medium" | "Hard", ordinal: number) {
  const result = await generateQuestion({
    packageId: "RAP-002",
    canonicalProblemId: cpId,
    language: "en",
    difficulty,
    seed: `QUANT-V4-RAP002-DIVERSITY-ORDINAL-P4:${cpId}:${difficulty}`,
    count: 1,
    auditDiversityOrdinalByCanonicalProblemId: {
      [cpId]: ordinal,
    },
  });
  const question = result.questionPackages[0];
  assert.ok(question);
  assert.equal(question.canonicalProblemId, cpId);
  assert.equal(question.difficultyBand, difficulty);
  return String(question.questionLanguageId);
}

for (const [cpId, difficulty] of [
  ["RAP-CP-008", "Hard"],
  ["RAP-CP-012", "Medium"],
] as const) {
  const first = await qlFor(cpId, difficulty, 0);
  const second = await qlFor(cpId, difficulty, 1);
  const firstAgain = await qlFor(cpId, difficulty, 0);

  assert.notEqual(first, second, `${cpId} ${difficulty} must consume another compatible QL before reuse.`);
  assert.equal(firstAgain, first, `${cpId} diversity ordinal selection must remain deterministic.`);
}

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_RAP002_DIVERSITY_ORDINAL_P4",
  checked: [
    { canonicalProblemId: "RAP-CP-008", difficulty: "Hard" },
    { canonicalProblemId: "RAP-CP-012", difficulty: "Medium" },
  ],
  deterministic: true,
  productionDefaultChanged: false,
}));
