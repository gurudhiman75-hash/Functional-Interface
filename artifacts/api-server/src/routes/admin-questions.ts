import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  convertApprovedGenerationItem,
  optionKey,
  type QuestionSqlExecutor,
} from "../lib/admin-question-conversion";
import {
  QuestionManagementError,
  getQuestionLifecycleConfig,
  normalizeLifecycleInput,
  normalizeQuestionVersionInput,
} from "../lib/admin-question-management";
import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function assertQuestionId(value: string): string {
  if (!isUuid(value)) {
    throw new QuestionManagementError("INVALID_QUESTION_ID", "Invalid question identifier", 400);
  }
  return value;
}

function sendQuestionError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof QuestionManagementError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

async function loadQuestionDetail(questionId: string, client: QuestionSqlExecutor = sqlClient) {
  const questions = await client`
    SELECT
      q.id,
      q.public_code AS "publicCode",
      q.status,
      q.source_id AS "sourceId",
      q.primary_taxonomy_node_id AS "primaryTaxonomyNodeId",
      q.author_user_id AS "authorUserId",
      q.current_draft_version_id AS "currentDraftVersionId",
      q.approved_version_id AS "approvedVersionId",
      q.lock_version AS "lockVersion",
      q.created_at AS "createdAt",
      q.updated_at AS "updatedAt",
      COALESCE(q.current_draft_version_id, q.approved_version_id) AS "displayVersionId"
    FROM content.questions q
    WHERE q.id = ${questionId}::uuid
      AND q.deleted_at IS NULL
    LIMIT 1
  `;
  if (questions.length === 0) return null;

  const versions = await client`
    SELECT
      v.id,
      v.question_id AS "questionId",
      v.version_number AS "versionNumber",
      v.exam_version_id AS "examVersionId",
      v.pattern_id AS "patternId",
      v.question_type AS "questionType",
      v.difficulty,
      v.stem,
      v.explanation,
      v.answer_model AS "answerModel",
      v.default_marks AS "defaultMarks",
      v.default_negative_marks AS "defaultNegativeMarks",
      v.target_time_seconds AS "targetTimeSeconds",
      v.change_reason AS "changeReason",
      v.created_by AS "createdBy",
      v.created_at AS "createdAt",
      COALESCE(
        json_agg(
          json_build_object(
            'id', o.id,
            'key', o.option_key,
            'text', o.text,
            'sortOrder', o.sort_order,
            'isCorrect', o.is_correct
          ) ORDER BY o.sort_order
        ) FILTER (WHERE o.id IS NOT NULL),
        '[]'::json
      ) AS options
    FROM content.question_versions v
    LEFT JOIN content.question_options o ON o.question_version_id = v.id
    WHERE v.question_id = ${questionId}::uuid
    GROUP BY v.id
    ORDER BY v.version_number DESC
  `;

  const auditEvents = await client`
    SELECT
      id,
      occurred_at AS "occurredAt",
      actor_user_id AS "actorUserId",
      action_key AS "actionKey",
      entity_version_id AS "entityVersionId",
      reason,
      summary,
      metadata
    FROM platform.audit_events
    WHERE entity_type = 'question'
      AND entity_id = ${questionId}::uuid
    ORDER BY occurred_at DESC
    LIMIT 100
  `;

  return {
    question: questions[0],
    versions,
    auditEvents,
    generatedAt: new Date().toISOString(),
  };
}

router.use(authenticate);

router.get(
  "/",
  requireAdminPermission("content.questions.read"),
  async (_req, res) => {
    try {
      const questions = await sqlClient`
        SELECT
          q.id,
          q.public_code AS "publicCode",
          q.status,
          q.current_draft_version_id AS "currentDraftVersionId",
          q.approved_version_id AS "approvedVersionId",
          q.lock_version AS "lockVersion",
          q.created_at AS "createdAt",
          q.updated_at AS "updatedAt",
          v.id AS "versionId",
          v.version_number AS "versionNumber",
          v.question_type AS "questionType",
          v.difficulty,
          v.stem,
          v.explanation,
          v.answer_model AS "answerModel",
          COALESCE(
            json_agg(
              json_build_object(
                'id', o.id,
                'key', o.option_key,
                'text', o.text,
                'sortOrder', o.sort_order,
                'isCorrect', o.is_correct
              ) ORDER BY o.sort_order
            ) FILTER (WHERE o.id IS NOT NULL),
            '[]'::json
          ) AS options
        FROM content.questions q
        INNER JOIN content.question_versions v
          ON v.id = COALESCE(q.current_draft_version_id, q.approved_version_id)
        LEFT JOIN content.question_options o ON o.question_version_id = v.id
        WHERE q.deleted_at IS NULL
        GROUP BY q.id, v.id
        ORDER BY q.updated_at DESC
        LIMIT 1000
      `;

      res.json({ questions, generatedAt: new Date().toISOString() });
    } catch (error) {
      sendQuestionError(res, error, "Unable to load Question Bank records");
    }
  },
);

