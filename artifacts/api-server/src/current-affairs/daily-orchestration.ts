import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import {
  canAutoVerify,
  currentAffairsFingerprint,
  publicCurrentAffairsCode,
  scoreExamRelevance,
  type CurrentAffairsCategory,
  type EventCandidateInput,
} from "./core";
import { classifyCurrentAffairsSignal } from "./ingestion";
import {
  buildCandidateClusters,
  extractHeadlineFactClaims,
  publicClusterCode,
  reconcileFactClaims,
  sameEventSimilarity,
  type ClaimEvidence,
  type IntelligenceCandidate,
  type ReconciledFact,
} from "./intelligence";
import {
  generateCurrentAffairsQuestions,
  renderCompilationMarkdown,
  type CurrentAffairsContentEvent,
  type CurrentAffairsFact,
  type CurrentAffairsGeneratedQuestion,
} from "./content";
import { scheduleSlotStart } from "./automation";
import {
  automationImportanceReason,
  canAutoPromoteCluster,
  canAutoVerifyEvent,
  previousIndiaDate,
} from "./orchestration-policy";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const AUTO_CLUSTER_THRESHOLD = 0.58;
const DAILY_EXAM_FAMILIES = ["ssc", "banking", "punjab"] as const;

type PromotionResult = {
  eventId: string;
  created: boolean;
  verified: boolean;
};

function candidateFromRow(row: Record<string, any>): IntelligenceCandidate {
  const payload = row.payload && typeof row.payload === "object" ? row.payload : {};
  const classified = classifyCurrentAffairsSignal(String(row.title ?? ""));
  const keywords = Array.isArray(payload.discoveryKeywords)
    ? payload.discoveryKeywords.map(String).map((item: string) => item.trim()).filter(Boolean).slice(0, 20)
    : classified.keywords;
  return {
    id: String(row.id),
    title: String(row.title),
    sourceKey: String(row.sourceKey),
    sourceId: String(row.sourceId),
    sourceUrl: row.sourceUrl ? String(row.sourceUrl) : null,
    publishedAt: row.publishedAt ? String(row.publishedAt) : null,
    categoryGuess: (payload.categoryGuess || classified.category) as CurrentAffairsCategory,
    keywords,
    trustScore: Number(row.trustScore ?? 0.5),
    isPrimarySource: Boolean(row.isPrimarySource),
  };
}

async function loadQueuedCandidates(limit = 500) {
  const rows = await sqlClient`
    SELECT candidate.id::text AS id, candidate.raw_title AS title,
           candidate.source_url AS "sourceUrl", candidate.published_at AS "publishedAt",
           candidate.payload, source.id::text AS "sourceId", source.source_key AS "sourceKey",
           source.trust_score::float8 AS "trustScore", source.is_primary_source AS "isPrimarySource"
    FROM content.current_affairs_ingestion_candidates candidate
    JOIN content.current_affairs_sources source ON source.id = candidate.source_id
    LEFT JOIN content.current_affairs_cluster_members member ON member.candidate_id = candidate.id
    WHERE candidate.status = 'queued' AND member.candidate_id IS NULL
    ORDER BY candidate.published_at DESC NULLS LAST, candidate.created_at DESC
    LIMIT ${limit}
  `;
  return rows.map((row) => candidateFromRow(row as Record<string, any>));
}

async function loadOpenClusterRepresentatives() {
  const rows = await sqlClient`
    SELECT cluster.id::text AS "clusterId",
           candidate.id::text AS id, candidate.raw_title AS title,
           candidate.source_url AS "sourceUrl", candidate.published_at AS "publishedAt",
           candidate.payload, source.id::text AS "sourceId", source.source_key AS "sourceKey",
           source.trust_score::float8 AS "trustScore", source.is_primary_source AS "isPrimarySource"
    FROM content.current_affairs_clusters cluster
    JOIN content.current_affairs_cluster_members member
      ON member.cluster_id = cluster.id AND member.member_role = 'representative'
    JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id = member.candidate_id
    JOIN content.current_affairs_sources source ON source.id = candidate.source_id
    WHERE cluster.status = 'open'
    ORDER BY cluster.event_date_guess DESC
    LIMIT 1000
  `;
  return rows.map((row) => ({
    clusterId: String(row.clusterId),
    candidate: candidateFromRow(row as Record<string, any>),
  }));
}

