import assert from "node:assert/strict";

import { NUM_CP013_PERMANENT_ALLOCATION, NUM_CP013_PERMANENT_QL_IDS } from "./permanent-allocation.ts";
import { generateNumCp013Permanent } from "./permanent-runtime.ts";

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
const sourceSemanticCoverage = new Map<string, Set<string>>();
const sourceModeCoverage = new Map<string, Set<number>>();
const sourceSeedCoverage = new Map<string, Set<number>>();

for (const qlId of NUM_CP013_PERMANENT_QL_IDS) {
  answerPositions.set(qlId, new Set());
  fingerprints.set(qlId, new Set());
  sourcePrototypeCoverage.set(qlId, new Set());
  sourceSemanticCoverage.set(qlId, new Set());

  const allocation = NUM_CP013_PERMANENT_ALLOCATION.find((item) => item.qlId === qlId)!;

  for (let seed = 1; seed <= 80; seed += 1) {
    const q = generateNumCp013Permanent(qlId, seed);
    const replay = generateNumCp013Permanent(qlId, seed);
    const label = `${qlId}/${seed}`;

    assert.deepEqual(replay, q, `${label}: deterministic replay drift`);
    replayChecks += 1;

    assert.equal(q.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(q.checkpointId, "NUM-CP-013", `${label}: checkpoint drift`);
    assert.equal(q.permanentQlId, qlId, `${label}: permanent QL drift`);
    assert.equal(q.authorityId, allocation.authorityId, `${label}: authority drift`);
    assert.equal(q.authorityLabel, allocation.label, `${label}: authority label drift`);
    assert.equal(q.answerSemantic, allocation.authorityAnswerSemantic, `${label}: authority answer semantic drift`);
    assert.ok(allocation.sourcePrototypes.includes(q.temporaryPrototypeId as never), `${label}: source prototype not allowed by allocation`);
    assert.ok(Number.isSafeInteger(q.sourceSeed) && q.sourceSeed >= 1, `${label}: invalid decoupled source seed`);
    assert.ok(q.sourceAnswerSemantic.length > 0, `${label}: source semantic missing`);
    assert.equal(q.canonicalAnswer, q.verifierAnswer, `${label}: canonical/verifier mismatch`);
    assert.equal(q.explanation.finalAnswer, q.canonicalAnswer, `${label}: explanation answer mismatch`);
    verifierChecks += 1;

    assert.equal(q.options.length, 4, `${label}: expected four options`);
    assert.equal(new Set(q.options.map((option) => option.value)).size, 4, `${label}: duplicate option values`);
    assert.equal(q.options.filter((option) => option.isCorrect).length, 1, `${label}: expected one correct option`);
    assert.equal(q.options[q.correctIndex]?.isCorrect, true, `${label}: correct-index binding drift`);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer, `${label}: correct option does not equal canonical answer`);
    assert.equal(q.correctIndex, (seed - 1) % 4, `${label}: permanent answer-position rotation drift`);
    for (const option of q.options) assert.ok(option.misconceptionId.length > 0, `${label}: missing misconception identity`);
    optionChecks += 1;

    const learnerText = [q.stem, q.explanation.coreConcept, q.explanation.strategy, ...q.explanation.steps].join(" ");
    assert.ok(words(learnerText) >= 28, `${label}: English learner text too thin (${words(learnerText)} words)`);
    assert.ok(words(learnerText) <= 220, `${label}: English learner text too long (${words(learnerText)} words)`);
    assert.doesNotMatch(
      learnerText,
      /prototype|generator|hidden state|fingerprint|authority package|source ancestry|lifecycle gate|permanent ql/iu,
      `${label}: implementation vocabulary leak`,
    );
    assert.ok(q.explanation.coreConcept.length >= 20, `${label}: core concept too thin`);
    assert.ok(q.explanation.strategy.length >= 15, `${label}: strategy too thin`);
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
    assert.equal(q.lifecycle.mockTestEligible, false, `${label}: mock-test gate opened`);
    assert.equal(q.lifecycle.publiclyPublishable, false, `${label}: public gate opened`);
    assert.equal(q.lifecycle.automaticStudentPublication, false, `${label}: automatic publication gate opened`);
    lifecycleChecks += 1;

    answerPositions.get(qlId)!.add(q.correctIndex);
    fingerprints.get(qlId)!.add(q.mathematicalFingerprint);
    sourcePrototypeCoverage.get(qlId)!.add(q.temporaryPrototypeId);
    sourceSemanticCoverage.get(qlId)!.add(q.sourceAnswerSemantic);

    const sourceKey = `${qlId}/${q.temporaryPrototypeId}`;
    if (!sourceSeedCoverage.has(sourceKey)) sourceSeedCoverage.set(sourceKey, new Set());
    sourceSeedCoverage.get(sourceKey)!.add(q.sourceSeed);
    const rawMode = (q.hiddenState as Readonly<Record<string, unknown>>).mode;
    if (typeof rawMode === "number" && Number.isInteger(rawMode)) {
      if (!sourceModeCoverage.has(sourceKey)) sourceModeCoverage.set(sourceKey, new Set());
      sourceModeCoverage.get(sourceKey)!.add(rawMode);
    }
    packages += 1;
  }
}

