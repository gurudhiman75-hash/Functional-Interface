import { randomUUID } from "node:crypto";

import { sqlClient } from "../lib/db";
import { onDemandFeedRunKey, runScheduledFeedIngestion, scheduleSlotStart } from "./automation";
import { runScheduledIntelligenceProcessing } from "./daily-orchestration";
import { reconcilePrimaryEnrichedEvents } from "./enriched-event-reconciliation";
import { holdManualAuthorityEventsForReview } from "./manual-enrichment-guard";
import { prepareOfficialYesterdayCandidates } from "./official-candidate-reclassification";
import { previousIndiaDate } from "./orchestration-policy";
import { runScheduledPrimaryFactEnrichment } from "./primary-enrichment";
import { loadCurrentAffairsProductionReadiness } from "./production-readiness-runtime";
import { runCurrentAffairsProductionRecovery } from "./production-recovery-runtime";

const FAMILIES = ["ssc", "banking", "punjab"] as const;
const MAX_ENRICHMENT_PASSES = 3;
const MAX_INTELLIGENCE_PASSES = 3;

type AutomationStage = "primary_fact_enrichment" | "intelligence_processing";

function slotIso(now: Date) {
  return scheduleSlotStart(now, 3).toISOString();
}

function stageRunKey(stage: AutomationStage, now: Date) {
  return `${stage}:${slotIso(now)}`;
}

async function supersedeCompletedSlot(stage: AutomationStage, now: Date) {
  const runKey = stageRunKey(stage, now);
  const rows = await sqlClient`
    SELECT id::text AS id, status
    FROM content.current_affairs_automation_runs
    WHERE run_key=${runKey}
    LIMIT 1
  `;
  const existing = rows[0];
  if (!existing) return { superseded: false, runKey, previousStatus: null };
  if (String(existing.status) === "running") {
    throw new Error(`${stage} is already running for the current automation slot. Try Generate Yesterday again after that run finishes.`);
  }
  const suffix = `superseded:on_demand:${randomUUID()}`;
  await sqlClient`
    UPDATE content.current_affairs_automation_runs
    SET run_key = run_key || ':' || ${suffix},
        stats = COALESCE(stats, '{}'::jsonb) || ${JSON.stringify({
          supersededBy: "current_affairs_on_demand_yesterday",
          supersededAt: new Date().toISOString(),
        })}::jsonb,
        updated_at=now()
    WHERE id=${String(existing.id)}::uuid
      AND status <> 'running'
  `;
  return { superseded: true, runKey, previousStatus: String(existing.status) };
}

async function supersedeManualRecoverySlot(targetDate: string, now: Date) {
  const runKey = `production_recovery:manual:${targetDate}:${slotIso(now)}`;
  const rows = await sqlClient`
    SELECT id::text AS id, status
    FROM content.current_affairs_ops_runs
    WHERE run_key=${runKey}
    LIMIT 1
  `;
  const existing = rows[0];
  if (!existing) return { superseded: false, runKey, previousStatus: null };
  if (String(existing.status) === "running") {
    throw new Error("A Current Affairs recovery pass is already running. Try Generate Yesterday again after it finishes.");
  }
  await sqlClient`
    UPDATE content.current_affairs_ops_runs
    SET run_key = run_key || ':superseded:on_demand:' || id::text,
        actions = COALESCE(actions, '[]'::jsonb) || ${JSON.stringify([{
          action: "superseded_for_on_demand_yesterday",
          at: new Date().toISOString(),
        }])}::jsonb,
        updated_at=now()
    WHERE id=${String(existing.id)}::uuid
      AND status <> 'running'
  `;
  return { superseded: true, runKey, previousStatus: String(existing.status) };
}

async function loadYesterdayArtifacts(targetDate: string) {
  const rows = await sqlClient`
    SELECT
      compilation.exam_family_key AS family,
      compilation.language_code AS language,
      compilation.public_code AS "publicCode",
      compilation.status,
      compilation.event_count::int AS "eventCount",
      resource.id::text AS "learningResourceId",
      resource.title,
      resource.status AS "learningResourceStatus",
      compilation.question_run_id::text AS "questionRunId"
    FROM content.current_affairs_compilations compilation
    JOIN content.learning_resources resource ON resource.id=compilation.learning_resource_id
    WHERE compilation.period_type='daily'
      AND compilation.period_start=${targetDate}::date
      AND compilation.period_end=${targetDate}::date
      AND compilation.exam_family_key IN ('ssc','banking','punjab')
      AND compilation.language_code IN ('en','hi','pa')
    ORDER BY compilation.exam_family_key, compilation.language_code
  `;
  return rows.map((row) => ({
    family: String(row.family),
    language: String(row.language),
    publicCode: String(row.publicCode),
    status: String(row.status),
    eventCount: Number(row.eventCount ?? 0),
    learningResourceId: String(row.learningResourceId),
    title: String(row.title),
    learningResourceStatus: String(row.learningResourceStatus),
    questionRunId: row.questionRunId ? String(row.questionRunId) : null,
  }));
}

