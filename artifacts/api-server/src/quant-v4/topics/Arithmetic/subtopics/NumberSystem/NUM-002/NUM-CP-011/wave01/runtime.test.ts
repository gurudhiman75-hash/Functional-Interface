import assert from "node:assert/strict";

import { generateNumCp011Wave01Human } from "./runtime-human.ts";
import { NUM_CP011_WAVE01_PROTOTYPE_IDS } from "./types.ts";

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
const stemFamilyReach = new Map<string, Set<string>>();
let minExplanationWords = Number.POSITIVE_INFINITY;
let maxExplanationWords = 0;

for (const prototypeId of NUM_CP011_WAVE01_PROTOTYPE_IDS) {
  fingerprintReach.set(prototypeId, new Set());
  difficultyReach.set(prototypeId, new Set());
  stemFamilyReach.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp011Wave01Human(prototypeId, seed);
    const replay = generateNumCp011Wave01Human(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-011", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: independent verifier mismatch`);
    assert.match(q.explanation.finalAnswer, new RegExp(`(^|\\D)${q.canonicalAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\D|$)`, "u"), `${label}: final answer sentence does not contain canonical answer`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct index not marked correct`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option value drift`);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps, q.explanation.finalAnswer].join(" ");
    const explanationWords = words(explanationText);
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(explanationWords >= 28, `${label}: explanation too thin (${explanationWords} words)`);
    assert.ok(explanationWords <= 150, `${label}: explanation too long (${explanationWords} words)`);
    assert.ok(words(q.stem) <= 45, `${label}: stem too long`);
    assert.doesNotMatch(`${q.stem} ${explanationText}`, /prototype|generator|hidden state|fingerprint|source ancestry|lifecycle/iu, `${label}: implementation vocabulary leak`);
    assert.doesNotMatch(explanationText, /\. trailing zeroes/iu, `${label}: broken trailing-zero sentence`);
    assert.doesNotMatch(explanationText, /undefined|NaN/iu, `${label}: invalid learner text`);
    minExplanationWords = Math.min(minExplanationWords, explanationWords);
    maxExplanationWords = Math.max(maxExplanationWords, explanationWords);
    explanationChecks += 1;

    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated during discovery`);
    lifecycleChecks += 1;

    fingerprintReach.get(prototypeId)!.add(q.mathematicalFingerprint);
    difficultyReach.get(prototypeId)!.add(q.difficulty);
    stemFamilyReach.get(prototypeId)!.add(q.stemFamily);
    packages += 1;
  }

  assert.ok(fingerprintReach.get(prototypeId)!.size >= 30, `${prototypeId}: insufficient mathematical diversity`);
  assert.ok(stemFamilyReach.get(prototypeId)!.size >= 3, `${prototypeId}: expected all three stem families`);
}

assert.equal(packages, NUM_CP011_WAVE01_PROTOTYPE_IDS.length * 120);
assert.equal(packages, 960);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE01_FACTORIAL_VALUATION_DISCOVERY",
  prototypes: NUM_CP011_WAVE01_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  minExplanationWords,
  maxExplanationWords,
  permanentQlAllocations: 0,
  fingerprintReach: Object.fromEntries([...fingerprintReach].map(([id, values]) => [id, values.size])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([id, values]) => [id, [...values].sort()])),
  stemFamilyReach: Object.fromEntries([...stemFamilyReach].map(([id, values]) => [id, [...values].sort()])),
}, null, 2));
