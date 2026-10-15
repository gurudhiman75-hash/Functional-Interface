// Staging-only incident detection and explicitly gated fail-closed recovery.
// This module never calls workers, enqueues Cloud Tasks or publishes questions.
import { randomUUID } from "node:crypto";
import { sqlClient } from "../lib/db";

const EVENT = "question_studio.generation_run.queued.v1";
const TERMINAL_GRACE_MINUTES = 10;

function assertStagingDispatcher() {
  if (process.env.EXAMTREE_API_RUNTIME !== "cloud-run" ||
      process.env.EXAMTREE_API_STAGING !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_QUEUE !== "examtree-qs-staging" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_PROJECT !== "sarbedutech" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_REGION !== "asia-south1") {
    throw new Error("STAGING_QS_WATCHDOG_NOT_APPROVED");
  }
}

const numeric = (value: unknown) => {
  const n=Number(value);
  return Number.isSafeInteger(n) && n>=0 ? n : 0;
};

export type StagingIncidentSummary = {
  active: number;
  awaitingDispatch: number;
  dispatchDelayed: number;
  taskDelayed: number;
  expiredLeases: number;
  overdue: number;
  recentlyFailed: number;
  affectedCodes: string[];
};

// Read-only, bounded look at actual outbox-backed runs, not synthetic legacy
// validation rows. Cloud Scheduler itself must be watched separately by GCP.
export async function inspectQuestionStudioAsyncIncidents():Promise<StagingIncidentSummary> {
  assertStagingDispatcher();
  const rows=await sqlClient`
    SELECT
      COUNT(*) FILTER (WHERE r.status IN ('queued','running'))::int AS "active",
      COUNT(*) FILTER (WHERE r.status IN ('queued','running') AND e.published_at IS NULL)::int AS "awaitingDispatch",
      COUNT(*) FILTER (WHERE r.status IN ('queued','running') AND e.published_at IS NULL
        AND r.created_at < now()-interval '10 minutes')::int AS "dispatchDelayed",
      COUNT(*) FILTER (WHERE r.status='queued' AND e.published_at IS NOT NULL
        AND e.published_at < now()-interval '10 minutes')::int AS "taskDelayed",
      COUNT(*) FILTER (WHERE r.status='running' AND l.completed_at IS NULL
        AND l.lease_expires_at < now())::int AS "expiredLeases",
      COUNT(*) FILTER (WHERE r.status IN ('queued','running')
        AND r.due_at < now())::int AS "overdue",
      COUNT(*) FILTER (WHERE r.status='failed'
        AND r.completed_at >= now()-interval '15 minutes')::int AS "recentlyFailed"
    FROM content.generation_runs r
    JOIN platform.outbox_events e ON e.aggregate_id=r.id
      AND e.aggregate_type='generation_run'
      AND e.event_type=${EVENT}
    LEFT JOIN content.generation_run_task_leases l ON l.generation_run_id=r.id
    WHERE r.request_snapshot->>'queueVersion'='1'
      AND r.created_at>=now()-interval '30 days'
  `;
  const issues=await sqlClient`
    SELECT r.public_code AS "publicCode"
    FROM content.generation_runs r
    JOIN platform.outbox_events e ON e.aggregate_id=r.id
      AND e.aggregate_type='generation_run'
      AND e.event_type=${EVENT}
    LEFT JOIN content.generation_run_task_leases l ON l.generation_run_id=r.id
    WHERE r.request_snapshot->>'queueVersion'='1'
      AND r.created_at>=now()-interval '30 days'
      AND (
        (r.status IN ('queued','running') AND r.due_at<now())
        OR (r.status IN ('queued','running') AND e.published_at IS NULL
            AND r.created_at<now()-interval '10 minutes')
        OR (r.status='queued' AND e.published_at IS NOT NULL
            AND e.published_at<now()-interval '10 minutes')
        OR (r.status='running' AND l.completed_at IS NULL
            AND l.lease_expires_at<now())
        OR (r.status='failed' AND r.completed_at>=now()-interval '15 minutes')
      )
    ORDER BY r.created_at DESC
    LIMIT 5
  `;
  const row=rows[0]??{};
  const summary:StagingIncidentSummary={
    active:numeric(row.active),
    awaitingDispatch:numeric(row.awaitingDispatch),
    dispatchDelayed:numeric(row.dispatchDelayed),
    taskDelayed:numeric(row.taskDelayed),
    expiredLeases:numeric(row.expiredLeases),
    overdue:numeric(row.overdue),
    recentlyFailed:numeric(row.recentlyFailed),
    affectedCodes:issues.map(x=>String(x.publicCode)).filter(x=>/^GEN-[0-9]{8}-[A-F0-9]{8}$/.test(x)),
  };
  if(summary.dispatchDelayed || summary.taskDelayed || summary.expiredLeases ||
     summary.overdue || summary.recentlyFailed){
    // Deliberately stable unique token for a Google Cloud Logging alert.
    // No prompt, identity, API key, token or request snapshot in logs.
    console.error("EXAMTREE_QS_STAGING_INCIDENT",JSON.stringify(summary));
  } else {
    console.info("EXAMTREE_QS_STAGING_WATCHDOG_OK",JSON.stringify({
      active:summary.active,awaitingDispatch:summary.awaitingDispatch,
    }));
  }
  return summary;
}

