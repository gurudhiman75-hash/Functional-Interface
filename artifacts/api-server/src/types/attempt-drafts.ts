export type AttemptDraftStatus = "in_progress" | "paused";
export type AttemptDraftType = "REAL" | "PRACTICE";

export interface AttemptDraftState {
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<number, number | null>;
  flags: Record<number, boolean>;
  timeLeft: number;
  sectionTimeLeftByName: Record<string, number>;
  lockedSections: number[];
  sectionCompletionTimes?: Record<string, number>;
  visitedQuestionIds?: number[];
  updatedAt: number;
}

export interface AttemptDraft {
  id: string;
  userId: string;
  testId: string;
  testName: string;
  category: string;
  attemptType: AttemptDraftType;
  originalAttemptId: string | null;
  state: AttemptDraftState;
  version: number;
  status: AttemptDraftStatus;
  lastDevice: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
}

export interface SaveAttemptDraftInput {
  userId: string;
  testId: string;
  testName: string;
  category: string;
  attemptType: AttemptDraftType;
  originalAttemptId?: string | null;
  state: AttemptDraftState;
  status?: AttemptDraftStatus;
  lastDevice: string;
  expectedVersion?: number;
  expiresAt?: Date | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumberRecord(value: unknown): value is Record<number, number | null> {
  if (!isRecord(value)) return false;
  return Object.values(value).every((item) => item === null || typeof item === "number");
}

function isBooleanRecord(value: unknown): value is Record<number, boolean> {
  if (!isRecord(value)) return false;
  return Object.values(value).every((item) => typeof item === "boolean");
}

function isStringNumberRecord(value: unknown): value is Record<string, number> {
  if (!isRecord(value)) return false;
  return Object.values(value).every((item) => typeof item === "number");
}

export function isAttemptDraftState(value: unknown): value is AttemptDraftState {
  if (!isRecord(value)) return false;
  return (
    typeof value.currentSectionIndex === "number" &&
    typeof value.currentQuestionIndex === "number" &&
    isNumberRecord(value.answers) &&
    isBooleanRecord(value.flags) &&
    typeof value.timeLeft === "number" &&
    isStringNumberRecord(value.sectionTimeLeftByName) &&
    Array.isArray(value.lockedSections) &&
    value.lockedSections.every((item) => typeof item === "number") &&
    (value.sectionCompletionTimes === undefined || isStringNumberRecord(value.sectionCompletionTimes)) &&
    (value.visitedQuestionIds === undefined ||
      (Array.isArray(value.visitedQuestionIds) &&
        value.visitedQuestionIds.every((item) => typeof item === "number"))) &&
    typeof value.updatedAt === "number"
  );
}
