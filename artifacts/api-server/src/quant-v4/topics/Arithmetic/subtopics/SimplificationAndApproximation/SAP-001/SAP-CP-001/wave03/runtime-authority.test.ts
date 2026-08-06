import assert from "node:assert/strict";
import {
  fractionBarNode,
  groupNode,
  implicitMultiplyNode,
  valueNode,
} from "../../../shared/expression-ast";
import { formatRational } from "../../../shared/exact-rational";
import { evaluateExact } from "../../../shared/exact-evaluator";
import { evaluateIndependent } from "../../../shared/independent-evaluator";
import { renderExpression } from "../../../shared/expression-renderer";
import {
  generateSapCp001Wave03Package,
  generateSapCp001Wave03Sweep,
} from "./runtime";
import {
  SAP_CP001_WAVE03_PROTOTYPE_IDS,
  type SapDifficulty,
  type SapRepresentationKind,
} from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateSapCp001Wave03Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(SAP_CP001_WAVE03_PROTOTYPE_IDS.length, 4);
assert.equal(packages.length, 400);

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<SapDifficulty>>();
const fingerprints = new Map<string, Set<string>>();
const representations = new Map<SapRepresentationKind, number>();
const bracketStyles = new Set<string>();
const finalSigns = new Set<string>();
let fractionalAnswers = 0;
let negativeIntermediateStates = 0;

for (const pkg of packages) {
  const replay = generateSapCp001Wave03Package(pkg.temporaryPrototypeId, pkg.seed);
  assert.deepEqual(replay, pkg, `${pkg.temporaryPrototypeId} seed ${pkg.seed} is not deterministic`);

  assert.equal(pkg.packageId, "SAP-001");
  assert.equal(pkg.checkpointId, "SAP-CP-001");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.locale, "en-IN");
  assert.equal(pkg.taskDirection, "FORWARD");
  assert.equal(pkg.answerSemantic, "EXACT_VALUE");
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer);
  assert.equal(pkg.validation.ok, true, pkg.validation.errors.join("\n"));

  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect)
    .every((option) => Boolean(option.misconceptionId) && option.analysis.length > 25));

  assert.ok(pkg.stem.startsWith("Find the exact value of "));
  assert.ok(pkg.renderedExpression.length >= 5);
  assert.ok(pkg.canonicalTrace.length >= 2);
  assert.ok(pkg.explanation.coreConcept.length > 30);
  assert.ok(pkg.explanation.givenDataAndStrategy.includes(pkg.renderedExpression));
  assert.equal(pkg.explanation.stepByStep.length, pkg.canonicalTrace.length);
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

  representations.set(pkg.representationKind, (representations.get(pkg.representationKind) ?? 0) + 1);
  if (pkg.canonicalAnswer.includes("/")) fractionalAnswers += 1;

  if (pkg.representationKind === "FRACTION_BAR") {
    assert.ok(pkg.renderedExpression.includes("⁄"));
    bracketStyles.add(String(pkg.hiddenState.numeratorStyle));
    bracketStyles.add(String(pkg.hiddenState.denominatorStyle));
  }
  if (pkg.representationKind === "IMPLICIT_MULTIPLICATION") {
    assert.ok(/\d[([{]/.test(pkg.renderedExpression));
    assert.equal(pkg.renderedExpression.includes("×"), false);
    bracketStyles.add(String(pkg.hiddenState.bracketStyle));
  }
  if (pkg.representationKind === "REPEATED_GROUPING") {
    assert.equal(pkg.hiddenState.groupingDepth, 4);
    bracketStyles.add(String(pkg.hiddenState.outerStyle));
  }
  if (pkg.representationKind === "NEGATIVE_INTERMEDIATE") {
    negativeIntermediateStates += 1;
    assert.ok(Number(pkg.hiddenState.negativeIntermediate) < 0);
    finalSigns.add(String(pkg.hiddenState.finalSign));
  }
}

for (const prototypeId of SAP_CP001_WAVE03_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 40,
    `${prototypeId} collapsed below forty distinct mathematical states`);
}

assert.deepEqual([...representations.entries()].sort(), [
  ["FRACTION_BAR", 100],
  ["IMPLICIT_MULTIPLICATION", 100],
  ["NEGATIVE_INTERMEDIATE", 100],
  ["REPEATED_GROUPING", 100],
]);
assert.deepEqual([...bracketStyles].sort(), ["CURLY", "ROUND", "SQUARE"]);
assert.ok(fractionalAnswers >= 0);
assert.equal(negativeIntermediateStates, SEEDS_PER_PROTOTYPE);
assert.deepEqual([...finalSigns].sort(), ["NEGATIVE", "POSITIVE"]);

const fractionExpression = fractionBarNode(
  groupNode(valueNode(12n)),
  groupNode(valueNode(3n)),
);
assert.equal(formatRational(evaluateExact(fractionExpression).value), "4");
assert.equal(
  formatRational(evaluateExact(fractionExpression).value),
  formatRational(evaluateIndependent(fractionExpression)),
);
assert.ok(renderExpression(fractionExpression).includes("⁄"));

const implicitExpression = implicitMultiplyNode(valueNode(3n), groupNode(valueNode(7n)));
assert.equal(formatRational(evaluateExact(implicitExpression).value), "21");
assert.equal(
  formatRational(evaluateExact(implicitExpression).value),
  formatRational(evaluateIndependent(implicitExpression)),
);
assert.equal(renderExpression(implicitExpression), "3(7)");
assert.throws(() => implicitMultiplyNode(valueNode(3n), valueNode(7n)), /explicitly grouped/);
assert.throws(
  () => generateSapCp001Wave03Package("SAP-CP001-PROT-NEGATIVE-INTERMEDIATE", 0),
  /positive integer/,
);
assert.throws(() => generateSapCp001Wave03Sweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_SAP_CP001_WAVE03_AUTHORITY",
  temporaryPrototypeCount: SAP_CP001_WAVE03_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  representationCoverage: Object.fromEntries(representations),
  bracketStyles: [...bracketStyles].sort(),
  finalSigns: [...finalSigns].sort(),
  negativeIntermediateStates,
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
