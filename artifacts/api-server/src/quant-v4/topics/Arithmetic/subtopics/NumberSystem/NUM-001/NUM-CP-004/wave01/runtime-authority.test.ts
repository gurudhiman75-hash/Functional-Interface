import assert from "node:assert/strict";
import {
  generateNumCp004Wave01Package,
  generateNumCp004Wave01Sweep,
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
} from "./runtime-proven";
import type { NumCp004Difficulty } from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateNumCp004Wave01Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(NUM_CP004_WAVE01_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp004Difficulty>>();
const fingerprintCounts = new Map<string, Set<string>>();
const semantics = new Set<string>();
const p5Targets = new Set<string>();
const p6HiddenKinds = new Set<string>();
const p8Classes = new Set<string>();
const p8Fingerprints = new Set<string>();

for (const pkg of packages) {
  const replay = generateNumCp004Wave01Package(pkg.temporaryPrototypeId, pkg.seed);
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

  assert.ok(pkg.stem.length >= 20);
  assert.ok(pkg.explanation.coreConcept.length > 0);
  assert.ok(pkg.explanation.givenDataAndStrategy.length > 0);
  assert.ok(pkg.explanation.stepByStep.length > 0);
  assert.ok(pkg.explanation.examSpeedMethod.length > 0);
  assert.equal(pkg.explanation.commonTraps.length, 3);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));

  assert.ok(pkg.sourceAncestry.length >= 3);
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

  const fingerprints = fingerprintCounts.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  fingerprints.add(pkg.mathematicalFingerprint);
  fingerprintCounts.set(pkg.temporaryPrototypeId, fingerprints);

  semantics.add(pkg.answerSemantic);
  if (pkg.temporaryPrototypeId === "NUM-CP004-PROT-005") p5Targets.add(String(pkg.hiddenState.target));
  if (pkg.temporaryPrototypeId === "NUM-CP004-PROT-006") p6HiddenKinds.add(String(pkg.hiddenState.hiddenKind));
  if (pkg.temporaryPrototypeId === "NUM-CP004-PROT-008") {
    p8Classes.add(pkg.canonicalAnswer);
    p8Fingerprints.add(pkg.mathematicalFingerprint);
  }
}

for (const prototypeId of NUM_CP004_WAVE01_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3], `${prototypeId} did not reach every answer position`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"], `${prototypeId} did not reach every difficulty`);
  assert.ok((fingerprintCounts.get(prototypeId)?.size ?? 0) >= 3, `${prototypeId} collapsed to fewer than three mathematical states`);
}

assert.deepEqual([...p5Targets].sort(), [
  "DISTINCT_PRIME_FACTOR_COUNT",
  "LARGEST_PRIME_FACTOR",
  "SMALLEST_PRIME_FACTOR",
  "TOTAL_PRIME_FACTOR_COUNT",
]);
assert.deepEqual([...p6HiddenKinds].sort(), ["EXPONENT", "PRIME"]);
assert.deepEqual([...p8Classes].sort(), [
  "COLLECTIVELY_BUT_NOT_PAIRWISE",
  "NOT_COLLECTIVELY_COPRIME",
  "PAIRWISE_AND_COLLECTIVELY_COPRIME",
]);
assert.equal(p8Fingerprints.size, SEEDS_PER_PROTOTYPE, "Co-prime topology states must not collapse across the proof sweep");
assert.ok(!p8Classes.has("PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME"));

for (const expectedSemantic of [
  "PRIME_CLASS",
  "PRIME_SET",
  "COUNT",
  "FACTORISATION",
  "PRIME_FACTOR",
  "PRIME",
  "PRIME_EXPONENT",
  "PAIR",
  "COPRIME_CLASS",
]) {
  assert.ok(semantics.has(expectedSemantic), `Missing answer semantic ${expectedSemantic}`);
}

assert.throws(() => generateNumCp004Wave01Package("NUM-CP004-PROT-001", 0), /positive integer/);
assert.throws(() => generateNumCp004Wave01Sweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_WAVE01_AUTHORITY",
  temporaryPrototypeCount: NUM_CP004_WAVE01_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprintCounts.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  answerSemantics: [...semantics].sort(),
  p8Classes: [...p8Classes].sort(),
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));
