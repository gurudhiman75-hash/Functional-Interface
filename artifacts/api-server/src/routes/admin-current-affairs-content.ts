import { randomUUID } from "node:crypto";
import { Router, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  generateCurrentAffairsQuestions,
  renderCompilationMarkdown,
  type CurrentAffairsContentEvent,
  type CurrentAffairsFact,
  type CurrentAffairsGeneratedQuestion,
} from "../current-affairs/content";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const examFamilies = new Set(["ssc", "banking", "punjab", "railways", "general"]);
const periodTypes = new Set(["daily", "weekly", "monthly"]);
const languages = new Set(["en", "hi", "pa"]);

class CurrentAffairsContentError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode = 400,
  ) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) {
    throw new CurrentAffairsContentError("INVALID_ID", `${label} is invalid.`);
  }
  return id;
}

function dateOnly(value: unknown, label: string): string {
  const raw = text(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new CurrentAffairsContentError("INVALID_DATE", `${label} must use YYYY-MM-DD.`);
  }
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== raw) {
    throw new CurrentAffairsContentError("INVALID_DATE", `${label} is invalid.`);
  }
  return raw;
}

function examFamily(value: unknown): string {
  const family = text(value, 30).toLowerCase() || "general";
  if (!examFamilies.has(family)) {
    throw new CurrentAffairsContentError("INVALID_EXAM_FAMILY", "Choose SSC, Banking, Punjab, Railways or General.");
  }
  return family;
}

function language(value: unknown): string {
  const code = text(value, 8).toLowerCase() || "en";
  if (!languages.has(code)) {
    throw new CurrentAffairsContentError("INVALID_LANGUAGE", "Choose en, hi or pa.");
  }
  if (code !== "en") {
    throw new CurrentAffairsContentError(
      "LOCALIZATION_NOT_READY",
      "CP004 compilation generation is English-first. Hindi and Punjabi require the localization parity checkpoint.",
      409,
    );
  }
  return code;
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.floor((end - start) / 86_400_000) + 1;
}

function validatePeriod(periodType: string, startDate: string, endDate: string) {
  if (endDate < startDate) {
    throw new CurrentAffairsContentError("INVALID_PERIOD", "Period end cannot be before period start.");
  }
  const days = daysBetween(startDate, endDate);
  if (periodType === "daily" && days !== 1) {
    throw new CurrentAffairsContentError("INVALID_DAILY_PERIOD", "A daily compilation must cover exactly one date.");
  }
  if (periodType === "weekly" && days > 7) {
    throw new CurrentAffairsContentError("INVALID_WEEKLY_PERIOD", "A weekly compilation can cover at most seven days.");
  }
  if (periodType === "monthly" && days > 31) {
    throw new CurrentAffairsContentError("INVALID_MONTHLY_PERIOD", "A monthly compilation can cover at most 31 days.");
  }
}

function displayDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function compilationCode(periodType: string, startDate: string, endDate: string, family: string): string {
  const prefix = periodType === "daily" ? "D" : periodType === "weekly" ? "W" : "M";
  const endToken = endDate.replaceAll("-", "");
  const startToken = startDate.replaceAll("-", "");
  const suffix = periodType === "daily"
    ? family.toUpperCase()
    : `${startToken}_${family.toUpperCase()}`;
  return `CA-${prefix}-${endToken}-${suffix}`;
}

function generationRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CurrentAffairsContentError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const code = error && typeof error === "object" && "code" in error ? String((error as any).code) : "";
  if (code === "23505") {
    res.status(409).json({ error: "A matching Current Affairs artifact already exists.", code: "CURRENT_AFFAIRS_DUPLICATE" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_CONTENT_FAILED" });
}

function normalizeFacts(value: unknown): CurrentAffairsFact[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {})
    .map((item) => ({
      id: item.id ? String(item.id) : undefined,
      key: String(item.key ?? "").trim(),
      value: String(item.value ?? "").trim(),
      type: item.type ? String(item.type) : undefined,
      confidence: Number(item.confidence ?? 0),
    }))
    .filter((item) => item.key && item.value);
}

function normalizeEventRow(row: Record<string, unknown>, family: string): CurrentAffairsContentEvent {
  return {
    id: String(row.id),
    publicCode: String(row.publicCode),
    title: String(row.title),
    summary: String(row.summary ?? ""),
    importanceReason: String(row.importanceReason ?? ""),
    eventDate: String(row.eventDate).slice(0, 10),
    category: String(row.category),
    examFamily: family,
    examScore: Number(row.examScore ?? 0),
    facts: normalizeFacts(row.facts),
  };
}

async function loadVerifiedEvents(args: {
  startDate: string;
  endDate: string;
  family: string;
  maxEvents: number;
  eventIds?: string[];
}): Promise<CurrentAffairsContentEvent[]> {
  const ids = args.eventIds ?? [];
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.summary,
      event.importance_reason AS "importanceReason",
      event.event_date AS "eventDate",
      event.category,
      score.relevance_score::int AS "examScore",
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', fact.id::text,
          'key', fact.fact_key,
          'value', fact.fact_value,
          'type', fact.fact_type,
          'confidence', fact.confidence::float8
        ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id = event.id
          AND fact.is_verified = true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_exam_scores score
      ON score.event_id = event.id
     AND score.exam_family_key = ${args.family}
    WHERE event.status = 'verified'
      AND event.event_date BETWEEN ${args.startDate}::date AND ${args.endDate}::date
      AND score.include_recommended = true
      AND (${ids.length}::int = 0 OR event.id = ANY(${ids}::uuid[]))
      AND NOT EXISTS (
        SELECT 1
        FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id = event.id
          AND conflict.status = 'open'
      )
    ORDER BY score.relevance_score DESC, event.event_date DESC, event.canonical_title
    LIMIT ${args.maxEvents}
  `;
  return rows.map((row) => normalizeEventRow(row as Record<string, unknown>, args.family));
}

async function loadDistractorPool(startDate: string, endDate: string, family: string) {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.summary,
      event.importance_reason AS "importanceReason",
      event.event_date AS "eventDate",
      event.category,
      score.relevance_score::int AS "examScore",
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', fact.id::text,
          'key', fact.fact_key,
          'value', fact.fact_value,
          'type', fact.fact_type,
          'confidence', fact.confidence::float8
        ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id = event.id
          AND fact.is_verified = true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_exam_scores score
      ON score.event_id = event.id
     AND score.exam_family_key = ${family}
    WHERE event.status = 'verified'
      AND event.event_date >= ${startDate}::date - INTERVAL '180 days'
      AND event.event_date <= ${endDate}::date + INTERVAL '7 days'
      AND score.include_recommended = true
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id = event.id AND conflict.status = 'open'
      )
    ORDER BY event.event_date DESC, score.relevance_score DESC
    LIMIT 1500
  `;
  return rows.map((row) => normalizeEventRow(row as Record<string, unknown>, family));
}

async function createQuestionRun(args: {
  actorUserId: string;
  family: string;
  startDate: string;
  endDate: string;
  targetEvents: CurrentAffairsContentEvent[];
  count: number;
  compilationId?: string;
}) {
  const pool = await loadDistractorPool(args.startDate, args.endDate, args.family);
  const generated = generateCurrentAffairsQuestions(args.targetEvents, pool, args.count);
  if (generated.length === 0) {
    throw new CurrentAffairsContentError(
      "NO_SAFE_MCQ_SET",
      "No safe four-option Current Affairs questions could be generated from the verified fact pool. More verified events/facts are needed for grounded distractors.",
      422,
    );
  }

  const runId = randomUUID();
  const publicCode = generationRunCode();
  const timestamp = new Date().toISOString();
  const requestSnapshot = {
    source: "current_affairs_studio_cp004",
    examFamily: args.family,
    startDate: args.startDate,
    endDate: args.endDate,
    requestedCount: args.count,
    generatedCount: generated.length,
    compilationId: args.compilationId ?? null,
    questionBankAcceptanceMode: "BANK_ONLY",
  };

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot,
        request_snapshot, provider, model, prompt_tokens,
        completion_tokens, estimated_cost_paise, actual_cost_paise,
        started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}::jsonb, ${JSON.stringify(requestSnapshot)}::jsonb,
        'examtree', 'current-affairs-cp004-deterministic', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < generated.length; index += 1) {
      const generatedQuestion = generated[index] as CurrentAffairsGeneratedQuestion;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = {
        ...generatedQuestion.payload,
        validationResult: "pending_editorial_review",
      };

      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status,
          current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1},
          'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
        )
      `;

      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1,
          ${JSON.stringify(payload)}::jsonb, ${`${generatedQuestion.eventPublicCode}:${generatedQuestion.family}:${index + 1}`},
          ${timestamp}
        )
      `;

      await tx`
        INSERT INTO content.current_affairs_question_links (
          event_id, fact_id, generation_run_id, generation_item_id,
          question_family, fact_key, created_at
        ) VALUES (
          ${generatedQuestion.eventId}::uuid,
          ${generatedQuestion.factId && uuidPattern.test(generatedQuestion.factId) ? generatedQuestion.factId : null}::uuid,
          ${runId}::uuid,
          ${itemId}::uuid,
          ${generatedQuestion.family},
          ${generatedQuestion.factKey},
          now()
        )
      `;
    }

    if (args.compilationId) {
      await tx`
        UPDATE content.current_affairs_compilations
        SET question_run_id = ${runId}::uuid,
            updated_by = ${args.actorUserId}::uuid,
            updated_at = now()
        WHERE id = ${args.compilationId}::uuid
      `;
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type,
        entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.question_run.created', 'generation_run', ${runId}::uuid,
        'Generated from verified Current Affairs facts with grounded distractors',
        ${`Generated ${generated.length} Current Affairs questions in ${publicCode}`},
        ${JSON.stringify(requestSnapshot)}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'current_affairs.question_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: generated.length, compilationId: args.compilationId ?? null })}::jsonb
      )
    `;
  });

  return { runId, publicCode, itemCount: generated.length, generated };
}

router.use(authenticate);

router.get("/content/capabilities", requireAdminPermission("content.questions.read"), (_req, res) => {
  res.json({
    version: "ca-cp004",
    outputs: ["event_study_note", "daily_compilation", "weekly_compilation", "monthly_compilation", "question_studio_run"],
    questionFamilies: [
      { id: "CA-QL-001", name: "Verified fact recall", difficulty: "Easy" },
      { id: "CA-QL-002", name: "Event association", difficulty: "Medium" },
    ],
    questionLifecycle: {
      generationStatus: "review",
      initialItemStatus: "unreviewed",
      questionBankAcceptanceMode: "BANK_ONLY",
      automaticStudentPublication: false,
    },
    languages: ["en"],
    compilationTypes: ["daily", "weekly", "monthly"],
  });
});

router.get("/content/dashboard", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const [compilations, questionRuns, eligibleEvents] = await Promise.all([
      sqlClient`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE period_type='daily')::int AS daily,
          COUNT(*) FILTER (WHERE period_type='weekly')::int AS weekly,
          COUNT(*) FILTER (WHERE period_type='monthly')::int AS monthly,
          COUNT(*) FILTER (WHERE question_run_id IS NOT NULL)::int AS "withQuiz"
        FROM content.current_affairs_compilations
      `,
      sqlClient`
        SELECT
          COUNT(DISTINCT link.generation_run_id)::int AS runs,
          COUNT(*)::int AS items,
          COUNT(*) FILTER (WHERE item.status='unreviewed')::int AS "pendingReview",
          COUNT(*) FILTER (WHERE item.status='approved')::int AS approved
        FROM content.current_affairs_question_links link
        JOIN content.generation_run_items item ON item.id=link.generation_item_id
      `,
      sqlClient`
        SELECT COUNT(*)::int AS count
        FROM content.current_affairs_events event
        WHERE event.status='verified'
          AND NOT EXISTS (
            SELECT 1 FROM content.current_affairs_fact_conflicts conflict
            WHERE conflict.event_id=event.id AND conflict.status='open'
          )
      `,
    ]);
    res.json({
      compilations: compilations[0] ?? { total: 0, daily: 0, weekly: 0, monthly: 0, withQuiz: 0 },
      questionStudio: questionRuns[0] ?? { runs: 0, items: 0, pendingReview: 0, approved: 0 },
      eligibleVerifiedEvents: Number(eligibleEvents[0]?.count ?? 0),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs content dashboard");
  }
});

router.get("/compilations", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const family = text(req.query.examFamily, 30).toLowerCase();
    const rows = await sqlClient`
      SELECT
        compilation.id::text AS id,
        compilation.public_code AS "publicCode",
        compilation.period_type AS "periodType",
        compilation.period_start AS "periodStart",
        compilation.period_end AS "periodEnd",
        compilation.exam_family_key AS "examFamily",
        compilation.language_code AS language,
        compilation.status,
        compilation.event_count AS "eventCount",
        compilation.learning_resource_id::text AS "learningResourceId",
        compilation.question_run_id::text AS "questionRunId",
        compilation.created_at AS "createdAt"
      FROM content.current_affairs_compilations compilation
      WHERE (${family}='' OR compilation.exam_family_key=${family})
      ORDER BY compilation.period_end DESC, compilation.created_at DESC
      LIMIT 300
    `;
    res.json({ compilations: rows });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs compilations");
  }
});

router.post("/compilations", requireAdminPermission("content.questions.publish"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CurrentAffairsContentError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const periodType = text(req.body?.periodType, 20).toLowerCase();
    if (!periodTypes.has(periodType)) {
      throw new CurrentAffairsContentError("INVALID_PERIOD_TYPE", "Choose daily, weekly or monthly.");
    }
    const startDate = dateOnly(req.body?.startDate, "Start date");
    const endDate = dateOnly(req.body?.endDate ?? req.body?.startDate, "End date");
    validatePeriod(periodType, startDate, endDate);
    const family = examFamily(req.body?.examFamily);
    const languageCode = language(req.body?.language);
    const maxEvents = positiveInteger(req.body?.maxEvents, periodType === "daily" ? 40 : periodType === "weekly" ? 120 : 300, 500);
    const events = await loadVerifiedEvents({ startDate, endDate, family, maxEvents });
    if (events.length === 0) {
      throw new CurrentAffairsContentError("NO_ELIGIBLE_EVENTS", "No verified, conflict-free, exam-relevant events exist for this period.", 422);
    }

    const code = compilationCode(periodType, startDate, endDate, family);
    const typeLabel = periodType.charAt(0).toUpperCase() + periodType.slice(1);
    const periodLabel = startDate === endDate
      ? displayDate(startDate)
      : `${displayDate(startDate)} – ${displayDate(endDate)}`;
    const title = `${typeLabel} Current Affairs — ${periodLabel}${family === "general" ? "" : ` — ${family.toUpperCase()}`}`;
    const markdown = renderCompilationMarkdown({ title, periodLabel, examFamily: family, events });
    const summary = `${events.length} verified Current Affairs events selected for ${family.toUpperCase()} exam preparation. Conflicted facts and unverified events are excluded.`;
    const compilationId = randomUUID();
    const resourceId = randomUUID();

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.learning_resources (
          id, public_code, category, format, title, summary, language_code,
          content_date, body_markdown, content_url, status,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
          ${languageCode}, ${endDate}, ${markdown}, null, 'draft',
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      await tx`
        INSERT INTO content.current_affairs_compilations (
          id, public_code, period_type, period_start, period_end,
          exam_family_key, language_code, status, event_count,
          learning_resource_id, created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${compilationId}::uuid, ${code}, ${periodType}, ${startDate}, ${endDate},
          ${family}, ${languageCode}, 'draft', ${events.length}, ${resourceId}::uuid,
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      for (let index = 0; index < events.length; index += 1) {
        const event = events[index]!;
        await tx`
          INSERT INTO content.current_affairs_compilation_events (
            compilation_id, event_id, sort_order, relevance_score, created_at
          ) VALUES (
            ${compilationId}::uuid, ${event.id}::uuid, ${index + 1}, ${Number(event.examScore ?? 0)}, now()
          )
        `;
      }
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'current_affairs.compilation.created', 'learning_resource', ${resourceId}::uuid,
          'Compiled only verified, conflict-free Current Affairs events',
          ${`Created ${code} with ${events.length} events`},
          ${JSON.stringify({ compilationId, periodType, startDate, endDate, family, eventCount: events.length })}::jsonb
        )
      `;
    });

    res.status(201).json({
      compilation: {
        id: compilationId,
        publicCode: code,
        periodType,
        startDate,
        endDate,
        examFamily: family,
        eventCount: events.length,
        status: "draft",
        learningResourceId: resourceId,
      },
    });
  } catch (error) {
    sendError(res, error, "Unable to create Current Affairs compilation");
  }
});

router.post("/content/question-runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CurrentAffairsContentError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const startDate = dateOnly(req.body?.startDate, "Start date");
    const endDate = dateOnly(req.body?.endDate ?? req.body?.startDate, "End date");
    if (endDate < startDate) throw new CurrentAffairsContentError("INVALID_PERIOD", "End date cannot be before start date.");
    if (daysBetween(startDate, endDate) > 31) {
      throw new CurrentAffairsContentError("QUESTION_RANGE_TOO_WIDE", "Generate Current Affairs question runs from at most 31 days at a time.");
    }
    const family = examFamily(req.body?.examFamily);
    const count = positiveInteger(req.body?.count, 20, 100);
    const targetEvents = await loadVerifiedEvents({ startDate, endDate, family, maxEvents: 500 });
    if (targetEvents.length === 0) {
      throw new CurrentAffairsContentError("NO_ELIGIBLE_EVENTS", "No verified, conflict-free events are available for question generation.", 422);
    }
    const created = await createQuestionRun({ actorUserId, family, startDate, endDate, targetEvents, count });
    res.status(201).json({
      id: created.runId,
      publicCode: created.publicCode,
      status: "review",
      itemCount: created.itemCount,
      questionBankAcceptanceMode: "BANK_ONLY",
      generationSystem: "current-affairs-cp004",
    });
  } catch (error) {
    sendError(res, error, "Unable to generate Current Affairs question run");
  }
});

router.post("/compilations/:id/question-run", requireAdminPermission("content.generation.run"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CurrentAffairsContentError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
    const compilationId = uuid(req.params.id, "Compilation ID");
    const rows = await sqlClient`
      SELECT period_start AS "startDate", period_end AS "endDate",
             exam_family_key AS "examFamily", question_run_id::text AS "questionRunId"
      FROM content.current_affairs_compilations WHERE id=${compilationId}::uuid LIMIT 1
    `;
    const compilation = rows[0] as Record<string, unknown> | undefined;
    if (!compilation) throw new CurrentAffairsContentError("COMPILATION_NOT_FOUND", "Current Affairs compilation not found.", 404);
    if (compilation.questionRunId) {
      throw new CurrentAffairsContentError("COMPILATION_QUIZ_EXISTS", "This compilation already has a linked Question Studio run.", 409);
    }
    const memberRows = await sqlClient`
      SELECT event_id::text AS id
      FROM content.current_affairs_compilation_events
      WHERE compilation_id=${compilationId}::uuid ORDER BY sort_order
    `;
    const eventIds = memberRows.map((row) => String(row.id));
    const startDate = String(compilation.startDate).slice(0, 10);
    const endDate = String(compilation.endDate).slice(0, 10);
    const family = String(compilation.examFamily);
    const count = positiveInteger(req.body?.count, Math.min(50, Math.max(10, eventIds.length)), 100);
    const targetEvents = await loadVerifiedEvents({ startDate, endDate, family, maxEvents: 500, eventIds });
    if (targetEvents.length === 0) {
      throw new CurrentAffairsContentError("NO_ELIGIBLE_EVENTS", "Compilation events are no longer eligible for question generation.", 422);
    }
    const created = await createQuestionRun({
      actorUserId,
      family,
      startDate,
      endDate,
      targetEvents,
      count,
      compilationId,
    });
    res.status(201).json({
      compilationId,
      id: created.runId,
      publicCode: created.publicCode,
      status: "review",
      itemCount: created.itemCount,
      questionBankAcceptanceMode: "BANK_ONLY",
    });
  } catch (error) {
    sendError(res, error, "Unable to generate compilation Current Affairs quiz");
  }
});

export default router;
