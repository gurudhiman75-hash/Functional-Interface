import { randomUUID } from "node:crypto";
import { Router } from "express";

import { getTestLifecycleConfig, TestManagementError } from "../lib/admin-test-management";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ACTIONS = ["submit-qa", "needs-fix", "approve", "schedule", "publish", "archive", "restore-draft"] as const;
type BulkAction = typeof ACTIONS[number];

type BulkItem = {
  testId: string;
  expectedCurrentDraftVersionId: string;
};

type BulkResult = {
  testId: string;
  publicCode?: string;
  ok: boolean;
  code?: string;
  message?: string;
  status?: string;
  currentDraftVersionId?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function normalizeItems(value: unknown): BulkItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const items: BulkItem[] = [];
  for (const raw of value) {
    const item = asRecord(raw);
    const testId = typeof item.testId === "string" ? item.testId : "";
    const expectedCurrentDraftVersionId = typeof item.expectedCurrentDraftVersionId === "string"
      ? item.expectedCurrentDraftVersionId
      : "";
    if (!UUID_RE.test(testId) || !UUID_RE.test(expectedCurrentDraftVersionId) || seen.has(testId)) continue;
    seen.add(testId);
    items.push({ testId, expectedCurrentDraftVersionId });
  }
  return items.slice(0, 250);
}

function allowedStatuses(action: BulkAction): string[] {
  if (action === "submit-qa") return ["draft", "needs_fix", "content_ready"];
  if (action === "needs-fix") return ["under_qa", "qa_approved", "scheduled"];
  if (action === "approve") return ["under_qa"];
  if (action === "schedule") return ["qa_approved", "scheduled"];
  if (action === "publish") return ["qa_approved", "scheduled", "live"];
  if (action === "archive") return ["draft", "content_ready", "under_qa", "needs_fix", "qa_approved", "scheduled", "live", "completed"];
  return ["archived", "needs_fix"];
}

function nextStatus(action: BulkAction): string {
  if (action === "submit-qa") return "under_qa";
  if (action === "needs-fix") return "needs_fix";
  if (action === "approve") return "qa_approved";
  if (action === "schedule") return "scheduled";
  if (action === "publish") return "live";
  if (action === "archive") return "archived";
  return "draft";
}

function errorResult(item: BulkItem, error: unknown): BulkResult {
  const candidate = error as { code?: unknown; message?: unknown };
  return {
    testId: item.testId,
    ok: false,
    code: typeof candidate?.code === "string" ? candidate.code : "BULK_TEST_ITEM_FAILED",
    message: typeof candidate?.message === "string" ? candidate.message : "Test lifecycle update failed",
  };
}

