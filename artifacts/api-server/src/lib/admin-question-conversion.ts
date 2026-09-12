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

function lifecycleValue(
  payload: Record<string, unknown>,
  generationContext: Record<string, unknown>,
  key: string,
): unknown {
  return payload[key] ?? generationContext[key];
}

export function getGeneratedQuestionBankAcceptanceMode(value: unknown): "BANK_ONLY" | "FULL_RELEASE" {
  const payload = asRecord(value);
  const generationContext = asRecord(payload.generationContext);
  const mode = asText(
    lifecycleValue(payload, generationContext, "questionBankAcceptanceMode"),
  ).toUpperCase();
  return mode === "BANK_ONLY" ? "BANK_ONLY" : "FULL_RELEASE";
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
    lifecycleValue(payload, generationContext, "questionBankStatus"),
  ).toUpperCase();
  const questionBankWritable = lifecycleValue(
    payload,
    generationContext,
    "questionBankWritable",
  );
  const testEligibility = asText(
    lifecycleValue(payload, generationContext, "testEligibility"),
  ).toUpperCase();
  const publiclyPublishable = lifecycleValue(
    payload,
    generationContext,
    "publiclyPublishable",
  );
  const acceptanceMode = getGeneratedQuestionBankAcceptanceMode(payload);

  if (questionBankStatus === "NOT_STORED") {
    return "questionBankStatus is NOT_STORED";
  }
  if (questionBankWritable === false) {
    return "questionBankWritable is false";
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

  // BANK_ONLY is an explicit lifecycle checkpoint: the generated item may be
  // accepted into Question Bank while scored-test and publication gates stay
  // closed. The downstream locks are copied into answer_model.generation and
  // are re-checked by the Question Bank publication gate.
  if (acceptanceMode === "BANK_ONLY") return null;

  if (testEligibility === "INELIGIBLE") {
    return "testEligibility is INELIGIBLE";
  }
  if (publiclyPublishable === false) {
    return "publiclyPublishable is false";
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
  "g",
  "defs",
  "clippath",
  "marker",
  "rect",
  "line",
  "circle",
  "polygon",
  "polyline",
  "path",
  "text",
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

type SpatialVisualContent = {
  stimulus: string[];
  optionImages: string[] | null;
  kind: "spatial_svg_data_image_v1" | "spatial_svg_stimulus_numeric_options_v1";
};

function spatialVisualContent(payload: Record<string, unknown>): SpatialVisualContent | null {
  const packageId = asText(payload.packageId).toUpperCase();
  const hasSpatialFields = Array.isArray(payload.optionSvgs) || Array.isArray(payload.stimulusSvgs);
  if (packageId !== "SPA-001" && !hasSpatialFields) return null;

  const stimulusSvgs = Array.isArray(payload.stimulusSvgs) ? payload.stimulusSvgs : [];
  const stimulus = stimulusSvgs.map((svg, index) =>
    encodeGeneratedSpatialSvgImage(svg, `Spatial question figure ${index + 1}`),
  );
  const optionSvgs = Array.isArray(payload.optionSvgs) ? payload.optionSvgs : [];
  if (optionSvgs.length > 0) {
    if (optionSvgs.length !== 4) {
      throw new Error("SPA-001 approval requires exactly four rendered SVG options");
    }
    return {
      stimulus,
      optionImages: optionSvgs.map((svg, index) =>
        encodeGeneratedSpatialSvgImage(svg, `Spatial option ${optionKey(index)}`),
      ),
      kind: "spatial_svg_data_image_v1",
    };
  }

  const rendererKind = asText(asRecord(payload.renderer).kind).toUpperCase();
  if (rendererKind === "SVG_WITH_NUMERIC_OPTIONS") {
    if (stimulusSvgs.length !== 1) {
      throw new Error("SPA-001 numeric-option approval requires exactly one rendered SVG stimulus");
    }
    const rawOptions = Array.isArray(payload.options) ? payload.options : [];
    if (
      rawOptions.length !== 4 ||
      !rawOptions.every((entry) => typeof entry === "number" && Number.isFinite(entry))
    ) {
      throw new Error("SPA-001 numeric-option approval requires exactly four finite numeric options");
    }
    const numericOptions = rawOptions.map((entry) => String(entry));
    if (new Set(numericOptions).size !== 4) {
      throw new Error("SPA-001 numeric-option approval requires four unique numeric options");
    }
    return {
      stimulus,
      optionImages: null,
      kind: "spatial_svg_stimulus_numeric_options_v1",
    };
  }

  throw new Error("SPA-001 approval requires exactly four rendered SVG options");
}

export function normalizeGeneratedQuestionPayload(
  value: unknown,
  context: { itemId: string; generationRunCode: string },
): NormalizedGeneratedQuestion {
  const payload = asRecord(value);
  const generationContext = asRecord(payload.generationContext);
  assertGeneratedQuestionBankEligible(payload);
  const baseStem = asText(payload.text) || asText(payload.stem);
  const baseExplanation =
    asText(payload.explanation) || "Explanation pending editorial review.";
  const explanationIllustrationSvg = asText(payload.explanationIllustrationSvg);
  const explanationIllustration = explanationIllustrationSvg
    ? encodeGeneratedSpatialSvgImage(
        explanationIllustrationSvg,
        "Figure formation assembly explanation",
      )
    : "";
  const explanation = [baseExplanation, explanationIllustration]
    .filter(Boolean)
    .join("\n\n");
  const difficulty =
    asText(payload.difficultyLabel) || asText(payload.difficulty) || "Medium";
  const visualContent = spatialVisualContent(payload);
  const options = visualContent?.optionImages
    ? visualContent.optionImages
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
        qlId: payload.qlId ?? generationContext.qlId ?? null,
        sourceChapterId: payload.sourceChapterId ?? generationContext.sourceChapterId ?? null,
        solveMode: payload.solveMode ?? generationContext.solveMode ?? null,
        semanticClass: payload.canonicalAnswer ?? generationContext.semanticClass ?? null,
        answerProfile: payload.answerProfile ?? generationContext.answerProfile ?? null,
        examFamily: payload.examFamily ?? generationContext.examFamily ?? null,
        topic: payload.topic ?? null,
        subtopic: payload.subtopic ?? null,
        language: payload.language ?? "en",
        locale: payload.locale ?? generationContext.locale ?? null,
        visualContent: visualContent?.kind ?? null,
        explanationVisualContent: explanationIllustrationSvg ? "spatial_svg_data_image_v1" : null,
        questionBankStatus: lifecycleValue(payload, generationContext, "questionBankStatus") ?? null,
        questionBankWritable: lifecycleValue(payload, generationContext, "questionBankWritable") ?? null,
        questionBankAcceptanceMode: getGeneratedQuestionBankAcceptanceMode(payload),
        questionBankAcceptanceAuthority:
          lifecycleValue(payload, generationContext, "questionBankAcceptanceAuthority") ?? null,
        testEligibility: lifecycleValue(payload, generationContext, "testEligibility") ?? null,
        testEligible: lifecycleValue(payload, generationContext, "testEligible") ?? null,
        mockTestEligible: lifecycleValue(payload, generationContext, "mockTestEligible") ?? null,
        publiclyPublishable: lifecycleValue(payload, generationContext, "publiclyPublishable") ?? null,
        automaticStudentPublication:
          lifecycleValue(payload, generationContext, "automaticStudentPublication") ?? null,
        integrationAuthority: payload.integrationAuthority ?? generationContext.integrationAuthority ?? null,
        deliveryProfileAuthority:
          payload.deliveryProfileAuthority ?? generationContext.deliveryProfileAuthority ?? null,
        sourceFreezeAuthority: payload.sourceFreezeAuthority ?? generationContext.sourceFreezeAuthority ?? null,
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

  const acceptanceMode = getGeneratedQuestionBankAcceptanceMode(row.payload);
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
      ${acceptanceMode === "BANK_ONLY"
        ? "Accepted into Question Bank with downstream lifecycle locked"
        : "Approved from generated question review"},
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
      ${acceptanceMode === "BANK_ONLY"
        ? "Approved generated item accepted to Question Bank; tests and publication remain locked"
        : "Approved generated item converted to Question Bank"},
      ${`Created ${publicCode} from approved generation item`},
      ${JSON.stringify({
        generationItemId: itemId,
        generationRunCode: row.generationRunCode,
        questionBankAcceptanceMode: acceptanceMode,
        downstreamLifecycleLocked: acceptanceMode === "BANK_ONLY",
      })}::jsonb
    )
  `;

  return { itemId, questionId, questionVersionId, publicCode };
}
