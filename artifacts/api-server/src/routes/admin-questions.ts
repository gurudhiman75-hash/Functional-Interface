import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  convertApprovedGenerationItem,
  optionKey,
  type QuestionSqlExecutor,
} from "../lib/admin-question-conversion";
import {
  QuestionManagementError,
  assertQuestionPublishable,
  getPublicationIssues,
  getQuestionLifecycleConfig,
  normalizeLifecycleInput,
  normalizeQuestionTaxonomyInput,
  normalizeQuestionVersionInput,
  type PublishableQuestionSnapshot,
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
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

async function publicationSnapshot(
  questionId: string,
  client: QuestionSqlExecutor = sqlClient,
): Promise<PublishableQuestionSnapshot | null> {
  const rows = await client`
    SELECT
      q.status,
      q.approved_version_id::text AS "approvedVersionId",
      v.exam_version_id::text AS "examVersionId",
      q.primary_taxonomy_node_id::text AS "primaryTaxonomyNodeId",
      v.stem,
      v.explanation,
      COALESCE((
        SELECT array_agg(l.taxonomy_node_id::text ORDER BY l.taxonomy_node_id::text)
        FROM content.question_taxonomy_links l
        WHERE l.question_version_id = v.id
      ), '{}') AS "taxonomyNodeIds",
      COALESCE((
        SELECT COUNT(*)::int
        FROM content.question_options o
        WHERE o.question_version_id = v.id
      ), 0) AS "optionCount",
      COALESCE((
        SELECT COUNT(*)::int
        FROM content.question_options o
        WHERE o.question_version_id = v.id AND o.is_correct = true
      ), 0) AS "correctOptionCount"
    FROM content.questions q
    LEFT JOIN content.question_versions v ON v.id = q.approved_version_id
    WHERE q.id = ${questionId}::uuid
      AND q.deleted_at IS NULL
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    status: String(row.status),
    approvedVersionId: row.approvedVersionId ? String(row.approvedVersionId) : null,
    examVersionId: row.examVersionId ? String(row.examVersionId) : null,
    primaryTaxonomyNodeId: row.primaryTaxonomyNodeId ? String(row.primaryTaxonomyNodeId) : null,
    taxonomyNodeIds: Array.isArray(row.taxonomyNodeIds) ? row.taxonomyNodeIds.map(String) : [],
    stem: row.stem ? String(row.stem) : "",
    explanation: row.explanation ? String(row.explanation) : "",
    optionCount: Number(row.optionCount ?? 0),
    correctOptionCount: Number(row.correctOptionCount ?? 0),
  };
}

async function loadQuestionDetail(
  questionId: string,
  client: QuestionSqlExecutor = sqlClient,
) {
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
      q.published_version_id AS "publishedVersionId",
      q.published_at AS "publishedAt",
      q.published_by AS "publishedBy",
      q.lock_version AS "lockVersion",
      q.created_at AS "createdAt",
      q.updated_at AS "updatedAt",
      COALESCE(q.current_draft_version_id, q.approved_version_id, q.published_version_id) AS "displayVersionId"
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
      ev.name AS "examVersionName",
      e.id AS "examId",
      e.code AS "examCode",
      e.name AS "examName",
      ef.id AS "examFamilyId",
      ef.code AS "examFamilyCode",
      ef.name AS "examFamilyName",
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
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', o.id,
            'key', o.option_key,
            'text', o.text,
            'sortOrder', o.sort_order,
            'isCorrect', o.is_correct
          ) ORDER BY o.sort_order
        )
        FROM content.question_options o
        WHERE o.question_version_id = v.id
      ), '[]'::json) AS options,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', n.id,
            'code', n.code,
            'nodeType', n.node_type,
            'name', n.name,
            'isPrimary', l.is_primary
          ) ORDER BY l.is_primary DESC, n.node_type, n.name
        )
        FROM content.question_taxonomy_links l
        INNER JOIN catalog.taxonomy_nodes n ON n.id = l.taxonomy_node_id
        WHERE l.question_version_id = v.id
      ), '[]'::json) AS taxonomy
    FROM content.question_versions v
    LEFT JOIN catalog.exam_versions ev ON ev.id = v.exam_version_id
    LEFT JOIN catalog.exams e ON e.id = ev.exam_id
    LEFT JOIN catalog.exam_families ef ON ef.id = e.family_id
    WHERE v.question_id = ${questionId}::uuid
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

  const snapshot = await publicationSnapshot(questionId, client);
  return {
    question: questions[0],
    versions,
    auditEvents,
    publicationIssues: snapshot ? getPublicationIssues(snapshot) : ["Question is unavailable."],
    generatedAt: new Date().toISOString(),
  };
}

router.use(authenticate);

router.get(
  "/taxonomy/options",
  requireAdminPermission("content.questions.read"),
  async (_req, res) => {
    try {
      const families = await sqlClient`
        SELECT id, code, name
        FROM catalog.exam_families
        WHERE is_active = true
        ORDER BY name
      `;
      const exams = await sqlClient`
        SELECT
          e.id,
          e.family_id AS "familyId",
          e.code,
          e.name,
          ev.id AS "currentVersionId",
          ev.version_number AS "currentVersionNumber",
          ev.name AS "currentVersionName"
        FROM catalog.exams e
        LEFT JOIN catalog.exam_versions ev
          ON ev.exam_id = e.id AND ev.is_current = true
        WHERE e.is_active = true
        ORDER BY e.name
      `;
      const nodes = await sqlClient`
        SELECT
          n.id,
          n.code,
          n.node_type AS "nodeType",
          n.name,
          COALESCE((
            SELECT array_agg(edge.parent_id::text ORDER BY edge.sort_order, edge.parent_id::text)
            FROM catalog.taxonomy_edges edge
            WHERE edge.child_id = n.id
          ), '{}') AS "parentIds",
          COALESCE((
            SELECT array_agg(etn.exam_version_id::text ORDER BY etn.exam_version_id::text)
            FROM catalog.exam_taxonomy_nodes etn
            WHERE etn.taxonomy_node_id = n.id AND etn.is_active = true
          ), '{}') AS "examVersionIds"
        FROM catalog.taxonomy_nodes n
        WHERE n.is_active = true AND n.deleted_at IS NULL
        ORDER BY n.node_type, n.name
      `;
      res.json({ families, exams, nodes, generatedAt: new Date().toISOString() });
    } catch (error) {
      sendQuestionError(res, error, "Unable to load taxonomy options");
    }
  },
);

router.get(
  "/published",
  requireAdminPermission("content.questions.read"),
  async (_req, res) => {
    try {
      const questions = await sqlClient`
        SELECT
          q.id,
          q.public_code AS "publicCode",
          q.status,
          q.published_at AS "publishedAt",
          v.id AS "versionId",
          v.version_number AS "versionNumber",
          v.question_type AS "questionType",
          v.difficulty,
          v.stem,
          v.explanation,
          v.answer_model AS "answerModel",
          ev.id AS "examVersionId",
          e.code AS "examCode",
          e.name AS "examName",
          ef.code AS "examFamilyCode",
          ef.name AS "examFamilyName",
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', o.id,
                'key', o.option_key,
                'text', o.text,
                'sortOrder', o.sort_order,
                'isCorrect', o.is_correct
              ) ORDER BY o.sort_order
            )
            FROM content.question_options o
            WHERE o.question_version_id = v.id
          ), '[]'::json) AS options,
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', n.id,
                'code', n.code,
                'nodeType', n.node_type,
                'name', n.name,
                'isPrimary', l.is_primary
              ) ORDER BY l.is_primary DESC, n.node_type, n.name
            )
            FROM content.question_taxonomy_links l
            INNER JOIN catalog.taxonomy_nodes n ON n.id = l.taxonomy_node_id
            WHERE l.question_version_id = v.id
          ), '[]'::json) AS taxonomy
        FROM content.questions q
        INNER JOIN content.question_versions v ON v.id = q.published_version_id
        INNER JOIN catalog.exam_versions ev ON ev.id = v.exam_version_id
        INNER JOIN catalog.exams e ON e.id = ev.exam_id
        INNER JOIN catalog.exam_families ef ON ef.id = e.family_id
        WHERE q.deleted_at IS NULL
          AND q.published_version_id IS NOT NULL
          AND q.status <> 'archived'::question_status
          AND q.primary_taxonomy_node_id IS NOT NULL
        ORDER BY q.published_at DESC NULLS LAST, q.updated_at DESC
        LIMIT 5000
      `;
      res.json({ questions, generatedAt: new Date().toISOString() });
    } catch (error) {
      sendQuestionError(res, error, "Unable to load published questions");
    }
  },
);

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
          q.primary_taxonomy_node_id AS "primaryTaxonomyNodeId",
          q.current_draft_version_id AS "currentDraftVersionId",
          q.approved_version_id AS "approvedVersionId",
          q.published_version_id AS "publishedVersionId",
          q.published_at AS "publishedAt",
          q.lock_version AS "lockVersion",
          q.created_at AS "createdAt",
          q.updated_at AS "updatedAt",
          v.id AS "versionId",
          v.version_number AS "versionNumber",
          v.exam_version_id AS "examVersionId",
          e.code AS "examCode",
          e.name AS "examName",
          v.question_type AS "questionType",
          v.difficulty,
          v.stem,
          v.explanation,
          v.answer_model AS "answerModel",
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', o.id,
                'key', o.option_key,
                'text', o.text,
                'sortOrder', o.sort_order,
                'isCorrect', o.is_correct
              ) ORDER BY o.sort_order
            )
            FROM content.question_options o
            WHERE o.question_version_id = v.id
          ), '[]'::json) AS options,
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', n.id,
                'code', n.code,
                'nodeType', n.node_type,
                'name', n.name,
                'isPrimary', l.is_primary
              ) ORDER BY l.is_primary DESC, n.node_type, n.name
            )
            FROM content.question_taxonomy_links l
            INNER JOIN catalog.taxonomy_nodes n ON n.id = l.taxonomy_node_id
            WHERE l.question_version_id = v.id
          ), '[]'::json) AS taxonomy
        FROM content.questions q
        INNER JOIN content.question_versions v
          ON v.id = COALESCE(q.current_draft_version_id, q.approved_version_id, q.published_version_id)
        LEFT JOIN catalog.exam_versions ev ON ev.id = v.exam_version_id
        LEFT JOIN catalog.exams e ON e.id = ev.exam_id
        WHERE q.deleted_at IS NULL
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

router.patch(
  "/:id/taxonomy",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const questionId = assertQuestionId(req.params.id);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const input = normalizeQuestionTaxonomyInput(req.body);

      const detail = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT
            id,
            public_code AS "publicCode",
            status,
            lock_version AS "lockVersion",
            current_draft_version_id AS "currentDraftVersionId",
            approved_version_id AS "approvedVersionId",
            published_version_id AS "publishedVersionId"
          FROM content.questions
          WHERE id = ${questionId}::uuid AND deleted_at IS NULL
          FOR UPDATE
        `;
        const question = rows[0];
        if (!question) throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
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
            ${tx.json({
              examVersionId: input.examVersionId,
              primaryTaxonomyNodeId: input.primaryTaxonomyNodeId,
              taxonomyNodeIds: input.taxonomyNodeIds,
            })}
          )
        `;
        return loadQuestionDetail(questionId, tx as QuestionSqlExecutor);
      });

      res.json(detail);
    } catch (error) {
      sendQuestionError(res, error, "Unable to update question taxonomy");
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
          WHERE id = ${questionId}::uuid AND deleted_at IS NULL
          FOR UPDATE
        `;
        const question = questions[0];
        if (!question) throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
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
            id, question_id, version_number, exam_version_id, pattern_id,
            question_type, difficulty, stem, explanation, answer_model,
            default_marks, default_negative_marks, target_time_seconds,
            change_reason, created_by, created_at
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
          INSERT INTO content.question_taxonomy_links (
            question_version_id, taxonomy_node_id, is_primary
          )
          SELECT ${versionId}::uuid, taxonomy_node_id, is_primary
          FROM content.question_taxonomy_links
          WHERE question_version_id = ${String(currentVersionId)}::uuid
        `;
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
            id, actor_type, actor_user_id, action_key, entity_type,
            entity_id, entity_version_id, reason, summary, metadata
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
              approved_version_id AS "approvedVersionId",
              published_version_id AS "publishedVersionId"
            FROM content.questions
            WHERE id = ${questionId}::uuid AND deleted_at IS NULL
            FOR UPDATE
          `;
          const question = rows[0];
          if (!question) throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
          if (Number(question.lockVersion) !== input.expectedLockVersion) {
            throw new QuestionManagementError(
              "QUESTION_VERSION_CONFLICT",
              "This question changed after you opened it. Refresh before continuing.",
              409,
            );
          }

          const targetVersionId = question.currentDraftVersionId ?? question.approvedVersionId;
          if (input.config.status === "approved" && action === "approve" && !targetVersionId) {
            throw new QuestionManagementError("QUESTION_VERSION_REQUIRED", "Question has no version to approve", 409);
          }

          let auditVersionId = targetVersionId ? String(targetVersionId) : null;
          let nextStatus = input.config.status;

          if (action === "publish") {
            const snapshot = await publicationSnapshot(questionId, tx as QuestionSqlExecutor);
            if (!snapshot) throw new QuestionManagementError("QUESTION_NOT_FOUND", "Question not found", 404);
            assertQuestionPublishable(snapshot);
            auditVersionId = snapshot.approvedVersionId;
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
          } else if (action === "unpublish") {
            if (!question.publishedVersionId) {
              throw new QuestionManagementError("QUESTION_NOT_PUBLISHED", "Question is not currently published", 409);
            }
            auditVersionId = String(question.publishedVersionId);
            nextStatus = String(question.status) === "published" ? "approved" : String(question.status) as typeof nextStatus;
            await tx`
              UPDATE content.questions
              SET
                status = ${nextStatus}::question_status,
                published_version_id = NULL,
                published_at = NULL,
                published_by = NULL,
                lock_version = lock_version + 1,
                updated_at = now()
              WHERE id = ${questionId}::uuid
            `;
          } else if (action === "approve") {
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
          } else if (action === "archive") {
            await tx`
              UPDATE content.questions
              SET
                status = 'archived'::question_status,
                published_version_id = NULL,
                published_at = NULL,
                published_by = NULL,
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
              id, actor_type, actor_user_id, action_key, entity_type,
              entity_id, entity_version_id, reason, summary, metadata
            ) VALUES (
              ${randomUUID()}::uuid,
              'user'::audit_actor_type,
              ${actorUserId}::uuid,
              ${input.config.actionKey},
              'question',
              ${questionId}::uuid,
              ${auditVersionId}::uuid,
              ${input.reason || null},
              ${`${String(question.publicCode)} moved from ${String(question.status)} to ${nextStatus}`},
              ${tx.json({ previousStatus: question.status, status: nextStatus })}
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
registerLifecycleAction("publish");
registerLifecycleAction("unpublish");
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
