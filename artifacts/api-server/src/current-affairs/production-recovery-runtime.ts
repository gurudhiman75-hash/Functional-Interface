import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { runSourceIndependentAuthoring } from "./authoring-runtime";
import {
  generateCurrentAffairsQuestions,
  renderCompilationMarkdown,
  type CurrentAffairsContentEvent,
  type CurrentAffairsFact,
  type CurrentAffairsGeneratedQuestion,
} from "./content";
import { rebuildHistoricalHeadlineClaims } from "./historical-claim-rebuild";
import { createLocalizedDailyCompilations, runCurrentAffairsLocalization } from "./localization-runtime";
import { previousIndiaDate } from "./orchestration-policy";
import { runCurrentAffairsQuestionLocalization } from "./question-localization-runtime";

const FAMILIES = ["ssc", "banking", "punjab"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

function slotKey(now: Date): string {
  const date = new Date(now);
  date.setUTCMinutes(0, 0, 0);
  date.setUTCHours(Math.floor(date.getUTCHours() / 3) * 3);
  return date.toISOString();
}

function normalizeFacts(value: unknown): CurrentAffairsFact[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => item as Record<string, unknown>).map((item) => ({
    id: item.id ? String(item.id) : undefined,
    key: String(item.key ?? ""),
    value: String(item.value ?? ""),
    type: item.type ? String(item.type) : undefined,
    confidence: Number(item.confidence ?? 0),
  })).filter((item) => item.key && item.value);
}

async function loadEvents(date: string, family: string, startDate = date): Promise<CurrentAffairsContentEvent[]> {
  const rows = await sqlClient`
    SELECT event.id::text AS id, event.public_code AS "publicCode",
           event.canonical_title AS title, event.summary,
           event.importance_reason AS "importanceReason", event.event_date AS "eventDate",
           event.category, score.relevance_score::int AS "examScore",
           COALESCE((
             SELECT json_agg(json_build_object(
               'id', fact.id::text, 'key', fact.fact_key, 'value', fact.fact_value,
               'type', fact.fact_type, 'confidence', fact.confidence::float8
             ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
             FROM content.current_affairs_facts fact
             WHERE fact.event_id=event.id AND fact.is_verified=true
           ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_exam_scores score
      ON score.event_id=event.id AND score.exam_family_key=${family}
    WHERE event.status='verified'
      AND event.event_date BETWEEN ${startDate}::date AND ${date}::date
      AND score.include_recommended=true
      AND event.learner_authoring_status IN ('ready','manual')
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY score.relevance_score DESC, event.event_date DESC, event.canonical_title
    LIMIT 1500
  `;
  return rows.map((row) => ({
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
  }));
}

function compilationCode(date: string, family: string): string {
  return `CA-D-${date.replaceAll("-", "")}-${family.toUpperCase()}`;
}

async function createQuestionRun(compilationId: string, date: string, family: string, events: CurrentAffairsContentEvent[]) {
  const lookback = new Date(`${date}T00:00:00Z`);
  lookback.setUTCDate(lookback.getUTCDate() - 180);
  const pool = await loadEvents(date, family, lookback.toISOString().slice(0, 10));
  const generated = generateCurrentAffairsQuestions(events, pool, 30);
  if (generated.length < 5) return 0;
  const runId = randomUUID();
  const code = `GEN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  const snapshot = {
    source: "current_affairs_studio_cp025_recovery",
    compilationId,
    date,
    examFamily: family,
    generatedCount: generated.length,
    questionBankAcceptanceMode: "BANK_ONLY",
    automaticStudentPublication: false,
  };
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
        provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
        actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
        ${JSON.stringify(snapshot)}::jsonb, ${JSON.stringify(snapshot)}::jsonb,
        'examtree', 'current-affairs-cp025-recovery', 0, 0, 0, 0,
        now(), now(), now(), now()
      )
    `;
    for (let index = 0; index < generated.length; index += 1) {
      const question = generated[index] as CurrentAffairsGeneratedQuestion;
      const itemId = randomUUID();
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1, now(), now())
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${randomUUID()}::uuid, ${itemId}::uuid, 1,
          ${JSON.stringify({ ...question.payload, validationResult: "pending_editorial_review" })}::jsonb,
          ${`${question.eventPublicCode}:${question.family}:RECOVERY:${index + 1}`}, now()
        )
      `;
      await tx`
        INSERT INTO content.current_affairs_question_links (
          event_id, fact_id, generation_run_id, generation_item_id, question_family, fact_key, created_at
        ) VALUES (
          ${question.eventId}::uuid,
          ${question.factId && UUID_PATTERN.test(question.factId) ? question.factId : null}::uuid,
          ${runId}::uuid, ${itemId}::uuid, ${question.family}, ${question.factKey}, now()
        )
      `;
    }
    await tx`UPDATE content.current_affairs_compilations SET question_run_id=${runId}::uuid, updated_at=now() WHERE id=${compilationId}::uuid`;
  });
  return generated.length;
}

async function backfillEnglishCompilation(date: string, family: string) {
  const code = compilationCode(date, family);
  const existing = await sqlClient`SELECT id::text AS id FROM content.current_affairs_compilations WHERE public_code=${code} LIMIT 1`;
  if (existing[0]) return { created: false, questionCount: 0, reason: "already_exists" };
  const events = await loadEvents(date, family);
  if (events.length === 0) return { created: false, questionCount: 0, reason: "no_eligible_events" };

  const periodLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
  const title = `Daily Current Affairs — ${periodLabel} — ${family.toUpperCase()}`;
  const markdown = renderCompilationMarkdown({ title, periodLabel, examFamily: family, events });
  const resourceId = randomUUID();
  const compilationId = randomUUID();
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.learning_resources (
        id, public_code, category, format, title, summary, language_code,
        content_date, body_markdown, content_url, status, created_at, updated_at
      ) VALUES (
        ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title},
        ${`${events.length} verified Current Affairs events recovered for editorial review.`},
        'en', ${date}, ${markdown}, null, 'draft', now(), now()
      )
    `;
    await tx`
      INSERT INTO content.current_affairs_compilations (
        id, public_code, period_type, period_start, period_end, exam_family_key,
        language_code, status, event_count, learning_resource_id, created_at, updated_at
      ) VALUES (${compilationId}::uuid, ${code}, 'daily', ${date}, ${date}, ${family}, 'en', 'draft', ${events.length}, ${resourceId}::uuid, now(), now())
    `;
    for (let index = 0; index < events.length; index += 1) {
      const event = events[index]!;
      await tx`
        INSERT INTO content.current_affairs_compilation_events (
          compilation_id, event_id, sort_order, relevance_score, created_at
        ) VALUES (${compilationId}::uuid, ${event.id}::uuid, ${index + 1}, ${Number(event.examScore ?? 0)}, now())
      `;
    }
  });
  const questionCount = await createQuestionRun(compilationId, date, family, events);
  return { created: true, questionCount, reason: "recovered" };
}

