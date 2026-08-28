import assert from "node:assert/strict";

import {
  COM002_ENGLISH_GENERATOR_VERSION_V5,
  COM002_V5_APPROVED_REVIEW_SEEDS,
  generateCom002ReviewQuestionV5,
  listCom002ReviewV5QlIds,
} from "./com002-review-synthesis-v5";

const qlIds = listCom002ReviewV5QlIds();
const expectedSeeds = qlIds.flatMap((qlId) => [
  `human-review-wave1:${qlId}:A`,
  `human-review-wave1:${qlId}:B`,
]);

assert.equal(COM002_ENGLISH_GENERATOR_VERSION_V5, "COM-002-ENGLISH-GENERATOR-V5-SIMPLIFIED-APPROVED-1");
assert.equal(COM002_V5_APPROVED_REVIEW_SEEDS.length, 26);
assert.deepEqual([...COM002_V5_APPROVED_REVIEW_SEEDS].sort(), [...expectedSeeds].sort());

let reviewed = 0;
for (const seed of expectedSeeds) {
  const qlId = seed.split(":")[1]!;
  const question = generateCom002ReviewQuestionV5({ qlId, seed });
  const replay = generateCom002ReviewQuestionV5({ qlId, seed });

  assert.deepEqual(replay, question, `${seed}: deterministic V5 review pack drift`);
  assert.equal(question.qlId, qlId);
  assert.ok(question.questionId.endsWith("-V5"));
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);

  reviewed += 1;
  console.log(`\n[COM002-HUMAN-REVIEW-V5] Q${String(reviewed).padStart(2, "0")} ${qlId} ${question.surfaceMode}`);
  console.log(`Generator: ${COM002_ENGLISH_GENERATOR_VERSION_V5}`);
  console.log(`Seed: ${seed}`);
  console.log(question.stem);
  question.options.forEach((option, index) => {
    const marker = index === question.correctIndex ? "  <-- CORRECT" : "";
    console.log(`${String.fromCharCode(65 + index)}. ${option}${marker}`);
  });
  console.log(`Answer: ${question.canonicalAnswer}`);
  console.log(`Explanation: ${question.explanation}`);
  console.log(`Sources: ${question.sourceIds.join(", ")}`);
  console.log(`Facts: ${question.sourceFactIds.join(", ")}`);
}

assert.equal(reviewed, 26);
console.log(`[com002-human-review-wave1-v5] PASS questions=${reviewed} approvalSurface=SIMPLIFIED`);
