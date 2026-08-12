import assert from "node:assert/strict";
import {
  generateNumCp001Wave01Package,
  generateNumCp001Wave01Sweep,
  NUM_CP001_WAVE01_PROTOTYPE_IDS,
} from "./runtime";
import type { NumCp001Difficulty } from "./types";

const SEEDS_PER_PROTOTYPE = 100;
const packages = generateNumCp001Wave01Sweep(SEEDS_PER_PROTOTYPE);

assert.equal(NUM_CP001_WAVE01_PROTOTYPE_IDS.length, 8);
assert.equal(packages.length, 800);

const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<NumCp001Difficulty>>();
const fingerprints = new Map<string, Set<string>>();
const semantics = new Set<string>();
const p1Sets = new Set<string>();
const p2Answers = new Set<string>();
const p5EndpointTopologies = new Set<string>();
const p6Topologies = new Set<string>();
const p7Classes = new Set<string>();
const p7Claims = new Set<string>();
const p8Lengths = new Set<number>();
let learnerFacingInternalLabelLeaks = 0;

for (const pkg of packages) {
  const replay = generateNumCp001Wave01Package(pkg.temporaryPrototypeId, pkg.seed);
  assert.equal(JSON.stringify(replay), JSON.stringify(pkg), `${pkg.temporaryPrototypeId} seed ${pkg.seed} replay mismatch`);

  assert.equal(pkg.packageId, "NUM-001");
  assert.equal(pkg.checkpointId, "NUM-CP-001");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.locale, "en-IN");
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer, `${pkg.temporaryPrototypeId} seed ${pkg.seed} verifier mismatch`);

  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4, `${pkg.temporaryPrototypeId} duplicate options`);
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
  assert.ok(pkg.explanation.finalAnswer.toLowerCase().includes(pkg.canonicalAnswer.toLowerCase()));

  const learnerFacingText = [
    pkg.stem,
    pkg.canonicalAnswer,
    ...pkg.options.map((option) => option.value),
    ...pkg.explanation.coreConcept,
    ...pkg.explanation.givenDataAndStrategy,
    ...pkg.explanation.stepByStep,
    ...pkg.explanation.examSpeedMethod,
    ...pkg.explanation.commonTraps,
    pkg.explanation.finalAnswer,
  ].join("\n");
  if (/[A-Z]{2,}_[A-Z0-9_]+/.test(learnerFacingText)) learnerFacingInternalLabelLeaks += 1;

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

  const bands = difficulties.get(pkg.temporaryPrototypeId) ?? new Set<NumCp001Difficulty>();
  bands.add(pkg.difficulty);
  difficulties.set(pkg.temporaryPrototypeId, bands);

  const states = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  states.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, states);
  semantics.add(pkg.answerSemantic);

  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-001") p1Sets.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-002") p2Answers.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-005") {
    const notation = String(pkg.hiddenState.topology);
    const endpointShape = `${notation[0]}${notation.at(-1)}`;
    p5EndpointTopologies.add(endpointShape);
    const expectedDifficulty = endpointShape === "[]" ? "EASY" : endpointShape === "()" ? "HARD" : "MEDIUM";
    assert.equal(pkg.difficulty, expectedDifficulty, `Interval difficulty is not topology-driven for ${notation}`);
  }
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-006") {
    const topology = Number(pkg.hiddenState.topology);
    p6Topologies.add(String(topology));
    assert.equal(pkg.difficulty, (["EASY", "MEDIUM", "HARD"] as const)[topology]);
  }
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-007") {
    p7Classes.add(pkg.canonicalAnswer);
    p7Claims.add(String(pkg.hiddenState.claimId));
    const claimId = String(pkg.hiddenState.claimId);
    if (claimId.startsWith("POLYNOMIAL_")) assert.equal(pkg.difficulty, "HARD");
    if (claimId === "N_IS_EVEN" || claimId === "N_IS_ODD") assert.equal(pkg.difficulty, "EASY");
  }
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-008") {
    const length = Number(pkg.hiddenState.length);
    p8Lengths.add(length);
    const expectedDifficulty = length === 3 ? "EASY" : length === 4 ? "MEDIUM" : "HARD";
    assert.equal(pkg.difficulty, expectedDifficulty, `Consecutive-block difficulty is not length-driven for ${length}`);
  }
}

for (const prototypeId of NUM_CP001_WAVE01_PROTOTYPE_IDS) {
  assert.deepEqual([...answerPositions.get(prototypeId)!].sort(), [0, 1, 2, 3], `${prototypeId} answer-position gap`);
  assert.deepEqual([...difficulties.get(prototypeId)!].sort(), ["EASY", "HARD", "MEDIUM"], `${prototypeId} difficulty gap`);
  assert.ok((fingerprints.get(prototypeId)?.size ?? 0) >= 3, `${prototypeId} collapsed to fewer than three states`);
}

assert.equal(learnerFacingInternalLabelLeaks, 0);
assert.deepEqual([...p1Sets].sort(), [
  "Integers",
  "Irrational numbers",
  "Natural numbers",
  "Rational numbers",
  "Whole numbers",
].sort());
assert.ok(p2Answers.size >= 4, "Boundary-claim foundation did not vary its correct statement");
assert.deepEqual([...p5EndpointTopologies].sort(), ["()", "(]", "[)", "[]"]);
assert.deepEqual([...p6Topologies].sort(), ["0", "1", "2"]);
assert.deepEqual([...p7Classes].sort(), [
  "Always true",
  "Never true",
  "True only when n is even",
  "True only when n is odd",
].sort());
assert.equal(p7Claims.size, 8, "Parity topology fingerprinting must reflect the eight real claim states only");
assert.equal(fingerprints.get("NUM-CP001-PROT-007")?.size, 8, "Parity fingerprint count is artificially inflated");
assert.deepEqual([...p8Lengths].sort((a, b) => a - b), [3, 4, 5]);

for (const expectedSemantic of [
  "NUMBER_SET",
  "BOOLEAN_CLAIM",
  "ORDERED_LIST",
  "DISTANCE",
  "COUNT",
  "PARITY_CLASS",
  "NUMBER_TUPLE",
]) {
  assert.ok(semantics.has(expectedSemantic), `Missing answer semantic ${expectedSemantic}`);
}

assert.throws(() => generateNumCp001Wave01Package("NUM-CP001-PROT-001", 0), /positive integer/);
assert.throws(() => generateNumCp001Wave01Sweep(0), /positive integer/);

console.log(JSON.stringify({
  status: "PASS_NUM_CP001_WAVE01_AUTHORITY",
  temporaryPrototypeCount: NUM_CP001_WAVE01_PROTOTYPE_IDS.length,
  packagesPerPrototype: SEEDS_PER_PROTOTYPE,
  generatedPackages: packages.length,
  distinctFingerprintsByPrototype: Object.fromEntries([...fingerprints.entries()].map(([id, values]) => [id, values.size])),
  answerSemantics: [...semantics].sort(),
  numberSetsReached: [...p1Sets].sort(),
  intervalEndpointTopologiesReached: [...p5EndpointTopologies].sort(),
  parityClaimClassesReached: [...p7Classes].sort(),
  parityClaimStatesReached: p7Claims.size,
  learnerFacingInternalLabelLeaks,
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));