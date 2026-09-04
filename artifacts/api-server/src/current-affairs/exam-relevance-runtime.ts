import { sqlClient } from "../lib/db";
import {
  scoreExamRelevance,
  type AtomicFactInput,
  type CurrentAffairsCategory,
  type EventCandidateInput,
} from "./core";

const PRODUCT_FAMILIES = ["ssc", "banking", "punjab"] as const;

type PendingScoreRow = {
  eventId: string;
  examFamily: string;
  relevanceScore: number;
  includeRecommended: boolean;
  reasons: string[];
};

function facts(value: unknown): AtomicFactInput[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const row = item as Record<string, unknown>;
    const key = String(row.key ?? "").trim();
    const factValue = String(row.value ?? "").trim();
    if (!key || !factValue) return [];
    return [{
      key,
      value: factValue,
      type: (row.type ? String(row.type) : "string") as AtomicFactInput["type"],
      confidence: Number(row.confidence ?? 0.8),
    }];
  });
}

export function manualSelectionFamily(scores: ReturnType<typeof scoreExamRelevance>) {
  return scores
    .filter((score) => (PRODUCT_FAMILIES as readonly string[]).includes(score.examFamily))
    .sort((a, b) => b.score - a.score || a.examFamily.localeCompare(b.examFamily))[0]?.examFamily ?? "ssc";
}

export async function refreshTargetDateExamRelevance(targetDate: string) {
  const rows = await sqlClient`
    SELECT
      event.id::text AS id,
      event.public_code AS "publicCode",
      event.canonical_title AS title,
      event.summary,
      event.importance_reason AS "importanceReason",
      event.event_date::text AS "eventDate",
      event.category,
      COALESCE((event.metadata->>'manualEditorialSelected')::boolean, false) AS "manualEditorialSelected",
      NULLIF(event.metadata->>'manualEditorialSelectionReason','') AS "manualEditorialSelectionReason",
      evidence.source_key AS "sourceKey",
      evidence.source_url AS "sourceUrl",
      evidence.source_title AS "sourceTitle",
      evidence.source_published_at::text AS "sourcePublishedAt",
      evidence.trust_score::float8 AS "sourceTrustScore",
      evidence.is_primary_evidence AS "isPrimarySource",
      COALESCE(fact_list.items, '[]'::json) AS facts
    FROM content.current_affairs_events event
    JOIN LATERAL (
      SELECT source.source_key, source.trust_score,
        event_source.source_url, event_source.source_title,
        event_source.source_published_at, event_source.is_primary_evidence
      FROM content.current_affairs_event_sources event_source
      JOIN content.current_affairs_sources source ON source.id=event_source.source_id
      WHERE event_source.event_id=event.id
        AND event_source.source_url IS NOT NULL
      ORDER BY event_source.is_primary_evidence DESC, source.trust_score DESC, event_source.created_at ASC
      LIMIT 1
    ) evidence ON true
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object(
        'key', fact.fact_key,
        'value', fact.fact_value,
        'type', fact.fact_type,
        'confidence', fact.confidence::float8
      ) ORDER BY fact.sort_order, fact.fact_key, fact.fact_value) AS items
      FROM content.current_affairs_facts fact
      WHERE fact.event_id=event.id AND fact.is_verified=true
    ) fact_list ON true
    WHERE event.event_date=${targetDate}::date
      AND event.status='verified'
      AND event.learner_authoring_status IN ('ready','manual')
    ORDER BY event.id
  `;

  let examined = 0;
  let updated = 0;
  let skippedMissingHttpsEvidence = 0;
  let manualSelectionOverridesPreserved = 0;
  const eligible: Record<"ssc" | "banking" | "punjab", number> = { ssc: 0, banking: 0, punjab: 0 };
  const pendingScores: PendingScoreRow[] = [];

  for (const row of rows) {
    examined += 1;
    const sourceUrl = String(row.sourceUrl ?? "").trim();
    if (!sourceUrl.startsWith("https://")) {
      skippedMissingHttpsEvidence += 1;
      continue;
    }
    const input: EventCandidateInput = {
      title: String(row.title),
      summary: String(row.summary ?? ""),
      importanceReason: String(row.importanceReason ?? ""),
      eventDate: String(row.eventDate).slice(0, 10),
      category: String(row.category) as CurrentAffairsCategory,
      sourceKey: String(row.sourceKey),
      sourceUrl,
      sourceTitle: String(row.sourceTitle ?? ""),
      sourcePublishedAt: row.sourcePublishedAt ? String(row.sourcePublishedAt) : undefined,
      sourceTrustScore: Number(row.sourceTrustScore ?? 0.7),
      isPrimarySource: Boolean(row.isPrimarySource),
      facts: facts(row.facts),
    };
    const scores = scoreExamRelevance(input);
    const manuallySelected = Boolean(row.manualEditorialSelected);
    const manualFamily = manuallySelected ? manualSelectionFamily(scores) : null;
    const manualReason = String(row.manualEditorialSelectionReason ?? "Admin-selected headline");
    if (manuallySelected) manualSelectionOverridesPreserved += 1;

    for (const score of scores) {
      const manualInclude = manuallySelected && score.examFamily === manualFamily;
      const effectiveInclude = score.includeRecommended || manualInclude;
      const reasons = [
        ...score.reasons,
        "CP-043 target-date relevance refresh",
        ...(manualInclude
          ? [`CP-050 admin relevance override preserved: ${manualReason}`]
          : []),
      ];
      pendingScores.push({
        eventId: String(row.id),
        examFamily: score.examFamily,
        relevanceScore: score.score,
        includeRecommended: effectiveInclude,
        reasons,
      });
      if ((score.examFamily === "ssc" || score.examFamily === "banking" || score.examFamily === "punjab")
        && effectiveInclude) {
        eligible[score.examFamily] += 1;
      }
    }
    updated += 1;
  }

  if (pendingScores.length > 0) {
    await sqlClient`
      WITH incoming AS (
        SELECT *
        FROM jsonb_to_recordset(${JSON.stringify(pendingScores)}::jsonb) AS score(
          "eventId" text,
          "examFamily" text,
          "relevanceScore" int,
          "includeRecommended" boolean,
          reasons jsonb
        )
      )
      INSERT INTO content.current_affairs_exam_scores (
        event_id, exam_family_key, relevance_score, include_recommended,
        reasons, created_at, updated_at
      )
      SELECT
        incoming."eventId"::uuid,
        incoming."examFamily",
        incoming."relevanceScore",
        incoming."includeRecommended",
        incoming.reasons,
        now(),
        now()
      FROM incoming
      ON CONFLICT (event_id, exam_family_key) DO UPDATE
      SET relevance_score=EXCLUDED.relevance_score,
          include_recommended=EXCLUDED.include_recommended,
          reasons=EXCLUDED.reasons,
          updated_at=now()
    `;
  }

  return {
    targetDate,
    examined,
    updated,
    scoreRowsUpserted: pendingScores.length,
    skippedMissingHttpsEvidence,
    manualSelectionOverridesPreserved,
    familyEligible: eligible,
    policyVersion: "cp050-human-selection-preserving-relevance-v1",
  };
}
