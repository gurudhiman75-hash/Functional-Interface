import assert from "node:assert/strict";

import { generateNumCp010Wave01 } from "./runtime.ts";
import { NUM_CP010_WAVE01_PROTOTYPE_IDS } from "./types.ts";

function wordCount(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
const fingerprints = new Map<string, Set<string>>();
const difficultyReach = new Map<string, Set<string>>();

for (const prototypeId of NUM_CP010_WAVE01_PROTOTYPE_IDS) {
  fingerprints.set(prototypeId, new Set());
  difficultyReach.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp010Wave01(prototypeId, seed);
    const replay = generateNumCp010Wave01(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-010", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: independent verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer mismatch`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct index does not point to correct option`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: option answer binding drift`);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(wordCount(explanationText) >= 24, `${label}: explanation too thin (${wordCount(explanationText)} words)`);
    assert.ok(wordCount(explanationText) <= 125, `${label}: explanation too long (${wordCount(explanationText)} words)`);
    assert.doesNotMatch(`${q.stem} ${explanationText}`, /prototype|generator|hidden state|fingerprint|authority package/iu, `${label}: implementation vocabulary leak`);
    explanationChecks += 1;

    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    lifecycleChecks += 1;

    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated during discovery`);
    fingerprints.get(prototypeId)!.add(q.mathematicalFingerprint);
    difficultyReach.get(prototypeId)!.add(q.difficulty);
    packages += 1;
  }
}

assert.equal(packages, 8 * 120);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_WAVE01_DISCOVERY",
  prototypes: NUM_CP010_WAVE01_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  permanentQlAllocations: 0,
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([id, values]) => [id, [...values].sort()])),
}, null, 2));
