import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";

import { auth } from "../lib/firebase-admin";
import { sqlClient } from "../lib/db";
import {
  assertSeriesTestAccess,
  evaluateStudentSeriesEligibility,
  type StudentSeriesAttemptSummary,
  type StudentSeriesEligibility,
  type StudentSeriesMemberInput,
  type StudentSeriesProgressionMode,
} from "../lib/student-test-series";

const router: IRouter = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function authenticateStudent(req: Request, res: Response): Promise<boolean> {
  if (req.user) return true;
  if (!auth) {
    res.status(500).json({ error: "Authentication not configured", code: "AUTH_NOT_CONFIGURED" });
    return false;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Sign in to access this test series", code: "SERIES_AUTH_REQUIRED" });
    return false;
  }
  try {
    const decoded = await auth.verifyIdToken(authHeader.slice(7));
    req.user = {
      id: decoded.uid,
      email: decoded.email,
      displayName: typeof decoded.name === "string" ? decoded.name : undefined,
      emailVerified: decoded.email_verified,
    };
    return true;
  } catch {
    res.status(401).json({ error: "Your session is no longer valid", code: "SERIES_AUTH_INVALID" });
    return false;
  }
}

async function loadSeries(identifier: string) {
  const rows = await sqlClient`
    SELECT
      s.id::text AS id,
      s.exam_version_id::text AS "examVersionId",
      s.code,
      s.name,
      s.current_version_number AS "currentVersionNumber",
      s.deleted_at AS "deletedAt",
      v.id::text AS "versionId",
      v.description,
      v.availability_start_at AS "availabilityStartAt",
      v.availability_end_at AS "availabilityEndAt",
      v.progression_mode AS "progressionMode",
      v.completion_threshold::float8 AS "completionThreshold",
      v.configuration,
      e.code AS "examCode",
      e.name AS "examName",
      ef.code AS "examFamilyCode",
      ef.name AS "examFamilyName"
    FROM assessment.test_series s
    JOIN assessment.test_series_versions v
      ON v.series_id = s.id
     AND v.version_number = s.current_version_number
    JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    WHERE (
      (${isUuid(identifier)}::boolean AND s.id = ${isUuid(identifier) ? identifier : null}::uuid)
      OR lower(s.code) = lower(${identifier})
    )
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function loadSeriesMembers(seriesVersionId: string) {
  return sqlClient`
    SELECT
      item.id::text AS id,
      item.test_id::text AS "testId",
      item.sort_order AS "sortOrder",
      item.title_override AS "titleOverride",
      item.unlock_at AS "unlockAt",
      item.minimum_score::float8 AS "minimumScore",
      item.is_required AS "isRequired",
      item.configuration,
      t.public_code AS "publicCode",
      CASE
        WHEN t.status = 'live'::test_status
         AND publication.published_at IS NOT NULL
         AND (publication.closes_at IS NULL OR publication.closes_at > now())
        THEN 'live'
        ELSE 'unavailable'
      END AS "testStatus",
      version.title,
      version.description,
      version.duration_seconds AS "durationSeconds",
      version.total_marks::float8 AS "totalMarks",
      COALESCE((
        SELECT COUNT(*)::int
        FROM assessment.test_questions question
        WHERE question.test_version_id = version.id
      ), 0) AS "questionCount"
    FROM assessment.test_series_items item
    JOIN assessment.tests t ON t.id = item.test_id
    LEFT JOIN assessment.test_versions version ON version.id = t.published_version_id
    LEFT JOIN LATERAL (
      SELECT p.published_at, p.closes_at
      FROM assessment.test_publications p
      WHERE p.test_id = t.id
        AND p.test_version_id = t.published_version_id
        AND p.published_at IS NOT NULL
      ORDER BY p.publication_number DESC
      LIMIT 1
    ) publication ON true
    WHERE item.series_version_id = ${seriesVersionId}::uuid
    ORDER BY item.sort_order
  `;
}

async function loadStudentAttempts(firebaseUserId: string, seriesVersionId: string): Promise<StudentSeriesAttemptSummary[]> {
  const rows = await sqlClient`
    SELECT
      publication.test_id::text AS "testId",
      COUNT(*)::int AS "attemptCount",
      MAX(attempt.final_score)::float8 AS "bestScore",
      MAX(attempt.submitted_at) AS "lastAttemptAt"
    FROM learning.attempts attempt
    JOIN identity.auth_identities identity
      ON identity.user_id = attempt.user_id
     AND identity.provider = 'firebase'
    JOIN assessment.test_publications publication
      ON publication.id = attempt.test_publication_id
    JOIN assessment.test_series_items item
      ON item.test_id = publication.test_id
     AND item.series_version_id = ${seriesVersionId}::uuid
    WHERE identity.provider_subject = ${firebaseUserId}
      AND attempt.status = 'evaluated'
    GROUP BY publication.test_id
  `;
  return rows.map((row) => ({
    testId: String(row.testId),
    attemptCount: Number(row.attemptCount ?? 0),
    bestScore: row.bestScore == null ? null : Number(row.bestScore),
    lastAttemptAt: row.lastAttemptAt == null ? null : new Date(String(row.lastAttemptAt)).toISOString(),
  }));
}

async function buildSeriesDetail(identifier: string, firebaseUserId: string) {
  const series = await loadSeries(identifier);
  if (!series || series.deletedAt) return null;
  const memberRows = await loadSeriesMembers(String(series.versionId));
  const attempts = await loadStudentAttempts(firebaseUserId, String(series.versionId));
  const members: StudentSeriesMemberInput[] = memberRows.map((row) => ({
    id: String(row.id),
    testId: String(row.testId),
    sortOrder: Number(row.sortOrder),
    unlockAt: row.unlockAt == null ? null : new Date(String(row.unlockAt)).toISOString(),
    minimumScore: row.minimumScore == null ? null : Number(row.minimumScore),
    isRequired: Boolean(row.isRequired),
    testStatus: String(row.testStatus),
  }));
  const eligibility = evaluateStudentSeriesEligibility({
    deletedAt: series.deletedAt == null ? null : String(series.deletedAt),
    availabilityStartAt: series.availabilityStartAt == null ? null : String(series.availabilityStartAt),
    availabilityEndAt: series.availabilityEndAt == null ? null : String(series.availabilityEndAt),
    progressionMode: String(series.progressionMode) as StudentSeriesProgressionMode,
    completionThreshold: series.completionThreshold == null ? null : Number(series.completionThreshold),
    members,
    attempts,
  });
  const eligibilityByTest = new Map(eligibility.members.map((member) => [member.testId, member]));
  const enrichedMembers = memberRows.map((row) => {
    const state = eligibilityByTest.get(String(row.testId));
    if (!state) throw new Error(`Series eligibility missing for test ${String(row.testId)}`);
    return {
      ...state,
      id: String(row.id),
      testId: String(row.testId),
      publicCode: String(row.publicCode ?? ""),
      sortOrder: Number(row.sortOrder),
      title: String(row.titleOverride || row.title || "Untitled test"),
      description: row.description == null ? null : String(row.description),
      durationSeconds: Number(row.durationSeconds ?? 0),
      totalMarks: Number(row.totalMarks ?? 0),
      questionCount: Number(row.questionCount ?? 0),
      isRequired: Boolean(row.isRequired),
    };
  });
  return {
    series: {
      id: String(series.id),
      code: String(series.code),
      name: String(series.name),
      description: String(series.description ?? ""),
      examVersionId: String(series.examVersionId),
      examCode: String(series.examCode),
      examName: String(series.examName),
      examFamilyCode: String(series.examFamilyCode),
      examFamilyName: String(series.examFamilyName),
      versionNumber: Number(series.currentVersionNumber),
      availabilityStartAt: series.availabilityStartAt == null ? null : new Date(String(series.availabilityStartAt)).toISOString(),
      availabilityEndAt: series.availabilityEndAt == null ? null : new Date(String(series.availabilityEndAt)).toISOString(),
      progressionMode: String(series.progressionMode),
      completionThreshold: series.completionThreshold == null ? null : Number(series.completionThreshold),
    },
    eligibility: {
      ...eligibility,
      members: enrichedMembers,
    },
    generatedAt: new Date().toISOString(),
  };
}

async function resolveTestIdentifier(identifier: string): Promise<string | null> {
  if (!identifier) return null;
  const rows = await sqlClient`
    SELECT t.id::text AS id
    FROM assessment.tests t
    WHERE (
      (${isUuid(identifier)}::boolean AND t.id = ${isUuid(identifier) ? identifier : null}::uuid)
      OR lower(t.public_code) = lower(${identifier})
    )
    LIMIT 1
  `;
  return rows[0]?.id ? String(rows[0].id) : null;
}

async function findBoundSeries(testId: string) {
  return sqlClient`
    SELECT s.id::text AS id, s.code, s.name
    FROM assessment.test_series s
    JOIN assessment.test_series_versions version
      ON version.series_id = s.id
     AND version.version_number = s.current_version_number
    JOIN assessment.test_series_items item
      ON item.series_version_id = version.id
     AND item.test_id = ${testId}::uuid
    WHERE s.deleted_at IS NULL
    ORDER BY s.updated_at DESC
  `;
}

router.get("/test-series", async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        s.id::text AS id,
        s.code,
        s.name,
        COALESCE(version.description, '') AS description,
        version.availability_start_at AS "availabilityStartAt",
        version.availability_end_at AS "availabilityEndAt",
        version.progression_mode AS "progressionMode",
        version.completion_threshold::float8 AS "completionThreshold",
        e.code AS "examCode",
        e.name AS "examName",
        ef.code AS "examFamilyCode",
        ef.name AS "examFamilyName",
        COUNT(item.id)::int AS "testCount",
        COUNT(item.id) FILTER (
          WHERE test.status = 'live'::test_status
            AND publication.published_at IS NOT NULL
            AND (publication.closes_at IS NULL OR publication.closes_at > now())
        )::int AS "liveTestCount",
        COUNT(item.id) FILTER (
          WHERE test.status = 'live'::test_status
            AND publication.published_at IS NOT NULL
            AND (publication.closes_at IS NULL OR publication.closes_at > now())
            AND COALESCE(published.settings->>'testType', 'full_mock') <> 'sectional'
        )::int AS "fullLengthTestCount",
        COALESCE(SUM(published.duration_seconds) FILTER (
          WHERE test.status = 'live'::test_status
            AND publication.published_at IS NOT NULL
            AND (publication.closes_at IS NULL OR publication.closes_at > now())
        ), 0)::int AS "durationSeconds",
        COALESCE(SUM((
          SELECT COUNT(*)::int
          FROM assessment.test_questions question
          WHERE question.test_version_id = published.id
        )) FILTER (
          WHERE test.status = 'live'::test_status
            AND publication.published_at IS NOT NULL
            AND (publication.closes_at IS NULL OR publication.closes_at > now())
        ), 0)::int AS "questionCount",
        COALESCE((
          SELECT COUNT(*)::int
          FROM learning.attempts attempt
          JOIN assessment.test_publications attempt_publication
            ON attempt_publication.id = attempt.test_publication_id
          JOIN assessment.test_series_items attempted_item
            ON attempted_item.test_id = attempt_publication.test_id
           AND attempted_item.series_version_id = version.id
          WHERE attempt.status = 'evaluated'
        ), 0)::int AS "attemptCount"
      FROM assessment.test_series s
      JOIN assessment.test_series_versions version
        ON version.series_id = s.id
       AND version.version_number = s.current_version_number
      JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      JOIN assessment.test_series_items item ON item.series_version_id = version.id
      JOIN assessment.tests test ON test.id = item.test_id AND test.deleted_at IS NULL
      LEFT JOIN assessment.test_versions published ON published.id = test.published_version_id
      LEFT JOIN LATERAL (
        SELECT p.published_at, p.closes_at
        FROM assessment.test_publications p
        WHERE p.test_id = test.id
          AND p.test_version_id = test.published_version_id
          AND p.published_at IS NOT NULL
        ORDER BY p.publication_number DESC
        LIMIT 1
      ) publication ON true
      WHERE s.deleted_at IS NULL
        AND (version.availability_end_at IS NULL OR version.availability_end_at > now())
      GROUP BY s.id, version.id, e.id, ef.id
      HAVING COUNT(item.id) FILTER (
        WHERE test.status = 'live'::test_status
          AND publication.published_at IS NOT NULL
          AND (publication.closes_at IS NULL OR publication.closes_at > now())
      ) > 0
      ORDER BY "attemptCount" DESC, (version.availability_start_at > now()) DESC, s.updated_at DESC
      LIMIT 200
    `;
    res.json({ series: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Unable to list canonical test series", error);
    res.status(500).json({ error: "Unable to load test series" });
  }
});

