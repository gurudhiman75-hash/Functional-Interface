import assert from "node:assert/strict";

import {
  NUM_CP010_PERMANENT_ALLOCATION,
  NUM_CP010_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";
import { generateNumCp010Permanent } from "./permanent-runtime.ts";

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
const prototypeReach = new Set<string>();
const sourceReachByQl = new Map<string, Set<string>>();
const fingerprintReachByQl = new Map<string, Set<string>>();
let minExplanationWords = Number.POSITIVE_INFINITY;
let maxExplanationWords = 0;

for (const qlId of NUM_CP010_PERMANENT_QL_IDS) {
  const allocation = NUM_CP010_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId)!;
  sourceReachByQl.set(qlId, new Set());
  fingerprintReachByQl.set(qlId, new Set());

  for (let seed = 1; seed <= 180; seed += 1) {
    const q = generateNumCp010Permanent(qlId, seed);
    const replay = generateNumCp010Permanent(qlId, seed);
    const label = `${qlId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-010", `${label}: checkpoint drift`);
    assert.equal(q.permanentQlId, qlId, `${label}: QL drift`);
    assert.equal(q.authorityId, allocation.authorityId, `${label}: authority drift`);
    assert.equal(q.authorityLabel, allocation.label, `${label}: authority label drift`);
    assert.ok(allocation.sourcePrototypes.includes(q.temporaryPrototypeId), `${label}: source prototype outside approved ancestry`);
    assert.ok(q.sourceSeed >= 1, `${label}: invalid source seed`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: independent verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer drift`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate option values`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected exactly one correct option`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: answer-option binding drift`);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    const explanationWords = words(explanationText);
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation needs 2..4 worked steps`);
    assert.ok(explanationWords >= 24, `${label}: explanation too thin (${explanationWords} words)`);
    assert.ok(explanationWords <= 135, `${label}: explanation too long (${explanationWords} words)`);
    assert.ok(words(q.stem) <= 65, `${label}: stem too long`);
    assert.doesNotMatch(
      `${q.stem} ${explanationText}`,
      /prototype|generator|hidden state|fingerprint|source ancestry|authority package|answer semantic|lifecycle gate/iu,
      `${label}: implementation/governance vocabulary leak`,
    );
    minExplanationWords = Math.min(minExplanationWords, explanationWords);
    maxExplanationWords = Math.max(maxExplanationWords, explanationWords);
    explanationChecks += 1;

    assert.equal(q.lifecycle.permanentQlId, qlId, `${label}: lifecycle QL drift`);
    assert.equal(q.lifecycle.maturity, "PERMANENT_AUTHORITY", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "ENGLISH_FROZEN", `${label}: English freeze drift`);
    assert.equal(q.lifecycle.questionBankStatus, "NOT_STORED", `${label}: Question Bank status drift`);
    assert.equal(q.lifecycle.testEligibility, "INELIGIBLE", `${label}: test eligibility drift`);
    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    lifecycleChecks += 1;

    prototypeReach.add(q.temporaryPrototypeId);
    sourceReachByQl.get(qlId)!.add(q.temporaryPrototypeId);
    fingerprintReachByQl.get(qlId)!.add(q.mathematicalFingerprint);
    packages += 1;
  }

  assert.deepEqual(
    [...sourceReachByQl.get(qlId)!].sort(),
    [...allocation.sourcePrototypes].sort(),
    `${qlId}: not all approved source prototypes were reached`,
  );
  // Some legitimate CP010 families (for example consecutive digits) have a deliberately
  // small finite state space. Require meaningful variation without inventing states.
  assert.ok(fingerprintReachByQl.get(qlId)!.size >= 10, `${qlId}: insufficient mathematical state diversity`);
}

assert.equal(packages, 16 * 180, "Expected 2,880 permanent English packages");
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);
assert.equal(prototypeReach.size, 26, "Expected permanent runtime to reach all 26 approved discovery prototypes");

console.log(JSON.stringify({
  status: "PASS_NUM_CP010_PERMANENT_ENGLISH_RUNTIME",
  permanentAuthorities: NUM_CP010_PERMANENT_QL_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  prototypeReach: prototypeReach.size,
  minExplanationWords,
  maxExplanationWords,
  minFingerprintReach: Math.min(...[...fingerprintReachByQl.values()].map((values) => values.size)),
  maxFingerprintReach: Math.max(...[...fingerprintReachByQl.values()].map((values) => values.size)),
  downstreamActivations: 0,
}, null, 2));
