import assert from "node:assert/strict";

import { NUM_CP012_PERMANENT_ALLOCATION, NUM_CP012_PERMANENT_QL_IDS } from "./permanent-allocation.ts";
import { generateNumCp012Permanent } from "./permanent-runtime.ts";

function words(value: string) {
  return value.trim().split(/\s+/u).filter(Boolean).length;
}

let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;
const answerPositions = new Map<string, Set<number>>();
const fingerprints = new Map<string, Set<string>>();
const sourcePrototypeCoverage = new Map<string, Set<string>>();

for (const qlId of NUM_CP012_PERMANENT_QL_IDS) {
  answerPositions.set(qlId, new Set());
  fingerprints.set(qlId, new Set());
  sourcePrototypeCoverage.set(qlId, new Set());

  const allocation = NUM_CP012_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId)!;

  for (let seed = 1; seed <= 80; seed += 1) {
    const q = generateNumCp012Permanent(qlId, seed);
    const replay = generateNumCp012Permanent(qlId, seed);
    const label = `${qlId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-012", `${label}: checkpoint drift`);
    assert.equal(q.permanentQlId, qlId, `${label}: permanent QL drift`);
    assert.equal(q.authorityId, allocation.authorityId, `${label}: authority drift`);
    assert.equal(q.authorityLabel, allocation.label, `${label}: authority label drift`);
    assert.equal(q.answerSemantic, allocation.authorityAnswerSemantic, `${label}: authority answer semantic drift`);
    assert.ok(allocation.sourcePrototypes.includes(q.temporaryPrototypeId as never), `${label}: source prototype not allowed by allocation`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: canonical/verifier mismatch after permanent normalization`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer mismatch`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate option values`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index binding drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option does not equal canonical answer`);
    for (const option of q.options) assert.ok(option.misconceptionId.length > 0, `${label}: missing misconception identity`);
    optionChecks += 1;

    const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(words(learnerText) >= 28, `${label}: English learner text too thin (${words(learnerText)} words)`);
    assert.ok(words(learnerText) <= 210, `${label}: English learner text too long (${words(learnerText)} words)`);
    assert.doesNotMatch(
      learnerText,
      /prototype|generator|hidden state|fingerprint|authority package|source ancestry|lifecycle gate/iu,
      `${label}: implementation vocabulary leak`,
    );
    assert.ok(q.explanation.steps.length >= 2 && q.explanation.steps.length <= 4, `${label}: explanation steps outside 2..4`);
    explanationChecks += 1;

    assert.equal(q.lifecycle.permanentQlId, qlId, `${label}: lifecycle QL drift`);
    assert.equal(q.lifecycle.maturity, "PERMANENT_AUTHORITY", `${label}: maturity drift`);
    assert.equal(q.lifecycle.reviewStatus, "ENGLISH_FROZEN", `${label}: English freeze drift`);
    assert.equal(q.lifecycle.questionBankStatus, "NOT_STORED", `${label}: Question Bank state drift`);
    assert.equal(q.lifecycle.testEligibility, "INELIGIBLE", `${label}: eligibility drift`);
    assert.equal(q.lifecycle.active, false, `${label}: active gate opened`);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false, `${label}: Question Studio gate opened`);
    assert.equal(q.lifecycle.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(q.lifecycle.testEligible, false, `${label}: test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    lifecycleChecks += 1;

    answerPositions.get(qlId)!.add(q.correctIndex);
    fingerprints.get(qlId)!.add(q.mathematicalFingerprint);
    sourcePrototypeCoverage.get(qlId)!.add(q.temporaryPrototypeId);
    packages += 1;
  }
}

assert.equal(packages, 11 * 80);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

for (const allocation of NUM_CP012_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId;
  assert.deepEqual([...answerPositions.get(qlId)!].sort(), [0, 1, 2, 3], `${qlId}: all answer positions not reached`);
  assert.ok(fingerprints.get(qlId)!.size >= 18, `${qlId}: mathematical state pool too thin`);
  assert.deepEqual(
    [...sourcePrototypeCoverage.get(qlId)!].sort(),
    [...allocation.sourcePrototypes].sort(),
    `${qlId}: merged authority did not reach every source prototype`,
  );
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_PERMANENT_ENGLISH_RUNTIME",
  authorities: NUM_CP012_PERMANENT_QL_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  permanentRange: `${NUM_CP012_PERMANENT_QL_IDS[0]}..${NUM_CP012_PERMANENT_QL_IDS.at(-1)}`,
  nextAvailableQl: "NUM-QL-237",
  answerPositions: Object.fromEntries([...answerPositions].map(([id, values]) => [id, [...values].sort()])),
  sourcePrototypeCoverage: Object.fromEntries([...sourcePrototypeCoverage].map(([id, values]) => [id, [...values].sort()])),
}, null, 2));
