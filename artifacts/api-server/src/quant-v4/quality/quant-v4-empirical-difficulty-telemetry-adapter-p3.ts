import type {
  EmpiricalDifficultyObservation,
} from "./quant-v4-empirical-difficulty-calibration-p2";

export const QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_ADAPTER_AUTHORITY =
  "QUANT-V4-EMPIRICAL-DIFFICULTY-TELEMETRY-ADAPTER-P3" as const;

export interface QuantV4EmpiricalDifficultyTelemetryQuery {
  readonly questionVersionId: string;
  readonly examProfile: string;
  readonly catalogExamCodes: readonly string[];
  readonly lookbackDays?: number;
}

export interface QuantV4EmpiricalDifficultyTelemetryRow {
  readonly questionVersionId: string;
  readonly learnerId: string;
  readonly attemptId: string;
  readonly attemptStatus: string;
  readonly attemptType: unknown;
  readonly isCorrect: boolean | null;
  readonly timeSpentSeconds: number | string | null;
  readonly evaluatedAt: string | Date | null;
  readonly attemptScorePercent: number | string | null;
  readonly examCode: string;
}

export interface QuantV4EmpiricalDifficultyTelemetryExtraction {
  readonly authority: typeof QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_ADAPTER_AUTHORITY;
  readonly examProfile: string;
  readonly questionVersionId: string;
  readonly catalogExamCodes: readonly string[];
  readonly observations: readonly EmpiricalDifficultyObservation[];
  readonly droppedRows: number;
  readonly blockers: readonly string[];
}

export const QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_SQL = String.raw`
SELECT
  response.question_version_id::text AS "questionVersionId",
  attempt.user_id::text AS "learnerId",
  attempt.id::text AS "attemptId",
  attempt.status::text AS "attemptStatus",
  attempt.result_snapshot ->> 'attemptType' AS "attemptType",
  response.is_correct AS "isCorrect",
  response.time_spent_seconds AS "timeSpentSeconds",
  attempt.evaluated_at AS "evaluatedAt",
  attempt.final_score AS "attemptScorePercent",
  exam.code AS "examCode"
FROM learning.attempt_responses response
JOIN learning.attempts attempt
  ON attempt.id = response.attempt_id
JOIN assessment.test_publications publication
  ON publication.id = attempt.test_publication_id
JOIN assessment.tests test
  ON test.id = publication.test_id
JOIN catalog.exam_versions exam_version
  ON exam_version.id = test.exam_version_id
JOIN catalog.exams exam
  ON exam.id = exam_version.exam_id
WHERE response.question_version_id = $1::uuid
  AND exam.code = ANY($2::text[])
  AND attempt.status::text IN ('evaluated', 'practice_evaluated')
  AND attempt.evaluated_at >= now() - make_interval(days => $3::int)
ORDER BY attempt.evaluated_at ASC, attempt.id ASC
`.trim();

function textValue(value: unknown): string {
  return String(value ?? "").trim();
}

function finiteNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isoTimestamp(value: unknown): string | null {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}

function attemptType(value: unknown, status: string): "REAL" | "PRACTICE" | null {
  const normalized = textValue(value).toUpperCase();
  if (normalized === "REAL" || normalized === "PRACTICE") return normalized;
  if (status === "evaluated") return "REAL";
  if (status === "practice_evaluated") return "PRACTICE";
  return null;
}

export function validateQuantV4EmpiricalDifficultyTelemetryQuery(
  input: QuantV4EmpiricalDifficultyTelemetryQuery,
): void {
  if (!textValue(input.questionVersionId)) {
    throw new Error("Telemetry extraction requires questionVersionId.");
  }
  if (!textValue(input.examProfile)) {
    throw new Error("Telemetry extraction requires an explicit Quant examProfile.");
  }
  if (!input.catalogExamCodes.length || input.catalogExamCodes.some((code) => !textValue(code))) {
    throw new Error("Telemetry extraction requires at least one explicit catalog exam code.");
  }
  if (new Set(input.catalogExamCodes.map((code) => textValue(code).toUpperCase())).size !== input.catalogExamCodes.length) {
    throw new Error("Telemetry extraction catalog exam codes must be unique.");
  }
  const days = input.lookbackDays ?? 365;
  if (!Number.isInteger(days) || days < 1 || days > 3650) {
    throw new Error("Telemetry extraction lookbackDays must be an integer between 1 and 3650.");
  }
}

export function quantV4EmpiricalDifficultyTelemetrySqlParams(
  input: QuantV4EmpiricalDifficultyTelemetryQuery,
): readonly [string, readonly string[], number] {
  validateQuantV4EmpiricalDifficultyTelemetryQuery(input);
  return Object.freeze([
    input.questionVersionId.trim(),
    Object.freeze(input.catalogExamCodes.map((code) => code.trim())),
    input.lookbackDays ?? 365,
  ]);
}

export function extractQuantV4EmpiricalDifficultyObservations(input: {
  readonly query: QuantV4EmpiricalDifficultyTelemetryQuery;
  readonly rows: readonly QuantV4EmpiricalDifficultyTelemetryRow[];
}): QuantV4EmpiricalDifficultyTelemetryExtraction {
  validateQuantV4EmpiricalDifficultyTelemetryQuery(input.query);
  const allowedExamCodes = new Set(input.query.catalogExamCodes.map((code) => code.trim().toUpperCase()));
  const observations: EmpiricalDifficultyObservation[] = [];
  let droppedRows = 0;

  for (const row of input.rows) {
    if (textValue(row.questionVersionId) !== input.query.questionVersionId.trim()) {
      droppedRows += 1;
      continue;
    }
    if (!allowedExamCodes.has(textValue(row.examCode).toUpperCase())) {
      droppedRows += 1;
      continue;
    }

    const learnerId = textValue(row.learnerId);
    const attemptId = textValue(row.attemptId);
    const status = textValue(row.attemptStatus);
    const evaluatedAt = isoTimestamp(row.evaluatedAt);
    const type = attemptType(row.attemptType, status);
    if (!learnerId || !attemptId || !evaluatedAt || !type) {
      droppedRows += 1;
      continue;
    }

    const seconds = finiteNumber(row.timeSpentSeconds);
    observations.push(Object.freeze({
      questionVersionId: input.query.questionVersionId.trim(),
      learnerId,
      attemptId,
      examProfile: input.query.examProfile.trim(),
      attemptType: type,
      isCorrect: row.isCorrect === true ? true : row.isCorrect === false ? false : null,
      timeSpentSeconds: seconds != null && seconds >= 0 ? seconds : null,
      attemptedAt: evaluatedAt,
      attemptScorePercent: finiteNumber(row.attemptScorePercent),
    }));
  }

  const blockers: string[] = [];
  if (!observations.length) blockers.push("NO_MATCHING_CANONICAL_TELEMETRY");

  return Object.freeze({
    authority: QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_ADAPTER_AUTHORITY,
    examProfile: input.query.examProfile.trim(),
    questionVersionId: input.query.questionVersionId.trim(),
    catalogExamCodes: Object.freeze(input.query.catalogExamCodes.map((code) => code.trim())),
    observations: Object.freeze(observations),
    droppedRows,
    blockers: Object.freeze(blockers),
  });
}