async function insertClaims(clusterId: string, candidate: IntelligenceCandidate) {
  let inserted = 0;
  for (const claim of extractHeadlineFactClaims(candidate.title)) {
    const rows = await sqlClient`
      INSERT INTO content.current_affairs_fact_claims (
        id, cluster_id, candidate_id, source_id, fact_key, fact_value,
        normalized_value, fact_type, confidence, extraction_method,
        is_primary_evidence, metadata, created_at
      ) VALUES (
        ${randomUUID()}::uuid, ${clusterId}::uuid, ${candidate.id}::uuid,
        ${candidate.sourceId ?? null}::uuid, ${claim.factKey}, ${claim.factValue},
        ${claim.normalizedValue}, ${claim.factType}, ${claim.confidence}, ${claim.extractionMethod},
        ${Boolean(candidate.isPrimarySource)},
        ${JSON.stringify({ source: "headline", intelligenceVersion: "ca-cp006-auto" })}::jsonb,
        now()
      )
      ON CONFLICT (candidate_id, fact_key, normalized_value) DO NOTHING
      RETURNING id
    `;
    if (rows[0]) inserted += 1;
  }
  return inserted;
}

async function attachCandidate(clusterId: string, candidate: IntelligenceCandidate, similarity: number) {
  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.current_affairs_cluster_members (
        cluster_id, candidate_id, similarity_score, member_role, created_at
      ) VALUES (${clusterId}::uuid, ${candidate.id}::uuid, ${similarity}, 'supporting', now())
      ON CONFLICT DO NOTHING
    `;
    await tx`
      UPDATE content.current_affairs_ingestion_candidates
      SET status='clustered', updated_at=now()
      WHERE id=${candidate.id}::uuid
    `;
    await tx`
      UPDATE content.current_affairs_clusters
      SET confidence=GREATEST(confidence, ${similarity}), updated_at=now()
      WHERE id=${clusterId}::uuid
    `;
  });
  await insertClaims(clusterId, candidate);
}

async function clusterQueuedCandidates() {
  const candidates = await loadQueuedCandidates();
  const existing = await loadOpenClusterRepresentatives();
  const unassigned: IntelligenceCandidate[] = [];
  let attached = 0;

  for (const candidate of candidates) {
    let best: { clusterId: string; similarity: number } | null = null;
    for (const cluster of existing) {
      const similarity = sameEventSimilarity(candidate, cluster.candidate);
      if (similarity >= AUTO_CLUSTER_THRESHOLD && (!best || similarity > best.similarity)) {
        best = { clusterId: cluster.clusterId, similarity };
      }
    }
    if (best) {
      await attachCandidate(best.clusterId, candidate, best.similarity);
      attached += 1;
    } else {
      unassigned.push(candidate);
    }
  }

  const drafts = buildCandidateClusters(unassigned, AUTO_CLUSTER_THRESHOLD);
  let created = 0;
  for (const draft of drafts) {
    const inserted = await sqlClient`
      INSERT INTO content.current_affairs_clusters (
        id, public_code, representative_title, category_guess, event_date_guess,
        cluster_fingerprint, confidence, status, metadata, created_at, updated_at
      ) VALUES (
        ${draft.id}::uuid, ${publicClusterCode(draft.eventDateGuess)}, ${draft.representative.title},
        ${draft.categoryGuess}, ${draft.eventDateGuess}, ${draft.fingerprint}, ${draft.confidence},
        'open', ${JSON.stringify({ threshold: AUTO_CLUSTER_THRESHOLD, intelligenceVersion: "ca-cp006-auto" })}::jsonb,
        now(), now()
      )
      ON CONFLICT (cluster_fingerprint) DO NOTHING
      RETURNING id
    `;
    if (!inserted[0]) continue;
    created += 1;
    for (const member of draft.members) {
      await sqlClient`
        INSERT INTO content.current_affairs_cluster_members (
          cluster_id, candidate_id, similarity_score, member_role, created_at
        ) VALUES (
          ${draft.id}::uuid, ${member.candidate.id}::uuid, ${member.similarity},
          ${member.candidate.id === draft.representative.id ? "representative" : "supporting"}, now()
        )
        ON CONFLICT DO NOTHING
      `;
      await sqlClient`
        UPDATE content.current_affairs_ingestion_candidates
        SET status='clustered', updated_at=now()
        WHERE id=${member.candidate.id}::uuid
      `;
      await insertClaims(draft.id, member.candidate);
    }
  }

  return { queuedSeen: candidates.length, attached, created };
}

async function loadPromotionProfiles() {
  const rows = await sqlClient`
    SELECT
      cluster.id::text AS id,
      cluster.category_guess AS category,
      cluster.confidence::float8 AS confidence,
      COUNT(member.candidate_id)::int AS "memberCount",
      COUNT(DISTINCT candidate.source_id)::int AS "distinctSourceCount",
      COUNT(*) FILTER (WHERE source.is_primary_source)::int AS "primarySourceCount",
      COUNT(DISTINCT candidate.source_id) FILTER (WHERE source.trust_score >= 0.75)::int AS "highTrustSourceCount",
      COUNT(*) FILTER (WHERE candidate.source_url IS NOT NULL)::int AS "urlEvidenceCount",
      COUNT(*) FILTER (WHERE candidate.source_url IS NOT NULL AND source.is_primary_source)::int AS "primaryUrlEvidenceCount",
      COALESCE(MAX(source.trust_score), 0)::float8 AS "maxTrustScore"
    FROM content.current_affairs_clusters cluster
    JOIN content.current_affairs_cluster_members member ON member.cluster_id=cluster.id
    JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id=member.candidate_id
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE cluster.status='open'
    GROUP BY cluster.id
    ORDER BY cluster.event_date_guess DESC, cluster.confidence DESC
    LIMIT 300
  `;
  return rows.map((row) => ({
    id: String(row.id),
    confidence: Number(row.confidence ?? 0),
    category: String(row.category),
    memberCount: Number(row.memberCount ?? 0),
    distinctSourceCount: Number(row.distinctSourceCount ?? 0),
    primarySourceCount: Number(row.primarySourceCount ?? 0),
    highTrustSourceCount: Number(row.highTrustSourceCount ?? 0),
    urlEvidenceCount: Number(row.urlEvidenceCount ?? 0),
    primaryUrlEvidenceCount: Number(row.primaryUrlEvidenceCount ?? 0),
    maxTrustScore: Number(row.maxTrustScore ?? 0),
  }));
}

async function loadCluster(clusterId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, representative_title AS title,
           category_guess AS category, event_date_guess::text AS "eventDate",
           confidence::float8 AS confidence, status
    FROM content.current_affairs_clusters
    WHERE id=${clusterId}::uuid LIMIT 1
  `;
  if (!rows[0]) return null;
  const members = await sqlClient`
    SELECT candidate.id::text AS id, candidate.raw_title AS title,
           candidate.source_url AS "sourceUrl", candidate.published_at AS "publishedAt",
           source.id::text AS "sourceId", source.source_key AS "sourceKey",
           source.trust_score::float8 AS "trustScore", source.is_primary_source AS "isPrimarySource",
           member.member_role AS role, member.similarity_score::float8 AS similarity
    FROM content.current_affairs_cluster_members member
    JOIN content.current_affairs_ingestion_candidates candidate ON candidate.id=member.candidate_id
    JOIN content.current_affairs_sources source ON source.id=candidate.source_id
    WHERE member.cluster_id=${clusterId}::uuid
    ORDER BY source.is_primary_source DESC, source.trust_score DESC,
             CASE WHEN member.member_role='representative' THEN 0 ELSE 1 END
  `;
  return { ...rows[0], members } as Record<string, any>;
}

