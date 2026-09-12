import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { isHighYieldDiscoveryCandidate } from "./editorial-priority";
import { classifyCurrentAffairsSignal } from "./ingestion";

export type DailyDiscoveryCensusInput = {
  rawCandidateCount: number;
  distinctSourceCount: number;
  distinctSourceFamilyCount: number;
  officialCandidateCount: number;
  trustedNewsCandidateCount: number;
  specialistCandidateCount: number;
  clusterCount: number;
  unresolvedClusterCount: number;
  eventCount: number;
  verifiedEventCount: number;
  reviewEventCount: number;
  authoringReadyCount: number;
  highPriorityUnresolvedCount: number;
  evidenceGrades: Record<"A" | "B" | "C" | "D", number>;
  eventCategoryCount: number;
};

export type DailyDiscoveryCensusEvaluation = {
  coverageConfidenceScore: number;
  status: "draft" | "review" | "complete" | "blocked";
  blockers: string[];
  warnings: string[];
};

export type HighYieldDiscoveryCandidateRow = {
  id: string;
  resolutionKey?: string | null;
  title: string;
  category?: string | null;
  resolvedIntoLearnerEvent?: boolean;
  linkedEventIds?: string[];
};

export type HighYieldDiscoveryGap = {
  resolutionKey: string;
  title: string;
  category: string;
  linkedEventIds: string[];
};

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.max(0, Math.min(1, numerator / denominator));
}

export function evaluateDailyDiscoveryCensus(input: DailyDiscoveryCensusInput): DailyDiscoveryCensusEvaluation {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (input.rawCandidateCount === 0) blockers.push("No target-date source candidates were discovered.");
  if (input.eventCount > 0 && input.verifiedEventCount === 0) blockers.push("Target-date events exist, but none is verified.");
  if (input.highPriorityUnresolvedCount > 0) {
    warnings.push(`${input.highPriorityUnresolvedCount} high-priority target-date event/discovery gap(s) still require verification, learner authoring, relevance recovery, or conflict resolution.`);
  }
  if (input.unresolvedClusterCount > 0) {
    warnings.push(`${input.unresolvedClusterCount} actionable target-date cluster(s) remain unresolved or uncategorized.`);
  }
  if (input.distinctSourceFamilyCount < 3) {
    warnings.push(`Discovery breadth is narrow: only ${input.distinctSourceFamilyCount} source family/families contributed target-date candidates.`);
  }
  if (input.trustedNewsCandidateCount === 0) {
    warnings.push("No trusted-news candidates were captured for the target date; discovery breadth currently relies on official/specialist sources.");
  }
  if (input.verifiedEventCount > 0 && input.authoringReadyCount === 0) {
    warnings.push("Verified events exist, but none has reached learner-authoring readiness.");
  }

  const sourceDiversity = Math.min(1, input.distinctSourceFamilyCount / 5);
  const verification = ratio(input.verifiedEventCount, Math.max(input.eventCount, 1));
  const authoring = ratio(input.authoringReadyCount, Math.max(input.verifiedEventCount, 1));
  const resolvedClusters = input.clusterCount === 0 ? (input.rawCandidateCount > 0 ? 0.5 : 0) : 1 - ratio(input.unresolvedClusterCount, input.clusterCount);
  const categoryBreadth = Math.min(1, input.eventCategoryCount / 6);
  const evidenceStrong = ratio(input.evidenceGrades.A + input.evidenceGrades.B, Math.max(input.eventCount, 1));

  const score = Math.round(
    sourceDiversity * 20
    + verification * 25
    + authoring * 15
    + resolvedClusters * 15
    + categoryBreadth * 15
    + evidenceStrong * 10,
  );

  // CP-045: "complete" means both cluster resolution and editorial-priority
  // resolution. A high-yield discovered story cannot disappear between discovery
  // and the learner-eligible event set merely because lower-value stories passed.
  const status: DailyDiscoveryCensusEvaluation["status"] = blockers.length > 0
    ? "blocked"
    : score >= 80 && input.highPriorityUnresolvedCount === 0 && input.unresolvedClusterCount === 0
      ? "complete"
      : warnings.length > 0
        ? "review"
        : "draft";

  return { coverageConfidenceScore: score, status, blockers, warnings };
}

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function evidenceGrade(event: {
  status: string;
  primarySourceCount: number;
  distinctSourceCount: number;
  hasOpenConflict: boolean;
}): "A" | "B" | "C" | "D" {
  if (event.hasOpenConflict) return "D";
  if (event.status === "verified" && event.primarySourceCount > 0) return "A";
  if (event.status === "verified" && event.distinctSourceCount >= 2) return "B";
  if (event.status === "review") return "C";
  return "D";
}

