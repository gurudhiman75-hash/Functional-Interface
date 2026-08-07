import { strict as assert } from "node:assert";
import {
  getProbabilityCoverageSnapshot,
  listProbabilityQuestionEntries,
  runProbabilityPipeline,
  runPrb001Pipeline,
  runPrb002Pipeline,
} from "./runtime";

const snapshot = getProbabilityCoverageSnapshot();
assert.equal(snapshot.total, 216);
assert.equal(snapshot.byPackage["PRB-001"], 120);
assert.equal(snapshot.byPackage["PRB-002"], 96);

const entries = listProbabilityQuestionEntries();
assert.equal(entries.length, 216);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 216);

let deterministicRuns = 0;
for (const entry of entries) {
  for (const suffix of ["a", "b"]) {
    const input = {
      seed: `probability-proof:${entry.qlId}:${suffix}`,
      questionLanguageId: entry.qlId,
    };
    const first = runProbabilityPipeline(entry.packageId, entry.cpId, input);
    const second = runProbabilityPipeline(entry.packageId, entry.cpId, input);
    assert.deepEqual(second, first, `non-deterministic output for ${entry.qlId}`);
    assert.equal(first.validation.valid, true, `invalid package for ${entry.qlId}`);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.independentVerification.matched, true);
    deterministicRuns += 1;
  }
}

let smokeRuns = 0;
for (const cpId of Object.keys(snapshot.byCp)) {
  const packageId = Number(cpId.slice(-3)) <= 5 ? "PRB-001" : "PRB-002";
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    for (let index = 0; index < 20; index += 1) {
      const question = runProbabilityPipeline(packageId, cpId as any, {
        difficulty,
        seed: `probability-smoke:${cpId}:${difficulty}:${index}`,
      });
      assert.equal(question.validation.valid, true);
      assert.equal(question.difficultyBand, difficulty);
      smokeRuns += 1;
    }
  }
}

assert.equal(runPrb001Pipeline(undefined, { seed: "prb001-default" }).packageId, "PRB-001");
assert.equal(runPrb002Pipeline(undefined, { seed: "prb002-default" }).packageId, "PRB-002");
assert.throws(() => runPrb001Pipeline(undefined, { language: "hi" }), /English-only/);

console.log(JSON.stringify({ snapshot, deterministicRuns, smokeRuns }));
