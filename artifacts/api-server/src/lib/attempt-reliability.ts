export type AttemptMode = "REAL" | "PRACTICE";

export interface AttemptDraftState {
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
  attemptType: AttemptMode;
  lockedSections: number[];
  originalAttemptId?: string;
  sectionCompletionTimes?: Record<string, number>;
  visitedQuestionIds?: number[];
  questionTimeSecondsById: Record<string, number>;
}

export interface AttemptSessionSnapshot {
  kind: "attempt_session";
  revision: number;
  testId: string;
  testVersionId: string;
  seriesId: string | null;
  state: AttemptDraftState | null;
  savedAt: string;
}

export class AttemptReliabilityError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AttemptReliabilityError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function finiteInteger(value: unknown, minimum: number, maximum: number, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function stringValue(value: unknown, maximum: number): string {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function numberMap(value: unknown, maximumEntries: number, minimum: number, maximum: number): Record<string, number> {
  const input = asRecord(value);
  return Object.fromEntries(
    Object.entries(input)
      .slice(0, maximumEntries)
      .map(([key, raw]) => [key.slice(0, 160), finiteInteger(raw, minimum, maximum)]),
  );
}

export function normalizeAttemptDraftState(value: unknown, expectedTestId: string): AttemptDraftState {
  const serialized = JSON.stringify(value ?? null);
  if (serialized.length > 512_000) {
    throw new AttemptReliabilityError("ATTEMPT_DRAFT_TOO_LARGE", "Saved attempt progress is too large");
  }

  const input = asRecord(value);
  const testId = stringValue(input.testId, 120);
  if (testId !== expectedTestId) {
    throw new AttemptReliabilityError("ATTEMPT_DRAFT_TEST_MISMATCH", "Saved progress belongs to a different test");
  }

  const rawAnswers = asRecord(input.answers);
  const answers: Record<number, number | null> = {};
  for (const [key, raw] of Object.entries(rawAnswers).slice(0, 2_000)) {
    const questionId = Number(key);
    if (!Number.isSafeInteger(questionId) || questionId < 0) continue;
    if (raw === null) answers[questionId] = null;
    else answers[questionId] = finiteInteger(raw, 0, 50);
  }

  const rawFlags = asRecord(input.flags);
  const flags: Record<number, boolean> = {};
  for (const [key, raw] of Object.entries(rawFlags).slice(0, 2_000)) {
    const questionId = Number(key);
    if (!Number.isSafeInteger(questionId) || questionId < 0) continue;
    flags[questionId] = raw === true;
  }

  const attemptType: AttemptMode = input.attemptType === "PRACTICE" ? "PRACTICE" : "REAL";
  const lockedSections = Array.isArray(input.lockedSections)
    ? input.lockedSections.slice(0, 200).map((item) => finiteInteger(item, 0, 1_000))
    : [];
  const visitedQuestionIds = Array.isArray(input.visitedQuestionIds)
    ? input.visitedQuestionIds.slice(0, 2_000).map((item) => finiteInteger(item, 0, Number.MAX_SAFE_INTEGER))
    : undefined;

  return {
    testId,
    testName: stringValue(input.testName, 255),
    category: stringValue(input.category, 160),
    currentSectionIndex: finiteInteger(input.currentSectionIndex, 0, 1_000),
    currentQuestionIndex: finiteInteger(input.currentQuestionIndex, 0, 10_000),
    answers,
    flags,
    timeLeft: finiteInteger(input.timeLeft, 0, 604_800),
    sectionTimeLeftByName: numberMap(input.sectionTimeLeftByName, 200, 0, 604_800),
    updatedAt: finiteInteger(input.updatedAt, 0, Number.MAX_SAFE_INTEGER, Date.now()),
    attemptType,
    lockedSections: Array.from(new Set(lockedSections)),
    originalAttemptId: stringValue(input.originalAttemptId, 120) || undefined,
    sectionCompletionTimes: numberMap(input.sectionCompletionTimes, 200, 0, 604_800),
    visitedQuestionIds: visitedQuestionIds ? Array.from(new Set(visitedQuestionIds)) : undefined,
    questionTimeSecondsById: numberMap(input.questionTimeSecondsById, 2_000, 0, 604_800),
  };
}

export function createAttemptSessionSnapshot(input: {
  testId: string;
  testVersionId: string;
  seriesId?: string | null;
  now?: string;
}): AttemptSessionSnapshot {
  return {
    kind: "attempt_session",
    revision: 0,
    testId: input.testId,
    testVersionId: input.testVersionId,
    seriesId: input.seriesId?.trim() || null,
    state: null,
    savedAt: input.now ?? new Date().toISOString(),
  };
}

export function readAttemptSessionSnapshot(
  value: unknown,
  fallback: { testId: string; testVersionId: string; seriesId?: string | null },
): AttemptSessionSnapshot {
  const input = asRecord(value);
  if (input.kind !== "attempt_session") return createAttemptSessionSnapshot(fallback);
  return {
    kind: "attempt_session",
    revision: finiteInteger(input.revision, 0, Number.MAX_SAFE_INTEGER),
    testId: stringValue(input.testId, 120) || fallback.testId,
    testVersionId: stringValue(input.testVersionId, 120) || fallback.testVersionId,
    seriesId: stringValue(input.seriesId, 120) || fallback.seriesId?.trim() || null,
    state: input.state ? normalizeAttemptDraftState(input.state, fallback.testId) : null,
    savedAt: stringValue(input.savedAt, 80) || new Date().toISOString(),
  };
}

export function advanceAttemptSessionSnapshot(input: {
  current: AttemptSessionSnapshot;
  expectedRevision: number;
  state: unknown;
  now?: string;
}): AttemptSessionSnapshot {
  if (input.expectedRevision !== input.current.revision) {
    throw new AttemptReliabilityError(
      "ATTEMPT_SESSION_CONFLICT",
      "This attempt was updated in another tab or device",
      409,
      { currentRevision: input.current.revision },
    );
  }
  return {
    ...input.current,
    revision: input.current.revision + 1,
    state: normalizeAttemptDraftState(input.state, input.current.testId),
    savedAt: input.now ?? new Date().toISOString(),
  };
}
