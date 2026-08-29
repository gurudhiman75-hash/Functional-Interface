import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  generateCurrentAffairsQuestions,
  renderCompilationMarkdown,
  type CurrentAffairsContentEvent,
  type CurrentAffairsFact,
  type CurrentAffairsGeneratedQuestion,
} from "./content";
import type { CurrentAffairsLocalizationLanguage } from "./multilingual-localization";
import {
  completedRollupPeriods,
  type CurrentAffairsRollupPeriod,
} from "./periodic-rollup-policy";

const ROLLUP_EXAM_FAMILIES = ["ssc", "banking", "punjab"] as const;
const ROLLUP_LANGUAGES = ["hi", "pa"] as const;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type LocalizedRollupEvent = {
  id: string;
  title: string;
  summary: string;
  oneLiner: string;
  category: string;
  examScore: number;
  facts: CurrentAffairsFact[];
};

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

function contentEvent(row: Record<string, unknown>, family: string): CurrentAffairsContentEvent {
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

function rollupScoreFloor(period: CurrentAffairsRollupPeriod): number {
  return period.type === "weekly" ? 70 : 75;
}

function rollupEventLimit(period: CurrentAffairsRollupPeriod): number {
  return period.type === "weekly" ? 120 : 350;
}

function rollupQuestionLimit(period: CurrentAffairsRollupPeriod): number {
  return period.type === "weekly" ? 50 : 150;
}

async function loadEnglishRollupEvents(
  period: CurrentAffairsRollupPeriod,
  family: string,
  scoreFloor = rollupScoreFloor(period),
): Promise<CurrentAffairsContentEvent[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      authoring.learner_title AS title,
      authoring.learner_summary AS summary,
      event.importance_reason AS "importanceReason",
      event.event_date::text AS "eventDate",
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
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_authoring_versions authoring
      ON authoring.id=event.learner_authoring_version_id
      AND authoring.status IN ('ready', 'manual')
    JOIN content.current_affairs_exam_scores score
      ON score.event_id=event.id AND score.exam_family_key=${family}
    WHERE event.status='verified'
      AND event.learner_authoring_status IN ('ready', 'manual')
      AND event.event_date BETWEEN ${period.start}::date AND ${period.end}::date
      AND score.include_recommended=true
      AND score.relevance_score >= ${scoreFloor}
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY score.relevance_score DESC, event.event_date DESC, authoring.learner_title
    LIMIT ${rollupEventLimit(period)}
  `;
  return rows.map((row) => contentEvent(row as Record<string, unknown>, family));
}

async function loadQuestionDistractorPool(periodEnd: string, family: string) {
  const end = new Date(`${periodEnd}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 180);
  const syntheticPeriod: CurrentAffairsRollupPeriod = {
    type: "monthly",
    start: start.toISOString().slice(0, 10),
    end: periodEnd,
  };
  return loadEnglishRollupEvents(syntheticPeriod, family, 65);
}

function periodToken(period: CurrentAffairsRollupPeriod): "W" | "M" {
  return period.type === "weekly" ? "W" : "M";
}

function compilationCode(
  period: CurrentAffairsRollupPeriod,
  family: string,
  languageCode = "en",
) {
  const suffix = languageCode === "en" ? "" : `_${languageCode.toUpperCase()}`;
  return `CA-${periodToken(period)}-${period.end.replaceAll("-", "")}-${family.toUpperCase()}${suffix}`;
}

