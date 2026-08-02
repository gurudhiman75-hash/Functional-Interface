import assert from "node:assert/strict";
import {
  generateNumCp005Wave02ProvenPackage,
  generateNumCp005Wave02ProvenSweep,
} from "./runtime-proven";
import {
  NUM_CP005_WAVE02_PROTOTYPE_IDS,
} from "./types";
import type { NumCp005Difficulty } from "../wave01/types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateNumCp005Wave02ProvenSweep(SEEDS_PER_PROTOTYPE);

assert.equal(NUM_CP005_WAVE02_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const positions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp005Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const semantics = new Set<string>();
const leastTargets = new Map<number, string>();
let cubeStates = 0;
let generalPowerStates = 0;
let evenPairProductStates = 0;
let squareRootProductStates = 0;
let completeSetStates = 0;
let primePowerInverseStates = 0;

for (const pkg of packages) {
  const replay = generateNumCp005Wave02ProvenPackage(pkg.temporaryPrototypeId, pkg.seed);
  assert.deepEqual(replay, pkg, `${pkg.temporaryPrototypeId} seed ${pkg.seed} is not deterministic`);
  assert.equal(pkg.packageId, "NUM-001");
  assert.equal(pkg.checkpointId, "NUM-CP-005");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.locale, "en-IN");
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer,
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} verifier mismatch`);

  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4,
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} has duplicate options`);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect)
    .every((option) => Boolean(option.misconceptionId) && option.analysis.length > 0));

  assert.ok(pkg.stem.length >= 25);
  assert.ok(pkg.explanation.coreConcept.length > 0);
  assert.ok(pkg.explanation.givenDataAndStrategy.length > 0);
  assert.ok(pkg.explanation.stepByStep.length >= 2);
  assert.ok(pkg.explanation.examSpeedMethod.length > 0);
  assert.equal(pkg.explanation.commonTraps.length, 3);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));

  assert.equal(pkg.lifecycle.maturity, "EXECUTABLE_DISCOVERY_PROOF");
  assert.equal(pkg.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY_CANDIDATE");
  assert.equal(pkg.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(pkg.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  const prototypePositions = positions.get(pkg.temporaryPrototypeId) ?? new Set<number>();
  prototypePositions.add(pkg.correctIndex);
  positions.set(pkg.temporaryPrototypeId, prototypePositions);

  const prototypeBands = difficulties.get(pkg.temporaryPrototypeId) ?? new Set<NumCp005Difficulty>();
  prototypeBands.add(pkg.difficulty);
  difficulties.set(pkg.temporaryPrototypeId, prototypeBands);

  const prototypeFingerprints = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  prototypeFingerprints.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, prototypeFingerprints);

  semantics.add(pkg.answerSemantic);
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-010") cubeStates += 1;
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-011") generalPowerStates += 1;
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-013") {
    if (pkg.hiddenState.perfectSquareState === true) squareRootProductStates += 1;
    else evenPairProductStates += 1;
  }
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-014") {
    completeSetStates += 1;
    assert.match(pkg.canonicalAnswer, /^\{1,/u);
    assert.ok(pkg.canonicalAnswer.endsWith("}"));
  }
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-015") {
    primePowerInverseStates += 1;
    const prime = BigInt(String(pkg.hiddenState.prime));
    const exponent = BigInt(String(pkg.hiddenState.exponent));
    assert.equal(prime ** exponent, BigInt(pkg.canonicalAnswer));
  }
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-016") {
    leastTargets.set(Number(pkg.hiddenState.targetDivisorCount), pkg.canonicalAnswer);
  }
}

for (const prototypeId of NUM_CP005_WAVE02_PROTOTYPE_IDS) {
  assert.deepEqual([...positions.get(prototypeId)!].sort(), [0, 1, 2, 3],
    `${prototypeId} did not reach every answer position`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"],
    `${prototypeId} did not reach every difficulty`);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 10,
    `${prototypeId} collapsed below ten mathematical states`);
}

assert.deepEqual([...semantics].sort(), [
  "DIVISOR_COUNT",
  "DIVISOR_PRODUCT",
  "DIVISOR_SET",
  "DIVISOR_SUM",
  "INTEGER",
]);
assert.equal(cubeStates, 100);
assert.equal(generalPowerStates, 100);
assert.ok(evenPairProductStates > 0);
assert.ok(squareRootProductStates > 0);
assert.equal(completeSetStates, 100);
assert.equal(primePowerInverseStates, 100);
assert.ok(leastTargets.size >= 12);
assert.equal(leastTargets.get(4), "6");
assert.equal(leastTargets.get(6), "12");
assert.equal(leastTargets.get(8), "24");
assert.equal(leastTargets.get(12), "60");
assert.equal(leastTargets.get(24), "360");

assert.throws(
  () => generateNumCp005Wave02ProvenPackage("NUM-CP005-PROT-009", 0),
  /positive integer/,
);
assert.throws(() => generateNumCp005Wave02ProvenSweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE02_AUTHORITY",
  temporaryPrototypeCount: NUM_CP005_WAVE02_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  answerSemantics: [...semantics].sort(),
  productStateCoverage: { evenPairProductStates, squareRootProductStates },
  leastNumberTargets: Object.fromEntries([...leastTargets.entries()].sort(([a], [b]) => a - b)),
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
