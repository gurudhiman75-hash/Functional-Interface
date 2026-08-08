import { generateNumCp006Wave01Package } from "./runtime.ts";
import { NUM_CP006_WAVE01_PROTOTYPE_IDS } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const seedsPerPrototype = 100;
let generatedPackages = 0;
let deterministicReplayChecks = 0;
let verifierChecks = 0;
let lifecycleViolations = 0;
const answerPositions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();

for (const prototypeId of NUM_CP006_WAVE01_PROTOTYPE_IDS) {
  answerPositions.set(prototypeId, new Set());
  difficulties.set(prototypeId, new Set());
  fingerprints.set(prototypeId, new Set());

  for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
    const first = generateNumCp006Wave01Package(prototypeId, seed);
    const replay = generateNumCp006Wave01Package(prototypeId, seed);
    generatedPackages += 1;
    deterministicReplayChecks += 1;
    assert(JSON.stringify(first) === JSON.stringify(replay), `${prototypeId}/${seed}: non-deterministic replay`);
    assert(first.temporaryPrototypeId === prototypeId, `${prototypeId}/${seed}: prototype mismatch`);
    assert(first.permanentQlId === null, `${prototypeId}/${seed}: permanent QL leaked`);
    assert(first.options.length === 4, `${prototypeId}/${seed}: option count`);
    assert(new Set(first.options.map((option) => option.value)).size === 4, `${prototypeId}/${seed}: duplicate options`);
    assert(first.options.filter((option) => option.isCorrect).length === 1, `${prototypeId}/${seed}: correct option count`);
    assert(first.options[first.correctIndex]?.value === first.canonicalAnswer, `${prototypeId}/${seed}: answer/index mismatch`);
    assert(first.explanation.stepByStep.length >= 2, `${prototypeId}/${seed}: explanation steps`);
    assert(first.explanation.commonTraps.length === 3, `${prototypeId}/${seed}: trap count`);
    verifierChecks += 1;
    assert(first.verifierAnswer === first.canonicalAnswer, `${prototypeId}/${seed}: independent verifier mismatch`);
    if (
      first.lifecycle.active
      || first.lifecycle.questionStudioDiscoverable
      || first.lifecycle.questionBankWritable
      || first.lifecycle.testEligible
      || first.lifecycle.publiclyPublishable
    ) lifecycleViolations += 1;
    answerPositions.get(prototypeId)!.add(first.correctIndex);
    difficulties.get(prototypeId)!.add(first.difficulty);
    fingerprints.get(prototypeId)!.add(first.mathematicalFingerprint);
  }

  assert(
    JSON.stringify([...answerPositions.get(prototypeId)!].sort()) === JSON.stringify([0, 1, 2, 3]),
    `${prototypeId}: answer-position reachability`,
  );
  assert(difficulties.get(prototypeId)!.size >= 2, `${prototypeId}: insufficient difficulty variation`);
  assert(fingerprints.get(prototypeId)!.size >= 40, `${prototypeId}: insufficient mathematical variation`);
}

assert(generatedPackages === 800, "Wave 01 package count");
assert(lifecycleViolations === 0, "Wave 01 lifecycle violations");

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_WAVE01_AUTHORITY",
  temporaryPrototypeCount: NUM_CP006_WAVE01_PROTOTYPE_IDS.length,
  seedsPerPrototype,
  generatedPackages,
  deterministicReplayChecks,
  verifierChecks,
  lifecycleViolations,
  permanentQlCount: 0,
  answerPositionsByPrototype: Object.fromEntries(
    [...answerPositions.entries()].map(([id, values]) => [id, [...values].sort()]),
  ),
  difficultyBandsByPrototype: Object.fromEntries(
    [...difficulties.entries()].map(([id, values]) => [id, [...values].sort()]),
  ),
  distinctFingerprintsByPrototype: Object.fromEntries(
    [...fingerprints.entries()].map(([id, values]) => [id, values.size]),
  ),
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
