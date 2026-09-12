export type QuantDifficultyLabel = "Easy" | "Medium" | "Hard";
export type EmpiricalDifficultyState =
  | "INSUFFICIENT_EMPIRICAL_EVIDENCE"
  | "AMBIGUOUS_EMPIRICAL_SIGNAL"
  | "DATA_QUALITY_REVIEW_REQUIRED"
  | "EMPIRICAL_DIFFICULTY_CANDIDATE";

export interface EmpiricalDifficultyObservation {
  questionVersionId: string;
  learnerId: string;
  attemptId: string;
  examProfile: string;
  attemptType: "REAL" | "PRACTICE";
  isCorrect: boolean | null;
  timeSpentSeconds: number | null;
  attemptedAt: string;
  attemptScorePercent?: number | null;
}

export interface EmpiricalDifficultyPolicy {
  policyId: string;
  examProfile: string;
  minimumAttempts: number;
  minimumUniqueLearners: number;
  minimumTimedResponseRate: number;
  minimumQuestionSeconds: number;
  maximumQuestionSeconds: number;
  easyAccuracyFloor: number;
  hardAccuracyCeiling: number;
  easyTimeRatioCeiling: number;
  hardTimeRatioFloor: number;
  minimumAbilityObservationsForDiscrimination: number;
  minimumAcceptableDiscrimination: number;
  confidenceZ?: number;
}

export interface EmpiricalDifficultyCalibrationInput {
  questionVersionId: string;
  currentDifficulty: QuantDifficultyLabel | null;
  observations: readonly EmpiricalDifficultyObservation[];
  profileMedianTimeSeconds: number | null;
  policy: EmpiricalDifficultyPolicy;
}

export interface EmpiricalDifficultyCalibrationResult {
  authority: "QUANT_V4_EMPIRICAL_DIFFICULTY_CALIBRATION_P2";
  state: EmpiricalDifficultyState;
  questionVersionId: string;
  examProfile: string;
  policyId: string;
  currentDifficulty: QuantDifficultyLabel | null;
  suggestedDifficulty: QuantDifficultyLabel | null;
  labelChanged: boolean | null;
  eligibleAttempts: number;
  uniqueLearners: number;
  excludedPracticeAttempts: number;
  excludedInvalidResponses: number;
  duplicateLearnerObservationsRemoved: number;
  timedResponseRate: number;
  accuracy: number | null;
  accuracyConfidence95: { lower: number; upper: number } | null;
  medianTimeSeconds: number | null;
  profileMedianTimeSeconds: number | null;
  timeRatio: number | null;
  discriminationIndex: number | null;
  blockers: string[];
  diagnostics: string[];
}

