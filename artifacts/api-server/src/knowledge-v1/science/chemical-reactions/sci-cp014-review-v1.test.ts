import assert from "node:assert/strict";
import { SCI_CP014_REVIEW_V1, validateSciCp014ReviewV1 } from "./sci-cp014-review-v1";

const result = validateSciCp014ReviewV1();
assert.equal(result.valid, true, result.errors.join("; "));
assert.equal(SCI_CP014_REVIEW_V1.length, 60);
assert.deepEqual(result.difficultyCounts, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(result.answerPositionCounts, { A: 15, B: 15, C: 15, D: 15 });
for (let ql = 1; ql <= 10; ql += 1) {
  const qlId = `SCI-014-QL-${String(ql).padStart(3, "0")}`;
  assert.equal(result.qlCounts[qlId], 6, `${qlId} count`);
}
assert.equal(SCI_CP014_REVIEW_V1.every((q) => q.reviewOnly && !q.runtimeRegistered), true);
