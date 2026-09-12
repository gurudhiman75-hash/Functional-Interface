import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  buildDailyMasterPackPayload,
  evaluateLocalizedMasterPackParity,
  renderDailyMasterPackMarkdown,
  type DailyMasterPackEvent,
  type DailyMasterPackLanguage,
  type DailyMasterPackPayload,
} from "./daily-master-pack";
import { evaluateDailyMasterPackEditorialQuality } from "./daily-master-pack-approval-policy";
import {
  applySelectedLearnerEditorialQuality,
  selectedLearnerEditorialWarnings,
  SELECTED_LEARNER_EDITORIAL_VERSION,
} from "./selected-editorial-learner-quality";

export const SELECTED_MASTER_PACK_BOUNDARY_VERSION = "ca-cp068-selected-master-pack-boundary-v1";
const DAILY_PRODUCT_EXAM_FAMILIES = ["ssc", "banking", "punjab"] as const;
const TITLE_SIMILARITY_LIMIT = 0.72;

type SelectedMembershipRow = {
  candidateId: string;
  eventId: string | null;
};

export type SelectedMasterPackMembership = {
  boundaryVersion: string;
  selectedHeadlineCount: number;
  selectedEventCount: number;
  eventIds: string[];
  unlinkedSelectedCandidateIds: string[];
  duplicateSelectedHeadlineCount: number;
};

type SelectedMasterPackEvent = DailyMasterPackEvent & {
  sourceTitleSimilarity: number | null;
};

type SelectedPackQuality = {
  ready: boolean;
  blockers: string[];
  warnings: string[];
  baseEditorialQuality: ReturnType<typeof evaluateDailyMasterPackEditorialQuality>;
};

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function normalizeIds(values: string[]) {
  return [...new Set(values.map(String).map((value) => value.trim()).filter(Boolean))].sort();
}

export function evaluateSelectedMasterPackMembership(expectedIdsInput: string[], actualIdsInput: string[]) {
  const expectedIds = normalizeIds(expectedIdsInput);
  const actualIds = normalizeIds(actualIdsInput);
  const expected = new Set(expectedIds);
  const actual = new Set(actualIds);
  const missingEventIds = expectedIds.filter((id) => !actual.has(id));
  const extraEventIds = actualIds.filter((id) => !expected.has(id));
  return {
    complete: expectedIds.length > 0
      && missingEventIds.length === 0
      && extraEventIds.length === 0
      && actualIdsInput.length === actualIds.length,
    expectedEventCount: expectedIds.length,
    actualEventCount: actualIds.length,
    missingEventIds,
    extraEventIds,
    duplicateActualEventCount: Math.max(0, actualIdsInput.length - actualIds.length),
  };
}

function normalizedCopy(value: string) {
  return clean(value).toLowerCase().replace(/[^\p{L}\p{N}%₹$]+/gu, " ").trim();
}

function addDuplicateIssues(
  events: SelectedMasterPackEvent[],
  field: "title" | "oneLiner",
  blockers: string[],
) {
  const seen = new Map<string, string>();
  for (const event of events) {
    const normalized = normalizedCopy(event[field]);
    if (!normalized) continue;
    const prior = seen.get(normalized);
    if (prior && prior !== event.id) {
      blockers.push(`Duplicate learner ${field === "oneLiner" ? "one-liner" : "title"} across selected events (${prior}, ${event.id})`);
    } else {
      seen.set(normalized, event.id);
    }
  }
}

