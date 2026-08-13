import assert from "node:assert/strict";
import { generateNumCp001Wave03, NUM_CP001_WAVE03_PROTOTYPE_IDS } from "./runtime";
import type { NumCp001Difficulty } from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp001Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const p017Modes = new Set<number>();
const p018Permutations = new Set<string>();
const p019Topologies = new Set<number>();
const p020Modes = new Set<number>();
const p021Lengths = new Set<number>();
const p022Targets = new Set<string>();
const p022Lengths = new Set<number>();
const p023Feasibility = new Set<string>();
const p023Lengths = new Set<number>();
const p024Modes = new Set<number>();
let generated = 0;

assert.equal(NUM_CP001_WAVE03_PROTOTYPE_IDS.length, 8);

for (const prototypeId of NUM_CP001_WAVE03_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= SEEDS_PER_PROTOTYPE; seed += 1) {
    const pkg = generateNumCp001Wave03(prototypeId, seed);
    const replay = generateNumCp001Wave03(prototypeId, seed);
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

    assert.ok(pkg.stem.length >= 20);
    assert.ok(pkg.explanation.coreConcept.length > 0);
    assert.ok(pkg.explanation.givenDataAndStrategy.length > 0);
    assert.ok(pkg.explanation.stepByStep.length >= 3);
    assert.ok(pkg.explanation.examSpeedMethod.length > 0);
    assert.equal(pkg.explanation.commonTraps.length, 3);
    assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));

    assert.ok(pkg.sourceAncestry.length >= 3);
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
    if (prototypeId === "NUM-CP001-PROT-017") p017Modes.add(Number(state.mode));
    if (prototypeId === "NUM-CP001-PROT-018") p018Permutations.add(JSON.stringify(state.permutation));
    if (prototypeId === "NUM-CP001-PROT-019") p019Topologies.add(Number(state.topology));
    if (prototypeId === "NUM-CP001-PROT-020") p020Modes.add(Number(state.mode));
    if (prototypeId === "NUM-CP001-PROT-021") p021Lengths.add(Number(state.len));
    if (prototypeId === "NUM-CP001-PROT-022") {
      p022Targets.add(String(state.target));
      p022Lengths.add(Number(state.len));
    }
    if (prototypeId === "NUM-CP001-PROT-023") {
      p023Feasibility.add(String(state.possible));
      p023Lengths.add(Number(state.len));
    }
    if (prototypeId === "NUM-CP001-PROT-024") p024Modes.add(Number(state.mode));
  }
}

assert.equal(generated, 800);
for (const prototypeId of NUM_CP001_WAVE03_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.ok(fingerprints.get(prototypeId)!.size >= 4, `${prototypeId} lacks fingerprint diversity`);
}

assert.deepEqual([...p017Modes].sort(), [0, 1, 2, 3]);
assert.equal(p018Permutations.size, 4);
assert.deepEqual([...p019Topologies].sort(), [0, 1, 2, 3]);
assert.deepEqual([...p020Modes].sort(), [0, 1, 2, 3]);
assert.deepEqual([...p021Lengths].sort(), [4, 5, 6]);
assert.deepEqual([...p022Targets].sort(), ["first", "last", "middle"]);
assert.deepEqual([...p022Lengths].sort(), [5, 7]);
assert.deepEqual([...p023Feasibility].sort(), ["false", "true"]);
assert.deepEqual([...p023Lengths].sort(), [3, 4, 5, 6]);
assert.deepEqual([...p024Modes].sort(), [0, 1, 2, 3]);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE03_RUNTIME_AUTHORITY",
  prototypes: NUM_CP001_WAVE03_PROTOTYPE_IDS.length,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  generated,
  p017Modes: [...p017Modes].sort(),
  p018Permutations: p018Permutations.size,
  p019Topologies: [...p019Topologies].sort(),
  p020Modes: [...p020Modes].sort(),
  p021Lengths: [...p021Lengths].sort(),
  p022Targets: [...p022Targets].sort(),
  p022Lengths: [...p022Lengths].sort(),
  p023Feasibility: [...p023Feasibility].sort(),
  p023Lengths: [...p023Lengths].sort(),
  p024Modes: [...p024Modes].sort(),
}, null, 2));
