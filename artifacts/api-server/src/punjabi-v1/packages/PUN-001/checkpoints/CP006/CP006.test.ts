import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import {
  generateCP006Question,
  generateCP006ReviewBatch,
  PUN_001_CP006_DEFINITION,
} from "./generator";

console.log("Starting CP006 Verbs & Tenses Tests...");

// 1. Definition check
assert.equal(PUN_001_CP006_DEFINITION.cpId, "PUN-001-CP006");
assert.equal(PUN_001_CP006_DEFINITION.families.length, 2);

// 2. Determinism check
const q1 = generateCP006Question(42, "Medium", "F01");
const q2 = generateCP006Question(42, "Medium", "F01");
assert.deepEqual(q1, q2, "CP006 generation must be 100% deterministic");

// 3. Multi-family generation & validation
const difficulties: PunjabiDifficulty[] = ["Easy", "Medium", "Hard"];
const families = ["F01", "F02"];

for (const diff of difficulties) {
  for (const fam of families) {
    const q = generateCP006Question(9876, diff, fam);
    const validation = validatePunjabiQuestion(q);
    assert.equal(
      validation.isValid,
      true,
      `CP006 validation failed for ${fam} [${diff}]: ${validation.errors.join("; ")}`
    );
    assert.equal(q.options.length, 4);
    assert.equal(q.correctIndex >= 0 && q.correctIndex < 4, true);
    assert.equal(typeof q.stem, "string");
    assert.equal(q.stem.length > 5, true);
    assert.equal(typeof q.explanation, "string");
    assert.equal(q.explanation.length > 10, true);
  }
}

// 4. Stress test over 200 seeds across all difficulties
console.log("Running 200-seed stress test for CP006...");
for (let seed = 6000; seed < 6200; seed++) {
  const diff = difficulties[seed % 3]!;
  const q = generateCP006Question(seed, diff);

  const val = validatePunjabiQuestion(q);
  assert.equal(
    val.isValid,
    true,
    `Validation error at seed ${seed}: ${val.errors.join("; ")}`
  );
}

// 5. 60-Question Golden Review Batch generation
console.log("Generating 60-question CP006 golden review batch...");
const batch = generateCP006ReviewBatch(60, 15000);
assert.equal(batch.totalQuestions, 60);
assert.equal(batch.distribution.easy, 20);
assert.equal(batch.distribution.medium, 20);
assert.equal(batch.distribution.hard, 20);
assert.equal(batch.questions.length, 60);

for (const q of batch.questions) {
  const res = validatePunjabiQuestion(q);
  assert.equal(res.isValid, true, `Batch question ${q.id} failed validation: ${res.errors.join("; ")}`);
}

console.log("All CP006 Verbs & Tenses tests passed successfully!");
