export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  lastAttemptDate: string | null;
  attemptedToday: boolean;
}

function shiftDay(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

/** Calendar day (YYYY-MM-DD) in India time for a timestamp. */
export function istDay(date: Date): string {
  return new Date(date.getTime() + 5.5 * 3_600_000).toISOString().slice(0, 10);
}

/** Streak from a list of attempt days. Current streak survives until the end of the next day. */
export function summarizeStreak(days: string[], today: string): StreakSummary {
  const unique = [...new Set(days)].sort();
  if (unique.length === 0) return { currentStreak: 0, longestStreak: 0, lastAttemptDate: null, attemptedToday: false };
  let longest = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i++) {
    run = unique[i] === shiftDay(unique[i - 1], 1) ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const last = unique[unique.length - 1];
  const alive = last === today || last === shiftDay(today, -1);
  return { currentStreak: alive ? run : 0, longestStreak: longest, lastAttemptDate: last, attemptedToday: last === today };
}
