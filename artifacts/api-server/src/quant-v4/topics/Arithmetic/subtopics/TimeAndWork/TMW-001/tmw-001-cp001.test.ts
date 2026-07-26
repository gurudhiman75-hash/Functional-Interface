import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { runTmwCp001Pipeline } from "./foundation/cp001-runtime";
import { equals, multiply, rational } from "./foundation/rational";

assert.equal(TMW_CP001_REGISTRY.length, 12);
assert.equal(new Set(TMW_CP001_REGISTRY.map((entry) => entry.qlId)).size, 12);
assert.deepEqual(
  TMW_CP001_REGISTRY.map((entry) => entry.qlId),
  Array.from({ length: 12 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`),
);

let generated = 0;
for (const entry of TMW_CP001_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp001-proof:${entry.qlId}:${index}`;
    const first = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed });

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
    assert.equal(first.publiclyPublishable, false);
    generated += 1;
  }
}

assert.throws(
  () => runTmwCp001Pipeline({ questionLanguageId: "TMW-QL-001", seed: "unsupported", language: "hi" }),
  /English only/,
);
assert.throws(
  () => runTmwCp001Pipeline({ questionLanguageId: "TMW-QL-999", seed: "unknown" }),
  /Unknown TMW-001 question language/,
);

assert.equal(equals(multiply(rational(2, 3), rational(9, 4)), rational(3, 2)), true);
assert.throws(() => rational(1, 0), /denominator cannot be zero/);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-001",
  qlCount: TMW_CP001_REGISTRY.length,
  seedsPerQl: 20,
  generated,
  status: "PASS",
}, null, 2));
