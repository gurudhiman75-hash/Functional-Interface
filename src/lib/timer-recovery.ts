export type ExamTimerMode = "overall" | "sectional";

export interface RecoverableTimerSession {
  timeLeft: number;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  sectionTimeLeftByName: Record<string, number>;
}

export function inferExamTimerMode(
  before: RecoverableTimerSession,
  next: RecoverableTimerSession,
): ExamTimerMode | null {
  const beforeTimeLeft = Number(before.timeLeft);
  const nextTimeLeft = Number(next.timeLeft);
  if (
    Number.isFinite(beforeTimeLeft) &&
    Number.isFinite(nextTimeLeft) &&
    nextTimeLeft < beforeTimeLeft
  ) {
    return "overall";
  }

  const sectionalTicked = Object.keys(next.sectionTimeLeftByName ?? {}).some((name) => {
    const prior = Number(before.sectionTimeLeftByName?.[name]);
    const current = Number(next.sectionTimeLeftByName?.[name]);
    return Number.isFinite(prior) && Number.isFinite(current) && current < prior;
  });
  return sectionalTicked ? "sectional" : null;
}

export function reconcileExamTimer<T extends RecoverableTimerSession>(
  session: T,
  elapsedSeconds: number,
  mode: ExamTimerMode,
): T {
  const elapsed = Math.max(0, Math.floor(elapsedSeconds));
  if (elapsed === 0) return session;

  if (mode === "overall") {
    return {
      ...session,
      timeLeft: Math.max(0, session.timeLeft - elapsed),
    };
  }

  const names = Object.keys(session.sectionTimeLeftByName ?? {});
  if (names.length === 0) return session;

  const nextTimes = { ...session.sectionTimeLeftByName };
  let sectionIndex = Math.min(Math.max(session.currentSectionIndex, 0), names.length - 1);
  let remainingElapsed = elapsed;
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
