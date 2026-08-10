import { equals } from "../foundation/rational";
import { TSD_CP003_LEARNER_AUTHORITIES, type TsdCp003DiscoveryAuthority } from "./discovery-registry";
import { formatSolvedValue } from "./generation-support";
import { generateCp003Candidate, stableCp003Stringify } from "./runtime";
import { verifyCp003 } from "./verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function generateWithFailureContext(authority: TsdCp003DiscoveryAuthority, seed: string, index: number) {
  try {
    return generateCp003Candidate(authority.provisionalId, seed);
  } catch (error) {
    console.log(JSON.stringify({
      status: "FAIL",
      phase: "TSD_CP003_DETERMINISTIC_LEARNER_RUNTIME",
      solveMode: authority.solveMode,
      provisionalId: authority.provisionalId,
      seedIndex: index,
      seed,
      error: error instanceof Error ? error.message : String(error),
    }, null, 2));
    throw error;
  }
}

const seedsPerAuthority = 40;
const answerPositions = [0, 0, 0, 0];
let candidateCount = 0;
let wrongWorkingsChecked = 0;
const representationCoverage = new Map<string, Set<string>>();

for (const authority of TSD_CP003_LEARNER_AUTHORITIES) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const positions = new Set<number>();
  const representations = new Set<string>();

  for (let index = 0; index < seedsPerAuthority; index += 1) {
    const seed = `runtime-proof:${authority.provisionalId}:${index}`;
    const first = generateWithFailureContext(authority, seed, index);
    const second = generateWithFailureContext(authority, seed, index);

    assert(stableCp003Stringify(first) === stableCp003Stringify(second), `${authority.solveMode}:${index}: deterministic replay failed`);
    assert(first.validation.valid, `${authority.solveMode}:${index}: ${first.validation.errors.join("; ")}`);
    assert(first.validation.warnings.length === 0, `${authority.solveMode}:${index}: unexpected runtime warning`);
    assert(verifyCp003(first.input, first.solution).valid, `${authority.solveMode}:${index}: independent verifier rejected runtime answer`);
    assert(first.options.length === 4 && new Set(first.options).size === 4, `${authority.solveMode}:${index}: option uniqueness failed`);
    assert(first.answerText === first.options[first.correctIndex], `${authority.solveMode}:${index}: answer key mismatch`);
    assert(first.optionAudit.filter((option) => option.isCorrect).length === 1, `${authority.solveMode}:${index}: correct option count failed`);
    assert(first.optionAudit.filter((option) => !option.isCorrect).length === 3, `${authority.solveMode}:${index}: wrong option count failed`);
    assert(first.explanation.stepByStepSolution.length === 6, `${authority.solveMode}:${index}: explanation is not six-step`);
    assert(first.explanation.optionAnalysis.length === 4, `${authority.solveMode}:${index}: option analysis incomplete`);
    assert(first.permanentQlId === null, `${authority.solveMode}:${index}: permanent QL allocated during discovery`);
    assert(first.lifecycle.englishFreezeStatus === "UNFROZEN", `${authority.solveMode}:${index}: English frozen during discovery`);
    assert(first.lifecycle.questionBankStatus === "NOT_STORED", `${authority.solveMode}:${index}: Question Bank write enabled`);
    assert(first.lifecycle.testEligibility === "INELIGIBLE", `${authority.solveMode}:${index}: test eligibility enabled`);
    assert(!first.publiclyPublishable, `${authority.solveMode}:${index}: public delivery enabled`);
    assert(first.difficulty.status === "EDITORIAL_CALIBRATION_REQUIRED", `${authority.solveMode}:${index}: difficulty was prematurely finalized`);

    for (let optionIndex = 0; optionIndex < first.optionAudit.length; optionIndex += 1) {
      const audit = first.optionAudit[optionIndex];
      const analysis = first.explanation.optionAnalysis[optionIndex];
      assert(audit.text === first.options[optionIndex], `${authority.solveMode}:${index}: audit text mismatch`);
      assert(analysis.text === first.options[optionIndex], `${authority.solveMode}:${index}: analysis text mismatch`);
      assert(analysis.misconceptionId === audit.misconceptionId, `${authority.solveMode}:${index}: misconception alignment failed`);
      assert(analysis.reason.includes(analysis.text), `${authority.solveMode}:${index}: option explanation does not name selected value`);
      if (!audit.isCorrect) {
        assert(audit.wrongWorking !== null, `${authority.solveMode}:${index}: wrong option lacks structured wrong working`);
        assert(audit.applicability === "EXACT_METHOD", `${authority.solveMode}:${index}: wrong option is not marked as exact-method derived`);
        assert(!equals(audit.wrongWorking!.value, first.solution.answer), `${authority.solveMode}:${index}: wrong working reproduces the correct answer`);
        assert(formatSolvedValue(audit.wrongWorking!.value, first.solution.unit) === audit.text, `${authority.solveMode}:${index}: wrong-working value does not reproduce displayed option`);
        assert(analysis.reason.includes(audit.wrongWorking!.calculation), `${authority.solveMode}:${index}: wrong calculation is absent from learner feedback`);
        assert(/=/.test(analysis.reason), `${authority.solveMode}:${index}: wrong-option explanation has no explicit numerical/result check`);
        wrongWorkingsChecked += 1;
      }
    }

    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    positions.add(first.correctIndex);
    representations.add(first.representation);
    answerPositions[first.correctIndex] += 1;
    candidateCount += 1;
  }

  assert(stems.size >= 3, `${authority.solveMode}: fewer than three distinct stems across ${seedsPerAuthority} seeds`);
  assert(fingerprints.size >= 3, `${authority.solveMode}: fewer than three mathematical states across ${seedsPerAuthority} seeds`);
  assert(positions.size === 4, `${authority.solveMode}: not all four answer positions were reached`);
  representationCoverage.set(authority.solveMode, representations);
}