export function evaluateHighYieldDiscoveryGaps(rows: HighYieldDiscoveryCandidateRow[]): HighYieldDiscoveryGap[] {
  const grouped = new Map<string, {
    title: string;
    category: string;
    resolved: boolean;
    linkedEventIds: Set<string>;
    highYield: boolean;
  }>();

  for (const row of rows) {
    const resolutionKey = String(row.resolutionKey || row.id).trim();
    if (!resolutionKey) continue;
    const title = String(row.title ?? "").trim();
    if (!title) continue;
    const category = String(row.category || classifyCurrentAffairsSignal(title).category || "other");
    const highYield = isHighYieldDiscoveryCandidate({ title, category });
    const existing = grouped.get(resolutionKey) ?? {
      title,
      category,
      resolved: false,
      linkedEventIds: new Set<string>(),
      highYield: false,
    };
    existing.highYield ||= highYield;
    existing.resolved ||= Boolean(row.resolvedIntoLearnerEvent);
    for (const eventId of row.linkedEventIds ?? []) {
      const clean = String(eventId ?? "").trim();
      if (clean) existing.linkedEventIds.add(clean);
    }
    if (highYield) {
      existing.title = title;
      existing.category = category;
    }
    grouped.set(resolutionKey, existing);
  }

  return [...grouped.entries()]
    .filter(([, item]) => item.highYield && !item.resolved)
    .map(([resolutionKey, item]) => ({
      resolutionKey,
      title: item.title,
      category: item.category,
      linkedEventIds: [...item.linkedEventIds].sort(),
    }))
    .sort((a, b) => a.resolutionKey.localeCompare(b.resolutionKey));
}

