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

export type TestSeriesStatus = "draft" | "active" | "deprecated" | "archived";
export type TestSeriesAccessMode = "free" | "included" | "premium";

export interface TestSeriesItemInput {
  testId: string;
  accessMode: TestSeriesAccessMode;
  availability: Record<string, unknown>;
}

export interface TestSeriesInput {
  examVersionId: string;
  code: string;
  name: string;
  status: TestSeriesStatus;
  description: string;
  validityDays: number | null;
  progressionRules: Record<string, unknown>;
  settings: Record<string, unknown>;
  changeReason: string;
  items: TestSeriesItemInput[];
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown, field: string, min = 1, max = 500): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length < min) throw new TestSeriesError("SERIES_FIELD_REQUIRED", `${field} is required`);
  if (normalized.length > max) throw new TestSeriesError("SERIES_FIELD_TOO_LONG", `${field} is too long`);
  return normalized;
}

function optionalText(value: unknown, max = 12000): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length > max) throw new TestSeriesError("SERIES_FIELD_TOO_LONG", "A series text field is too long");
  return normalized;
}

function uuid(value: unknown, field: string): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)) {
    throw new TestSeriesError("INVALID_SERIES_IDENTIFIER", `${field} is invalid`);
  }
  return normalized;
}

function code(value: unknown): string {
  const normalized = text(value, "Series code", 3, 80).toUpperCase().replace(/[^A-Z0-9_-]+/g, "-");
  if (!normalized) throw new TestSeriesError("INVALID_SERIES_CODE", "Series code is invalid");
  return normalized;
}

export function normalizeTestSeriesInput(value: unknown): TestSeriesInput {
  const input = asRecord(value);
  const status = String(input.status ?? "draft") as TestSeriesStatus;
  if (!["draft", "active", "deprecated", "archived"].includes(status)) {
    throw new TestSeriesError("INVALID_SERIES_STATUS", "Series status is invalid");
  }
  const rawItems = Array.isArray(input.items) ? input.items : [];
  if (rawItems.length > 200) throw new TestSeriesError("TOO_MANY_SERIES_TESTS", "A series cannot contain more than 200 tests");
  const seen = new Set<string>();
  const items = rawItems.map((rawItem): TestSeriesItemInput => {
    const item = asRecord(rawItem);
    const testId = uuid(item.testId, "Test");
    if (seen.has(testId)) throw new TestSeriesError("DUPLICATE_SERIES_TEST", "A test can appear only once in a series version");
    seen.add(testId);
    const accessMode = String(item.accessMode ?? "included") as TestSeriesAccessMode;
    if (!["free", "included", "premium"].includes(accessMode)) {
      throw new TestSeriesError("INVALID_SERIES_ACCESS", "Series access mode is invalid");
    }
    return { testId, accessMode, availability: asRecord(item.availability) };
  });
  const validityRaw = input.validityDays;
  const validityDays = validityRaw == null || validityRaw === "" ? null : Number(validityRaw);
  if (validityDays != null && (!Number.isInteger(validityDays) || validityDays < 1 || validityDays > 3650)) {
    throw new TestSeriesError("INVALID_SERIES_VALIDITY", "Validity must be between 1 and 3650 days");
  }
  if (status === "active" && items.length === 0) {
    throw new TestSeriesError("ACTIVE_SERIES_EMPTY", "An active series must contain at least one test");
  }
  return {
    examVersionId: uuid(input.examVersionId, "Exam version"),
    code: code(input.code),
    name: text(input.name, "Series name", 3, 240),
    status,
    description: optionalText(input.description),
    validityDays,
    progressionRules: asRecord(input.progressionRules),
    settings: asRecord(input.settings),
    changeReason: text(input.changeReason, "Change reason", 3, 1000),
    items,
  };
}