export function evaluateSelectedMasterPackQuality(events: SelectedMasterPackEvent[]): SelectedPackQuality {
  const baseEditorialQuality = evaluateDailyMasterPackEditorialQuality(events.map((event) => ({
    id: event.id,
    title: event.title,
    summary: event.summary,
    oneLiner: event.oneLiner,
    category: event.category,
    facts: event.facts.map((fact) => ({ key: fact.key, value: fact.value })),
  })));
  const blockers = [...baseEditorialQuality.blockers];
  const warnings = [...baseEditorialQuality.warnings];

  for (const event of events) {
    if (!clean(event.title)) blockers.push(`Selected event ${event.id} has no learner title`);
    if (!clean(event.summary)) blockers.push(`Selected event ${event.id} has no learner summary`);
    if (!clean(event.oneLiner)) blockers.push(`Selected event ${event.id} has no learner one-liner`);
    if (event.facts.length === 0) blockers.push(`Selected event ${event.id} has no verified learner facts`);
    if (event.examFamilies.length === 0) blockers.push(`Selected event ${event.id} has no recommended product exam family`);
    if (!event.sources.some((source) => source.primary)) blockers.push(`Selected event ${event.id} has no primary evidence in the pack`);
    if (event.sourceTitleSimilarity !== null && event.sourceTitleSimilarity > TITLE_SIMILARITY_LIMIT) {
      blockers.push(`Selected event ${event.id} learner title exceeds the ${TITLE_SIMILARITY_LIMIT.toFixed(2)} source-title similarity ceiling (${event.sourceTitleSimilarity.toFixed(4)})`);
    }
    if (/\s\.\s/.test(event.title)) {
      blockers.push(`Selected event ${event.id} has malformed punctuation in learner title: ${event.title}`);
    }
  }

  addDuplicateIssues(events, "title", blockers);
  addDuplicateIssues(events, "oneLiner", blockers);

  return {
    ready: blockers.length === 0,
    blockers: [...new Set(blockers)],
    warnings: [...new Set(warnings)],
    baseEditorialQuality,
  };
}

function localizedScriptWarning(language: "hi" | "pa", event: DailyMasterPackEvent) {
  const text = `${event.title} ${event.summary} ${event.oneLiner}`;
  const indicPattern = language === "hi" ? /[\u0900-\u097F]/g : /[\u0A00-\u0A7F]/g;
  const latinPattern = /[A-Za-z]/g;
  const indic = (text.match(indicPattern) ?? []).length;
  const latin = (text.match(latinPattern) ?? []).length;
  const total = indic + latin;
  if (total < 30 || latin < 20) return null;
  const ratio = indic / total;
  return ratio < 0.18
    ? `${language.toUpperCase()} localized learner copy for ${event.id} is predominantly Latin-script and needs editorial review`
    : null;
}

async function loadSelectedMembership(contentDate: string): Promise<SelectedMasterPackMembership> {
  const rows = await sqlClient`
    SELECT
      candidate.id::text AS "candidateId",
      linked_event.id::text AS "eventId"
    FROM content.current_affairs_ingestion_candidates candidate
    LEFT JOIN LATERAL (
      SELECT event.id, event.status, event.updated_at
      FROM content.current_affairs_event_candidates link
      JOIN content.current_affairs_events event ON event.id=link.event_id
      WHERE link.candidate_id=candidate.id
      ORDER BY CASE event.status
        WHEN 'verified' THEN 0
        WHEN 'review' THEN 1
        WHEN 'candidate' THEN 2
        WHEN 'rejected' THEN 3
        ELSE 4
      END,
      event.updated_at DESC
      LIMIT 1
    ) linked_event ON true
    WHERE COALESCE((candidate.payload->>'manualEditorialSelected')::boolean, false)=true
      AND COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${contentDate}
    ORDER BY candidate.created_at ASC, candidate.id ASC
  `;
  const membershipRows: SelectedMembershipRow[] = rows.map((row) => ({
    candidateId: String(row.candidateId),
    eventId: row.eventId ? String(row.eventId) : null,
  }));
  const eventIds = normalizeIds(membershipRows.map((row) => row.eventId).filter((id): id is string => Boolean(id)));
  return {
    boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION,
    selectedHeadlineCount: membershipRows.length,
    selectedEventCount: eventIds.length,
    eventIds,
    unlinkedSelectedCandidateIds: membershipRows.filter((row) => !row.eventId).map((row) => row.candidateId),
    duplicateSelectedHeadlineCount: Math.max(0, membershipRows.filter((row) => row.eventId).length - eventIds.length),
  };
}

