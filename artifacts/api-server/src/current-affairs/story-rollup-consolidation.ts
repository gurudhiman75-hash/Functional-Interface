import { sqlClient } from "../lib/db";
import {
  renderCompilationMarkdown,
  type CurrentAffairsContentEvent,
  type CurrentAffairsFact,
} from "./content";

type DraftCompilation = {
  id: string;
  publicCode: string;
  periodType: "weekly" | "monthly";
  periodStart: string;
  periodEnd: string;
  examFamily: string;
  languageCode: string;
  learningResourceId: string;
  questionRunId?: string;
};

type DraftEvent = {
  id: string;
  publicCode: string;
  eventDate: string;
  category: string;
  examScore: number;
  importanceReason: string;
  threadId?: string;
  title: string;
  summary: string;
  oneLiner: string;
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

async function loadDraftCompilations(limit: number): Promise<DraftCompilation[]> {
  const rows = await sqlClient`
    SELECT
      compilation.id::text AS id,
      compilation.public_code AS "publicCode",
      compilation.period_type AS "periodType",
      compilation.period_start::text AS "periodStart",
      compilation.period_end::text AS "periodEnd",
      compilation.exam_family_key AS "examFamily",
      compilation.language_code AS "languageCode",
      compilation.learning_resource_id::text AS "learningResourceId",
      compilation.question_run_id::text AS "questionRunId"
    FROM content.current_affairs_compilations compilation
    WHERE compilation.status='draft'
      AND compilation.period_type IN ('weekly', 'monthly')
      AND compilation.learning_resource_id IS NOT NULL
    ORDER BY compilation.period_end DESC, compilation.updated_at DESC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    periodType: String(row.periodType) as DraftCompilation["periodType"],
    periodStart: String(row.periodStart).slice(0, 10),
    periodEnd: String(row.periodEnd).slice(0, 10),
    examFamily: String(row.examFamily),
    languageCode: String(row.languageCode),
    learningResourceId: String(row.learningResourceId),
    questionRunId: row.questionRunId ? String(row.questionRunId) : undefined,
  }));
}

async function loadCompilationEvents(compilation: DraftCompilation): Promise<DraftEvent[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.event_date::text AS "eventDate",
      event.category,
      event.importance_reason AS "importanceReason",
      item.relevance_score::int AS "examScore",
      membership.thread_id::text AS "threadId",
      CASE
        WHEN ${compilation.languageCode}='en' THEN authoring.learner_title
        ELSE localization.localized_title
      END AS title,
      CASE
        WHEN ${compilation.languageCode}='en' THEN authoring.learner_summary
        ELSE localization.localized_summary
      END AS summary,
      CASE
        WHEN ${compilation.languageCode}='en' THEN COALESCE(authoring.learner_one_liner, authoring.learner_summary)
        ELSE COALESCE(localization.localized_one_liner, localization.localized_summary)
      END AS "oneLiner",
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
    FROM content.current_affairs_compilation_events item
    JOIN content.current_affairs_events event ON event.id=item.event_id
    JOIN content.current_affairs_authoring_versions authoring
      ON authoring.id=event.learner_authoring_version_id
    LEFT JOIN content.current_affairs_story_thread_events membership ON membership.event_id=event.id
    LEFT JOIN content.current_affairs_localizations localization
      ON localization.event_id=event.id
      AND localization.authoring_version_id=event.learner_authoring_version_id
      AND localization.language_code=${compilation.languageCode}
      AND localization.status IN ('ready', 'manual')
    WHERE item.compilation_id=${compilation.id}::uuid
    ORDER BY item.sort_order ASC, event.event_date DESC
  `;
  return rows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    eventDate: String(row.eventDate).slice(0, 10),
    category: String(row.category),
    examScore: Number(row.examScore ?? 0),
    importanceReason: String(row.importanceReason ?? ""),
    threadId: row.threadId ? String(row.threadId) : undefined,
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    oneLiner: String(row.oneLiner ?? row.summary ?? ""),
    facts: normalizeFacts(row.facts),
  })).filter((event) => event.title && event.summary);
}

