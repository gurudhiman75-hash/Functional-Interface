export type CurrentAffairsMasteryState = "recovery" | "learning" | "strong" | "mastered";

export type CurrentAffairsActivityDay = {
  day: string;
  attempts: number;
  questions: number;
  correct: number;
};

const STAGE_LABELS = ["Recovery", "D3", "D7", "D15", "D30", "D60"] as const;

function dateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function currentAffairsStageLabel(stage: number): string {
  return STAGE_LABELS[Math.max(0, Math.min(5, Math.floor(stage)))] ?? "Recovery";
}

export function currentAffairsMasteryState(stage: number, lastResult: string): CurrentAffairsMasteryState {
  const safeStage = Math.max(0, Math.min(5, Math.floor(stage)));
  if (lastResult !== "correct") return "recovery";
  if (safeStage >= 5) return "mastered";
  if (safeStage >= 3) return "strong";
  return "learning";
}

export function currentAffairsStudyStreak(dayKeys: string[], todayKey: string): number {
  const today = dateOnly(todayKey);
  if (!today) return 0;
  const unique = Array.from(new Set(dayKeys.filter((day) => dateOnly(day)))).sort().reverse();
  if (unique.length === 0) return 0;

  const dayNumber = (value: string) => Math.floor((dateOnly(value)?.getTime() ?? 0) / 86_400_000);
  const todayNumber = dayNumber(todayKey);
  const latestNumber = dayNumber(unique[0]!);
  if (latestNumber !== todayNumber && latestNumber !== todayNumber - 1) return 0;

  let streak = 1;
  for (let index = 1; index < unique.length; index += 1) {
    if (dayNumber(unique[index]!) === dayNumber(unique[index - 1]!) - 1) streak += 1;
    else break;
  }
  return streak;
}

export function buildCurrentAffairsSevenDayActivity(
  rows: CurrentAffairsActivityDay[],
  todayKey: string,
): Array<CurrentAffairsActivityDay & { accuracy: number }> {
  const today = dateOnly(todayKey);
  if (!today) return [];
  const byDay = new Map(rows.map((row) => [row.day, row]));
  const result: Array<CurrentAffairsActivityDay & { accuracy: number }> = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today.getTime() - offset * 86_400_000);
    const day = date.toISOString().slice(0, 10);
    const row = byDay.get(day) ?? { day, attempts: 0, questions: 0, correct: 0 };
    result.push({
      ...row,
      accuracy: row.questions > 0 ? Math.round((row.correct / row.questions) * 100) : 0,
    });
  }
  return result;
}

export function currentAffairsCategoryLabel(category: string): string {
  return category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace("Economy Banking", "Economy & Banking")
    .trim();
}

export function currentAffairsWeaknessScore(args: {
  accuracy: number;
  total: number;
  due: number;
  recovery: number;
}): number {
  if (args.total <= 0 && args.due <= 0) return 0;
  const accuracyPenalty = Math.max(0, 100 - Math.max(0, Math.min(100, args.accuracy)));
  const evidenceWeight = Math.min(1, args.total / 10);
  return Math.round(accuracyPenalty * (0.55 + 0.45 * evidenceWeight) + Math.min(20, args.due * 2) + Math.min(20, args.recovery * 4));
}