async function loadSelectedPackEvents(
  language: DailyMasterPackLanguage,
  eventIds: string[],
): Promise<SelectedMasterPackEvent[]> {
  if (eventIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.category,
      event.event_date::text AS "eventDate",
      CASE WHEN ${language}='en'
        THEN COALESCE(version.learner_title, event.canonical_title)
        ELSE localization.localized_title
      END AS title,
      CASE WHEN ${language}='en'
        THEN COALESCE(version.learner_summary, event.summary, '')
        ELSE COALESCE(localization.localized_summary, '')
      END AS summary,
      CASE WHEN ${language}='en'
        THEN COALESCE(version.learner_one_liner, '')
        ELSE COALESCE(localization.localized_one_liner, localization.localized_summary, '')
      END AS "oneLiner",
      version.source_title_similarity::float8 AS "sourceTitleSimilarity",
      COALESCE(scores.families, ARRAY[]::text[]) AS "examFamilies",
      COALESCE(facts.items, '[]'::json) AS facts,
      COALESCE(sources.items, '[]'::json) AS sources
    FROM content.current_affairs_events event
    LEFT JOIN content.current_affairs_authoring_versions version
      ON version.id=event.learner_authoring_version_id
    LEFT JOIN content.current_affairs_localizations localization
      ON localization.event_id=event.id
      AND localization.authoring_version_id=event.learner_authoring_version_id
      AND localization.language_code=${language}
      AND localization.status IN ('ready','manual')
    LEFT JOIN LATERAL (
      SELECT array_agg(DISTINCT score.exam_family_key ORDER BY score.exam_family_key) AS families
      FROM content.current_affairs_exam_scores score
      WHERE score.event_id=event.id
        AND score.include_recommended=true
        AND score.exam_family_key IN ('ssc','banking','punjab')
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
      WHERE evidence.event_id=event.id
        AND evidence.source_url IS NOT NULL
        AND COALESCE((evidence.metadata->>'selectedBindingQuarantined')::boolean, false)=false
    ) sources ON true
    WHERE event.id = ANY(${eventIds}::uuid[])
      AND event.status='verified'
      AND event.learner_authoring_status IN ('ready','manual')
      AND (${language}='en' OR localization.id IS NOT NULL)
      -- Manual editorial selection is the relevance/inclusion authority for this
      -- selected pack. Automated include_recommended scores remain advisory and
      -- are still surfaced through editorial QA; they must not silently drop a
      -- headline the admin explicitly selected.
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY event.category, event.canonical_title, event.id
  `;

  return rows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    category: String(row.category),
    eventDate: String(row.eventDate).slice(0, 10),
    title: clean(row.title),
    summary: clean(row.summary),
    oneLiner: clean(row.oneLiner),
    sourceTitleSimilarity: row.sourceTitleSimilarity === null || row.sourceTitleSimilarity === undefined
      ? null
      : Number(row.sourceTitleSimilarity),
    examFamilies: parseArray<string>(row.examFamilies)
      .map(String)
      .filter((family) => (DAILY_PRODUCT_EXAM_FAMILIES as readonly string[]).includes(family)),
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

const RESOURCE_TITLE: Record<DailyMasterPackLanguage, string> = {
  en: "Examtree Daily Current Affairs",
  hi: "Examtree दैनिक करेंट अफेयर्स",
  pa: "Examtree ਰੋਜ਼ਾਨਾ ਕਰੰਟ ਅਫੇਅਰਜ਼",
};

function publicCode(contentDate: string, language: DailyMasterPackLanguage) {
  return `CA_MASTER_D_${contentDate.replaceAll("-", "")}_${language.toUpperCase()}`;
}

function resourceSummary(payload: DailyMasterPackPayload) {
  if (payload.language === "hi") return `${payload.eventCount} चयनित, सत्यापित Current Affairs घटनाक्रम ${payload.categoryCount} खंडों में।`;
  if (payload.language === "pa") return `${payload.eventCount} ਚੁਣੀਆਂ ਹੋਈਆਂ, ਪ੍ਰਮਾਣਿਤ Current Affairs ਘਟਨਾਵਾਂ ${payload.categoryCount} ਭਾਗਾਂ ਵਿੱਚ।`;
  return `${payload.eventCount} admin-selected, verified Current Affairs developments across ${payload.categoryCount} sections.`;
}

async function existingPacks(contentDate: string) {
  const rows = await sqlClient`
    SELECT pack.id::text AS id, pack.language_code AS language, pack.status,
      pack.learning_resource_id::text AS "learningResourceId", resource.status AS "resourceStatus"
    FROM content.current_affairs_daily_master_packs pack
    JOIN content.learning_resources resource ON resource.id=pack.learning_resource_id
    WHERE pack.content_date=${contentDate}::date
      AND pack.language_code IN ('en','hi','pa')
  `;
  return new Map(rows.map((row) => [String(row.language), {
    id: String(row.id),
    status: String(row.status),
    learningResourceId: String(row.learningResourceId),
    resourceStatus: String(row.resourceStatus),
  }]));
}

export async function materializeSelectedDailyMasterPacks(contentDate: string, censusId?: string | null) {
  const membership = await loadSelectedMembership(contentDate);
  if (membership.selectedHeadlineCount === 0) {
    return { boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION, created: false, reason: "no_admin_selected_headlines", membership };
  }
  if (membership.unlinkedSelectedCandidateIds.length > 0 || membership.selectedEventCount === 0) {
    return { boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION, created: false, reason: "selected_candidate_event_link_incomplete", membership };
  }

  const existing = await existingPacks(contentDate);
  const immutable = [...existing.values()].filter((pack) => pack.status === "approved" || pack.resourceStatus === "published");
  if (immutable.length > 0) {
    return { boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION, created: false, locked: true, reason: "approved_or_published_master_pack_is_immutable", membership };
  }

  const [enEvents, hiEvents, paEvents] = await Promise.all([
    loadSelectedPackEvents("en", membership.eventIds),
    loadSelectedPackEvents("hi", membership.eventIds),
    loadSelectedPackEvents("pa", membership.eventIds),
  ]);

  const membershipChecks = {
    en: evaluateSelectedMasterPackMembership(membership.eventIds, enEvents.map((event) => event.id)),
    hi: evaluateSelectedMasterPackMembership(membership.eventIds, hiEvents.map((event) => event.id)),
    pa: evaluateSelectedMasterPackMembership(membership.eventIds, paEvents.map((event) => event.id)),
  };
  if (!membershipChecks.en.complete || !membershipChecks.hi.complete || !membershipChecks.pa.complete) {
    return {
      boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION,
      created: false,
      reason: "selected_event_membership_incomplete",
      membership,
      membershipChecks,
    };
  }

  const hiParity = evaluateLocalizedMasterPackParity(enEvents, hiEvents);
  const paParity = evaluateLocalizedMasterPackParity(enEvents, paEvents);
  if (!hiParity.complete || !paParity.complete) {
    return {
      boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION,
      created: false,
      reason: "localized_event_parity_incomplete",
      membership,
      membershipChecks,
      hiParity,
      paParity,
    };
  }

  const editorializedEventSets: Record<DailyMasterPackLanguage, SelectedMasterPackEvent[]> = {
    en: enEvents.map((event) => ({ ...event, ...applySelectedLearnerEditorialQuality(event, "en") })),
    hi: hiEvents.map((event) => ({ ...event, ...applySelectedLearnerEditorialQuality(event, "hi") })),
    pa: paEvents.map((event) => ({ ...event, ...applySelectedLearnerEditorialQuality(event, "pa") })),
  };

  const quality = evaluateSelectedMasterPackQuality(editorializedEventSets.en);
  quality.warnings = [...new Set([...quality.warnings, ...selectedLearnerEditorialWarnings(editorializedEventSets.en)])];
  const localizationWarnings = [
    ...editorializedEventSets.hi.map((event) => localizedScriptWarning("hi", event)).filter((item): item is string => Boolean(item)),
    ...editorializedEventSets.pa.map((event) => localizedScriptWarning("pa", event)).filter((item): item is string => Boolean(item)),
  ];

  const eventSets = editorializedEventSets;
  const materialized: Record<string, unknown> = {};

  await sqlClient.begin(async (tx) => {
    for (const language of ["en", "hi", "pa"] as const) {
      const basePayload = buildDailyMasterPackPayload(contentDate, eventSets[language], language);
      const payload = {
        ...basePayload,
        learnerEditorialVersion: SELECTED_LEARNER_EDITORIAL_VERSION,
        membership: {
          boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION,
          mode: "admin_selected",
          selectedHeadlineCount: membership.selectedHeadlineCount,
          selectedEventCount: membership.selectedEventCount,
          duplicateSelectedHeadlineCount: membership.duplicateSelectedHeadlineCount,
        },
        editorialQuality: language === "en" ? {
          ready: quality.ready,
          blockers: quality.blockers,
          warnings: quality.warnings,
        } : {
          parityWithEnglish: true,
          warnings: localizationWarnings.filter((warning) => warning.startsWith(language.toUpperCase())),
        },
      } as DailyMasterPackPayload & Record<string, unknown>;
      const bodyMarkdown = renderDailyMasterPackMarkdown(basePayload);
      const code = publicCode(contentDate, language);
      const current = existing.get(language);
      const resourceId = current?.learningResourceId ?? randomUUID();
      const packId = current?.id ?? randomUUID();
      const renderTargets = ["web", "text", "pdf"];
      const title = `${RESOURCE_TITLE[language]} — ${contentDate}`;
      const summary = resourceSummary(basePayload);

      await tx`
        INSERT INTO content.learning_resources (
          id, public_code, category, format, title, summary, language_code,
          content_date, body_markdown, content_url, status, created_at, updated_at
        ) VALUES (
          ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
          ${language}, ${contentDate}::date, ${bodyMarkdown}, null, 'draft', now(), now()
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
          ${packId}::uuid, ${code}, ${contentDate}::date, ${language}, 'draft',
          ${censusId ?? null}::uuid, ${resourceId}::uuid, ${basePayload.eventCount}, ${basePayload.categoryCount},
          ${bodyMarkdown}, ${JSON.stringify(payload)}::jsonb,
          ${JSON.stringify(renderTargets)}::jsonb, now(), now(), now()
        )
        ON CONFLICT (content_date, language_code) DO UPDATE SET
          census_id=EXCLUDED.census_id,
          event_count=EXCLUDED.event_count,
          category_count=EXCLUDED.category_count,
          body_markdown=EXCLUDED.body_markdown,
          payload=EXCLUDED.payload,
          render_targets=EXCLUDED.render_targets,
          generated_at=now(), updated_at=now()
        WHERE content.current_affairs_daily_master_packs.status IN ('draft','review')
      `;

      materialized[language] = {
        id: packId,
        publicCode: code,
        language,
        learningResourceId: resourceId,
        eventCount: basePayload.eventCount,
        categoryCount: basePayload.categoryCount,
      };
    }
  });

  return {
    boundaryVersion: SELECTED_MASTER_PACK_BOUNDARY_VERSION,
    learnerEditorialVersion: SELECTED_LEARNER_EDITORIAL_VERSION,
    created: true,
    locked: false,
    membership,
    membershipChecks,
    hiParity,
    paParity,
    quality,
    localizationWarnings,
    packs: materialized,
    allLocalizedParityReady: true,
    canonicalApprovalAuthority: false,
    publicationAuthority: false,
    questionBankPromotionAuthority: false,
  };
}