export async function runCurrentAffairsProductionRecovery(args: {
  now?: Date;
  triggerMode?: "scheduled" | "manual";
} = {}) {
  const now = args.now ?? new Date();
  const triggerMode = args.triggerMode ?? "scheduled";
  const targetDate = previousIndiaDate(now);
  const runKey = `production_recovery:${triggerMode}:${targetDate}:${slotKey(now)}`;
  const runId = randomUUID();
  const inserted = await sqlClient`
    INSERT INTO content.current_affairs_ops_runs (
      id, run_key, target_date, trigger_mode, status, started_at, created_at, updated_at
    ) VALUES (${runId}::uuid, ${runKey}, ${targetDate}, ${triggerMode}, 'running', now(), now(), now())
    ON CONFLICT (run_key) DO NOTHING RETURNING id
  `;
  if (!inserted[0]) return { skipped: true, runKey, targetDate, reason: "recovery slot already processed" };

  const actions: Array<Record<string, unknown>> = [];
  try {
    const historicalClaimRebuild = await rebuildHistoricalHeadlineClaims(targetDate, 600);
    actions.push({ action: "historical_headline_claim_rebuild", result: historicalClaimRebuild });

    const authoring = await runSourceIndependentAuthoring(200);
    actions.push({ action: "authoring_backfill", result: authoring });
    const localization = await runCurrentAffairsLocalization(200);
    actions.push({ action: "localization_backfill", result: localization });

    let englishBackfillCount = 0;
    let recoveredQuestionCount = 0;
    for (const family of FAMILIES) {
      const result = await backfillEnglishCompilation(targetDate, family);
      if (result.created) englishBackfillCount += 1;
      recoveredQuestionCount += result.questionCount;
      actions.push({ action: "english_daily_backfill", family, ...result });
    }

    const localized = await createLocalizedDailyCompilations(targetDate, FAMILIES);
    const localizedBackfillCount = Array.isArray((localized as any)?.results)
      ? (localized as any).results.filter((item: Record<string, unknown>) => Boolean(item.created)).length
      : Number((localized as any)?.created ?? 0);
    actions.push({ action: "localized_daily_backfill", result: localized });

    const questionLocalization = await runCurrentAffairsQuestionLocalization(1000);
    const questionLocalizationCount = Number((questionLocalization as any)?.ready ?? 0) + Number((questionLocalization as any)?.needsEditorial ?? 0);
    actions.push({ action: "question_localization_backfill", result: questionLocalization });

    await sqlClient`
      UPDATE content.current_affairs_ops_runs
      SET status='completed', completed_at=now(),
          english_backfill_count=${englishBackfillCount},
          localized_backfill_count=${localizedBackfillCount},
          question_localization_count=${questionLocalizationCount},
          actions=${JSON.stringify(actions)}::jsonb, updated_at=now()
      WHERE id=${runId}::uuid
    `;
    return {
      skipped: false,
      runId,
      runKey,
      targetDate,
      historicalClaimRebuild,
      englishBackfillCount,
      localizedBackfillCount,
      recoveredQuestionCount,
      questionLocalizationCount,
      actions,
      publicationAuthority: false,
    };
  } catch (error) {
    const failure = error instanceof Error ? error.message.slice(0, 4000) : "Unknown production recovery failure";
    await sqlClient`
      UPDATE content.current_affairs_ops_runs
      SET status='failed', completed_at=now(), actions=${JSON.stringify(actions)}::jsonb,
          failure=${failure}, updated_at=now()
      WHERE id=${runId}::uuid
    `;
    throw error;
  }
}
