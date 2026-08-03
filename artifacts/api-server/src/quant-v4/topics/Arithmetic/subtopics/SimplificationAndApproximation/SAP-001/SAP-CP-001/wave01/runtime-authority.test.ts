import assert from "node:assert/strict";
import { rational, formatRational } from "../../../shared/exact-rational";
import {
  binaryNode,
  exactRootNode,
  factorialNode,
  percentOfNode,
  powerNode,
  valueNode,
} from "../../../shared/expression-ast";
import { evaluateExact } from "../../../shared/exact-evaluator";
import { evaluateIndependent } from "../../../shared/independent-evaluator";
import {
  generateSapCp001Wave01Package,
  generateSapCp001Wave01Sweep,
} from "./runtime";
import {
  SAP_CP001_WAVE01_PROTOTYPE_IDS,
  type SapDifficulty,
} from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateSapCp001Wave01Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(SAP_CP001_WAVE01_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<SapDifficulty>>();
const fingerprints = new Map<string, Set<string>>();
const bracketStyles = new Set<string>();
let negativeAnswers = 0;
let fractionalAnswers = 0;
let scopedOfStates = 0;
let powerStates = 0;
let factorialStates = 0;
let leftToRightMultiplyDivideStates = 0;
let leftToRightAddSubtractStates = 0;

for (const pkg of packages) {
  const replay = generateSapCp001Wave01Package(pkg.temporaryPrototypeId, pkg.seed);
  assert.deepEqual(replay, pkg, `${pkg.temporaryPrototypeId} seed ${pkg.seed} is not deterministic`);

  assert.equal(pkg.packageId, "SAP-001");
  assert.equal(pkg.checkpointId, "SAP-CP-001");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.locale, "en-IN");
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer,
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} verifier mismatch`);
  assert.equal(pkg.validation.ok, true, pkg.validation.errors.join("\n"));

  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4,
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} has duplicate options`);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect)
    .every((option) => Boolean(option.misconceptionId) && option.analysis.length > 20));

  assert.ok(pkg.stem.startsWith("Find the exact value of "));
  assert.ok(pkg.renderedExpression.length >= 5);
  assert.ok(pkg.canonicalTrace.length >= 1);
  assert.ok(pkg.explanation.coreConcept.length > 20);
  assert.ok(pkg.explanation.givenDataAndStrategy.includes(pkg.renderedExpression));
  assert.equal(pkg.explanation.stepByStep.length, pkg.canonicalTrace.length);
  assert.ok(pkg.explanation.examSpeedMethod.length > 20);
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

  const bands = difficulties.get(pkg.temporaryPrototypeId) ?? new Set<SapDifficulty>();
  bands.add(pkg.difficulty);
  difficulties.set(pkg.temporaryPrototypeId, bands);

  const states = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  states.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, states);

  const numerator = BigInt(pkg.canonicalAnswer.split("/")[0]!);
  if (numerator < 0n) negativeAnswers += 1;
  if (pkg.canonicalAnswer.includes("/")) fractionalAnswers += 1;

  if (pkg.temporaryPrototypeId === "SAP-CP001-PROT-NESTED-GROUPING") {
    bracketStyles.add(String(pkg.hiddenState.leftStyle));
    bracketStyles.add(String(pkg.hiddenState.rightStyle));
  }
  if (pkg.temporaryPrototypeId === "SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION") scopedOfStates += 1;
  if (pkg.temporaryPrototypeId === "SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC") powerStates += 1;
  if (pkg.temporaryPrototypeId === "SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC") factorialStates += 1;
  if (pkg.temporaryPrototypeId === "SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT") {
    leftToRightMultiplyDivideStates += 1;
    const { dividend, divisor, multiplier } = pkg.hiddenState;
    assert.equal(
      pkg.canonicalAnswer,
      ((Number(dividend) / Number(divisor)) * Number(multiplier)).toString(),
    );
  }
  if (pkg.temporaryPrototypeId === "SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT") {
    leftToRightAddSubtractStates += 1;
    const { a, b, c } = pkg.hiddenState;
    assert.equal(pkg.canonicalAnswer, (Number(a) - Number(b) + Number(c)).toString());
  }
}

for (const prototypeId of SAP_CP001_WAVE01_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3],
    `${prototypeId} did not reach every answer position`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"],
    `${prototypeId} did not reach every difficulty`);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 20,
    `${prototypeId} collapsed below twenty distinct mathematical states`);
}

assert.deepEqual([...bracketStyles].sort(), ["CURLY", "ROUND", "SQUARE"]);
assert.ok(negativeAnswers > 0, "No negative canonical answers were generated");
assert.equal(fractionalAnswers, 0, "Wave 01 should retain exact integer outputs while proving precedence");
assert.equal(scopedOfStates, SEEDS_PER_PROTOTYPE);
assert.equal(powerStates, SEEDS_PER_PROTOTYPE);
assert.equal(factorialStates, SEEDS_PER_PROTOTYPE);
assert.equal(leftToRightMultiplyDivideStates, SEEDS_PER_PROTOTYPE);
assert.equal(leftToRightAddSubtractStates, SEEDS_PER_PROTOTYPE);

const sharedProofExpressions = [
  binaryNode("DIVIDE", valueNode(1n), valueNode(2n)),
  powerNode(valueNode(2n), 10n),
  exactRootNode(3n, valueNode(125n)),
  factorialNode(valueNode(6n)),
  percentOfNode(valueNode(12n), valueNode(250n)),
];
for (const expression of sharedProofExpressions) {
  const canonical = evaluateExact(expression).value;
  const independent = evaluateIndependent(expression);
  assert.equal(formatRational(canonical), formatRational(independent));
}
assert.equal(formatRational(rational(-2n, -4n)), "1/2");
assert.throws(() => rational(1n, 0n), /denominator cannot be zero/);
assert.throws(
  () => generateSapCp001Wave01Package("SAP-CP001-PROT-FLAT-MIXED-OPERATIONS", 0),
  /positive integer/,
);
assert.throws(() => generateSapCp001Wave01Sweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_SAP_CP001_WAVE01_AUTHORITY",
  temporaryPrototypeCount: SAP_CP001_WAVE01_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  edgeCoverage: {
    negativeAnswers,
    fractionalAnswers,
    bracketStyles: [...bracketStyles].sort(),
    scopedOfStates,
    powerStates,
    factorialStates,
    leftToRightMultiplyDivideStates,
    leftToRightAddSubtractStates,
  },
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