function collapseToLatestStoryEvents(events: DraftEvent[]) {
  const groups = new Map<string, DraftEvent[]>();
  for (const event of events) {
    const key = event.threadId ? `thread:${event.threadId}` : `event:${event.id}`;
    const group = groups.get(key) ?? [];
    group.push(event);
    groups.set(key, group);
  }
  const kept: DraftEvent[] = [];
  const removed: DraftEvent[] = [];
  for (const group of groups.values()) {
    group.sort((a, b) =>
      b.eventDate.localeCompare(a.eventDate)
      || b.examScore - a.examScore
      || a.title.localeCompare(b.title),
    );
    kept.push(group[0]!);
    removed.push(...group.slice(1));
  }
  kept.sort((a, b) => b.examScore - a.examScore || b.eventDate.localeCompare(a.eventDate) || a.title.localeCompare(b.title));
  return { kept, removed };
}

function periodLabel(compilation: DraftCompilation): string {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  if (compilation.periodType === "weekly") {
    return `${formatter.format(new Date(`${compilation.periodStart}T00:00:00Z`))} – ${formatter.format(new Date(`${compilation.periodEnd}T00:00:00Z`))}`;
  }
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${compilation.periodEnd}T00:00:00Z`));
}

function renderLocalized(compilation: DraftCompilation, events: DraftEvent[]) {
  const hi = compilation.languageCode === "hi";
  const title = hi
    ? `${compilation.periodType === "weekly" ? "साप्ताहिक" : "मासिक"} करेंट अफेयर्स रिवीजन — ${periodLabel(compilation)} — ${compilation.examFamily.toUpperCase()}`
    : `${compilation.periodType === "weekly" ? "ਹਫ਼ਤਾਵਾਰੀ" : "ਮਾਸਿਕ"} ਕਰੰਟ ਅਫੇਅਰਜ਼ ਰਿਵੀਜ਼ਨ — ${periodLabel(compilation)} — ${compilation.examFamily.toUpperCase()}`;
  const lines = [
    `# ${title}`,
    "",
    hi
      ? "एक ही विकसित होती कहानी की पुरानी प्रविष्टियों को समेकित करके अवधि के भीतर नवीनतम सत्यापित अपडेट रखा गया है।"
      : "ਇੱਕੋ ਵਿਕਸਿਤ ਹੋ ਰਹੀ ਕਹਾਣੀ ਦੀਆਂ ਪੁਰਾਣੀਆਂ ਐਂਟਰੀਆਂ ਨੂੰ ਇਕੱਠਾ ਕਰਕੇ ਮਿਆਦ ਅੰਦਰ ਸਭ ਤੋਂ ਨਵਾਂ ਪ੍ਰਮਾਣਿਤ ਅਪਡੇਟ ਰੱਖਿਆ ਗਿਆ ਹੈ।",
    "",
  ];
  events.forEach((event, index) => {
    lines.push(`## ${index + 1}. ${event.title}`, "", event.summary, "");
    lines.push(hi ? `**एक पंक्ति में:** ${event.oneLiner}` : `**ਇੱਕ ਲਾਈਨ ਵਿੱਚ:** ${event.oneLiner}`, "");
    event.facts.slice(0, 8).forEach((fact) => lines.push(`- **${fact.key.replaceAll("_", " ")}:** ${fact.value}`));
    lines.push("");
  });
  return `${lines.join("\n").trim()}\n`;
}

function renderEnglish(compilation: DraftCompilation, events: DraftEvent[]) {
  const contentEvents: CurrentAffairsContentEvent[] = events.map((event) => ({
    id: event.id,
    publicCode: event.publicCode,
    title: event.title,
    summary: event.summary,
    importanceReason: event.importanceReason,
    eventDate: event.eventDate,
    category: event.category,
    examFamily: compilation.examFamily,
    examScore: event.examScore,
    facts: event.facts,
  }));
  const title = `${compilation.periodType === "weekly" ? "Weekly" : "Monthly"} Current Affairs Revision — ${periodLabel(compilation)} — ${compilation.examFamily.toUpperCase()}`;
  return renderCompilationMarkdown({
    title,
    periodLabel: periodLabel(compilation),
    examFamily: compilation.examFamily,
    events: contentEvents,
  });
}

