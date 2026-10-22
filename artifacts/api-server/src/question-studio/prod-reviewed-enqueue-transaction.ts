// Isolated, opt-in, one-question production review enqueue transaction.
// Not called by the legacy COM-001 canary entrypoint or any HTTP route.
// No task dispatch or queue resume. A distinct, reviewed release must wire it.
import {createHash,randomUUID} from "node:crypto";
import {readFileSync} from "node:fs";
import path from "node:path";
import {authorizeProductionReviewEnqueue} from "./prod-review-enqueue-preflight.mjs";
import {validateAsyncTaskComputeInput} from "./async-task-package-capabilities";

const ID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ACTOR=/^[a-zA-Z0-9:_-]{1,128}$/;
export function prepareProductionReviewEnqueue(env:NodeJS.ProcessEnv=process.env,now=Date.now()) {
  const runId=env.EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID||"";
  const actor=env.EXAMTREE_QS_PRODUCTION_CANARY_ADMIN_UID||"";
  const adminId=env.EXAMTREE_QS_PRODUCTION_CANARY_ADMIN_USER_ID||"";
  if(!ID.test(runId)||!ID.test(adminId)||!ACTOR.test(actor))
    throw Error("QS_PROD_REVIEW_ENQUEUE_INVALID_IDENTITY");
  let scope,manifest;
  try {
    const raw=env.EXAMTREE_QS_PRODUCTION_REVIEW_SCOPE_JSON;
    if(typeof raw!=="string"||raw.length>8192)throw Error("scope");
    scope=JSON.parse(raw);
    if(!Array.isArray(scope)||scope.length!==1)throw Error("scope");
    for(const candidate of [
      path.join(process.cwd(),"artifacts/api-server/dist/question-studio-capabilities.json"),
      path.join(process.cwd(),"dist/question-studio-capabilities.json")
    ]){try{manifest=JSON.parse(readFileSync(candidate,"utf8"));break;}catch{}}
  } catch {throw Error("QS_PROD_REVIEW_ENQUEUE_SCOPE_MISSING");}
  const item=scope[0];
  if(!item||typeof item.engineId!=="string"||typeof item.packageId!=="string"||
     typeof item.cpId!=="string"||item.reviewOnly!==true)
    throw Error("QS_PROD_REVIEW_ENQUEUE_SCOPE_MISSING");
  const snapshot={queueVersion:1 as const,count:1,selectedCpIds:[item.cpId],
    request:{engineId:item.engineId,packageId:item.packageId,
      canonicalProblemId:item.cpId,language:"en" as const,
      difficulty:"Easy" as const,count:1,seed:"qs-async:"+runId}};
  if(!authorizeProductionReviewEnqueue(runId,snapshot,manifest,scope,env,now))
    throw Error("QS_PROD_REVIEW_ENQUEUE_DENIED");
  validateAsyncTaskComputeInput(snapshot);
  return {runId,actor,adminId,snapshot};
}
export async function enqueueOneProductionReview() {
  // No SQL client is imported before all pure authorization checks complete.
  const {runId,actor,adminId,snapshot}=prepareProductionReviewEnqueue();
  const requestJson=JSON.stringify({...snapshot,requestedByFirebaseUid:actor});
  const hash=createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  const metadata=JSON.stringify({source:"isolated-prod-review",engineId:snapshot.request.engineId,
    packageId:snapshot.request.packageId,canonicalProblemId:snapshot.request.canonicalProblemId,
    count:1,queueVersion:1,reviewOnly:true});
  const {sqlClient}=await import("../lib/db");
  try {
    await sqlClient.begin(async tx=>{
      // Same global lock as the old canary; protects the zero-pending-work baseline.
      await tx.unsafe("SELECT pg_advisory_xact_lock(738201,101)");
      const identity=await tx.unsafe(
        "SELECT u.id FROM identity.users u "+
        "JOIN identity.auth_identities ai ON ai.user_id=u.id "+
        "AND ai.provider='firebase' AND ai.provider_subject=$2 "+
        "LEFT JOIN identity.admin_profiles ap ON ap.user_id=u.id "+
        "WHERE u.id=$1::uuid AND u.status='active' AND u.deleted_at IS NULL "+
        "AND ap.user_id IS NULL "+
        "AND NOT EXISTS (SELECT 1 FROM identity.user_roles ur "+
        "WHERE ur.user_id=u.id AND ur.revoked_at IS NULL "+
        "AND ur.valid_from<=now() AND (ur.valid_until IS NULL OR ur.valid_until>now())) LIMIT 1",
        [adminId,actor]);
      if(identity.length!==1)throw Error("QS_PROD_REVIEW_TEST_IDENTITY_INVALID");
      const pending=await tx.unsafe(
        "SELECT (SELECT COUNT(*)::int FROM content.generation_runs "+
        "WHERE status::text IN ('queued','running')) AS active_runs, "+
        "(SELECT COUNT(*)::int FROM platform.outbox_events "+
        "WHERE event_type='question_studio.generation_run.queued.v1' "+
        "AND published_at IS NULL) AS pending_events, "+
        "(SELECT COUNT(*)::int FROM content.generation_enqueue_idempotency "+
        "WHERE idempotency_key=$1) AS existing_run",["qs-prod-review:"+runId]);
      if(pending.length!==1||Number(pending[0].active_runs)!==0||
         Number(pending[0].pending_events)!==0||
         Number(pending[0].existing_run)!==0)
        throw Error("QS_PROD_REVIEW_ENQUEUE_NOT_IDLE");
      const code="GEN-REVIEW-"+runId.slice(0,8).toUpperCase();
      await tx.unsafe(
        "INSERT INTO content.generation_runs "+
        "(id,public_code,requested_by,status,attempt_number,prompt_snapshot,request_snapshot,"+
        "provider,model,prompt_tokens,completion_tokens,estimated_cost_paise,actual_cost_paise,due_at,created_at,updated_at) "+
        "VALUES ($1::uuid,$2,$3::uuid,'queued'::generation_run_status,1,$4,($5::text)::jsonb,"+
        "'examtree','question-studio-universal-v1',0,0,0,0,now()+interval '10 minutes',now(),now())",
        [runId,code,adminId,"Production one-run review-only "+snapshot.request.packageId+
         "/"+snapshot.request.canonicalProblemId,requestJson]);
      await tx.unsafe("INSERT INTO content.generation_enqueue_idempotency "+
        "(actor_firebase_uid,idempotency_key,request_sha256,generation_run_id) "+
        "VALUES ($1,$2,$3,$4::uuid)",[actor,"qs-prod-review:"+runId,hash,runId]);
      await tx.unsafe("INSERT INTO platform.outbox_events "+
        "(id,aggregate_type,aggregate_id,event_type,payload) "+
        "VALUES ($1::uuid,'generation_run',$2::uuid,'question_studio.generation_run.queued.v1',($3::text)::jsonb)",
        [randomUUID(),runId,JSON.stringify({runId,queueVersion:1})]);
      await tx.unsafe("INSERT INTO platform.audit_events "+
        "(id,actor_type,actor_user_id,action_key,entity_type,entity_id,reason,summary,metadata) "+
        "VALUES ($1::uuid,'user'::audit_actor_type,$2::uuid,"+
        "'question_studio.production_canary.queued','generation_run',$3::uuid,$4,$5,($6::text)::jsonb)",
        [randomUUID(),adminId,runId,"Isolated approved review-only test",
         "One approved "+snapshot.request.packageId+" question queued for admin review",metadata]);
    });
    console.info("QS_PROD_REVIEW_SINGLE_RUN_QUEUED",{runId});
  } finally {await sqlClient.end({timeout:5});}
}