async function validateStoredTest(
  tx: typeof sqlClient,
  testId: string,
  testVersionId: string,
): Promise<void> {
  const rows = await tx`
    SELECT
      length(trim(v.title)) > 0 AS "hasTitle",
      v.duration_seconds > 0 AS "hasDuration",
      v.total_marks > 0 AS "hasMarks",
      (SELECT COUNT(*)::int FROM assessment.test_sections s WHERE s.test_version_id = v.id) AS "sectionCount",
      (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = v.id) AS "questionCount",
      (
        SELECT COUNT(*)::int
        FROM assessment.test_questions tq
        LEFT JOIN content.question_versions qv ON qv.id = tq.question_version_id
        LEFT JOIN content.questions q ON q.id = qv.question_id
        WHERE tq.test_version_id = v.id
          AND (
            qv.id IS NULL
            OR q.id IS NULL
            OR q.status::text <> 'published'
            OR q.published_version_id IS DISTINCT FROM tq.question_version_id
            OR qv.exam_version_id IS DISTINCT FROM t.exam_version_id
            OR NOT EXISTS (
              SELECT 1
              FROM content.question_taxonomy_links qtl
              WHERE qtl.question_version_id = tq.question_version_id
            )
          )
      ) AS "invalidQuestionCount"
    FROM assessment.tests t
    JOIN assessment.test_versions v ON v.id = ${testVersionId}::uuid AND v.test_id = t.id
    WHERE t.id = ${testId}::uuid
      AND t.deleted_at IS NULL
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) {
    throw Object.assign(new Error("The current test version is missing"), { code: "TEST_VERSION_MISSING" });
  }

  const issues: string[] = [];
  if (!row.hasTitle) issues.push("title is missing");
  if (!row.hasDuration) issues.push("duration must be greater than zero");
  if (!row.hasMarks) issues.push("total marks must be greater than zero");
  if (Number(row.sectionCount) < 1) issues.push("at least one section is required");
  if (Number(row.questionCount) < 1) issues.push("at least one question is required");
  if (Number(row.invalidQuestionCount) > 0) {
    issues.push(`${Number(row.invalidQuestionCount)} question selection(s) are unpublished, mismatched, or missing taxonomy`);
  }
  if (issues.length > 0) {
    throw Object.assign(new Error(`Test is not ready: ${issues.join("; ")}`), {
      code: "TEST_VALIDATION_FAILED",
      details: issues,
    });
  }
}

router.use(authenticate);

for (const action of ACTIONS) {
  const config = getTestLifecycleConfig(action);
  router.post(`/bulk/actions/${action}`, requireAdminPermission(config.permission), async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }

    const body = asRecord(req.body);
    const items = normalizeItems(body.items);
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : "";
    const scheduledAt = typeof body.scheduledAt === "string" ? body.scheduledAt : "";
    const closesAt = typeof body.closesAt === "string" ? body.closesAt : "";

    if (items.length === 0) {
      res.status(400).json({ error: "Select at least one valid test", code: "BULK_TEST_ITEMS_REQUIRED" });
      return;
    }
    if (action === "needs-fix" && !reason) {
      res.status(400).json({ error: "A reason is required", code: "REASON_REQUIRED" });
      return;
    }
    if (action === "schedule" && !scheduledAt) {
      res.status(400).json({ error: "A schedule time is required", code: "SCHEDULE_REQUIRED" });
      return;
    }

    const results: BulkResult[] = [];
    for (const item of items) {
      try {
        const result = await sqlClient.begin(async (tx) => {
          const rows = await tx`
            SELECT
              id::text AS id,
              public_code AS "publicCode",
              status::text AS status,
              current_draft_version_id::text AS "currentDraftVersionId"
            FROM assessment.tests
            WHERE id = ${item.testId}::uuid
              AND deleted_at IS NULL
            FOR UPDATE
          `;
          const test = rows[0];
          if (!test) throw Object.assign(new Error("Test not found"), { code: "TEST_NOT_FOUND" });
          if (String(test.currentDraftVersionId ?? "") !== item.expectedCurrentDraftVersionId) {
            throw Object.assign(new Error("Test changed after selection. Refresh and retry."), { code: "TEST_VERSION_CONFLICT" });
          }
          if (!allowedStatuses(action).includes(String(test.status))) {
            throw Object.assign(
              new Error(`Cannot ${action.replace(/-/g, " ")} a test from ${String(test.status)}`),
              { code: "INVALID_TEST_STATUS_TRANSITION" },
            );
          }

          if (["submit-qa", "approve", "schedule", "publish"].includes(action)) {
            await validateStoredTest(tx as typeof sqlClient, item.testId, item.expectedCurrentDraftVersionId);
          }

          const status = nextStatus(action);
          if (action === "schedule" || action === "publish") {
            const numberRows = await tx`
              SELECT COALESCE(MAX(publication_number), 0)::int + 1 AS "nextPublicationNumber"
              FROM assessment.test_publications
              WHERE test_id = ${item.testId}::uuid
            `;
            const publicationNumber = Number(numberRows[0]?.nextPublicationNumber ?? 1);
            await tx`
              INSERT INTO assessment.test_publications (
                id, test_id, test_version_id, publication_number, scheduled_at,
                published_at, closes_at, published_by, settings_snapshot
              ) VALUES (
                ${randomUUID()}::uuid,
                ${item.testId}::uuid,
                ${item.expectedCurrentDraftVersionId}::uuid,
                ${publicationNumber},
                ${action === "schedule" ? scheduledAt : null}::timestamptz,
                ${action === "publish" ? new Date().toISOString() : null}::timestamptz,
                ${closesAt || null}::timestamptz,
                ${actorUserId}::uuid,
                ${tx.json({ status })}
              )
            `;
          }

          if (action === "publish") {
            await tx`
              UPDATE assessment.tests
              SET status = 'live'::test_status,
                  published_version_id = ${item.expectedCurrentDraftVersionId}::uuid,
                  updated_at = now()
              WHERE id = ${item.testId}::uuid
            `;
          } else {
            await tx`
              UPDATE assessment.tests
              SET status = ${status}::test_status,
                  updated_at = now()
              WHERE id = ${item.testId}::uuid
            `;
          }

          await tx`
            INSERT INTO platform.audit_events (
              id, actor_type, actor_user_id, action_key, entity_type, entity_id,
              entity_version_id, reason, summary, metadata
            ) VALUES (
              ${randomUUID()}::uuid,
              'user'::audit_actor_type,
              ${actorUserId}::uuid,
              ${config.actionKey},
              'test',
              ${item.testId}::uuid,
              ${item.expectedCurrentDraftVersionId}::uuid,
              ${reason || null},
              ${`${String(test.publicCode)} bulk lifecycle ${action}`},
              ${tx.json({ action, previousStatus: test.status, status, scheduledAt: scheduledAt || null, closesAt: closesAt || null })}
            )
          `;

          return {
            testId: item.testId,
            publicCode: String(test.publicCode),
            ok: true,
            status,
            currentDraftVersionId: item.expectedCurrentDraftVersionId,
          } satisfies BulkResult;
        });
        results.push(result);
      } catch (error) {
        results.push(errorResult(item, error));
      }
    }

    const succeeded = results.filter((result) => result.ok).length;
    res.json({
      action,
      attempted: results.length,
      succeeded,
      failed: results.length - succeeded,
      results,
      generatedAt: new Date().toISOString(),
    });
  });
}

export default router;
