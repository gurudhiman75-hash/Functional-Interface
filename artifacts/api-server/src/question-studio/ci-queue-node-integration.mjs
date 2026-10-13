// CI-only integration harness. Executes the REAL enqueue, claim and review
// persistence modules against disposable PostgreSQL 17. Engine registry and
// deterministic generation are deliberately mocked: test is for DB effects,
// not Cloud Tasks delivery or content quality. Never points at Neon.
import assert from "node:assert/strict";
import {build} from "esbuild";
import postgres from "postgres";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
import {randomUUID} from "node:crypto";

if(process.env.QS_CI_ISOLATED_POSTGRES!=="yes" ||
   !process.env.DATABASE_URL?.startsWith("postgres://examtree_ci:")){
  throw new Error("REFUSED: integration test must run on disposable CI PostgreSQL only");
}

const mockModules={
  "db":`import postgres from "postgres"; export const sqlClient=postgres(process.env.DATABASE_URL,{max:12});`,
  "executor":`
    export function validateUniversalStudioComputeInput(input) {
      if (!input || input.request?.engineId!=="reasoning-v1" ||
        input.request?.packageId!=="OPS-001" ||
        !Number.isInteger(input.count) || input.count<1 || input.count>3 ||
        input.request.count!==input.count ||
        !Array.isArray(input.selectedCpIds) ||
        input.request.language!=="en" ||
        input.request.difficulty!=="Mixed") throw new Error("Invalid mock OPS-001 compute input");
      return {engineId:"reasoning-v1",packageId:"OPS-001"};
    }
  `,
  "registry":`
    export function listQuestionStudioPackages() {
      return [{packageId:"OPS-001",engineId:"reasoning-v1",enabled:true,
        lifecycleStage:"review",reviewSurfaceRequired:true,
        manualApprovalRequired:true,questionBankWritable:false,
        testEligible:false,publiclyPublishable:false,
        automaticStudentPublication:false,productionReleaseAuthorized:false}];
    }
  `,
};
const isolatedSource={
  name:"qs-ephemeral-test-dependencies",
  setup(buildCtx){
    buildCtx.onResolve({filter:/^\.\.\/lib\/db$/},()=>({path:"db",namespace:"qs-ci-deps"}));
    buildCtx.onResolve({filter:/^\.\/(?:universal-executor|engine-registry)$/},arg=>({
      path:arg.path.includes("universal-executor")?"executor":"registry",
      namespace:"qs-ci-deps",
    }));
    buildCtx.onLoad({filter:/.*/,namespace:"qs-ci-deps"},arg=>({
      contents:mockModules[arg.path],loader:"js",resolveDir:process.cwd(),
    }));
  },
};

await build({
  entryPoints:{
    enqueue:"src/question-studio/async-enqueue-foundation.ts",
    claim:"src/question-studio/async-task-lease-claim.ts",
    commit:"src/question-studio/async-review-commit.ts",
  },
  outdir:"dist/qs-ci-integration",outExtension:{".js":".mjs"},
  bundle:true,splitting:true,platform:"node",format:"esm",target:"node22",
  packages:"external",plugins:[isolatedSource],logLevel:"warning",
});