function assertUnitInterval(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} must be between 0 and 1.`);
  }
}

export function validateEmpiricalDifficultyPolicy(policy: EmpiricalDifficultyPolicy): void {
  if (!policy.policyId.trim()) throw new Error("Difficulty policy requires policyId.");
  if (!policy.examProfile.trim()) throw new Error("Difficulty policy requires examProfile.");
  if (!Number.isInteger(policy.minimumAttempts) || policy.minimumAttempts < 1) {
    throw new Error("minimumAttempts must be a positive integer.");
  }
  if (!Number.isInteger(policy.minimumUniqueLearners) || policy.minimumUniqueLearners < 1) {
    throw new Error("minimumUniqueLearners must be a positive integer.");
  }
  assertUnitInterval(policy.minimumTimedResponseRate, "minimumTimedResponseRate");
  assertUnitInterval(policy.easyAccuracyFloor, "easyAccuracyFloor");
  assertUnitInterval(policy.hardAccuracyCeiling, "hardAccuracyCeiling");
  if (policy.hardAccuracyCeiling >= policy.easyAccuracyFloor) {
    throw new Error("hardAccuracyCeiling must remain below easyAccuracyFloor.");
  }
  if (!Number.isFinite(policy.minimumQuestionSeconds) || policy.minimumQuestionSeconds < 0) {
    throw new Error("minimumQuestionSeconds must be non-negative.");
  }
  if (!Number.isFinite(policy.maximumQuestionSeconds) || policy.maximumQuestionSeconds <= policy.minimumQuestionSeconds) {
    throw new Error("maximumQuestionSeconds must exceed minimumQuestionSeconds.");
  }
  if (!Number.isFinite(policy.easyTimeRatioCeiling) || policy.easyTimeRatioCeiling <= 0) {
    throw new Error("easyTimeRatioCeiling must be positive.");
  }
  if (!Number.isFinite(policy.hardTimeRatioFloor) || policy.hardTimeRatioFloor < policy.easyTimeRatioCeiling) {
    throw new Error("hardTimeRatioFloor must be >= easyTimeRatioCeiling.");
  }
  if (!Number.isInteger(policy.minimumAbilityObservationsForDiscrimination) || policy.minimumAbilityObservationsForDiscrimination < 0) {
    throw new Error("minimumAbilityObservationsForDiscrimination must be a non-negative integer.");
  }
  if (!Number.isFinite(policy.minimumAcceptableDiscrimination) || policy.minimumAcceptableDiscrimination < -1 || policy.minimumAcceptableDiscrimination > 1) {
    throw new Error("minimumAcceptableDiscrimination must be between -1 and 1.");
  }
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function round(value: number, digits = 4): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function wilsonInterval(successes: number, total: number, z: number): { lower: number; upper: number } | null {
  if (total <= 0) return null;
  const p = successes / total;
  const z2 = z * z;
  const denominator = 1 + z2 / total;
  const centre = (p + z2 / (2 * total)) / denominator;
  const margin = (z / denominator) * Math.sqrt((p * (1 - p)) / total + z2 / (4 * total * total));
  return {
    lower: round(Math.max(0, centre - margin)),
    upper: round(Math.min(1, centre + margin)),
  };
}

function validTimestamp(value: string): number {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : Number.MAX_SAFE_INTEGER;
}

function dedupeFirstObservationPerLearner(
  observations: readonly EmpiricalDifficultyObservation[],
): { observations: EmpiricalDifficultyObservation[]; removed: number } {
  const sorted = [...observations].sort((a, b) => {
    const byTime = validTimestamp(a.attemptedAt) - validTimestamp(b.attemptedAt);
    if (byTime !== 0) return byTime;
    return a.attemptId.localeCompare(b.attemptId);
  });
  const seen = new Set<string>();
  const deduped: EmpiricalDifficultyObservation[] = [];
  let removed = 0;
  for (const observation of sorted) {
    if (seen.has(observation.learnerId)) {
      removed += 1;
      continue;
    }
    seen.add(observation.learnerId);
    deduped.push(observation);
  }
  return { observations: deduped, removed };
}

function discriminationIndex(observations: readonly EmpiricalDifficultyObservation[], minimumAbilityObservations: number): number | null {
  const abilityObservations = observations
    .filter((observation) => Number.isFinite(observation.attemptScorePercent) && observation.isCorrect !== null)
    .sort((a, b) => Number(a.attemptScorePercent) - Number(b.attemptScorePercent));
  if (abilityObservations.length < minimumAbilityObservations || abilityObservations.length < 4) return null;
  const groupSize = Math.max(1, Math.floor(abilityObservations.length * 0.27));
  const bottom = abilityObservations.slice(0, groupSize);
  const top = abilityObservations.slice(-groupSize);
  const rate = (group: readonly EmpiricalDifficultyObservation[]) =>
    group.filter((observation) => observation.isCorrect === true).length / group.length;
  return round(rate(top) - rate(bottom));
}

export function calibrateEmpiricalDifficulty(
  input: EmpiricalDifficultyCalibrationInput,
): EmpiricalDifficultyCalibrationResult {
  validateEmpiricalDifficultyPolicy(input.policy);
  const blockers: string[] = [];
  const diagnostics: string[] = [];

  const matching = input.observations.filter((observation) =>
    observation.questionVersionId === input.questionVersionId && observation.examProfile === input.policy.examProfile,
  );
  const excludedPracticeAttempts = matching.filter((observation) => observation.attemptType === "PRACTICE").length;
  const real = matching.filter((observation) => observation.attemptType === "REAL");
  const valid = real.filter((observation) => observation.isCorrect !== null && Boolean(observation.learnerId) && Boolean(observation.attemptId));
  const excludedInvalidResponses = real.length - valid.length;
  const deduped = dedupeFirstObservationPerLearner(valid);
  const eligible = deduped.observations;

  if (eligible.length < input.policy.minimumAttempts) blockers.push("INSUFFICIENT_REAL_ATTEMPTS");
  const uniqueLearners = new Set(eligible.map((observation) => observation.learnerId)).size;
  if (uniqueLearners < input.policy.minimumUniqueLearners) blockers.push("INSUFFICIENT_UNIQUE_LEARNERS");

  const timed = eligible.filter((observation) =>
    Number.isFinite(observation.timeSpentSeconds)
    && Number(observation.timeSpentSeconds) >= input.policy.minimumQuestionSeconds
    && Number(observation.timeSpentSeconds) <= input.policy.maximumQuestionSeconds,
  );
  const timedResponseRate = eligible.length === 0 ? 0 : timed.length / eligible.length;
  if (timedResponseRate < input.policy.minimumTimedResponseRate) blockers.push("INSUFFICIENT_TIMING_COVERAGE");

  const successes = eligible.filter((observation) => observation.isCorrect === true).length;
  const accuracy = eligible.length === 0 ? null : successes / eligible.length;
  const confidence = wilsonInterval(successes, eligible.length, input.policy.confidenceZ ?? 1.96);
  const medianTimeSeconds = median(timed.map((observation) => Number(observation.timeSpentSeconds)));

  let timeRatio: number | null = null;
  if (input.profileMedianTimeSeconds == null || !Number.isFinite(input.profileMedianTimeSeconds) || input.profileMedianTimeSeconds <= 0) {
    blockers.push("PROFILE_TIME_BASELINE_MISSING");
  } else if (medianTimeSeconds != null) {
    timeRatio = medianTimeSeconds / input.profileMedianTimeSeconds;
  }

  const discrimination = discriminationIndex(eligible, input.policy.minimumAbilityObservationsForDiscrimination);
  if (discrimination == null) {
    diagnostics.push("DISCRIMINATION_SIGNAL_UNAVAILABLE");
  } else if (discrimination < input.policy.minimumAcceptableDiscrimination) {
    blockers.push("SUSPECT_NEGATIVE_DISCRIMINATION");
  }

  let suggestedDifficulty: QuantDifficultyLabel | null = null;
  if (blockers.length === 0 && confidence && timeRatio != null) {
    const easySignal = confidence.lower >= input.policy.easyAccuracyFloor
      && timeRatio <= input.policy.easyTimeRatioCeiling;
    const hardSignal = confidence.upper <= input.policy.hardAccuracyCeiling
      && timeRatio >= input.policy.hardTimeRatioFloor;
    const mediumSignal = confidence.lower > input.policy.hardAccuracyCeiling
      && confidence.upper < input.policy.easyAccuracyFloor
      && timeRatio > input.policy.easyTimeRatioCeiling
      && timeRatio < input.policy.hardTimeRatioFloor;

    if (easySignal) suggestedDifficulty = "Easy";
    else if (hardSignal) suggestedDifficulty = "Hard";
    else if (mediumSignal) suggestedDifficulty = "Medium";
    else blockers.push("AMBIGUOUS_ACCURACY_TIME_SIGNAL");
  }

  let state: EmpiricalDifficultyState;
  if (blockers.includes("SUSPECT_NEGATIVE_DISCRIMINATION")) state = "DATA_QUALITY_REVIEW_REQUIRED";
  else if (blockers.includes("AMBIGUOUS_ACCURACY_TIME_SIGNAL")) state = "AMBIGUOUS_EMPIRICAL_SIGNAL";
  else if (blockers.length > 0) state = "INSUFFICIENT_EMPIRICAL_EVIDENCE";
  else state = "EMPIRICAL_DIFFICULTY_CANDIDATE";

  if (excludedPracticeAttempts > 0) diagnostics.push("PRACTICE_ATTEMPTS_EXCLUDED");
  if (excludedInvalidResponses > 0) diagnostics.push("INVALID_OR_UNANSWERED_RESPONSES_EXCLUDED");
  if (deduped.removed > 0) diagnostics.push("REPEAT_LEARNER_OBSERVATIONS_DEDUPED");

  return {
    authority: "QUANT_V4_EMPIRICAL_DIFFICULTY_CALIBRATION_P2",
    state,
    questionVersionId: input.questionVersionId,
    examProfile: input.policy.examProfile,
    policyId: input.policy.policyId,
    currentDifficulty: input.currentDifficulty,
    suggestedDifficulty,
    labelChanged: suggestedDifficulty == null || input.currentDifficulty == null
      ? null
      : suggestedDifficulty !== input.currentDifficulty,
    eligibleAttempts: eligible.length,
    uniqueLearners,
    excludedPracticeAttempts,
    excludedInvalidResponses,
    duplicateLearnerObservationsRemoved: deduped.removed,
    timedResponseRate: round(timedResponseRate),
    accuracy: accuracy == null ? null : round(accuracy),
    accuracyConfidence95: confidence,
    medianTimeSeconds: medianTimeSeconds == null ? null : round(medianTimeSeconds, 2),
    profileMedianTimeSeconds: input.profileMedianTimeSeconds,
    timeRatio: timeRatio == null ? null : round(timeRatio),
    discriminationIndex: discrimination,
    blockers,
    diagnostics,
  };
}