function periodLabel(period: CurrentAffairsRollupPeriod): string {
  const format = (value: string) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
  return period.type === "weekly"
    ? `${format(period.start)} – ${format(period.end)}`
    : new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${period.end}T00:00:00Z`));
}

function generationRunCode() {
  return `GEN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

async function createRollupQuestionRun(args: {
  compilationId: string;
  period: CurrentAffairsRollupPeriod;
  family: string;
  events: CurrentAffairsContentEvent[];
}) {
  const pool = await loadQuestionDistractorPool(args.period.end, args.family);
  const generated = generateCurrentAffairsQuestions(args.events, pool, rollupQuestionLimit(args.period));
  if (generated.length < 5) return 0;

  const runId = randomUUID();
  const timestamp = new Date().toISOString();
  const snapshot = {
    source: "current_affairs_studio_cp012_periodic_rollup",
    compilationId: args.compilationId,
    periodType: args.period.type,
    periodStart: args.period.start,
    periodEnd: args.period.end,
    examFamily: args.family,
    generatedCount: generated.length,
    questionBankAcceptanceMode: "BANK_ONLY",
    automaticStudentPublication: false,
  };
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot,
        request_snapshot, provider, model, prompt_tokens, completion_tokens,
        estimated_cost_paise, actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${generationRunCode()}, 'review'::generation_run_status, 1,
        ${JSON.stringify(snapshot)}::jsonb, ${JSON.stringify(snapshot)}::jsonb,
        'examtree', ${`current-affairs-cp012-${args.period.type}-rollup`}, 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;
    for (let i = 0; i < generated.length; i += 1) {
      const question = generated[i] as CurrentAffairsGeneratedQuestion;
      const itemId = randomUUID();
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${i + 1},
          'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${randomUUID()}::uuid, ${itemId}::uuid, 1,
          ${JSON.stringify({ ...question.payload, validationResult: "pending_editorial_review" })}::jsonb,
          ${`${question.eventPublicCode}:${question.family}:${args.period.type.toUpperCase()}:${i + 1}`}, ${timestamp}
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
    await tx`
      UPDATE content.current_affairs_compilations
      SET question_run_id=${runId}::uuid, updated_at=now()
      WHERE id=${args.compilationId}::uuid
    `;
  });
  return generated.length;
}

async function existingCompilation(
  period: CurrentAffairsRollupPeriod,
  family: string,
  languageCode: string,
) {
  const rows = await sqlClient`
    SELECT id::text AS id
    FROM content.current_affairs_compilations
    WHERE period_type=${period.type}
      AND period_start=${period.start}::date
      AND period_end=${period.end}::date
      AND exam_family_key=${family}
      AND language_code=${languageCode}
    LIMIT 1
  `;
  return rows[0]?.id ? String(rows[0].id) : null;
}

async function createEnglishRollup(period: CurrentAffairsRollupPeriod, family: string) {
  if (await existingCompilation(period, family, "en")) {
    return { created: false, eventCount: 0, questionCount: 0 };
  }
  const events = await loadEnglishRollupEvents(period, family);
  if (events.length === 0) return { created: false, eventCount: 0, questionCount: 0 };

  const code = compilationCode(period, family);
  const resourceId = randomUUID();
  const compilationId = randomUUID();
  const label = periodLabel(period);
  const title = `${period.type === "weekly" ? "Weekly" : "Monthly"} Current Affairs Revision — ${label} — ${family.toUpperCase()}`;
  const markdown = renderCompilationMarkdown({
    title,
    periodLabel: label,
    examFamily: family,
    events,
  });
  const summary = `${events.length} high-relevance verified Current Affairs events re-selected from the canonical event graph for ${period.type} ${family.toUpperCase()} revision. Draft pending editorial publication.`;

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.learning_resources (
        id, public_code, category, format, title, summary, language_code,
        content_date, body_markdown, content_url, status, created_at, updated_at
      ) VALUES (
        ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
        'en', ${period.end}, ${markdown}, null, 'draft', now(), now()
      )
    `;
    await tx`
      INSERT INTO content.current_affairs_compilations (
        id, public_code, period_type, period_start, period_end, exam_family_key,
        language_code, status, event_count, learning_resource_id, created_at, updated_at
      ) VALUES (
        ${compilationId}::uuid, ${code}, ${period.type}, ${period.start}, ${period.end}, ${family},
        'en', 'draft', ${events.length}, ${resourceId}::uuid, now(), now()
      )
    `;
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i]!;
      await tx`
        INSERT INTO content.current_affairs_compilation_events (
          compilation_id, event_id, sort_order, relevance_score, created_at
        ) VALUES (
          ${compilationId}::uuid, ${event.id}::uuid, ${i + 1}, ${Number(event.examScore ?? 0)}, now()
        )
      `;
    }
  });
  const questionCount = await createRollupQuestionRun({ compilationId, period, family, events });
  return { created: true, eventCount: events.length, questionCount };
}

async function loadLocalizedRollupEvents(
  period: CurrentAffairsRollupPeriod,
  family: string,
  languageCode: CurrentAffairsLocalizationLanguage,
): Promise<LocalizedRollupEvent[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      localization.localized_title AS title,
      localization.localized_summary AS summary,
      COALESCE(localization.localized_one_liner, localization.localized_summary) AS "oneLiner",
      event.category,
      score.relevance_score::int AS "examScore",
      COALESCE((
        SELECT json_agg(json_build_object('key', fact.fact_key, 'value', fact.fact_value, 'type', fact.fact_type)
          ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_exam_scores score
      ON score.event_id=event.id AND score.exam_family_key=${family}
    JOIN content.current_affairs_localizations localization
      ON localization.event_id=event.id
      AND localization.authoring_version_id=event.learner_authoring_version_id
      AND localization.language_code=${languageCode}
      AND localization.status IN ('ready', 'manual')
    WHERE event.status='verified'
      AND event.learner_authoring_status IN ('ready', 'manual')
      AND event.event_date BETWEEN ${period.start}::date AND ${period.end}::date
      AND score.include_recommended=true
      AND score.relevance_score >= ${rollupScoreFloor(period)}
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY score.relevance_score DESC, event.event_date DESC, localization.localized_title
    LIMIT ${rollupEventLimit(period)}
  `;
  return rows.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    summary: String(row.summary),
    oneLiner: String(row.oneLiner ?? row.summary),
    category: String(row.category),
    examScore: Number(row.examScore ?? 0),
    facts: normalizeFacts(row.facts),
  }));
}