async function eventClaims(eventId: string): Promise<ClaimEvidence[]> {
  const rows = await sqlClient`
    SELECT claim.fact_key AS "factKey", claim.fact_value AS "factValue",
           claim.normalized_value AS "normalizedValue", claim.fact_type AS "factType",
           claim.confidence::float8 AS confidence, claim.extraction_method AS "extractionMethod",
           claim.candidate_id::text AS "candidateId", source.source_key AS "sourceKey",
           source.id::text AS "sourceId", source.trust_score::float8 AS "trustScore",
           claim.is_primary_evidence AS "isPrimaryEvidence"
    FROM content.current_affairs_fact_claims claim
    LEFT JOIN content.current_affairs_sources source ON source.id=claim.source_id
    WHERE claim.event_id=${eventId}::uuid
  `;
  return rows.map((row) => ({
    factKey: String(row.factKey),
    factValue: String(row.factValue),
    normalizedValue: String(row.normalizedValue),
    factType: String(row.factType) as ClaimEvidence["factType"],
    confidence: Number(row.confidence ?? 0.5),
    extractionMethod: String(row.extractionMethod) as ClaimEvidence["extractionMethod"],
    candidateId: row.candidateId ? String(row.candidateId) : undefined,
    sourceKey: row.sourceKey ? String(row.sourceKey) : undefined,
    sourceId: row.sourceId ? String(row.sourceId) : undefined,
    trustScore: Number(row.trustScore ?? 0.5),
    isPrimaryEvidence: Boolean(row.isPrimaryEvidence),
  }));
}

