import { strict as assert } from "node:assert";
import type { PunjabiDifficulty } from "../../../../core/types";
import { validatePunjabiQuestion } from "../CP001/validator";
import { CP014_V2_ELIGIBLE, generateCP014V2Question, generateCP014V2ReviewBatch, PUN_001_CP014_V2_DEFINITION } from "./generator-v2";

console.log("Starting PUN-001-CP014 V2 semantic tests...");
assert.equal(PUN_001_CP014_V2_DEFINITION.families.length, 8);
assert.deepEqual(PUN_001_CP014_V2_DEFINITION.families.map((f) => f.familyId), ["F01","F02","F03","F04","F05","F06","F07","F08"]);
for (const difficulty of Object.keys(CP014_V2_ELIGIBLE) as PunjabiDifficulty[]) {
  for (const familyId of CP014_V2_ELIGIBLE[difficulty]) {
    const a = generateCP014V2Question(28341, difficulty, familyId); const b = generateCP014V2Question(28341, difficulty, familyId);
    assert.deepEqual(a, b); const v = validatePunjabiQuestion(a); assert.equal(v.isValid, true, `${a.id}: ${v.errors.join("; ")}`);
    assert.equal(a.options.length, 4); assert.equal(new Set(a.options).size, 4); assert.match(a.metadata.fingerprint, /^CP014-V2-[0-9a-f]{8}$/);
    assert.doesNotMatch(a.explanation, /(ਵਿਕਲਪ A|ਵਿਕਲਪ B|ਵਿਕਲਪ C|ਵਿਕਲਪ D|ਬਾਕੀ ਤਿੰਨ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u);
  }
}
assert.throws(() => generateCP014V2Question(1, "Easy", "F02"), /not authorized/);
assert.throws(() => generateCP014V2Question(1, "Hard", "F04"), /not authorized/);
assert.throws(() => generateCP014V2Question(1, "Medium", "F07"), /not authorized/);
console.log("Running CP014 V2 stress matrix...");
for (let seed = 28400; seed < 29200; seed++) {
  const difficulty: PunjabiDifficulty = seed % 3 === 0 ? "Easy" : seed % 3 === 1 ? "Medium" : "Hard";
  const fams = CP014_V2_ELIGIBLE[difficulty]; const q = generateCP014V2Question(seed, difficulty, fams[seed % fams.length]);
  const v = validatePunjabiQuestion(q); assert.equal(v.isValid, true, `${q.id}: ${v.errors.join("; ")}`); assert.equal(new Set(q.options).size, 4, `${q.id} duplicate options`);
}
const batch = generateCP014V2ReviewBatch(120, 29200);
assert.equal(batch.totalQuestions, 120); assert.equal(batch.distribution.easy, 40); assert.equal(batch.distribution.medium, 40); assert.equal(batch.distribution.hard, 40);
const represented = new Set(batch.questions.map((q) => q.metadata.familyId));
for (const id of ["F01","F02","F03","F04","F05","F06","F07","F08"]) assert.ok(represented.has(id), `Review batch must represent ${id}`);
for (const q of batch.questions) { const v = validatePunjabiQuestion(q); assert.equal(v.isValid, true, `${q.id}: ${v.errors.join("; ")}`); assert.equal(new Set(q.options).size, 4); }
assert.ok(new Set(batch.questions.map((q) => q.metadata.fingerprint)).size >= 100);
console.log("PUN-001-CP014 V2 semantic tests passed.");
