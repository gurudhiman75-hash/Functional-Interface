import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  QuestionManagementError,
  normalizeQuestionTaxonomyInput,
} from "../lib/admin-question-management";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof QuestionManagementError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }
  console.error("Unable to update question taxonomy", error);
  res.status(500).json({ error: "Unable to update question taxonomy" });
}

router.use(authenticate);

router.patch(
  "/:id/taxonomy",
  requireAdminPermission("content.questions.update"),
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

      const input = normalizeQuestionTaxonomyInput(req.body);

      const result = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT
            id,
            public_code AS "publicCode",
            lock_version AS "lockVersion",
            current_draft_version_id AS "currentDraftVersionId",
            approved_version_id AS "approvedVersionId",
            published_version_id AS "publishedVersionId"
          FROM content.questions
          WHERE id = ${questionId}::uuid AND deleted_at IS NULL
          FOR UPDATE
        `;
        const question = rows[0];
        if (!question) {
          throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
        }
        if (Number(question.lockVersion) !== input.expectedLockVersion) {
          throw new QuestionManagementError(
            "QUESTION_VERSION_CONFLICT",
            "This question changed after you opened it. Refresh before saving taxonomy.",
            409,
          );
        }

        const targetVersionId = question.currentDraftVersionId ?? question.approvedVersionId;
        if (!targetVersionId) {
          throw new QuestionManagementError("QUESTION_VERSION_REQUIRED", "Question has no version for taxonomy", 409);
        }
        if (question.publishedVersionId && String(question.publishedVersionId) === String(targetVersionId)) {
          throw new QuestionManagementError(
            "PUBLISHED_VERSION_FROZEN",
            "Create a new draft version before changing taxonomy on a published question.",
            409,
          );
        }

        const examVersions = await tx`
          SELECT ev.id
          FROM catalog.exam_versions ev
          INNER JOIN catalog.exams e ON e.id = ev.exam_id
          WHERE ev.id = ${input.examVersionId}::uuid AND e.is_active = true
          LIMIT 1
        `;
        if (examVersions.length === 0) {
          throw new QuestionManagementError("EXAM_VERSION_NOT_FOUND", "Selected exam version is unavailable", 400);
        }

        for (const nodeId of input.taxonomyNodeIds) {
          const nodes = await tx`
            SELECT n.id
            FROM catalog.taxonomy_nodes n
            INNER JOIN catalog.exam_taxonomy_nodes etn
              ON etn.taxonomy_node_id = n.id
             AND etn.exam_version_id = ${input.examVersionId}::uuid
             AND etn.is_active = true
            WHERE n.id = ${nodeId}::uuid
              AND n.is_active = true
              AND n.deleted_at IS NULL
            LIMIT 1
          `;
          if (nodes.length === 0) {
            throw new QuestionManagementError(
              "TAXONOMY_NOT_AVAILABLE_FOR_EXAM",
              "One or more taxonomy selections are not available for the selected exam.",
              400,
            );
          }
        }

        await tx`
          UPDATE content.question_versions
          SET exam_version_id = ${input.examVersionId}::uuid
          WHERE id = ${String(targetVersionId)}::uuid
        `;
        await tx`
          DELETE FROM content.question_taxonomy_links
          WHERE question_version_id = ${String(targetVersionId)}::uuid
        `;
        for (const nodeId of input.taxonomyNodeIds) {
          await tx`
            INSERT INTO content.question_taxonomy_links (
              question_version_id, taxonomy_node_id, is_primary
            ) VALUES (
              ${String(targetVersionId)}::uuid,
              ${nodeId}::uuid,
              ${nodeId === input.primaryTaxonomyNodeId}
            )
          `;
        }
        await tx`
          UPDATE content.questions
          SET
            primary_taxonomy_node_id = ${input.primaryTaxonomyNodeId}::uuid,
            lock_version = lock_version + 1,
            updated_at = now()
          WHERE id = ${questionId}::uuid
        `;

        const metadata = JSON.stringify({
          examVersionId: input.examVersionId,
          primaryTaxonomyNodeId: input.primaryTaxonomyNodeId,
          taxonomyNodeIds: input.taxonomyNodeIds,
        });
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type,
            entity_id, entity_version_id, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            'content.question.taxonomy.assigned',
            'question',
            ${questionId}::uuid,
            ${String(targetVersionId)}::uuid,
            ${`Assigned exam and taxonomy to ${String(question.publicCode)}`},
            ${metadata}::jsonb
          )
        `;

        return {
          questionId,
          versionId: String(targetVersionId),
          lockVersion: input.expectedLockVersion + 1,
        };
      });

      res.json(result);
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;