async function materializeFact(eventId: string, fact: ReconciledFact) {
  await sqlClient`
    INSERT INTO content.current_affairs_facts (
      id, event_id, fact_key, fact_value, fact_type, is_verified, confidence,
      sort_order, reconciliation_status, support_count, primary_support_count,
      provenance, created_at, updated_at
    ) VALUES (
      ${randomUUID()}::uuid, ${eventId}::uuid, ${fact.factKey}, ${fact.factValue}, ${fact.factType},
      false, ${fact.confidence}, 0, ${fact.reconciliationStatus}, ${fact.supportCount},
      ${fact.primarySupportCount}, ${JSON.stringify(fact.provenance)}::jsonb, now(), now()
    )
    ON CONFLICT (event_id, fact_key, fact_value) DO UPDATE
    SET confidence=EXCLUDED.confidence,
        support_count=EXCLUDED.support_count,
        primary_support_count=EXCLUDED.primary_support_count,
        reconciliation_status=EXCLUDED.reconciliation_status,
        provenance=EXCLUDED.provenance,
        updated_at=now()
  `;
}

async function reconcileEvent(eventId: string) {
  const result = reconcileFactClaims(await eventClaims(eventId));
  await sqlClient`
    DELETE FROM content.current_affairs_fact_conflicts
    WHERE event_id=${eventId}::uuid AND status IN ('open', 'auto_resolved')
  `;
  for (const fact of result.facts) await materializeFact(eventId, fact);
  for (const conflict of result.conflicts) {
    await sqlClient`
      INSERT INTO content.current_affairs_fact_conflicts (
        id, event_id, fact_key, competing_values, status, preferred_value,
        resolution_reason, resolved_at, created_at, updated_at
      ) VALUES (
        ${randomUUID()}::uuid, ${eventId}::uuid, ${conflict.factKey},
        ${JSON.stringify(conflict.values)}::jsonb,
        ${conflict.autoResolution ? "auto_resolved" : "open"},
        ${conflict.autoResolution?.factValue ?? null}, ${conflict.resolutionReason ?? null},
        ${conflict.autoResolution ? new Date().toISOString() : null}, now(), now()
      )
    `;
  }
  return result;
}

