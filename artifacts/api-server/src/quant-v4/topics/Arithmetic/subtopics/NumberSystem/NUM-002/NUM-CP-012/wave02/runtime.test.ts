import assert from "node:assert/strict";

import { generateNumCp012Wave02 } from "./runtime.ts";
import { NUM_CP012_WAVE02_PROTOTYPE_IDS } from "./types.ts";

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

let zeroRootStates = 0;
let oneRootStates = 0;
let negativeOddRootStates = 0;
let negativeEvenNoRootStates = 0;
let exactBoundStates = 0;
let nearestLowerStates = 0;
let nearestUpperStates = 0;
let nearestTieStates = 0;
let alreadyPerfectMultipleStates = 0;

for (const prototypeId of NUM_CP012_WAVE02_PROTOTYPE_IDS) {
  fingerprints.set(prototypeId, new Set());
  answerPositions.set(prototypeId, new Set());
  representations.set(prototypeId, new Set());
  answerSemantics.set(prototypeId, new Set());

  for (let seed = 1; seed <= 80; seed += 1) {
    const q = generateNumCp012Wave02(prototypeId, seed);
    const replay = generateNumCp012Wave02(prototypeId, seed);
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
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index binding drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option does not bind answer`);
    for (const option of q.options) assert.ok(option.misconceptionId.length > 0, `${label}: missing misconception identity`);
    optionChecks += 1;

    const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(words(learnerText) >= 30, `${label}: learner explanation too thin (${words(learnerText)} words)`);
    assert.ok(words(learnerText) <= 200, `${label}: learner explanation too long (${words(learnerText)} words)`);
    assert.doesNotMatch(
      learnerText,
      /prototype|generator|hidden state|fingerprint|authority package|source ancestry|lifecycle gate/iu,
      `${label}: implementation vocabulary leak`,
    );
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "WAVE02_REVIEW_REQUIRED", `${label}: review-status drift`);
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

    if (prototypeId === "NUM-CP012-PROT-009") {
      if (q.representation === "ZERO_EXACT_POWER") zeroRootStates += 1;
      if (q.representation === "ONE_EXACT_POWER") oneRootStates += 1;
      if (q.representation === "NEGATIVE_ODD_EXACT_POWER") negativeOddRootStates += 1;
      if (q.representation === "NEGATIVE_EVEN_NO_INTEGER_ROOT") negativeEvenNoRootStates += 1;
    }
    if (prototypeId === "NUM-CP012-PROT-010" && q.hiddenState.exactBoundary === true) exactBoundStates += 1;
    if (prototypeId === "NUM-CP012-PROT-011") {
      if (q.representation === "NEAREST_LOWER_POWER") nearestLowerStates += 1;
      if (q.representation === "NEAREST_UPPER_POWER") nearestUpperStates += 1;
      if (String(q.hiddenState.lowerDistance) === String(q.hiddenState.upperDistance)) nearestTieStates += 1;
    }
    if (
      prototypeId === "NUM-CP012-PROT-012"
      && String(q.hiddenState.multiplier) === "1"
      && String(q.hiddenState.value) === q.canonicalAnswer
    ) alreadyPerfectMultipleStates += 1;

    packages += 1;
  }
}

assert.equal(packages, NUM_CP012_WAVE02_PROTOTYPE_IDS.length * 80);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

for (const prototypeId of NUM_CP012_WAVE02_PROTOTYPE_IDS) {
  assert.ok(fingerprints.get(prototypeId)!.size >= 20, `${prototypeId}: mathematical state pool too thin`);
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3], `${prototypeId}: all answer positions not reached`);
}

assert.ok(zeroRootStates > 0, "Wave02 did not reach zero exact-power state");
assert.ok(oneRootStates > 0, "Wave02 did not reach one exact-power state");
assert.ok(negativeOddRootStates > 0, "Wave02 did not reach negative odd-power exact root");
assert.ok(negativeEvenNoRootStates > 0, "Wave02 did not reach negative even-power no-root state");
assert.ok(exactBoundStates > 0, "Wave02 bound projection did not reach exact-boundary state");
assert.deepEqual(
  [...representations.get("NUM-CP012-PROT-010")!].sort(),
  ["GREATEST_POWER_NOT_EXCEEDING_BOUND", "LEAST_POWER_NOT_BELOW_BOUND"],
  "Wave02 bound projection did not reach both directions",
);
assert.ok(nearestLowerStates > 0 && nearestUpperStates > 0, "Nearest-power discovery did not reach both lower and upper outcomes");
assert.equal(nearestTieStates, 0, "Nearest-power discovery produced an impossible integer tie");
assert.ok(alreadyPerfectMultipleStates > 0, "Least-perfect-power-multiple projection missed already-perfect state");
assert.deepEqual(
  [...representations.get("NUM-CP012-PROT-013")!].sort(),
  ["CUBE_LAST_TWO_DIGIT_REJECTION", "SQUARE_UNIT_DIGIT_REJECTION"],
  "Terminal compatibility did not reach both square and cube evidence modes",
);
assert.deepEqual(
  [...new Set(Array.from({ length: 80 }, (_, index) => generateNumCp012Wave02("NUM-CP012-PROT-014", index + 1).canonicalAnswer))].sort(),
  ["MULTIPLE_SOLUTIONS", "NO_SOLUTION", "ONE_SOLUTION"],
  "Inverse exponent topology did not reach none/one/multiple classes",
);

// Formal tie-impossibility check for ordinary integer-domain consecutive powers.
for (let k = 2; k <= 5; k += 1) {
  for (let root = 0n; root <= 100n; root += 1n) {
    const gap = (root + 1n) ** BigInt(k) - root ** BigInt(k);
    assert.equal(gap % 2n, 1n, `Consecutive ${k}th powers unexpectedly had even gap at root ${root}`);
  }
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_WAVE02_EDGE_INVERSE_DISCOVERY",
  prototypes: NUM_CP012_WAVE02_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  zeroRootStates,
  oneRootStates,
  negativeOddRootStates,
  negativeEvenNoRootStates,
  exactBoundStates,
  nearestLowerStates,
  nearestUpperStates,
  nearestTieStates,
  alreadyPerfectMultipleStates,
  permanentQlAllocations: 0,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  answerPositions: Object.fromEntries([...answerPositions].map(([id, values]) => [id, [...values].sort()])),
  representations: Object.fromEntries([...representations].map(([id, values]) => [id, [...values].sort()])),
  answerSemantics: Object.fromEntries([...answerSemantics].map(([id, values]) => [id, [...values].sort()])),
}, null, 2));
