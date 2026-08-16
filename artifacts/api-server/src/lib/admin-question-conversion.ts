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

const SPATIAL_SVG_ALLOWED_TAGS = new Set([
  "svg",
  "line",
  "circle",
  "polygon",
  "polyline",
  "path",
]);

function safeSpatialSvg(value: unknown, label: string): string {
  const svg = asText(value);
  if (!svg || svg.length > 100_000 || !/^<svg\b/i.test(svg) || !/<\/svg>$/i.test(svg)) {
    throw new Error(`${label} is not a bounded Spatial SVG document`);
  }
  if (
    /<\s*(?:script|foreignObject|iframe|object|embed|image|use|style|a)\b/i.test(svg) ||
    /\bon[a-z]+\s*=|\b(?:href|xlink:href)\s*=|javascript:|data:/i.test(svg)
  ) {
    throw new Error(`${label} contains disallowed active SVG content`);
  }
  for (const match of svg.matchAll(/<\/?\s*([a-zA-Z][a-zA-Z0-9:-]*)\b/g)) {
    const tag = String(match[1] ?? "").toLowerCase();
    if (!SPATIAL_SVG_ALLOWED_TAGS.has(tag)) {
      throw new Error(`${label} contains unsupported SVG element <${tag}>`);
    }
  }
  return svg;
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function encodeGeneratedSpatialSvgImage(
  value: unknown,
  alt: string,
): string {
  const svg = safeSpatialSvg(value, alt);
  const encoded = Buffer.from(svg, "utf8").toString("base64");
  return `<img src="data:image/svg+xml;base64,${encoded}" alt="${escapeHtmlAttribute(alt)}" loading="lazy" />`;
}

function spatialVisualContent(payload: Record<string, unknown>): {
  stimulus: string[];
  options: string[];
} | null {
  const packageId = asText(payload.packageId).toUpperCase();
  const hasSpatialFields = Array.isArray(payload.optionSvgs) || Array.isArray(payload.stimulusSvgs);
  if (packageId !== "SPA-001" && !hasSpatialFields) return null;

  const optionSvgs = Array.isArray(payload.optionSvgs) ? payload.optionSvgs : [];
  if (optionSvgs.length !== 4) {
    throw new Error("SPA-001 approval requires exactly four rendered SVG options");
  }
  const stimulusSvgs = Array.isArray(payload.stimulusSvgs) ? payload.stimulusSvgs : [];
  return {
    stimulus: stimulusSvgs.map((svg, index) =>
      encodeGeneratedSpatialSvgImage(svg, `Spatial question figure ${index + 1}`),
    ),
    options: optionSvgs.map((svg, index) =>
      encodeGeneratedSpatialSvgImage(svg, `Spatial option ${optionKey(index)}`),
    ),
  };
}

export function normalizeGeneratedQuestionPayload(
  value: unknown,
  context: { itemId: string; generationRunCode: string },
): NormalizedGeneratedQuestion {
  const payload = asRecord(value);
  assertGeneratedQuestionBankEligible(payload);
  const baseStem = asText(payload.text) || asText(payload.stem);
  const explanation =
    asText(payload.explanation) || "Explanation pending editorial review.";
  const difficulty =
    asText(payload.difficultyLabel) || asText(payload.difficulty) || "Medium";
  const visualContent = spatialVisualContent(payload);
  const options = visualContent
    ? visualContent.options
    : Array.isArray(payload.options)
      ? payload.options.map((entry) => String(entry ?? "").trim()).filter(Boolean)
      : [];
  const stem = visualContent && visualContent.stimulus.length > 0
    ? [baseStem, ...visualContent.stimulus].filter(Boolean).join("\n\n")
    : baseStem;
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
        packageId: payload.packageId ?? null,
        patternId: payload.patternId ?? null,
        topic: payload.topic ?? null,
        subtopic: payload.subtopic ?? null,
        language: payload.language ?? "en",
        visualContent: visualContent ? "spatial_svg_data_image_v1" : null,
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
