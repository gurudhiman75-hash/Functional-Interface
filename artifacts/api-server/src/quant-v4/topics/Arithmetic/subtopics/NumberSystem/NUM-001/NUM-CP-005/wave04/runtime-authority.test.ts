import assert from "node:assert/strict";
import {
  generateNumCp005Wave04Package,
  generateNumCp005Wave04Sweep,
  NUM_CP005_WAVE04_PROTOTYPE_IDS,
} from "./runtime-proven";
import type { NumCp005Difficulty } from "../wave01/types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateNumCp005Wave04Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(NUM_CP005_WAVE04_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp005Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const semantics = new Set<string>();
const representations = new Set<string>();
const dataSufficiencyClasses = new Set<string>();
const statementMasks = new Set<number>();
const solutionClasses = new Set<string>();
const integerSetClasses = new Set<string>();
const comparisons = new Set<string>();
const boundedExistenceClasses = new Set<string>();
let completePairSetStates = 0;
let primeExponentTableStates = 0;

for (const pkg of packages) {
  const replay = generateNumCp005Wave04Package(pkg.temporaryPrototypeId, pkg.seed);
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

  const prototypeFingerprints = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  prototypeFingerprints.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, prototypeFingerprints);

  semantics.add(pkg.answerSemantic);
  representations.add(pkg.representation);

  switch (pkg.temporaryPrototypeId) {
    case "NUM-CP005-PROT-025":
      dataSufficiencyClasses.add(pkg.canonicalAnswer);
      break;
    case "NUM-CP005-PROT-026":
      statementMasks.add(Number(pkg.hiddenState.truthMask));
      break;
    case "NUM-CP005-PROT-027":
      solutionClasses.add(pkg.canonicalAnswer);
      break;
    case "NUM-CP005-PROT-028":
      completePairSetStates += 1;
      assert.notEqual(pkg.canonicalAnswer, "∅");
      break;
    case "NUM-CP005-PROT-029":
      integerSetClasses.add(String(pkg.hiddenState.solutionClass));
      break;
    case "NUM-CP005-PROT-030":
      primeExponentTableStates += 1;
      assert.equal(pkg.hiddenState.matchCount, 1);
      break;
    case "NUM-CP005-PROT-031":
      comparisons.add(pkg.canonicalAnswer);
      break;
    case "NUM-CP005-PROT-032":
      boundedExistenceClasses.add(String(pkg.hiddenState.existenceClass));
      break;
  }
}

for (const prototypeId of NUM_CP005_WAVE04_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3],
    `${prototypeId} did not reach every answer position`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"],
    `${prototypeId} did not reach every difficulty`);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 10,
    `${prototypeId} collapsed below ten distinct mathematical states`);
}

assert.deepEqual([...semantics].sort(), [
  "COMPARISON",
  "DATA_SUFFICIENCY_CLASS",
  "EXPONENT_PAIR_SET",
  "FACTORISATION",
  "INTEGER",
  "INTEGER_SET",
  "SOLUTION_CLASS",
  "STATEMENT_SET",
]);
assert.deepEqual([...representations].sort(), [
  "BOUNDED_OPTIMISATION",
  "DATA_SUFFICIENCY",
  "DIRECT_INVERSE",
  "MINI_CASELET",
  "PRIME_EXPONENT_TABLE",
  "STATEMENT_SET",
]);
assert.deepEqual([...dataSufficiencyClasses].sort(), [
  "Both together are sufficient",
  "Even together are insufficient",
  "I alone is sufficient",
  "II alone is sufficient",
]);
assert.deepEqual([...statementMasks].sort((left, right) => left - right), [0, 1, 2, 3, 4, 5, 6, 7]);
assert.deepEqual([...solutionClasses].sort(), ["Multiple solutions", "No solution", "Unique solution"]);
assert.deepEqual([...integerSetClasses].sort(), ["Multiple solutions", "No solution", "Unique solution"]);
assert.deepEqual([...comparisons].sort(), ["Number A", "Number B", "They are equal"]);
assert.deepEqual([...boundedExistenceClasses].sort(), ["HAS_SOLUTION", "NO_SOLUTION"]);
assert.equal(completePairSetStates, 100);
assert.equal(primeExponentTableStates, 100);

assert.throws(
  () => generateNumCp005Wave04Package("NUM-CP005-PROT-025", 0),
  /positive integer/,
);
assert.throws(() => generateNumCp005Wave04Sweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_WAVE04_AUTHORITY",
  temporaryPrototypeCount: NUM_CP005_WAVE04_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  answerSemantics: [...semantics].sort(),
  representations: [...representations].sort(),
  dataSufficiencyClasses: [...dataSufficiencyClasses].sort(),
  statementTruthMasks: [...statementMasks].sort((left, right) => left - right),
  inverseSolutionClasses: [...solutionClasses].sort(),
  integerSetClasses: [...integerSetClasses].sort(),
  comparisonOutcomes: [...comparisons].sort(),
  boundedExistenceClasses: [...boundedExistenceClasses].sort(),
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
