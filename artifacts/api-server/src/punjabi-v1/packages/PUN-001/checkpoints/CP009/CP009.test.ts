import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import {
  generateCP009Question,
  generateCP009ReviewBatch,
  PUN_001_CP009_DEFINITION,
} from "./generator";

console.log("Starting PUN-001-CP009 V2 semantic tests...");

const eligible: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01", "F02", "F03", "F05"],
  Medium: ["F02", "F03", "F04", "F05", "F06", "F07", "F08"],
  Hard: ["F04", "F06", "F07", "F08"],
};

assert.equal(PUN_001_CP009_DEFINITION.cpId, "PUN-001-CP009");
assert.equal(PUN_001_CP009_DEFINITION.families.length, 8);
assert.deepEqual(
  PUN_001_CP009_DEFINITION.families.map((family) => family.familyId),
  ["F01", "F02", "F03", "F04", "F05", "F06", "F07", "F08"]
);

for (const difficulty of Object.keys(eligible) as PunjabiDifficulty[]) {
  for (const familyId of eligible[difficulty]) {
    const a = generateCP009Question(9341, difficulty, familyId);
    const b = generateCP009Question(9341, difficulty, familyId);
    assert.deepEqual(a, b, `${familyId}/${difficulty} must replay deterministically`);
    const validation = validatePunjabiQuestion(a);
    assert.equal(validation.isValid, true, `${familyId}/${difficulty}: ${validation.errors.join("; ")}`);
    assert.equal(a.options.length, 4);
    assert.equal(new Set(a.options).size, 4, `${familyId}/${difficulty} options must be unique`);
    assert.ok(a.correctIndex >= 0 && a.correctIndex < 4);
    assert.match(a.metadata.fingerprint, /^CP009-V2-[0-9a-f]{8}$/);
    assert.doesNotMatch(a.stem, /\bAntonym\b|\bSynonym\b/i, "Learner stem must not leak English grammar labels");
    assert.doesNotMatch(a.explanation, /(ਵਿਕਲਪ A|ਵਿਕਲਪ B|ਵਿਕਲਪ C|ਵਿਕਲਪ D|ਬਾਕੀ ਤਿੰਨ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u);
  }
}

// Difficulty must be semantic, not cosmetic: basic direct synonym is Easy only.
assert.throws(() => generateCP009Question(9001, "Medium", "F01"), /not authorized/);
assert.throws(() => generateCP009Question(9001, "Hard", "F01"), /not authorized/);
assert.throws(() => generateCP009Question(9001, "Easy", "F04"), /not authorized/);

// F02 is intentionally one-directional. Its alternatives are source-side
// confusables, so reverse querying cannot accidentally make several answers valid.
for (let seed = 9400; seed < 9460; seed++) {
  const q = generateCP009Question(seed, seed % 2 ? "Easy" : "Medium", "F02");
  assert.equal(new Set(q.options).size, 4);
  assert.doesNotMatch(q.stem, /Antonym/i);
}

// The old CP009 F03 inserted arbitrary words into generic sentence skeletons.
// V2 F03 is relation classification, while authored context is reserved for F04.
for (let seed = 9500; seed < 9560; seed++) {
  const q = generateCP009Question(seed, seed % 2 ? "Easy" : "Medium", "F03");
  assert.match(q.stem, /ਅਰਥ-ਸੰਬੰਧ/u);
  assert.doesNotMatch(q.stem, /ਅਧਿਆਪਕ ਨੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ/u);
}
for (let seed = 9560; seed < 9620; seed++) {
  const q = generateCP009Question(seed, seed % 2 ? "Medium" : "Hard", "F04");
  assert.equal(new Set(q.options).size, 4);
}

console.log("Running CP009 V2 stress matrix...");
for (let seed = 9700; seed < 10100; seed++) {
  const difficulty: PunjabiDifficulty = seed % 3 === 0 ? "Easy" : seed % 3 === 1 ? "Medium" : "Hard";
  const familyOptions = eligible[difficulty];
  const familyId = familyOptions[seed % familyOptions.length]!;
  const q = generateCP009Question(seed, difficulty, familyId);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
}

console.log("Generating canonical 120-question CP009 V2 review batch...");
const batch = generateCP009ReviewBatch(120, 17000);
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
  assert.doesNotMatch(q.stem, /\bAntonym\b|\bSynonym\b/i);
}

const fingerprints = new Set(batch.questions.map((q) => q.metadata.fingerprint));
assert.ok(fingerprints.size >= 100, `Expected broad CP009 semantic diversity; observed ${fingerprints.size}/120`);

console.log("PUN-001-CP009 V2 semantic tests passed.");
