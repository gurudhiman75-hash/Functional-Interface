import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { TestSeriesError, normalizeTestSeriesInput, type TestSeriesInput } from "../lib/admin-test-series";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TestSeriesError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function assertUuid(value: string, field = "identifier"): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new TestSeriesError("INVALID_SERIES_IDENTIFIER", `Invalid ${field}`, 400);
  }
  return value;
}

async function insertSeriesVersion(
  client: SqlExecutor,
  seriesId: string,
  actorUserId: string,
  input: TestSeriesInput,
  versionNumber: number,
): Promise<string> {
  const versionId = randomUUID();
  await client`
    INSERT INTO assessment.test_series_versions (
      id, series_id, version_number, status, description, validity_days,
      progression_rules, settings, change_reason, created_by, created_at
    ) VALUES (
      ${versionId}::uuid, ${seriesId}::uuid, ${versionNumber}, ${input.status},
      ${input.description || null}, ${input.validityDays},
      ${client.json(input.progressionRules)}, ${client.json(input.settings)},
      ${input.changeReason}, ${actorUserId}::uuid, now()
    )
  `;
  for (let index = 0; index < input.items.length; index += 1) {
    const item = input.items[index];
    await client`
      INSERT INTO assessment.test_series_items (
        id, series_version_id, test_id, sort_order, access_mode, availability, created_at
      ) VALUES (
        ${randomUUID()}::uuid, ${versionId}::uuid, ${item.testId}::uuid,
        ${index + 1}, ${item.accessMode}, ${client.json(item.availability)}, now()
      )
    `;
  }
  return versionId;
}

async function assertSeriesReferences(client: SqlExecutor, input: TestSeriesInput): Promise<void> {
  const examRows = await client`SELECT id FROM catalog.exam_versions WHERE id = ${input.examVersionId}::uuid LIMIT 1`;
  if (examRows.length === 0) throw new TestSeriesError("EXAM_VERSION_NOT_FOUND", "Exam version not found", 404);
  if (input.items.length === 0) return;
  const ids = input.items.map((item) => item.testId);
  const tests = await client`
    SELECT id::text AS id, exam_version_id::text AS "examVersionId", status::text AS status
    FROM assessment.tests
    WHERE id = ANY(${ids}::uuid[]) AND deleted_at IS NULL
  `;
  if (tests.length !== ids.length) throw new TestSeriesError("SERIES_TEST_NOT_FOUND", "One or more selected tests no longer exist", 409);
  const mismatched = tests.filter((test) => String(test.examVersionId) !== input.examVersionId);
  if (mismatched.length > 0) throw new TestSeriesError("SERIES_EXAM_MISMATCH", "All series tests must belong to the same exam version", 409);
  if (input.status === "active") {
    const unavailable = tests.filter((test) => !["qa_approved", "scheduled", "live", "completed"].includes(String(test.status)));
    if (unavailable.length > 0) {
      throw new TestSeriesError("SERIES_TEST_NOT_READY", "Active series may contain only QA-approved, scheduled, live or completed tests", 409,
        unavailable.map((test) => ({ testId: test.id, status: test.status })));
    }
  }
}

async function loadSeries(client: SqlExecutor = sqlClient) {
  return client`
    SELECT
      s.id::text AS id,
      s.exam_version_id::text AS "examVersionId",
      s.code,
      s.name,
      s.current_version_number AS "currentVersionNumber",
      s.created_by::text AS "createdBy",
      s.created_at AS "createdAt",
      s.updated_at AS "updatedAt",
      e.code AS "examCode",
      e.name AS "examName",
      ef.name AS "examFamilyName",
      v.id::text AS "versionId",
      v.status,
      v.description,
      v.validity_days AS "validityDays",
      v.progression_rules AS "progressionRules",
      v.settings,
      v.change_reason AS "changeReason",
      v.created_at AS "versionCreatedAt",
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', i.id,
          'testId', i.test_id,
          'sortOrder', i.sort_order,
          'accessMode', i.access_mode,
          'availability', i.availability,
          'publicCode', t.public_code,
          'status', t.status,
          'title', tv.title,
          'questionCount', (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = t.current_draft_version_id),
          'durationSeconds', tv.duration_seconds,
          'totalMarks', tv.total_marks::float8
        ) ORDER BY i.sort_order)
        FROM assessment.test_series_items i
        JOIN assessment.tests t ON t.id = i.test_id
        LEFT JOIN assessment.test_versions tv ON tv.id = COALESCE(t.published_version_id, t.current_draft_version_id)
        WHERE i.series_version_id = v.id
      ), '[]'::json) AS items,
      (SELECT COUNT(*)::int FROM assessment.test_series_versions history WHERE history.series_id = s.id) AS "versionCount"
    FROM assessment.test_series s
    JOIN assessment.test_series_versions v
      ON v.series_id = s.id AND v.version_number = s.current_version_number
    JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    WHERE s.deleted_at IS NULL
    ORDER BY s.updated_at DESC, s.name
  `;
}

