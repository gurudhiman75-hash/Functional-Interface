// Isolated single-use production enqueue JOB, never an HTTP endpoint.
// A queued canonical run, idempotency reservation, audit and outbox are
// inserted atomically. No Cloud Task, generation, approval or publication.
import {createHash,randomUUID} from "node:crypto";
import {assertProdCanaryRequest,isProdCanarySnapshot}
  from "./prod-one-run-canary-guard.mjs";
import {validateAsyncTaskComputeInput} from "./async-task-package-capabilities";

const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ACTOR=/^[a-zA-Z0-9:_-]{1,128}$/;
export function assertCanaryEnqueueEnvironment(env:NodeJS.ProcessEnv=process.env,now=Date.now()) {
  const runId=env.EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID || "";
  const actor=env.EXAMTREE_QS_PRODUCTION_CANARY_ADMIN_UID || "";
  const adminId=env.EXAMTREE_QS_PRODUCTION_CANARY_ADMIN_USER_ID || "";
  if(env.CLOUD_RUN_JOB!=="examtree-qs-prod-one-run-enqueue" ||
     env.CLOUD_RUN_TASK_COUNT!=="1" || env.CLOUD_RUN_TASK_INDEX!=="0" ||
     env.CLOUD_RUN_TASK_ATTEMPT!=="0" ||
     env.GOOGLE_CLOUD_PROJECT!=="sarbedutech" ||
     env.EXAMTREE_API_RUNTIME!=="cloud-run" ||
     env.EXAMTREE_API_STAGING!=="false" ||
     env.EXAMTREE_QS_PRODUCTION_CANARY_ENQUEUE_APPROVED!=="true" ||
     env.EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED!=="true" ||
     env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED!=="true" ||
     !UUID.test(runId) || !UUID.test(adminId) || !ACTOR.test(actor)) {
    throw new Error("QS_CANARY_ENQUEUE_NOT_AUTHORIZED");
  }
  assertProdCanaryRequest(runId,env,now);
  return {runId,actor,adminId};
}
export function canarySnapshot(runId:string) {
  return {
    request:{engineId:"knowledge-v1" as const,packageId:"COM-001",
      canonicalProblemId:"COM-001-CP-001",language:"en" as const,
      difficulty:"Easy" as const,count:1,seed:"qs-async:"+runId},
    count:1,selectedCpIds:["COM-001-CP-001"],queueVersion:1 as const
  };
}
export async function enqueueOneCanary() {
  const {runId,actor,adminId}=assertCanaryEnqueueEnvironment();
  const snapshot=canarySnapshot(runId);
  if(!isProdCanarySnapshot(snapshot))throw new Error("QS_CANARY_INVALID_SNAPSHOT");
  validateAsyncTaskComputeInput(snapshot);
  const snapshotJson=JSON.stringify({...snapshot,requestedByFirebaseUid:actor});
  const hash=createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  const audit=JSON.stringify({source:"isolated-prod-canary",packageId:"COM-001",
    canonicalProblemId:"COM-001-CP-001",count:1,queueVersion:1});
  // No DB connection or query until all scope and package checks pass.
  const {sqlClient}=await import("../lib/db");
  try {
    await sqlClient.begin(async tx=>{
      await tx.unsafe("SELECT pg_advisory_xact_lock(738201,101)");
      // Canary request attribution must use one active Firebase-linked,
      // unprivileged test user. Never trust independently supplied IDs.
      const admin=await tx.unsafe(
        "SELECT u.id FROM identity.users u "+
        "JOIN identity.auth_identities ai ON ai.user_id=u.id "+
        "AND ai.provider='firebase' AND ai.provider_subject=$2 "+
        "LEFT JOIN identity.admin_profiles ap ON ap.user_id=u.id "+
        "WHERE u.id=$1::uuid AND u.status='active' AND u.deleted_at IS NULL "+
        "AND ap.user_id IS NULL "+
        "AND NOT EXISTS (SELECT 1 FROM identity.user_roles ur "+
        "WHERE ur.user_id=u.id AND ur.revoked_at IS NULL "+
        "AND ur.valid_from<=now() AND (ur.valid_until IS NULL OR ur.valid_until>now())) "+
        "LIMIT 1",
        [adminId,actor]);
      if(admin.length!==1)throw new Error("QS_CANARY_TEST_IDENTITY_INVALID");
      const existing=await tx.unsafe(
        "SELECT (SELECT COUNT(*)::int FROM content.generation_runs WHERE status::text IN ('queued','running')) AS active_runs, "+
        "(SELECT COUNT(*)::int FROM platform.outbox_events WHERE event_type='question_studio.generation_run.queued.v1' "+
        "AND published_at IS NULL) AS pending_events, "+
        "(SELECT COUNT(*)::int FROM content.generation_enqueue_idempotency "+
        "WHERE idempotency_key LIKE 'qs-prod-canary:%') AS prior_canaries");
      if(Number(existing[0]?.active_runs)!==0 ||
         Number(existing[0]?.pending_events)!==0 ||
         Number(existing[0]?.prior_canaries)!==0)
        throw new Error("QS_CANARY_ENQUEUE_EXISTING_WORK");
      const publicCode="GEN-CANARY-"+runId.slice(0,8).toUpperCase();
      await tx.unsafe(
        "INSERT INTO content.generation_runs "+
        "(id,public_code,requested_by,status,attempt_number,prompt_snapshot,request_snapshot,"+
        "provider,model,prompt_tokens,completion_tokens,estimated_cost_paise,actual_cost_paise,due_at,created_at,updated_at) "+
        "VALUES ($1::uuid,$2,$3::uuid,'queued'::generation_run_status,1,$4,($5::text)::jsonb,"+
        "'examtree','question-studio-universal-v1',0,0,0,0,now()+interval '10 minutes',now(),now())",
        [runId,publicCode,adminId,
         "Production one-run review-only COM-001-CP-001 canary",snapshotJson]);
      await tx.unsafe(
        "INSERT INTO content.generation_enqueue_idempotency "+
        "(actor_firebase_uid,idempotency_key,request_sha256,generation_run_id) "+
        "VALUES ($1,$2,$3,$4::uuid)",
        [actor,"qs-prod-canary:"+runId,hash,runId]);
      await tx.unsafe(
        "INSERT INTO platform.outbox_events "+
        "(id,aggregate_type,aggregate_id,event_type,payload) "+
        "VALUES ($1::uuid,'generation_run',$2::uuid,'question_studio.generation_run.queued.v1',($3::text)::jsonb)",
        [randomUUID(),runId,JSON.stringify({runId,queueVersion:1})]);
      await tx.unsafe(
        "INSERT INTO platform.audit_events "+
        "(id,actor_type,actor_user_id,action_key,entity_type,entity_id,reason,summary,metadata) "+
        "VALUES ($1::uuid,'user'::audit_actor_type,$2::uuid,"+
        "'question_studio.production_canary.queued','generation_run',$3::uuid,$4,$5,($6::text)::jsonb)",
        [randomUUID(),adminId,runId,"Isolated operator-approved smoke test",
         "One Computer GK question queued for admin review only",audit]);
    });
    console.log("PASS: one run + unique reservation + outbox + audit committed in one transaction");
    console.log("RUN_ID: "+runId);
    console.log("NOTE: no task creation, queue resume or generation");
  } finally {
    await sqlClient.end({timeout:5});
  }
}
if(process.argv[1]?.endsWith("prod-one-run-enqueue.mjs")) {
  enqueueOneCanary().catch(error=>{
    const codes=new Set(["QS_CANARY_ENQUEUE_NOT_AUTHORIZED",
      "QS_PRODUCTION_CANARY_SCOPE_DENIED","QS_CANARY_INVALID_SNAPSHOT",
      "QS_CANARY_TEST_IDENTITY_INVALID","QS_CANARY_ENQUEUE_EXISTING_WORK"]);
    const code=error instanceof Error?error.message:"";
    console.error("STOP: "+(codes.has(code)?code:"QS_CANARY_ENQUEUE_FAILED"));
    process.exitCode=2;
  });
}
