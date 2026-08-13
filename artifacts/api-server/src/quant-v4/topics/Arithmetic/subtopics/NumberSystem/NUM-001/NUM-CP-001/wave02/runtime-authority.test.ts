import assert from "node:assert/strict";
import { generateNumCp001Wave02, NUM_CP001_WAVE02_PROTOTYPE_IDS } from "./runtime";
import type { NumCp001Difficulty } from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp001Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const p009Modes = new Set<number>();
const p010Topologies = new Set<string>();
const p012Topologies = new Set<string>();
const p013Kinds = new Set<string>();
const p014Signs = new Set<string>();
const p015Modes = new Set<number>();
const p016Topologies = new Set<string>();
let generated = 0;

assert.equal(NUM_CP001_WAVE02_PROTOTYPE_IDS.length, 8);

for (const prototypeId of NUM_CP001_WAVE02_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= SEEDS_PER_PROTOTYPE; seed += 1) {
    const pkg = generateNumCp001Wave02(prototypeId, seed);
    const replay = generateNumCp001Wave02(prototypeId, seed);
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
    if (prototypeId === "NUM-CP001-PROT-009") p009Modes.add(Number(state.mode));
    if (prototypeId === "NUM-CP001-PROT-010") p010Topologies.add(`${String(state.least)}:${String(state.strict)}`);
    if (prototypeId === "NUM-CP001-PROT-012") p012Topologies.add(`${String(state.leftInclusive)}:${String(state.rightInclusive)}`);
    if (prototypeId === "NUM-CP001-PROT-013") p013Kinds.add(String(state.kind));
    if (prototypeId === "NUM-CP001-PROT-014") p014Signs.add(Number(state.centre) < 0 ? "NEGATIVE_CENTRE" : Number(state.centre) > 0 ? "POSITIVE_CENTRE" : "ZERO_CENTRE");
    if (prototypeId === "NUM-CP001-PROT-015") p015Modes.add(Number(state.mode));
    if (prototypeId === "NUM-CP001-PROT-016") p016Topologies.add(`${String(state.odd)}:${String(state.len)}`);
  }
}

assert.equal(generated, 800);
for (const prototypeId of NUM_CP001_WAVE02_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.ok(fingerprints.get(prototypeId)!.size >= 4, `${prototypeId} lacks fingerprint diversity`);
}

assert.deepEqual([...p009Modes].sort(), [0, 1, 2, 3]);
assert.deepEqual([...p010Topologies].sort(), ["false:false", "false:true", "true:false", "true:true"]);
assert.deepEqual([...p012Topologies].sort(), ["false:false", "false:true", "true:false", "true:true"]);
assert.deepEqual([...p013Kinds].sort(), ["even", "negative", "odd", "positive"]);
assert.deepEqual([...p014Signs].sort(), ["NEGATIVE_CENTRE", "POSITIVE_CENTRE", "ZERO_CENTRE"]);
assert.deepEqual([...p015Modes].sort(), [0, 1, 2, 3]);
assert.deepEqual([...p016Topologies].sort(), ["false:3", "false:5", "true:3", "true:5"]);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE02_RUNTIME_AUTHORITY",
  prototypes: NUM_CP001_WAVE02_PROTOTYPE_IDS.length,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  generated,
  p009Modes: [...p009Modes].sort(),
  p010Topologies: [...p010Topologies].sort(),
  p012Topologies: [...p012Topologies].sort(),
  p013Kinds: [...p013Kinds].sort(),
  p014Signs: [...p014Signs].sort(),
  p015Modes: [...p015Modes].sort(),
  p016Topologies: [...p016Topologies].sort(),
}, null, 2));
