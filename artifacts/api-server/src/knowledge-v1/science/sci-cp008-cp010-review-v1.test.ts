import assert from "node:assert/strict";
import { auditSciCp008ReviewBatchV1 } from "./electricity/sci-cp008-review-v1";
import { auditSciCp009ReviewBatchV1 } from "./magnetism-electromagnetism/sci-cp009-review-v1";
import { auditSciCp010ReviewBatchV1 } from "./modern-physics/sci-cp010-review-v1";

for (const [name, audit] of [
  ["SCI-CP-008", auditSciCp008ReviewBatchV1()],
  ["SCI-CP-009", auditSciCp009ReviewBatchV1()],
  ["SCI-CP-010", auditSciCp010ReviewBatchV1()],
] as const) {
  assert.equal(audit.valid, true, `${name}: ${audit.errors.join("; ")}`);
  assert.equal(audit.count, 60);
  assert.equal(audit.semanticCount, 60);
  assert.deepEqual(audit.difficulty, { Easy: 18, Medium: 30, Hard: 12 });
  assert.deepEqual(audit.answerPositions, [15, 15, 15, 15]);
}
console.log("SCI-CP-008/009/010 review qualification passed");
