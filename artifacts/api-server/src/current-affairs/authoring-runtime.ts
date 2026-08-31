import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  scoreExamRelevance,
  type AtomicFactInput,
  type CurrentAffairsCategory,
  type EventCandidateInput,
} from "./core";
import {
  authorSourceIndependentEvent,
  titleSimilarity,
  type AuthoringFact,
  type AuthoringInput,
  type AuthoringOutput,
} from "./original-authoring";

const AUTHORING_VERSION = "ca-cp009-original-authoring-v1";
const TITLE_SIMILARITY_LIMIT = 0.72;

type EventAuthoringRow = {
  id: string;
  publicCode: string;
  title: string;
  summary: string;
  importanceReason: string;
  eventDate: string;
  category: string;
  authoringStatus: string;
  sourceKey: string;
  sourceUrl: string;
  sourceTitle: string;
  sourcePublishedAt?: string;
  sourceTrustScore: number;
  isPrimarySource: boolean;
  sourceTitles: string[];
  facts: Array<AuthoringFact & { confidence?: number }>;
};

function normalizeFacts(value: unknown): EventAuthoringRow["facts"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => item && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : {})
    .map((item) => ({
      key: String(item.key ?? "").trim(),
      value: String(item.value ?? "").trim(),
      type: item.type ? String(item.type) : undefined,
      confidence: Number(item.confidence ?? 0),
    }))
    .filter((item) => item.key && item.value);
}

function normalizeSourceTitles(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const titles: string[] = [];
  for (const item of value) {
    const title = String(item ?? "").replace(/\s+/g, " ").trim();
    const key = title.toLowerCase();
    if (!title || seen.has(key)) continue;
    seen.add(key);
    titles.push(title);
  }
  return titles.slice(0, 20);
}

async function loadAuthoringQueue(limit: number): Promise<EventAuthoringRow[]> {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.summary,
      event.importance_reason AS "importanceReason",
      event.event_date::text AS "eventDate",
      event.category,
      event.learner_authoring_status AS "authoringStatus",
      primary_source.source_key AS "sourceKey",
      primary_source.source_url AS "sourceUrl",
      primary_source.source_title AS "sourceTitle",
      primary_source.source_published_at AS "sourcePublishedAt",
      primary_source.trust_score::float8 AS "sourceTrustScore",
      primary_source.is_primary_source AS "isPrimarySource",
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
          'type', fact.fact_type,
          'confidence', fact.confidence::float8
        ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id
          AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN LATERAL (
      SELECT
        source.source_key,
        evidence.source_url,
        evidence.source_title,
        evidence.source_published_at,
        source.trust_score,
        evidence.is_primary_evidence AS is_primary_source
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=event.id
      ORDER BY evidence.is_primary_evidence DESC, source.trust_score DESC, evidence.created_at ASC
      LIMIT 1
    ) primary_source ON true
    WHERE event.status='verified'
      AND event.learner_authoring_status <> 'manual'
      AND COALESCE((event.metadata->>'autoPromoted')::boolean, false)=true
    ORDER BY event.event_date DESC, event.updated_at DESC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    importanceReason: String(row.importanceReason ?? ""),
    eventDate: String(row.eventDate).slice(0, 10),
    category: String(row.category),
    authoringStatus: String(row.authoringStatus ?? "pending"),
    sourceKey: String(row.sourceKey),
    sourceUrl: String(row.sourceUrl),
    sourceTitle: String(row.sourceTitle ?? row.title ?? ""),
    sourcePublishedAt: row.sourcePublishedAt ? String(row.sourcePublishedAt) : undefined,
    sourceTrustScore: Number(row.sourceTrustScore ?? 0.7),
    isPrimarySource: Boolean(row.isPrimarySource),
    sourceTitles: normalizeSourceTitles(row.sourceTitles),
    facts: normalizeFacts(row.facts),
  }));
}

function authoringInput(event: EventAuthoringRow): AuthoringInput {
  return {
    eventId: event.id,
    eventDate: event.eventDate,
    category: event.category,
    sourceKey: event.sourceKey,
    sourceTitle: event.sourceTitle,
    facts: event.facts,
  };
}

