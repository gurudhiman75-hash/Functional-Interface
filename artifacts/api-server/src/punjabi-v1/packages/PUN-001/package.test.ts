import { strict as assert } from "node:assert";
import { validatePunjabiQuestion } from "./checkpoints/CP001/validator";
import {
  generatePUN001Question,
  generatePUN001ReviewBatch,
  listPUN001Checkpoints,
  PUN_001_PACKAGE_ID,
} from "./package-definition";

console.log("Starting PUN-001 Master Package Registry Tests...");

// 1. Checkpoints check
const checkpoints = listPUN001Checkpoints();
assert.equal(checkpoints.length, 14);
console.log(`Registered checkpoints in PUN-001: ${checkpoints.map((c) => c.cpId).join(", ")}`);

// 2. Multi-checkpoint question generation & validation
const difficulties = ["Easy", "Medium", "Hard"] as const;

for (const cp of checkpoints) {
  for (const diff of difficulties) {
    const q = generatePUN001Question(cp.cpId, 7777, diff);
    const val = validatePunjabiQuestion(q);
    assert.equal(
      val.isValid,
      true,
      `Validation failed for ${cp.cpId} [${diff}]: ${val.errors.join("; ")}`
    );
    assert.equal(q.metadata.packageId, PUN_001_PACKAGE_ID);
    assert.equal(q.metadata.cpId, cp.cpId);
    assert.equal(q.options.length, 4);
    assert.equal(q.correctIndex >= 0 && q.correctIndex < 4, true);
  }
}

// 3. Batch generation for all checkpoints
for (const cp of checkpoints) {
  const batch = generatePUN001ReviewBatch(cp.cpId, 30, 9999);
  assert.equal(batch.totalQuestions, 30);
  assert.equal(batch.cpId, cp.cpId);
  assert.equal(batch.questions.length, 30);
}

console.log("All PUN-001 Master Package Registry tests passed successfully!");
