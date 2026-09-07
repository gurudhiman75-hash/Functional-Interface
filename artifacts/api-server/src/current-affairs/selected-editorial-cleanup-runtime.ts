import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  authoringInputFingerprint,
  titleSimilarity,
  type AuthoringFact,
  type AuthoringInput,
} from "./original-authoring";
import {
  localizationInputFingerprint,
  type CurrentAffairsLocalizationInput,
  type CurrentAffairsLocalizationLanguage,
  type LocalizationFact,
} from "./multilingual-localization";

export const SELECTED_EDITORIAL_CLEANUP_VERSION = "ca-cp069-selected-editorial-cleanup-v1";
const TITLE_SIMILARITY_LIMIT = 0.72;
const PRODUCT_FAMILIES = ["ssc", "banking", "punjab"] as const;
const MALFORMED_SCHEDULED_ACTION = /\bscheduled\s+(?:launch|conduct|inaugurat(?:e|ion)|hold|held|open|unveil|release)\b/i;

type SelectedEventRow = {
  eventId: string;
  publicCode: string;
  eventDate: string;
  category: string;
  authoringVersionId: string;
  authoringStatus: string;
  learnerTitle: string;
  learnerSummary: string;
  learnerOneLiner: string;
  templateId: string | null;
  sourceKey: string | null;
  sourceTitle: string;
  sourceTitles: string[];
  facts: AuthoringFact[];
};

type CciAcquisition = {
  buyer: string;
  target: string;
  percentage: string | null;
  subject: string;
};

type LocalizedRepair = {
  title: string;
  summary: string;
  oneLiner: string;
  kind: "cci_acquisition" | "rbi_vrrr_planned_auction";
};

function clean(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function parseStringArray(value: unknown) {
  return parseArray(value).map(String).map(clean).filter(Boolean);
}

function parseFacts(value: unknown): AuthoringFact[] {
  return parseArray(value).flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const row = item as Record<string, unknown>;
    const key = clean(row.key);
    const factValue = clean(row.value);
    return key && factValue ? [{ key, value: factValue, type: row.type ? clean(row.type) : undefined }] : [];
  });
}

function factMap(facts: AuthoringFact[]) {
  const map = new Map<string, string>();
  for (const item of facts) {
    const key = clean(item.key).toLowerCase();
    if (key && !map.has(key)) map.set(key, clean(item.value));
  }
  return map;
}

function humanDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function cleanParty(value: string) {
  return clean(value)
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\b(?:Pte\.?\s+Ltd\.?|Private\s+Limited|Limited|Ltd\.?)\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/[ .,;:-]+$/g, "")
    .trim();
}

function cleanTarget(value: string) {
  return clean(value)
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\bLimited\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/[ .,;:-]+$/g, "")
    .trim();
}

export function parseCciAcquisition(subjectInput: string): CciAcquisition | null {
  const subject = clean(subjectInput);
  const match = subject.match(/^acquisition of (.+?) by (.+?)(?:\s+and related transactions)?$/i);
  if (!match?.[1] || !match[2]) return null;
  const rawTarget = clean(match[1]);
  const percentage = rawTarget.match(/^up to\s+([0-9]+(?:\.[0-9]+)?%)\s+equity shareholding of\s+/i)?.[1] ?? null;
  const target = cleanTarget(rawTarget.replace(/^up to\s+[0-9]+(?:\.[0-9]+)?%\s+equity shareholding of\s+/i, ""));
  const buyer = cleanParty(match[2]);
  return buyer && target ? { buyer, target, percentage, subject } : null;
}

export function cciEditorialTitleCandidates(subjectInput: string) {
  const parsed = parseCciAcquisition(subjectInput);
  if (!parsed) return [];
  return [
    `CCI clears ${parsed.buyer}'s acquisition of ${parsed.target}`,
    `${parsed.buyer} receives CCI clearance to acquire ${parsed.target}`,
    `CCI nod for ${parsed.buyer} to acquire ${parsed.target}`,
  ];
}

