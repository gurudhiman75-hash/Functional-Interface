import { randomUUID } from "node:crypto";

import {
  convertApprovedGenerationItem,
  getGeneratedQuestionBankAcceptanceMode,
  type ConvertedQuestion,
  type QuestionSqlExecutor,
} from "./admin-question-conversion";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Optional keyed dedup for BANK_ONLY admission packages.
 *
 * Packages without an explicit questionBankAdmissionKey retain the established
 * converter unchanged. BTD CP012 supplies a key derived from the certified
 * frozen-content identity. The transaction advisory lock serializes concurrent
 * approvals for the same key, and the first approved bank row is reused by
 * later generation items instead of creating duplicate Question Bank rows.
 */
export async function convertApprovedGenerationItemDedupSafe(
  client: QuestionSqlExecutor,
  itemId: string,
  actorUserId: string,
): Promise<ConvertedQuestion | null> {
  const sourceRows = await client`
    SELECT
      i.status::text AS status,
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

  const source = sourceRows[0];
  if (!source || String(source.status) !== "approved") return null;
  const payload = asRecord(source.payload);
  const generationContext = asRecord(payload.generationContext);
  const admissionKey = asText(
    payload.questionBankAdmissionKey ?? generationContext.questionBankAdmissionKey,
  );
  const packageId = asText(payload.packageId ?? generationContext.packageId).toUpperCase();
  const acceptanceMode = getGeneratedQuestionBankAcceptanceMode(payload);

  if (!admissionKey || acceptanceMode !== "BANK_ONLY") {
    return convertApprovedGenerationItem(client, itemId, actorUserId);
  }

  if (packageId === "BTD-001" && asText(payload.questionId) !== admissionKey) {
    throw new Error("BTD-001 bank admission provider identity does not match its certified admission key.");
  }

  await client`
    SELECT pg_advisory_xact_lock(hashtextextended(${admissionKey}, 0))
  `;

  const existingRows = await client`
    SELECT
      q.id::text AS "questionId",
      q.public_code AS "publicCode",
      qv.id::text AS "questionVersionId"
    FROM content.question_versions qv
    INNER JOIN content.questions q
      ON q.id = qv.question_id
     AND q.approved_version_id = qv.id
    WHERE qv.answer_model #>> '{generation,providerQuestionId}' = ${admissionKey}
      AND qv.answer_model #>> '{generation,packageId}' = ${packageId}
    ORDER BY q.created_at ASC
    LIMIT 1
  `;

  const existing = existingRows[0];
  if (!existing) {
    return convertApprovedGenerationItem(client, itemId, actorUserId);
  }

  const questionId = String(existing.questionId);
  const questionVersionId = String(existing.questionVersionId);
  const publicCode = String(existing.publicCode);

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
      'content.question.reused_from_generation_dedup',
      'question',
      ${questionId}::uuid,
      ${questionVersionId}::uuid,
      'Approved generated item matched an existing bank-only admission identity',
      ${`Reused ${publicCode} for duplicate bank admission key`},
      ${JSON.stringify({
        generationItemId: itemId,
        generationRunCode: source.generationRunCode,
        packageId,
        questionBankAdmissionKey: admissionKey,
        questionBankAcceptanceMode: acceptanceMode,
        deduplicated: true,
      })}::jsonb
    )
  `;

  return { itemId, questionId, questionVersionId, publicCode };
}
