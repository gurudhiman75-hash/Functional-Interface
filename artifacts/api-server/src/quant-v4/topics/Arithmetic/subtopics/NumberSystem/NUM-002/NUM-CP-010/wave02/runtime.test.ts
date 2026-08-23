import assert from "node:assert/strict";

import { generateNumCp010Wave02 } from "./runtime.ts";
import { NUM_CP010_WAVE02_PROTOTYPE_IDS } from "./types.ts";

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
const fingerprintReach = new Map<string, Set<string>>();
const difficultyReach = new Map<string, Set<string>>();

for (const prototypeId of NUM_CP010_WAVE02_PROTOTYPE_IDS) {
  fingerprintReach.set(prototypeId, new Set());
  difficultyReach.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp010Wave02(prototypeId, seed);
    const replay = generateNumCp010Wave02(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-010", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: independent verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer drift`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected exactly one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct index mismatch`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer-option binding drift`);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(words(explanationText) >= 26, `${label}: explanation too thin (${words(explanationText)} words)`);
    assert.ok(words(explanationText) <= 135, `${label}: explanation too long (${words(explanationText)} words)`);
    assert.doesNotMatch(`${q.stem} ${explanationText}`, /prototype|generator|fingerprint|hidden state|authority package/iu, `${label}: implementation vocabulary leaked`);
    explanationChecks += 1;

    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated during discovery`);
    lifecycleChecks += 1;

    fingerprintReach.get(prototypeId)!.add(q.mathematicalFingerprint);
    difficultyReach.get(prototypeId)!.add(q.difficulty);
    packages += 1;
  }
}

assert.equal(packages, 9 * 120);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_WAVE02_INVERSE_EDGE",
  prototypes: NUM_CP010_WAVE02_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  permanentQlAllocations: 0,
  distinctFingerprints: Object.fromEntries([...fingerprintReach].map(([id, values]) => [id, values.size])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([id, values]) => [id, [...values].sort()])),
}, null, 2));
