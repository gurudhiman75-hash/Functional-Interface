export type StudentSeriesProgressionMode = "open" | "sequential" | "score_gated";

export interface StudentSeriesAttemptSummary {
  testId: string;
  attemptCount: number;
  bestScore: number | null;
  lastAttemptAt: string | null;
}

export interface StudentSeriesMemberInput {
  id: string;
  testId: string;
  sortOrder: number;
  unlockAt: string | null;
  minimumScore: number | null;
  isRequired: boolean;
  testStatus: string;
}

export interface StudentSeriesEligibilityInput {
  now?: string | Date;
  deletedAt?: string | null;
  availabilityStartAt?: string | null;
  availabilityEndAt?: string | null;
  progressionMode: StudentSeriesProgressionMode;
  completionThreshold: number | null;
  members: StudentSeriesMemberInput[];
  attempts: StudentSeriesAttemptSummary[];
}

export interface StudentSeriesMemberEligibility extends StudentSeriesMemberInput {
  attemptCount: number;
  bestScore: number | null;
  lastAttemptAt: string | null;
  completed: boolean;
  scoreRequirement: number | null;
  scoreRequirementMet: boolean;
  unlocked: boolean;
  lockCode: string | null;
  lockReason: string | null;
}

export interface StudentSeriesEligibility {
  available: boolean;
  availabilityCode: string | null;
  availabilityReason: string | null;
  completedRequiredCount: number;
  requiredCount: number;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  nextTestId: string | null;
  members: StudentSeriesMemberEligibility[];
}

function timestamp(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const result = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(result) ? result : null;
}

function requirementForMember(
  member: StudentSeriesMemberInput,
  mode: StudentSeriesProgressionMode,
  completionThreshold: number | null,
): number | null {
  if (member.minimumScore != null) return member.minimumScore;
  return mode === "score_gated" ? completionThreshold : null;
}

export function evaluateStudentSeriesEligibility(input: StudentSeriesEligibilityInput): StudentSeriesEligibility {
  const now = timestamp(input.now ?? new Date()) ?? Date.now();
  const startAt = timestamp(input.availabilityStartAt);
  const endAt = timestamp(input.availabilityEndAt);
  let availabilityCode: string | null = null;
  let availabilityReason: string | null = null;

  if (input.deletedAt) {
    availabilityCode = "SERIES_ARCHIVED";
    availabilityReason = "This test series is no longer available.";
  } else if (startAt != null && startAt > now) {
    availabilityCode = "SERIES_NOT_STARTED";
    availabilityReason = "This test series has not opened yet.";
  } else if (endAt != null && endAt <= now) {
    availabilityCode = "SERIES_ENDED";
    availabilityReason = "This test series is no longer accepting attempts.";
  }

  const available = availabilityCode == null;
  const attemptsByTest = new Map(input.attempts.map((attempt) => [attempt.testId, attempt]));
  const orderedMembers = [...input.members].sort((left, right) => left.sortOrder - right.sortOrder);
  const evaluated: StudentSeriesMemberEligibility[] = [];

  for (const member of orderedMembers) {
    const attempt = attemptsByTest.get(member.testId);
    const attemptCount = Math.max(0, Number(attempt?.attemptCount ?? 0));
    const bestScore = attempt?.bestScore == null ? null : Number(attempt.bestScore);
    const completed = attemptCount > 0;
    const scoreRequirement = requirementForMember(member, input.progressionMode, input.completionThreshold);
    const scoreRequirementMet = scoreRequirement == null || (bestScore != null && bestScore >= scoreRequirement);
    const unlockAt = timestamp(member.unlockAt);
    const live = member.testStatus === "live";

    let lockCode: string | null = null;
    let lockReason: string | null = null;
    if (!available) {
      lockCode = availabilityCode;
      lockReason = availabilityReason;
    } else if (!live) {
      lockCode = "TEST_NOT_LIVE";
      lockReason = "This test has not been released yet.";
    } else if (unlockAt != null && unlockAt > now) {
      lockCode = "TEST_NOT_RELEASED";
      lockReason = "This test will unlock at its scheduled release time.";
    } else if (input.progressionMode !== "open") {
      const previousRequired = [...evaluated].reverse().find((item) => item.isRequired);
      if (previousRequired && !previousRequired.completed) {
        lockCode = "PREVIOUS_TEST_INCOMPLETE";
        lockReason = "Complete the previous required test to unlock this one.";
      } else if (
        input.progressionMode === "score_gated"
        && previousRequired
        && !previousRequired.scoreRequirementMet
      ) {
        lockCode = "PREVIOUS_SCORE_TOO_LOW";
        lockReason = `Score at least ${previousRequired.scoreRequirement}% in the previous required test to unlock this one.`;
      }
    }

    evaluated.push({
      ...member,
      attemptCount,
      bestScore,
      lastAttemptAt: attempt?.lastAttemptAt ?? null,
      completed,
      scoreRequirement,
      scoreRequirementMet,
      unlocked: lockCode == null,
      lockCode,
      lockReason,
    });
  }

  const requiredMembers = evaluated.filter((member) => member.isRequired);
  const completedRequiredCount = requiredMembers.filter((member) => member.completed).length;
  const completedCount = evaluated.filter((member) => member.completed).length;
  const requiredCount = requiredMembers.length;
  const progressPercent = requiredCount > 0
    ? Math.round((completedRequiredCount / requiredCount) * 100)
    : 0;
  const next = evaluated.find((member) => member.unlocked && !member.completed)
    ?? evaluated.find((member) => member.unlocked)
    ?? null;

  return {
    available,
    availabilityCode,
    availabilityReason,
    completedRequiredCount,
    requiredCount,
    completedCount,
    totalCount: evaluated.length,
    progressPercent,
    nextTestId: next?.testId ?? null,
    members: evaluated,
  };
}

export function assertSeriesTestAccess(
  eligibility: StudentSeriesEligibility,
  testId: string,
): StudentSeriesMemberEligibility {
  const member = eligibility.members.find((entry) => entry.testId === testId);
  if (!member) {
    throw Object.assign(new Error("This test does not belong to the selected series."), {
      code: "SERIES_TEST_NOT_FOUND",
      statusCode: 404,
    });
  }
  if (!member.unlocked) {
    throw Object.assign(new Error(member.lockReason ?? "This test is locked."), {
      code: member.lockCode ?? "SERIES_TEST_LOCKED",
      statusCode: 403,
    });
  }
  return member;
}
