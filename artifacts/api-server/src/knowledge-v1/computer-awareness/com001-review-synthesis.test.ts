import { strict as assert } from "node:assert";

import {
  generateCom001ReviewBatch,
  generateCom001ReviewQuestion,
  listCom001ReviewQlIds,
} from "./com001-review-synthesis";

const qlIds = listCom001ReviewQlIds();
assert.deepEqual(
  qlIds,
  Array.from(
    { length: 9 },
    (_, index) => `COM-001-QL-${String(index + 1).padStart(3, "0")}`,
  ),
);

let reviewedQuestionCount = 0;
for (const qlId of qlIds) {
  const batch = generateCom001ReviewBatch(qlId, 40, `audit:${qlId}`);
  assert.equal(batch.length, 40);
  reviewedQuestionCount += batch.length;

  const stemSet = new Set<string>();
  const answerSet = new Set<string>();
  const correctPositions = new Set<number>();

  for (const question of batch) {
    assert.equal(question.qlId, qlId);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.options.length, 4);
    assert.equal(question.correctIndex >= 0 && question.correctIndex < 4, true);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(
      new Set(question.options.map((option) => option.normalize("NFKC").trim().toLowerCase())).size,
      4,
    );
    assert.equal(question.stem.trim().length > 0, true);
    assert.equal(question.explanation.trim().length > 0, true);
    assert.equal(question.sourceIds.length > 0, true);
    stemSet.add(question.stem);
    answerSet.add(question.canonicalAnswer);
    correctPositions.add(question.correctIndex);
  }

  assert.equal(stemSet.size >= 2, true, `${qlId} has thin stem diversity`);
  assert.equal(answerSet.size >= 2, true, `${qlId} has thin answer/object diversity`);
  assert.equal(
    correctPositions.size >= 2,
    true,
    `${qlId} correct answer appears in a fixed position`,
  );

  const replayA = generateCom001ReviewQuestion({ qlId, seed: `replay:${qlId}` });
  const replayB = generateCom001ReviewQuestion({ qlId, seed: `replay:${qlId}` });
  assert.deepEqual(replayA, replayB, `${qlId} deterministic replay failed`);
}

assert.equal(reviewedQuestionCount, 360);

// Held virtual-memory discovery must not leak through the generic function QL.
const functionBatch = generateCom001ReviewBatch(
  "COM-001-QL-003",
  60,
  "held-boundary:function",
);
assert.equal(
  functionBatch.some((question) =>
    question.sourceFactIds.some((factId) => /windows-pagefile|windows-paging/i.test(factId)),
  ),
  false,
);

// Capacity questions must surface the explicit SI/IEC convention when the
// stem uses prefix relations; ambiguous universal KB=1024 wording is absent.
const capacityBatch = generateCom001ReviewBatch(
  "COM-001-QL-009",
  60,
  "capacity-convention",
);
assert.equal(
  capacityBatch.some((question) => /KB\s*=\s*1024/i.test(question.stem)),
  false,
);

assert.throws(
  () => generateCom001ReviewQuestion({ qlId: "COM-001-QL-010", seed: "held" }),
  /not allocated/,
);
