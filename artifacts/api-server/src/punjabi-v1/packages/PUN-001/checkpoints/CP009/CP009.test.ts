import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import {
  generateCP009Question,
  generateCP009ReviewBatch,
  PUN_001_CP009_DEFINITION,
} from "./generator";

console.log("Starting CP009 Synonyms & Antonyms Tests...");

// 1. Definition check
assert.equal(PUN_001_CP009_DEFINITION.cpId, "PUN-001-CP009");
assert.equal(PUN_001_CP009_DEFINITION.families.length, 3);

// 2. Determinism check
const q1 = generateCP009Question(42, "Medium", "F01");
const q2 = generateCP009Question(42, "Medium", "F01");
assert.deepEqual(q1, q2, "CP009 generation must be 100% deterministic");

// 3. Multi-family generation & validation
const difficulties: PunjabiDifficulty[] = ["Easy", "Medium", "Hard"];
const families = ["F01", "F02", "F03"];

for (const diff of difficulties) {
  for (const fam of families) {
    const q = generateCP009Question(1357, diff, fam);
    const validation = validatePunjabiQuestion(q);
    assert.equal(
      validation.isValid,
      true,
      `CP009 validation failed for ${fam} [${diff}]: ${validation.errors.join("; ")}`
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
console.log("Running 200-seed stress test for CP009...");
for (let seed = 9000; seed < 9200; seed++) {
  const diff = difficulties[seed % 3]!;
  const q = generateCP009Question(seed, diff);

  const val = validatePunjabiQuestion(q);
  assert.equal(
    val.isValid,
    true,
    `Validation error at seed ${seed}: ${val.errors.join("; ")}`
  );
}

// 5. 60-Question Golden Review Batch generation
console.log("Generating 60-question CP009 golden review batch...");
const batch = generateCP009ReviewBatch(60, 17000);
assert.equal(batch.totalQuestions, 60);
assert.equal(batch.distribution.easy, 20);
assert.equal(batch.distribution.medium, 20);
assert.equal(batch.distribution.hard, 20);
assert.equal(batch.questions.length, 60);

for (const q of batch.questions) {
  const res = validatePunjabiQuestion(q);
  assert.equal(res.isValid, true, `Batch question ${q.id} failed validation: ${res.errors.join("; ")}`);
}

console.log("All CP009 Synonyms & Antonyms tests passed successfully!");
