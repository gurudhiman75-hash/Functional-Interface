import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import {
  generateCP010Question,
  generateCP010ReviewBatch,
  PUN_001_CP010_DEFINITION,
} from "./generator";

console.log("Starting PUN-001-CP010 V2 semantic tests...");

const eligible: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01", "F02"],
  Medium: ["F02", "F03", "F04", "F05"],
  Hard: ["F03", "F04", "F05", "F06", "F07", "F08"],
};

assert.equal(PUN_001_CP010_DEFINITION.cpId, "PUN-001-CP010");
assert.equal(PUN_001_CP010_DEFINITION.families.length, 8);
assert.deepEqual(
  PUN_001_CP010_DEFINITION.families.map((family) => family.familyId),
  ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"]
);

for (const difficulty of Object.keys(eligible) as PunjabiDifficulty[]) {
  for (const familyId of eligible[difficulty]) {
    const a = generateCP010Question(20341, difficulty, familyId);
    const b = generateCP010Question(20341, difficulty, familyId);
    assert.deepEqual(a, b, `${familyId}/${difficulty} must replay deterministically`);
    const validation = validatePunjabiQuestion(a);
    assert.equal(validation.isValid, true, `${familyId}/${difficulty}: ${validation.errors.join("; ")}`);
    assert.equal(a.options.length, 4);
    assert.equal(new Set(a.options).size, 4, `${familyId}/${difficulty} options must be unique`);
    assert.ok(a.correctIndex >= 0 && a.correctIndex < 4);
    assert.match(a.metadata.fingerprint, /^CP010-V2-[0-9a-f]{8}$/);
    assert.doesNotMatch(a.stem, /Mismatched Pair|One[- ]Word|Hard|Easy|Medium/i);
    assert.doesNotMatch(a.explanation, /(ਵਿਕਲਪ A|ਵਿਕਲਪ B|ਵਿਕਲਪ C|ਵਿਕਲਪ D|ਬਾਕੀ ਤਿੰਨ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u);
  }
}

// Difficulty topology must be semantic rather than cosmetic.
assert.throws(() => generateCP010Question(20001, "Medium", "F01"), /not authorized/);
assert.throws(() => generateCP010Question(20001, "Hard", "F01"), /not authorized/);
assert.throws(() => generateCP010Question(20001, "Easy", "F03"), /not authorized/);
assert.throws(() => generateCP010Question(20001, "Medium", "F06"), /not authorized/);
assert.throws(() => generateCP010Question(20001, "Easy", "F08"), /not authorized/);

// The donor F03 fabricated generic sentence shells around every phrase. V2 removes that surface.
for (let seed = 20400; seed < 20500; seed++) {
  const difficulty: PunjabiDifficulty = seed % 2 ? "Medium" : "Hard";
  const q = generateCP010Question(seed, difficulty, "F03");
  assert.doesNotMatch(q.stem, /ਅਸੀਂ ਉਸ ਨੂੰ|ਇਸੇ ਕਰਕੇ ਸਾਰੇ ਉਸ ਨੂੰ|ਜੋ ਵਿਅਕਤੀ ਜਾਂ ਵਸਤੂ/u);
}

// Pair families must keep all four mappings textually unique across a broad reviewer-adjacent range.
for (let seed = 20500; seed < 21000; seed++) {
  for (const familyId of ["F04", "F05"]) {
    const q = generateCP010Question(seed, seed % 2 ? "Medium" : "Hard", familyId);
    assert.equal(new Set(q.options).size, 4, `${familyId}/${seed} collapsed options`);
  }
  for (const familyId of ["F06", "F07", "F08"]) {
    const q = generateCP010Question(seed, "Hard", familyId);
    assert.equal(new Set(q.options).size, 4, `${familyId}/${seed} collapsed options`);
  }
}

console.log("Running CP010 V2 stress matrix...");
for (let seed = 21000; seed < 21600; seed++) {
  const difficulty: PunjabiDifficulty = seed % 3 === 0 ? "Easy" : seed % 3 === 1 ? "Medium" : "Hard";
  const familyOptions = eligible[difficulty];
  const familyId = familyOptions[seed % familyOptions.length]!;
  const q = generateCP010Question(seed, difficulty, familyId);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
}

console.log("Generating canonical 120-question CP010 V2 review batch...");
const batch = generateCP010ReviewBatch(120, 22000);
assert.equal(batch.totalQuestions, 120);
assert.equal(batch.distribution.easy, 40);
assert.equal(batch.distribution.medium, 40);
assert.equal(batch.distribution.hard, 40);
assert.equal(batch.questions.length, 120);

const representedFamilies = new Set(batch.questions.map((q) => q.metadata.familyId));
for (const familyId of ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"]) {
  assert.ok(representedFamilies.has(familyId), `Review batch must represent ${familyId}`);
}
for (const q of batch.questions) {
  const res = validatePunjabiQuestion(q);
  assert.equal(res.isValid, true, `${q.id}: ${res.errors.join("; ")}`);
  assert.equal(new Set(q.options).size, 4, `${q.id} options must stay unique`);
  assert.doesNotMatch(q.explanation, /(ਬਾਕੀ ਤਿੰਨ|Mismatched Pair|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u);
}

const fingerprints = new Set(batch.questions.map((q) => q.metadata.fingerprint));
assert.ok(fingerprints.size >= 100, `Expected broad CP010 semantic diversity; observed ${fingerprints.size}/120`);

console.log("PUN-001-CP010 V2 semantic tests passed.");
