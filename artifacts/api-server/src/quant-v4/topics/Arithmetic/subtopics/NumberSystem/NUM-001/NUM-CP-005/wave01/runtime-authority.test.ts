import assert from "node:assert/strict";
import {
  generateNumCp005Wave01Package,
  generateNumCp005Wave01Sweep,
} from "./runtime";
import {
  NUM_CP005_WAVE01_PROTOTYPE_IDS,
  type NumCp005Difficulty,
} from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateNumCp005Wave01Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(NUM_CP005_WAVE01_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp005Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const semantics = new Set<string>();
let zeroEvenDivisorStates = 0;
let unitStates = 0;
let primeStates = 0;
let primePowerStates = 0;
let squareRichStates = 0;
let inverseStates = 0;

for (const pkg of packages) {
  const replay = generateNumCp005Wave01Package(pkg.temporaryPrototypeId, pkg.seed);
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

  assert.ok(pkg.sourceAncestry.length >= 4);
  assert.ok(pkg.prototypeAncestry.includes(pkg.temporaryPrototypeId));
  assert.ok(pkg.mathematicalFingerprint.startsWith(pkg.temporaryPrototypeId));

  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.maturity, "EXECUTABLE_DISCOVERY_PROOF");
  assert.equal(pkg.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY_CANDIDATE");
  assert.equal(pkg.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(pkg.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  const positions = answerPositions.get(pkg.temporaryPrototypeId) ?? new Set<number>();
  positions.add(pkg.correctIndex);
  answerPositions.set(pkg.temporaryPrototypeId, positions);

  const bands = difficulties.get(pkg.temporaryPrototypeId) ?? new Set<NumCp005Difficulty>();
  bands.add(pkg.difficulty);
  difficulties.set(pkg.temporaryPrototypeId, bands);

  const states = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  states.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, states);

  semantics.add(pkg.answerSemantic);
  const factorState = pkg.hiddenState.factorState as Array<{ prime: number; exponent: number }>;
  if (factorState.length === 0) unitStates += 1;
  if (factorState.length === 1 && factorState[0]?.exponent === 1) primeStates += 1;
  if (factorState.length === 1 && (factorState[0]?.exponent ?? 0) > 1) primePowerStates += 1;
  if (factorState.some((factor) => factor.exponent >= 2)) squareRichStates += 1;
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-004" && pkg.canonicalAnswer === "0") {
    zeroEvenDivisorStates += 1;
  }
  if (pkg.temporaryPrototypeId === "NUM-CP005-PROT-008") {
    inverseStates += 1;
    const target = BigInt(String(pkg.hiddenState.targetDivisorCount));
    const known = BigInt(String(pkg.hiddenState.knownChoiceProduct));
    const answer = BigInt(pkg.canonicalAnswer);
    assert.equal(known * (answer + 1n), target,
      `${pkg.temporaryPrototypeId} seed ${pkg.seed} inverse equation mismatch`);
  }
}

for (const prototypeId of NUM_CP005_WAVE01_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3],
    `${prototypeId} did not reach every answer position`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"],
    `${prototypeId} did not reach every difficulty`);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 12,
    `${prototypeId} collapsed below twelve distinct mathematical states`);
}

assert.deepEqual([...semantics].sort(), ["DIVISOR_COUNT", "DIVISOR_SUM", "PRIME_EXPONENT"]);
assert.ok(unitStates > 0, "The n = 1 edge was not represented");
assert.ok(primeStates > 0, "Prime-number states were not represented");
assert.ok(primePowerStates > 0, "Prime-power states were not represented");
assert.ok(squareRichStates > 0, "Square-divisor states were not represented");
assert.ok(zeroEvenDivisorStates > 0, "Odd numbers with zero even divisors were not represented");
assert.equal(inverseStates, SEEDS_PER_PROTOTYPE);

assert.throws(
  () => generateNumCp005Wave01Package("NUM-CP005-PROT-001", 0),
  /positive integer/,
);
assert.throws(() => generateNumCp005Wave01Sweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE01_AUTHORITY",
  temporaryPrototypeCount: NUM_CP005_WAVE01_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  answerSemantics: [...semantics].sort(),
  edgeCoverage: {
    unitStates,
    primeStates,
    primePowerStates,
    squareRichStates,
    zeroEvenDivisorStates,
    inverseStates,
  },
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