const location=(name)=>pathToFileURL(resolve("dist/qs-ci-integration/"+name+".mjs")).href;
const {recordQuestionStudioEnqueueIntent:enqueue}=await import(location("enqueue"));
const {claimQuestionStudioAsyncTask:claim}=await import(location("claim"));
const {commitQuestionStudioAsyncReview:save}=await import(location("commit"));
const sql=postgres(process.env.DATABASE_URL,{max:3});
const ACTOR="ci-queue-admin";
const makeInput=(key,count=2)=>({
  identity:{actorFirebaseUid:ACTOR,idempotencyKey:key},
  compute:{
    request:{engineId:"reasoning-v1",packageId:"OPS-001",
      topic:"Mathematical Operations",subtopic:"Operations",
      count,language:"en",difficulty:"Mixed"},
    count,selectedCpIds:[],
  },
});
const fakeBatch=(count=2)=>({
  engineId:"reasoning-v1",packageId:"OPS-001",
  generationContexts:[{context:{engineId:"reasoning-v1",cpId:"OPS-CP-001"}}],
  quantPlan:null,
  questions:Array.from({length:count},(_,i)=>({
    stem:"Synthetic mathematical operation "+(i+1),
    options:["12","13","14","15"],correctIndex:2,
    explanation:"Only CI-generated fixture, not a real exam question",
    lifecycleStage:"approved",questionBankWritable:true,publiclyPublishable:true,
  })),
});
async function getCounts(id) {
  const [row]=await sql`
    SELECT r.status::text AS status,
      (SELECT count(*)::int FROM content.generation_run_items WHERE generation_run_id=r.id) AS items,
      (SELECT count(*)::int FROM content.generation_item_versions v
        JOIN content.generation_run_items i ON i.id=v.generation_item_id
        WHERE i.generation_run_id=r.id AND v.version_number=1) AS versions,
      (SELECT count(*)::int FROM platform.audit_events a
        WHERE a.entity_id=r.id) AS audits,
      (SELECT count(*)::int FROM platform.outbox_events o
        WHERE o.aggregate_id=r.id) AS outbox
    FROM content.generation_runs r WHERE r.id=${id}::uuid
  `;
  return row;
}
function assertOneBatch(row) {
  assert.equal(row.status,"review");
  assert.equal(row.items,2);
  assert.equal(row.versions,2);
  assert.equal(row.audits,2); // enqueue + review
  assert.equal(row.outbox,2); // queue + review
}
async function run(){
  process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED="false";
  process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED="false";
  await assert.rejects(()=>enqueue(makeInput("disabled-run-0001")),/not been enabled/);
  process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED="true";
  process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED="true";
  process.env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED="true";
  process.env.EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED="true";
  process.env.EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED="true";

  // Two actual Node transactions racing with the same key must reuse one run.
  const [a,b]=await Promise.all([
    enqueue(makeInput("concurrent-key-0001")),
    enqueue(makeInput("concurrent-key-0001")),
  ]);
  assert.equal(a.id,b.id);
  assert.deepEqual([a.reused,b.reused].sort(),[false,true]);
  const [reservations]=await sql`
    SELECT count(*)::int AS n FROM content.generation_enqueue_idempotency
    WHERE actor_firebase_uid=${ACTOR} AND idempotency_key='concurrent-key-0001'
  `;
  assert.equal(reservations.n,1);
  await assert.rejects(()=>enqueue(makeInput("concurrent-key-0001",1)),e=>e.code==="GENERATION_IDEMPOTENCY_CONFLICT");
  let row=await getCounts(a.id);
  assert.equal(row.status,"queued");assert.equal(row.items,0);
  assert.equal(row.audits,1);assert.equal(row.outbox,1);
  console.log("PASS: actual Node concurrent enqueue, one canonical run, replay, 409 changed request");

  const owner=await claim(a.id);
  assert.equal(owner.kind,"claimed");
  assert.equal(owner.attemptNumber,1);
  assert.equal((await claim(a.id)).kind,"busy");
  await assert.rejects(()=>save({runId:a.id,leaseToken:randomUUID(),batch:fakeBatch()}),
    e=>e.code==="ASYNC_REVIEW_STALE_LEASE");
  assert.equal((await getCounts(a.id)).items,0);
  const committed=await save({runId:a.id,leaseToken:owner.leaseToken,batch:fakeBatch()});
  assert.equal(committed.status,"review");
  assertOneBatch(await getCounts(a.id));
  const again=await save({runId:a.id,leaseToken:owner.leaseToken,batch:fakeBatch()});
  assert.equal(again.status,"already_committed");
  assert.equal((await claim(a.id)).kind,"terminal");
  assertOneBatch(await getCounts(a.id));
  const [firstItem]=await sql`
    SELECT v.payload FROM content.generation_item_versions v
    JOIN content.generation_run_items i ON i.id=v.generation_item_id
    WHERE i.generation_run_id=${a.id}::uuid LIMIT 1
  `;
  assert.equal(firstItem.payload.questionBankWritable,false);
  assert.equal(firstItem.payload.publiclyPublishable,false);
  assert.equal(firstItem.payload.validationResult,"pending");
  console.log("PASS: live claim, duplicate busy, wrong-token refusal, atomic save and replay no duplicate");
  
  // Force the REAL second version INSERT to fail inside a real transaction.
  // All earlier inserts and the status update must roll back together.
  await sql`
    CREATE FUNCTION public.ci_fail_second_version() RETURNS trigger
    LANGUAGE plpgsql AS $$
    BEGIN
      IF (SELECT item_number FROM content.generation_run_items
          WHERE id=NEW.generation_item_id)=2 THEN
        RAISE EXCEPTION 'CI_INJECTED_SECOND_VERSION_FAILURE';
      END IF;
      RETURN NEW;
    END $$`;
  await sql`
    CREATE TRIGGER ci_reject_second_review_version
    BEFORE INSERT ON content.generation_item_versions
    FOR EACH ROW EXECUTE FUNCTION public.ci_fail_second_version()`;
  const rollbackRun=await enqueue(makeInput("rollback-key-0001"));
  const rollbackOwner=await claim(rollbackRun.id);
  assert.equal(rollbackOwner.kind,"claimed");
  await assert.rejects(()=>save({
    runId:rollbackRun.id,leaseToken:rollbackOwner.leaseToken,batch:fakeBatch(),
  }),/CI_INJECTED_SECOND_VERSION_FAILURE/);
  row=await getCounts(rollbackRun.id);
  assert.equal(row.status,"running");assert.equal(row.items,0);
  assert.equal(row.versions,0);assert.equal(row.audits,1);assert.equal(row.outbox,1);
  await sql`DROP TRIGGER ci_reject_second_review_version ON content.generation_item_versions`;
  await sql`DROP FUNCTION public.ci_fail_second_version()`;
  const recovered=await save({
    runId:rollbackRun.id,leaseToken:rollbackOwner.leaseToken,batch:fakeBatch(),
  });
  assert.equal(recovered.status,"review");
  assertOneBatch(await getCounts(rollbackRun.id));
  console.log("PASS: real transaction rollback after first item, no half-written review, recover");

  // A lost/expired 240-second lease must be fenced by a fresh token.
  const staleRun=await enqueue(makeInput("stale-lease-key-0001"));
  const old=await claim(staleRun.id);
  assert.equal(old.kind,"claimed");
  await sql`
    UPDATE content.generation_run_task_leases
    SET claimed_at=now()-interval '10 minutes',
        lease_expires_at=now()-interval '1 second'
    WHERE generation_run_id=${staleRun.id}::uuid
  `;
  const next=await claim(staleRun.id);
  assert.equal(next.kind,"claimed");
  assert.equal(next.attemptNumber,2);
  assert.notEqual(next.leaseToken,old.leaseToken);
  await assert.rejects(()=>save({
    runId:staleRun.id,leaseToken:old.leaseToken,batch:fakeBatch(),
  }),e=>e.code==="ASYNC_REVIEW_STALE_LEASE");
  assert.equal((await getCounts(staleRun.id)).items,0);
  await save({runId:staleRun.id,leaseToken:next.leaseToken,batch:fakeBatch()});
  assertOneBatch(await getCounts(staleRun.id));
  console.log("PASS: stale worker fenced after real DB lease reclamation");

  // Cancelled tasks must neither claim nor generate review records.
  const cancelled=await enqueue(makeInput("cancelled-key-0001"));
  await sql`UPDATE content.generation_runs SET status='cancelled'::generation_run_status WHERE id=${cancelled.id}::uuid`;
  assert.equal((await claim(cancelled.id)).kind,"terminal");
  assert.equal((await getCounts(cancelled.id)).items,0);
  console.log("PASS: cancelled run is terminal, no additional review items");

  // These database assertions do not prove Cloud Tasks IAM, signed OIDC,
  // real worker compute or user-facing admin Generate integration.
  console.log("PASS: real Node enqueue -> leased claim -> fenced review -> Neon-shaped SQL transaction");
}
try {
  await run();
  await sql.end({timeout:2});
  process.exit(0);
} catch(e) {
  console.error("FAIL: isolated Question Studio queue Node integration",e?.code||"",e?.message||String(e));
  await sql.end({timeout:1}).catch(()=>{});
  process.exit(1);
}
