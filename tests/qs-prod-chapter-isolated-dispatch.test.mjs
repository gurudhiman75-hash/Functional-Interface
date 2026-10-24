import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  assertIsolatedChapterDispatch,CHAPTER_DISPATCH_QUEUE
} from "../artifacts/api-server/src/question-studio/prod-chapter-dispatch-policy.mjs";

const RUN="4f54a84b-f143-4892-8dbc-38a39dc82111";
const standardQueue="examtree-qs-prod";
const origin="https://examtree-qs-receiver-prod-ttnfjefqka-el.a.run.app";
const config={
  projectId:"sarbedutech",region:"asia-south1",
  queueId:CHAPTER_DISPATCH_QUEUE,
  serviceAccount:"examtree-qs-task-prod@sarbedutech.iam.gserviceaccount.com",
  handlerUrl:origin+"/internal/question-studio/async-task",
  audience:origin,
};
const enginePackages=[
  ["quant-v4","TRG-002"],["reasoning-v1","OPS-001"],
  ["language-v1","ENG-001"],["knowledge-v1","COM-001"]
];
const manifest={
  source:"canonical-question-studio-engine-registry",
  schemaVersion:1,
  packages:enginePackages.map(([engineId,packageId])=>({
    engineId,packageId,enabled:true,lifecycleStage:"REVIEW_ONLY",
    manualApprovalRequired:true,reviewSurfaceRequired:true,
    questionBankWritable:false,productionReleaseAuthorized:false,
    automaticStudentPublication:false,publiclyPublishable:false,
    testEligible:false,mockTestEligible:false,
    cpIds:[packageId+"-CP-001"],supportedLanguages:["en"],
  })),
};
const NOW=Date.parse("2026-10-24T12:00:00Z");
function env(overrides={}){
  return {
    CLOUD_RUN_JOB:"examtree-qs-chapter-dispatch-prod",
    CLOUD_RUN_TASK_COUNT:"1",CLOUD_RUN_TASK_INDEX:"0",
    EXAMTREE_API_RUNTIME:"cloud-run",EXAMTREE_API_STAGING:"false",
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED:"true",
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:"2026-10-24T13:00:00Z",
    EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_APPROVED:"true",
    EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED:"false",
    EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED:"true",
    EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED:"true",
    EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED:"true",
    EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED:"true",
    EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED:"true",
    EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED:"true",
    EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED:"false",
    EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_RUN_ID:RUN,
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify(
      enginePackages.map(([engineId,packageId])=>({
        engineId,packageId,reviewOnly:true,chapterWide:true,
      }))),
    ...overrides,
  };
}

test("four review-only engine families may enter exactly one isolated queue",()=>{
  assert.equal(CHAPTER_DISPATCH_QUEUE,"examtree-qs-chapter-prod");
  assert.equal(assertIsolatedChapterDispatch(env(),config,manifest,NOW),RUN);
  assert.notEqual(CHAPTER_DISPATCH_QUEUE,standardQueue);
});

test("BANK_ONLY sources are allowed only as non-publishing review inputs",()=>{
  const bank={...manifest,packages:manifest.packages.map(p=>
    p.packageId==="TRG-002" ?
      {...p,lifecycleStage:"BANK_ONLY",questionBankWritable:true,
       testEligible:true,mockTestEligible:true} : p)};
  assert.equal(assertIsolatedChapterDispatch(env(),config,bank,NOW),RUN);
  assert.throws(()=>assertIsolatedChapterDispatch(env(),config,
    {...bank,packages:bank.packages.map(p=>p.packageId==="TRG-002" ?
      {...p,automaticStudentPublication:true}:p)},NOW),/SCOPE_INVALID/);
});
test("catalog-wide dispatch admits canonical chapters without enumerating each",()=>{
  const wide=env({EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify({
    mode:"all-eligible-chapters",reviewOnly:true,chapterWide:true
  })});
  assert.equal(assertIsolatedChapterDispatch(wide,config,manifest,NOW),RUN);
  // Unsafe source packages are excluded, while safe chapters stay usable.
  assert.equal(assertIsolatedChapterDispatch(wide,config,{
    ...manifest,packages:manifest.packages.map((p,i)=>i===0?{
      ...p,publiclyPublishable:true}:p)
  },NOW),RUN);
  assert.throws(()=>assertIsolatedChapterDispatch(wide,config,{
    ...manifest,packages:manifest.packages.map(p=>({
      ...p,publiclyPublishable:true
    }))
  },NOW),/CATALOG_INVALID/);
});
test("fail-closed on each missing or conflicting production admission",()=>{
  for(const key of [
    "EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED",
    "EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_APPROVED",
    "EXAMTREE_QS_PRODUCTION_DATABASE_BINDING_VERIFIED",
    "EXAMTREE_QS_PRODUCTION_RECEIVER_OIDC_VERIFIED",
    "EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED",
    "EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED",
  ]){
    assert.throws(()=>assertIsolatedChapterDispatch(
      env({[key]:"false"}),config,manifest,NOW),/NOT_APPROVED/,key);
  }
  for(const bad of [
    {CLOUD_RUN_JOB:"examtree-qs-dispatch-prod"},
    {CLOUD_RUN_TASK_COUNT:"2"},{CLOUD_RUN_TASK_INDEX:"1"},
    {EXAMTREE_API_STAGING:"true"},{EXAMTREE_API_RUNTIME:"render"},
    {EXAMTREE_QS_PRODUCTION_DISPATCH_APPROVED:"true"},
    {EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED:"true"},
    {EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:"2026-10-24T11:00:00Z"},
    {EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_RUN_ID:"not-a-uuid"},
  ])assert.throws(()=>assertIsolatedChapterDispatch(
    env(bad),config,manifest,NOW));
});

