import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type BulkAction = "assign-taxonomy" | "submit-review" | "approve" | "publish" | "archive";

type BulkItem = {
  questionId: string;
  expectedLockVersion: number;
};

type BulkResult = {
  questionId: string;
  publicCode?: string;
  ok: boolean;
  code?: string;
  message?: string;
  lockVersion?: number;
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
    const questionId = typeof item.questionId === "string" ? item.questionId : "";
    const expectedLockVersion = Number(item.expectedLockVersion);
    if (!UUID_RE.test(questionId) || !Number.isInteger(expectedLockVersion) || expectedLockVersion < 0 || seen.has(questionId)) continue;
    seen.add(questionId);
    items.push({ questionId, expectedLockVersion });
  }
  return items.slice(0, 500);
}

function errorResult(item: BulkItem, error: unknown): BulkResult {
  const candidate = error as { code?: unknown; message?: unknown };
  return {
    questionId: item.questionId,
    ok: false,
    code: typeof candidate?.code === "string" ? candidate.code : "BULK_ITEM_FAILED",
    message: typeof candidate?.message === "string" ? candidate.message : "Question update failed",
  };
}

router.use(authenticate);

router.post(
  "/bulk/workflow",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }

    const body = asRecord(req.body);
    const action = typeof body.action === "string" ? body.action as BulkAction : "" as BulkAction;
    const items = normalizeItems(body.items);
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : "";

    if (!["assign-taxonomy", "submit-review", "approve", "publish", "archive"].includes(action)) {
      res.status(400).json({ error: "Unsupported bulk action", code: "INVALID_BULK_ACTION" });
      return;
    }
    if (items.length === 0) {
      res.status(400).json({ error: "Select at least one valid question", code: "BULK_ITEMS_REQUIRED" });
      return;
    }
    if (action === "archive" && !reason) {
      res.status(400).json({ error: "Archive reason is required", code: "REASON_REQUIRED" });
      return;
    }

    const examVersionId = typeof body.examVersionId === "string" ? body.examVersionId : "";
    const primaryTaxonomyNodeId = typeof body.primaryTaxonomyNodeId === "string" ? body.primaryTaxonomyNodeId : "";
    const taxonomyNodeIds = Array.isArray(body.taxonomyNodeIds)
      ? [...new Set(body.taxonomyNodeIds.map(String).filter((id) => UUID_RE.test(id)))]
      : [];

    if (action === "assign-taxonomy") {
      if (!UUID_RE.test(examVersionId) || !UUID_RE.test(primaryTaxonomyNodeId) || taxonomyNodeIds.length === 0 || !taxonomyNodeIds.includes(primaryTaxonomyNodeId)) {
        res.status(400).json({ error: "Exam version and taxonomy are required", code: "INVALID_TAXONOMY_INPUT" });
        return;
      }
    }

    const results: BulkResult[] = [];

    for (const item of items) {
      try {
        const result = await sqlClient.begin(async (tx) => {
          const rows = await tx`
            SELECT
              q.id::text AS id,
              q.public_code AS "publicCode",
              q.status::text AS status,
              q.lock_version AS "lockVersion",
              q.current_draft_version_id::text AS "currentDraftVersionId",
              q.approved_version_id::text AS "approvedVersionId",
              q.published_version_id::text AS "publishedVersionId"
            FROM content.questions q
            WHERE q.id = ${item.questionId}::uuid
              AND q.deleted_at IS NULL
            FOR UPDATE
          `;
          const question = rows[0];
          if (!question) throw Object.assign(new Error("Question not found"), { code: "QUESTION_NOT_FOUND" });
          if (Number(question.lockVersion) !== item.expectedLockVersion) {
            throw Object.assign(new Error("Question changed after selection. Refresh and retry."), { code: "QUESTION_VERSION_CONFLICT" });
          }

          const editableVersionId = String(question.currentDraftVersionId ?? question.approvedVersionId ?? "");
          let auditVersionId = editableVersionId || String(question.publishedVersionId ?? "");
          let nextStatus = String(question.status);
          let actionKey = "";

          if (action === "assign-taxonomy") {
            if (!editableVersionId) throw Object.assign(new Error("Question has no editable version"), { code: "QUESTION_VERSION_REQUIRED" });

            const examRows = await tx`
              SELECT ev.id
              FROM catalog.exam_versions ev
              JOIN catalog.exams e ON e.id = ev.exam_id
              WHERE ev.id = ${examVersionId}::uuid AND e.is_active = true
              LIMIT 1
            `;
            if (examRows.length === 0) throw Object.assign(new Error("Selected exam version is unavailable"), { code: "EXAM_VERSION_NOT_FOUND" });

            for (const nodeId of taxonomyNodeIds) {
              const nodeRows = await tx`
                SELECT n.id
                FROM catalog.taxonomy_nodes n
                JOIN catalog.exam_taxonomy_nodes etn
                  ON etn.taxonomy_node_id = n.id
                 AND etn.exam_version_id = ${examVersionId}::uuid
                 AND etn.is_active = true
                WHERE n.id = ${nodeId}::uuid
                  AND n.is_active = true
                  AND n.deleted_at IS NULL
                LIMIT 1
              `;
              if (nodeRows.length === 0) {
                throw Object.assign(new Error("One or more taxonomy selections are unavailable for the selected exam"), { code: "TAXONOMY_NOT_AVAILABLE_FOR_EXAM" });
              }
            }

            await tx`UPDATE content.question_versions SET exam_version_id = ${examVersionId}::uuid WHERE id = ${editableVersionId}::uuid`;
            await tx`DELETE FROM content.question_taxonomy_links WHERE question_version_id = ${editableVersionId}::uuid`;
            for (const nodeId of taxonomyNodeIds) {
              await tx`
                INSERT INTO content.question_taxonomy_links (question_version_id, taxonomy_node_id, is_primary)
                VALUES (${editableVersionId}::uuid, ${nodeId}::uuid, ${nodeId === primaryTaxonomyNodeId})
              `;
            }
            await tx`
              UPDATE content.questions
              SET primary_taxonomy_node_id = ${primaryTaxonomyNodeId}::uuid,
                  lock_version = lock_version + 1,
                  updated_at = now()
              WHERE id = ${item.questionId}::uuid
            `;
            actionKey = "content.question.taxonomy.assigned";
          } else if (action === "submit-review") {
            if (!["draft", "generated", "needs_fix"].includes(String(question.status))) {
              throw Object.assign(new Error(`Cannot submit a ${String(question.status)} question for review`), { code: "INVALID_QUESTION_STATUS_TRANSITION" });
            }
            if (!editableVersionId) throw Object.assign(new Error("Question has no version to review"), { code: "QUESTION_VERSION_REQUIRED" });
            nextStatus = "under_review";
            await tx`
              UPDATE content.questions
              SET status = 'under_review'::question_status,
                  lock_version = lock_version + 1,
                  updated_at = now()
              WHERE id = ${item.questionId}::uuid
            `;
            actionKey = "content.question.review.submitted";
          } else if (action === "approve") {
            if (!["under_review", "needs_fix", "draft", "generated"].includes(String(question.status))) {
              throw Object.assign(new Error(`Cannot approve a ${String(question.status)} question`), { code: "INVALID_QUESTION_STATUS_TRANSITION" });
            }
            if (!editableVersionId) throw Object.assign(new Error("Question has no version to approve"), { code: "QUESTION_VERSION_REQUIRED" });
            nextStatus = "approved";
            await tx`
              UPDATE content.questions
              SET status = 'approved'::question_status,
                  current_draft_version_id = ${editableVersionId}::uuid,
                  approved_version_id = ${editableVersionId}::uuid,
                  lock_version = lock_version + 1,
                  updated_at = now()
              WHERE id = ${item.questionId}::uuid
            `;
            actionKey = "content.question.approved";
          } else if (action === "publish") {
            const approvedVersionId = String(question.approvedVersionId ?? "");
            if (!approvedVersionId) throw Object.assign(new Error("Approve the question before publishing"), { code: "QUESTION_NOT_APPROVED" });

            const readinessRows = await tx`
              SELECT
                v.exam_version_id IS NOT NULL AS "hasExam",
                q.primary_taxonomy_node_id IS NOT NULL AS "hasPrimaryTaxonomy",
                length(trim(v.stem)) > 0 AS "hasStem",
                length(trim(v.explanation)) > 0 AS "hasExplanation",
                (SELECT COUNT(*) FROM content.question_options o WHERE o.question_version_id = v.id) >= 2 AS "hasOptions",
                (SELECT COUNT(*) FROM content.question_options o WHERE o.question_version_id = v.id AND o.is_correct = true) = 1 AS "hasSingleCorrect",
                EXISTS (SELECT 1 FROM content.question_taxonomy_links l WHERE l.question_version_id = v.id) AS "hasTaxonomy"
              FROM content.questions q
              JOIN content.question_versions v ON v.id = q.approved_version_id
              WHERE q.id = ${item.questionId}::uuid
            `;
            const readiness = readinessRows[0];
            const ready = readiness && Object.values(readiness).every(Boolean);
            if (!ready) throw Object.assign(new Error("Question is not publication-ready"), { code: "QUESTION_NOT_PUBLISHABLE" });

            auditVersionId = approvedVersionId;
            nextStatus = "published";
            await tx`
              UPDATE content.questions
              SET status = 'published'::question_status,
                  published_version_id = approved_version_id,
                  published_at = now(),
                  published_by = ${actorUserId}::uuid,
                  lock_version = lock_version + 1,
                  updated_at = now()
              WHERE id = ${item.questionId}::uuid
            `;
            actionKey = "content.question.published";
          } else {
            nextStatus = "archived";
            await tx`
              UPDATE content.questions
              SET status = 'archived'::question_status,
                  published_version_id = NULL,
                  published_at = NULL,
                  published_by = NULL,
                  lock_version = lock_version + 1,
                  updated_at = now()
              WHERE id = ${item.questionId}::uuid
            `;
            actionKey = "content.question.archived";
          }

          await tx`
            INSERT INTO platform.audit_events (
              id, actor_type, actor_user_id, action_key, entity_type,
              entity_id, entity_version_id, reason, summary, metadata
            ) VALUES (
              ${randomUUID()}::uuid,
              'user'::audit_actor_type,
              ${actorUserId}::uuid,
              ${actionKey},
              'question',
              ${item.questionId}::uuid,
              ${auditVersionId || null}::uuid,
              ${reason || null},
              ${`${String(question.publicCode)} bulk action ${action}`},
              ${tx.json({ action, previousStatus: question.status, status: nextStatus, examVersionId, taxonomyNodeIds })}
            )
          `;

          return {
            questionId: item.questionId,
            publicCode: String(question.publicCode),
            ok: true,
            lockVersion: item.expectedLockVersion + 1,
          } satisfies BulkResult;
        });
        results.push(result);
      } catch (error) {
        results.push(errorResult(item, error));
      }
    }

    const succeeded = results.filter((result) => result.ok).length;
    const failed = results.length - succeeded;
    res.json({
      action,
      attempted: results.length,
      succeeded,
      failed,
      results,
      generatedAt: new Date().toISOString(),
    });
  },
);

export default router;
