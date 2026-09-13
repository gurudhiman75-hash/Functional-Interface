import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import { generateCP012Question, generateCP012ReviewBatch, PUN_001_CP012_DEFINITION } from "./generator";

console.log("Starting PUN-001-CP012 V2 semantic tests...");

const eligible: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01","F02","F05"],
  Medium: ["F02","F03","F04","F05","F06","F07"],
  Hard: ["F03","F04","F06","F07","F08"],
};

assert.equal(PUN_001_CP012_DEFINITION.cpId, "PUN-001-CP012");
assert.equal(PUN_001_CP012_DEFINITION.families.length, 8);
assert.deepEqual(PUN_001_CP012_DEFINITION.families.map((f) => f.familyId), ["F01","F02","F03","F04","F05","F06","F07","F08"]);

for (const difficulty of Object.keys(eligible) as PunjabiDifficulty[]) {
  for (const familyId of eligible[difficulty]) {
    const a = generateCP012Question(22341, difficulty, familyId);
    const b = generateCP012Question(22341, difficulty, familyId);
    assert.deepEqual(a, b, `${familyId}/${difficulty} must replay deterministically`);
    const validation = validatePunjabiQuestion(a);
    assert.equal(validation.isValid, true, `${familyId}/${difficulty}: ${validation.errors.join("; ")}`);
    assert.equal(a.options.length, 4);
    assert.equal(new Set(a.options).size, 4, `${familyId}/${difficulty} options must be unique`);
    assert.match(a.metadata.fingerprint, /^CP012-V2-[0-9a-f]{8}$/);
    assert.doesNotMatch(a.explanation, /(ਵਿਕਲਪ A|ਵਿਕਲਪ B|ਵਿਕਲਪ C|ਵਿਕਲਪ D|ਬਾਕੀ ਤਿੰਨ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u);
  }
}

assert.throws(() => generateCP012Question(1, "Medium", "F01"), /not authorized/);
assert.throws(() => generateCP012Question(1, "Hard", "F01"), /not authorized/);
assert.throws(() => generateCP012Question(1, "Easy", "F03"), /not authorized/);
assert.throws(() => generateCP012Question(1, "Easy", "F08"), /not authorized/);

// Situation family must expose the authority-authored situation, not a generated scenario shell.
for (let seed = 22400; seed < 22520; seed++) {
  const q = generateCP012Question(seed, seed % 2 ? "Medium" : "Hard", "F04");
  assert.match(q.stem, /ਸਥਿਤੀ/u);
  assert.doesNotMatch(q.stem, /ਕਿਸੇ ਅਜਿਹੇ ਵਿਅਕਤੀ|ਕਲਪਨਾ ਕਰੋ/u);
}

// Completion and semantic pair families need broad duplicate-option stress.
for (let seed = 22600; seed < 23100; seed++) {
  const hardFamily = ["F03","F04","F06","F07","F08"][seed % 5]!;
  const q = generateCP012Question(seed, "Hard", hardFamily);
  assert.equal(new Set(q.options).size, 4, `${q.id} duplicate options`);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
}

console.log("Running CP012 V2 stress matrix...");
for (let seed = 23100; seed < 23700; seed++) {
  const difficulty: PunjabiDifficulty = seed % 3 === 0 ? "Easy" : seed % 3 === 1 ? "Medium" : "Hard";
  const fams = eligible[difficulty];
  const q = generateCP012Question(seed, difficulty, fams[seed % fams.length]);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
  assert.equal(new Set(q.options).size, 4);
}

console.log("Generating canonical 120-question CP012 V2 review batch...");
const batch = generateCP012ReviewBatch(120, 24000);
assert.equal(batch.totalQuestions, 120);
assert.equal(batch.distribution.easy, 40);
assert.equal(batch.distribution.medium, 40);
assert.equal(batch.distribution.hard, 40);
assert.equal(batch.questions.length, 120);

const represented = new Set(batch.questions.map((q) => q.metadata.familyId));
for (const familyId of ["F01","F02","F03","F04","F05","F06","F07","F08"]) assert.ok(represented.has(familyId), `Review batch must represent ${familyId}`);
for (const q of batch.questions) {
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
  assert.equal(new Set(q.options).size, 4, `${q.id} duplicate options`);
}
const fingerprints = new Set(batch.questions.map((q) => q.metadata.fingerprint));
assert.ok(fingerprints.size >= 100, `Expected broad CP012 diversity; observed ${fingerprints.size}/120`);

console.log("PUN-001-CP012 V2 semantic tests passed.");