assert(candidateCount === 22 * seedsPerAuthority, `Unexpected runtime candidate count: ${candidateCount}`);
assert(wrongWorkingsChecked === candidateCount * 3, `Expected three independently reproducible wrong workings per question, got ${wrongWorkingsChecked}`);
assert(answerPositions.join(",") === "220,220,220,220", `Answer positions are not exactly balanced: ${answerPositions.join(",")}`);

const requireRepresentation = (mode: string, value: string): void => {
  assert(representationCoverage.get(mode)?.has(value), `${mode}: missing representation ${value}`);
};

requireRepresentation("timeGainLossFromSpeedChange", "FASTER_TIME_SAVED");
requireRepresentation("timeGainLossFromSpeedChange", "SLOWER_DELAY");
requireRepresentation("speedFromFixedRouteTimeDifference", "KNOWN_OTHER_SPEED_SLOWER");
requireRepresentation("speedFromFixedRouteTimeDifference", "KNOWN_OTHER_SPEED_FASTER");
requireRepresentation("speedFromFixedRouteTimeDifference", "SPEED_RATIO_SLOWER");
requireRepresentation("speedFromFixedRouteTimeDifference", "SPEED_RATIO_FASTER");
requireRepresentation("scheduledArrivalTimeFromActualSpeed", "SAME_DAY_ARRIVAL");
requireRepresentation("scheduledArrivalTimeFromActualSpeed", "NEXT_DAY_ARRIVAL");
requireRepresentation("requiredRemainingSpeedAfterPartialRoute", "SLOW_INITIAL_SEGMENT");
requireRepresentation("requiredRemainingSpeedAfterPartialRoute", "FAST_INITIAL_SEGMENT");
requireRepresentation("totalTimeWithRegularStops", "FIXED_DISTANCE_STOP_PATTERN");
requireRepresentation("totalTimeWithRegularStops", "FIXED_TIME_STOP_PATTERN");
requireRepresentation("lostTimeDurationFromScheduleRecovery", "BREAKDOWN_DELAY");
requireRepresentation("lostTimeDurationFromScheduleRecovery", "REPAIR_TIME_FROM_RECOVERY");
requireRepresentation("startTimeShiftForSameArrival", "LATER_START_SAME_ARRIVAL");
requireRepresentation("startTimeShiftForSameArrival", "EARLIER_START_SAME_ARRIVAL");
for (const target of ["WALKING_TIME", "RIDING_TIME", "WALKING_DISTANCE", "RIDING_DISTANCE"] as const) {
  requireRepresentation("walkingRidingAllocation", `WALK_RIDE_${target}`);
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP003_DETERMINISTIC_LEARNER_RUNTIME",
  learnerAuthorities: TSD_CP003_LEARNER_AUTHORITIES.length,
  seedsPerAuthority,
  candidateCount,
  wrongWorkingsChecked,
  answerPositions,
  sourceRepresentationGuards: 20,
  permanentQlCount: 0,
  englishFreezeStatus: "UNFROZEN",
  difficultyStatus: "EDITORIAL_CALIBRATION_REQUIRED",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
