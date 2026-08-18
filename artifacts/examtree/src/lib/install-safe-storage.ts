import {
  Storage,
  getActiveTestSession,
  saveActiveTestSession,
  type ActiveTestSession,
} from "@/lib/storage";

const originalSet = Storage.set.bind(Storage);

Storage.set = (key: string, value: unknown): void => {
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
      "active_test_sessions",
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
// Reconcile only sessions that were actively ticking immediately before the
// tab became hidden, using the draft's own updatedAt as the clock anchor. This
// avoids double-counting seconds that continued to tick while hidden.
type HiddenActiveTest = {
  testId: string;
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

function reconcileSectionalTimer(
  session: ActiveTestSession,
  elapsedSeconds: number,
): ActiveTestSession {
  const names = Object.keys(session.sectionTimeLeftByName ?? {});
  if (names.length === 0) {
    return {
      ...session,
      timeLeft: Math.max(0, session.timeLeft - elapsedSeconds),
    };
  }

  const nextTimes = { ...session.sectionTimeLeftByName };
  let sectionIndex = Math.min(Math.max(session.currentSectionIndex, 0), names.length - 1);
  let remainingElapsed = elapsedSeconds;
  let movedSection = false;

  while (remainingElapsed > 0 && sectionIndex < names.length) {
    const name = names[sectionIndex]!;
    const current = Math.max(0, Number(nextTimes[name] ?? 0));

    if (current > remainingElapsed) {
      nextTimes[name] = current - remainingElapsed;
      remainingElapsed = 0;
      break;
    }

    nextTimes[name] = 0;
    remainingElapsed -= current;
    if (sectionIndex >= names.length - 1) break;
    sectionIndex += 1;
    movedSection = true;
  }

  return {
    ...session,
    currentSectionIndex: sectionIndex,
    currentQuestionIndex: movedSection ? 0 : session.currentQuestionIndex,
    sectionTimeLeftByName: nextTimes,
  };
}

function reconcileVisibleTestTimer(): void {
  if (!hiddenActiveTest) return;

  const marker = hiddenActiveTest;
  hiddenActiveTest = null;
  const testId = currentTestId();
  if (!testId || testId !== marker.testId) return;

  const session = getActiveTestSession(testId);
  if (!session || session.attemptType !== "REAL") return;

  // If another live tick/save happened after the tab was hidden, count only the
  // interval since that most recent authoritative local draft update.
  const anchor = Math.max(marker.updatedAtWhenHidden, Number(session.updatedAt ?? 0));
  const now = Date.now();
  const elapsedSeconds = Math.floor(Math.max(0, now - anchor) / 1000);
  if (elapsedSeconds < 2) return;

  const reconciled = reconcileSectionalTimer(session, elapsedSeconds);
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
      if (!testId) {
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
          ? { testId, updatedAtWhenHidden: session.updatedAt }
          : null;
      return;
    }

    reconcileVisibleTestTimer();
  });
}
