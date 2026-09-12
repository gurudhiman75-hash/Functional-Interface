import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import {
  generateCP001Question,
  generateCP001ReviewBatch,
  PUN_001_CP001_DEFINITION,
} from "./generator";
import { validatePunjabiQuestion } from "./validator";

console.log("Starting CP001 Pilot Generator Tests...");

// 1. Checkpoint definition check
assert.equal(PUN_001_CP001_DEFINITION.cpId, "PUN-001-CP001");
assert.equal(PUN_001_CP001_DEFINITION.families.length, 5);

// 2. Determinism check: Same seed must produce bit-for-bit identical questions
const q1 = generateCP001Question(42, "Medium", "F01");
const q2 = generateCP001Question(42, "Medium", "F01");
assert.deepEqual(q1, q2, "Generation with identical seed must be 100% deterministic");

// 3. Multi-family generation & validation
const difficulties: PunjabiDifficulty[] = ["Easy", "Medium", "Hard"];
const families = ["F01", "F02", "F03", "F04", "F05"];

for (const diff of difficulties) {
  for (const fam of families) {
    const q = generateCP001Question(1234, diff, fam);
    const validation = validatePunjabiQuestion(q);
    assert.equal(
      validation.isValid,
      true,
      `Question validation failed for ${fam} [${diff}]: ${validation.errors.join("; ")}`
    );
    assert.equal(q.options.length, 4);
    assert.equal(q.correctIndex >= 0 && q.correctIndex < 4, true);
    assert.equal(typeof q.stem, "string");
    assert.equal(q.stem.length > 5, true);
    assert.equal(typeof q.explanation, "string");
    assert.equal(q.explanation.length > 10, true);
  }
}

// 4. Stress test over 300 seeds across all difficulties
console.log("Running 300-seed stress test across all families...");
const keyCounts = [0, 0, 0, 0];
const sampleSize = 300;

for (let seed = 1000; seed < 1000 + sampleSize; seed++) {
  const diff = difficulties[seed % 3]!;
  const q = generateCP001Question(seed, diff);

  const val = validatePunjabiQuestion(q);
  assert.equal(
    val.isValid,
    true,
    `Validation error at seed ${seed}: ${val.errors.join("; ")}`
  );

  keyCounts[q.correctIndex]++;
}

console.log(
  `Key distribution across ${sampleSize} items: A=${keyCounts[0]}, B=${keyCounts[1]}, C=${keyCounts[2]}, D=${keyCounts[3]}`
);
// Assert that each key appears between 15% and 35% of the time (healthy distribution)
for (let i = 0; i < 4; i++) {
  const percentage = (keyCounts[i]! / sampleSize) * 100;
  assert.equal(
    percentage >= 15 && percentage <= 35,
    true,
    `Key distribution index ${i} (${percentage.toFixed(1)}%) is out of balanced bounds [15%, 35%]`
  );
}

// 5. 60-Question Golden Review Batch generation
console.log("Generating 60-question golden review batch...");
const batch = generateCP001ReviewBatch(60, 5000);
assert.equal(batch.totalQuestions, 60);
assert.equal(batch.distribution.easy, 20);
assert.equal(batch.distribution.medium, 20);
assert.equal(batch.distribution.hard, 20);
assert.equal(batch.questions.length, 60);

// Validate every item in the batch
for (const q of batch.questions) {
  const res = validatePunjabiQuestion(q);
  assert.equal(res.isValid, true, `Batch question ${q.id} failed validation: ${res.errors.join("; ")}`);
}

console.log("All CP001 Pilot Generator tests passed with zero errors!");