async function deleteRemovedQuestionItems(tx: typeof sqlClient, compilation: DraftCompilation, removedEventIds: string[]) {
  if (!compilation.questionRunId || removedEventIds.length === 0) return 0;
  const rows = await tx`
    SELECT DISTINCT generation_item_id::text AS "generationItemId"
    FROM content.current_affairs_question_links
    WHERE generation_run_id=${compilation.questionRunId}::uuid
      AND event_id = ANY(${removedEventIds}::uuid[])
  `;
  const itemIds = rows.map((row) => String(row.generationItemId));
  if (itemIds.length === 0) return 0;
  await tx`
    DELETE FROM content.current_affairs_question_links
    WHERE generation_run_id=${compilation.questionRunId}::uuid
      AND generation_item_id = ANY(${itemIds}::uuid[])
  `;
  await tx`
    DELETE FROM content.generation_run_items
    WHERE generation_run_id=${compilation.questionRunId}::uuid
      AND id = ANY(${itemIds}::uuid[])
  `;
  const countRows = await tx`
    SELECT COUNT(*)::int AS count
    FROM content.generation_run_items
    WHERE generation_run_id=${compilation.questionRunId}::uuid
  `;
  const remaining = Number(countRows[0]?.count ?? 0);
  await tx`
    UPDATE content.generation_runs
    SET request_snapshot=jsonb_set(request_snapshot, '{generatedCount}', to_jsonb(${remaining}::int), true),
        prompt_snapshot=jsonb_set(prompt_snapshot, '{generatedCount}', to_jsonb(${remaining}::int), true),
        updated_at=now()
    WHERE id=${compilation.questionRunId}::uuid
  `;
  return itemIds.length;
}

async function consolidateCompilation(compilation: DraftCompilation) {
  const events = await loadCompilationEvents(compilation);
  const { kept, removed } = collapseToLatestStoryEvents(events);
  if (removed.length === 0) return { changed: false, removedEvents: 0, removedQuestions: 0, keptEvents: kept.length };
  const removedIds = removed.map((event) => event.id);
  const body = compilation.languageCode === "en"
    ? renderEnglish(compilation, kept)
    : renderLocalized(compilation, kept);

  let removedQuestions = 0;
  await sqlClient.begin(async (tx) => {
    removedQuestions = await deleteRemovedQuestionItems(tx as typeof sqlClient, compilation, removedIds);
    await tx`
      DELETE FROM content.current_affairs_compilation_events
      WHERE compilation_id=${compilation.id}::uuid
        AND event_id = ANY(${removedIds}::uuid[])
    `;
    for (let index = 0; index < kept.length; index += 1) {
      await tx`
        UPDATE content.current_affairs_compilation_events
        SET sort_order=${index + 1}
        WHERE compilation_id=${compilation.id}::uuid
          AND event_id=${kept[index]!.id}::uuid
      `;
    }
    await tx`
      UPDATE content.current_affairs_compilations
      SET event_count=${kept.length}, updated_at=now()
      WHERE id=${compilation.id}::uuid
    `;
    await tx`
      UPDATE content.learning_resources
      SET body_markdown=${body}, updated_at=now()
      WHERE id=${compilation.learningResourceId}::uuid
    `;
  });
  return {
    changed: true,
    removedEvents: removed.length,
    removedQuestions,
    keptEvents: kept.length,
    removedEventIds: removedIds,
  };
}

export async function consolidateCurrentAffairsPeriodicDrafts(limit = 100) {
  const compilations = await loadDraftCompilations(Math.max(1, Math.min(500, Math.floor(limit))));
  const results: Array<Record<string, unknown>> = [];
  for (const compilation of compilations) {
    results.push({
      compilationId: compilation.id,
      publicCode: compilation.publicCode,
      periodType: compilation.periodType,
      languageCode: compilation.languageCode,
      ...(await consolidateCompilation(compilation)),
    });
  }
  return {
    examined: compilations.length,
    changed: results.filter((item) => item.changed).length,
    removedEvents: results.reduce((sum, item) => sum + Number(item.removedEvents ?? 0), 0),
    removedQuestions: results.reduce((sum, item) => sum + Number(item.removedQuestions ?? 0), 0),
    results,
  };
}
