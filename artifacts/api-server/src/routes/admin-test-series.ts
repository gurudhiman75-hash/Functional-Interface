import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import {
  TestSeriesError,
  normalizeTestSeriesInput,
  seriesReadiness,
  type NormalizedTestSeriesInput,
} from "../lib/admin-test-series";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TestSeriesError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  const candidate = error as { code?: string };
  if (candidate?.code === "23505") {
    res.status(409).json({ error: "Series code, version or member order already exists", code: "TEST_SERIES_CONFLICT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

function assertSeriesId(value: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new TestSeriesError("INVALID_TEST_SERIES_ID", "Invalid test series identifier");
  }
  return value;
}

function withMockEligibilityBlocker(
  readiness: ReturnType<typeof seriesReadiness>,
  mockIneligibleQuestionCount: number,
) {
  if (mockIneligibleQuestionCount <= 0) return readiness;
  return {
    ready: false,
    blockers: [
      ...readiness.blockers,
      `${mockIneligibleQuestionCount} generated question(s) are explicitly ineligible for mock-test use`,
    ],
    warnings: readiness.warnings,
  };
}

async function assertReferences(client: SqlExecutor, input: NormalizedTestSeriesInput): Promise<void> {
  const exam = await client`
    SELECT id::text AS id
    FROM catalog.exam_versions
    WHERE id = ${input.examVersionId}::uuid
    LIMIT 1
  `;
  if (exam.length === 0) {
    throw new TestSeriesError("TEST_SERIES_EXAM_MISSING", "The selected exam version does not exist", 404);
  }

  const testIds = input.items.map((item) => item.testId);
  const tests = await client`
    SELECT
      t.id::text AS id,
      t.exam_version_id::text AS "examVersionId",
      t.status::text AS status,
      COALESCE((
        SELECT COUNT(*)::int
        FROM assessment.test_questions tq
        JOIN content.question_versions qv ON qv.id = tq.question_version_id
        WHERE tq.test_version_id = COALESCE(t.published_version_id, t.current_draft_version_id)
          AND qv.answer_model #>> '{generation,mockTestEligible}' = 'false'
      ), 0)::int AS "mockIneligibleQuestionCount"
    FROM assessment.tests t
    WHERE t.id = ANY(${testIds}::uuid[])
      AND t.deleted_at IS NULL
  `;
  const found = new Map(tests.map((row) => [String(row.id), row]));
  const missing = testIds.filter((id) => !found.has(id));
  if (missing.length > 0) {
    throw new TestSeriesError(
      "TEST_SERIES_TEST_MISSING",
      `${missing.length} selected test(s) do not exist or are archived`,
      409,
      { testIds: missing },
    );
  }
  const mismatched = tests.filter((row) => String(row.examVersionId) !== input.examVersionId).map((row) => String(row.id));
  if (mismatched.length > 0) {
    throw new TestSeriesError(
      "TEST_SERIES_EXAM_MISMATCH",
      "Every series member must belong to the selected exam version",
      409,
      { testIds: mismatched },
    );
  }
  const mockBlocked = tests
    .filter((row) => Number(row.mockIneligibleQuestionCount ?? 0) > 0)
    .map((row) => ({ testId: String(row.id), questionCount: Number(row.mockIneligibleQuestionCount) }));
  if (mockBlocked.length > 0) {
    throw new TestSeriesError(
      "TEST_SERIES_MOCK_QUESTION_INELIGIBLE",
      "A selected test contains generated questions that have not been enabled for mock-test use",
      409,
      { tests: mockBlocked },
    );
  }
}

async function insertSeriesVersion(
  client: SqlExecutor,
  seriesId: string,
  actorUserId: string,
  versionNumber: number,
  input: NormalizedTestSeriesInput,
): Promise<string> {
  const versionId = randomUUID();
  await client`
    INSERT INTO assessment.test_series_versions (
      id, series_id, version_number, description,
      availability_start_at, availability_end_at, progression_mode,
      completion_threshold, configuration, change_reason, created_by, created_at
    ) VALUES (
      ${versionId}::uuid,
      ${seriesId}::uuid,
      ${versionNumber},
      ${input.description},
      ${input.availabilityStartAt}::timestamptz,
      ${input.availabilityEndAt}::timestamptz,
      ${input.progressionMode},
      ${input.completionThreshold},
      ${client.json(input.configuration)},
      ${input.changeReason},
      ${actorUserId}::uuid,
      now()
    )
  `;

  for (let index = 0; index < input.items.length; index += 1) {
    const item = input.items[index]!;
    await client`
      INSERT INTO assessment.test_series_items (
        id, series_version_id, test_id, sort_order, title_override,
        unlock_at, minimum_score, is_required, configuration, created_at
      ) VALUES (
        ${randomUUID()}::uuid,
        ${versionId}::uuid,
        ${item.testId}::uuid,
        ${index + 1},
        ${item.titleOverride},
        ${item.unlockAt}::timestamptz,
        ${item.minimumScore},
        ${item.isRequired},
        ${client.json(item.configuration)},
        now()
      `;
  }
  return versionId;
}

async function loadSeriesDetail(seriesId: string, client: SqlExecutor = sqlClient) {
  const rows = await client`
    SELECT
      s.id::text AS id,
      s.exam_version_id::text AS "examVersionId",
      s.code,
      s.name,
      s.current_version_number AS "currentVersionNumber",
      s.created_by::text AS "createdBy",
      s.created_at AS "createdAt",
      s.updated_at AS "updatedAt",
      s.deleted_at AS "deletedAt",
      ev.version_number AS "examVersionNumber",
      ev.name AS "examVersionName",
      e.code AS "examCode",
      e.name AS "examName",
      ef.name AS "examFamilyName"
    FROM assessment.test_series s
    JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    WHERE s.id = ${seriesId}::uuid
    LIMIT 1
  `;
  const series = rows[0];
  if (!series) return null;

  const versions = await client`
    SELECT
      v.id::text AS id,
      v.version_number AS "versionNumber",
      v.description,
      v.availability_start_at AS "availabilityStartAt",
      v.availability_end_at AS "availabilityEndAt",
      v.progression_mode AS "progressionMode",
      v.completion_threshold::float8 AS "completionThreshold",
      v.configuration,
      v.change_reason AS "changeReason",
      v.created_by::text AS "createdBy",
      v.created_at AS "createdAt",
      (SELECT COUNT(*)::int FROM assessment.test_series_items i WHERE i.series_version_id = v.id) AS "itemCount"
    FROM assessment.test_series_versions v
    WHERE v.series_id = ${seriesId}::uuid
    ORDER BY v.version_number DESC
  `;
  const currentVersion = versions.find(
    (version) => Number(version.versionNumber) === Number(series.currentVersionNumber),
  ) ?? null;

  const items = currentVersion
    ? await client`
        SELECT
          i.id::text AS id,
          i.test_id::text AS "testId",
          i.sort_order AS "sortOrder",
          i.title_override AS "titleOverride",
          i.unlock_at AS "unlockAt",
          i.minimum_score::float8 AS "minimumScore",
          i.is_required AS "isRequired",
          i.configuration,
          t.public_code AS "publicCode",
          t.status::text AS status,
          COALESCE(tv.title, t.public_code) AS title,
          tv.duration_seconds AS "durationSeconds",
          tv.total_marks::float8 AS "totalMarks",
          COALESCE((
            SELECT COUNT(*)::int
            FROM assessment.test_questions tq
            JOIN content.question_versions qv ON qv.id = tq.question_version_id
            WHERE tq.test_version_id = COALESCE(t.published_version_id, t.current_draft_version_id)
              AND qv.answer_model #>> '{generation,mockTestEligible}' = 'false'
          ), 0)::int AS "mockIneligibleQuestionCount"
        FROM assessment.test_series_items i
        JOIN assessment.tests t ON t.id = i.test_id
        LEFT JOIN assessment.test_versions tv
          ON tv.id = COALESCE(t.published_version_id, t.current_draft_version_id)
        WHERE i.series_version_id = ${String(currentVersion.id)}::uuid
        ORDER BY i.sort_order
      `
    : [];

  const mockIneligibleQuestionCount = items.reduce(
    (sum, item) => sum + Number(item.mockIneligibleQuestionCount ?? 0),
    0,
  );
  const readiness = withMockEligibilityBlocker(seriesReadiness({
    deletedAt: series.deletedAt ? String(series.deletedAt) : null,
    itemCount: items.length,
    availabilityStartAt: currentVersion?.availabilityStartAt ? String(currentVersion.availabilityStartAt) : null,
    availabilityEndAt: currentVersion?.availabilityEndAt ? String(currentVersion.availabilityEndAt) : null,
    memberStatuses: items.map((item) => String(item.status)),
  }), mockIneligibleQuestionCount);

  return { series, versions, currentVersion, items, readiness, generatedAt: new Date().toISOString() };
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const [examVersions, tests] = await Promise.all([
      sqlClient`
        SELECT
          ev.id::text AS id,
          ev.version_number AS "versionNumber",
          ev.name AS "versionName",
          e.code AS "examCode",
          e.name AS "examName",
          ef.name AS "examFamilyName"
        FROM catalog.exam_versions ev
        JOIN catalog.exams e ON e.id = ev.exam_id
        JOIN catalog.exam_families ef ON ef.id = e.family_id
        ORDER BY ef.name, e.name, ev.version_number DESC
      `,
      sqlClient`
        SELECT
          t.id::text AS id,
          t.public_code AS "publicCode",
          t.exam_version_id::text AS "examVersionId",
          t.status::text AS status,
          COALESCE(tv.title, t.public_code) AS title,
          tv.duration_seconds AS "durationSeconds",
          tv.total_marks::float8 AS "totalMarks",
          t.updated_at AS "updatedAt",
          COALESCE((
            SELECT COUNT(*)::int
            FROM assessment.test_questions tq
            JOIN content.question_versions qv ON qv.id = tq.question_version_id
            WHERE tq.test_version_id = COALESCE(t.published_version_id, t.current_draft_version_id)
              AND qv.answer_model #>> '{generation,mockTestEligible}' = 'false'
          ), 0)::int AS "mockIneligibleQuestionCount"
        FROM assessment.tests t
        LEFT JOIN assessment.test_versions tv
          ON tv.id = COALESCE(t.published_version_id, t.current_draft_version_id)
        WHERE t.deleted_at IS NULL
        ORDER BY t.updated_at DESC
        LIMIT 5000
      `,
    ]);
    res.json({ examVersions, tests, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load test series catalog");
  }
});

router.get("/", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        s.id::text AS id,
        s.exam_version_id::text AS "examVersionId",
        s.code,
        s.name,
        s.current_version_number AS "currentVersionNumber",
        s.created_at AS "createdAt",
        s.updated_at AS "updatedAt",
        s.deleted_at AS "deletedAt",
        e.code AS "examCode",
        e.name AS "examName",
        ef.name AS "examFamilyName",
        v.description,
        v.availability_start_at AS "availabilityStartAt",
        v.availability_end_at AS "availabilityEndAt",
        v.progression_mode AS "progressionMode",
        v.completion_threshold::float8 AS "completionThreshold",
        COALESCE(stats.item_count, 0)::int AS "itemCount",
        COALESCE(stats.member_statuses, '{}') AS "memberStatuses",
        COALESCE(stats.mock_ineligible_question_count, 0)::int AS "mockIneligibleQuestionCount"
      FROM assessment.test_series s
      JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      LEFT JOIN assessment.test_series_versions v
        ON v.series_id = s.id
       AND v.version_number = s.current_version_number
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::int AS item_count,
          COALESCE(array_agg(t.status::text ORDER BY i.sort_order), '{}') AS member_statuses,
          COALESCE(SUM((
            SELECT COUNT(*)::int
            FROM assessment.test_questions tq
            JOIN content.question_versions qv ON qv.id = tq.question_version_id
            WHERE tq.test_version_id = COALESCE(t.published_version_id, t.current_draft_version_id)
              AND qv.answer_model #>> '{generation,mockTestEligible}' = 'false'
          )), 0)::int AS mock_ineligible_question_count
        FROM assessment.test_series_items i
        JOIN assessment.tests t ON t.id = i.test_id
        WHERE i.series_version_id = v.id
      ) stats ON true
      ORDER BY (s.deleted_at IS NOT NULL), s.updated_at DESC
      LIMIT 1000
    `;
    const series = rows.map((row) => ({
      ...row,
      readiness: withMockEligibilityBlocker(seriesReadiness({
        deletedAt: row.deletedAt ? String(row.deletedAt) : null,
        itemCount: Number(row.itemCount),
        availabilityStartAt: row.availabilityStartAt ? String(row.availabilityStartAt) : null,
        availabilityEndAt: row.availabilityEndAt ? String(row.availabilityEndAt) : null,
        memberStatuses: Array.isArray(row.memberStatuses) ? row.memberStatuses.map(String) : [],
      }), Number(row.mockIneligibleQuestionCount ?? 0)),
    }));
    res.json({ series, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load test series");
  }
});

router.get("/:id", requireAdminPermission("tests.read"), async (req, res) => {
  try {
    const detail = await loadSeriesDetail(assertSeriesId(req.params.id));
    if (!detail) {
      res.status(404).json({ error: "Test series not found", code: "TEST_SERIES_NOT_FOUND" });
      return;
    }
    res.json(detail);
  } catch (error) {
    sendError(res, error, "Unable to load test series");
  }
});

router.post("/", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeTestSeriesInput(req.body);
    await assertReferences(sqlClient, input);
    const seriesId = randomUUID();
    const detail = await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO assessment.test_series (
          id, exam_version_id, code, name, current_version_number,
          created_by, created_at, updated_at
        ) VALUES (
          ${seriesId}::uuid,
          ${input.examVersionId}::uuid,
          ${input.code},
          ${input.name},
          1,
          ${actorUserId}::uuid,
          now(),
          now()
        )
      `;
      const versionId = await insertSeriesVersion(tx as SqlExecutor, seriesId, actorUserId, 1, input);
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'assessment.test_series.created',
          'test_series',
          ${seriesId}::uuid,
          ${versionId}::uuid,
          ${input.changeReason},
          ${`Created test series ${input.code}`},
          ${tx.json({ versionNumber: 1, itemCount: input.items.length, progressionMode: input.progressionMode })}
        )
      `;
      return loadSeriesDetail(seriesId, tx as SqlExecutor);
    });
    res.status(201).json(detail);
  } catch (error) {
    sendError(res, error, "Unable to create test series");
  }
});

router.put("/:id", requireAdminPermission("tests.update"), async (req, res) => {
  try {
    const seriesId = assertSeriesId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeTestSeriesInput(req.body);
    await assertReferences(sqlClient, input);
    const detail = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT id::text AS id, code, current_version_number AS "currentVersionNumber", deleted_at AS "deletedAt"
        FROM assessment.test_series
        WHERE id = ${seriesId}::uuid
        FOR UPDATE
      `;
      const current = rows[0];
      if (!current) throw new TestSeriesError("TEST_SERIES_NOT_FOUND", "Test series not found", 404);
      if (current.deletedAt) throw new TestSeriesError("TEST_SERIES_ARCHIVED", "Restore the series before editing", 409);
      if (input.expectedCurrentVersionNumber !== Number(current.currentVersionNumber)) {
        throw new TestSeriesError(
          "TEST_SERIES_VERSION_CONFLICT",
          "This series changed after you opened it. Refresh before saving.",
          409,
        );
      }
      const nextVersionNumber = Number(current.currentVersionNumber) + 1;
      const versionId = await insertSeriesVersion(tx as SqlExecutor, seriesId, actorUserId, nextVersionNumber, input);
      await tx`
        UPDATE assessment.test_series
        SET
          exam_version_id = ${input.examVersionId}::uuid,
          code = ${input.code},
          name = ${input.name},
          current_version_number = ${nextVersionNumber},
          updated_at = now()
        WHERE id = ${seriesId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'assessment.test_series.version.created',
          'test_series',
          ${seriesId}::uuid,
          ${versionId}::uuid,
          ${input.changeReason},
          ${`Created test series version ${nextVersionNumber} for ${input.code}`},
          ${tx.json({ previousVersionNumber: current.currentVersionNumber, versionNumber: nextVersionNumber, itemCount: input.items.length })}
        )
      `;
      return loadSeriesDetail(seriesId, tx as SqlExecutor);
    });
    res.json(detail);
  } catch (error) {
    sendError(res, error, "Unable to update test series");
  }
});