async function loadSeriesDetail(seriesId: string, client: SqlExecutor = sqlClient) {
  const rows = await loadSeries(client);
  const series = rows.find((row) => String(row.id) === seriesId);
  if (!series) return null;
  const versions = await client`
    SELECT
      v.id::text AS id,
      v.version_number AS "versionNumber",
      v.status,
      v.description,
      v.validity_days AS "validityDays",
      v.progression_rules AS "progressionRules",
      v.settings,
      v.change_reason AS "changeReason",
      v.created_by::text AS "createdBy",
      v.created_at AS "createdAt",
      (SELECT COUNT(*)::int FROM assessment.test_series_items i WHERE i.series_version_id = v.id) AS "testCount"
    FROM assessment.test_series_versions v
    WHERE v.series_id = ${seriesId}::uuid
    ORDER BY v.version_number DESC
  `;
  return { series, versions };
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const [examVersions, tests] = await Promise.all([
      sqlClient`
        SELECT ev.id::text AS id, ev.version_number AS "versionNumber", ev.name AS "versionName",
          e.code AS "examCode", e.name AS "examName", ef.name AS "familyName"
        FROM catalog.exam_versions ev
        JOIN catalog.exams e ON e.id = ev.exam_id
        JOIN catalog.exam_families ef ON ef.id = e.family_id
        ORDER BY ef.name, e.name, ev.version_number DESC
      `,
      sqlClient`
        SELECT t.id::text AS id, t.public_code AS "publicCode", t.exam_version_id::text AS "examVersionId",
          t.status::text AS status, v.title, v.duration_seconds AS "durationSeconds", v.total_marks::float8 AS "totalMarks",
          (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = COALESCE(t.published_version_id, t.current_draft_version_id)) AS "questionCount"
        FROM assessment.tests t
        LEFT JOIN assessment.test_versions v ON v.id = COALESCE(t.published_version_id, t.current_draft_version_id)
        WHERE t.deleted_at IS NULL AND t.status <> 'archived'::test_status
        ORDER BY t.updated_at DESC
      `,
    ]);
    res.json({ examVersions, tests, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load Test Series catalog");
  }
});

router.get("/", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    res.json({ series: await loadSeries(), generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load Test Series");
  }
});

router.get("/:id", requireAdminPermission("tests.read"), async (req, res) => {
  try {
    const id = assertUuid(req.params.id, "series identifier");
    const detail = await loadSeriesDetail(id);
    if (!detail) {
      res.status(404).json({ error: "Test Series not found", code: "TEST_SERIES_NOT_FOUND" });
      return;
    }
    res.json(detail);
  } catch (error) {
    sendError(res, error, "Unable to load Test Series detail");
  }
});