function localizedPeriodTitle(
  period: CurrentAffairsRollupPeriod,
  family: string,
  languageCode: CurrentAffairsLocalizationLanguage,
) {
  const weekly = period.type === "weekly";
  if (languageCode === "hi") {
    return `${weekly ? "साप्ताहिक" : "मासिक"} करेंट अफेयर्स रिवीजन — ${periodLabel(period)} — ${family.toUpperCase()}`;
  }
  return `${weekly ? "ਹਫ਼ਤਾਵਾਰੀ" : "ਮਾਸਿਕ"} ਕਰੰਟ ਅਫੇਅਰਜ਼ ਰਿਵੀਜ਼ਨ — ${periodLabel(period)} — ${family.toUpperCase()}`;
}

function renderLocalizedRollup(args: {
  period: CurrentAffairsRollupPeriod;
  family: string;
  languageCode: CurrentAffairsLocalizationLanguage;
  events: LocalizedRollupEvent[];
}) {
  const hi = args.languageCode === "hi";
  const lines = [
    `# ${localizedPeriodTitle(args.period, args.family, args.languageCode)}`,
    "",
    hi
      ? "यह रिवीजन पैक दैनिक फाइलों को जोड़कर नहीं बनाया गया है; घटनाओं को सत्यापित canonical Current Affairs graph से दोबारा चुना गया है।"
      : "ਇਹ ਰਿਵੀਜ਼ਨ ਪੈਕ ਰੋਜ਼ਾਨਾ ਫਾਈਲਾਂ ਨੂੰ ਜੋੜ ਕੇ ਨਹੀਂ ਬਣਾਇਆ ਗਿਆ; ਘਟਨਾਵਾਂ ਨੂੰ ਪ੍ਰਮਾਣਿਤ canonical Current Affairs graph ਤੋਂ ਮੁੜ ਚੁਣਿਆ ਗਿਆ ਹੈ।",
    "",
  ];
  args.events.forEach((event, i) => {
    lines.push(`## ${i + 1}. ${event.title}`, "", event.summary, "");
    lines.push(hi ? `**एक पंक्ति में:** ${event.oneLiner}` : `**ਇੱਕ ਲਾਈਨ ਵਿੱਚ:** ${event.oneLiner}`, "");
    if (event.facts.length) {
      lines.push(hi ? "**याद रखने योग्य तथ्य:**" : "**ਯਾਦ ਰੱਖਣ ਵਾਲੇ ਤੱਥ:**");
      event.facts.slice(0, 8).forEach((fact) => lines.push(`- **${fact.key.replaceAll("_", " ")}:** ${fact.value}`));
      lines.push("");
    }
  });
  return `${lines.join("\n").trim()}\n`;
}