router.get("/test-series/:id", async (req, res) => {
  if (!(await authenticateStudent(req, res))) return;
  try {
    const detail = await buildSeriesDetail(asString(req.params.id), req.user!.id);
    if (!detail) {
      res.status(404).json({ error: "Test series not found", code: "TEST_SERIES_NOT_FOUND" });
      return;
    }
    res.json(detail);
  } catch (error) {
    console.error("Unable to load student test series", error);
    res.status(500).json({ error: "Unable to load test series" });
  }
});

async function enforceSeriesAccess(req: Request, res: Response, next: NextFunction, identifier: string, seriesId: string) {
  try {
    const testId = await resolveTestIdentifier(identifier);
    if (!testId) return next();
    const bindings = await findBoundSeries(testId);
    if (bindings.length === 0) return next();
    if (!seriesId) {
      res.status(403).json({
        error: "Open this test from its test series.",
        code: "SERIES_CONTEXT_REQUIRED",
        series: bindings.map((row) => ({ id: String(row.id), code: String(row.code), name: String(row.name) })),
      });
      return;
    }
    const selected = bindings.find((row) => String(row.id) === seriesId || String(row.code).toLowerCase() === seriesId.toLowerCase());
    if (!selected) {
      res.status(403).json({ error: "This test does not belong to the selected series", code: "SERIES_CONTEXT_INVALID" });
      return;
    }
    if (!(await authenticateStudent(req, res))) return;
    const detail = await buildSeriesDetail(String(selected.id), req.user!.id);
    if (!detail) {
      res.status(404).json({ error: "Test series not found", code: "TEST_SERIES_NOT_FOUND" });
      return;
    }
    assertSeriesTestAccess(detail.eligibility as StudentSeriesEligibility, testId);
    return next();
  } catch (error) {
    const typed = error as { message?: string; code?: string; statusCode?: number };
    res.status(typed.statusCode ?? 500).json({
      error: typed.message ?? "Unable to verify series access",
      code: typed.code ?? "SERIES_ACCESS_CHECK_FAILED",
    });
  }
}

router.get("/tests/:id", async (req, res, next) => {
  const identifier = asString(req.params.id);
  const seriesId = asString(req.query.seriesId);
  await enforceSeriesAccess(req, res, next, identifier, seriesId);
});

router.post("/attempts", async (req, res, next) => {
  const identifier = asString(req.body?.testId);
  const seriesId = asString(req.body?.seriesId);
  await enforceSeriesAccess(req, res, next, identifier, seriesId);
});

export default router;