router.get(
  "/:id",
  requireAdminPermission("content.questions.read"),
  async (req, res) => {
    try {
      const questionId = assertQuestionId(req.params.id);
      const detail = await loadQuestionDetail(questionId);
      if (!detail) {
        res.status(404).json({ error: "Question not found", code: "QUESTION_NOT_FOUND" });
        return;
      }
      res.json(detail);
    } catch (error) {
      sendQuestionError(res, error, "Unable to load question detail");
    }
  },
);

router.post(
  "/:id/versions",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const questionId = assertQuestionId(req.params.id);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const input = normalizeQuestionVersionInput(req.body);

      const detail = await sqlClient.begin(async (tx) => {
        const questions = await tx`
          SELECT
            id,
            public_code AS "publicCode",
            status,
            lock_version AS "lockVersion",
            current_draft_version_id AS "currentDraftVersionId",
            approved_version_id AS "approvedVersionId"
          FROM content.questions
          WHERE id = ${questionId}::uuid
            AND deleted_at IS NULL
          FOR UPDATE
        `;
        const question = questions[0];
        if (!question) {
          throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
        }
        if (Number(question.lockVersion) !== input.expectedLockVersion) {
          throw new QuestionManagementError(
            "QUESTION_VERSION_CONFLICT",
            "This question changed after you opened it. Refresh before saving.",
            409,
          );
        }

        const currentVersionId = question.currentDraftVersionId ?? question.approvedVersionId;
        if (!currentVersionId) {
          throw new QuestionManagementError("QUESTION_VERSION_REQUIRED", "Question has no editable version", 409);
        }

        const currentVersions = await tx`
          SELECT
            exam_version_id AS "examVersionId",
            pattern_id AS "patternId",
            answer_model AS "answerModel",
            default_marks AS "defaultMarks",
            default_negative_marks AS "defaultNegativeMarks",
            target_time_seconds AS "targetTimeSeconds"
          FROM content.question_versions
          WHERE id = ${String(currentVersionId)}::uuid
          LIMIT 1
        `;
        const currentVersion = currentVersions[0];
        if (!currentVersion) {
          throw new QuestionManagementError("QUESTION_VERSION_REQUIRED", "Current question version is missing", 409);
        }

        const versionNumbers = await tx`
          SELECT COALESCE(MAX(version_number), 0)::int + 1 AS "nextVersionNumber"
          FROM content.question_versions
          WHERE question_id = ${questionId}::uuid
        `;
        const nextVersionNumber = Number(versionNumbers[0]?.nextVersionNumber ?? 1);
        const versionId = randomUUID();
        const previousAnswerModel = asRecord(currentVersion.answerModel);
        const answerModel = {
          ...previousAnswerModel,
          kind: "single_choice",
          correctIndex: input.correctIndex,
          correctOptionKey: optionKey(input.correctIndex),
          canonicalAnswer: input.options[input.correctIndex].text,
        };

        await tx`
          INSERT INTO content.question_versions (
            id,
            question_id,
            version_number,
            exam_version_id,
            pattern_id,
            question_type,
            difficulty,
            stem,
            explanation,
            answer_model,
            default_marks,
            default_negative_marks,
            target_time_seconds,
            change_reason,
            created_by,
            created_at
          ) VALUES (
            ${versionId}::uuid,
            ${questionId}::uuid,
            ${nextVersionNumber},
            ${currentVersion.examVersionId ? String(currentVersion.examVersionId) : null}::uuid,
            ${currentVersion.patternId ? String(currentVersion.patternId) : null}::uuid,
            ${input.questionType},
            ${input.difficulty},
            ${input.stem},
            ${input.explanation},
            ${tx.json(answerModel)},
            ${String(currentVersion.defaultMarks ?? "1")},
            ${String(currentVersion.defaultNegativeMarks ?? "0")},
            ${currentVersion.targetTimeSeconds == null ? null : Number(currentVersion.targetTimeSeconds)},
            ${input.changeReason},
            ${actorUserId}::uuid,
            now()
          )
        `;

        for (let index = 0; index < input.options.length; index += 1) {
          const option = input.options[index];
          await tx`
            INSERT INTO content.question_options (
              id, question_version_id, option_key, text, sort_order, is_correct
            ) VALUES (
              ${randomUUID()}::uuid,
              ${versionId}::uuid,
              ${optionKey(index)},
              ${option.text},
              ${index + 1},
              ${option.isCorrect}
            )
          `;
        }

        await tx`
          UPDATE content.questions
          SET
            current_draft_version_id = ${versionId}::uuid,
            status = 'draft'::question_status,
            lock_version = lock_version + 1,
            updated_at = now()
          WHERE id = ${questionId}::uuid
        `;

        await tx`
          INSERT INTO platform.audit_events (
            id,
            actor_type,
            actor_user_id,
            action_key,
            entity_type,
            entity_id,
            entity_version_id,
            reason,
            summary,
            metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            'content.question.version.created',
            'question',
            ${questionId}::uuid,
            ${versionId}::uuid,
            ${input.changeReason},
            ${`Created version ${nextVersionNumber} for ${String(question.publicCode)}`},
            ${tx.json({ previousVersionId: currentVersionId, versionNumber: nextVersionNumber })}
          )
        `;

        return loadQuestionDetail(questionId, tx as QuestionSqlExecutor);
      });

      res.status(201).json(detail);
    } catch (error) {
      sendQuestionError(res, error, "Unable to create question version");
    }
  },
);

