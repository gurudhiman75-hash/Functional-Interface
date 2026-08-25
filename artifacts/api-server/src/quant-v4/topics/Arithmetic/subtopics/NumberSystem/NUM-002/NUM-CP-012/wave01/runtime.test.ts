import assert from "node:assert/strict";

import { generateNumCp012Wave01 } from "./runtime.ts";
import { NUM_CP012_WAVE01_PROTOTYPE_IDS } from "./types.ts";

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
const fingerprints = new Map<string, Set<string>>();
const answerPositions = new Map<string, Set<number>>();
const representations = new Map<string, Set<string>>();
const answerSemantics = new Map<string, Set<string>>();
let multiplierOneStates = 0;
let divisorOneStates = 0;
let additiveZeroStates = 0;
let fourthPowerStates = 0;

for (const prototypeId of NUM_CP012_WAVE01_PROTOTYPE_IDS) {
  fingerprints.set(prototypeId, new Set());
  answerPositions.set(prototypeId, new Set());
  representations.set(prototypeId, new Set());
  answerSemantics.set(prototypeId, new Set());

  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateNumCp012Wave01(prototypeId, seed);
    const replay = generateNumCp012Wave01(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-012", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: independent verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer mismatch`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate option values`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected exactly one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index binding drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option does not equal answer`);
    for (const option of q.options) {
      assert.ok(option.misconceptionId.length > 0, `${label}: option missing misconception identity`);
    }
    optionChecks += 1;

    const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(words(learnerText) >= 30, `${label}: learner explanation too thin`);
    assert.ok(words(learnerText) <= 190, `${label}: learner explanation too long`);
    assert.doesNotMatch(
      learnerText,
      /prototype|generator|hidden state|fingerprint|authority package|source ancestry|lifecycle gate/iu,
      `${label}: implementation vocabulary leak`,
    );
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "WAVE01_REVIEW_REQUIRED", `${label}: review status drift`);
    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated during discovery`);
    lifecycleChecks += 1;

    fingerprints.get(prototypeId)!.add(q.mathematicalFingerprint);
    answerPositions.get(prototypeId)!.add(q.correctIndex);
    representations.get(prototypeId)!.add(q.representation);
    answerSemantics.get(prototypeId)!.add(q.answerSemantic);

    if (prototypeId === "NUM-CP012-PROT-003" && q.canonicalAnswer === "1") multiplierOneStates += 1;
    if (prototypeId === "NUM-CP012-PROT-004" && q.canonicalAnswer === "1") divisorOneStates += 1;
    if (prototypeId === "NUM-CP012-PROT-008" && q.canonicalAnswer === "0") additiveZeroStates += 1;
    if (
      (prototypeId === "NUM-CP012-PROT-001" || prototypeId === "NUM-CP012-PROT-002")
      && Number(q.hiddenState.k) === 4
    ) fourthPowerStates += 1;

    packages += 1;
  }
}

assert.equal(packages, NUM_CP012_WAVE01_PROTOTYPE_IDS.length * 100);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

for (const prototypeId of NUM_CP012_WAVE01_PROTOTYPE_IDS) {
  assert.ok(fingerprints.get(prototypeId)!.size >= 25, `${prototypeId}: mathematical state pool too thin`);
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3], `${prototypeId}: all four answer positions not reached`);
}

assert.ok(multiplierOneStates > 0, "Least-multiplier authority did not reach already-perfect multiplier=1 state");
assert.ok(divisorOneStates > 0, "Least-divisor authority did not reach already-perfect divisor=1 state");
assert.ok(additiveZeroStates > 0, "Additive-completion authority did not reach already-perfect completion=0 state");
assert.ok(fourthPowerStates > 0, "Recognition/root foundation did not reach general fourth-power states");
assert.deepEqual(
  [...representations.get("NUM-CP012-PROT-008")!].sort(),
  ["NEXT_POWER_BOUNDARY", "PREVIOUS_POWER_BOUNDARY"],
  "Additive boundary authority did not reach both addition and subtraction directions",
);
assert.deepEqual(
  [...answerSemantics.get("NUM-CP012-PROT-008")!].sort(),
  ["LEAST_ADDITION_TO_PERFECT_POWER", "LEAST_SUBTRACTION_TO_PERFECT_POWER"],
  "Additive boundary answer semantics did not reach both directions",
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_WAVE01_PERFECT_POWER_FOUNDATION",
  prototypes: NUM_CP012_WAVE01_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  permanentQlAllocations: 0,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  multiplierOneStates,
  divisorOneStates,
  additiveZeroStates,
  fourthPowerStates,
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  answerPositions: Object.fromEntries([...answerPositions].map(([id, values]) => [id, [...values].sort()])),
  representations: Object.fromEntries([...representations].map(([id, values]) => [id, [...values].sort()])),
}, null, 2));
