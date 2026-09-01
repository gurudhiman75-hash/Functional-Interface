import { sqlClient } from "../lib/db";
import { previousIndiaDate } from "./orchestration-policy";
import { evaluateCurrentAffairsProductionReadiness } from "./production-readiness-policy";
import { loadCurrentAffairsReleaseQueue } from "./release-runtime";
import { evaluateCurrentAffairsSourceFamilyCoverage } from "./source-family-policy";

const FAMILIES = ["ssc", "banking", "punjab"] as const;

function deadlineForTargetDate(targetDate: string): string {
  const date = new Date(`${targetDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  date.setUTCHours(1, 30, 0, 0); // 07:00 IST on the next calendar day.
  return date.toISOString();
}

function text(value: unknown): string | null {
  return value === null || value === undefined || value === "" ? null : String(value);
}

export async function loadCurrentAffairsProductionReadiness(now = new Date()) {
  const targetDate = previousIndiaDate(now);
  const deadlineIso = deadlineForTargetDate(targetDate);
  const releaseQueue = await loadCurrentAffairsReleaseQueue(300);
  const [sources, runs, queue, conflicts, compilations, approvedReleases, missingDays, targetInventoryRows] = await Promise.all([
    sqlClient`
      SELECT
        source_key AS "sourceKey", name, source_type AS "sourceType",
        source_family AS "sourceFamily", source_tier AS "sourceTier",
        coverage_domain AS "coverageDomain", content_policy AS "contentPolicy",
        is_primary_source AS "isPrimarySource", ingestion_mode AS "ingestionMode",
        base_url AS "baseUrl", feed_url AS "feedUrl", listing_url AS "listingUrl",
        metadata,
        last_ingested_at::text AS "lastIngestedAt",
        last_ingestion_status AS "lastIngestionStatus", last_ingestion_error AS "lastIngestionError",
        CASE WHEN last_ingested_at IS NOT NULL AND last_ingested_at >= now() - interval '6 hours' THEN true ELSE false END AS fresh,
        CASE WHEN is_active=true AND (
          (ingestion_mode IN ('feed','feed_and_pdf') AND feed_url IS NOT NULL)
          OR (ingestion_mode IN ('listing','listing_and_pdf') AND listing_url IS NOT NULL AND listing_adapter IS NOT NULL)
        ) THEN true ELSE false END AS scheduled
      FROM content.current_affairs_sources
      WHERE is_active=true
      ORDER BY
        CASE source_tier
          WHEN 'core_official' THEN 0
          WHEN 'supplementary_official' THEN 1
          WHEN 'trusted_news' THEN 2
          ELSE 3
        END,
        is_primary_source DESC, trust_score DESC, source_key
    `,
    sqlClient`
      SELECT DISTINCT ON (job_type)
        job_type AS "jobType", status, started_at::text AS "startedAt", completed_at::text AS "completedAt",
        failure_reason AS "failureReason", stats
      FROM content.current_affairs_automation_runs
      WHERE job_type IN ('feed_ingestion','intelligence_processing','daily_compilation')
      ORDER BY job_type, started_at DESC
    `,
    sqlClient`SELECT count(*)::int AS count FROM content.current_affairs_ingestion_candidates WHERE status='queued'`,
    sqlClient`SELECT count(*)::int AS count FROM content.current_affairs_fact_conflicts WHERE status='open'`,
    sqlClient`
      SELECT
        id::text AS id, public_code AS "publicCode", exam_family_key AS family,
        language_code AS language, status, event_count::int AS "eventCount",
        learning_resource_id::text AS "learningResourceId", question_run_id::text AS "questionRunId"
      FROM content.current_affairs_compilations
      WHERE period_type='daily' AND period_start=${targetDate}::date AND period_end=${targetDate}::date
        AND exam_family_key IN ('ssc','banking','punjab')
      ORDER BY exam_family_key, language_code
    `,
    sqlClient`
      SELECT id::text AS id, public_code AS "publicCode", exam_family_key AS family,
             status, approved_at::text AS "approvedAt"
      FROM content.current_affairs_releases
      WHERE period_type='daily' AND period_start=${targetDate}::date AND period_end=${targetDate}::date
        AND exam_family_key IN ('ssc','banking','punjab') AND status='approved'
    `,
    sqlClient`
      WITH expected AS (
        SELECT DISTINCT event.event_date AS day, score.exam_family_key AS family
        FROM content.current_affairs_events event
        JOIN content.current_affairs_exam_scores score ON score.event_id=event.id
        WHERE event.status='verified' AND score.include_recommended=true
          AND event.event_date BETWEEN ${targetDate}::date - interval '6 days' AND ${targetDate}::date
          AND score.exam_family_key IN ('ssc','banking','punjab')
      )
      SELECT expected.day::text AS day, expected.family
      FROM expected
      LEFT JOIN content.current_affairs_compilations compilation
        ON compilation.period_type='daily'
       AND compilation.period_start=expected.day AND compilation.period_end=expected.day
       AND compilation.exam_family_key=expected.family AND compilation.language_code='en'
      WHERE compilation.id IS NULL
      ORDER BY expected.day DESC, expected.family
    `,
    sqlClient`
      SELECT
        (SELECT count(*) FROM content.current_affairs_ingestion_candidates candidate
          WHERE COALESCE(
            NULLIF(candidate.payload->>'historicalTargetDate',''),
            NULLIF(candidate.payload->>'discoveryTargetDate',''),
            (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
          )=${targetDate})::int AS "candidateCount",
        (SELECT count(*) FROM content.current_affairs_ingestion_candidates candidate
          JOIN content.current_affairs_sources source ON source.id=candidate.source_id
          WHERE COALESCE(
            NULLIF(candidate.payload->>'historicalTargetDate',''),
            NULLIF(candidate.payload->>'discoveryTargetDate',''),
            (candidate.published_at AT TIME ZONE 'Asia/Kolkata')::date::text
          )=${targetDate}
            AND source.is_primary_source=true)::int AS "primaryCandidateCount",
        (SELECT count(*) FROM content.current_affairs_clusters cluster
          WHERE cluster.event_date_guess=${targetDate}::date AND cluster.status='open')::int AS "openClusterCount",
        (SELECT count(*) FROM content.current_affairs_clusters cluster
          WHERE cluster.event_date_guess=${targetDate}::date AND cluster.status='open' AND cluster.category_guess='other')::int AS "openOtherClusterCount",
        (SELECT count(*) FROM content.current_affairs_events event
          WHERE event.event_date=${targetDate}::date AND event.status IN ('review','verified'))::int AS "eventCount",
        (SELECT count(*) FROM content.current_affairs_events event
          WHERE event.event_date=${targetDate}::date AND event.status='verified')::int AS "verifiedEventCount",
        (SELECT count(*) FROM content.current_affairs_events event
          WHERE event.event_date=${targetDate}::date AND event.status='review')::int AS "reviewEventCount",
        (SELECT count(*) FROM content.current_affairs_events event
          WHERE event.event_date=${targetDate}::date AND event.status='verified'
            AND event.learner_authoring_status IN ('ready','manual'))::int AS "authoringReadyCount",
        (SELECT count(DISTINCT event.id)
          FROM content.current_affairs_events event
          JOIN content.current_affairs_exam_scores score ON score.event_id=event.id
          WHERE event.event_date=${targetDate}::date AND event.status='verified'
            AND event.learner_authoring_status IN ('ready','manual')
            AND score.exam_family_key='ssc' AND score.include_recommended=true
            AND NOT EXISTS (SELECT 1 FROM content.current_affairs_fact_conflicts conflict WHERE conflict.event_id=event.id AND conflict.status='open'))::int AS "sscEligibleCount",
        (SELECT count(DISTINCT event.id)
          FROM content.current_affairs_events event
          JOIN content.current_affairs_exam_scores score ON score.event_id=event.id
          WHERE event.event_date=${targetDate}::date AND event.status='verified'
            AND event.learner_authoring_status IN ('ready','manual')
            AND score.exam_family_key='banking' AND score.include_recommended=true
            AND NOT EXISTS (SELECT 1 FROM content.current_affairs_fact_conflicts conflict WHERE conflict.event_id=event.id AND conflict.status='open'))::int AS "bankingEligibleCount",
        (SELECT count(DISTINCT event.id)
          FROM content.current_affairs_events event
          JOIN content.current_affairs_exam_scores score ON score.event_id=event.id
          WHERE event.event_date=${targetDate}::date AND event.status='verified'
            AND event.learner_authoring_status IN ('ready','manual')
            AND score.exam_family_key='punjab' AND score.include_recommended=true
            AND NOT EXISTS (SELECT 1 FROM content.current_affairs_fact_conflicts conflict WHERE conflict.event_id=event.id AND conflict.status='open'))::int AS "punjabEligibleCount"
    `,
  ]);

  const sourceFamilyCoverage = evaluateCurrentAffairsSourceFamilyCoverage(sources.map((row) => ({
    sourceKey: String(row.sourceKey),
    name: String(row.name),
    sourceFamily: String(row.sourceFamily ?? row.sourceKey),
    sourceTier: String(row.sourceTier ?? "supplementary_official"),
    coverageDomain: text(row.coverageDomain),
    scheduled: Boolean(row.scheduled),
    fresh: Boolean(row.fresh),
    status: text(row.lastIngestionStatus),
  })));
  const coreOfficialSources = sources.filter((row) => String(row.sourceTier) === "core_official" && Boolean(row.scheduled));
  const discoverySources = sources.filter((row) => String(row.sourceTier) === "trusted_news");
  const targetInventory = targetInventoryRows[0] ?? {};

  const runByType = new Map(runs.map((row) => [String(row.jobType), row]));
  const feedRun = runByType.get("feed_ingestion");
  const intelligenceRun = runByType.get("intelligence_processing");
  const feedRunHealthy = Boolean(feedRun) && ["completed", "completed_with_errors"].includes(String(feedRun?.status));
  const intelligenceRunHealthy = Boolean(intelligenceRun) && String(intelligenceRun?.status) === "completed";
  const compilationByFamily = new Map<string, Record<string, any>[] >();
  for (const row of compilations) {
    const list = compilationByFamily.get(String(row.family)) ?? [];
    list.push(row as Record<string, any>);
    compilationByFamily.set(String(row.family), list);
  }
  const approvedReleaseByFamily = new Map(approvedReleases.map((row) => [String(row.family), row]));

  const families = [];
  for (const family of FAMILIES) {
    const familyCompilations = compilationByFamily.get(family) ?? [];
    const english = familyCompilations.find((row) => String(row.language) === "en");
    const hindi = familyCompilations.find((row) => String(row.language) === "hi");
    const punjabi = familyCompilations.find((row) => String(row.language) === "pa");
    const candidate = releaseQueue.find((item) =>
      item.key.periodType === "daily"
      && item.key.periodStart === targetDate
      && item.key.periodEnd === targetDate
      && item.key.examFamily === family);
    const approvedRelease = approvedReleaseByFamily.get(family);
    let learnerQuizPublished = false;
    if (approvedRelease?.id) {
      const quizRows = await sqlClient`
        SELECT count(*)::int AS count
        FROM content.current_affairs_quiz_deliveries
        WHERE release_id=${String(approvedRelease.id)}::uuid AND status='published'
      `;
      learnerQuizPublished = Number(quizRows[0]?.count ?? 0) > 0;
    }
    const totalEnglishQuestions = candidate?.questions.length ?? 0;
    const approvedEnglishQuestions = candidate?.questions.filter((item) => item.itemStatus === "approved").length ?? 0;
    families.push({
      family,
      englishDraftPresent: Boolean(english),
      hindiDraftPresent: Boolean(hindi),
      punjabiDraftPresent: Boolean(punjabi),
      eventCount: Number(english?.eventCount ?? 0),
      approvedEnglishQuestions,
      totalEnglishQuestions,
      releaseReady: Boolean(candidate?.readiness.ready),
      approvedRelease: Boolean(approvedRelease),
      learnerQuizPublished,
      compilations: familyCompilations,
      blockers: candidate?.readiness.blockers ?? [],
      releaseCode: approvedRelease?.publicCode ? String(approvedRelease.publicCode) : null,
    });
  }

  const evaluation = evaluateCurrentAffairsProductionReadiness({
    now,
    targetDate,
    deadlineIso,
    scheduledPrimarySources: sourceFamilyCoverage.requiredSourceFamilies,
    freshSuccessfulPrimarySources: sourceFamilyCoverage.healthyRequiredSourceFamilies,
    failingPrimarySources: sourceFamilyCoverage.failingPrimaryEndpoints,
    stalePrimarySources: sourceFamilyCoverage.stalePrimaryEndpoints,
    criticalSourceFailures: sourceFamilyCoverage.criticalDomainFailures.length,
    criticalSourceFailureLabels: sourceFamilyCoverage.criticalDomainFailures,
    latestFeedRunAt: feedRunHealthy ? text(feedRun?.completedAt ?? feedRun?.startedAt) : null,
    latestIntelligenceRunAt: intelligenceRunHealthy ? text(intelligenceRun?.completedAt ?? intelligenceRun?.startedAt) : null,
    queuedCandidates: Number(queue[0]?.count ?? 0),
    openConflicts: Number(conflicts[0]?.count ?? 0),
    families,
  });

  return {
    targetDate,
    deadlineIso,
    generatedAt: now.toISOString(),
    evaluation,
    targetInventory: {
      candidateCount: Number(targetInventory.candidateCount ?? 0),
      primaryCandidateCount: Number(targetInventory.primaryCandidateCount ?? 0),
      openClusterCount: Number(targetInventory.openClusterCount ?? 0),
      openOtherClusterCount: Number(targetInventory.openOtherClusterCount ?? 0),
      eventCount: Number(targetInventory.eventCount ?? 0),
      verifiedEventCount: Number(targetInventory.verifiedEventCount ?? 0),
      reviewEventCount: Number(targetInventory.reviewEventCount ?? 0),
      authoringReadyCount: Number(targetInventory.authoringReadyCount ?? 0),
      familyEligible: {
        ssc: Number(targetInventory.sscEligibleCount ?? 0),
        banking: Number(targetInventory.bankingEligibleCount ?? 0),
        punjab: Number(targetInventory.punjabEligibleCount ?? 0),
      },
    },
    sourceCoverage: {
      scheduledPrimarySources: sourceFamilyCoverage.requiredSourceFamilies,
      freshSuccessfulPrimarySources: sourceFamilyCoverage.healthyRequiredSourceFamilies,
      failingPrimarySources: sourceFamilyCoverage.failingPrimaryEndpoints,
      stalePrimarySources: sourceFamilyCoverage.stalePrimaryEndpoints,
      criticalSourceFailures: sourceFamilyCoverage.criticalDomainFailures.length,
      requiredDomains: ["national", "economy_banking", "punjab"],
      criticalDomainFailures: sourceFamilyCoverage.criticalDomainFailures,
      degradedSourceFamilies: sourceFamilyCoverage.degradedSourceFamilies,
      unhealthySourceFamilies: sourceFamilyCoverage.unhealthySourceFamilies,
      sourceFamilies: sourceFamilyCoverage.families,
      sources: coreOfficialSources.map((row) => ({
        sourceKey: String(row.sourceKey),
        name: String(row.name),
        sourceFamily: String(row.sourceFamily ?? row.sourceKey),
        sourceTier: String(row.sourceTier ?? "core_official"),
        coverageDomain: text(row.coverageDomain),
        fresh: Boolean(row.fresh),
        status: text(row.lastIngestionStatus),
        lastIngestedAt: text(row.lastIngestedAt),
        error: text(row.lastIngestionError),
      })),
      discoverySources: discoverySources.map((row) => {
        const metadata = row.metadata && typeof row.metadata === "object" ? row.metadata as Record<string, unknown> : {};
        return {
          sourceKey: String(row.sourceKey),
          name: String(row.name),
          sourceFamily: String(row.sourceFamily ?? row.sourceKey),
          sourceTier: String(row.sourceTier),
          coverageDomain: text(row.coverageDomain),
          contentPolicy: text(row.contentPolicy),
          ingestionMode: String(row.ingestionMode ?? "manual"),
          scheduled: Boolean(row.scheduled),
          fresh: Boolean(row.fresh),
          status: text(row.lastIngestionStatus),
          lastIngestedAt: text(row.lastIngestedAt),
          baseUrl: text(row.baseUrl),
          feedUrl: text(row.feedUrl),
          automationStatus: text(metadata.automationStatus),
          usagePolicy: text(metadata.usagePolicy),
        };
      }),
    },
    pipeline: {
      queuedCandidates: Number(queue[0]?.count ?? 0),
      openConflicts: Number(conflicts[0]?.count ?? 0),
      feedRun: feedRun ? { status: String(feedRun.status), startedAt: text(feedRun.startedAt), completedAt: text(feedRun.completedAt), failureReason: text(feedRun.failureReason) } : null,
      intelligenceRun: intelligenceRun ? { status: String(intelligenceRun.status), startedAt: text(intelligenceRun.startedAt), completedAt: text(intelligenceRun.completedAt), failureReason: text(intelligenceRun.failureReason) } : null,
    },
    families,
    missingDays: missingDays.map((row) => ({ day: String(row.day).slice(0, 10), family: String(row.family) })),
  };
}