test("never sends to normal queue, staging, wrong identity or tagged path",()=>{
  for(const bad of [
    {queueId:standardQueue},{queueId:"examtree-qs-staging"},
    {projectId:"anotherproject"},
    {serviceAccount:"examtree-qs-test@sarbedutech.iam.gserviceaccount.com"},
    {handlerUrl:"https://example.com/internal/question-studio/async-task"},
    {handlerUrl:"https://qs-chapter-verify---examtree-qs-receiver-prod-ttnfjefqka-el.a.run.app/internal/question-studio/async-task"},
    {audience:"https://somewhere.run.app"},
  ])assert.throws(()=>assertIsolatedChapterDispatch(
    env(),{...config,...bad},manifest,NOW));
});

test("fail closed for wildcard or non-reviewed canonical package scope",()=>{
  assert.throws(()=>assertIsolatedChapterDispatch(
    env({EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:'[{"engineId":"quant-v4","packageId":"*","reviewOnly":true,"chapterWide":true}]'}),
    config,manifest,NOW));
  assert.throws(()=>assertIsolatedChapterDispatch(
    env(),config,{...manifest,packages:manifest.packages.map(p=>
      p.packageId==="COM-001"?{...p,publiclyPublishable:true}:p)},NOW),
    /SCOPE_INVALID/);
});

test("event type and idempotency channel are disjoint from normal dispatcher",()=>{
  const foundation=readFileSync("artifacts/api-server/src/question-studio/async-enqueue-foundation.ts","utf8");
  const router=readFileSync("artifacts/api-server/src/routes/admin-question-studio-async-production-chapters.ts","utf8");
  const dispatch=readFileSync("artifacts/api-server/src/question-studio/async-cloud-tasks-dispatcher.ts","utf8");
  const normal=readFileSync("artifacts/api-server/src/question-studio/async-cloud-tasks-dispatch-prod-once.ts","utf8");
  const generic=readFileSync("artifacts/api-server/src/lib/outbox-publisher.ts","utf8");
  const chapter=readFileSync("artifacts/api-server/src/question-studio/async-cloud-tasks-dispatch-prod-chapter-once.ts","utf8");
  assert.match(foundation,/question_studio\.generation_run\.chapter_review_queued\.v1/);
  assert.match(foundation,/chapter:.*createHash\("sha256"\)/s);
  assert.match(foundation,/channel === "chapter_review"/);
  assert.match(router,/\}, "chapter_review"\)/);
  assert.match(dispatch,/WHERE e\.event_type = \$\{eventType\}/);
  assert.match(dispatch,/e\.aggregate_id = \$\{chapterRunId \?\? null\}::uuid/);
  assert.match(dispatch,/payload\?\.channel !== "chapter_review"/);
  assert.match(dispatch,/guard\(event\.requestSnapshot\)/);
  assert.match(normal,/runQuestionStudioTaskDispatchOnce\(\)/);
  assert.match(chapter,/runQuestionStudioTaskDispatchOnce\(\{chapterReviewRunId:runId\}\)/);
  assert.doesNotMatch(normal,/chapterReviewRunId/);
  assert.ok(generic.includes("AND event_type <> 'question_studio.generation_run.chapter_review_queued.v1'"));
});

test("build-only artifact includes immutable canonical manifest; no deployment commands",()=>{
  const docker=readFileSync("Dockerfile.examtree-qs-prod-chapter-dispatcher","utf8");
  const build=readFileSync("artifacts/api-server/build-qs-prod-chapter-dispatcher.mjs","utf8");
  const cloudbuild=readFileSync("cloudbuild.examtree-qs-prod-chapter-dispatcher-build-only.yaml","utf8");
  for(const required of ["question-studio-capabilities.json","qs-prod-chapter-dispatch-once.mjs"])
    assert.ok(docker.includes(required) && build.includes(required),required);
  assert.match(build,/build-async-task-capabilities-manifest\.ts/);
  assert.match(cloudbuild,/tests\/qs-prod-chapter-isolated-dispatch\.test\.mjs/);
  for(const content of [docker,build,cloudbuild]){
    assert.doesNotMatch(content,/gcloud\s+(?:run|tasks|scheduler)/);
    assert.doesNotMatch(content,/\bdeploy\b\s+--/);
  }
});
