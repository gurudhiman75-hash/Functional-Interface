import { strict as assert } from "node:assert";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { runTmwCp003Pipeline } from "./foundation/cp003-runtime";

assert.equal(TMW_CP003_REGISTRY.length, 23);
assert.equal(new Set(TMW_CP003_REGISTRY.map((entry) => entry.qlId)).size, 23);
assert.deepEqual(
  TMW_CP003_REGISTRY.map((entry) => entry.qlId),
  Array.from({ length: 23 }, (_, index) => `TMW-QL-${String(index + 35).padStart(3, "0")}`),
);

let generated = 0;
const correctPositions = new Set<number>();
const stems = new Set<string>();
for (const entry of TMW_CP003_REGISTRY) {
  for (let index = 0; index < 50; index += 1) {
    const seed = `tmw-cp003-proof:${entry.qlId}:${index}`;
    const first = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.equal(first.validation.valid, true, `${entry.qlId}:${first.validation.errors.join(", ")}`);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.parameters, second.parameters);
    assert.deepEqual(first.options, second.options);
    assert.deepEqual(first.solution, second.solution);
    assert.deepEqual(first.explanation, second.explanation);
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length, 1);
    assert.equal(first.publiclyPublishable, false);
    correctPositions.add(first.correctIndex);
    stems.add(first.stem);
    generated += 1;
  }
}

assert.deepEqual([...correctPositions].sort(), [0, 1, 2, 3]);
assert.ok(stems.size >= 350, `Expected broad rendered-stem diversity, received ${stems.size}`);
assert.throws(() => runTmwCp003Pipeline({ questionLanguageId: "TMW-QL-035", seed: "unsupported", language: "hi" }), /English only/);
assert.throws(() => runTmwCp003Pipeline({ questionLanguageId: "TMW-QL-999", seed: "unknown" }), /Unknown TMW-CP-003/);

console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-003", qlCount: 23, seedsPerQl: 50, generated, distinctStems: stems.size, correctPositions: [...correctPositions].sort(), status: "PASS" }, null, 2));
