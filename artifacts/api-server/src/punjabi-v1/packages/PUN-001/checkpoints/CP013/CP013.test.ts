import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import { generateCP013Question, generateCP013ReviewBatch, PUN_001_CP013_DEFINITION } from "./generator";

console.log("Starting PUN-001-CP013 V2 semantic tests...");

const eligible: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01", "F02", "F03", "F05"],
  Medium: ["F01", "F03", "F04", "F05", "F06", "F07"],
  Hard: ["F04", "F06", "F07", "F08"],
};

assert.equal(PUN_001_CP013_DEFINITION.cpId, "PUN-001-CP013");
assert.equal(PUN_001_CP013_DEFINITION.families.length, 8);
assert.deepEqual(PUN_001_CP013_DEFINITION.families.map((f) => f.familyId), ["F01","F02","F03","F04","F05","F06","F07","F08"]);

for (const difficulty of Object.keys(eligible) as PunjabiDifficulty[]) {
  for (const familyId of eligible[difficulty]) {
    const a = generateCP013Question(25341, difficulty, familyId);
    const b = generateCP013Question(25341, difficulty, familyId);
    assert.deepEqual(a, b, `${familyId}/${difficulty} must replay deterministically`);
    const validation = validatePunjabiQuestion(a);
    assert.equal(validation.isValid, true, `${familyId}/${difficulty}: ${validation.errors.join("; ")}`);
    assert.equal(a.options.length, 4);
    assert.equal(new Set(a.options).size, 4, `${familyId}/${difficulty} options must be unique`);
    assert.match(a.metadata.fingerprint, /^CP013-V2-[0-9a-f]{8}$/);
    assert.doesNotMatch(a.explanation, /(ਵਿਕਲਪ A|ਵਿਕਲਪ B|ਵਿਕਲਪ C|ਵਿਕਲਪ D|ਬਾਕੀ ਤਿੰਨ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u);
    assert.doesNotMatch(a.stem, /(ਗੂੜ੍ਹ|ਡੂੰਘੇ ਵਿਆਕਰਨਕ ਮੁਲੰਕਣ|ਵਿਸ਼ੇਸ਼ ਸੰਰਚਨਾ)/u);
  }
}

assert.throws(() => generateCP013Question(1, "Hard", "F01"), /not authorized/);
assert.throws(() => generateCP013Question(1, "Medium", "F02"), /not authorized/);
assert.throws(() => generateCP013Question(1, "Easy", "F04"), /not authorized/);
assert.throws(() => generateCP013Question(1, "Easy", "F08"), /not authorized/);

// Forward and reverse transformations must be materially different tasks.
for (let seed = 25400; seed < 25500; seed++) {
  const forward = generateCP013Question(seed, "Medium", "F03");
  const reverse = generateCP013Question(seed, "Medium", "F04");
  assert.notEqual(forward.stem, reverse.stem);
  assert.doesNotMatch(forward.stem, /ਮੂਲ .* ਰੂਪ ਕਿਹੜਾ/u);
  assert.match(reverse.stem, /ਮੂਲ/u);
}

// Stress correction, diagnosis, pair and dual-analysis families for duplicate rendered options.
for (let seed = 25500; seed < 26100; seed++) {
  const difficulty: PunjabiDifficulty = seed % 2 === 0 ? "Medium" : "Hard";
  const candidates = difficulty === "Medium" ? ["F04","F05","F06","F07"] : ["F04","F06","F07","F08"];
  const familyId = candidates[seed % candidates.length]!;
  const q = generateCP013Question(seed, difficulty, familyId);
  assert.equal(new Set(q.options).size, 4, `${q.id} duplicate options`);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
}

console.log("Running CP013 V2 mixed stress matrix...");
for (let seed = 26100; seed < 26700; seed++) {
  const difficulty: PunjabiDifficulty = seed % 3 === 0 ? "Easy" : seed % 3 === 1 ? "Medium" : "Hard";
  const fams = eligible[difficulty];
  const q = generateCP013Question(seed, difficulty, fams[seed % fams.length]);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
  assert.equal(new Set(q.options).size, 4);
}

console.log("Generating canonical 120-question CP013 V2 review batch...");
const batch = generateCP013ReviewBatch(120, 27000);
assert.equal(batch.totalQuestions, 120);
assert.equal(batch.distribution.easy, 40);
assert.equal(batch.distribution.medium, 40);
assert.equal(batch.distribution.hard, 40);
const represented = new Set(batch.questions.map((q) => q.metadata.familyId));
for (const familyId of ["F01","F02","F03","F04","F05","F06","F07","F08"]) assert.ok(represented.has(familyId), `Review batch must represent ${familyId}`);
for (const q of batch.questions) {
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
  assert.equal(new Set(q.options).size, 4, `${q.id} duplicate options`);
}
assert.ok(new Set(batch.questions.map((q) => q.metadata.fingerprint)).size >= 100, "Expected broad CP013 diversity");
console.log("PUN-001-CP013 V2 semantic tests passed.");
