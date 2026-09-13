import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import {
  generateCP008Question,
  generateCP008ReviewBatch,
  PUN_001_CP008_DEFINITION,
} from "./generator";

console.log("Starting PUN-001-CP008 V4 tests...");

const difficulties: PunjabiDifficulty[] = ["Easy", "Medium", "Hard"];
const families = ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"] as const;

assert.equal(PUN_001_CP008_DEFINITION.cpId, "PUN-001-CP008");
assert.equal(PUN_001_CP008_DEFINITION.families.length, 8);
assert.deepEqual(PUN_001_CP008_DEFINITION.families.map((family) => family.familyId), [...families]);

for (const difficulty of difficulties) {
  for (const familyId of families) {
    const a = generateCP008Question(8401, difficulty, familyId);
    const b = generateCP008Question(8401, difficulty, familyId);
    assert.deepEqual(a, b, `CP008 V4 deterministic replay failed for ${familyId}/${difficulty}`);
  }
}

for (const difficulty of difficulties) {
  for (const familyId of families) {
    const question = generateCP008Question(8888, difficulty, familyId);
    const validation = validatePunjabiQuestion(question);
    assert.equal(validation.isValid, true, `CP008 V4 validation failed for ${familyId}/${difficulty}: ${validation.errors.join("; ")}`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4, `${familyId}/${difficulty} options must be unique`);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
    assert.equal(question.metadata.generatorRevision, "4.1.0");
    assert.match(question.metadata.fingerprint, /^CP008-V4-[0-9a-f]{8}$/, `${familyId}/${difficulty} must use a semantic-content fingerprint`);
    assert.equal(question.metadata.fingerprint.includes(String(question.metadata.seed)), false, "Fingerprint must not be a seed-only identity");
  }
}

for (let seed = 8600; seed < 8660; seed++) {
  const question = generateCP008Question(seed, difficulties[seed % 3]!, "F03");
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.doesNotMatch(question.explanation, /(ਬਾਕੀ ਤਿੰਨ|ਵਿਕਲਪ A|ਵਿਕਲਪ B|ਵਿਕਲਪ C|ਵਿਕਲਪ D)/u, "F03 explanation must not contain option-by-option analysis");
}

for (let seed = 8700; seed < 8760; seed++) {
  const difficulty = difficulties[seed % 3]!;
  for (const familyId of ["F05", "F06", "F07"] as const) {
    const question = generateCP008Question(seed, difficulty, familyId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.doesNotMatch(question.explanation, /(ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ|ਬਾਕੀ ਵਿਕਲਪ|ਚੋਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ)/u, `${familyId} explanation must stay direct and question-specific`);
  }
}

for (let seed = 8800; seed < 8860; seed++) {
  const question = generateCP008Question(seed, difficulties[seed % 3]!, "F08");
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.match(question.stem, /(ਅਰਥ|ਅਗੇਤਰ|ਪਿਛੇਤਰ)/u);
  assert.doesNotMatch(question.stem, /\b(root|prefix|suffix|morphology)\b/i);
  assert.doesNotMatch(question.explanation, /\b(root|prefix|suffix|morphology)\b/i);
}

console.log("Running CP008 V4 stress matrix...");
for (let seed = 9000; seed < 9200; seed++) {
  const difficulty = difficulties[seed % 3]!;
  const familyId = families[seed % families.length]!;
  const question = generateCP008Question(seed, difficulty, familyId);
  const validation = validatePunjabiQuestion(question);
  assert.equal(validation.isValid, true, `Validation error at ${familyId}/${difficulty}/seed ${seed}: ${validation.errors.join("; ")}`);
}

console.log("Generating canonical 120-question CP008 V4 review batch...");
const batch = generateCP008ReviewBatch(120, 12000);
assert.equal(batch.totalQuestions, 120);
assert.equal(batch.questions.length, 120);
assert.equal(batch.distribution.easy, 40);
assert.equal(batch.distribution.medium, 40);
assert.equal(batch.distribution.hard, 40);

for (const difficulty of difficulties) {
  for (const familyId of families) {
    const cell = batch.questions.filter((question) => question.difficulty === difficulty && question.metadata.familyId === familyId);
    assert.equal(cell.length, 5, `Review batch must contain exactly 5 questions for ${familyId}/${difficulty}`);
  }
}

for (const question of batch.questions) {
  const validation = validatePunjabiQuestion(question);
  assert.equal(validation.isValid, true, `Review question ${question.id} failed: ${validation.errors.join("; ")}`);
}

const fingerprints = new Set(batch.questions.map((question) => question.metadata.fingerprint));
assert.ok(fingerprints.size >= 100, `Expected broad semantic fingerprint diversity; observed ${fingerprints.size}/120`);

console.log("PUN-001-CP008 V4 tests passed.");
