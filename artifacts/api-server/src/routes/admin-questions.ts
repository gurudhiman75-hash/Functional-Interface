import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";

const router = Router();

type SqlExecutor = typeof sqlClient;

type ConvertedQuestion = {
  itemId: string;
  questionId: string;
  questionVersionId: string;
  publicCode: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function questionPublicCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
  return `Q-${date}-${suffix}`;
}

function optionKey(index: number): string {
  return String.fromCharCode(65 + index);
}

async function convertApprovedItem(
  client: SqlExecutor,
  itemId: string,
  actorUserId: string,
): Promise<ConvertedQuestion | null> {
  const rows = await client`
    SELECT
      i.id,
      i.status,
      i.accepted_question_id AS "acceptedQuestionId",
      i.accepted_question_version_id AS "acceptedQuestionVersionId",
      v.payload,
      r.public_code AS "generationRunCode"
    FROM content.generation_run_items i
    INNER JOIN content.generation_runs r ON r.id = i.generation_run_id
    INNER JOIN content.generation_item_versions v
      ON v.generation_item_id = i.id
     AND v.version_number = i.current_version_number
    WHERE i.id = ${itemId}::uuid
    FOR UPDATE OF i
  `;

  const row = rows[0];
  if (!row || String(row.status) !== "approved") return null;

  if (row.acceptedQuestionId && row.acceptedQuestionVersionId) {
    const existing = await client`
      SELECT public_code AS "publicCode"
      FROM content.questions
      WHERE id = ${String(row.acceptedQuestionId)}::uuid
      LIMIT 1
    `;
    return {
      itemId,
      questionId: String(row.acceptedQuestionId),
      questionVersionId: String(row.acceptedQuestionVersionId),
      publicCode: String(existing[0]?.publicCode ?? ""),
    };
  }

  const payload = asRecord(row.payload);
  const stem = asText(payload.text) || asText(payload.stem);
  const explanation = asText(payload.explanation) || "Explanation pending editorial review.";
  const difficulty = asText(payload.difficultyLabel) || asText(payload.difficulty) || "Medium";
  const options = Array.isArray(payload.options)
    ? payload.options.map((value) => String(value ?? "").trim()).filter(Boolean)
    : [];
  const correctIndexRaw = Number(payload.correctIndex ?? payload.correct);
  const correctIndex = Number.isInteger(correctIndexRaw) ? correctIndexRaw : -1;

  if (!stem) {
    throw new Error(`Approved generation item ${itemId} has no question stem`);
  }
  if (options.length < 2 || correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(`Approved generation item ${itemId} has an invalid option model`);
  }

  const questionId = randomUUID();
  const questionVersionId = randomUUID();
  const publicCode = questionPublicCode();
  const answerModel = {
    kind: "single_choice",
    correctIndex,
    correctOptionKey: optionKey(correctIndex),
    canonicalAnswer: payload.canonicalAnswer ?? payload.answer ?? null,
    generation: {
      generationItemId: itemId,
      generationRunCode: String(row.generationRunCode),
      providerQuestionId: payload.questionId ?? null,
      packageId: payload.packageId ?? null,
      patternId: payload.patternId ?? null,
      topic: payload.topic ?? null,
      subtopic: payload.subtopic ?? null,
      language: payload.language ?? "en",
    },
  };

  await client`
    INSERT INTO content.questions (
      id,
      public_code,
      status,
      author_user_id,
      lock_version,
      created_at,
      updated_at
    ) VALUES (
      ${questionId}::uuid,
      ${publicCode},
      'approved'::question_status,
      ${actorUserId}::uuid,
      0,
      now(),
      now()
    )
  `;

  await client`
    INSERT INTO content.question_versions (
      id,
      question_id,
      version_number,
      question_type,
      difficulty,
      stem,
      explanation,
      answer_model,
      default_marks,
      default_negative_marks,
      change_reason,
      created_by,
      created_at
    ) VALUES (
      ${questionVersionId}::uuid,
      ${questionId}::uuid,
      1,
      'mcq_single',
      ${difficulty},
      ${stem},
      ${explanation},
      ${client.json(answerModel)},
      1,
      0,
      'Approved from Question Studio generation item',
      ${actorUserId}::uuid,
      now()
    )
  `;

  for (let index = 0; index < options.length; index += 1) {
    await client`
      INSERT INTO content.question_options (
        id,
        question_version_id,
        option_key,
        text,
        sort_order,
        is_correct
      ) VALUES (
        ${randomUUID()}::uuid,
        ${questionVersionId}::uuid,
        ${optionKey(index)},
        ${options[index]},
        ${index + 1},
        ${index === correctIndex}
      )
    `;
  }

  await client`
    UPDATE content.questions
    SET
      current_draft_version_id = ${questionVersionId}::uuid,
      approved_version_id = ${questionVersionId}::uuid,
      updated_at = now()
    WHERE id = ${questionId}::uuid
  `;

  await client`
    UPDATE content.generation_run_items
    SET
      accepted_question_id = ${questionId}::uuid,
      accepted_question_version_id = ${questionVersionId}::uuid,
      reviewer_user_id = ${actorUserId}::uuid,
      updated_at = now()
    WHERE id = ${itemId}::uuid
  `;

  await client`
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
      'content.question.created_from_generation',
      'question',
      ${questionId}::uuid,
      ${questionVersionId}::uuid,
      'Approved Question Studio item converted to Question Bank',
      ${`Created ${publicCode} from approved generation item`},
      ${client.json({ generationItemId: itemId, generationRunCode: row.generationRunCode })}
    )
  `;

  return { itemId, questionId, questionVersionId, publicCode };
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
        INNER JOIN content.question_versions v ON v.id = q.approved_version_id
        LEFT JOIN content.question_options o ON o.question_version_id = v.id
        WHERE q.deleted_at IS NULL
          AND q.status = 'approved'::question_status
        GROUP BY q.id, v.id
        ORDER BY q.updated_at DESC
        LIMIT 500
      `;

      res.json({ questions, generatedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Admin Question Bank list failed", error);
      res.status(500).json({ error: "Unable to load approved Question Bank records" });
    }
  },
);

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

        const results: ConvertedQuestion[] = [];
        for (const row of pending) {
          const result = await convertApprovedItem(tx as SqlExecutor, String(row.id), actorUserId);
          if (result) results.push(result);
        }
        return results;
      });

      res.json({ converted, convertedCount: converted.length });
    } catch (error) {
      console.error("Approved item reconciliation failed", error);
      const message = error instanceof Error ? error.message : "Unable to reconcile approved questions";
      res.status(422).json({ error: message });
    }
  },
);

export default router;
