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
const p2Claims = new Set<string>();
const p5Topologies = new Set<string>();
const p6Topologies = new Set<string>();
const p7Classes = new Set<string>();
const p8Lengths = new Set<number>();

for (const pkg of packages) {
  const replay = generateNumCp001Wave01Package(pkg.temporaryPrototypeId, pkg.seed);
  assert.equal(
    JSON.stringify(replay),
    JSON.stringify(pkg),
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} is not deterministic`,
  );

  assert.equal(pkg.packageId, "NUM-001");
  assert.equal(pkg.checkpointId, "NUM-CP-001");
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.locale, "en-IN");
  assert.equal(
    pkg.canonicalAnswer,
    pkg.verifierAnswer,
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} canonical/verifier mismatch`,
  );

  assert.equal(pkg.options.length, 4);
  assert.equal(
    new Set(pkg.options.map((option) => option.value)).size,
    4,
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} has duplicate options`,
  );
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.options[pkg.correctIndex]?.value, pkg.canonicalAnswer);
  assert.ok(
    pkg.options.filter((option) => !option.isCorrect).every((option) => Boolean(option.misconceptionId)),
    `${pkg.temporaryPrototypeId} seed ${pkg.seed} has an anonymous distractor`,
  );

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

  const prototypePositions = answerPositions.get(pkg.temporaryPrototypeId) ?? new Set<number>();
  prototypePositions.add(pkg.correctIndex);
  answerPositions.set(pkg.temporaryPrototypeId, prototypePositions);

  const prototypeDifficulties = difficulties.get(pkg.temporaryPrototypeId) ?? new Set<NumCp001Difficulty>();
  prototypeDifficulties.add(pkg.difficulty);
  difficulties.set(pkg.temporaryPrototypeId, prototypeDifficulties);

  const prototypeFingerprints = fingerprints.get(pkg.temporaryPrototypeId) ?? new Set<string>();
  prototypeFingerprints.add(pkg.mathematicalFingerprint);
  fingerprints.set(pkg.temporaryPrototypeId, prototypeFingerprints);

  semantics.add(pkg.answerSemantic);

  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-001") p1Sets.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-002") p2Claims.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-005") p5Topologies.add(String(pkg.hiddenState.topology));
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-006") p6Topologies.add(String(pkg.hiddenState.topology));
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-007") p7Classes.add(pkg.canonicalAnswer);
  if (pkg.temporaryPrototypeId === "NUM-CP001-PROT-008") p8Lengths.add(Number(pkg.hiddenState.length));
}

for (const prototypeId of NUM_CP001_WAVE01_PROTOTYPE_IDS) {
  assert.deepEqual(
    [...answerPositions.get(prototypeId)!].sort(),
    [0, 1, 2, 3],
    `${prototypeId} did not reach every answer position`,
  );
  assert.deepEqual(
    [...difficulties.get(prototypeId)!].sort(),
    ["EASY", "HARD", "MEDIUM"],
    `${prototypeId} did not reach every difficulty band`,
  );
  assert.ok(
    (fingerprints.get(prototypeId)?.size ?? 0) >= 3,
    `${prototypeId} collapsed to fewer than three mathematical states`,
  );
}

assert.deepEqual([...p1Sets].sort(), ["INTEGER", "IRRATIONAL", "NATURAL", "RATIONAL", "WHOLE"]);
assert.ok(p2Claims.size >= 4, "Edge-claim prototype did not exercise enough boundary statements");
assert.deepEqual([...p5Topologies].sort(), ["(-10, -4)", "(-11, -4]", "(-8, -2]", "(-9, -2)"].sort());
assert.deepEqual([...p6Topologies].sort(), ["0", "1", "2"]);
assert.deepEqual([...p7Classes].sort(), [
  "ALWAYS_TRUE",
  "NEVER_TRUE",
  "SOMETIMES_TRUE",
  "TRUE_ONLY_WHEN_N_IS_ZERO",
]);
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
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([prototypeId, values]) => [prototypeId, values.size]),
  ),
  answerSemantics: [...semantics].sort(),
  numberSetsReached: [...p1Sets].sort(),
  intervalTopologiesReached: [...p5Topologies].sort(),
  parityClaimClassesReached: [...p7Classes].sort(),
  permanentQlCount: 0,
  activePackageCount: 0,
}, null, 2));