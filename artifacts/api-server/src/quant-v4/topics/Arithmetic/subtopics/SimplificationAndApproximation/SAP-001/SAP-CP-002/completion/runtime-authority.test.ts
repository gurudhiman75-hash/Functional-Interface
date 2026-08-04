import assert from "node:assert/strict";
import { SAP_CP002_COMPLETION_PROTOTYPE_IDS } from "./types";
import { generateSapCp002CompletionSweep } from "./final-runtime";

const packages = generateSapCp002CompletionSweep(100);
assert.equal(SAP_CP002_COMPLETION_PROTOTYPE_IDS.length, 11);
assert.equal(packages.length, 1_100);

const stats = new Map<string, { fingerprints: Set<string>; answers: Set<string>; positions: Set<number>; difficulties: Set<string> }>();
const directions = new Set<string>();
let continuedFractionCount = 0;
let inverseCount = 0;
let comparisonCount = 0;
let selectionCount = 0;
let diagnosisCount = 0;

for (const pkg of packages) {
  assert.equal(pkg.packageId, "SAP-001");
  assert.equal(pkg.checkpointId, "SAP-CP-002");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.validation.ok, true, `${pkg.temporaryPrototypeId} seed ${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => option.misconceptionId !== null && option.analysis.length >= 20));
  assert.ok(pkg.stem.length >= 30);
  assert.ok(pkg.explanation.coreConcept.length >= 30);
  assert.ok(pkg.explanation.givenDataAndStrategy.length >= 25);
  assert.ok(pkg.explanation.stepByStep.length >= 3);
  assert.ok(pkg.explanation.examSpeedMethod.length >= 25);
  assert.equal(pkg.explanation.commonTraps.length, 3);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.ok(pkg.independentTrace.length >= 2);
  assert.ok(pkg.sourceAncestry.length >= 4);
  assert.ok(pkg.prototypeAncestry.includes(pkg.temporaryPrototypeId));
  assert.ok(pkg.mathematicalFingerprint.length >= 20);
  assert.equal(pkg.lifecycle.permanentQlId, null);
  assert.equal(pkg.lifecycle.maturity, "EXECUTABLE_DISCOVERY_PROOF");
  assert.equal(pkg.lifecycle.reviewStatus, "UNREVIEWED_DISCOVERY_CANDIDATE");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  directions.add(pkg.taskDirection);
  if (pkg.temporaryPrototypeId.includes("CONTINUED")) continuedFractionCount += 1;
  if (pkg.taskDirection === "INVERSE") inverseCount += 1;
  if (pkg.taskDirection === "COMPARISON") comparisonCount += 1;
  if (pkg.taskDirection === "SELECTION") selectionCount += 1;
  if (pkg.taskDirection === "DIAGNOSIS") diagnosisCount += 1;

  const current = stats.get(pkg.temporaryPrototypeId) ?? { fingerprints: new Set<string>(), answers: new Set<string>(), positions: new Set<number>(), difficulties: new Set<string>() };
  current.fingerprints.add(pkg.mathematicalFingerprint);
  current.answers.add(pkg.canonicalAnswer);
  current.positions.add(pkg.correctIndex);
  current.difficulties.add(pkg.difficulty);
  stats.set(pkg.temporaryPrototypeId, current);
}

assert.deepEqual([...directions].sort(), ["COMPARISON", "DIAGNOSIS", "FORWARD", "INVERSE", "SELECTION"]);
assert.equal(continuedFractionCount, 100);
assert.equal(inverseCount, 300);
assert.equal(comparisonCount, 100);
assert.equal(selectionCount, 100);
assert.equal(diagnosisCount, 100);

for (const prototypeId of SAP_CP002_COMPLETION_PROTOTYPE_IDS) {
  const current = stats.get(prototypeId)!;
  assert.ok(current.fingerprints.size >= 45, `${prototypeId} lacks fingerprint diversity`);
  assert.ok(current.answers.size >= 3, `${prototypeId} lacks answer diversity`);
  assert.deepEqual([...current.positions].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...current.difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
}

console.log(JSON.stringify({
  status: "PASS_SAP_CP002_COMPLETION_AUTHORITY",
  temporaryPrototypeCount: SAP_CP002_COMPLETION_PROTOTYPE_IDS.length,
  generatedPackages: packages.length,
  taskDirections: [...directions].sort(),
  fingerprintCounts: Object.fromEntries([...stats].map(([prototypeId, stat]) => [prototypeId, stat.fingerprints.size])),
  inverseCount,
  comparisonCount,
  selectionCount,
  diagnosisCount,
  continuedFractionCount,
  permanentQlCount: 0,
  nextAvailablePermanentQlId: "SAP-QL-017",
  lifecycle: "LOCKED",
}, null, 2));