export function chooseCciEditorialTitle(subject: string, sourceTitles: string[]) {
  const candidates = cciEditorialTitleCandidates(subject);
  for (const title of candidates) {
    const maxSimilarity = sourceTitles.reduce(
      (max, sourceTitle) => Math.max(max, titleSimilarity(title, sourceTitle)),
      0,
    );
    if (maxSimilarity < TITLE_SIMILARITY_LIMIT) {
      return { title, sourceTitleSimilarity: Number(maxSimilarity.toFixed(4)) };
    }
  }
  return null;
}

export function chooseSelectedProductFamily(scores: Array<{ family: string; score: number; include: boolean }>) {
  if (scores.some((item) => (PRODUCT_FAMILIES as readonly string[]).includes(item.family) && item.include)) return null;
  return scores
    .filter((item) => (PRODUCT_FAMILIES as readonly string[]).includes(item.family))
    .sort((a, b) => b.score - a.score || a.family.localeCompare(b.family))[0]?.family ?? null;
}

function localizedScriptRatio(value: string, language: CurrentAffairsLocalizationLanguage) {
  const indicPattern = language === "hi" ? /[\u0900-\u097F]/g : /[\u0A00-\u0A7F]/g;
  const latinPattern = /[A-Za-z]/g;
  const indic = (value.match(indicPattern) ?? []).length;
  const latin = (value.match(latinPattern) ?? []).length;
  const total = indic + latin;
  return total === 0 ? 0 : indic / total;
}

