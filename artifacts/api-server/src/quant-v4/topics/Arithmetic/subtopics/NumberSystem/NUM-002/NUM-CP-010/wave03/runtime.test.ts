import assert from "node:assert/strict";

import { generateNumCp010Wave03 } from "./runtime.ts";
import { NUM_CP010_WAVE03_PROTOTYPE_IDS } from "./types.ts";

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
const answerSemantics = new Set<string>();
const fingerprintReach = new Map<string, Set<string>>();

for (const prototypeId of NUM_CP010_WAVE03_PROTOTYPE_IDS) {
  fingerprintReach.set(prototypeId, new Set());
  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp010Wave03(prototypeId, seed);
    const replay = generateNumCp010Wave03(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-010", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer drift`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer-option binding drift`);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation steps outside 2..4`);
    assert.ok(words(explanationText) >= 26, `${label}: explanation too thin (${words(explanationText)} words)`);
    assert.ok(words(explanationText) <= 145, `${label}: explanation too long (${words(explanationText)} words)`);
    assert.doesNotMatch(`${q.stem} ${explanationText}`, /prototype|generator|fingerprint|hidden state|authority package/iu, `${label}: implementation vocabulary leak`);
    explanationChecks += 1;

    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated during discovery`);
    lifecycleChecks += 1;

    answerSemantics.add(q.answerSemantic);
    fingerprintReach.get(prototypeId)!.add(q.mathematicalFingerprint);
    packages += 1;
  }
}

assert.equal(packages, 8 * 120);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);
assert.ok(answerSemantics.has("SOLUTION_MULTIPLICITY_CLASS"));
assert.ok(answerSemantics.has("DECIMAL_INTEGER_SET"));
assert.ok(answerSemantics.has("ORDERED_DIGIT_PAIR"));
assert.ok(answerSemantics.has("DIGITAL_ROOT"));

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_WAVE03_SOLUTION_STRUCTURE",
  prototypes: NUM_CP010_WAVE03_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  answerSemantics: [...answerSemantics].sort(),
  permanentQlAllocations: 0,
  distinctFingerprints: Object.fromEntries([...fingerprintReach].map(([id, values]) => [id, values.size])),
}, null, 2));
