import assert from "node:assert/strict";
import {
  INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES,
  INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY,
  buildIntCp010SequentialReopenPackageV2,
  solveIntCp010SequentialReopen,
  verifyIntCp010SequentialReopen,
} from "./cp010-sequential-mixed-source-reopen-v2";

function stable(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

const SAMPLES_PER_PROTOTYPE = 250;
let packages = 0;
let deterministicChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let sourceBoundaryChecks = 0;
let packagingRemediationChecks = 0;
let remediatedSeedCount = 0;
const answerPositions = [0, 0, 0, 0];
const stems = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
const inverseOrders = new Set<string>();
const spreadFrequencies = new Set<number>();

assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.sourceBackedReopen, true);
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.permanentQlAllocationAuthorized, false);
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.currentPermanentQlCount, 130);
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.currentNextFreeQl, "INT-QL-132");
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.currentNextFreeQlReserved, false);
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.sourceDirections.length, 4);
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.historicalHoldCorrection.oldHoldWasValidAgainstLegacyCodeAuthority, true);
assert.equal(INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY.historicalHoldCorrection.oldHoldIsNotEvidenceThatTheExamSemanticDoesNotExist, true);

for (const prototypeId of INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES) {
  stems.set(prototypeId, new Set());
  fingerprints.set(prototypeId, new Set());
  for (let index = 0; index < SAMPLES_PER_PROTOTYPE; index += 1) {
    const seed = `int-gap-wave01:${prototypeId}:${index}`;
    const first = buildIntCp010SequentialReopenPackageV2(prototypeId, seed);
    const replay = buildIntCp010SequentialReopenPackageV2(prototypeId, seed);
    packages += 1;

    assert.equal(stable(first), stable(replay), `${prototypeId}/${index}: deterministic replay drift`);
    assert.equal(first.requestedSeed, seed, `${prototypeId}/${index}: requested-seed trace drift`);
    assert.equal(first.effectiveSeed, replay.effectiveSeed, `${prototypeId}/${index}: effective-seed replay drift`);
    assert.ok(first.seedResolutionAttempts >= 1 && first.seedResolutionAttempts <= 32, `${prototypeId}/${index}: invalid seed-resolution attempt count`);
    assert.ok(first.packagingRemediationVersion.includes("v2"), `${prototypeId}/${index}: packaging remediation version missing`);
    deterministicChecks += 3;
    packagingRemediationChecks += 2;
    if (first.effectiveSeed !== first.requestedSeed) remediatedSeedCount += 1;

    const canonical = solveIntCp010SequentialReopen(first.state);
    assert.equal(stable(canonical), stable(first.answer), `${prototypeId}/${index}: solver/package answer drift`);
    assert.equal(verifyIntCp010SequentialReopen(first.state, canonical), true, `${prototypeId}/${index}: independent verifier rejected answer`);
    verifierChecks += 2;

    assert.equal(first.options.length, 4, `${prototypeId}/${index}: expected four options`);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1, `${prototypeId}/${index}: expected exactly one correct option`);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true, `${prototypeId}/${index}: correct-index ownership drift`);
    assert.equal(new Set(first.options.map((option) => stable(option.value))).size, 4, `${prototypeId}/${index}: duplicate option values`);
    assert.ok(first.options.filter((option) => !option.isCorrect).every((option) => option.misconceptionId !== "CORRECT"), `${prototypeId}/${index}: distractor without misconception ownership`);
    optionChecks += 7;
    answerPositions[first.correctIndex] += 1;

    assert.equal(first.lifecycle.discoveryOnly, true);
    assert.equal(first.lifecycle.permanentQlAllocated, false);
    assert.equal(first.lifecycle.nextFreeQlReserved, false);
    assert.equal(first.lifecycle.questionStudioDiscoverable, false);
    assert.equal(first.lifecycle.questionBankWritable, false);
    assert.equal(first.lifecycle.testEligible, false);
    assert.equal(first.lifecycle.mockTestEligible, false);
    assert.equal(first.lifecycle.publiclyPublishable, false);
    lifecycleChecks += 8;

    assert.ok(first.presentation.prompt.length > 80, `${prototypeId}/${index}: stem too thin`);
    assert.ok(!/prototype|ql-|authority|source hold/i.test(first.presentation.prompt), `${prototypeId}/${index}: internal terminology leaked into learner stem`);
    assert.equal(first.explanation.steps.length, 4, `${prototypeId}/${index}: explanation should carry four worked steps`);
    assert.ok(first.explanation.steps.every((step) => step.length > 10), `${prototypeId}/${index}: explanation step too thin`);
    assert.ok(first.explanation.finalAnswer.length > 0, `${prototypeId}/${index}: missing final answer`);

    stems.get(prototypeId)!.add(first.presentation.stemFamilyId);
    fingerprints.get(prototypeId)!.add(first.mathematicalFingerprint);
    sourceBoundaryChecks += 6;

    if (prototypeId === "INT-CP010-REOPEN-PROT-003") inverseOrders.add(first.state.stageOrder);
    if (prototypeId === "INT-CP010-REOPEN-PROT-004") spreadFrequencies.add(first.state.compoundPeriodsPerYear);
  }
}

for (const prototypeId of INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES) {
  assert.ok(stems.get(prototypeId)!.size >= 3, `${prototypeId}: all three authored stem families were not reached`);
  assert.ok(fingerprints.get(prototypeId)!.size >= 40, `${prototypeId}: mathematical state diversity is too thin`);
}
assert.deepEqual([...inverseOrders].sort(), ["CI_THEN_SI", "SI_THEN_CI"], "mixed-stage inverse did not reach both stage orders");
assert.deepEqual([...spreadFrequencies].sort(), [1, 2], "scheme-spread inverse did not reach annual and half-yearly compounding");
assert.ok(answerPositions.every((count) => count >= 200), `answer-position imbalance too large: ${answerPositions.join(" / ")}`);
assert.ok(remediatedSeedCount > 0, "V2 remediation path was never exercised; edge-case coverage is missing");

console.log("PASS_INT_001_COMPREHENSIVE_GAP_WAVE01_AUDIT");
console.log(JSON.stringify({
  prototypes: INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES.length,
  samplesPerPrototype: SAMPLES_PER_PROTOTYPE,
  packages,
  deterministicChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  sourceBoundaryChecks,
  packagingRemediationChecks,
  remediatedSeedCount,
  answerPositions,
  stemFamilies: Object.fromEntries([...stems].map(([key, value]) => [key, value.size])),
  uniqueStates: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
  inverseOrders: [...inverseOrders].sort(),
  spreadFrequencies: [...spreadFrequencies].sort(),
  permanentQlAllocationAuthorized: false,
  nextFreeQlReserved: false,
}, null, 2));
