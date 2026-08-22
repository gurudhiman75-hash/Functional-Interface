import assert from "node:assert/strict";

import { generateNumCp010Wave04 } from "./runtime.ts";
import { NUM_CP010_WAVE04_PROTOTYPE_IDS } from "./types.ts";

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
const fingerprints = new Set<string>();

for (const prototypeId of NUM_CP010_WAVE04_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp010Wave04(prototypeId, seed);
    const replay = generateNumCp010Wave04(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: replay drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: brute verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer drift`);

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected one correct option`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer-option binding drift`);

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(words(explanationText) >= 35, `${label}: explanation too thin (${words(explanationText)} words)`);
    assert.ok(words(explanationText) <= 130, `${label}: explanation too long (${words(explanationText)} words)`);
    assert.match(explanationText, /leading|before the first written digit|one-digit numbers/iu, `${label}: zero/leading-zero distinction missing`);

    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated during discovery`);

    fingerprints.add(q.mathematicalFingerprint);
    packages += 1;
  }
}

assert.equal(packages, 120);
assert.ok(fingerprints.size >= 9, `Expected broad zero-count state reach, got ${fingerprints.size}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_WAVE04_ZERO_OCCURRENCE",
  prototypes: 1,
  packages,
  bruteVerifierChecks: packages,
  optionChecks: packages,
  explanationChecks: packages,
  lifecycleChecks: packages,
  distinctFingerprints: fingerprints.size,
  permanentQlAllocations: 0,
}, null, 2));