export async function refreshDailyDiscoveryCensus(targetDate: string) {
  const [candidateRows, clusterRows, eventRows, sourceRows, categoryRows, priorityCandidateRows] = await Promise.all([
    sqlClient`
      SELECT
        count(*)::int AS "rawCandidateCount",
        count(DISTINCT candidate.source_id)::int AS "distinctSourceCount",
        count(DISTINCT COALESCE(source.source_family, source.source_key))::int AS "distinctSourceFamilyCount",
        count(*) FILTER (WHERE source.source_tier IN ('core_official','supplementary_official') OR source.is_primary_source=true)::int AS "officialCandidateCount",
        count(*) FILTER (WHERE source.source_tier='trusted_news')::int AS "trustedNewsCandidateCount",
        count(*) FILTER (WHERE source.source_tier='specialist')::int AS "specialistCandidateCount"
      FROM content.current_affairs_ingestion_candidates candidate
      JOIN content.current_affairs_sources source ON source.id=candidate.source_id
      WHERE COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
    `,
    sqlClient`
      SELECT
        count(*)::int AS "clusterCount",
        count(*) FILTER (
          WHERE cluster.status='open'
            AND EXISTS (
              SELECT 1
              FROM content.current_affairs_cluster_members actionable_member
              JOIN content.current_affairs_ingestion_candidates actionable_candidate
                ON actionable_candidate.id=actionable_member.candidate_id
              WHERE actionable_member.cluster_id=cluster.id
                AND actionable_candidate.status NOT IN ('rejected','error')
            )
        )::int AS "unresolvedClusterCount"
      FROM content.current_affairs_clusters cluster
      WHERE cluster.event_date_guess=${targetDate}::date
    `,
    sqlClient`
      SELECT
        event.id::text AS id,
        event.status,
        event.learner_authoring_status AS "authoringStatus",
        COALESCE(max(score.relevance_score),0)::int AS "maxExamScore",
        count(DISTINCT evidence.source_id)::int AS "distinctSourceCount",
        count(DISTINCT evidence.source_id) FILTER (WHERE source.is_primary_source=true)::int AS "primarySourceCount",
        bool_or(conflict.id IS NOT NULL) AS "hasOpenConflict"
      FROM content.current_affairs_events event
      LEFT JOIN content.current_affairs_exam_scores score ON score.event_id=event.id
      LEFT JOIN content.current_affairs_event_sources evidence ON evidence.event_id=event.id
      LEFT JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      LEFT JOIN content.current_affairs_fact_conflicts conflict ON conflict.event_id=event.id AND conflict.status='open'
      WHERE event.event_date=${targetDate}::date
        AND event.status IN ('review','verified')
      GROUP BY event.id
    `,
    sqlClient`
      SELECT
        source_tier AS "sourceTier",
        coverage_domain AS "coverageDomain",
        count(*)::int AS "registeredCount",
        count(*) FILTER (WHERE is_active=true)::int AS "activeCount",
        count(*) FILTER (WHERE is_active=true AND ingestion_mode <> 'manual')::int AS "automatedCount",
        count(*) FILTER (WHERE last_ingested_at >= now() - interval '6 hours' AND last_ingestion_status='success')::int AS "freshCount"
      FROM content.current_affairs_sources
      GROUP BY source_tier, coverage_domain
      ORDER BY source_tier, coverage_domain NULLS LAST
    `,
    sqlClient`
      SELECT category, count(*)::int AS count,
             count(*) FILTER (WHERE status='verified')::int AS "verifiedCount"
      FROM content.current_affairs_events
      WHERE event_date=${targetDate}::date
        AND status IN ('review','verified')
      GROUP BY category
      ORDER BY count(*) DESC, category
    `,
    sqlClient`
      SELECT
        candidate.id::text AS id,
        COALESCE(member.cluster_id::text, candidate.id::text) AS "resolutionKey",
        candidate.raw_title AS title,
        COALESCE(NULLIF(candidate.payload->>'categoryGuess',''), '') AS category,
        array_remove(array_agg(DISTINCT event.id::text), NULL) AS "linkedEventIds",
        bool_or(
          CASE WHEN event.id IS NULL THEN false ELSE
            event.status='verified'
            AND event.learner_authoring_status IN ('ready','manual')
            AND NOT EXISTS (
              SELECT 1 FROM content.current_affairs_fact_conflicts open_conflict
              WHERE open_conflict.event_id=event.id AND open_conflict.status='open'
            )
            AND EXISTS (
              SELECT 1 FROM content.current_affairs_exam_scores eligible_score
              WHERE eligible_score.event_id=event.id
                AND eligible_score.include_recommended=true
                AND eligible_score.exam_family_key IN ('ssc','banking','punjab')
            )
          END
        ) AS "resolvedIntoLearnerEvent"
      FROM content.current_affairs_ingestion_candidates candidate
      JOIN content.current_affairs_sources source ON source.id=candidate.source_id
      LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id=candidate.id
      LEFT JOIN content.current_affairs_event_candidates event_link ON event_link.candidate_id=candidate.id
      LEFT JOIN content.current_affairs_events event ON event.id=event_link.event_id
      WHERE COALESCE(
        NULLIF(candidate.payload->>'historicalTargetDate',''),
        NULLIF(candidate.payload->>'discoveryTargetDate',''),
        (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
      )=${targetDate}
        AND candidate.status NOT IN ('rejected','error')
        AND source.source_tier <> 'specialist'
        AND (source.is_primary_source=true OR source.trust_score >= 0.75)
      GROUP BY candidate.id, member.cluster_id
    `,
  ]);

  const candidates = candidateRows[0] ?? {};
  const clusters = clusterRows[0] ?? {};
  const evidenceGrades: Record<"A" | "B" | "C" | "D", number> = { A: 0, B: 0, C: 0, D: 0 };
  let verifiedEventCount = 0;
  let reviewEventCount = 0;
  let authoringReadyCount = 0;
  const highPriorityUnresolvedKeys = new Set<string>();

  for (const row of eventRows) {
    const event = {
      status: String(row.status),
      primarySourceCount: number(row.primarySourceCount),
      distinctSourceCount: number(row.distinctSourceCount),
      hasOpenConflict: Boolean(row.hasOpenConflict),
    };
    evidenceGrades[evidenceGrade(event)] += 1;
    if (event.status === "verified") verifiedEventCount += 1;
    if (event.status === "review") reviewEventCount += 1;
    if (event.status === "verified" && ["ready", "manual"].includes(String(row.authoringStatus))) authoringReadyCount += 1;
    if (number(row.maxExamScore) >= 65 && (
      event.status !== "verified"
      || event.hasOpenConflict
      || !["ready", "manual"].includes(String(row.authoringStatus))
    )) {
      highPriorityUnresolvedKeys.add(`event:${String(row.id)}`);
    }
  }

  const highYieldDiscoveryGaps = evaluateHighYieldDiscoveryGaps(priorityCandidateRows.map((row) => ({
    id: String(row.id),
    resolutionKey: row.resolutionKey ? String(row.resolutionKey) : String(row.id),
    title: String(row.title ?? ""),
    category: row.category ? String(row.category) : undefined,
    resolvedIntoLearnerEvent: Boolean(row.resolvedIntoLearnerEvent),
    linkedEventIds: Array.isArray(row.linkedEventIds) ? row.linkedEventIds.map(String) : [],
  })));
  for (const gap of highYieldDiscoveryGaps) {
    const linkedEventId = gap.linkedEventIds[0];
    highPriorityUnresolvedKeys.add(linkedEventId ? `event:${linkedEventId}` : `discovery:${gap.resolutionKey}`);
  }
  const highPriorityUnresolvedCount = highPriorityUnresolvedKeys.size;

  const sourceDomains: Record<string, Record<string, number>> = {};
  const sourceTiers: Record<string, Record<string, number>> = {};
  for (const row of sourceRows) {
    const domain = String(row.coverageDomain ?? "unassigned");
    const tier = String(row.sourceTier ?? "unknown");
    sourceDomains[domain] ??= { registered: 0, active: 0, automated: 0, fresh: 0 };
    sourceTiers[tier] ??= { registered: 0, active: 0, automated: 0, fresh: 0 };
    for (const target of [sourceDomains[domain], sourceTiers[tier]]) {
      target.registered += number(row.registeredCount);
      target.active += number(row.activeCount);
      target.automated += number(row.automatedCount);
      target.fresh += number(row.freshCount);
    }
  }

  const eventCategories = Object.fromEntries(categoryRows.map((row) => [String(row.category), {
    events: number(row.count),
    verified: number(row.verifiedCount),
  }]));

  const input: DailyDiscoveryCensusInput = {
    rawCandidateCount: number(candidates.rawCandidateCount),
    distinctSourceCount: number(candidates.distinctSourceCount),
    distinctSourceFamilyCount: number(candidates.distinctSourceFamilyCount),
    officialCandidateCount: number(candidates.officialCandidateCount),
    trustedNewsCandidateCount: number(candidates.trustedNewsCandidateCount),
    specialistCandidateCount: number(candidates.specialistCandidateCount),
    clusterCount: number(clusters.clusterCount),
    unresolvedClusterCount: number(clusters.unresolvedClusterCount),
    eventCount: eventRows.length,
    verifiedEventCount,
    reviewEventCount,
    authoringReadyCount,
    highPriorityUnresolvedCount,
    evidenceGrades,
    eventCategoryCount: categoryRows.length,
  };
  const evaluation = evaluateDailyDiscoveryCensus(input);
  const id = randomUUID();
  const highYieldGapSnapshot = {
    count: highYieldDiscoveryGaps.length,
    samples: highYieldDiscoveryGaps.slice(0, 20).map((gap) => ({
      title: gap.title,
      category: gap.category,
      linkedEventIds: gap.linkedEventIds,
    })),
  };

  const rows = await sqlClient`
    INSERT INTO content.current_affairs_daily_discovery_census (
      id, target_date, status, coverage_confidence_score,
      raw_candidate_count, distinct_source_count, distinct_source_family_count,
      official_candidate_count, trusted_news_candidate_count, specialist_candidate_count,
      cluster_count, unresolved_cluster_count, event_count, verified_event_count,
      review_event_count, authoring_ready_count, high_priority_unresolved_count,
      domain_snapshot, source_snapshot, evidence_snapshot, blockers, warnings,
      generated_at, created_at, updated_at
    ) VALUES (
      ${id}::uuid, ${targetDate}::date, ${evaluation.status}, ${evaluation.coverageConfidenceScore},
      ${input.rawCandidateCount}, ${input.distinctSourceCount}, ${input.distinctSourceFamilyCount},
      ${input.officialCandidateCount}, ${input.trustedNewsCandidateCount}, ${input.specialistCandidateCount},
      ${input.clusterCount}, ${input.unresolvedClusterCount}, ${input.eventCount}, ${input.verifiedEventCount},
      ${input.reviewEventCount}, ${input.authoringReadyCount}, ${input.highPriorityUnresolvedCount},
      ${JSON.stringify({ sourceDomains, eventCategories })}::jsonb,
      ${JSON.stringify({ sourceTiers })}::jsonb,
      ${JSON.stringify({ grades: evidenceGrades, highYieldDiscoveryGaps: highYieldGapSnapshot })}::jsonb,
      ${JSON.stringify(evaluation.blockers)}::jsonb,
      ${JSON.stringify(evaluation.warnings)}::jsonb,
      now(), now(), now()
    )
    ON CONFLICT (target_date) DO UPDATE SET
      status=EXCLUDED.status,
      coverage_confidence_score=EXCLUDED.coverage_confidence_score,
      raw_candidate_count=EXCLUDED.raw_candidate_count,
      distinct_source_count=EXCLUDED.distinct_source_count,
      distinct_source_family_count=EXCLUDED.distinct_source_family_count,
      official_candidate_count=EXCLUDED.official_candidate_count,
      trusted_news_candidate_count=EXCLUDED.trusted_news_candidate_count,
      specialist_candidate_count=EXCLUDED.specialist_candidate_count,
      cluster_count=EXCLUDED.cluster_count,
      unresolved_cluster_count=EXCLUDED.unresolved_cluster_count,
      event_count=EXCLUDED.event_count,
      verified_event_count=EXCLUDED.verified_event_count,
      review_event_count=EXCLUDED.review_event_count,
      authoring_ready_count=EXCLUDED.authoring_ready_count,
      high_priority_unresolved_count=EXCLUDED.high_priority_unresolved_count,
      domain_snapshot=EXCLUDED.domain_snapshot,
      source_snapshot=EXCLUDED.source_snapshot,
      evidence_snapshot=EXCLUDED.evidence_snapshot,
      blockers=EXCLUDED.blockers,
      warnings=EXCLUDED.warnings,
      generated_at=now(), updated_at=now()
    RETURNING id::text AS id, target_date::text AS "targetDate", status,
      coverage_confidence_score::int AS "coverageConfidenceScore", generated_at::text AS "generatedAt"
  `;

  return {
    ...(rows[0] ?? { id, targetDate, status: evaluation.status, coverageConfidenceScore: evaluation.coverageConfidenceScore }),
    ...input,
    domainSnapshot: { sourceDomains, eventCategories },
    sourceSnapshot: { sourceTiers },
    evidenceSnapshot: { grades: evidenceGrades, highYieldDiscoveryGaps: highYieldGapSnapshot },
    blockers: evaluation.blockers,
    warnings: evaluation.warnings,
  };
}

