import assert from "node:assert/strict";
import { SAP_CP002_WAVE01_PROTOTYPE_IDS } from "./types";
import { generateSapCp002Wave01Sweep } from "./runtime";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateSapCp002Wave01Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(SAP_CP002_WAVE01_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

interface PrototypeStats {
  readonly fingerprints: Set<string>;
  readonly answerPositions: Set<number>;
  readonly difficulties: Set<string>;
  readonly answers: Set<string>;
}

const stats = new Map<string, PrototypeStats>();
let nonIntegerAnswerCount = 0;
let negativeAnswerCount = 0;
let mixedNumberDisplayCount = 0;
let complexFractionDisplayCount = 0;
let scopedOfCount = 0;
let cancellationStateCount = 0;

for (const pkg of packages) {
  assert.equal(pkg.packageId, "SAP-001");
  assert.equal(pkg.checkpointId, "SAP-CP-002");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.locale, "en-IN");
  assert.equal(pkg.taskDirection, "FORWARD");
  assert.equal(pkg.answerSemantic, "SIMPLIFIED_RATIONAL");
  assert.equal(pkg.validation.ok, true, `${pkg.temporaryPrototypeId} seed ${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.deepEqual(pkg.validation.errors, []);
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => (
    option.misconceptionId !== null && option.analysis.length >= 20
  )));
  assert.ok(pkg.stem.includes(pkg.renderedExpression));
  assert.ok(pkg.stem.includes("lowest terms"));
  assert.ok(pkg.explanation.coreConcept.length >= 30);
  assert.ok(pkg.explanation.givenDataAndStrategy.length >= 30);
  assert.ok(pkg.explanation.stepByStep.length >= 3);
  assert.equal(pkg.explanation.commonTraps.length, 3);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.ok(pkg.canonicalTrace.length >= 1);
  assert.ok(pkg.independentTrace.length >= 1);
  assert.ok(pkg.sourceAncestry.length >= 4);
  assert.ok(pkg.prototypeAncestry.includes(pkg.temporaryPrototypeId));
  assert.ok(pkg.mathematicalFingerprint.length >= 30);

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

  if (pkg.canonicalAnswer.includes("/")) nonIntegerAnswerCount += 1;
  if (pkg.canonicalAnswer.startsWith("-")) negativeAnswerCount += 1;
  if (pkg.renderedExpression.includes(" ") && pkg.temporaryPrototypeId.includes("MIXED-NUMBERS")) {
    mixedNumberDisplayCount += 1;
  }
  if (pkg.renderedExpression.includes("⟦") && pkg.renderedExpression.includes("⟧⁄⟦")) {
    complexFractionDisplayCount += 1;
  }
  if (pkg.renderedExpression.includes(" of ")) scopedOfCount += 1;
  if ("cancelA" in pkg.hiddenState && "cancelB" in pkg.hiddenState) cancellationStateCount += 1;

  const current = stats.get(pkg.temporaryPrototypeId) ?? {
    fingerprints: new Set<string>(),
    answerPositions: new Set<number>(),
    difficulties: new Set<string>(),
    answers: new Set<string>(),
  };
  current.fingerprints.add(pkg.mathematicalFingerprint);
  current.answerPositions.add(pkg.correctIndex);
  current.difficulties.add(pkg.difficulty);
  current.answers.add(pkg.canonicalAnswer);
  stats.set(pkg.temporaryPrototypeId, current);
}

assert.ok(nonIntegerAnswerCount >= 500, "Wave 01 should materially exercise non-integer rational answers.");
assert.ok(negativeAnswerCount >= 20, "Wave 01 should include signed rational answers.");
assert.equal(mixedNumberDisplayCount, 100);
assert.equal(complexFractionDisplayCount, 100);
assert.equal(scopedOfCount, 100);
assert.equal(cancellationStateCount, 100);

for (const prototypeId of SAP_CP002_WAVE01_PROTOTYPE_IDS) {
  const current = stats.get(prototypeId);
  assert.ok(current, `${prototypeId} produced no packages.`);
  assert.ok(current.fingerprints.size >= 55, `${prototypeId} lacks mathematical diversity.`);
  assert.ok(current.answers.size >= 15, `${prototypeId} lacks answer diversity.`);
  assert.deepEqual([...current.answerPositions].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...current.difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
}

console.log(JSON.stringify({
  status: "PASS_SAP_CP002_WAVE01_FRACTION_AUTHORITY",
  temporaryPrototypeCount: SAP_CP002_WAVE01_PROTOTYPE_IDS.length,
  generatedPackages: packages.length,
  seedsPerPrototype: SEEDS_PER_PROTOTYPE,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...stats].map(([prototypeId, value]) => [prototypeId, value.fingerprints.size]),
  ),
  nonIntegerAnswerCount,
  negativeAnswerCount,
  mixedNumberDisplayCount,
  complexFractionDisplayCount,
  scopedOfCount,
  cancellationStateCount,
  permanentQlCount: 0,
  nextAvailablePermanentQlId: "SAP-QL-017",
  questionStudioStatus: "DISABLED",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publicStatus: "INACTIVE",
}, null, 2));