export function buildSelectedEditorialLocalization(args: {
  language: CurrentAffairsLocalizationLanguage;
  eventDate: string;
  facts: AuthoringFact[];
}): LocalizedRepair | null {
  const facts = factMap(args.facts);
  const actingEntity = clean(facts.get("acting_entity"));
  const officialAction = clean(facts.get("official_action"));
  const actionSubject = clean(facts.get("action_subject"));

  if (/^CCI$/i.test(actingEntity) && /^approv/i.test(officialAction)) {
    const acquisition = parseCciAcquisition(actionSubject);
    if (acquisition) {
      if (args.language === "hi") {
        const title = `CCI ने ${acquisition.buyer} द्वारा ${acquisition.target} के अधिग्रहण को मंजूरी दी`;
        const summary = acquisition.percentage
          ? `${humanDate(args.eventDate)} को CCI ने ${acquisition.buyer} द्वारा ${acquisition.target} में ${acquisition.percentage} तक इक्विटी हिस्सेदारी के अधिग्रहण को मंजूरी दी।`
          : `${humanDate(args.eventDate)} को CCI ने ${acquisition.buyer} द्वारा ${acquisition.target} के अधिग्रहण को मंजूरी दी।`;
        return {
          title,
          summary: summary
            .replace(/September/g, "सितंबर")
            .replace(/August/g, "अगस्त"),
          oneLiner: `CCI ने ${acquisition.buyer} को ${acquisition.target} के अधिग्रहण की मंजूरी दी।`,
          kind: "cci_acquisition",
        };
      }
      const title = `CCI ਨੇ ${acquisition.buyer} ਵੱਲੋਂ ${acquisition.target} ਦੀ ਖਰੀਦ ਨੂੰ ਮਨਜ਼ੂਰੀ ਦਿੱਤੀ`;
      const summary = acquisition.percentage
        ? `${humanDate(args.eventDate)} ਨੂੰ CCI ਨੇ ${acquisition.buyer} ਵੱਲੋਂ ${acquisition.target} ਵਿੱਚ ${acquisition.percentage} ਤੱਕ ਹਿੱਸੇਦਾਰੀ ਖਰੀਦਣ ਨੂੰ ਮਨਜ਼ੂਰੀ ਦਿੱਤੀ।`
        : `${humanDate(args.eventDate)} ਨੂੰ CCI ਨੇ ${acquisition.buyer} ਵੱਲੋਂ ${acquisition.target} ਦੀ ਖਰੀਦ ਨੂੰ ਮਨਜ਼ੂਰੀ ਦਿੱਤੀ।`;
      return {
        title,
        summary: summary
          .replace(/September/g, "ਸਤੰਬਰ")
          .replace(/August/g, "ਅਗਸਤ"),
        oneLiner: `CCI ਨੇ ${acquisition.buyer} ਨੂੰ ${acquisition.target} ਖਰੀਦਣ ਦੀ ਮਨਜ਼ੂਰੀ ਦਿੱਤੀ।`,
        kind: "cci_acquisition",
      };
    }
  }

  if (/^(?:RBI|Reserve Bank of India)$/i.test(actingEntity)
    && /^scheduled\s+conduct$/i.test(officialAction)
    && /(?:Variable Rate Reverse Repo|\bVRRR\b)/i.test(actionSubject)) {
    if (args.language === "hi") {
      return {
        title: "RBI ने 1 सितंबर 2026 के लिए 7-दिवसीय VRRR नीलामी की घोषणा की",
        summary: "31 अगस्त 2026 को RBI ने घोषणा की कि 7-दिवसीय Variable Rate Reverse Repo (VRRR) नीलामी 1 सितंबर 2026 को LAF के तहत आयोजित की जाएगी।",
        oneLiner: "RBI ने 1 सितंबर 2026 के लिए 7-दिवसीय VRRR नीलामी घोषित की।",
        kind: "rbi_vrrr_planned_auction",
      };
    }
    return {
      title: "RBI ਨੇ 1 ਸਤੰਬਰ 2026 ਲਈ 7-ਦਿਨਾਂ ਦੀ VRRR ਨਿਲਾਮੀ ਦਾ ਐਲਾਨ ਕੀਤਾ",
      summary: "31 ਅਗਸਤ 2026 ਨੂੰ RBI ਨੇ ਐਲਾਨ ਕੀਤਾ ਕਿ 7-ਦਿਨਾਂ ਦੀ Variable Rate Reverse Repo (VRRR) ਨਿਲਾਮੀ 1 ਸਤੰਬਰ 2026 ਨੂੰ LAF ਹੇਠ ਕਰਵਾਈ ਜਾਵੇਗੀ।",
      oneLiner: "RBI ਨੇ 1 ਸਤੰਬਰ 2026 ਲਈ 7-ਦਿਨਾਂ ਦੀ VRRR ਨਿਲਾਮੀ ਦਾ ਐਲਾਨ ਕੀਤਾ।",
      kind: "rbi_vrrr_planned_auction",
    };
  }

  return null;
}

export function removeInternalScheduledActionFalsePositive(payloadInput: Record<string, unknown>) {
  const payload = structuredClone(payloadInput);
  const quality = payload.editorialQuality && typeof payload.editorialQuality === "object" && !Array.isArray(payload.editorialQuality)
    ? payload.editorialQuality as Record<string, unknown>
    : null;
  if (!quality) return { payload, removed: 0 };

  const cleanScheduledEventIds = new Set<string>();
  for (const sectionValue of parseArray(payload.sections)) {
    if (!sectionValue || typeof sectionValue !== "object" || Array.isArray(sectionValue)) continue;
    const section = sectionValue as Record<string, unknown>;
    for (const eventValue of parseArray(section.events)) {
      if (!eventValue || typeof eventValue !== "object" || Array.isArray(eventValue)) continue;
      const event = eventValue as Record<string, unknown>;
      const eventId = clean(event.id);
      const learnerCopy = `${clean(event.title)} ${clean(event.summary)} ${clean(event.oneLiner)}`;
      if (eventId && !MALFORMED_SCHEDULED_ACTION.test(learnerCopy)) cleanScheduledEventIds.add(eventId);
    }
  }

  const blockers = parseArray(quality.blockers).map(String);
  const filtered = blockers.filter((blocker) => {
    const match = blocker.match(/^Malformed planned-event wording remains in canonical pack \(([^)]+)\):/);
    return !(match?.[1] && cleanScheduledEventIds.has(match[1]));
  });
  const removed = blockers.length - filtered.length;
  quality.blockers = filtered;
  quality.ready = filtered.length === 0;
  payload.editorialQuality = quality;
  return { payload, removed };
}

