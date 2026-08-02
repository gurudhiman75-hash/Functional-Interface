import assert from "node:assert/strict";
import {
  generateNumCp005Wave03ProvenPackage,
  generateNumCp005Wave03ProvenSweep,
} from "./runtime-proven";
import { NUM_CP005_WAVE03_PROTOTYPE_IDS } from "./types";
import type { NumCp005Difficulty } from "../wave01/types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateNumCp005Wave03ProvenSweep(SEEDS_PER_PROTOTYPE);

assert.equal(NUM_CP005_WAVE03_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const positions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp005Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const semantics = new Set<string>();
const representations = new Set<string>();
const claimPolarities = new Set<string>();
const indexedPositionClasses = new Set<string>();
const pairBlankSides = new Set<string>();
const intervalClasses = new Set<string>();
const oddMinimumTargets = new Map<number, string>();
const evenMinimumTargets = new Map<number, string>();
let multiConditionStates = 0;
let greatestBoundStates = 0;
let pairTableStates = 0;

for (const pkg of packages) {
  const replay = generateNumCp005Wave03ProvenPackage(pkg.temporaryPrototypeId, pkg.seed);
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
  representations.add(pkg.representation);

  switch (pkg.temporaryPrototypeId) {
    case "NUM-CP005-PROT-017":
      multiConditionStates += 1;
      assert.ok(Number(pkg.hiddenState.divisibleByFirst) > Number(pkg.hiddenState.divisibleByBoth));
      break;
    case "NUM-CP005-PROT-018":
      greatestBoundStates += 1;
      assert.ok(BigInt(pkg.canonicalAnswer) <= BigInt(String(pkg.hiddenState.bound)));
      break;
    case "NUM-CP005-PROT-019":
      indexedPositionClasses.add(String(pkg.hiddenState.positionClass));
      break;
    case "NUM-CP005-PROT-020":
      claimPolarities.add(pkg.canonicalAnswer);
      assert.ok(["True", "False"].includes(pkg.canonicalAnswer));
      break;
    case "NUM-CP005-PROT-021":
      pairTableStates += 1;
      pairBlankSides.add(String(pkg.hiddenState.blankSide));
      assert.equal(
        BigInt(pkg.canonicalAnswer) * BigInt(String(pkg.hiddenState.visiblePartner)),
        BigInt(String(pkg.hiddenState.integerValue)),
      );
      break;
    case "NUM-CP005-PROT-022":
      intervalClasses.add(String(pkg.hiddenState.rangeClass));
      assert.equal(Number(pkg.canonicalAnswer), (pkg.hiddenState.matches as readonly number[]).length);
      break;
    case "NUM-CP005-PROT-023":
      oddMinimumTargets.set(Number(pkg.hiddenState.targetDivisorCount), pkg.canonicalAnswer);
      assert.equal(BigInt(pkg.canonicalAnswer) % 2n, 1n);
      break;
    case "NUM-CP005-PROT-024":
      evenMinimumTargets.set(Number(pkg.hiddenState.targetDivisorCount), pkg.canonicalAnswer);
      assert.equal(BigInt(pkg.canonicalAnswer) % 2n, 0n);
      break;
  }
}

for (const prototypeId of NUM_CP005_WAVE03_PROTOTYPE_IDS) {
  assert.deepEqual([...positions.get(prototypeId)!].sort(), [0, 1, 2, 3],
    `${prototypeId} did not reach every answer position`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"],
    `${prototypeId} did not reach every difficulty`);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 10,
    `${prototypeId} collapsed below ten distinct mathematical states`);
}

assert.deepEqual([...semantics].sort(), [
  "BOOLEAN_CLAIM",
  "DIVISOR_COUNT",
  "DIVISOR_VALUE",
  "INTEGER",
  "INTEGER_COUNT",
]);
assert.deepEqual([...representations].sort(), [
  "BOUNDED_INTERVAL",
  "CLAIM",
  "DIRECT",
  "DIVISOR_PAIR_TABLE",
]);
assert.deepEqual([...claimPolarities].sort(), ["False", "True"]);
assert.deepEqual([...indexedPositionClasses].sort(), ["FIRST", "LAST", "MIDDLE"]);
assert.deepEqual([...pairBlankSides].sort(), ["LEFT", "RIGHT"]);
assert.deepEqual([...intervalClasses].sort(), ["MULTIPLE", "ONE", "ZERO"]);
assert.equal(multiConditionStates, 100);
assert.equal(greatestBoundStates, 100);
assert.equal(pairTableStates, 100);

assert.equal(oddMinimumTargets.get(3), "9");
assert.equal(oddMinimumTargets.get(4), "15");
assert.equal(oddMinimumTargets.get(6), "45");
assert.equal(oddMinimumTargets.get(8), "105");
assert.equal(oddMinimumTargets.get(12), "315");
assert.equal(evenMinimumTargets.get(2), "2");
assert.equal(evenMinimumTargets.get(4), "6");
assert.equal(evenMinimumTargets.get(8), "24");
assert.equal(evenMinimumTargets.get(12), "60");
assert.equal(evenMinimumTargets.get(24), "360");

assert.throws(
  () => generateNumCp005Wave03ProvenPackage("NUM-CP005-PROT-017", 0),
  /positive integer/,
);
assert.throws(() => generateNumCp005Wave03ProvenSweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE03_AUTHORITY",
  temporaryPrototypeCount: NUM_CP005_WAVE03_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  answerSemantics: [...semantics].sort(),
  representations: [...representations].sort(),
  claimPolarities: [...claimPolarities].sort(),
  indexedPositionClasses: [...indexedPositionClasses].sort(),
  pairBlankSides: [...pairBlankSides].sort(),
  intervalClasses: [...intervalClasses].sort(),
  oddMinimumTargets: Object.fromEntries([...oddMinimumTargets.entries()].sort(([a], [b]) => a - b)),
  evenMinimumTargets: Object.fromEntries([...evenMinimumTargets.entries()].sort(([a], [b]) => a - b)),
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
