import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import { generateCP011Question, generateCP011ReviewBatch, PUN_001_CP011_DEFINITION } from "./generator";

console.log("Starting PUN-001-CP011 V2 semantic tests...");

const eligible: Record<PunjabiDifficulty, readonly string[]> = {
  Easy: ["F01", "F03"],
  Medium: ["F02", "F03", "F04", "F05", "F06"],
  Hard: ["F02", "F04", "F05", "F06", "F07", "F08"],
};

assert.equal(PUN_001_CP011_DEFINITION.cpId, "PUN-001-CP011");
assert.equal(PUN_001_CP011_DEFINITION.families.length, 8);
assert.deepEqual(PUN_001_CP011_DEFINITION.families.map((f) => f.familyId), ["F01","F02","F03","F04","F05","F06","F07","F08"]);

for (const difficulty of Object.keys(eligible) as PunjabiDifficulty[]) {
  for (const familyId of eligible[difficulty]) {
    const a = generateCP011Question(19341, difficulty, familyId);
    const b = generateCP011Question(19341, difficulty, familyId);
    assert.deepEqual(a, b, `${familyId}/${difficulty} must replay deterministically`);
    const validation = validatePunjabiQuestion(a);
    assert.equal(validation.isValid, true, `${familyId}/${difficulty}: ${validation.errors.join("; ")}`);
    assert.equal(a.options.length, 4);
    assert.equal(new Set(a.options).size, 4, `${familyId}/${difficulty} options must be unique`);
    assert.match(a.metadata.fingerprint, /^CP011-V2-[0-9a-f]{8}$/);
    assert.doesNotMatch(a.stem, /Literal|Figurative|Distractor|Trap/i);
    assert.doesNotMatch(a.explanation, /(ਵਿਕਲਪ A|ਵਿਕਲਪ B|ਵਿਕਲਪ C|ਵਿਕਲਪ D|ਬਾਕੀ ਤਿੰਨ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ|ਪ੍ਰੀਖਿਆਵਾਂ ਵਿੱਚ ਭੁਲੇਖਾ)/u);
  }
}

assert.throws(() => generateCP011Question(1, "Medium", "F01"), /not authorized/);
assert.throws(() => generateCP011Question(1, "Hard", "F01"), /not authorized/);
assert.throws(() => generateCP011Question(1, "Easy", "F02"), /not authorized/);
assert.throws(() => generateCP011Question(1, "Easy", "F07"), /not authorized/);

// Authored-context family must expose a real blank-bearing authority sentence, not a synthetic shell.
for (let seed = 19400; seed < 19520; seed++) {
  const q = generateCP011Question(seed, seed % 2 ? "Medium" : "Hard", "F02");
  assert.match(q.stem, /_____/u);
  assert.doesNotMatch(q.stem, /ਕਿਸੇ ਅਜਿਹੀ ਸਥਿਤੀ ਲਈ ਜਿੱਥੇ/u);
}

// Pair and semantic-confusable families get a wider stress sweep because duplicate semantic records
// can otherwise collapse option text even when authority ids differ.
for (let seed = 19600; seed < 20100; seed++) {
  const hardFamily = ["F04", "F05", "F06", "F07", "F08"][seed % 5]!;
  const q = generateCP011Question(seed, "Hard", hardFamily);
  assert.equal(new Set(q.options).size, 4, `${q.id} duplicate options`);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
}

console.log("Running CP011 V2 stress matrix...");
for (let seed = 20100; seed < 20700; seed++) {
  const difficulty: PunjabiDifficulty = seed % 3 === 0 ? "Easy" : seed % 3 === 1 ? "Medium" : "Hard";
  const fams = eligible[difficulty];
  const q = generateCP011Question(seed, difficulty, fams[seed % fams.length]);
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
  assert.equal(new Set(q.options).size, 4);
}

console.log("Generating canonical 120-question CP011 V2 review batch...");
const batch = generateCP011ReviewBatch(120, 21000);
assert.equal(batch.totalQuestions, 120);
assert.equal(batch.distribution.easy, 40);
assert.equal(batch.distribution.medium, 40);
assert.equal(batch.distribution.hard, 40);
assert.equal(batch.questions.length, 120);

const represented = new Set(batch.questions.map((q) => q.metadata.familyId));
for (const familyId of ["F01","F02","F03","F04","F05","F06","F07","F08"]) {
  assert.ok(represented.has(familyId), `Review batch must represent ${familyId}`);
}
for (const q of batch.questions) {
  const validation = validatePunjabiQuestion(q);
  assert.equal(validation.isValid, true, `${q.id}: ${validation.errors.join("; ")}`);
  assert.equal(new Set(q.options).size, 4, `${q.id} duplicate options`);
}
const fingerprints = new Set(batch.questions.map((q) => q.metadata.fingerprint));
assert.ok(fingerprints.size >= 100, `Expected broad CP011 diversity; observed ${fingerprints.size}/120`);

console.log("PUN-001-CP011 V2 semantic tests passed.");
