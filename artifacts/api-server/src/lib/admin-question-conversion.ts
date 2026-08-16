import { randomUUID } from "node:crypto";

import { sqlClient } from "./db";

export type QuestionSqlExecutor = typeof sqlClient;

export type ConvertedQuestion = {
  itemId: string;
  questionId: string;
  questionVersionId: string;
  publicCode: string;
};

export type NormalizedGeneratedQuestion = {
  stem: string;
  explanation: string;
  difficulty: string;
  options: string[];
  correctIndex: number;
  answerModel: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getGeneratedQuestionBankEligibilityIssue(
  value: unknown,
): string | null {
  const payload = asRecord(value);
  const generationContext = asRecord(payload.generationContext);
  const runtimeMode = asText(
    payload.runtimeMode || generationContext.runtimeMode,
  ).toUpperCase();
  const reviewStatus = asText(
    payload.reviewStatus || generationContext.reviewStatus,
  ).toUpperCase();
  const questionBankStatus = asText(
    payload.questionBankStatus || generationContext.questionBankStatus,
  ).toUpperCase();
  const testEligibility = asText(
    payload.testEligibility || generationContext.testEligibility,
  ).toUpperCase();
  const publiclyPublishable =
    payload.publiclyPublishable ?? generationContext.publiclyPublishable;

  if (questionBankStatus === "NOT_STORED") {
    return "questionBankStatus is NOT_STORED";
  }
  if (testEligibility === "INELIGIBLE") {
    return "testEligibility is INELIGIBLE";
  }
  if (publiclyPublishable === false) {
    return "publiclyPublishable is false";
  }
  if (runtimeMode === "DYNAMIC_CANDIDATE") {
    return `runtimeMode ${runtimeMode} is review-only`;
  }
  if (
    runtimeMode === "CANONICAL_REVIEW" &&
    reviewStatus !== "APPROVED_EDITORIAL_CANONICAL"
  ) {
    return `reviewStatus ${reviewStatus || "MISSING"} is not release-approved`;
  }
  return null;
}

export function assertGeneratedQuestionBankEligible(value: unknown): void {
  const issue = getGeneratedQuestionBankEligibilityIssue(value);
  if (issue) {
    throw new Error(
      `Generated question cannot be converted to Question Bank: ${issue}.`,
    );
  }
}

export function optionKey(index: number): string {
  return String.fromCharCode(65 + index);
}

export function questionPublicCode(
  now = new Date(),
  uuid = randomUUID(),
): string {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = uuid.replaceAll("-", "").slice(0, 10).toUpperCase();
  return `Q-${date}-${suffix}`;
}

export function normalizeGeneratedQuestionPayload(
  value: unknown,
  context: { itemId: string; generationRunCode: string },
): NormalizedGeneratedQuestion {
  const payload = asRecord(value);
  assertGeneratedQuestionBankEligible(payload);
  const stem = asText(payload.text) || asText(payload.stem);
  const explanation =
    asText(payload.explanation) || "Explanation pending editorial review.";
  const difficulty =
    asText(payload.difficultyLabel) || asText(payload.difficulty) || "Medium";
  const options = Array.isArray(payload.options)
    ? payload.options.map((entry) => String(entry ?? "").trim()).filter(Boolean)
    : [];
  const correctIndexRaw = Number(payload.correctIndex ?? payload.correct);
  const correctIndex = Number.isInteger(correctIndexRaw) ? correctIndexRaw : -1;

  if (!stem) {
    throw new Error(
      `Approved generation item ${context.itemId} has no question stem`,
    );
  }
  if (
    options.length < 2 ||
    correctIndex < 0 ||
    correctIndex >= options.length
  ) {
    throw new Error(
      `Approved generation item ${context.itemId} has an invalid option model`,
    );
  }

  const proceduralLogic = asRecord(payload.proceduralLogic);
  const solutionDiagram =
    payload.solutionDiagram ?? proceduralLogic.solutionDiagram ?? null;

  return {
    stem,
    explanation,
    difficulty,
    options,
    correctIndex,
    answerModel: {
      kind: "single_choice",
      correctIndex,
      correctOptionKey: optionKey(correctIndex),
      canonicalAnswer:
        payload.canonicalAnswer ?? payload.answer ?? options[correctIndex],
      generation: {
        generationItemId: context.itemId,
        generationRunCode: context.generationRunCode,
        providerQuestionId: payload.questionId ?? null,
        packageId: payload.packageId ?? proceduralLogic.packageId ?? null,
        patternId: payload.patternId ?? null,
        topic: payload.topic ?? null,
        subtopic: payload.subtopic ?? null,
        language: payload.language ?? "en",
        cpId: payload.cpId ?? proceduralLogic.cpId ?? null,
        qlId: payload.qlId ?? proceduralLogic.qlId ?? null,
        approvedBaselineHead:
          payload.approvedBaselineHead ?? proceduralLogic.approvedBaselineHead ?? null,
        solutionDiagram,
      },
    },
  };
}

export async function convertApprovedGenerationItem(
  client: QuestionSqlExecutor,
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

  const normalized = normalizeGeneratedQuestionPayload(row.payload, {
    itemId,
    generationRunCode: String(row.generationRunCode),
  });
  const questionId = randomUUID();
  const questionVersionId = randomUUID();
  const publicCode = questionPublicCode();

  await client`
    INSERT INTO content.questions (
      id, public_code, status, author_user_id, lock_version, created_at, updated_at
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
      ${normalized.difficulty},
      ${normalized.stem},
      ${normalized.explanation},
      ${JSON.stringify(normalized.answerModel)}::jsonb,
      1,
      0,
      'Approved from generated question review',
      ${actorUserId}::uuid,
      now()
    )
  `;

  for (let index = 0; index < normalized.options.length; index += 1) {
    await client`
      INSERT INTO content.question_options (
        id, question_version_id, option_key, text, sort_order, is_correct
      ) VALUES (
        ${randomUUID()}::uuid,
        ${questionVersionId}::uuid,
        ${optionKey(index)},
        ${normalized.options[index]},
        ${index + 1},
        ${index === normalized.correctIndex}
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
      'Approved generated item converted to Question Bank',
      ${`Created ${publicCode} from approved generation item`},
      ${JSON.stringify({ generationItemId: itemId, generationRunCode: row.generationRunCode })}::jsonb
    )
  `;

  return { itemId, questionId, questionVersionId, publicCode };
}