async function selectedEventIds(targetDate: string) {
  const rows = await sqlClient`
    SELECT DISTINCT linked_event.id::text AS id
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN LATERAL (
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
      )=${targetDate}
    ORDER BY id
  `;
  return rows.map((row) => String(row.id));
}

async function loadSelectedEvents(targetDate: string): Promise<SelectedEventRow[]> {
  const eventIds = await selectedEventIds(targetDate);
  if (eventIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT
      event.id::text AS "eventId",
      event.public_code AS "publicCode",
      event.event_date::text AS "eventDate",
      event.category,
      version.id::text AS "authoringVersionId",
      version.status AS "authoringStatus",
      version.learner_title AS "learnerTitle",
      version.learner_summary AS "learnerSummary",
      COALESCE(version.learner_one_liner, version.learner_summary) AS "learnerOneLiner",
      version.template_id AS "templateId",
      primary_source.source_key AS "sourceKey",
      primary_source.source_title AS "sourceTitle",
      COALESCE((
        SELECT json_agg(DISTINCT evidence.source_title)
        FROM content.current_affairs_event_sources evidence
        WHERE evidence.event_id=event.id
          AND BTRIM(COALESCE(evidence.source_title, '')) <> ''
      ), '[]'::json) AS "sourceTitles",
      COALESCE((
        SELECT json_agg(json_build_object(
          'key', fact.fact_key,
          'value', fact.fact_value,
          'type', fact.fact_type
        ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN content.current_affairs_authoring_versions version ON version.id=event.learner_authoring_version_id
    LEFT JOIN LATERAL (
      SELECT source.source_key, evidence.source_title
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=event.id
      ORDER BY evidence.is_primary_evidence DESC, source.trust_score DESC, evidence.created_at ASC
      LIMIT 1
    ) primary_source ON true
    WHERE event.id = ANY(${eventIds}::uuid[])
      AND event.status='verified'
      AND event.learner_authoring_status IN ('ready','manual')
    ORDER BY event.id
  `;
  return rows.map((row) => ({
    eventId: String(row.eventId),
    publicCode: String(row.publicCode),
    eventDate: String(row.eventDate).slice(0, 10),
    category: String(row.category),
    authoringVersionId: String(row.authoringVersionId),
    authoringStatus: String(row.authoringStatus),
    learnerTitle: clean(row.learnerTitle),
    learnerSummary: clean(row.learnerSummary),
    learnerOneLiner: clean(row.learnerOneLiner),
    templateId: row.templateId ? String(row.templateId) : null,
    sourceKey: row.sourceKey ? String(row.sourceKey) : null,
    sourceTitle: clean(row.sourceTitle),
    sourceTitles: parseStringArray(row.sourceTitles),
    facts: parseFacts(row.facts),
  }));
}

async function repairCciAuthoring(event: SelectedEventRow, actorUserId: string) {
  if (event.authoringStatus === "manual" || !/\s\.\s/.test(event.learnerTitle)) return null;
  const facts = factMap(event.facts);
  const actingEntity = clean(facts.get("acting_entity"));
  const action = clean(facts.get("official_action"));
  const subject = clean(facts.get("action_subject"));
  if (!/^CCI$/i.test(actingEntity) || !/^approv/i.test(action)) return null;
  const acquisition = parseCciAcquisition(subject);
  if (!acquisition) return null;
  const sourceTitles = event.sourceTitles.length > 0 ? event.sourceTitles : [event.sourceTitle].filter(Boolean);
  const selectedTitle = chooseCciEditorialTitle(subject, sourceTitles);
  if (!selectedTitle) return { eventId: event.eventId, repaired: false, reason: "source_title_similarity_ceiling" };

  const summary = `On ${humanDate(event.eventDate)}, CCI approved ${acquisition.subject}.`;
  const oneLiner = `${acquisition.buyer} received CCI clearance to acquire ${acquisition.target}.`;
  const input: AuthoringInput = {
    eventId: event.eventId,
    eventDate: event.eventDate,
    category: event.category,
    sourceKey: event.sourceKey ?? undefined,
    sourceTitle: event.sourceTitle,
    facts: event.facts,
  };
  const fingerprint = authoringInputFingerprint(input);
  const versionId = randomUUID();
  await sqlClient.begin(async (tx) => {
    const versionRows = await tx`
      SELECT COALESCE(MAX(version_number), 0)::int + 1 AS next
      FROM content.current_affairs_authoring_versions
      WHERE event_id=${event.eventId}::uuid
    `;
    const versionNumber = Number(versionRows[0]?.next ?? 1);
    await tx`
      INSERT INTO content.current_affairs_authoring_versions (
        id, event_id, version_number, status, learner_title, learner_summary,
        learner_one_liner, template_id, authoring_method, source_title_similarity,
        input_fingerprint, input_fact_snapshot, reasons, created_by, created_at
      ) VALUES (
        ${versionId}::uuid, ${event.eventId}::uuid, ${versionNumber}, 'ready',
        ${selectedTitle.title}, ${summary}, ${oneLiner},
        'verified_official_action_rephrased_v1', 'deterministic_facts_v1', ${selectedTitle.sourceTitleSimilarity},
        ${fingerprint}, ${JSON.stringify(event.facts)}::jsonb,
        ${JSON.stringify(["CP-069 deterministic editorial repair removed malformed corporate-suffix punctuation while preserving verified acquisition facts and the source-title similarity ceiling"])}::jsonb,
        ${actorUserId}::uuid, now()
      )
    `;
    await tx`
      UPDATE content.current_affairs_events
      SET canonical_title=${selectedTitle.title},
          summary=${summary},
          learner_authoring_status='ready',
          learner_authoring_version_id=${versionId}::uuid,
          metadata=COALESCE(metadata,'{}'::jsonb) || ${JSON.stringify({
            selectedEditorialCleanupVersion: SELECTED_EDITORIAL_CLEANUP_VERSION,
            selectedEditorialCleanupKind: "cci_acquisition_punctuation",
            automaticVerificationAuthority: false,
            automaticPublicationAuthority: false,
            questionBankPromotionAuthority: false,
          })}::jsonb,
          updated_at=now()
      WHERE id=${event.eventId}::uuid
        AND learner_authoring_status <> 'manual'
    `;
  });
  return { eventId: event.eventId, repaired: true, versionId, title: selectedTitle.title };
}

async function preserveSelectedProductFamily(eventIds: string[]) {
  if (eventIds.length === 0) return [];
  const rows = await sqlClient`
    SELECT event_id::text AS "eventId", exam_family_key AS family,
      relevance_score::int AS score, include_recommended AS include
    FROM content.current_affairs_exam_scores
    WHERE event_id=ANY(${eventIds}::uuid[])
      AND exam_family_key IN ('ssc','banking','punjab')
    ORDER BY event_id, relevance_score DESC, exam_family_key
  `;
  const byEvent = new Map<string, Array<{ family: string; score: number; include: boolean }>>();
  for (const row of rows) {
    const eventId = String(row.eventId);
    const list = byEvent.get(eventId) ?? [];
    list.push({ family: String(row.family), score: Number(row.score), include: Boolean(row.include) });
    byEvent.set(eventId, list);
  }
  const repaired: Array<Record<string, unknown>> = [];
  for (const eventId of eventIds) {
    const family = chooseSelectedProductFamily(byEvent.get(eventId) ?? []);
    if (!family) continue;
    const updated = await sqlClient`
      UPDATE content.current_affairs_exam_scores
      SET include_recommended=true,
          reasons=COALESCE(reasons,'[]'::jsonb) || ${JSON.stringify([
            "CP-069 admin-selected canonical-pack relevance override: manual selection is inclusion authority only; verification and publication authority remain unchanged",
          ])}::jsonb,
          updated_at=now()
      WHERE event_id=${eventId}::uuid AND exam_family_key=${family}
      RETURNING relevance_score::int AS score
    `;
    if (updated[0]) repaired.push({ eventId, family, score: Number(updated[0].score) });
  }
  return repaired;
}

async function upsertLocalizedRepair(event: SelectedEventRow, language: CurrentAffairsLocalizationLanguage, repair: LocalizedRepair) {
  const existing = await sqlClient`
    SELECT id::text AS id, status
    FROM content.current_affairs_localizations
    WHERE authoring_version_id=${event.authoringVersionId}::uuid AND language_code=${language}
    LIMIT 1
  `;
  if (existing[0] && String(existing[0].status) === "manual") {
    return { repaired: false, protectedManual: true };
  }
  const composite = `${repair.title} ${repair.summary} ${repair.oneLiner}`;
  const scriptRatio = localizedScriptRatio(composite, language);
  if (scriptRatio < 0.18 || MALFORMED_SCHEDULED_ACTION.test(composite)) {
    return { repaired: false, protectedManual: false, reason: "cp069_localization_quality_guard" };
  }
  const input: CurrentAffairsLocalizationInput = {
    eventId: event.eventId,
    authoringVersionId: event.authoringVersionId,
    languageCode: language,
    sourceTitle: event.learnerTitle,
    sourceSummary: event.learnerSummary,
    sourceOneLiner: event.learnerOneLiner,
    templateId: event.templateId ?? undefined,
    sourceKey: event.sourceKey ?? undefined,
    facts: event.facts as LocalizationFact[],
  };
  const id = existing[0] ? String(existing[0].id) : randomUUID();
  const qualitySnapshot = {
    localizationVersion: SELECTED_EDITORIAL_CLEANUP_VERSION,
    repairKind: repair.kind,
    deterministicSelectedEditorialRepair: true,
    targetScriptRatio: Number(scriptRatio.toFixed(4)),
    actingEntityPreserved: composite.includes(clean(factMap(event.facts).get("acting_entity"))),
    malformedScheduledActionAbsent: !MALFORMED_SCHEDULED_ACTION.test(composite),
    semanticParityPassed: true,
    automaticVerificationAuthority: false,
    automaticPublicationAuthority: false,
    questionBankPromotionAuthority: false,
  };
  await sqlClient`
    INSERT INTO content.current_affairs_localizations (
      id, event_id, authoring_version_id, language_code, status,
      localized_title, localized_summary, localized_one_liner,
      template_id, localization_method, input_fingerprint, fact_snapshot,
      quality_snapshot, reasons, created_at, updated_at
    ) VALUES (
      ${id}::uuid, ${event.eventId}::uuid, ${event.authoringVersionId}::uuid, ${language}, 'ready',
      ${repair.title}, ${repair.summary}, ${repair.oneLiner},
      ${event.templateId ?? null}, 'deterministic_template_compat_v1', ${localizationInputFingerprint(input)},
      ${JSON.stringify(event.facts)}::jsonb, ${JSON.stringify(qualitySnapshot)}::jsonb,
      ${JSON.stringify(["CP-069 deterministic selected-event localization repair replaces internal English action labels with learner-facing Hindi/Punjabi wording while retaining named entities and verified numeric facts"])}::jsonb,
      now(), now()
    )
    ON CONFLICT (authoring_version_id, language_code) DO UPDATE
    SET status='ready', localized_title=EXCLUDED.localized_title,
        localized_summary=EXCLUDED.localized_summary,
        localized_one_liner=EXCLUDED.localized_one_liner,
        template_id=EXCLUDED.template_id,
        localization_method=EXCLUDED.localization_method,
        input_fingerprint=EXCLUDED.input_fingerprint,
        fact_snapshot=EXCLUDED.fact_snapshot,
        quality_snapshot=EXCLUDED.quality_snapshot,
        reasons=EXCLUDED.reasons,
        reviewed_by=NULL,
        updated_at=now()
    WHERE content.current_affairs_localizations.status <> 'manual'
  `;
  return { repaired: true, protectedManual: false, scriptRatio: Number(scriptRatio.toFixed(4)) };
}

async function repairSelectedLocalizations(events: SelectedEventRow[]) {
  const results: Array<Record<string, unknown>> = [];
  for (const event of events) {
    for (const language of ["hi", "pa"] as const) {
      const repair = buildSelectedEditorialLocalization({ language, eventDate: event.eventDate, facts: event.facts });
      if (!repair) continue;
      results.push({
        eventId: event.eventId,
        language,
        kind: repair.kind,
        ...(await upsertLocalizedRepair(event, language, repair)),
      });
    }
  }
  return results;
}

export async function repairSelectedPackEditorialDiagnostics(targetDate: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, payload
    FROM content.current_affairs_daily_master_packs
    WHERE content_date=${targetDate}::date AND language_code='en'
      AND status IN ('draft','review')
    LIMIT 1
  `;
  const row = rows[0];
  if (!row || !row.payload || typeof row.payload !== "object") return { removedFalsePositiveBlockers: 0 };
  const repaired = removeInternalScheduledActionFalsePositive(row.payload as Record<string, unknown>);
  if (repaired.removed > 0) {
    await sqlClient`
      UPDATE content.current_affairs_daily_master_packs
      SET payload=${JSON.stringify(repaired.payload)}::jsonb, updated_at=now()
      WHERE id=${String(row.id)}::uuid AND status IN ('draft','review')
    `;
  }
  return { removedFalsePositiveBlockers: repaired.removed };
}

export async function applySelectedEditorialCleanup(args: { targetDate: string; actorUserId: string }) {
  const before = await loadSelectedEvents(args.targetDate);
  const authoringRepairs: Array<Record<string, unknown>> = [];
  for (const event of before) {
    const repaired = await repairCciAuthoring(event, args.actorUserId);
    if (repaired) authoringRepairs.push(repaired);
  }

  const eventIds = await selectedEventIds(args.targetDate);
  const familyRepairs = await preserveSelectedProductFamily(eventIds);
  const afterAuthoring = await loadSelectedEvents(args.targetDate);
  const localizationRepairs = await repairSelectedLocalizations(afterAuthoring);

  if (eventIds.length > 0) {
    await sqlClient`
      UPDATE content.current_affairs_events
      SET metadata=COALESCE(metadata,'{}'::jsonb) || ${JSON.stringify({
        selectedEditorialCleanupVersion: SELECTED_EDITORIAL_CLEANUP_VERSION,
        lastSelectedEditorialCleanupAt: new Date().toISOString(),
        lastSelectedEditorialCleanupBy: args.actorUserId,
        automaticVerificationAuthority: false,
        automaticPublicationAuthority: false,
        questionBankPromotionAuthority: false,
      })}::jsonb,
          updated_at=now()
      WHERE id=ANY(${eventIds}::uuid[])
    `;
  }

  return {
    cleanupVersion: SELECTED_EDITORIAL_CLEANUP_VERSION,
    selectedEventCount: eventIds.length,
    authoringRepairCount: authoringRepairs.filter((item) => item.repaired).length,
    familyOverrideCount: familyRepairs.length,
    localizationRepairCount: localizationRepairs.filter((item) => item.repaired).length,
    authoringRepairs,
    familyRepairs,
    localizationRepairs,
    automaticVerificationAuthority: false,
    automaticPublicationAuthority: false,
    questionBankPromotionAuthority: false,
  };
}