async function createLocalizedRollup(
  period: CurrentAffairsRollupPeriod,
  family: string,
  languageCode: CurrentAffairsLocalizationLanguage,
) {
  if (await existingCompilation(period, family, languageCode)) {
    return { created: false, eventCount: 0 };
  }
  const events = await loadLocalizedRollupEvents(period, family, languageCode);
  if (events.length === 0) return { created: false, eventCount: 0 };

  const code = compilationCode(period, family, languageCode);
  const resourceId = randomUUID();
  const compilationId = randomUUID();
  const title = localizedPeriodTitle(period, family, languageCode);
  const markdown = renderLocalizedRollup({ period, family, languageCode, events });
  const summary = languageCode === "hi"
    ? `${events.length} उच्च-प्रासंगिकता, सत्यापित और parity-पास घटनाओं का ${period.type === "weekly" ? "साप्ताहिक" : "मासिक"} रिवीजन ड्राफ्ट।`
    : `${events.length} ਉੱਚ-ਪ੍ਰਾਸੰਗਿਕਤਾ, ਪ੍ਰਮਾਣਿਤ ਅਤੇ parity-ਪਾਸ ਘਟਨਾਵਾਂ ਦਾ ${period.type === "weekly" ? "ਹਫ਼ਤਾਵਾਰੀ" : "ਮਾਸਿਕ"} ਰਿਵੀਜ਼ਨ ਡਰਾਫਟ।`;

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.learning_resources (
        id, public_code, category, format, title, summary, language_code,
        content_date, body_markdown, content_url, status, created_at, updated_at
      ) VALUES (
        ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
        ${languageCode}, ${period.end}, ${markdown}, null, 'draft', now(), now()
      )
    `;
    await tx`
      INSERT INTO content.current_affairs_compilations (
        id, public_code, period_type, period_start, period_end, exam_family_key,
        language_code, status, event_count, learning_resource_id, created_at, updated_at
      ) VALUES (
        ${compilationId}::uuid, ${code}, ${period.type}, ${period.start}, ${period.end}, ${family},
        ${languageCode}, 'draft', ${events.length}, ${resourceId}::uuid, now(), now()
      )
    `;
    for (let i = 0; i < events.length; i += 1) {
      const event = events[i]!;
      await tx`
        INSERT INTO content.current_affairs_compilation_events (
          compilation_id, event_id, sort_order, relevance_score, created_at
        ) VALUES (
          ${compilationId}::uuid, ${event.id}::uuid, ${i + 1}, ${event.examScore}, now()
        )
      `;
    }
  });
  return { created: true, eventCount: events.length };
}

export async function runCompletedPeriodicRollups(now = new Date()) {
  const periods = completedRollupPeriods(now);
  const results: Array<Record<string, unknown>> = [];
  for (const period of periods) {
    for (const family of ROLLUP_EXAM_FAMILIES) {
      const english = await createEnglishRollup(period, family);
      results.push({ period, family, languageCode: "en", ...english });
      for (const languageCode of ROLLUP_LANGUAGES) {
        const localized = await createLocalizedRollup(period, family, languageCode);
        results.push({ period, family, languageCode, questionCount: 0, ...localized });
      }
    }
  }
  return {
    periodsDue: periods,
    compilationsCreated: results.filter((item) => item.created).length,
    eventsIncluded: results.reduce((sum, item) => sum + Number(item.eventCount ?? 0), 0),
    questionsCreated: results.reduce((sum, item) => sum + Number(item.questionCount ?? 0), 0),
    results,
  };
}