function registerLifecycleAction(action: string) {
  const config = getQuestionLifecycleConfig(action);
  router.post(
    `/:id/actions/${action}`,
    requireAdminPermission(config.permission),
    async (req, res) => {
      try {
        const questionId = assertQuestionId(req.params.id);
        const actorUserId = req.adminSession?.user.id;
        if (!actorUserId) {
          res.status(403).json({ error: "Administrator session required" });
          return;
        }
        const input = normalizeLifecycleInput(action, req.body);

        const detail = await sqlClient.begin(async (tx) => {
          const rows = await tx`
            SELECT
              id,
              public_code AS "publicCode",
              status,
              lock_version AS "lockVersion",
              current_draft_version_id AS "currentDraftVersionId",
              approved_version_id AS "approvedVersionId"
            FROM content.questions
            WHERE id = ${questionId}::uuid
              AND deleted_at IS NULL
            FOR UPDATE
          `;
          const question = rows[0];
          if (!question) {
            throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
          }
          if (Number(question.lockVersion) !== input.expectedLockVersion) {
            throw new QuestionManagementError(
              "QUESTION_VERSION_CONFLICT",
              "This question changed after you opened it. Refresh before continuing.",
              409,
            );
          }

          const targetVersionId = question.currentDraftVersionId ?? question.approvedVersionId;
          if (input.config.status === "approved" && !targetVersionId) {
            throw new QuestionManagementError("QUESTION_VERSION_REQUIRED", "Question has no version to approve", 409);
          }

          if (input.config.status === "approved") {
            await tx`
              UPDATE content.questions
              SET
                status = 'approved'::question_status,
                current_draft_version_id = ${String(targetVersionId)}::uuid,
                approved_version_id = ${String(targetVersionId)}::uuid,
                lock_version = lock_version + 1,
                updated_at = now()
              WHERE id = ${questionId}::uuid
            `;
          } else {
            await tx`
              UPDATE content.questions
              SET
                status = ${input.config.status}::question_status,
                lock_version = lock_version + 1,
                updated_at = now()
              WHERE id = ${questionId}::uuid
            `;
          }

          await tx`
            INSERT INTO platform.audit_events (
              id,
              actor_type,
              actor_user_id,
              action_key,
              entity_type,
              entity_id,
              entity_version_id,
              reason,
              summary,
              metadata
            ) VALUES (
              ${randomUUID()}::uuid,
              'user'::audit_actor_type,
              ${actorUserId}::uuid,
              ${input.config.actionKey},
              'question',
              ${questionId}::uuid,
              ${targetVersionId ? String(targetVersionId) : null}::uuid,
              ${input.reason || null},
              ${`${String(question.publicCode)} moved from ${String(question.status)} to ${input.config.status}`},
              ${tx.json({ previousStatus: question.status, status: input.config.status })}
            )
          `;

          return loadQuestionDetail(questionId, tx as QuestionSqlExecutor);
        });

        res.json(detail);
      } catch (error) {
        sendQuestionError(res, error, "Unable to update question lifecycle");
      }
    },
  );
}

registerLifecycleAction("submit-review");
registerLifecycleAction("approve");
registerLifecycleAction("needs-fix");
registerLifecycleAction("restore-draft");
registerLifecycleAction("archive");

router.post(
  "/reconcile-approved",
  requireAdminPermission("content.generation.review"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }

      const converted = await sqlClient.begin(async (tx) => {
        const pending = await tx`
          SELECT id::text AS id
          FROM content.generation_run_items
          WHERE status = 'approved'::generation_item_status
            AND accepted_question_id IS NULL
          ORDER BY updated_at ASC
          LIMIT 500
          FOR UPDATE SKIP LOCKED
        `;

        const results = [];
        for (const row of pending) {
          const result = await convertApprovedGenerationItem(
            tx as QuestionSqlExecutor,
            String(row.id),
            actorUserId,
          );
          if (result) results.push(result);
        }
        return results;
      });

      res.json({ converted, convertedCount: converted.length });
    } catch (error) {
      sendQuestionError(res, error, "Unable to reconcile approved questions");
    }
  },
);

export default router;
