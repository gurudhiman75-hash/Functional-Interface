export type CurrentAffairsPersonalizationLanguage = "en" | "hi" | "pa";
export type CurrentAffairsPersonalizationExamFamily = "ssc" | "banking" | "punjab" | "railways" | "general";
export type CurrentAffairsSavedMode = "bookmark" | "revise_later";

export const DEFAULT_CURRENT_AFFAIRS_DAILY_TARGET = 20;
export const MIN_CURRENT_AFFAIRS_DAILY_TARGET = 5;
export const MAX_CURRENT_AFFAIRS_DAILY_TARGET = 100;

export function normalizeCurrentAffairsDailyTarget(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return null;
  if (parsed < MIN_CURRENT_AFFAIRS_DAILY_TARGET || parsed > MAX_CURRENT_AFFAIRS_DAILY_TARGET) return null;
  return parsed;
}

export function normalizeCurrentAffairsPersonalizationLanguage(value: unknown): CurrentAffairsPersonalizationLanguage | null {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  return normalized === "en" || normalized === "hi" || normalized === "pa" ? normalized : null;
}

export function normalizeCurrentAffairsPersonalizationExamFamily(value: unknown): CurrentAffairsPersonalizationExamFamily | null {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  return normalized === "ssc" || normalized === "banking" || normalized === "punjab" || normalized === "railways" || normalized === "general"
    ? normalized
    : null;
}

export function normalizeCurrentAffairsSavedMode(value: unknown): CurrentAffairsSavedMode | null {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  return normalized === "bookmark" || normalized === "revise_later" ? normalized : null;
}

export function defaultCurrentAffairsReviewAfter(now = new Date()): Date {
  return new Date(now.getTime() + 24 * 60 * 60 * 1000);
}

export function normalizeCurrentAffairsReviewAfter(value: unknown, now = new Date()): Date | null {
  if (value == null || value === "") return defaultCurrentAffairsReviewAfter(now);
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return null;
  const min = now.getTime() - 5 * 60 * 1000;
  const max = now.getTime() + 180 * 24 * 60 * 60 * 1000;
  return parsed.getTime() >= min && parsed.getTime() <= max ? parsed : null;
}

export type CurrentAffairsEngagementSignal = {
  key: string;
  type: "revision_due" | "recovery_due" | "daily_target" | "daily_pack" | "saved_review";
  urgency: "high" | "normal";
  title: string;
  body: string;
  deepLink: string;
  count: number;
};

export function buildCurrentAffairsEngagementSignals(args: {
  dayKey: string;
  revisionDue: number;
  recoveryDue: number;
  savedReviewDue: number;
  questionsStudiedToday: number;
  dailyTarget: number;
  latestUnattemptedQuizCode?: string | null;
  revisionSignalEnabled: boolean;
  dailyPackSignalEnabled: boolean;
  studyTargetSignalEnabled: boolean;
}): CurrentAffairsEngagementSignal[] {
  const signals: CurrentAffairsEngagementSignal[] = [];
  if (args.revisionSignalEnabled && args.revisionDue > 0) {
    signals.push({
      key: `ca:revision-due:${args.dayKey}`,
      type: "revision_due",
      urgency: args.revisionDue >= 10 ? "high" : "normal",
      title: "Current Affairs revision is due",
      body: `${args.revisionDue} spaced-repetition question${args.revisionDue === 1 ? " is" : "s are"} ready for review.`,
      deepLink: "/current-affairs/revision",
      count: args.revisionDue,
    });
  }
  if (args.revisionSignalEnabled && args.recoveryDue > 0) {
    signals.push({
      key: `ca:recovery-due:${args.dayKey}`,
      type: "recovery_due",
      urgency: "high",
      title: "Recover weak Current Affairs items",
      body: `${args.recoveryDue} wrong or skipped question${args.recoveryDue === 1 ? " needs" : "s need"} another look.`,
      deepLink: "/current-affairs/revision",
      count: args.recoveryDue,
    });
  }
  if (args.studyTargetSignalEnabled && args.questionsStudiedToday < args.dailyTarget) {
    const remaining = Math.max(0, args.dailyTarget - args.questionsStudiedToday);
    signals.push({
      key: `ca:daily-target:${args.dayKey}`,
      type: "daily_target",
      urgency: "normal",
      title: "Finish today’s Current Affairs goal",
      body: `${remaining} question${remaining === 1 ? "" : "s"} remain in your daily target of ${args.dailyTarget}.`,
      deepLink: "/current-affairs",
      count: remaining,
    });
  }
  if (args.dailyPackSignalEnabled && args.latestUnattemptedQuizCode) {
    signals.push({
      key: `ca:daily-pack:${args.dayKey}:${args.latestUnattemptedQuizCode}`,
      type: "daily_pack",
      urgency: "normal",
      title: "A fresh Current Affairs quiz is ready",
      body: "Complete the latest verified daily pack and start its D3–D60 memory cycle.",
      deepLink: `/current-affairs/quiz/${encodeURIComponent(args.latestUnattemptedQuizCode)}`,
      count: 1,
    });
  }
  if (args.savedReviewDue > 0) {
    signals.push({
      key: `ca:saved-review:${args.dayKey}`,
      type: "saved_review",
      urgency: "normal",
      title: "Your saved Current Affairs items are ready",
      body: `${args.savedReviewDue} saved item${args.savedReviewDue === 1 ? " is" : "s are"} marked for revision now.`,
      deepLink: "/current-affairs?saved=1",
      count: args.savedReviewDue,
    });
  }
  const rank = (signal: CurrentAffairsEngagementSignal) => signal.urgency === "high" ? 0 : 1;
  return signals.sort((a, b) => rank(a) - rank(b) || b.count - a.count || a.key.localeCompare(b.key));
}

export function currentAffairsDailyProgress(questionsStudiedToday: number, dailyTarget: number) {
  const studied = Math.max(0, Math.floor(questionsStudiedToday));
  const target = normalizeCurrentAffairsDailyTarget(dailyTarget) ?? DEFAULT_CURRENT_AFFAIRS_DAILY_TARGET;
  const remaining = Math.max(0, target - studied);
  return {
    studied,
    target,
    remaining,
    complete: remaining === 0,
    percent: Math.min(100, Math.round((studied / target) * 100)),
  };
}
