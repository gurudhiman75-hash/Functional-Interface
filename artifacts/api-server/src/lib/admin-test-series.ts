export type TestSeriesProgressionMode = "open" | "sequential" | "score_gated";

export interface NormalizedTestSeriesItemInput {
  testId: string;
  titleOverride: string | null;
  unlockAt: string | null;
  minimumScore: number | null;
  isRequired: boolean;
  configuration: Record<string, unknown>;
}

export interface NormalizedTestSeriesInput {
  expectedCurrentVersionNumber: number | null;
  examVersionId: string;
  code: string;
  name: string;
  description: string;
  availabilityStartAt: string | null;
  availabilityEndAt: string | null;
  progressionMode: TestSeriesProgressionMode;
  completionThreshold: number | null;
  configuration: Record<string, unknown>;
  changeReason: string;
  items: NormalizedTestSeriesItemInput[];
}

export class TestSeriesError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "TestSeriesError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(value: unknown): string | null {
  const result = asString(value);
  return result ? result : null;
}

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function assertUuid(value: string, code: string, message: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new TestSeriesError(code, message);
  }
  return value;
}

function isoDate(value: unknown, code: string, label: string): string | null {
  const raw = nullableString(value);
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new TestSeriesError(code, `${label} must be a valid date and time`);
  }
  return date.toISOString();
}

function score(value: unknown, code: string, label: string): number | null {
  const result = nullableNumber(value);
  if (result == null) return null;
  if (result < 0 || result > 100) {
    throw new TestSeriesError(code, `${label} must be between 0 and 100`);
  }
  return Math.round(result * 100) / 100;
}

function normalizeCode(value: unknown): string {
  const code = asString(value).toUpperCase().replace(/[^A-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  if (code.length < 3 || code.length > 120) {
    throw new TestSeriesError("TEST_SERIES_CODE_INVALID", "Series code must contain 3 to 120 letters, numbers, underscores or hyphens");
  }
  return code;
}

export function normalizeTestSeriesInput(value: unknown): NormalizedTestSeriesInput {
  const input = asRecord(value);
  const examVersionId = assertUuid(
    asString(input.examVersionId),
    "TEST_SERIES_EXAM_INVALID",
    "Select a valid exam version",
  );
  const name = asString(input.name);
  if (name.length < 3 || name.length > 255) {
    throw new TestSeriesError("TEST_SERIES_NAME_INVALID", "Series name must contain 3 to 255 characters");
  }
  const description = asString(input.description);
  if (description.length > 5000) {
    throw new TestSeriesError("TEST_SERIES_DESCRIPTION_TOO_LONG", "Series description cannot exceed 5000 characters");
  }
  const changeReason = asString(input.changeReason);
  if (changeReason.length < 3 || changeReason.length > 1000) {
    throw new TestSeriesError("TEST_SERIES_REASON_REQUIRED", "Provide a meaningful change reason");
  }

  const progressionMode = asString(input.progressionMode) as TestSeriesProgressionMode;
  if (!["open", "sequential", "score_gated"].includes(progressionMode)) {
    throw new TestSeriesError("TEST_SERIES_PROGRESSION_INVALID", "Progression mode must be open, sequential or score gated");
  }
  const completionThreshold = score(
    input.completionThreshold,
    "TEST_SERIES_THRESHOLD_INVALID",
    "Completion threshold",
  );
  if (progressionMode === "score_gated" && completionThreshold == null) {
    throw new TestSeriesError("TEST_SERIES_THRESHOLD_REQUIRED", "Score-gated progression requires a completion threshold");
  }

  const availabilityStartAt = isoDate(
    input.availabilityStartAt,
    "TEST_SERIES_START_INVALID",
    "Availability start",
  );
  const availabilityEndAt = isoDate(
    input.availabilityEndAt,
    "TEST_SERIES_END_INVALID",
    "Availability end",
  );
  if (availabilityStartAt && availabilityEndAt && availabilityEndAt <= availabilityStartAt) {
    throw new TestSeriesError("TEST_SERIES_WINDOW_INVALID", "Availability end must be after availability start");
  }

  const rawItems = Array.isArray(input.items) ? input.items : [];
  if (rawItems.length < 1 || rawItems.length > 200) {
    throw new TestSeriesError("TEST_SERIES_ITEMS_INVALID", "A series must contain between 1 and 200 tests");
  }
  const seen = new Set<string>();
  const items = rawItems.map((rawItem, index): NormalizedTestSeriesItemInput => {
    const item = asRecord(rawItem);
    const testId = assertUuid(
      asString(item.testId),
      "TEST_SERIES_TEST_INVALID",
      `Series item ${index + 1} has an invalid test identifier`,
    );
    if (seen.has(testId)) {
      throw new TestSeriesError("TEST_SERIES_TEST_DUPLICATE", "A test can appear only once in a series version");
    }
    seen.add(testId);
    const titleOverride = nullableString(item.titleOverride);
    if (titleOverride && titleOverride.length > 255) {
      throw new TestSeriesError("TEST_SERIES_TITLE_OVERRIDE_TOO_LONG", "A member title override cannot exceed 255 characters");
    }
    return {
      testId,
      titleOverride,
      unlockAt: isoDate(item.unlockAt, "TEST_SERIES_UNLOCK_INVALID", `Unlock time for item ${index + 1}`),
      minimumScore: score(item.minimumScore, "TEST_SERIES_MEMBER_SCORE_INVALID", `Minimum score for item ${index + 1}`),
      isRequired: item.isRequired !== false,
      configuration: asRecord(item.configuration),
    };
  });

  const expected = nullableNumber(input.expectedCurrentVersionNumber);
  if (expected != null && (!Number.isInteger(expected) || expected < 1)) {
    throw new TestSeriesError("TEST_SERIES_EXPECTED_VERSION_INVALID", "Expected current version must be a positive integer");
  }

  return {
    expectedCurrentVersionNumber: expected,
    examVersionId,
    code: normalizeCode(input.code),
    name,
    description,
    availabilityStartAt,
    availabilityEndAt,
    progressionMode,
    completionThreshold: progressionMode === "score_gated" ? completionThreshold : null,
    configuration: asRecord(input.configuration),
    changeReason,
    items,
  };
}

export function seriesReadiness(input: {
  deletedAt?: string | null;
  itemCount: number;
  availabilityStartAt?: string | null;
  availabilityEndAt?: string | null;
  memberStatuses: string[];
}): { ready: boolean; blockers: string[]; warnings: string[] } {
  const blockers: string[] = [];
  const warnings: string[] = [];
  if (input.deletedAt) blockers.push("Series is archived");
  if (input.itemCount < 1) blockers.push("Series has no tests");
  const blockingStatuses = input.memberStatuses.filter((status) => !["qa_approved", "scheduled", "live", "completed"].includes(status));
  if (blockingStatuses.length > 0) {
    blockers.push(`${blockingStatuses.length} test(s) are not QA approved or released`);
  }
  const now = Date.now();
  if (input.availabilityEndAt && new Date(input.availabilityEndAt).getTime() <= now) {
    blockers.push("Series availability has ended");
  }
  if (!input.availabilityStartAt) warnings.push("No release start is configured");
  if (!input.availabilityEndAt) warnings.push("No release end is configured");
  return { ready: blockers.length === 0, blockers, warnings };
}
