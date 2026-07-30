import assert from "node:assert/strict";
import {
  generateNumCp004Wave02Package,
  generateNumCp004Wave02Sweep,
  NUM_CP004_WAVE02_PROTOTYPE_IDS,
} from "./runtime";
import type { NumCp004Difficulty } from "../wave01/types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateNumCp004Wave02Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(NUM_CP004_WAVE02_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp004Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const semantics = new Set<string>();
let tieAdjustments = 0;
let nonTieAdjustments = 0;
let multiCoprimeSets = 0;

for (const pkg of packages) {
  const replay = generateNumCp004Wave02Package(pkg.temporaryPrototypeId, pkg.seed);
  assert.equal(JSON.stringify(replay), JSON.stringify(pkg), `${pkg.temporaryPrototypeId} seed ${pkg.seed} is not deterministic`);

  assert.equal(pkg.packageId, "NUM-001");
  assert.equal(pkg.checkpointId, "NUM-CP-004");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.locale, "en-IN");
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer, `${pkg.temporaryPrototypeId} seed ${pkg.seed} verifier mismatch`);

  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${pkg.temporaryPrototypeId} seed ${pkg.seed} duplicate options`);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId)));

  assert.ok(pkg.stem.length >= 25);
  assert.ok(pkg.explanation.coreConcept.length > 0);
  assert.ok(pkg.explanation.givenDataAndStrategy.length > 0);
  assert.ok(pkg.explanation.stepByStep.length > 0);
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

  const bands = difficulties.get(pkg.temporaryPrototypeId) ?? new Set<NumCp004Difficulty>();
  bands.add(pkg.difficulty);
  difficulties.set(pkg.temporaryPrototypeId, bands);

  const states = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  states.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, states);
  semantics.add(pkg.answerSemantic);

  if (pkg.temporaryPrototypeId === "NUM-CP004-PROT-015") {
    const values = pkg.hiddenState.coprimeValues as readonly number[];
    if (values.length >= 2) multiCoprimeSets += 1;
  }
  if (pkg.temporaryPrototypeId === "NUM-CP004-PROT-016") {
    const values = pkg.hiddenState.adjustments as readonly number[];
    if (values.length === 2) tieAdjustments += 1;
    else nonTieAdjustments += 1;
  }
}

for (const prototypeId of NUM_CP004_WAVE02_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3], `${prototypeId} did not reach every answer position`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"], `${prototypeId} did not reach every difficulty`);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 20, `${prototypeId} has insufficient mathematical variation`);
}

assert.deepEqual([...semantics].sort(), [
  "COPRIME_SET",
  "LEAST_PRIME_DIVISOR",
  "NEXT_PRIME",
  "PREVIOUS_PRIME",
  "PRIME_ADJUSTMENT_SET",
  "PRIME_PAIR",
  "PRIME_TRIPLE",
]);
assert.ok(multiCoprimeSets > 0, "Complete co-prime set family never produced a multi-answer set");
assert.ok(tieAdjustments > 0, "Prime adjustment family never reached a tie state");
assert.ok(nonTieAdjustments > 0, "Prime adjustment family never reached a non-tie state");

assert.throws(() => generateNumCp004Wave02Package("NUM-CP004-PROT-009", 0), /positive integer/);
assert.throws(() => generateNumCp004Wave02Sweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_WAVE02_AUTHORITY",
  temporaryPrototypeCount: NUM_CP004_WAVE02_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  answerSemantics: [...semantics].sort(),
  tieAdjustments,
  nonTieAdjustments,
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
