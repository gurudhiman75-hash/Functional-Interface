import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { getGeneratedQuestionDeliveryIssues } from "../lib/admin-question-delivery-policy";
import { QuestionManagementError } from "../lib/admin-question-management";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof QuestionManagementError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error("Unable to update question lifecycle", error);
  res.status(500).json({ error: "Unable to update question lifecycle" });
}

router.use(authenticate);

router.post(
  "/:id/actions/publish",
  requireAdminPermission("content.questions.publish"),
  async (req, res) => {
    try {
      const questionId = req.params.id;
      if (!isUuid(questionId)) {
        throw new QuestionManagementError("INVALID_QUESTION_ID", "Invalid question identifier", 400);
      }
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const expectedLockVersion = Number(req.body?.expectedLockVersion);
      if (!Number.isInteger(expectedLockVersion) || expectedLockVersion < 0) {
        throw new QuestionManagementError("INVALID_LOCK_VERSION", "A valid lock version is required", 400);
      }

      const result = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT
            q.public_code AS "publicCode",
            q.status,
            q.lock_version AS "lockVersion",
            q.approved_version_id AS "approvedVersionId",
            q.primary_taxonomy_node_id AS "primaryTaxonomyNodeId",
            v.exam_version_id AS "examVersionId",
            v.stem,
            v.explanation,
            CASE
              WHEN v.answer_model #>> '{generation,publiclyPublishable}' IN ('true', 'false')
              THEN (v.answer_model #>> '{generation,publiclyPublishable}')::boolean
              ELSE NULL
            END AS "generationPubliclyPublishable",
            CASE
              WHEN v.answer_model #>> '{generation,testEligible}' IN ('true', 'false')
              THEN (v.answer_model #>> '{generation,testEligible}')::boolean
              ELSE NULL
            END AS "generationTestEligible",
            v.answer_model #>> '{generation,questionBankAcceptanceMode}' AS "questionBankAcceptanceMode",
            v.answer_model #>> '{generation,questionBankAcceptanceAuthority}' AS "questionBankAcceptanceAuthority",
            (SELECT COUNT(*)::int FROM content.question_options o WHERE o.question_version_id = v.id) AS "optionCount",
            (SELECT COUNT(*)::int FROM content.question_options o WHERE o.question_version_id = v.id AND o.is_correct = true) AS "correctOptionCount",
            (SELECT COUNT(*)::int FROM content.question_taxonomy_links l WHERE l.question_version_id = v.id) AS "taxonomyCount"
          FROM content.questions q
          LEFT JOIN content.question_versions v ON v.id = q.approved_version_id
          WHERE q.id = ${questionId}::uuid AND q.deleted_at IS NULL
          FOR UPDATE OF q
        `;
        const question = rows[0];
        if (!question) throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
        if (Number(question.lockVersion) !== expectedLockVersion) {
          throw new QuestionManagementError(
            "QUESTION_VERSION_CONFLICT",
            "This question changed after you opened it. Refresh before continuing.",
            409,
          );
        }

        const issues: string[] = [];
        if (!question.approvedVersionId) issues.push("Approve a question version before publishing.");
        if (!question.examVersionId) issues.push("Assign an exam version.");
        if (!question.primaryTaxonomyNodeId) issues.push("Assign a primary taxonomy topic.");
        if (Number(question.taxonomyCount ?? 0) === 0) issues.push("Assign taxonomy to the approved version.");
        if (!String(question.stem ?? "").trim()) issues.push("Question stem is required.");
        if (!String(question.explanation ?? "").trim()) issues.push("Question explanation is required.");
        if (Number(question.optionCount ?? 0) < 2) issues.push("At least two options are required.");
        if (Number(question.correctOptionCount ?? 0) !== 1) issues.push("Exactly one correct option is required.");
        issues.push(...getGeneratedQuestionDeliveryIssues({
          testEligible:
            typeof question.generationTestEligible === "boolean"
              ? question.generationTestEligible
              : null,
          publiclyPublishable:
            typeof question.generationPubliclyPublishable === "boolean"
              ? question.generationPubliclyPublishable
              : null,
        }));
        if (issues.length > 0) {
          throw new QuestionManagementError(
            "QUESTION_NOT_PUBLISHABLE",
            "Question is not ready to publish",
            409,
            {
              issues,
              questionBankAcceptanceMode: question.questionBankAcceptanceMode ?? null,
              questionBankAcceptanceAuthority: question.questionBankAcceptanceAuthority ?? null,
            },
          );
        }

        await tx`
          UPDATE content.questions
          SET
            status = 'published'::question_status,
            published_version_id = approved_version_id,
            published_at = now(),
            published_by = ${actorUserId}::uuid,
            lock_version = lock_version + 1,
            updated_at = now()
          WHERE id = ${questionId}::uuid
        `;

        const metadata = JSON.stringify({ previousStatus: question.status, status: "published" });
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type,
            entity_id, entity_version_id, reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            'content.question.published',
            'question',
            ${questionId}::uuid,
            ${String(question.approvedVersionId)}::uuid,
            ${req.body?.reason ? String(req.body.reason) : null},
            ${`${String(question.publicCode)} moved from ${String(question.status)} to published`},
            ${metadata}::jsonb
          )
        `;

        return { questionId, status: "published", lockVersion: expectedLockVersion + 1 };
      });

      res.json(result);
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;
