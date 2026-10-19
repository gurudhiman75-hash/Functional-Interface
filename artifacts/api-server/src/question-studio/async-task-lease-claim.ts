// Durable, idempotent run ownership for a FUTURE authenticated Cloud Tasks
// receiver. This function is NOT mounted in app.ts, routed or invoked by the
// outbox dispatcher. Do not enable it before the proposed lease table exists,
// the OIDC receiver passes staging and atomic review persistence is in place.
import { randomUUID } from "node:crypto";
import { sqlClient } from "../lib/db";
import {
  decideQuestionStudioTaskLease,
  QUESTION_STUDIO_TASK_LEASE_SECONDS,
} from "./async-task-lease-policy";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ClaimResult =
  | {kind:"claimed";runId:string;leaseToken:string;attemptNumber:number;requestSnapshot:unknown}
  | {kind:"busy"|"terminal"|"not_found"|"invalid"|"exhausted";runId:string};

export async function claimQuestionStudioAsyncTask(runId: string, allowSnapshot?: (snapshot:unknown)=>boolean): Promise<ClaimResult> {
  if (process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED !== "true") {
    throw new Error("QUESTION_STUDIO_TASK_CLAIM_DISABLED");
  }
  if (!UUID.test(runId)) return {kind:"invalid",runId};
  return sqlClient.begin(async(tx)=>{
    const runs=await tx`
      SELECT id::text AS id, status::text AS status,
             request_snapshot AS "requestSnapshot",
             due_at, (due_at IS NOT NULL AND due_at < now()) AS "deadlineExpired"
      FROM content.generation_runs
      WHERE id = ${runId}::uuid
      FOR UPDATE
    `;
    const run=runs[0];
    if(!run)return {kind:"not_found",runId};
    // Production canary can pass a strict pure allowlist. Apply it under
    // the same run-row lock BEFORE lease or run-state writes.
    if(allowSnapshot && !allowSnapshot(run.requestSnapshot)) {
      return {kind:"invalid",runId};
    }
    const snapshot=run.requestSnapshot as {queueVersion?:unknown} | null;
    const leases=await tx`
      SELECT attempt_number AS "attemptNumber",
             lease_expires_at > now() AND completed_at IS NULL AS "isActive"
      FROM content.generation_run_task_leases
      WHERE generation_run_id = ${runId}::uuid
      FOR UPDATE
    `;
    const current=leases[0];
    const attemptCount=current?Number(current.attemptNumber):0;
    const decision=decideQuestionStudioTaskLease({
      status:String(run.status),
      queueVersion:snapshot?.queueVersion,
      priorAttempts:attemptCount,
      existingLeaseIsActive:Boolean(current?.isActive),
      deadlineExpired:!run.due_at || Boolean(run.deadlineExpired),
    });
    if(decision==="terminal"||decision==="invalid"||decision==="busy"){
      return {kind:decision,runId};
    }
    if(decision==="exhausted"){
      await tx`
        UPDATE content.generation_runs
        SET status = 'failed'::generation_run_status,
            failure_reason = 'Async generation reached its claim/deadline limit',
            completed_at = now(), updated_at = now()
        WHERE id = ${runId}::uuid AND status IN ('queued','running')
      `;
      return {kind:"exhausted",runId};
    }

    const token=randomUUID();
    const attemptNumber=attemptCount+1;
    await tx`
      INSERT INTO content.generation_run_task_leases (
        generation_run_id, lease_token, attempt_number,
        claimed_at, lease_expires_at, completed_at
      ) VALUES (
        ${runId}::uuid, ${token}::uuid, ${attemptNumber},
        now(), now() + (${QUESTION_STUDIO_TASK_LEASE_SECONDS} * interval '1 second'), NULL
      )
      ON CONFLICT (generation_run_id) DO UPDATE
      SET lease_token = EXCLUDED.lease_token,
          attempt_number = EXCLUDED.attempt_number,
          claimed_at = EXCLUDED.claimed_at,
          lease_expires_at = EXCLUDED.lease_expires_at,
          completed_at = NULL
    `;
    await tx`
      UPDATE content.generation_runs
      SET status = 'running'::generation_run_status,
          attempt_number = ${attemptNumber},
          started_at = COALESCE(started_at, now()),
          updated_at = now()
      WHERE id = ${runId}::uuid
        AND status IN ('queued','running')
    `;
    return {
      kind:"claimed",runId,leaseToken:token,attemptNumber,
      requestSnapshot:run.requestSnapshot,
    };
  });
}