async function attemptAutoVerification(eventId: string) {
  const eventRows = await sqlClient`
    SELECT status FROM content.current_affairs_events WHERE id=${eventId}::uuid LIMIT 1
  `;
  if (!eventRows[0] || String(eventRows[0].status) === "verified") return false;

  const [evidence, facts, conflicts] = await Promise.all([
    sqlClient`
      SELECT evidence.is_primary_evidence AS "isPrimaryEvidence",
             source.trust_score::float8 AS "trustScore"
      FROM content.current_affairs_event_sources evidence
      JOIN content.current_affairs_sources source ON source.id=evidence.source_id
      WHERE evidence.event_id=${eventId}::uuid
    `,
    sqlClient`
      SELECT confidence::float8 AS confidence
      FROM content.current_affairs_facts WHERE event_id=${eventId}::uuid
    `,
    sqlClient`
      SELECT COUNT(*)::int AS count
      FROM content.current_affairs_fact_conflicts
      WHERE event_id=${eventId}::uuid AND status='open'
    `,
  ]);
  const decision = canAutoVerify({
    evidence: evidence.map((row) => ({
      isPrimaryEvidence: Boolean(row.isPrimaryEvidence),
      trustScore: Number(row.trustScore ?? 0),
    })),
    factConfidences: facts.map((row) => Number(row.confidence ?? 0)),
  });
  const policy = canAutoVerifyEvent({
    verificationGateAllowed: decision.allowed,
    verificationConfidence: decision.confidence,
    verifiedFactCount: facts.length,
    openConflictCount: Number(conflicts[0]?.count ?? 0),
    evidenceCount: evidence.length,
    primaryEvidenceCount: evidence.filter((row) => Boolean(row.isPrimaryEvidence)).length,
  });
  if (!policy.allowed) return false;

  await sqlClient.begin(async (tx) => {
    await tx`
      UPDATE content.current_affairs_events
      SET status='verified', verification_confidence=${decision.confidence},
          metadata = metadata || ${JSON.stringify({ autoVerifiedBy: "ca-cp006", autoVerificationReason: policy.reason })}::jsonb,
          updated_at=now()
      WHERE id=${eventId}::uuid
    `;
    await tx`
      UPDATE content.current_affairs_facts
      SET is_verified=true, updated_at=now()
      WHERE event_id=${eventId}::uuid
    `;
  });
  return true;
}