router.post("/", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new TestSeriesError("ADMIN_REQUIRED", "Administrator session required", 403);
    const input = normalizeTestSeriesInput(req.body);
    await assertSeriesReferences(sqlClient, input);
    const result = await sqlClient.begin(async (tx) => {
      const id = randomUUID();
      await tx`
        INSERT INTO assessment.test_series (
          id, exam_version_id, code, name, current_version_number, created_by, created_at, updated_at
        ) VALUES (${id}::uuid, ${input.examVersionId}::uuid, ${input.code}, ${input.name}, 1, ${actorUserId}::uuid, now(), now())
      `;
      const versionId = await insertSeriesVersion(tx as SqlExecutor, id, actorUserId, input, 1);
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'assessment.test_series.created', 'test_series', ${id}::uuid,
          ${versionId}::uuid, ${input.changeReason}, ${`Created Test Series ${input.code}`},
          ${tx.json({ versionNumber: 1, status: input.status, testCount: input.items.length })}
        )
      `;
      return loadSeriesDetail(id, tx as SqlExecutor);
    });
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to create Test Series");
  }
});

router.put("/:id", requireAdminPermission("tests.update"), async (req, res) => {
  try {
    const id = assertUuid(req.params.id, "series identifier");
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new TestSeriesError("ADMIN_REQUIRED", "Administrator session required", 403);
    const input = normalizeTestSeriesInput(req.body);
    await assertSeriesReferences(sqlClient, input);
    const expectedVersion = Number(asRecord(req.body).expectedCurrentVersionNumber);
    const result = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT code, current_version_number AS "currentVersionNumber"
        FROM assessment.test_series
        WHERE id = ${id}::uuid AND deleted_at IS NULL
        FOR UPDATE
      `;
      const record = rows[0];
      if (!record) throw new TestSeriesError("TEST_SERIES_NOT_FOUND", "Test Series not found", 404);
      if (!Number.isInteger(expectedVersion) || expectedVersion !== Number(record.currentVersionNumber)) {
        throw new TestSeriesError("TEST_SERIES_VERSION_CONFLICT", "This series changed after you opened it. Refresh before saving.", 409);
      }
      if (String(record.code) !== input.code) throw new TestSeriesError("TEST_SERIES_CODE_IMMUTABLE", "Series code cannot change after creation", 409);
      const nextVersion = expectedVersion + 1;
      const versionId = await insertSeriesVersion(tx as SqlExecutor, id, actorUserId, input, nextVersion);
      await tx`
        UPDATE assessment.test_series
        SET exam_version_id = ${input.examVersionId}::uuid, name = ${input.name},
          current_version_number = ${nextVersion}, updated_at = now()
        WHERE id = ${id}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'assessment.test_series.version.created', 'test_series', ${id}::uuid,
          ${versionId}::uuid, ${input.changeReason}, ${`Created Test Series version ${nextVersion}`},
          ${tx.json({ previousVersionNumber: expectedVersion, versionNumber: nextVersion, status: input.status, testCount: input.items.length })}
        )
      `;
      return loadSeriesDetail(id, tx as SqlExecutor);
    });
    res.json(result);
  } catch (error) {
    sendError(res, error, "Unable to update Test Series");
  }
});

router.post("/:id/actions/:action", requireAdminPermission("tests.update"), async (req, res) => {
  try {
    const id = assertUuid(req.params.id, "series identifier");
    const action = String(req.params.action);
    const status = action === "activate" ? "active" : action === "deprecate" ? "deprecated" : action === "archive" ? "archived" : action === "restore" ? "draft" : "";
    if (!status) throw new TestSeriesError("INVALID_SERIES_ACTION", "Unsupported Test Series action", 404);
    const detail = await loadSeriesDetail(id);
    if (!detail) throw new TestSeriesError("TEST_SERIES_NOT_FOUND", "Test Series not found", 404);
    const series = detail.series as Record<string, unknown>;
    const items = Array.isArray(series.items) ? series.items.map(asRecord) : [];
    const input = normalizeTestSeriesInput({
      examVersionId: series.examVersionId,
      code: series.code,
      name: series.name,
      status,
      description: series.description,
      validityDays: series.validityDays,
      progressionRules: series.progressionRules,
      settings: series.settings,
      changeReason: asText(req.body?.reason) || `${action} Test Series`,
      items: items.map((item) => ({ testId: item.testId, accessMode: item.accessMode, availability: item.availability })),
    });
    await assertSeriesReferences(sqlClient, input);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new TestSeriesError("ADMIN_REQUIRED", "Administrator session required", 403);
    const result = await sqlClient.begin(async (tx) => {
      const nextVersion = Number(series.currentVersionNumber) + 1;
      const versionId = await insertSeriesVersion(tx as SqlExecutor, id, actorUserId, input, nextVersion);
      await tx`UPDATE assessment.test_series SET current_version_number = ${nextVersion}, updated_at = now() WHERE id = ${id}::uuid`;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          ${`assessment.test_series.${action}`}, 'test_series', ${id}::uuid,
          ${versionId}::uuid, ${input.changeReason}, ${`${String(series.code)} moved to ${status}`},
          ${tx.json({ previousStatus: series.status, status, versionNumber: nextVersion })}
        )
      `;
      return loadSeriesDetail(id, tx as SqlExecutor);
    });
    res.json(result);
  } catch (error) {
    sendError(res, error, "Unable to update Test Series lifecycle");
  }
});

export default router;
