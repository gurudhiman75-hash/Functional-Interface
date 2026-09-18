import assert from "node:assert/strict";

import { generateNumCp011Wave04 } from "./runtime.ts";
import { NUM_CP011_WAVE04_PROTOTYPE_IDS } from "./types.ts";

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
const semanticAnswers = new Map<string, Set<string>>();

for (const prototypeId of NUM_CP011_WAVE04_PROTOTYPE_IDS) {
  fingerprints.set(prototypeId, new Set());
  answerPositions.set(prototypeId, new Set());
  representations.set(prototypeId, new Set());
  semanticAnswers.set(prototypeId, new Set());

  for (let seed = 1; seed <= 200; seed += 1) {
    const q = generateNumCp011Wave04(prototypeId, seed);
    const replay = generateNumCp011Wave04(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-011", `${label}: checkpoint drift`);
    assert.equal(q.temporaryPrototypeId, prototypeId, `${label}: prototype drift`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: independent verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer mismatch`);
    verifierChecks += 1;

    const expectedOptionCount = prototypeId === "NUM-CP011-PROT-014" ? 4 : 5;
    assert.equal(q.options.length, expectedOptionCount, `${label}: option count drift`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, expectedOptionCount, `${label}: duplicate options`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected exactly one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct index binding drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option answer drift`);
    for (const option of q.options) {
      assert.ok(option.misconceptionId.length > 0, `${label}: option missing semantic identity`);
    }
    optionChecks += 1;

    assert.equal(q.statements.length, 2, `${label}: expected exactly two learner statements`);
    const learnerText = [q.stem, ...q.statements, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation step count outside 2..4`);
    assert.ok(wordCount(learnerText) >= 45, `${label}: learner explanation too thin (${wordCount(learnerText)} words)`);
    assert.ok(wordCount(learnerText) <= 220, `${label}: learner explanation too long (${wordCount(learnerText)} words)`);
    assert.doesNotMatch(
      learnerText,
      /prototype|generator|hidden state|fingerprint|authority package|source ancestry/iu,
      `${label}: implementation vocabulary leak`,
    );
    explanationChecks += 1;

    assert.equal(q.lifecycle.maturity, "DISCOVERY_PROTOTYPE", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "WAVE04_REVIEW_REQUIRED", `${label}: review status drift`);
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
    semanticAnswers.get(prototypeId)!.add(q.canonicalAnswer);
    packages += 1;
  }
}

assert.equal(packages, NUM_CP011_WAVE04_PROTOTYPE_IDS.length * 200);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

for (const prototypeId of NUM_CP011_WAVE04_PROTOTYPE_IDS) {
  assert.ok(fingerprints.get(prototypeId)!.size >= 60, `${prototypeId}: mathematical state pool too thin`);
}

assert.deepEqual(
  [...answerPositions.get("NUM-CP011-PROT-014")!].sort(),
  [0, 1, 2, 3],
  "Statement/claim representation did not reach all four answer positions",
);
assert.deepEqual(
  [...answerPositions.get("NUM-CP011-PROT-015")!].sort(),
  [0, 1, 2, 3, 4],
  "Data-sufficiency representation did not reach all five answer positions",
);
assert.equal(semanticAnswers.get("NUM-CP011-PROT-014")!.size, 4,
  "Statement/claim representation did not reach all four truth patterns");
assert.equal(semanticAnswers.get("NUM-CP011-PROT-015")!.size, 5,
  "Data-sufficiency representation did not reach all five standard sufficiency outcomes");
assert.deepEqual(
  [...representations.get("NUM-CP011-PROT-015")!].sort(),
  ["BASE10_ZERO_THRESHOLD_DS", "PRIME_VALUATION_THRESHOLD_DS"],
  "Data-sufficiency authority did not reach both decimal-zero and prime-valuation representations",
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP011_WAVE04_STATEMENT_DS",
  prototypes: NUM_CP011_WAVE04_PROTOTYPE_IDS.length,
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
  semanticAnswerCounts: Object.fromEntries([...semanticAnswers].map(([id, values]) => [id, values.size])),
}, null, 2));
