import type {
  TestAttempt as CanonicalTestAttempt,
} from "@workspace/api-zod";
import {
  clearAllCanonicalAttemptSessions,
  hasCanonicalAttemptSession,
  queueCanonicalAttemptDraft,
} from "@/lib/api";

export const Storage = {
  set: (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v)),
  get: <T = unknown>(k: string): T | null => {
    try {
      return JSON.parse(localStorage.getItem(k) ?? "null") as T;
    } catch {
      return null;
    }
  },
  remove: (k: string) => localStorage.removeItem(k),
  clear: () => localStorage.clear(),
};

export interface User {
  id: string;
  email: string;
  name: string;
  role?: "admin" | "student";
}

export type TestAttempt = CanonicalTestAttempt;

type LocalAttemptInput = Omit<TestAttempt, "id" | "userId" | "createdAt"> &
  Partial<Pick<TestAttempt, "id" | "userId" | "createdAt">>;

export interface ActiveTestSession {
  testId: string;
  testName: string;
  category: string;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<number, number | null>;
  flags: Record<number, boolean>;
  timeLeft: number;
  sectionTimeLeftByName: Record<string, number>;
  updatedAt: number;
  attemptType: "REAL" | "PRACTICE";
  timerMode?: "overall" | "sectional";
  lockedSections: number[];
  originalAttemptId?: string;
  sectionCompletionTimes?: Record<string, number>;
  visitedQuestionIds?: number[];
}

export const getUser = (): User | null => Storage.get<User>("user");
export const setUser = (user: User) => Storage.set("user", user);
export const clearAuth = () => {
  Storage.remove("user");
  Storage.remove("authToken");
};
export const getAttempts = (): TestAttempt[] => Storage.get<TestAttempt[]>("attempts") ?? [];

// ----- Daily streak -----

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  /** ISO date string YYYY-MM-DD of the last REAL test completion. */
  lastAttemptDate: string | null;
  /** Whether the streak was just incremented. */
  justIncremented: boolean;
}

const STREAK_KEY = "streak_data";

function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const getStreak = (): StreakData =>
  Storage.get<StreakData>(STREAK_KEY) ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastAttemptDate: null,
    justIncremented: false,
  };

export function updateStreak(): StreakData {
  const today = localDateString();
  const data = getStreak();

  if (data.lastAttemptDate === today) {
    const updated: StreakData = { ...data, justIncremented: false };
    Storage.set(STREAK_KEY, updated);
    return updated;
  }

  let newCurrent: number;
  let justIncremented = false;

  if (data.lastAttemptDate === null) {
    newCurrent = 1;
    justIncremented = true;
  } else {
    const yesterday = localDateString(new Date(Date.now() - 86_400_000));
    if (data.lastAttemptDate === yesterday) {
      newCurrent = data.currentStreak + 1;
      justIncremented = true;
    } else {
      newCurrent = 1;
      justIncremented = true;
    }
  }

  const updated: StreakData = {
    currentStreak: newCurrent,
    longestStreak: Math.max(data.longestStreak, newCurrent),
    lastAttemptDate: today,
    justIncremented,
  };
  Storage.set(STREAK_KEY, updated);
  return updated;
}

export function acknowledgeStreakCelebration(): void {
  const data = getStreak();
  if (data.justIncremented) {
    Storage.set(STREAK_KEY, { ...data, justIncremented: false });
  }
}

export const addAttempt = (attempt: LocalAttemptInput) => {
  const normalized: TestAttempt = {
    ...attempt,
    id: attempt.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: attempt.userId ?? "local",
    createdAt: attempt.createdAt ?? new Date().toISOString(),
  };
  const attempts = getAttempts();
  attempts.unshift(normalized);
  Storage.set("attempts", attempts);
  if ((normalized.attemptType ?? "REAL") === "REAL") {
    updateStreak();
  }
};

// ----- Percentile history -----

const PERCENTILE_HISTORY_KEY = "percentile_history";

export const getPercentileHistory = (): Record<string, number> =>
  Storage.get<Record<string, number>>(PERCENTILE_HISTORY_KEY) ?? {};

export const recordPercentile = (testId: string, topPercent: number): void => {
  const history = getPercentileHistory();
  history[testId] = topPercent;
  Storage.set(PERCENTILE_HISTORY_KEY, history);
};

// ----- Daily challenge completion tracking -----

const DAILY_CHALLENGE_KEY = "daily_challenge_status";

export interface DailyChallengeStatus {
  completedDate: string | null;
  completedTestId: string | null;
}

