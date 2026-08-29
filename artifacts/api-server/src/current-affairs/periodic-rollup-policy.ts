import { previousIndiaDate } from "./orchestration-policy";

export type CurrentAffairsRollupPeriod = {
  type: "weekly" | "monthly";
  start: string;
  end: string;
};

function utcDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function shiftDays(value: string, days: number): string {
  const date = utcDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return dateOnly(date);
}

export function completedWeeklyPeriodForDate(completedDate: string): CurrentAffairsRollupPeriod | null {
  const end = utcDate(completedDate);
  if (Number.isNaN(end.getTime()) || end.getUTCDay() !== 0) return null;
  return {
    type: "weekly",
    start: shiftDays(completedDate, -6),
    end: completedDate,
  };
}

export function completedMonthlyPeriodForDate(completedDate: string): CurrentAffairsRollupPeriod | null {
  const end = utcDate(completedDate);
  if (Number.isNaN(end.getTime())) return null;
  const next = utcDate(completedDate);
  next.setUTCDate(next.getUTCDate() + 1);
  if (next.getUTCDate() !== 1) return null;
  return {
    type: "monthly",
    start: `${completedDate.slice(0, 7)}-01`,
    end: completedDate,
  };
}

export function completedRollupPeriods(now = new Date()): CurrentAffairsRollupPeriod[] {
  const completedDate = previousIndiaDate(now);
  return [
    completedWeeklyPeriodForDate(completedDate),
    completedMonthlyPeriodForDate(completedDate),
  ].filter((period): period is CurrentAffairsRollupPeriod => Boolean(period));
}