export type StagingRecoveryReceipt =
  | {kind:"disabled"|"no_expired_run"}
  | {kind:"marked_failed";publicCode:string};

// An exhausted Cloud Task does not guarantee any future receiver callback.
// If enabled by an *additional* staging-only environment flag, fail CLOSED
// on at most one real, expired, unleased outbox-backed run per invocation.
// A run row lock serializes with claim and atomic review commit (same lock
// order). Never revive it, never replay or enqueue additional Cloud Tasks.
// Neither cancel nor overwrite a still-valid active lease.
export async function recoverOneExpiredQuestionStudioStagingRun():Promise<StagingRecoveryReceipt> {
  assertStagingDispatcher();
  if(process.env.EXAMTREE_QS_STAGING_EXPIRED_RECOVERY_ENABLED!=="true"){
    return {kind:"disabled"};
  }
  return sqlClient.begin(async(tx)=>{
    const rows=await tx`
      SELECT r.id::text AS id, r.public_code AS "publicCode"
      FROM content.generation_runs r
      LEFT JOIN content.generation_run_task_leases l
        ON l.generation_run_id=r.id
      WHERE r.request_snapshot->>'queueVersion'='1'
        AND r.status IN ('queued','running')
        AND r.due_at < now()-(${TERMINAL_GRACE_MINUTES} * interval '1 minute')
        AND (l.generation_run_id IS NULL OR l.completed_at IS NOT NULL
             OR l.lease_expires_at <= now())
        AND EXISTS (
          SELECT 1 FROM platform.outbox_events e
          WHERE e.aggregate_id=r.id AND e.aggregate_type='generation_run'
            AND e.event_type=${EVENT}
        )
      ORDER BY r.due_at ASC, r.id ASC
      LIMIT 1
      FOR UPDATE OF r SKIP LOCKED
    `;
    if(rows.length===0)return {kind:"no_expired_run" as const};
    const id=String(rows[0]!.id);
    const publicCode=String(rows[0]!.publicCode);
    await tx`
      UPDATE content.generation_runs
      SET status='failed'::generation_run_status,
          failure_reason='Async staging deadline exceeded after retry grace period; operator review required',
          completed_at=now(),updated_at=now()
      WHERE id=${id}::uuid AND status IN ('queued','running')
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id,actor_type,actor_user_id,action_key,entity_type,entity_id,
        reason,summary,metadata
      ) VALUES (
        ${randomUUID()}::uuid,'system'::audit_actor_type,NULL::uuid,
        'question_studio.generation_run.deadline_expired',
        'generation_run',${id}::uuid,
        'Isolated staging async request expired without an active task lease',
        ${`Marked ${publicCode} failed after its deadline and retry grace period`},
        (${JSON.stringify({runId:id,queueVersion:1,reasonCode:"DEADLINE_EXPIRED"})}::text)::jsonb
      )
    `;
    console.error("EXAMTREE_QS_STAGING_RUN_QUARANTINED",JSON.stringify({publicCode}));
    return {kind:"marked_failed" as const,publicCode};
  });
}
