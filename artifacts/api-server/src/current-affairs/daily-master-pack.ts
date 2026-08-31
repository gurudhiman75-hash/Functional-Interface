import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";

const CATEGORY_ORDER = [
  "national",
  "economy_banking",
  "international",
  "appointments",
  "awards",
  "reports_indices",
  "sports",
  "science_technology",
  "space",
  "defence",
  "environment",
  "books_authors",
  "important_days",
  "summits",
  "obituaries",
  "punjab",
  "other",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  national: "National Affairs",
  economy_banking: "Economy & Banking",
  international: "International Affairs",
  appointments: "Appointments",
  awards: "Awards & Honours",
  reports_indices: "Reports & Indices",
  sports: "Sports",
  science_technology: "Science & Technology",
  space: "Space",
  defence: "Defence",
  environment: "Environment",
  books_authors: "Books & Authors",
  important_days: "Important Days",
  summits: "Summits & Conferences",
  obituaries: "Obituaries",
  punjab: "Punjab",
  other: "Other Important Developments",
};

export type DailyMasterPackEvent = {
  id: string;
  publicCode: string;
  category: string;
  eventDate: string;
  title: string;
  summary: string;
  oneLiner: string;
  examFamilies: string[];
  facts: Array<{ key: string; value: string; type: string | null; confidence: number }>;
  sources: Array<{ name: string; url: string; primary: boolean }>;
};