function enforceAllSourceTitleSimilarity(
  event: EventAuthoringRow,
  output: AuthoringOutput,
): AuthoringOutput {
  if (output.status !== "ready" || !output.title) return output;
  const evidenceTitles = event.sourceTitles.length > 0 ? event.sourceTitles : [event.sourceTitle];
  const maxSimilarity = evidenceTitles.reduce(
    (max, sourceTitle) => Math.max(max, titleSimilarity(output.title!, sourceTitle)),
    output.sourceTitleSimilarity,
  );
  if (maxSimilarity < TITLE_SIMILARITY_LIMIT) {
    return { ...output, sourceTitleSimilarity: Number(maxSimilarity.toFixed(4)) };
  }
  return {
    ...output,
    status: "needs_editorial",
    title: undefined,
    summary: undefined,
    oneLiner: undefined,
    sourceTitleSimilarity: Number(maxSimilarity.toFixed(4)),
    reasons: [...output.reasons, "Generated learner title is too similar to at least one evidence-source title"],
  };
}

async function latestVersion(eventId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, version_number AS "versionNumber",
           input_fingerprint AS "inputFingerprint", status
    FROM content.current_affairs_authoring_versions
    WHERE event_id=${eventId}::uuid
    ORDER BY version_number DESC
    LIMIT 1
  `;
  return rows[0] as Record<string, unknown> | undefined;
}

async function nextVersionNumber(tx: any, eventId: string): Promise<number> {
  const rows = await tx`
    SELECT COALESCE(MAX(version_number), 0)::int + 1 AS next
    FROM content.current_affairs_authoring_versions
    WHERE event_id=${eventId}::uuid
  `;
  return Number(rows[0]?.next ?? 1);
}

function scoreInput(event: EventAuthoringRow, output: AuthoringOutput): EventCandidateInput {
  return {
    title: String(output.title),
    summary: String(output.summary ?? ""),
    importanceReason: event.importanceReason,
    eventDate: event.eventDate,
    category: event.category as CurrentAffairsCategory,
    sourceKey: event.sourceKey,
    sourceUrl: event.sourceUrl,
    sourceTitle: event.sourceTitle,
    sourcePublishedAt: event.sourcePublishedAt,
    sourceTrustScore: event.sourceTrustScore,
    isPrimarySource: event.isPrimarySource,
    facts: event.facts.map((fact) => ({
      key: fact.key,
      value: fact.value,
      type: (fact.type ?? "string") as AtomicFactInput["type"],
      confidence: fact.confidence,
    })),
  };
}

async function storeAuthoringVersion(event: EventAuthoringRow, output: AuthoringOutput) {
  const versionId = randomUUID();
  await sqlClient.begin(async (tx) => {
    const versionNumber = await nextVersionNumber(tx, event.id);
    await tx`
      INSERT INTO content.current_affairs_authoring_versions (
        id, event_id, version_number, status, learner_title, learner_summary,
        learner_one_liner, template_id, authoring_method, source_title_similarity,
        input_fingerprint, input_fact_snapshot, reasons, created_at
      ) VALUES (
        ${versionId}::uuid, ${event.id}::uuid, ${versionNumber}, ${output.status},
        ${output.title ?? null}, ${output.summary ?? null}, ${output.oneLiner ?? null},
        ${output.templateId ?? null}, 'deterministic_facts_v1', ${output.sourceTitleSimilarity},
        ${output.inputFingerprint}, ${JSON.stringify(event.facts)}::jsonb,
        ${JSON.stringify(output.reasons)}::jsonb, now()
      )
    `;

    if (output.status === "ready") {
      const scores = scoreExamRelevance(scoreInput(event, output));
      await tx`
        UPDATE content.current_affairs_events
        SET canonical_title=${String(output.title)},
            summary=${String(output.summary)},
            learner_authoring_status='ready',
            learner_authoring_version_id=${versionId}::uuid,
            metadata=metadata || ${JSON.stringify({
              learnerAuthoringVersion: AUTHORING_VERSION,
              learnerOneLiner: output.oneLiner ?? null,
              learnerAuthoringTemplate: output.templateId ?? null,
              learnerAuthoringSourceTitleSimilarity: output.sourceTitleSimilarity,
              sourceIndependentLearnerCopy: true,
              eventFingerprintFrozenFromDiscovery: true,
            })}::jsonb,
            updated_at=now()
        WHERE id=${event.id}::uuid
      `;
      for (const score of scores) {
        await tx`
          INSERT INTO content.current_affairs_exam_scores (
            event_id, exam_family_key, relevance_score, include_recommended,
            reasons, created_at, updated_at
          ) VALUES (
            ${event.id}::uuid, ${score.examFamily}, ${score.score}, ${score.includeRecommended},
            ${JSON.stringify([...score.reasons, "Source-independent learner authoring passed"])}::jsonb,
            now(), now()
          )
          ON CONFLICT (event_id, exam_family_key) DO UPDATE
          SET relevance_score=EXCLUDED.relevance_score,
              include_recommended=EXCLUDED.include_recommended,
              reasons=EXCLUDED.reasons,
              updated_at=now()
        `;
      }
    } else {
      await tx`
        UPDATE content.current_affairs_events
        SET learner_authoring_status='needs_editorial',
            learner_authoring_version_id=${versionId}::uuid,
            metadata=metadata || ${JSON.stringify({
              learnerAuthoringVersion: AUTHORING_VERSION,
              learnerAuthoringNeedsEditorial: true,
              learnerAuthoringReasons: output.reasons,
              learnerAuthoringSourceTitleSimilarity: output.sourceTitleSimilarity,
              sourceIndependentLearnerCopy: false,
            })}::jsonb,
            updated_at=now()
        WHERE id=${event.id}::uuid
      `;
      await tx`
        UPDATE content.current_affairs_exam_scores
        SET include_recommended=false,
            reasons=COALESCE(reasons, '[]'::jsonb) || ${JSON.stringify(["Held from automatic compilation: source-independent learner authoring not ready"])}::jsonb,
            updated_at=now()
        WHERE event_id=${event.id}::uuid
      `;
    }
  });
  return versionId;
}

export async function runSourceIndependentAuthoring(limit = 200) {
  const safeLimit = Math.max(1, Math.min(500, Math.floor(limit)));
  const events = await loadAuthoringQueue(safeLimit);
  const results: Array<Record<string, unknown>> = [];

  for (const event of events) {
    const input = authoringInput(event);
    const raw = authorSourceIndependentEvent(input);
    const output = enforceAllSourceTitleSimilarity(event, raw);
    const latest = await latestVersion(event.id);
    if (latest && String(latest.inputFingerprint) === output.inputFingerprint) {
      results.push({
        eventId: event.id,
        publicCode: event.publicCode,
        status: "unchanged",
        authoringStatus: String(latest.status),
      });
      continue;
    }
    const versionId = await storeAuthoringVersion(event, output);
    results.push({
      eventId: event.id,
      publicCode: event.publicCode,
      status: output.status,
      versionId,
      templateId: output.templateId ?? null,
      sourceTitleSimilarity: output.sourceTitleSimilarity,
      reasons: output.reasons,
    });
  }

  return {
    examined: events.length,
    ready: results.filter((item) => item.status === "ready").length,
    needsEditorial: results.filter((item) => item.status === "needs_editorial").length,
    unchanged: results.filter((item) => item.status === "unchanged").length,
    results,
  };
}

export async function createManualAuthoringVersion(args: {
  eventId: string;
  title: string;
  summary: string;
  oneLiner?: string;
  reason: string;
  actorUserId: string;
}) {
  const eventRows = await sqlClient`
    SELECT
      event.id::text AS id, event.status, event.public_code AS "publicCode",
      event.event_date::text AS "eventDate", event.category,
      event.importance_reason AS "importanceReason",
      evidence.source_url AS "sourceUrl", evidence.source_title AS "sourceTitle",
      source.source_key AS "sourceKey", source.trust_score::float8 AS "sourceTrustScore",
      evidence.is_primary_evidence AS "isPrimarySource",
      COALESCE((
        SELECT json_agg(json_build_object(
          'key', fact.fact_key, 'value', fact.fact_value, 'type', fact.fact_type,
          'confidence', fact.confidence::float8
        ) ORDER BY fact.sort_order, fact.fact_key)
        FROM content.current_affairs_facts fact
        WHERE fact.event_id=event.id AND fact.is_verified=true
      ), '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN LATERAL (
      SELECT * FROM content.current_affairs_event_sources item
      WHERE item.event_id=event.id
      ORDER BY item.is_primary_evidence DESC, item.created_at ASC
      LIMIT 1
    ) evidence ON true
    JOIN content.current_affairs_sources source ON source.id=evidence.source_id
    WHERE event.id=${args.eventId}::uuid
    LIMIT 1
  `;
  const row = eventRows[0] as Record<string, unknown> | undefined;
  if (!row) throw new Error("Current Affairs event not found");
  if (String(row.status) !== "verified") throw new Error("Only verified Current Affairs events can receive learner wording");
  const title = args.title.replace(/\s+/g, " ").trim();
  const summary = args.summary.replace(/\s+/g, " ").trim();
  const oneLiner = String(args.oneLiner ?? "").replace(/\s+/g, " ").trim();
  if (title.length < 12 || title.length > 240) throw new Error("Learner title must contain 12 to 240 characters");
  if (summary.length < 20 || summary.length > 5000) throw new Error("Learner summary must contain 20 to 5000 characters");
  if (args.reason.trim().length < 8) throw new Error("Manual authoring requires an editorial reason");

  const facts = normalizeFacts(row.facts);
  const input: AuthoringInput = {
    eventId: String(row.id),
    eventDate: String(row.eventDate).slice(0, 10),
    category: String(row.category),
    sourceKey: String(row.sourceKey),
    sourceTitle: String(row.sourceTitle ?? ""),
    facts,
  };
  const manualFingerprint = authorSourceIndependentEvent(input).inputFingerprint;
  const versionId = randomUUID();
  const event: EventAuthoringRow = {
    id: String(row.id),
    publicCode: String(row.publicCode),
    title,
    summary,
    importanceReason: String(row.importanceReason ?? ""),
    eventDate: String(row.eventDate).slice(0, 10),
    category: String(row.category),
    authoringStatus: "manual",
    sourceKey: String(row.sourceKey),
    sourceUrl: String(row.sourceUrl),
    sourceTitle: String(row.sourceTitle ?? ""),
    sourceTrustScore: Number(row.sourceTrustScore ?? 0.7),
    isPrimarySource: Boolean(row.isPrimarySource),
    sourceTitles: [String(row.sourceTitle ?? "")],
    facts,
  };
  const scores = scoreExamRelevance({
    ...scoreInput(event, {
      status: "ready",
      title,
      summary,
      oneLiner: oneLiner || summary,
      templateId: "manual",
      sourceTitleSimilarity: titleSimilarity(title, String(row.sourceTitle ?? "")),
      reasons: [args.reason.trim()],
      inputFingerprint: manualFingerprint,
    }),
    title,
    summary,
  });

  await sqlClient.begin(async (tx) => {
    const versionNumber = await nextVersionNumber(tx, args.eventId);
    await tx`
      INSERT INTO content.current_affairs_authoring_versions (
        id, event_id, version_number, status, learner_title, learner_summary,
        learner_one_liner, template_id, authoring_method, source_title_similarity,
        input_fingerprint, input_fact_snapshot, reasons, created_by, created_at
      ) VALUES (
        ${versionId}::uuid, ${args.eventId}::uuid, ${versionNumber}, 'manual', ${title}, ${summary},
        ${oneLiner || null}, 'manual', 'manual', ${titleSimilarity(title, String(row.sourceTitle ?? ""))},
        ${manualFingerprint}, ${JSON.stringify(facts)}::jsonb, ${JSON.stringify([args.reason.trim()])}::jsonb,
        ${args.actorUserId}::uuid, now()
      )
    `;
    await tx`
      UPDATE content.current_affairs_events
      SET canonical_title=${title}, summary=${summary}, learner_authoring_status='manual',
          learner_authoring_version_id=${versionId}::uuid,
          metadata=metadata || ${JSON.stringify({
            learnerAuthoringVersion: AUTHORING_VERSION,
            learnerOneLiner: oneLiner || null,
            sourceIndependentLearnerCopy: true,
            manualLearnerAuthoring: true,
          })}::jsonb,
          updated_at=now()
      WHERE id=${args.eventId}::uuid
    `;
    for (const score of scores) {
      await tx`
        INSERT INTO content.current_affairs_exam_scores (
          event_id, exam_family_key, relevance_score, include_recommended, reasons, created_at, updated_at
        ) VALUES (
          ${args.eventId}::uuid, ${score.examFamily}, ${score.score}, ${score.includeRecommended},
          ${JSON.stringify([...score.reasons, "Manual learner authoring approved"])}::jsonb, now(), now()
        )
        ON CONFLICT (event_id, exam_family_key) DO UPDATE
        SET relevance_score=EXCLUDED.relevance_score,
            include_recommended=EXCLUDED.include_recommended,
            reasons=EXCLUDED.reasons,
            updated_at=now()
      `;
    }
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${args.actorUserId}::uuid,
        'current_affairs.authoring.manual', 'current_affairs_event', ${args.eventId}::uuid,
        ${args.reason.trim()}, 'Approved manual source-independent Current Affairs learner wording',
        ${JSON.stringify({ authoringVersionId: versionId, titleSimilarity: titleSimilarity(title, String(row.sourceTitle ?? "")) })}::jsonb
      )
    `;
  });

  return { eventId: args.eventId, versionId, status: "manual", title, summary };
}
