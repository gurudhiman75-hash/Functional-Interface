import assert from "node:assert/strict";
import { generateNumCp001Wave01Package } from "../wave01/runtime";
import { generateNumCp001Wave02 } from "../wave02/runtime";
import { generateNumCp001Wave03 } from "../wave03/runtime";
import { generateNumCp001Wave04 } from "../wave04/runtime";

const SEEDS = 60;
let mergedSemanticChecks = 0;
let nonMergeChecks = 0;
let lifecycleChecks = 0;

function assertLocked(pkg: {
  permanentQlId: null;
  canonicalAnswer: string;
  verifierAnswer: string;
  lifecycle: {
    active: boolean;
    questionStudioDiscoverable: boolean;
    questionBankWritable: boolean;
    testEligible: boolean;
    publiclyPublishable: boolean;
  };
}) {
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  lifecycleChecks += 1;
}

for (let seed = 1; seed <= SEEDS; seed += 1) {
  const orderInteger = generateNumCp001Wave01Package("NUM-CP001-PROT-003", seed);
  const orderMixed = generateNumCp001Wave03("NUM-CP001-PROT-018", seed);
  assert.equal(orderInteger.answerSemantic, "ORDERED_LIST");
  assert.equal(orderMixed.answerSemantic, "ORDERED_LIST");
  mergedSemanticChecks += 2;

  const intervalInteger = generateNumCp001Wave01Package("NUM-CP001-PROT-005", seed);
  const intervalRational = generateNumCp001Wave02("NUM-CP001-PROT-011", seed);
  assert.equal(intervalInteger.answerSemantic, "COUNT");
  assert.equal(intervalRational.answerSemantic, "COUNT");
  mergedSemanticChecks += 2;

  const consecutiveShort = generateNumCp001Wave01Package("NUM-CP001-PROT-008", seed);
  const consecutiveParity = generateNumCp001Wave02("NUM-CP001-PROT-016", seed);
  const consecutiveLong = generateNumCp001Wave03("NUM-CP001-PROT-021", seed);
  assert.equal(consecutiveShort.answerSemantic, "NUMBER_TUPLE");
  assert.equal(consecutiveParity.answerSemantic, "NUMBER_TUPLE");
  assert.equal(consecutiveLong.answerSemantic, "NUMBER_TUPLE");
  mergedSemanticChecks += 3;

  const inverseParity = generateNumCp001Wave02("NUM-CP001-PROT-015", seed);
  const parityCondition = generateNumCp001Wave03("NUM-CP001-PROT-020", seed);
  assert.equal(inverseParity.answerSemantic, "PARITY_CLASS");
  assert.equal(parityCondition.answerSemantic, "PARITY_CLASS");
  mergedSemanticChecks += 2;

  [
    orderInteger,
    orderMixed,
    intervalInteger,
    intervalRational,
    consecutiveShort,
    consecutiveParity,
    consecutiveLong,
    inverseParity,
    parityCondition,
  ].forEach(assertLocked);

  const directDistance = generateNumCp001Wave01Package("NUM-CP001-PROT-004", seed);
  const inverseDistance = generateNumCp001Wave02("NUM-CP001-PROT-014", seed);
  assert.equal(directDistance.answerSemantic, "DISTANCE");
  assert.equal(inverseDistance.answerSemantic, "NUMBER_TUPLE");
  assert.notEqual(directDistance.answerSemantic, inverseDistance.answerSemantic);
  nonMergeChecks += 1;

  const intervalCount = generateNumCp001Wave01Package("NUM-CP001-PROT-005", seed);
  const endpointInverse = generateNumCp001Wave02("NUM-CP001-PROT-012", seed);
  assert.equal(intervalCount.answerSemantic, "COUNT");
  assert.equal(endpointInverse.answerSemantic, "VALUE");
  assert.notEqual(intervalCount.answerSemantic, endpointInverse.answerSemantic);
  nonMergeChecks += 1;

  const rawCount = generateNumCp001Wave02("NUM-CP001-PROT-011", seed);
  const topology = generateNumCp001Wave03("NUM-CP001-PROT-019", seed);
  assert.equal(rawCount.answerSemantic, "COUNT");
  assert.equal(topology.answerSemantic, "CARDINALITY_CLASS");
  assert.notEqual(rawCount.answerSemantic, topology.answerSemantic);
  nonMergeChecks += 1;

  const fullBlock = generateNumCp001Wave03("NUM-CP001-PROT-021", seed);
  const targetMember = generateNumCp001Wave03("NUM-CP001-PROT-022", seed);
  assert.equal(fullBlock.answerSemantic, "NUMBER_TUPLE");
  assert.equal(targetMember.answerSemantic, "VALUE");
  assert.notEqual(fullBlock.answerSemantic, targetMember.answerSemantic);
  nonMergeChecks += 1;

  const statementCombination = generateNumCp001Wave03("NUM-CP001-PROT-024", seed);
  const dataSufficiency = generateNumCp001Wave04("NUM-CP001-PROT-025", seed);
  assert.equal(statementCombination.answerSemantic, "STATEMENT_COMBINATION");
  assert.equal(dataSufficiency.answerSemantic, "DATA_SUFFICIENCY_CLASS");
  assert.notEqual(statementCombination.answerSemantic, dataSufficiency.answerSemantic);
  nonMergeChecks += 1;

  [
    directDistance,
    inverseDistance,
    endpointInverse,
    topology,
    targetMember,
    statementCombination,
    dataSufficiency,
  ].forEach(assertLocked);
}

assert.equal(mergedSemanticChecks, SEEDS * 9);
assert.equal(nonMergeChecks, SEEDS * 5);
assert.equal(lifecycleChecks, SEEDS * 16);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE05_MERGE_COMPATIBILITY",
  seeds: SEEDS,
  mergedSemanticChecks,
  nonMergeChecks,
  lifecycleChecks,
  mergeGroupsProven: 4,
  permanentQlAllocationsObserved: 0,
}, null, 2));