for (const action of ["archive", "restore"] as const) {
  router.post(`/:id/actions/${action}`, requireAdminPermission("tests.update"), async (req, res) => {
    try {
      const seriesId = assertSeriesId(req.params.id);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
      if (reason.length < 3) throw new TestSeriesError("TEST_SERIES_ACTION_REASON_REQUIRED", "A reason is required");
      const detail = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT id::text AS id, code, current_version_number AS "currentVersionNumber", deleted_at AS "deletedAt"
          FROM assessment.test_series
          WHERE id = ${seriesId}::uuid
          FOR UPDATE
        `;
        const current = rows[0];
        if (!current) throw new TestSeriesError("TEST_SERIES_NOT_FOUND", "Test series not found", 404);
        if (action === "archive" && current.deletedAt) {
          throw new TestSeriesError("TEST_SERIES_ALREADY_ARCHIVED", "The series is already archived", 409);
        }
        if (action === "restore" && !current.deletedAt) {
          throw new TestSeriesError("TEST_SERIES_ALREADY_ACTIVE", "The series is already active", 409);
        }
        if (action === "archive") {
          await tx`UPDATE assessment.test_series SET deleted_at = now(), updated_at = now() WHERE id = ${seriesId}::uuid`;
        } else {
          await tx`UPDATE assessment.test_series SET deleted_at = NULL, updated_at = now() WHERE id = ${seriesId}::uuid`;
        }
        const actionKey = action === "archive" ? "assessment.test_series.archived" : "assessment.test_series.restored";
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id,
            reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${actionKey},
            'test_series',
            ${seriesId}::uuid,
            ${reason},
            ${`${String(current.code)} ${action}d`},
            ${tx.json({ currentVersionNumber: current.currentVersionNumber })}
          )
        `;
        return loadSeriesDetail(seriesId, tx as SqlExecutor);
      });
      res.json(detail);
    } catch (error) {
      sendError(res, error, `Unable to ${action} test series`);
    }
  });
}

export default router;
