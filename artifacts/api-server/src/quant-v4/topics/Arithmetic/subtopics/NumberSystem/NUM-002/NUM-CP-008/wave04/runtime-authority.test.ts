import { NUM_CP008_WAVE04_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave04 } from "./runtime.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const positions = new Map<string, Set<number>>();
const difficulties = new Map<string, Set<string>>();
const fingerprints = new Map<string, Set<string>>();
const solutionClasses = new Set<string>();
let packages = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let minimumLengthChecks = 0;
let concatenationChecks = 0;
let greatestBoundChecks = 0;
let residueOptionRangeChecks = 0;
let boundedOptionRangeChecks = 0;

for (const prototypeId of NUM_CP008_WAVE04_PROTOTYPE_IDS) {
  positions.set(prototypeId, new Set());
  difficulties.set(prototypeId, new Set());
  fingerprints.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp008Wave04(prototypeId, seed);
    const replay = generateNumCp008Wave04(prototypeId, seed);
    const label = `${prototypeId}/${seed}`;

    assert(JSON.stringify(q) === JSON.stringify(replay), `${label}: deterministic replay failed`);
    replayChecks += 1;
    assert(q.seed === seed, `${label}: seed drift`);
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

    assert(q.explanation.steps.length >= 2, `${label}: explanation too shallow`);
    assert(q.explanation.finalAnswer === q.canonicalAnswer, `${label}: explanation answer drift`);
    assert(q.sourceAncestry.length >= 4, `${label}: source ancestry incomplete`);

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
    if (prototypeId === "NUM-CP008-PROT-025") {
      assert(Number(state.answer) >= 2, `${label}: trivial minimum length`);
      const residues = state.residues as number[];
      assert(residues[residues.length - 1] === 0, `${label}: final recurrence residue not zero`);
      assert(residues.slice(0, -1).every((value) => value !== 0), `${label}: minimum length not proven`);
      assert(residues.length <= 12, `${label}: learner recurrence trail too long (${residues.length})`);
      minimumLengthChecks += 1;
    }
    if (prototypeId === "NUM-CP008-PROT-026") {
      assert((state.residues as number[]).length === Number(state.repeats), `${label}: block recurrence length drift`);
      const modulus = Number(state.modulus);
      for (const option of q.options) {
        const value = Number(option.value);
        assert(Number.isSafeInteger(value) && value >= 0 && value < modulus, `${label}: residue option ${option.value} outside [0, ${modulus - 1}]`);
        residueOptionRangeChecks += 1;
      }
      concatenationChecks += 1;
    }
    if (prototypeId === "NUM-CP008-PROT-027") {
      const upper = Number(state.upper);
      assert(Number(state.answer) <= upper, `${label}: greatest answer exceeds bound`);
      assert(Number(state.answer) + Number(state.period) > upper, `${label}: answer is not greatest`);
      for (const option of q.options) {
        const value = Number(option.value);
        assert(Number.isSafeInteger(value) && value >= 1 && value <= upper, `${label}: bounded option ${option.value} outside [1, ${upper}]`);
        boundedOptionRangeChecks += 1;
      }
      greatestBoundChecks += 1;
    }
    if (prototypeId === "NUM-CP008-PROT-028") solutionClasses.add(q.canonicalAnswer);

    packages += 1;
  }
}

for (const prototypeId of NUM_CP008_WAVE04_PROTOTYPE_IDS) {
  assert(positions.get(prototypeId)!.size === 4, `${prototypeId}: all answer positions not reached`);
  assert(difficulties.get(prototypeId)!.size >= 2, `${prototypeId}: insufficient difficulty breadth`);
  assert(fingerprints.get(prototypeId)!.size >= 40, `${prototypeId}: insufficient state breadth (${fingerprints.get(prototypeId)!.size})`);
}

assert(packages === 480, `Expected 480 packages, got ${packages}`);
assert(solutionClasses.size === 3, `Expected no/one/many bounded classes, got ${solutionClasses.size}`);
assert(minimumLengthChecks === 120, `Minimum-length checks ${minimumLengthChecks}`);
assert(concatenationChecks === 120, `Concatenation checks ${concatenationChecks}`);
assert(greatestBoundChecks === 120, `Greatest-bound checks ${greatestBoundChecks}`);
assert(residueOptionRangeChecks === 480, `Residue option range checks ${residueOptionRangeChecks}`);
assert(boundedOptionRangeChecks === 480, `Bounded option range checks ${boundedOptionRangeChecks}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE04_RUNTIME_AUTHORITY",
  prototypes: NUM_CP008_WAVE04_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  minimumLengthChecks,
  concatenationChecks,
  greatestBoundChecks,
  residueOptionRangeChecks,
  boundedOptionRangeChecks,
  boundedSolutionClasses: [...solutionClasses].sort(),
  answerPositions: Object.fromEntries([...positions].map(([key, value]) => [key, [...value].sort()])),
  difficultyReach: Object.fromEntries([...difficulties].map(([key, value]) => [key, [...value].sort()])),
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
  questionStudioExposed: 0,
  questionBankWritable: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));