async function countTargetDateState(targetDate: string) {
  const rows = await sqlClient`
    SELECT
      (SELECT count(*) FROM content.current_affairs_ingestion_candidates candidate
        WHERE candidate.published_at::date=${targetDate}::date)::int AS "candidateCount",
      (SELECT count(*) FROM content.current_affairs_events event
        WHERE event.event_date=${targetDate}::date)::int AS "eventCount",
      (SELECT count(*) FROM content.current_affairs_events event
        WHERE event.event_date=${targetDate}::date AND event.status='verified')::int AS "verifiedEventCount",
      (SELECT count(*) FROM content.current_affairs_events event
        WHERE event.event_date=${targetDate}::date AND event.status='review')::int AS "reviewEventCount"
  `;
  const row = rows[0] ?? {};
  return {
    candidateCount: Number(row.candidateCount ?? 0),
    eventCount: Number(row.eventCount ?? 0),
    verifiedEventCount: Number(row.verifiedEventCount ?? 0),
    reviewEventCount: Number(row.reviewEventCount ?? 0),
  };
}

export async function generateYesterdayCurrentAffairsOnDemand(now = new Date()) {
  const targetDate = previousIndiaDate(now);
  const startedAt = new Date().toISOString();
  const before = await countTargetDateState(targetDate);

  // A manual click gets its own unique run key and never shares the 3-hour cron key.
  // Scheduled cron dedupe remains unchanged; Generate Yesterday can poll immediately at any time.
  const sourceRunKey = onDemandFeedRunKey(now, randomUUID());
  const sourceRefresh = await runScheduledFeedIngestion(now, {
    runKey: sourceRunKey,
    trigger: "on_demand",
  });

  // Existing primary-source candidates and open clusters from the target date may
  // predate newer classification rules. Reclassify only official primary evidence
  // before enrichment/intelligence so valid PIB/Punjab/RBI/SEBI/ISRO stories are
  // not stranded as `other`. Specific categories are never overwritten.
  const officialCandidatePreparation = await prepareOfficialYesterdayCandidates(targetDate);

  const enrichmentPasses: unknown[] = [];
  for (let pass = 0; pass < MAX_ENRICHMENT_PASSES; pass += 1) {
    await supersedeCompletedSlot("primary_fact_enrichment", now);
    const result = await runScheduledPrimaryFactEnrichment(now, 100);
    enrichmentPasses.push(result);
    const seen = Number((result as any)?.candidatesSeen ?? 0);
    if ((result as any)?.skipped || seen < 100) break;
  }

  const manualAuthorityBefore = await holdManualAuthorityEventsForReview(200);
  const enrichedBeforeIntelligence = await reconcilePrimaryEnrichedEvents(300);

  const intelligencePasses: unknown[] = [];
  for (let pass = 0; pass < MAX_INTELLIGENCE_PASSES; pass += 1) {
    await supersedeCompletedSlot("intelligence_processing", now);
    const result = await runScheduledIntelligenceProcessing(now);
    intelligencePasses.push(result);
    const queuedSeen = Number((result as any)?.clustering?.queuedSeen ?? 0);
    const examined = Number((result as any)?.promotion?.examined ?? 0);
    if ((result as any)?.skipped || (queuedSeen < 500 && examined < 300)) break;
  }

  const enrichedAfterIntelligence = await reconcilePrimaryEnrichedEvents(300);
  const manualAuthorityAfter = await holdManualAuthorityEventsForReview(200);

  const recoverySupersede = await supersedeManualRecoverySlot(targetDate, now);
  const recovery = await runCurrentAffairsProductionRecovery({ now, triggerMode: "manual" });

  const artifacts = await loadYesterdayArtifacts(targetDate);
  const after = await countTargetDateState(targetDate);
  const readiness = await loadCurrentAffairsProductionReadiness(now);
  const englishFamilies = new Set(artifacts.filter((item) => item.language === "en").map((item) => item.family));
  const allEnglishDraftsPresent = FAMILIES.every((family) => englishFamilies.has(family));

  return {
    targetDate,
    startedAt,
    completedAt: new Date().toISOString(),
    before,
    after,
    sourceRefresh: {
      onDemand: true,
      runKey: sourceRunKey,
      result: sourceRefresh,
    },
    officialCandidatePreparation,
    enrichmentPasses,
    enrichedBeforeIntelligence,
    intelligencePasses,
    enrichedAfterIntelligence,
    manualAuthority: { before: manualAuthorityBefore, after: manualAuthorityAfter },
    recovery: {
      supersededPreviousSlot: recoverySupersede.superseded,
      result: recovery,
    },
    artifacts,
    summary: {
      allEnglishDraftsPresent,
      englishDraftCount: artifacts.filter((item) => item.language === "en").length,
      localizedDraftCount: artifacts.filter((item) => item.language === "hi" || item.language === "pa").length,
      verifiedEvents: after.verifiedEventCount,
      reviewEvents: after.reviewEventCount,
      readinessColor: readiness.evaluation.color,
      learnerReady: readiness.evaluation.learnerReady,
      blockers: readiness.evaluation.blockers,
      warnings: readiness.evaluation.warnings,
    },
    publicationAuthority: false,
    canonicalQuestionPromotion: false,
    automaticStudentPublication: false,
  };
}