async function promoteCluster(clusterId: string): Promise<PromotionResult | null> {
  const cluster = await loadCluster(clusterId);
  if (!cluster || String(cluster.status) !== "open") return null;
  const members = Array.isArray(cluster.members) ? cluster.members as Record<string, any>[] : [];
  const evidenceMember = members.find((member) => member.isPrimarySource && member.sourceUrl)
    ?? members.find((member) => member.sourceUrl);
  if (!evidenceMember?.sourceUrl) return null;

  const title = String(cluster.title);
  const eventDate = String(cluster.eventDate).slice(0, 10);
  const category = String(cluster.category) as CurrentAffairsCategory;
  const importanceReason = automationImportanceReason(category);
  const sourceUrl = String(evidenceMember.sourceUrl);
  const sourceKey = String(evidenceMember.sourceKey);
  const fingerprint = currentAffairsFingerprint({ title, eventDate, category });

  const existing = await sqlClient`
    SELECT id::text AS id, status
    FROM content.current_affairs_events
    WHERE event_fingerprint=${fingerprint}
    LIMIT 1
  `;
  let eventId: string;
  let created = false;

  if (existing[0]) {
    eventId = String(existing[0].id);
    await sqlClient.begin(async (tx) => {
      for (const member of members) {
        await tx`
          INSERT INTO content.current_affairs_event_candidates (event_id, candidate_id, cluster_id, created_at)
          VALUES (${eventId}::uuid, ${String(member.id)}::uuid, ${clusterId}::uuid, now())
          ON CONFLICT DO NOTHING
        `;
        if (member.sourceUrl) {
          await tx`
            INSERT INTO content.current_affairs_event_sources (
              event_id, source_id, source_url, source_title, source_published_at,
              is_primary_evidence, evidence_confidence, metadata, created_at
            ) VALUES (
              ${eventId}::uuid, ${String(member.sourceId)}::uuid, ${String(member.sourceUrl)},
              ${String(member.title)}, ${member.publishedAt ?? null}, ${Boolean(member.isPrimarySource)},
              ${Number(member.trustScore ?? 0.5)},
              ${JSON.stringify({ sourceCandidateId: member.id, clusterId, automationVersion: "ca-cp006" })}::jsonb,
              now()
            )
            ON CONFLICT (event_id, source_url) DO NOTHING
          `;
        }
      }
      await tx`
        UPDATE content.current_affairs_fact_claims
        SET event_id=${eventId}::uuid
        WHERE cluster_id=${clusterId}::uuid
      `;
      await tx`
        UPDATE content.current_affairs_clusters
        SET status='merged', promoted_event_id=${eventId}::uuid, updated_at=now()
        WHERE id=${clusterId}::uuid
      `;
    });
  } else {
    eventId = randomUUID();
    created = true;
    const publicCode = publicCurrentAffairsCode(eventDate);
    const scoringInput: EventCandidateInput = {
      title,
      summary: "",
      importanceReason,
      eventDate,
      category,
      sourceKey,
      sourceUrl,
      sourceTitle: String(evidenceMember.title ?? title),
      sourcePublishedAt: evidenceMember.publishedAt ? String(evidenceMember.publishedAt) : undefined,
      sourceTrustScore: Number(evidenceMember.trustScore ?? 0.7),
      isPrimarySource: Boolean(evidenceMember.isPrimarySource),
      facts: [],
    };
    const scores = scoreExamRelevance(scoringInput);

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.current_affairs_events (
          id, public_code, canonical_title, summary, importance_reason,
          event_date, category, status, verification_confidence,
          event_fingerprint, valid_from, metadata, created_at, updated_at
        ) VALUES (
          ${eventId}::uuid, ${publicCode}, ${title}, '', ${importanceReason},
          ${eventDate}, ${category}, 'review', 0, ${fingerprint}, ${eventDate},
          ${JSON.stringify({ automationVersion: "ca-cp006", sourceClusterId: clusterId, autoPromoted: true })}::jsonb,
          now(), now()
        )
      `;
      for (const member of members) {
        await tx`
          INSERT INTO content.current_affairs_event_candidates (event_id, candidate_id, cluster_id, created_at)
          VALUES (${eventId}::uuid, ${String(member.id)}::uuid, ${clusterId}::uuid, now())
          ON CONFLICT DO NOTHING
        `;
        if (member.sourceUrl) {
          await tx`
            INSERT INTO content.current_affairs_event_sources (
              event_id, source_id, source_url, source_title, source_published_at,
              is_primary_evidence, evidence_confidence, metadata, created_at
            ) VALUES (
              ${eventId}::uuid, ${String(member.sourceId)}::uuid, ${String(member.sourceUrl)},
              ${String(member.title)}, ${member.publishedAt ?? null}, ${Boolean(member.isPrimarySource)},
              ${Number(member.trustScore ?? 0.5)},
              ${JSON.stringify({ sourceCandidateId: member.id, clusterId, automationVersion: "ca-cp006" })}::jsonb,
              now()
            )
            ON CONFLICT (event_id, source_url) DO NOTHING
          `;
        }
      }
      await tx`
        UPDATE content.current_affairs_fact_claims
        SET event_id=${eventId}::uuid
        WHERE cluster_id=${clusterId}::uuid
      `;
      for (const score of scores) {
        await tx`
          INSERT INTO content.current_affairs_exam_scores (
            event_id, exam_family_key, relevance_score, include_recommended, reasons, created_at, updated_at
          ) VALUES (
            ${eventId}::uuid, ${score.examFamily}, ${score.score}, ${score.includeRecommended},
            ${JSON.stringify(score.reasons)}::jsonb, now(), now()
          )
        `;
      }
      await tx`
        UPDATE content.current_affairs_clusters
        SET status='promoted', promoted_event_id=${eventId}::uuid, updated_at=now()
        WHERE id=${clusterId}::uuid
      `;
    });
  }

  await reconcileEvent(eventId);
  const verified = await attemptAutoVerification(eventId);
  return { eventId, created, verified };
}

async function promoteEligibleClusters() {
  const profiles = await loadPromotionProfiles();
  let promoted = 0;
  let verified = 0;
  let heldForReview = 0;

  for (const profile of profiles) {
    const policy = canAutoPromoteCluster(profile);
    if (!policy.allowed) {
      heldForReview += 1;
      continue;
    }
    const result = await promoteCluster(profile.id);
    if (!result) continue;
    if (result.created) promoted += 1;
    if (result.verified) verified += 1;
  }
  return { examined: profiles.length, promoted, verified, heldForReview };
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

async function loadVerifiedContentEvents(date: string, family: string, startDate = date) {
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
      AND NOT EXISTS (
        SELECT 1 FROM content.current_affairs_fact_conflicts conflict
        WHERE conflict.event_id=event.id AND conflict.status='open'
      )
    ORDER BY score.relevance_score DESC, event.event_date DESC, event.canonical_title
    LIMIT 1500
  `;
  return rows.map((row) => contentEvent(row as Record<string, unknown>, family));
}

function compilationCode(date: string, family: string) {
  return `CA-D-${date.replaceAll("-", "")}-${family.toUpperCase()}`;
}

function generationRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `GEN-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

async function createQuestionRunForCompilation(
  compilationId: string,
  date: string,
  family: string,
  targetEvents: CurrentAffairsContentEvent[],
) {
  const lookback = new Date(`${date}T00:00:00Z`);
  lookback.setUTCDate(lookback.getUTCDate() - 180);
  const pool = await loadVerifiedContentEvents(date, family, lookback.toISOString().slice(0, 10));
  const generated = generateCurrentAffairsQuestions(targetEvents, pool, 30);
  if (generated.length < 5) return 0;

  const runId = randomUUID();
  const publicCode = generationRunCode();
  const timestamp = new Date().toISOString();
  const requestSnapshot = {
    source: "current_affairs_studio_cp006_daily_automation",
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
        id, public_code, status, attempt_number, prompt_snapshot,
        request_snapshot, provider, model, prompt_tokens, completion_tokens,
        estimated_cost_paise, actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}::jsonb, ${JSON.stringify(requestSnapshot)}::jsonb,
        'examtree', 'current-affairs-cp006-auto-draft', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;
    for (let index = 0; index < generated.length; index += 1) {
      const question = generated[index] as CurrentAffairsGeneratedQuestion;
      const itemId = randomUUID();
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1},
          'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${randomUUID()}::uuid, ${itemId}::uuid, 1,
          ${JSON.stringify({ ...question.payload, validationResult: "pending_editorial_review" })}::jsonb,
          ${`${question.eventPublicCode}:${question.family}:AUTO:${index + 1}`}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.current_affairs_question_links (
          event_id, fact_id, generation_run_id, generation_item_id, question_family, fact_key, created_at
        ) VALUES (
          ${question.eventId}::uuid,
          ${question.factId && uuidPattern.test(question.factId) ? question.factId : null}::uuid,
          ${runId}::uuid, ${itemId}::uuid, ${question.family}, ${question.factKey}, now()
        )
      `;
    }
    await tx`
      UPDATE content.current_affairs_compilations
      SET question_run_id=${runId}::uuid, updated_at=now()
      WHERE id=${compilationId}::uuid
    `;
  });
  return generated.length;
}

