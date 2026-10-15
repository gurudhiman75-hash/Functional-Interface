// Read-only, staging-only operational visibility for the automatic Question
// Studio Cloud Scheduler -> outbox -> Cloud Tasks -> Review workflow.
// This endpoint never claims, retries, cancels, publishes or edits a run.
import { Router } from "express";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";

const router = Router();
function isolatedStaging() {
  return process.env.EXAMTREE_API_RUNTIME === "cloud-run" &&
    process.env.EXAMTREE_API_STAGING === "true" &&
    process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED === "true";
}
function natural(value: unknown) {
  const n=Number(value);
  return Number.isSafeInteger(n) && n >= 0 ? n : 0;
}
function iso(value: unknown): string | null {
  if(value===null || value===undefined)return null;
  const d=value instanceof Date?value:new Date(String(value));
  return Number.isFinite(d.getTime())?d.toISOString():null;
}

router.get("/operations/staging",requireAdminPermission("content.generation.read"),async (_req,res)=>{
  res.setHeader("Cache-Control","private, no-store");
  res.setHeader("Vary","Authorization");
  if(!isolatedStaging()){
    res.status(404).json({code:"QUESTION_STUDIO_OPERATIONS_STAGING_ONLY"});
    return;
  }
  try {
    // Only runs with a real, durable enqueue outbox event are part of the
    // operational pipeline. Synthetic legacy validation rows (which may still
    // be queued/expired) must not cause false incident counts.
    // Bound the reporting period to 30 days; show recent incidents only.
    const totals=await sqlClient`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE r.status='queued')::int AS queued,
        COUNT(*) FILTER (WHERE r.status='running')::int AS running,
        COUNT(*) FILTER (WHERE r.status IN ('review','approved','partially_approved'))::int AS completed,
        COUNT(*) FILTER (WHERE r.status='failed')::int AS failed,
        COUNT(*) FILTER (WHERE r.status IN ('queued','running') AND r.due_at < now())::int AS overdue,
        COUNT(*) FILTER (WHERE e.published_at IS NULL)::int AS awaiting_dispatch,
        COUNT(*) FILTER (WHERE e.published_at IS NULL AND r.created_at < now()-interval '10 minutes')::int AS dispatch_delayed,
        COUNT(*) FILTER (WHERE r.status='queued' AND e.published_at IS NOT NULL
          AND e.published_at < now()-interval '10 minutes')::int AS task_delayed,
        COUNT(*) FILTER (WHERE r.status='running' AND l.completed_at IS NULL
          AND l.lease_expires_at < now())::int AS expired_leases,
        MAX(r.completed_at) FILTER (WHERE r.status IN ('review','approved','partially_approved')) AS last_completed_at,
        MAX(e.published_at) AS last_dispatched_at,
        MAX(r.created_at) AS last_enqueued_at
      FROM content.generation_runs r
      JOIN platform.outbox_events e ON e.aggregate_id=r.id
        AND e.aggregate_type='generation_run'
        AND e.event_type='question_studio.generation_run.queued.v1'
      LEFT JOIN content.generation_run_task_leases l ON l.generation_run_id=r.id
      WHERE r.request_snapshot->>'queueVersion'='1'
        AND r.created_at >= now()-interval '30 days'
    `;
    const incidents=await sqlClient`
      SELECT r.public_code AS "publicCode",r.status::text AS status,
        r.created_at AS "createdAt",r.due_at AS "dueAt",
        e.published_at AS "dispatchedAt",e.attempts AS "dispatchAttempts",
        l.attempt_number AS "taskAttempts",
        CASE
          WHEN r.status='failed' THEN 'generation_failed'
          WHEN r.status IN ('queued','running') AND r.due_at < now() THEN 'deadline_exceeded'
          WHEN e.published_at IS NULL AND r.created_at < now()-interval '10 minutes' THEN 'dispatch_delayed'
          WHEN r.status='queued' AND e.published_at IS NOT NULL
            AND e.published_at < now()-interval '10 minutes' THEN 'task_delayed'
          WHEN r.status='running' AND l.completed_at IS NULL
            AND l.lease_expires_at < now() THEN 'lease_expired'
          ELSE 'unknown'
        END AS reason
      FROM content.generation_runs r
      JOIN platform.outbox_events e ON e.aggregate_id=r.id
        AND e.aggregate_type='generation_run'
        AND e.event_type='question_studio.generation_run.queued.v1'
      LEFT JOIN content.generation_run_task_leases l ON l.generation_run_id=r.id
      WHERE r.request_snapshot->>'queueVersion'='1'
        AND r.created_at >= now()-interval '30 days'
        AND (
          r.status='failed'
          OR (r.status IN ('queued','running') AND r.due_at < now())
          OR (e.published_at IS NULL AND r.created_at < now()-interval '10 minutes')
          OR (r.status='queued' AND e.published_at IS NOT NULL
            AND e.published_at < now()-interval '10 minutes')
          OR (r.status='running' AND l.completed_at IS NULL
            AND l.lease_expires_at < now())
        )
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    const x=totals[0]??{};
    const metrics={
      total:natural(x.total),queued:natural(x.queued),running:natural(x.running),
      completed:natural(x.completed),failed:natural(x.failed),
      overdue:natural(x.overdue),awaitingDispatch:natural(x.awaiting_dispatch),
      dispatchDelayed:natural(x.dispatch_delayed),taskDelayed:natural(x.task_delayed),
      expiredLeases:natural(x.expired_leases),
    };
    res.json({
      source:"isolated-neon-outbox",
      windowDays:30,
      checkedAt:new Date().toISOString(),
      requiresAttention:metrics.failed>0||metrics.overdue>0||
        metrics.dispatchDelayed>0||metrics.taskDelayed>0||metrics.expiredLeases>0,
      metrics,
      lastCompletedAt:iso(x.last_completed_at),
      lastDispatchedAt:iso(x.last_dispatched_at),
      lastEnqueuedAt:iso(x.last_enqueued_at),
      incidents:incidents.map(row=>({
        publicCode:String(row.publicCode),
        status:String(row.status),
        reason:String(row.reason),
        createdAt:iso(row.createdAt),
        dueAt:iso(row.dueAt),
        dispatchedAt:iso(row.dispatchedAt),
        dispatchAttempts:natural(row.dispatchAttempts),
        taskAttempts:natural(row.taskAttempts),
      })),
      // DB reports cannot independently prove that Scheduler is enabled,
      // Cloud Tasks is unpaused, or provider monitoring/alerts are configured.
      infrastructureStatus:"not-verified-by-database",
    });
  }catch(error){
    // No SQL data, secrets or prompt contents in logs or HTTP responses.
    console.error("Question Studio operational summary unavailable", {
      code:error&&typeof error==="object"&&"code" in error
        ?String(error.code).slice(0,50):"STAGING_OPERATIONS_QUERY_FAILED",
    });
    res.status(503).json({code:"QUESTION_STUDIO_OPERATIONS_UNAVAILABLE"});
  }
});
export default router;
