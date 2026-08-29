import { NUM_CP008_WAVE02_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave02 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const positions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let leastStates = 0;
let greatestStates = 0;
let zeroResidueStates = 0;
let boundedSetStates = 0;
let coefficientInverseStates = 0;
let modulusInverseStates = 0;
let structuredSumStates = 0;
let compatibleTripleStates = 0;
let incompatibleTripleStates = 0;
let nonCoprimeTripleStates = 0;

for (const prototypeId of NUM_CP008_WAVE02_PROTOTYPE_IDS) {
  positions.set(prototypeId, new Set());
  difficulties.set(prototypeId, new Set());
  fingerprints.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp008Wave02(prototypeId, seed);
    const replay = generateNumCp008Wave02(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert(JSON.stringify(q) === JSON.stringify(replay), `${label}: deterministic replay failed`);
    replayChecks += 1;
    assert(q.packageId === "NUM-002" && q.checkpointId === "NUM-CP-008", `${label}: package/checkpoint drift`);
    assert(q.permanentQlId === null, `${label}: permanent QL allocated`);
    assert(q.canonicalAnswer === q.verifierAnswer, `${label}: canonical/verifier mismatch (${q.canonicalAnswer} vs ${q.verifierAnswer})`);
    verifierChecks += 1;

    assert(q.options.length === 4, `${label}: option count`);
    assert(new Set(q.options.map((option) => option.value)).size === 4, `${label}: duplicate options`);
    assert(q.options.filter((option) => option.isCorrect).length === 1, `${label}: keyed-answer count`);
    assert(q.options[q.correctIndex]?.isCorrect === true, `${label}: correct-index binding`);
    assert(q.options[q.correctIndex]?.value === q.canonicalAnswer, `${label}: answer-option binding`);
    optionChecks += 1;

    assert(q.sourceAncestry.length >= 2, `${label}: source ancestry missing`);
    assert(q.prototypeAncestry.length >= 1, `${label}: prototype ancestry missing`);
    assert(q.explanation.steps.length >= 2, `${label}: working too shallow`);
    assert(q.explanation.finalAnswer === q.canonicalAnswer, `${label}: explanation answer drift`);

    const life = q.lifecycle;
    assert(life.permanentQlId === null, `${label}: lifecycle QL`);
    assert(life.maturity === "EXECUTABLE_DISCOVERY_PROOF", `${label}: maturity`);
    assert(life.reviewStatus === "UNREVIEWED_DISCOVERY_CANDIDATE", `${label}: review status`);
    assert(life.questionBankStatus === "NOT_STORED", `${label}: question bank status`);
    assert(life.testEligibility === "INELIGIBLE", `${label}: test eligibility`);
    assert(!life.active && !life.questionStudioDiscoverable && !life.questionBankWritable && !life.testEligible && !life.publiclyPublishable, `${label}: lifecycle opened`);
    lifecycleChecks += 1;

    positions.get(prototypeId)!.add(q.correctIndex);
    difficulties.get(prototypeId)!.add(q.difficulty);
    fingerprints.get(prototypeId)!.add(q.mathematicalFingerprint);

    const state = q.hiddenState as Readonly<Record<string, unknown>>;
    switch (state.mode) {
      case "BOUNDED_RESIDUE_EXTREMUM":
        if (state.direction === "LEAST") leastStates += 1;
        if (state.direction === "GREATEST") greatestStates += 1;
        if (state.residue === 0) zeroResidueStates += 1;
        break;
      case "BOUNDED_RESIDUE_COUNT":
        if (state.residue === 0) zeroResidueStates += 1;
        break;
      case "BOUNDED_TWO_CONGRUENCE_SET":
        boundedSetStates += 1;
        assert(Array.isArray(state.solutions) && (state.solutions as unknown[]).length >= 2, `${label}: bounded set too small`);
        break;
      case "MISSING_COEFFICIENT": coefficientInverseStates += 1; break;
      case "MISSING_MODULUS": modulusInverseStates += 1; break;
      case "GEOMETRIC_SUM_REMAINDER": structuredSumStates += 1; break;
      case "THREE_CONGRUENCE_COMPATIBLE":
        compatibleTripleStates += 1;
        if (Array.isArray(state.constraints)) {
          const constraints = state.constraints as Array<{ modulus: number }>;
          if (constraints.some((a, i) => constraints.some((b, j) => i < j && gcdLocal(a.modulus, b.modulus) > 1))) nonCoprimeTripleStates += 1;
        }
        break;
      case "THREE_CONGRUENCE_INCOMPATIBLE": incompatibleTripleStates += 1; break;
    }

    packages += 1;
  }
}

function gcdLocal(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

for (const prototypeId of NUM_CP008_WAVE02_PROTOTYPE_IDS) {
  assert(positions.get(prototypeId)!.size === 4, `${prototypeId}: all answer positions not reached`);
  assert(difficulties.get(prototypeId)!.size >= 2, `${prototypeId}: insufficient difficulty breadth`);
  assert(fingerprints.get(prototypeId)!.size >= 60, `${prototypeId}: insufficient mathematical-state breadth (${fingerprints.get(prototypeId)!.size})`);
}

assert(packages === 960, `Expected 960 packages, got ${packages}`);
assert(leastStates > 0 && greatestStates > 0, "Both extremum directions must occur");
assert(zeroResidueStates > 0, "Zero-residue bounded state missing");
assert(boundedSetStates === 120, `Bounded set states ${boundedSetStates}`);
assert(coefficientInverseStates === 120, `Coefficient inverse states ${coefficientInverseStates}`);
assert(modulusInverseStates === 120, `Modulus inverse states ${modulusInverseStates}`);
assert(structuredSumStates === 120, `Structured-sum states ${structuredSumStates}`);
assert(compatibleTripleStates === 120, `Compatible triple states ${compatibleTripleStates}`);
assert(incompatibleTripleStates === 120, `Incompatible triple states ${incompatibleTripleStates}`);
assert(nonCoprimeTripleStates > 0, "Non-coprime compatible triple systems missing");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE02_RUNTIME_AUTHORITY",
  prototypes: NUM_CP008_WAVE02_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  answerPositions: Object.fromEntries([...positions].map(([key, value]) => [key, [...value].sort()])),
  difficultyReach: Object.fromEntries([...difficulties].map(([key, value]) => [key, [...value].sort()])),
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
  edges: { leastStates, greatestStates, zeroResidueStates, boundedSetStates, coefficientInverseStates, modulusInverseStates, structuredSumStates, compatibleTripleStates, incompatibleTripleStates, nonCoprimeTripleStates },
  permanentQlCount: 0,
  questionStudioExposed: 0,
  questionBankWritable: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