async function createDailyCompilation(date: string, family: string) {
  const code = compilationCode(date, family);
  const existing = await sqlClient`
    SELECT id::text AS id, question_run_id::text AS "questionRunId"
    FROM content.current_affairs_compilations
    WHERE public_code=${code} LIMIT 1
  `;
  if (existing[0]) return { created: false, questionCount: 0 };

  const events = await loadVerifiedContentEvents(date, family);
  if (events.length === 0) return { created: false, questionCount: 0 };
  const periodLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
  const title = `Daily Current Affairs — ${periodLabel} — ${family.toUpperCase()}`;
  const markdown = renderCompilationMarkdown({ title, periodLabel, examFamily: family, events });
  const resourceId = randomUUID();
  const compilationId = randomUUID();
  const summary = `${events.length} automatically selected verified, conflict-free Current Affairs events for ${family.toUpperCase()} review. This is a draft pending editorial publication.`;

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.learning_resources (
        id, public_code, category, format, title, summary, language_code,
        content_date, body_markdown, content_url, status, created_at, updated_at
      ) VALUES (
        ${resourceId}::uuid, ${code}, 'current_affairs', 'article', ${title}, ${summary},
        'en', ${date}, ${markdown}, null, 'draft', now(), now()
      )
    `;
    await tx`
      INSERT INTO content.current_affairs_compilations (
        id, public_code, period_type, period_start, period_end, exam_family_key,
        language_code, status, event_count, learning_resource_id, created_at, updated_at
      ) VALUES (
        ${compilationId}::uuid, ${code}, 'daily', ${date}, ${date}, ${family},
        'en', 'draft', ${events.length}, ${resourceId}::uuid, now(), now()
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
  });

  const questionCount = await createQuestionRunForCompilation(compilationId, date, family, events);
  return { created: true, questionCount };
}

