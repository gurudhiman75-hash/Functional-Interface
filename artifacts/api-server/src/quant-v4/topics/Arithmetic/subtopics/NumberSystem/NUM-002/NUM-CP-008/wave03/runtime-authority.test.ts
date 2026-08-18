import { NUM_CP008_WAVE03_PROTOTYPE_IDS } from "./types.ts";
import { generateNumCp008Wave03 } from "./runtime.ts";

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
const modeCounts = new Map<string, number>();
const statementAnswers = new Set<string>();
const dsAnswers = new Set<string>();
let repeatedNumeralStates = 0;
let boundedTripleStates = 0;
let sameDifferentStates = 0;

for (const prototypeId of NUM_CP008_WAVE03_PROTOTYPE_IDS) {
  positions.set(prototypeId, new Set());
  difficulties.set(prototypeId, new Set());
  fingerprints.set(prototypeId, new Set());

  for (let seed = 1; seed <= 120; seed += 1) {
    const q = generateNumCp008Wave03(prototypeId, seed);
    const replay = generateNumCp008Wave03(prototypeId, seed);
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
    const mode = String(state.mode ?? "UNKNOWN");
    modeCounts.set(mode, (modeCounts.get(mode) ?? 0) + 1);
    if (mode === "MODULAR_STATEMENT_COMBINATION") statementAnswers.add(q.canonicalAnswer);
    if (mode === "MODULAR_DATA_SUFFICIENCY") dsAnswers.add(q.canonicalAnswer);
    if (mode === "REPEATED_NUMERAL_RECURRENCE") repeatedNumeralStates += 1;
    if (mode === "BOUNDED_TRIPLE_SYSTEM_COUNT") boundedTripleStates += 1;
    if (mode === "SAME_AND_DIFFERENT_REMAINDER_SYSTEM") sameDifferentStates += 1;

    packages += 1;
  }
}

for (const prototypeId of NUM_CP008_WAVE03_PROTOTYPE_IDS) {
  assert(positions.get(prototypeId)!.size === 4, `${prototypeId}: all answer positions not reached`);
  assert(difficulties.get(prototypeId)!.size >= 2, `${prototypeId}: insufficient difficulty breadth`);
  assert(fingerprints.get(prototypeId)!.size >= 60, `${prototypeId}: insufficient mathematical-state breadth (${fingerprints.get(prototypeId)!.size})`);
}

assert(packages === 960, `Expected 960 packages, got ${packages}`);
assert(modeCounts.size === 8, `Expected eight Wave03 modes, got ${modeCounts.size}`);
for (const [mode, count] of modeCounts) assert(count === 120, `${mode}: expected 120 states, got ${count}`);
assert(statementAnswers.size === 4, `Statement-combination answer breadth ${statementAnswers.size}`);
assert(dsAnswers.size === 4, `Data Sufficiency answer breadth ${dsAnswers.size}`);
assert(repeatedNumeralStates === 120, `Repeated numeral states ${repeatedNumeralStates}`);
assert(boundedTripleStates === 120, `Bounded triple states ${boundedTripleStates}`);
assert(sameDifferentStates === 120, `Same/different remainder states ${sameDifferentStates}`);

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_WAVE03_RUNTIME_AUTHORITY",
  prototypes: NUM_CP008_WAVE03_PROTOTYPE_IDS.length,
  packages,
  replayChecks,
  verifierChecks,
  optionChecks,
  lifecycleChecks,
  answerPositions: Object.fromEntries([...positions].map(([key, value]) => [key, [...value].sort()])),
  difficultyReach: Object.fromEntries([...difficulties].map(([key, value]) => [key, [...value].sort()])),
  distinctFingerprints: Object.fromEntries([...fingerprints].map(([key, value]) => [key, value.size])),
  modeCounts: Object.fromEntries(modeCounts),
  statementAnswerClasses: [...statementAnswers].sort(),
  dataSufficiencyClasses: [...dsAnswers].sort(),
  permanentQlCount: 0,
  nextAvailableQl: "NUM-QL-166",
  questionStudioExposed: 0,
  questionBankWritable: 0,
  testEligible: 0,
  publiclyPublishable: 0,
}, null, 2));