assert.equal(packages, 11 * 80);
assert.equal(replayChecks, packages);
assert.equal(verifierChecks, packages);
assert.equal(optionChecks, packages);
assert.equal(explanationChecks, packages);
assert.equal(lifecycleChecks, packages);

for (const allocation of NUM_CP013_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId;
  assert.deepEqual([...answerPositions.get(qlId)!].sort(), [0, 1, 2, 3], `${qlId}: all answer positions not reached`);
  assert.ok(fingerprints.get(qlId)!.size >= 16, `${qlId}: mathematical state pool too thin`);
  assert.deepEqual(
    [...sourcePrototypeCoverage.get(qlId)!].sort(),
    [...allocation.sourcePrototypes].sort(),
    `${qlId}: merged authority did not reach every source prototype`,
  );
  assert.ok(sourceSemanticCoverage.get(qlId)!.size >= 1, `${qlId}: source semantic coverage missing`);
  for (const prototypeId of allocation.sourcePrototypes) {
    const sourceKey = `${qlId}/${prototypeId}`;
    assert.ok((sourceSeedCoverage.get(sourceKey)?.size ?? 0) >= 1, `${sourceKey}: no source seeds reached`);
  }
}

const requiredInternalModes = Object.freeze([
  { sourceKey: "NUM-QL-237/NUM-CP013-PROT-011", modes: [0, 1, 2, 3] },
  { sourceKey: "NUM-QL-238/NUM-CP013-PROT-009", modes: [0, 1, 2, 3] },
  { sourceKey: "NUM-QL-239/NUM-CP013-PROT-012", modes: [0, 1, 2] },
  { sourceKey: "NUM-QL-241/NUM-CP013-PROT-021", modes: [0, 1, 2] },
  { sourceKey: "NUM-QL-245/NUM-CP013-PROT-015", modes: [0, 1, 2] },
] as const);

for (const requirement of requiredInternalModes) {
  assert.deepEqual(
    [...(sourceModeCoverage.get(requirement.sourceKey) ?? new Set<number>())].sort((a, b) => a - b),
    [...requirement.modes],
    `${requirement.sourceKey}: prototype-internal mode reachability drift`,
  );
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_PERMANENT_ENGLISH_RUNTIME",
  authorities: NUM_CP013_PERMANENT_QL_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  explanationChecks,
  lifecycleChecks,
  permanentRange: `${NUM_CP013_PERMANENT_QL_IDS[0]}..${NUM_CP013_PERMANENT_QL_IDS.at(-1)}`,
  nextAvailableQl: "NUM-QL-248",
  sourceSeedSelectionDecoupled: true,
  answerPositions: Object.fromEntries([...answerPositions].map(([id, values]) => [id, [...values].sort()])),
  sourcePrototypeCoverage: Object.fromEntries([...sourcePrototypeCoverage].map(([id, values]) => [id, [...values].sort()])),
  sourceSemanticCoverage: Object.fromEntries([...sourceSemanticCoverage].map(([id, values]) => [id, [...values].sort()])),
  sourceModeCoverage: Object.fromEntries([...sourceModeCoverage].map(([id, values]) => [id, [...values].sort((a, b) => a - b)])),
}, null, 2));
