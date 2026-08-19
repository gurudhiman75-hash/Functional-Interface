import {
  Storage,
  getActiveTestSession,
  saveActiveTestSession,
  type ActiveTestSession,
} from "@/lib/storage";
import {
  inferExamTimerMode,
  reconcileExamTimer,
  type ExamTimerMode,
  type RecoverableTimerSession,
} from "@/lib/timer-recovery";

const ACTIVE_TEST_SESSIONS_KEY = "active_test_sessions";
const originalSet = Storage.set.bind(Storage);
const timerModeByTest = new Map<string, ExamTimerMode>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readStoredActiveSessions(): Record<string, Record<string, unknown>> {
  try {
    const raw = localStorage.getItem(ACTIVE_TEST_SESSIONS_KEY);
    const parsed = raw ? JSON.parse(raw) as unknown : {};
    return isRecord(parsed) ? parsed as Record<string, Record<string, unknown>> : {};
  } catch {
    return {};
  }
}

function timerShape(value: Record<string, unknown>): RecoverableTimerSession | null {
  const sections = value.sectionTimeLeftByName;
  if (!isRecord(sections)) return null;
  const sectionTimes = Object.fromEntries(
    Object.entries(sections).map(([name, remaining]) => [name, Number(remaining)]),
  );
  return {
    timeLeft: Number(value.timeLeft),
    currentSectionIndex: Number(value.currentSectionIndex),
    currentQuestionIndex: Number(value.currentQuestionIndex),
    sectionTimeLeftByName: sectionTimes,
  };
}

function inferTimerModes(value: unknown): void {
  if (!isRecord(value)) return;
  const previous = readStoredActiveSessions();

  for (const [testId, nextValue] of Object.entries(value)) {
    if (!isRecord(nextValue)) continue;
    const before = previous[testId];
    if (!isRecord(before)) continue;
    const beforeShape = timerShape(before);
    const nextShape = timerShape(nextValue);
    if (!beforeShape || !nextShape) continue;

    const mode = inferExamTimerMode(beforeShape, nextShape);
    if (mode) timerModeByTest.set(testId, mode);
  }
}

Storage.set = (key: string, value: unknown): void => {
  if (key === ACTIVE_TEST_SESSIONS_KEY) inferTimerModes(value);

  try {
    originalSet(key, value);
    return;
  } catch (error) {
    console.warn(`Unable to persist local cache key \"${key}\"`, error);
  }

  // Local browser storage is only a convenience cache. A quota/private-mode
  // failure must never turn a successful backend action into an application
  // failure. Free the bulky attempt caches and retry the requested write once.
  try {
    for (const cacheKey of [
      "attempts",
      "question_responses",
      "attempt_records",
      ACTIVE_TEST_SESSIONS_KEY,
    ]) {
      if (cacheKey !== key) localStorage.removeItem(cacheKey);
    }
    originalSet(key, value);
  } catch (error) {
    console.warn(`Continuing without local cache key \"${key}\"`, error);
  }
};

// Browser timers are aggressively throttled or suspended when a mobile tab is
// backgrounded. The runner deliberately pauses only when the student chooses
// "Save & Exit"; merely switching apps/tabs must not create free exam time.
// Reconcile only sessions whose timer mode was proven by successive live draft
// updates immediately before the tab became hidden. Using the latest draft's
// updatedAt prevents double-counting seconds that continued to tick while hidden.
type HiddenActiveTest = {
  testId: string;
  mode: ExamTimerMode;
  updatedAtWhenHidden: number;
};

let hiddenActiveTest: HiddenActiveTest | null = null;

function currentTestId(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/test\/([^/]+)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function reconcileVisibleTestTimer(): void {
  if (!hiddenActiveTest) return;

  const marker = hiddenActiveTest;
  hiddenActiveTest = null;
  const testId = currentTestId();
  if (!testId || testId !== marker.testId) return;

  const session = getActiveTestSession(testId);
  if (!session || session.attemptType !== "REAL") return;

  // If normal interval ticks continued after the tab was hidden, count only the
  // interval since that most recent saved tick rather than the whole hidden span.
  const anchor = Math.max(marker.updatedAtWhenHidden, Number(session.updatedAt ?? 0));
  const now = Date.now();
  const elapsedSeconds = Math.floor(Math.max(0, now - anchor) / 1000);
  if (elapsedSeconds < 2) return;

  const reconciled = reconcileExamTimer(session, elapsedSeconds, marker.mode) as ActiveTestSession;
  saveActiveTestSession({ ...reconciled, updatedAt: now });

  // Reload from the reconciled draft so React state and the visible clock cannot
  // retain a throttled pre-background value. The canonical draft queue receives
  // the same corrected state through saveActiveTestSession.
  window.location.reload();
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      const testId = currentTestId();
      const mode = testId ? timerModeByTest.get(testId) : undefined;
      if (!testId || !mode) {
        hiddenActiveTest = null;
        return;
      }

      const session = getActiveTestSession(testId);
      const ageMs = session ? Date.now() - Number(session.updatedAt ?? 0) : Number.POSITIVE_INFINITY;
      hiddenActiveTest =
        session &&
        session.attemptType === "REAL" &&
        session.timeLeft > 0 &&
        ageMs >= 0 &&
        ageMs <= 5_000
          ? { testId, mode, updatedAtWhenHidden: session.updatedAt }
          : null;
      return;
    }

    reconcileVisibleTestTimer();
  });
}