export async function runScheduledIntelligenceProcessing(now = new Date()) {
  const slot = scheduleSlotStart(now, 3);
  const runKey = `intelligence_processing:${slot.toISOString()}`;
  const runId = randomUUID();
  const inserted = await sqlClient`
    INSERT INTO content.current_affairs_automation_runs (
      id, run_key, job_type, status, slot_started_at, started_at, created_at, updated_at
    ) VALUES (
      ${runId}::uuid, ${runKey}, 'intelligence_processing', 'running', ${slot.toISOString()}, now(), now(), now()
    )
    ON CONFLICT (run_key) DO NOTHING RETURNING id
  `;
  if (!inserted[0]) return { skipped: true, runKey, reason: "schedule slot already processed" };

  try {
    const clustering = await clusterQueuedCandidates();
    const promotion = await promoteEligibleClusters();
    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status='completed', completed_at=now(),
          cluster_created_count=${clustering.created},
          event_promoted_count=${promotion.promoted},
          event_verified_count=${promotion.verified},
          stats=${JSON.stringify({ clustering, promotion })}::jsonb,
          updated_at=now()
      WHERE id=${runId}::uuid
    `;
    return { skipped: false, runId, runKey, clustering, promotion };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 4000) : "Unknown intelligence automation failure";
    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status='failed', completed_at=now(), failure_reason=${message}, updated_at=now()
      WHERE id=${runId}::uuid
    `;
    throw error;
  }
}

export async function runDailyDraftGeneration(now = new Date()) {
  const date = previousIndiaDate(now);
  const runKey = `daily_compilation:${date}`;
  const runId = randomUUID();
  const inserted = await sqlClient`
    INSERT INTO content.current_affairs_automation_runs (
      id, run_key, job_type, status, slot_started_at, started_at, created_at, updated_at
    ) VALUES (
      ${runId}::uuid, ${runKey}, 'daily_compilation', 'running', ${now.toISOString()}, now(), now(), now()
    )
    ON CONFLICT (run_key) DO NOTHING RETURNING id
  `;
  if (!inserted[0]) return { skipped: true, runKey, date, reason: "daily draft already processed" };

  try {
    const results: Array<{ family: string; created: boolean; questionCount: number }> = [];
    for (const family of DAILY_EXAM_FAMILIES) {
      results.push({ family, ...(await createDailyCompilation(date, family)) });
    }
    const compilationCount = results.filter((item) => item.created).length;
    const questionCount = results.reduce((sum, item) => sum + item.questionCount, 0);
    const status = compilationCount > 0 ? "completed" : "skipped";
    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status=${status}, completed_at=now(),
          compilation_created_count=${compilationCount}, question_created_count=${questionCount},
          stats=${JSON.stringify({ date, results, publicationState: "draft_only" })}::jsonb,
          updated_at=now()
      WHERE id=${runId}::uuid
    `;
    return { skipped: status === "skipped", runId, runKey, date, compilationCount, questionCount, results };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 4000) : "Unknown daily compilation failure";
    await sqlClient`
      UPDATE content.current_affairs_automation_runs
      SET status='failed', completed_at=now(), failure_reason=${message}, updated_at=now()
      WHERE id=${runId}::uuid
    `;
    throw error;
  }
}