export const getDailyChallengeStatus = (): DailyChallengeStatus =>
  Storage.get<DailyChallengeStatus>(DAILY_CHALLENGE_KEY) ?? {
    completedDate: null,
    completedTestId: null,
  };

export const recordDailyChallengeCompleted = (testId: string): void => {
  const today = new Date().toISOString().slice(0, 10);
  Storage.set(DAILY_CHALLENGE_KEY, { completedDate: today, completedTestId: testId });
};

export const isDailyChallengeCompletedToday = (challengeTestId: string): boolean => {
  const today = new Date().toISOString().slice(0, 10);
  const status = getDailyChallengeStatus();
  return status.completedDate === today && status.completedTestId === challengeTestId;
};

// ----- Attempt and response tracking -----

export interface AttemptRecord {
  id: string;
  userId: string;
  testId: string;
  mode: "REAL" | "PRACTICE";
  attemptNumber: number;
  startTime: number;
  endTime: number | null;
}

export interface QuestionResponse {
  attemptId: string;
  questionId: number;
  selectedOption: number | null;
  timeTaken: number;
}

const ATTEMPT_RECORDS_KEY = "attempt_records";
const QUESTION_RESPONSES_KEY = "question_responses";

export const getAttemptRecords = (): AttemptRecord[] =>
  Storage.get<AttemptRecord[]>(ATTEMPT_RECORDS_KEY) ?? [];

export const saveAttemptRecord = (record: AttemptRecord): void => {
  const records = getAttemptRecords();
  const index = records.findIndex((item) => item.id === record.id);
  if (index >= 0) records[index] = record;
  else records.unshift(record);
  Storage.set(ATTEMPT_RECORDS_KEY, records);
};

export const getAttemptResponses = (attemptId: string): QuestionResponse[] =>
  (Storage.get<QuestionResponse[]>(QUESTION_RESPONSES_KEY) ?? []).filter(
    (response) => response.attemptId === attemptId,
  );

export const saveQuestionResponse = (response: QuestionResponse): void => {
  const all = Storage.get<QuestionResponse[]>(QUESTION_RESPONSES_KEY) ?? [];
  const index = all.findIndex(
    (item) => item.attemptId === response.attemptId && item.questionId === response.questionId,
  );
  if (index >= 0) all[index] = response;
  else all.push(response);
  Storage.set(QUESTION_RESPONSES_KEY, all);
};

export const countPriorAttempts = (
  userId: string,
  testId: string,
  mode: "REAL" | "PRACTICE",
): number =>
  getAttemptRecords().filter(
    (record) => record.userId === userId && record.testId === testId && record.mode === mode,
  ).length;

const ACTIVE_TEST_SESSIONS_KEY = "active_test_sessions";

export const getActiveTestSessions = (): Record<string, ActiveTestSession> =>
  Storage.get<Record<string, ActiveTestSession>>(ACTIVE_TEST_SESSIONS_KEY) ?? {};

export const getActiveTestSession = (testId: string): ActiveTestSession | null =>
  getActiveTestSessions()[testId] ?? null;

export const saveActiveTestSession = (session: ActiveTestSession) => {
  const sessions = getActiveTestSessions();
  sessions[session.testId] = session;
  Storage.set(ACTIVE_TEST_SESSIONS_KEY, sessions);
  queueCanonicalAttemptDraft(session);
};

export const clearActiveTestSession = (testId: string) => {
  // The runner clears before submitting. Keep the local draft until the API has
  // committed the canonical result, so a network failure remains resumable.
  if (hasCanonicalAttemptSession(testId)) return;
  const sessions = getActiveTestSessions();
  delete sessions[testId];
  Storage.set(ACTIVE_TEST_SESSIONS_KEY, sessions);
};

export const clearStudentLocalData = () => {
  Storage.remove("attempts");
  Storage.remove(ACTIVE_TEST_SESSIONS_KEY);
  clearAllCanonicalAttemptSessions();
};

/**
 * Compatibility no-op for the student bootstrap. The dedicated admin app owns
 * all administration data and never hydrates a destructive local snapshot.
 */
export async function hydrateAdminDataFromCloud(): Promise<boolean> {
  return false;
}

/**
 * Compatibility selectors for an obsolete 404 fallback in data.ts. They never
 * read localStorage, so canonical backend tests remain the only runtime source.
 */
export const getAdminTests = (): any[] => [];
export const getAdminQuestions = (): any[] => [];
