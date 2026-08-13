import assert from "node:assert/strict";
import { generateNumCp001Wave04, NUM_CP001_WAVE04_PROTOTYPE_IDS } from "./runtime";
import type { NumCp001Difficulty } from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp001Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const dsClasses = new Set<string>();
const dsScenarios = new Set<number>();
const consecutiveLengths = new Set<number>();
let generated = 0;

assert.equal(NUM_CP001_WAVE04_PROTOTYPE_IDS.length, 2);

for (const prototypeId of NUM_CP001_WAVE04_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= SEEDS_PER_PROTOTYPE; seed += 1) {
    const pkg = generateNumCp001Wave04(prototypeId, seed);
    const replay = generateNumCp001Wave04(prototypeId, seed);
    generated += 1;

    assert.equal(JSON.stringify(replay), JSON.stringify(pkg), `${prototypeId} seed ${seed} replay mismatch`);
    assert.equal(pkg.packageId, "NUM-001");
    assert.equal(pkg.checkpointId, "NUM-CP-001");
    assert.equal(pkg.permanentQlId, null);
    assert.equal(pkg.locale, "en-IN");
    assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer, `${prototypeId} seed ${seed} verifier mismatch`);

    assert.equal(pkg.options.length, 4);
    assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${prototypeId} seed ${seed} duplicate options`);
    assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
    assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
    assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId)));

    assert.ok(pkg.stem.length >= 25);
    assert.ok(pkg.explanation.coreConcept.length > 0);
    assert.ok(pkg.explanation.givenDataAndStrategy.length > 0);
    assert.ok(pkg.explanation.stepByStep.length >= 3);
    assert.ok(pkg.explanation.examSpeedMethod.length > 0);
    assert.equal(pkg.explanation.commonTraps.length, 3);
    assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));

    assert.ok(pkg.sourceAncestry.length >= 4);
    assert.ok(pkg.prototypeAncestry.includes(pkg.temporaryPrototypeId));
    assert.ok(pkg.mathematicalFingerprint.length > 8);

    assert.equal(pkg.lifecycle.permanentQlId, null);
    assert.equal(pkg.lifecycle.maturity, "EXECUTABLE_DISCOVERY_PROOF");
    assert.equal(pkg.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY_CANDIDATE");
    assert.equal(pkg.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(pkg.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(pkg.lifecycle.active, false);
    assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
    assert.equal(pkg.lifecycle.questionBankWritable, false);
    assert.equal(pkg.lifecycle.testEligible, false);
    assert.equal(pkg.lifecycle.publiclyPublishable, false);

    const positions = answerPositions.get(prototypeId) ?? new Set<number>();
    positions.add(pkg.correctIndex);
    answerPositions.set(prototypeId, positions);

    const ds = difficulties.get(prototypeId) ?? new Set<NumCp001Difficulty>();
    ds.add(pkg.difficulty);
    difficulties.set(prototypeId, ds);

    const fps = fingerprints.get(prototypeId) ?? new Set<string>();
    fps.add(pkg.mathematicalFingerprint);
    fingerprints.set(prototypeId, fps);

    const state = pkg.hiddenState as Record<string, unknown>;
    if (prototypeId === "NUM-CP001-PROT-025") {
      dsClasses.add(pkg.canonicalAnswer);
      dsScenarios.add(Number(state.scenario));
      const first = state.firstCandidates as number[];
      const second = state.secondCandidates as number[];
      const combined = state.combinedCandidates as number[];
      if (pkg.canonicalAnswer === "I alone is sufficient") {
        assert.equal(first.length, 1);
        assert.ok(second.length > 1);
      } else if (pkg.canonicalAnswer === "II alone is sufficient") {
        assert.ok(first.length > 1);
        assert.equal(second.length, 1);
      } else if (pkg.canonicalAnswer === "Both together are sufficient") {
        assert.ok(first.length > 1);
        assert.ok(second.length > 1);
        assert.equal(combined.length, 1);
      } else {
        assert.ok(combined.length > 1);
      }
    }
    if (prototypeId === "NUM-CP001-PROT-026") {
      consecutiveLengths.add(Number(state.k));
      assert.equal(Number(pkg.canonicalAnswer), Number(state.factorial));
    }
  }
}

assert.equal(generated, 200);
for (const prototypeId of NUM_CP001_WAVE04_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.ok(fingerprints.get(prototypeId)!.size >= 4, `${prototypeId} lacks fingerprint diversity`);
}

assert.deepEqual([...dsClasses].sort(), [
  "Both together are sufficient",
  "Even together are insufficient",
  "I alone is sufficient",
  "II alone is sufficient",
]);
assert.deepEqual([...dsScenarios].sort(), [0, 1, 2, 3]);
assert.deepEqual([...consecutiveLengths].sort((a, b) => a - b), [2, 3, 4, 5]);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE04_RUNTIME_AUTHORITY",
  prototypes: NUM_CP001_WAVE04_PROTOTYPE_IDS.length,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  generated,
  dsClasses: [...dsClasses].sort(),
  dsScenarios: [...dsScenarios].sort(),
  consecutiveLengths: [...consecutiveLengths].sort((a, b) => a - b),
}, null, 2));