export type DailyMasterPackPayload = {
  contentDate: string;
  generatedAt: string;
  language: "en";
  eventCount: number;
  categoryCount: number;
  sections: Array<{ category: string; label: string; events: DailyMasterPackEvent[] }>;
};

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function markdownSafe(value: string): string {
  return value.replace(/([\\`*_{}\[\]()#+.!>|-])/g, "\\$1");
}

export function buildDailyMasterPackPayload(contentDate: string, events: DailyMasterPackEvent[]): DailyMasterPackPayload {
  const sections = CATEGORY_ORDER
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      events: events.filter((event) => event.category === category),
    }))
    .filter((section) => section.events.length > 0);

  return {
    contentDate,
    generatedAt: new Date().toISOString(),
    language: "en",
    eventCount: events.length,
    categoryCount: sections.length,
    sections,
  };
}

export function renderDailyMasterPackMarkdown(payload: DailyMasterPackPayload): string {
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${payload.contentDate}T00:00:00Z`));

  const lines: string[] = [
    `# Examtree Daily Current Affairs — ${dateLabel}`,
    "",
    `**${payload.eventCount} verified, authoring-ready, exam-relevant developments · ${payload.categoryCount} sections**`,
    "",
    "> Canonical draft generated from Examtree's verified Current Affairs event graph. This text is the shared source for web, text and future PDF distribution. Editorial approval remains separate.",
    "",
  ];

  let ordinal = 1;
  for (const section of payload.sections) {
    lines.push(`## ${section.label}`, "");
    for (const event of section.events) {
      lines.push(`### ${ordinal}. ${markdownSafe(event.title)}`, "");
      if (event.summary) lines.push("**Why in News**", "", markdownSafe(event.summary), "");
      if (event.facts.length > 0) {
        lines.push("**Key Facts**", "");
        for (const fact of event.facts.slice(0, 12)) {
          lines.push(`- **${markdownSafe(fact.key.replace(/_/g, " "))}:** ${markdownSafe(fact.value)}`);
        }
        lines.push("");
      }
      if (event.oneLiner) lines.push(`**Remember:** ${markdownSafe(event.oneLiner)}`, "");
      lines.push(`**Exam relevance:** ${event.examFamilies.map((item) => item.toUpperCase()).join(" · ")}`, "");
      if (event.sources.length > 0) {
        lines.push("**Evidence**", "");
        for (const source of event.sources.slice(0, 4)) {
          lines.push(`- ${source.primary ? "Primary" : "Supporting"}: [${markdownSafe(source.name)}](${source.url})`);
        }
        lines.push("");
      }
      ordinal += 1;
    }
  }

  lines.push("---", "", "*Draft only. Publication and Question Bank promotion require separate editorial authority.*", "");
  return lines.join("\n");
}

async function loadMasterPackEvents(contentDate: string): Promise<DailyMasterPackEvent[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.category,
      event.event_date::text AS "eventDate",
      COALESCE(version.learner_title, event.canonical_title) AS title,
      COALESCE(version.learner_summary, event.summary, '') AS summary,
      COALESCE(version.learner_one_liner, '') AS "oneLiner",
      COALESCE(scores.families, ARRAY[]::text[]) AS "examFamilies",
      COALESCE(facts.items, '[]'::json) AS facts,
      COALESCE(sources.items, '[]'::json) AS sources
    FROM content.current_affairs_events event
    LEFT JOIN content.current_affairs_authoring_versions version
      ON version.id=event.learner_authoring_version_id
    LEFT JOIN LATERAL (
      SELECT array_agg(DISTINCT score.exam_family_key ORDER BY score.exam_family_key) AS families
      FROM content.current_affairs_exam_scores score
      WHERE score.event_id=event.id AND score.include_recommended=true
    ) scores ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object(
        'key', fact.fact_key,
        'value', fact.fact_value,
        'type', fact.fact_type,
        'confidence', fact.confidence::float8
      ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value) AS items
      FROM content.current_affairs_facts fact
      WHERE fact.event_id=event.id AND fact.is_verified=true
    ) facts ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object(
        'name', source.name,
        'url', evidence.source_url,
        'primary', evidence.is_primary_evidence
      ) ORDER BY evidence.is_primary_evidence DESC, source.trust_score DESC, evidence.created_at ASC) AS items
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=event.id AND evidence.source_url IS NOT NULL
    ) sources ON true
    WHERE event.event_date=${contentDate}::date
      AND event.status='verified'
      AND event.learner_authoring_status IN ('ready','manual')
      AND EXISTS (
        SELECT 1
        FROM content.current_affairs_exam_scores relevance
        WHERE relevance.event_id=event.id AND relevance.include_recommended=true
      )
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY event.category, event.canonical_title
  `;

  return rows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    category: String(row.category),
    eventDate: String(row.eventDate).slice(0, 10),
    title: clean(row.title),
    summary: clean(row.summary),
    oneLiner: clean(row.oneLiner),
    examFamilies: parseArray<string>(row.examFamilies).map(String),
    facts: parseArray<Record<string, unknown>>(row.facts).map((fact) => ({
      key: clean(fact.key),
      value: clean(fact.value),
      type: fact.type ? clean(fact.type) : null,
      confidence: Number(fact.confidence ?? 0),
    })).filter((fact) => fact.key && fact.value),
    sources: parseArray<Record<string, unknown>>(row.sources).map((source) => ({
      name: clean(source.name),
      url: clean(source.url),
      primary: Boolean(source.primary),
    })).filter((source) => source.name && source.url.startsWith("https://")),
  }));
}

function publicCode(contentDate: string) {
  return `CA_MASTER_D_${contentDate.replaceAll("-", "")}_EN`;
}

export async function materializeDailyMasterPack(contentDate: string, censusId?: string | null) {
  const existing = await sqlClient`
    SELECT pack.id::text AS id, pack.status,
           pack.learning_resource_id::text AS "learningResourceId",
           resource.status AS "resourceStatus"
    FROM content.current_affairs_daily_master_packs pack
    JOIN content.learning_resources resource ON resource.id=pack.learning_resource_id
    WHERE pack.content_date=${contentDate}::date AND pack.language_code='en'
    LIMIT 1
  `;
  if (existing[0] && (String(existing[0].status) === "approved" || String(existing[0].resourceStatus) === "published")) {
    return {
      created: false,
      updated: false,
      locked: true,
      id: String(existing[0].id),
      learningResourceId: String(existing[0].learningResourceId),
      reason: "approved_or_published_master_pack_is_immutable",
    };
  }

  const events = await loadMasterPackEvents(contentDate);
  if (events.length === 0) {
    return { created: false, updated: false, locked: false, reason: "no_verified_authoring_ready_exam_relevant_events", eventCount: 0 };
  }
  const payload = buildDailyMasterPackPayload(contentDate, events);
  const bodyMarkdown = renderDailyMasterPackMarkdown(payload);
  const code = publicCode(contentDate);
  const title = `Examtree Daily Current Affairs — ${contentDate}`;
  const summary = `${payload.eventCount} verified exam-relevant Current Affairs developments across ${payload.categoryCount} sections. Canonical draft for text and PDF distribution.`;
  const resourceId = existing[0]?.learningResourceId ? String(existing[0].learningResourceId) : randomUUID();
  const packId = existing[0]?.id ? String(existing[0].id) : randomUUID();

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.learning_resources (
        id, public_code, category, format, title, summary, language_code,
        content_date, body_markdown, content_url, status, created_at, updated_at
      ) VALUES (
        ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
        'en', ${contentDate}::date, ${bodyMarkdown}, null, 'draft', now(), now()
      )
      ON CONFLICT (public_code) DO UPDATE SET
        title=EXCLUDED.title,
        summary=EXCLUDED.summary,
        body_markdown=EXCLUDED.body_markdown,
        content_date=EXCLUDED.content_date,
        updated_at=now()
      WHERE content.learning_resources.status='draft'
    `;
    await tx`
      INSERT INTO content.current_affairs_daily_master_packs (
        id, public_code, content_date, language_code, status, census_id,
        learning_resource_id, event_count, category_count, body_markdown,
        payload, render_targets, generated_at, created_at, updated_at
      ) VALUES (
        ${packId}::uuid, ${code}, ${contentDate}::date, 'en', 'draft',
        ${censusId ?? null}::uuid, ${resourceId}::uuid, ${payload.eventCount}, ${payload.categoryCount},
        ${bodyMarkdown}, ${JSON.stringify(payload)}::jsonb,
        '["web","text","pdf"]'::jsonb, now(), now(), now()
      )
      ON CONFLICT (content_date, language_code) DO UPDATE SET
        census_id=EXCLUDED.census_id,
        event_count=EXCLUDED.event_count,
        category_count=EXCLUDED.category_count,
        body_markdown=EXCLUDED.body_markdown,
        payload=EXCLUDED.payload,
        generated_at=now(), updated_at=now()
      WHERE content.current_affairs_daily_master_packs.status IN ('draft','review')
    `;
  });

  return {
    created: !existing[0],
    updated: Boolean(existing[0]),
    locked: false,
    id: packId,
    publicCode: code,
    learningResourceId: resourceId,
    eventCount: payload.eventCount,
    categoryCount: payload.categoryCount,
    bodyMarkdown,
    payload,
  };
}

export async function loadDailyMasterPack(contentDate: string) {
  const rows = await sqlClient`
    SELECT pack.id::text AS id, pack.public_code AS "publicCode",
      pack.content_date::text AS "contentDate", pack.language_code AS language,
      pack.status, pack.event_count::int AS "eventCount", pack.category_count::int AS "categoryCount",
      pack.body_markdown AS "bodyMarkdown", pack.payload, pack.render_targets AS "renderTargets",
      pack.learning_resource_id::text AS "learningResourceId", pack.generated_at::text AS "generatedAt",
      resource.status AS "learningResourceStatus"
    FROM content.current_affairs_daily_master_packs pack
    JOIN content.learning_resources resource ON resource.id=pack.learning_resource_id
    WHERE pack.content_date=${contentDate}::date AND pack.language_code='en'
    LIMIT 1
  `;
  return rows[0] ?? null;
}