export async function loadDailyDiscoveryCensus(targetDate: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, target_date::text AS "targetDate", status,
      coverage_confidence_score::int AS "coverageConfidenceScore",
      raw_candidate_count::int AS "rawCandidateCount",
      distinct_source_count::int AS "distinctSourceCount",
      distinct_source_family_count::int AS "distinctSourceFamilyCount",
      official_candidate_count::int AS "officialCandidateCount",
      trusted_news_candidate_count::int AS "trustedNewsCandidateCount",
      specialist_candidate_count::int AS "specialistCandidateCount",
      cluster_count::int AS "clusterCount", unresolved_cluster_count::int AS "unresolvedClusterCount",
      event_count::int AS "eventCount", verified_event_count::int AS "verifiedEventCount",
      review_event_count::int AS "reviewEventCount", authoring_ready_count::int AS "authoringReadyCount",
      high_priority_unresolved_count::int AS "highPriorityUnresolvedCount",
      domain_snapshot AS "domainSnapshot", source_snapshot AS "sourceSnapshot",
      evidence_snapshot AS "evidenceSnapshot", blockers, warnings,
      generated_at::text AS "generatedAt"
    FROM content.current_affairs_daily_discovery_census
    WHERE target_date=${targetDate}::date
    LIMIT 1
  `;
  return rows[0] ?? null;
}
