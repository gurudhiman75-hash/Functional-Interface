import assert from "node:assert/strict";

import { generateNumCp011Wave03 } from "./runtime.ts";
import { NUM_CP011_WAVE03_PROTOTYPE_IDS } from "./types.ts";

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
const representations = new Map<string, Set<string>>();

for (const prototypeId of NUM_CP011_WAVE03_PROTOTYPE_IDS) {
  fingerprints.set(prototypeId, new Set());
  answerPositions.set(prototypeId, new Set());
  representations.set(prototypeId, new Set());

  for (let seed = 1; seed <= 160; seed += 1) {
    const q = generateNumCp011Wave03(prototypeId, seed);
    const replay = generateNumCp011Wave03(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-011", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer mismatch`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected exactly one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct index binding drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option value drift`);
    for (const option of q.options) {
      assert.ok(option.misconceptionId.length > 0, `${label}: option missing misconception identity`);
    }
    answerPositions.get(prototypeId)!.add(q.correctIndex);
    optionChecks += 1;

    const explanationText = [q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(wordCount(explanationText) >= 28, `${label}: explanation too thin (${wordCount(explanationText)} words)`);
    assert.ok(wordCount(explanationText) <= 180, `${label}: explanation too long (${wordCount(explanationText)} words)`);
    assert.doesNotMatch(
      `${q.stem} ${explanationText}`,
      /prototype|generator|hidden state|fingerprint|authority package|source ancestry/iu,
      `${label}: implementation vocabulary leak`,
    );
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "WAVE03_REVIEW_REQUIRED", `${label}: review status drift`);
    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.ok(!("permanentQlId" in q), `${label}: permanent QL allocated during discovery`);
    lifecycleChecks += 1;

    fingerprints.get(prototypeId)!.add(q.mathematicalFingerprint);
    representations.get(prototypeId)!.add(q.representation);
    packages += 1;
  }
}

assert.equal(packages, NUM_CP011_WAVE03_PROTOTYPE_IDS.length * 160);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

for (const prototypeId of NUM_CP011_WAVE03_PROTOTYPE_IDS) {
  assert.ok(fingerprints.get(prototypeId)!.size >= 50, `${prototypeId}: mathematical state pool too thin`);
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3], `${prototypeId}: all answer positions not reached`);
}

assert.deepEqual(
  [...representations.get("NUM-CP011-PROT-012")!].sort(),
  ["BASE10_FACTORIAL_RATIO", "GENERAL_BASE_FACTORIAL_RATIO"],
  "Factorial-ratio zero authority did not reach both decimal and general-base representations",
);
assert.deepEqual(
  [...representations.get("NUM-CP011-PROT-013")!].sort(),
  ["BASE10_STRUCTURED_PRODUCT", "GENERAL_BASE_STRUCTURED_PRODUCT"],
  "Structured-product zero authority did not reach both decimal and general-base representations",
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE03_COMPOUND_ZERO_RUNTIME",
  prototypes: NUM_CP011_WAVE03_PROTOTYPE_IDS.length,
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
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([id, values]) => [id, values.size])),
  answerPositions: Object.fromEntries([...answerPositions].map(([id, values]) => [id, [...values].sort()])),
  representations: Object.fromEntries([...representations].map(([id, values]) => [id, [...values].sort()])),
}, null, 2));
