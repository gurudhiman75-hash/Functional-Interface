import { strict as assert } from "node:assert";

import { classifyCom001DifficultyV2 } from "./com001-difficulty-routing-v2";
import {
  generateCom001ReviewBatchV2,
  listCom001ReviewV2QlIds,
} from "./com001-review-synthesis-v2";

const expectedByQl: Record<string, string[]> = {
  "COM-001-QL-001": ["Easy", "Medium"],
  "COM-001-QL-002": ["Easy", "Medium"],
  "COM-001-QL-003": ["Easy", "Medium"],
  "COM-001-QL-004": ["Easy", "Medium"],
  "COM-001-QL-005": ["Easy", "Medium"],
  "COM-001-QL-006": ["Medium"],
  "COM-001-QL-007": ["Hard"],
  "COM-001-QL-008": ["Hard"],
  "COM-001-QL-009": ["Easy", "Medium"],
};

const globalCounts = new Map<string, number>();
let audited = 0;

for (const qlId of listCom001ReviewV2QlIds()) {
  const questions = generateCom001ReviewBatchV2(
    qlId,
    40,
    `difficulty-v2-audit:${qlId}`,
  );
  const observed = new Set<string>();
  for (const question of questions) {
    const first = classifyCom001DifficultyV2(question);
    const replay = classifyCom001DifficultyV2(question);
    assert.deepEqual(replay, first, `${question.questionId}: classifier replay changed`);
    assert.equal(first.productionClaimAuthorized, false);
    assert.equal(first.classifierVersion, "COM-001-DIFFICULTY-V2-CANDIDATE-1");
    assert.equal(first.rationale.trim().length > 25, true);
    observed.add(first.difficulty);
    globalCounts.set(first.difficulty, (globalCounts.get(first.difficulty) ?? 0) + 1);
    audited += 1;
  }
  assert.deepEqual(
    [...observed].sort(),
    [...expectedByQl[qlId]!].sort(),
    `${qlId}: unexpected topology-difficulty coverage`,
  );
}

assert.equal(audited, 360);
assert.equal(globalCounts.has("Easy"), true);
assert.equal(globalCounts.has("Medium"), true);
assert.equal(globalCounts.has("Hard"), true);
for (const difficulty of ["Easy", "Medium", "Hard"]) {
  assert.equal(
    (globalCounts.get(difficulty) ?? 0) >= 40,
    true,
    `${difficulty}: classifier corpus is too thin`,
  );
}

console.log("[COM001-DIFFICULTY-V2-CANDIDATE] distribution", Object.fromEntries(globalCounts));
