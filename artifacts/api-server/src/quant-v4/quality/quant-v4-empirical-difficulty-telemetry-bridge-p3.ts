import type {
  EmpiricalDifficultyObservation,
} from "./quant-v4-empirical-difficulty-calibration-p2";

export const QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_BRIDGE_AUTHORITY =
  "QUANT-V4-EMPIRICAL-DIFFICULTY-TELEMETRY-BRIDGE-P3" as const;

export interface QuantV4DifficultyCatalogIdentity {
  readonly publicationId: string;
  readonly testId: string;
  readonly testVersionId: string;
  readonly testPublicCode: string;
  readonly testTitle: string;
  readonly examCode: string;
  readonly examName: string;
  readonly examFamilyCode: string;
  readonly examFamilyName: string;
}

export interface QuantV4DifficultyTelemetryRow extends QuantV4DifficultyCatalogIdentity {
  readonly attemptId: string;
  readonly learnerId: string;
  readonly attemptStatus: string;
  readonly evaluatedAt: string | Date | null;
  readonly resultSnapshot: unknown;
  readonly finalScore: number | string | null;
  readonly questionVersionId: string;
  readonly isCorrect: boolean | null;
  readonly timeSpentSeconds: number | string | null;
  readonly answeredAt: string | Date | null;
}

export interface QuantV4DifficultyProfileResolution {
  readonly examProfile: string | null;
  readonly authority: string;
}

export type QuantV4DifficultyProfileResolver = (
  identity: QuantV4DifficultyCatalogIdentity,
) => QuantV4DifficultyProfileResolution;

export interface QuantV4DifficultyTelemetryBridgeResult {
  readonly authority: typeof QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_BRIDGE_AUTHORITY;
  readonly observations: readonly EmpiricalDifficultyObservation[];
  readonly unresolvedProfileRows: number;
  readonly invalidRows: number;
  readonly practiceRows: number;
  readonly realRows: number;
  readonly profileResolutionAuthorities: readonly string[];
}

export const QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_SQL = String.raw`
SELECT
  a.id::text AS "attemptId",
  a.user_id::text AS "learnerId",
  a.status::text AS "attemptStatus",
  a.evaluated_at AS "evaluatedAt",
  a.result_snapshot AS "resultSnapshot",
  a.final_score AS "finalScore",
  ar.question_version_id::text AS "questionVersionId",
  ar.is_correct AS "isCorrect",
  ar.time_spent_seconds AS "timeSpentSeconds",
  ar.answered_at AS "answeredAt",
  p.id::text AS "publicationId",
  p.test_id::text AS "testId",
  p.test_version_id::text AS "testVersionId",
  t.public_code AS "testPublicCode",
  tv.title AS "testTitle",
  exam.code AS "examCode",
  exam.name AS "examName",
  family.code AS "examFamilyCode",
  family.name AS "examFamilyName"
FROM learning.attempt_responses ar
JOIN learning.attempts a ON a.id = ar.attempt_id
JOIN assessment.test_publications p ON p.id = a.test_publication_id
JOIN assessment.tests t ON t.id = p.test_id
JOIN assessment.test_versions tv ON tv.id = p.test_version_id
JOIN catalog.exam_versions exam_version ON exam_version.id = t.exam_version_id
JOIN catalog.exams exam ON exam.id = exam_version.exam_id
JOIN catalog.exam_families family ON family.id = exam.family_id
WHERE a.status::text IN ('evaluated', 'practice_evaluated')
  AND a.evaluated_at IS NOT NULL
  AND ar.question_version_id IS NOT NULL
`;

function text(value: unknown): string {
  return String(value ?? "").trim();
}

function finiteNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function iso(value: string | Date | null): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.valueOf()) ? date.toISOString() : null;
}

function snapshotAttemptType(snapshot: unknown): "REAL" | "PRACTICE" | null {
  if (!snapshot || typeof snapshot !== "object") return null;
  const value = text((snapshot as Record<string, unknown>).attemptType).toUpperCase();
  return value === "REAL" || value === "PRACTICE" ? value : null;
}

function attemptType(row: QuantV4DifficultyTelemetryRow): "REAL" | "PRACTICE" {
  const fromSnapshot = snapshotAttemptType(row.resultSnapshot);
  if (fromSnapshot) return fromSnapshot;
  return row.attemptStatus === "practice_evaluated" ? "PRACTICE" : "REAL";
}

function catalogIdentity(row: QuantV4DifficultyTelemetryRow): QuantV4DifficultyCatalogIdentity {
  return Object.freeze({
    publicationId: text(row.publicationId),
    testId: text(row.testId),
    testVersionId: text(row.testVersionId),
    testPublicCode: text(row.testPublicCode),
    testTitle: text(row.testTitle),
    examCode: text(row.examCode),
    examName: text(row.examName),
    examFamilyCode: text(row.examFamilyCode),
    examFamilyName: text(row.examFamilyName),
  });
}

export function bridgeQuantV4EmpiricalDifficultyTelemetry(input: {
  readonly rows: readonly QuantV4DifficultyTelemetryRow[];
  readonly resolveExamProfile: QuantV4DifficultyProfileResolver;
}): QuantV4DifficultyTelemetryBridgeResult {
  const observations: EmpiricalDifficultyObservation[] = [];
  const authorities = new Set<string>();
  let unresolvedProfileRows = 0;
  let invalidRows = 0;
  let practiceRows = 0;
  let realRows = 0;

  for (const row of input.rows) {
    const questionVersionId = text(row.questionVersionId);
    const learnerId = text(row.learnerId);
    const attemptId = text(row.attemptId);
    const attemptedAt = iso(row.evaluatedAt) ?? iso(row.answeredAt);
    if (!questionVersionId || !learnerId || !attemptId || !attemptedAt) {
      invalidRows += 1;
      continue;
    }

    const resolution = input.resolveExamProfile(catalogIdentity(row));
    if (resolution.authority) authorities.add(resolution.authority);
    if (!resolution.examProfile) {
      unresolvedProfileRows += 1;
      continue;
    }

    const type = attemptType(row);
    if (type === "PRACTICE") practiceRows += 1;
    else realRows += 1;

    observations.push(Object.freeze({
      questionVersionId,
      learnerId,
      attemptId,
      examProfile: resolution.examProfile,
      attemptType: type,
      isCorrect: row.isCorrect,
      timeSpentSeconds: finiteNumber(row.timeSpentSeconds),
      attemptedAt,
      attemptScorePercent: finiteNumber(row.finalScore),
    }));
  }

  return Object.freeze({
    authority: QUANT_V4_EMPIRICAL_DIFFICULTY_TELEMETRY_BRIDGE_AUTHORITY,
    observations: Object.freeze(observations),
    unresolvedProfileRows,
    invalidRows,
    practiceRows,
    realRows,
    profileResolutionAuthorities: Object.freeze([...authorities].sort()),
  });
}
