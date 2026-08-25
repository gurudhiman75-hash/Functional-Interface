import assert from "node:assert/strict";

import { NUM_CP011_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp011Permanent } from "./permanent-runtime.ts";

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
const answerPositions = new Map<string, Set<number>>();
const reachedPrototypes = new Set<string>();

for (const allocation of NUM_CP011_PERMANENT_ALLOCATION) {
  fingerprints.set(allocation.qlId, new Set());
  answerPositions.set(allocation.qlId, new Set());

  for (let seed = 1; seed <= 180; seed += 1) {
    const q = generateNumCp011Permanent(allocation.qlId, seed);
    const replay = generateNumCp011Permanent(allocation.qlId, seed);
    const label = `${allocation.qlId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-011", `${label}: checkpoint drift`);
    assert.equal(q.permanentQlId, allocation.qlId, `${label}: permanent QL drift`);
    assert.equal(q.authorityId, allocation.authorityId, `${label}: authority drift`);
    assert.equal(q.authorityLabel, allocation.label, `${label}: authority label drift`);
    assert.equal(q.temporaryPrototypeId, allocation.sourcePrototypes[0], `${label}: source prototype drift`);
    assert.equal(q.sourceSeed, seed, `${label}: one-to-one source seed drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: canonical/verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer mismatch`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate option values`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected exactly one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index binding drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option value drift`);
    for (const option of q.options) {
      assert.ok(option.misconceptionId.length > 0, `${label}: option missing misconception identity`);
    }
    answerPositions.get(allocation.qlId)!.add(q.correctIndex);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    const words = wordCount(explanationText);
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(words >= 28, `${label}: explanation too thin (${words} words)`);
    assert.ok(words <= 190, `${label}: explanation too long (${words} words)`);
    assert.doesNotMatch(
      `${q.stem} ${explanationText}`,
      /prototype|generator|hidden state|fingerprint|authority package|source ancestry/iu,
      `${label}: implementation vocabulary leak`,
    );
    explanationChecks += 1;

    assert.equal(q.lifecycle.permanentQlId, allocation.qlId, `${label}: lifecycle QL drift`);
    assert.equal(q.lifecycle.maturity, "PERMANENT_AUTHORITY", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "ENGLISH_FROZEN", `${label}: English freeze drift`);
    assert.equal(q.lifecycle.questionBankStatus, "NOT_STORED", `${label}: Question Bank status drift`);
    assert.equal(q.lifecycle.testEligibility, "INELIGIBLE", `${label}: test eligibility status drift`);
    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    lifecycleChecks += 1;

    fingerprints.get(allocation.qlId)!.add(q.mathematicalFingerprint);
    reachedPrototypes.add(q.temporaryPrototypeId);
    packages += 1;
  }
}

assert.equal(packages, 13 * 180, "Permanent package sweep size drift");
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);
assert.equal(reachedPrototypes.size, 13, "All 13 discovery prototypes must remain reachable");

for (const allocation of NUM_CP011_PERMANENT_ALLOCATION) {
  assert.ok(fingerprints.get(allocation.qlId)!.size >= 45, `${allocation.qlId}: mathematical state pool too thin`);
  assert.deepEqual([...answerPositions.get(allocation.qlId)!].sort(), [0, 1, 2, 3], `${allocation.qlId}: all answer positions not reached`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_PERMANENT_ENGLISH_RUNTIME",
  permanentAuthorities: NUM_CP011_PERMANENT_ALLOCATION.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  reachedPrototypes: reachedPrototypes.size,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([qlId, values]) => [qlId, values.size])),
  answerPositions: Object.fromEntries([...answerPositions].map(([qlId, values]) => [qlId, [...values].sort()])),
}, null, 2));
