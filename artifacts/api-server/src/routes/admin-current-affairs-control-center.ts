import { Router, type IRouter, type Response } from "express";

import { loadCurrentAffairsReleaseQueue } from "../current-affairs/release-runtime";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sendError(res: Response, error: unknown, fallback: string) {
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_CONTROL_CENTER_FAILED" });
}

router.use(authenticate);

router.get("/control-center", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const [sourceRows, pipelineRows, localizationRows, deliveryRows, automationRows, notificationRows, releaseQueue] = await Promise.all([
      sqlClient`
        SELECT
          count(*)::int AS total,
          count(*) FILTER (WHERE is_active=true)::int AS active,
          count(*) FILTER (
            WHERE is_active=true
              AND (
                (ingestion_mode IN ('feed', 'feed_and_pdf') AND feed_url IS NOT NULL)
                OR (ingestion_mode IN ('listing', 'listing_and_pdf') AND listing_url IS NOT NULL AND listing_adapter IS NOT NULL)
              )
          )::int AS scheduled,
          count(*) FILTER (WHERE is_active=true AND last_ingestion_status='failure')::int AS failing,
          count(*) FILTER (WHERE is_active=true AND is_primary_source=true)::int AS primary_sources,
          max(last_ingested_at)::text AS "lastIngestedAt"
        FROM content.current_affairs_sources
      `,
      sqlClient`
        SELECT
          (SELECT count(*) FROM content.current_affairs_ingestion_candidates WHERE status='queued')::int AS "queuedCandidates",
          (SELECT count(*) FROM content.current_affairs_clusters WHERE status='open')::int AS "openClusters",
          (SELECT count(*) FROM content.current_affairs_events WHERE status='review')::int AS "reviewEvents",
          (SELECT count(*) FROM content.current_affairs_events WHERE status='verified')::int AS "verifiedEvents",
          (SELECT count(*) FROM content.current_affairs_fact_conflicts WHERE status='open')::int AS "openConflicts",
          (SELECT count(*) FROM content.current_affairs_events
            WHERE status='verified'
              AND learner_authoring_status IN ('pending', 'needs_editorial'))::int AS "authoringNeedsWork",
          (SELECT count(*) FROM content.current_affairs_compilations WHERE status='draft')::int AS "draftCompilations"
      `,
      sqlClient`
        SELECT
          count(*) FILTER (
            WHERE event.status='verified'
              AND event.learner_authoring_status IN ('ready', 'manual')
              AND (hi.id IS NULL OR hi.status IN ('missing', 'needs_editorial'))
          )::int AS "hindiNeedsWork",
          count(*) FILTER (
            WHERE event.status='verified'
              AND event.learner_authoring_status IN ('ready', 'manual')
              AND (pa.id IS NULL OR pa.status IN ('missing', 'needs_editorial'))
          )::int AS "punjabiNeedsWork"
        FROM content.current_affairs_events event
        LEFT JOIN content.current_affairs_localizations hi
          ON hi.event_id=event.id
          AND hi.authoring_version_id=event.learner_authoring_version_id
          AND hi.language_code='hi'
        LEFT JOIN content.current_affairs_localizations pa
          ON pa.event_id=event.id
          AND pa.authoring_version_id=event.learner_authoring_version_id
          AND pa.language_code='pa'
      `,
      sqlClient`
        SELECT
          (SELECT count(*) FROM content.current_affairs_releases WHERE status='approved')::int AS "approvedReleases",
          (SELECT count(*) FROM content.current_affairs_releases WHERE status='revoked')::int AS "revokedReleases",
          (SELECT count(*) FROM content.current_affairs_quiz_deliveries WHERE status='published')::int AS "publishedQuizzes",
          (SELECT count(*) FROM content.current_affairs_question_promotions WHERE status='active')::int AS "activeQuestionPromotions",
          (SELECT count(*) FROM content.current_affairs_inapp_notifications WHERE status='unread')::int AS "unreadNotifications",
          (SELECT count(DISTINCT user_id) FROM content.current_affairs_learning_attempts)::int AS "learnersWithAttempts"
      `,
      sqlClient`
        SELECT DISTINCT ON (job_type)
          job_type AS "jobType",
          status,
          started_at::text AS "startedAt",
          completed_at::text AS "completedAt",
          failure_reason AS "failureReason",
          source_count::int AS "sourceCount",
          success_count::int AS "successCount",
          failure_count::int AS "failureCount"
        FROM content.current_affairs_automation_runs
        ORDER BY job_type, started_at DESC
      `,
      sqlClient`
        SELECT
          status,
          started_at::text AS "startedAt",
          completed_at::text AS "completedAt",
          candidate_user_count::int AS "candidateUserCount",
          evaluated_user_count::int AS "evaluatedUserCount",
          delivered_count::int AS "deliveredCount",
          suppressed_count::int AS "suppressedCount",
          error_count::int AS "errorCount",
          failure
        FROM content.current_affairs_notification_runs
        ORDER BY started_at DESC
        LIMIT 1
      `,
      loadCurrentAffairsReleaseQueue(200),
    ]);

    const sources = sourceRows[0] ?? {};
    const pipeline = pipelineRows[0] ?? {};
    const localization = localizationRows[0] ?? {};
    const delivery = deliveryRows[0] ?? {};
    const latestNotificationRun = notificationRows[0] ?? null;
    const automationFailures = automationRows.filter((row) => ["failed", "completed_with_errors"].includes(String(row.status))).length;
    const sourceFailures = number(sources.failing);
    const openConflicts = number(pipeline.openConflicts);
    const notificationFailures = latestNotificationRun && ["failed", "completed_with_errors"].includes(String(latestNotificationRun.status))
      ? number(latestNotificationRun.errorCount) || 1
      : 0;
    const healthLevel = openConflicts > 0 || sourceFailures > 0 || automationFailures > 0 || notificationFailures > 0
      ? "attention"
      : "healthy";

    res.json({
      generatedAt: new Date().toISOString(),
      health: {
        level: healthLevel,
        sourceFailures,
        automationFailures,
        notificationFailures,
        openConflicts,
      },
      sources: {
        total: number(sources.total),
        active: number(sources.active),
        scheduled: number(sources.scheduled),
        failing: sourceFailures,
        primarySources: number(sources.primary_sources),
        lastIngestedAt: sources.lastIngestedAt ? String(sources.lastIngestedAt) : null,
      },
      pipeline: {
        queuedCandidates: number(pipeline.queuedCandidates),
        openClusters: number(pipeline.openClusters),
        reviewEvents: number(pipeline.reviewEvents),
        verifiedEvents: number(pipeline.verifiedEvents),
        openConflicts,
        authoringNeedsWork: number(pipeline.authoringNeedsWork),
        hindiNeedsWork: number(localization.hindiNeedsWork),
        punjabiNeedsWork: number(localization.punjabiNeedsWork),
        draftCompilations: number(pipeline.draftCompilations),
      },
      releases: {
        ready: releaseQueue.filter((candidate) => candidate.readiness.ready).length,
        blocked: releaseQueue.filter((candidate) => !candidate.readiness.ready).length,
        approved: number(delivery.approvedReleases),
        revoked: number(delivery.revokedReleases),
      },
      learnerDelivery: {
        publishedQuizzes: number(delivery.publishedQuizzes),
        activeQuestionPromotions: number(delivery.activeQuestionPromotions),
        unreadNotifications: number(delivery.unreadNotifications),
        learnersWithAttempts: number(delivery.learnersWithAttempts),
      },
      automation: {
        latestRuns: automationRows.map((row) => ({
          jobType: String(row.jobType),
          status: String(row.status),
          startedAt: row.startedAt ? String(row.startedAt) : null,
          completedAt: row.completedAt ? String(row.completedAt) : null,
          failureReason: row.failureReason ? String(row.failureReason) : null,
          sourceCount: number(row.sourceCount),
          successCount: number(row.successCount),
          failureCount: number(row.failureCount),
        })),
        latestNotificationRun: latestNotificationRun ? {
          status: String(latestNotificationRun.status),
          startedAt: latestNotificationRun.startedAt ? String(latestNotificationRun.startedAt) : null,
          completedAt: latestNotificationRun.completedAt ? String(latestNotificationRun.completedAt) : null,
          candidateUserCount: number(latestNotificationRun.candidateUserCount),
          evaluatedUserCount: number(latestNotificationRun.evaluatedUserCount),
          deliveredCount: number(latestNotificationRun.deliveredCount),
          suppressedCount: number(latestNotificationRun.suppressedCount),
          errorCount: number(latestNotificationRun.errorCount),
          failure: latestNotificationRun.failure ? String(latestNotificationRun.failure) : null,
        } : null,
      },
    });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs control center");
  }
});

export default router;
