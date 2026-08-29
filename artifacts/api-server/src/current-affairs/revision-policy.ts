export type CurrentAffairsReviewResult = "correct" | "wrong" | "unanswered";
export type CurrentAffairsReviewMode = "quiz" | "revision";

export type CurrentAffairsRevisionState = {
  stage: number;
  nextReviewAt: string;
};

const ADVANCE_INTERVAL_DAYS = [3, 4, 8, 15, 30, 60] as const;

function addDays(now: Date, days: number): string {
  const result = new Date(now.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString();
}

function validDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

export function transitionCurrentAffairsRevision(args: {
  mode: CurrentAffairsReviewMode;
  result: CurrentAffairsReviewResult;
  currentStage?: number | null;
  currentNextReviewAt?: string | null;
  now?: Date;
}): CurrentAffairsRevisionState {
  const now = args.now ?? new Date();
  const stage = Number.isInteger(args.currentStage) && Number(args.currentStage) >= 0
    ? Math.min(5, Number(args.currentStage))
    : 0;

  if (args.result !== "correct") {
    return { stage: 0, nextReviewAt: addDays(now, 1) };
  }

  if (args.mode === "quiz" && args.currentStage != null) {
    const currentDue = validDate(args.currentNextReviewAt);
    return {
      stage,
      nextReviewAt: currentDue ?? addDays(now, ADVANCE_INTERVAL_DAYS[Math.min(stage, 5)]),
    };
  }

  const nextStage = Math.min(5, stage + 1);
  const intervalIndex = stage === 0 ? 0 : Math.min(stage, ADVANCE_INTERVAL_DAYS.length - 1);
  return {
    stage: nextStage,
    nextReviewAt: addDays(now, ADVANCE_INTERVAL_DAYS[intervalIndex]),
  };
}

export function revisionStageLabel(stage: number): string {
  const safe = Math.max(0, Math.min(5, Math.floor(stage)));
  return ["Recovery", "D3", "D7", "D15", "D30", "D60"][safe]!;
}
