export type CurrentAffairsOpsColor = "green" | "amber" | "red";

export type CurrentAffairsFamilyOpsInput = {
  family: "ssc" | "banking" | "punjab";
  englishDraftPresent: boolean;
  hindiDraftPresent: boolean;
  punjabiDraftPresent: boolean;
  eventCount: number;
  approvedEnglishQuestions: number;
  totalEnglishQuestions: number;
  releaseReady: boolean;
  approvedRelease: boolean;
  learnerQuizPublished: boolean;
};

export type CurrentAffairsProductionReadinessInput = {
  now: Date;
  targetDate: string;
  deadlineIso: string;
  scheduledPrimarySources: number;
  freshSuccessfulPrimarySources: number;
  failingPrimarySources: number;
  stalePrimarySources: number;
  criticalSourceFailures: number;
  latestFeedRunAt?: string | null;
  latestIntelligenceRunAt?: string | null;
  queuedCandidates: number;
  openConflicts: number;
  families: CurrentAffairsFamilyOpsInput[];
};

export type CurrentAffairsProductionReadiness = {
  color: CurrentAffairsOpsColor;
  learnerReady: boolean;
  draftReady: boolean;
  releaseReady: boolean;
  sourceCoveragePercent: number;
  blockers: string[];
  warnings: string[];
  checks: {
    sourceCoverageHealthy: boolean;
    criticalSourcesHealthy: boolean;
    feedFresh: boolean;
    intelligenceFresh: boolean;
    queueHealthy: boolean;
    conflictFree: boolean;
    allEnglishDrafts: boolean;
    allLocalizedDrafts: boolean;
    allQuestionReviewsComplete: boolean;
    allReleaseReady: boolean;
    allReleased: boolean;
    allLearnerQuizzesPublished: boolean;
    deadlinePassed: boolean;
  };
};

function ageHours(now: Date, value?: string | null): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return Number.POSITIVE_INFINITY;
  return Math.max(0, (now.getTime() - parsed.getTime()) / 3_600_000);
}

export function evaluateCurrentAffairsProductionReadiness(
  input: CurrentAffairsProductionReadinessInput,
): CurrentAffairsProductionReadiness {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const sourceCoveragePercent = input.scheduledPrimarySources > 0
    ? Math.round((input.freshSuccessfulPrimarySources / input.scheduledPrimarySources) * 100)
    : 0;
  const sourceCoverageHealthy = input.scheduledPrimarySources > 0 && sourceCoveragePercent >= 80;
  const criticalSourcesHealthy = input.criticalSourceFailures === 0;
  const feedFresh = ageHours(input.now, input.latestFeedRunAt) <= 4;
  const intelligenceFresh = ageHours(input.now, input.latestIntelligenceRunAt) <= 4;
  const queueHealthy = input.queuedCandidates <= 250;
  const conflictFree = input.openConflicts === 0;
  const allEnglishDrafts = input.families.length === 3 && input.families.every((item) => item.englishDraftPresent);
  const allLocalizedDrafts = input.families.length === 3 && input.families.every((item) => item.hindiDraftPresent && item.punjabiDraftPresent);
  const allQuestionReviewsComplete = input.families.length === 3 && input.families.every((item) =>
    item.totalEnglishQuestions === 0 || item.approvedEnglishQuestions === item.totalEnglishQuestions);
  const allReleaseReady = input.families.length === 3 && input.families.every((item) => item.releaseReady || item.approvedRelease);
  const allReleased = input.families.length === 3 && input.families.every((item) => item.approvedRelease);
  const allLearnerQuizzesPublished = input.families.length === 3 && input.families.every((item) =>
    item.totalEnglishQuestions === 0 || item.learnerQuizPublished);
  const deadline = new Date(input.deadlineIso);
  const deadlinePassed = !Number.isNaN(deadline.getTime()) && input.now.getTime() >= deadline.getTime();

  if (!sourceCoverageHealthy) blockers.push(`Primary-source polling coverage is ${sourceCoveragePercent}%; at least 80% is required`);
  if (!criticalSourcesHealthy) blockers.push(`${input.criticalSourceFailures} critical primary source(s) are failing or stale`);
  if (!feedFresh) blockers.push("Feed/listing ingestion has not completed successfully within four hours");
  if (!intelligenceFresh) blockers.push("Intelligence processing has not completed successfully within four hours");
  if (!queueHealthy) warnings.push(`Discovery queue has ${input.queuedCandidates} candidates; investigate backlog before it exceeds the operating envelope`);
  if (!conflictFree) blockers.push(`${input.openConflicts} open factual conflict(s) require editorial resolution`);
  if (!allEnglishDrafts) (deadlinePassed ? blockers : warnings).push(`English daily packs for ${input.targetDate} are incomplete`);
  if (allEnglishDrafts && !allLocalizedDrafts) warnings.push("Hindi/Punjabi daily pack parity is incomplete");
  if (allLocalizedDrafts && !allQuestionReviewsComplete) warnings.push("Current Affairs question editorial review is incomplete");
  if (allQuestionReviewsComplete && !allReleaseReady) warnings.push("Daily packs are not yet release-ready");
  if (allReleaseReady && !allReleased) warnings.push("Daily packs are ready but still require explicit CP014 release approval");
  if (allReleased && !allLearnerQuizzesPublished) warnings.push("Notes are released but one or more learner quiz deliveries are not published");
  if (input.failingPrimarySources > 0) warnings.push(`${input.failingPrimarySources} primary source(s) report their last poll as failed`);
  if (input.stalePrimarySources > 0) warnings.push(`${input.stalePrimarySources} primary source(s) have not been polled within six hours`);

  const draftReady = allEnglishDrafts && allLocalizedDrafts;
  const releaseReady = draftReady && allQuestionReviewsComplete && allReleaseReady && conflictFree;
  const learnerReady = releaseReady && allReleased && allLearnerQuizzesPublished;
  const criticalRed = blockers.length > 0 && (deadlinePassed || !sourceCoverageHealthy || !criticalSourcesHealthy || !feedFresh || !intelligenceFresh || !conflictFree);
  const color: CurrentAffairsOpsColor = learnerReady && blockers.length === 0
    ? "green"
    : criticalRed
      ? "red"
      : "amber";

  return {
    color,
    learnerReady,
    draftReady,
    releaseReady,
    sourceCoveragePercent,
    blockers,
    warnings,
    checks: {
      sourceCoverageHealthy,
      criticalSourcesHealthy,
      feedFresh,
      intelligenceFresh,
      queueHealthy,
      conflictFree,
      allEnglishDrafts,
      allLocalizedDrafts,
      allQuestionReviewsComplete,
      allReleaseReady,
      allReleased,
      allLearnerQuizzesPublished,
      deadlinePassed,
    },
  };
}
