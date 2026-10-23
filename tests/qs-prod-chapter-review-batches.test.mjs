import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  MAX_CHAPTER_REVIEW_BATCH,validateProductionChapterReview,
  productionChapterReleaseActive,readProductionChapterScope
} from "../artifacts/api-server/src/question-studio/prod-chapter-review-policy.mjs";

const cases=[
  ["quant-v4","TRG-002",["TRG-CP-007","TRG-CP-008"]],
  ["reasoning-v1","OPS-001",["OPS-CP-001","OPS-CP-002"]],
  ["language-v1","ENG-001",["ENG-001-CP012","ENG-001-CP013"]],
  ["knowledge-v1","COM-001",["COM-001-CP-001","COM-001-CP-002"]],
];
const RUN="9d2e5ab4-871c-4d0e-94af-627913ac8b50";
function pkg(engineId,packageId,cpIds) {
  return {engineId,packageId,cpIds,enabled:true,lifecycleStage:"REVIEW_ONLY",
    supportedLanguages:["en","hi","pa"],supportedDifficulties:["Easy","Medium","Hard"],
    reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankWritable:false,
    productionReleaseAuthorized:false,automaticStudentPublication:false,
    publiclyPublishable:false,testEligible:false,mockTestEligible:false};
}
function manifest(...packages) {
  return {source:"canonical-question-studio-engine-registry",
    schemaVersion:1,packages};
}
function scope(engineId,packageId) {
  return [{engineId,packageId,reviewOnly:true,chapterWide:true}];
}
function snapshot(engineId,packageId,selectedCpIds=[],count=10) {
  return {queueVersion:1,count,selectedCpIds,request:{
    engineId,packageId,count,difficulty:"Mixed",language:"en"
  }};
}
for(const [engine,p,cp] of cases){
  const m=manifest(pkg(engine,p,cp)),s=scope(engine,p);
  test(engine+" chapter batch supports every canonical CP without listing each CP",()=>{
    assert.equal(validateProductionChapterReview(snapshot(engine,p),m,s),true);
    assert.equal(validateProductionChapterReview(snapshot(engine,p,cp,2),m,s),true);
    const server=snapshot(engine,p,cp,2);
    server.request.seed="qs-async:"+RUN;
    assert.equal(validateProductionChapterReview(server,m,s,{runId:RUN}),true);
  });
  test(engine+" blocks unauthorized package, CP, and lifecycle escalation",()=>{
    assert.equal(validateProductionChapterReview(snapshot(engine,"FAKE-001"),m,s),false);
    assert.equal(validateProductionChapterReview(snapshot(engine,p,["UNKNOWN-CP"],1),m,s),false);
    for(const changed of [
      {questionBankWritable:true},{automaticStudentPublication:true},
      {productionReleaseAuthorized:true},{manualApprovalRequired:false},
      {publiclyPublishable:true},{lifecycleStage:"BANK_ONLY"},
      {testEligible:true},{mockTestEligible:true},{reviewSurfaceRequired:false}
    ]){
      assert.equal(validateProductionChapterReview(snapshot(engine,p),
        manifest({...pkg(engine,p,cp),...changed}),s),false);
    }
  });
}
test("production batches capped and CP filter cannot exceed batch count",()=>{
  const [e,p,cp]=cases[0],m=manifest(pkg(e,p,cp)),s=scope(e,p);
  assert.equal(MAX_CHAPTER_REVIEW_BATCH,20);
  for(const count of [0,21,50,1.5]){
    assert.equal(validateProductionChapterReview(snapshot(e,p,[],count),m,s),false);
  }
  assert.equal(validateProductionChapterReview(snapshot(e,p,cp,1),m,s),false);
  assert.equal(validateProductionChapterReview(snapshot(e,p,[cp[0],cp[0]],2),m,s),false);
  assert.equal(validateProductionChapterReview(snapshot(e,p,[cp[0]],2),m,s),true);
  assert.equal(validateProductionChapterReview({...snapshot(e,p),selectedCpIds:[] ,
    request:{...snapshot(e,p).request,canonicalProblemId:cp[0]}},m,s),false);
});
test("no unauthorized seeds or mismatched signed task run",()=>{
  const [e,p,cp]=cases[2],m=manifest(pkg(e,p,cp)),s=scope(e,p);
  const snap=snapshot(e,p);
  snap.request.seed="untrusted-seed";
  assert.equal(validateProductionChapterReview(snap,m,s),false);
  snap.request.seed="qs-async:"+RUN;
  assert.equal(validateProductionChapterReview(snap,m,s,{runId:RUN}),true);
  assert.equal(validateProductionChapterReview(snap,m,s,
    {runId:"11d4e1cc-f691-4820-9d90-846da41d01d7"}),false);
});
test("release requires explicit prod opt-in and future 24-hour expiry",()=>{
  const now=Date.parse("2026-10-23T08:00:00Z");
  const env={EXAMTREE_API_RUNTIME:"cloud-run",EXAMTREE_API_STAGING:"false",
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED:"true",
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:"2026-10-23T09:00:00Z"};
  assert.equal(productionChapterReleaseActive(env,now),true);
  assert.equal(productionChapterReleaseActive({...env,
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED:"false"},now),false);
  assert.equal(productionChapterReleaseActive({...env,
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:"2026-10-25T09:00:00Z"},now),false);
  assert.equal(productionChapterReleaseActive({...env,
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:"2026-10-23T07:59:59Z"},now),false);
});
test("scope authorizes full named chapter, not arbitrary package wildcard",()=>{
  const [e,p]=cases[1];
  const env={EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify(scope(e,p))};
  assert.equal(readProductionChapterScope(env)[0].chapterWide,true);
  for(const list of [[],[...scope(e,p),...scope(e,p)],
    [{engineId:e,packageId:"*",reviewOnly:true,chapterWide:true}],
    [{engineId:e,packageId:p,reviewOnly:false,chapterWide:true}],
    [{engineId:e,packageId:p,reviewOnly:true,chapterWide:true,forcePublish:true}]]){
    assert.throws(()=>readProductionChapterScope({
      EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify(list)}));
  }
});
test("live service paths and Docker build include independent chapter checks",()=>{
  const get=p=>readFileSync(p,"utf8");
  const receiver=get("artifacts/api-server/src/async-task-receiver-prod-standalone.ts");
  const worker=get("artifacts/api-server/universal-question-studio-worker-service.mjs");
  const route=get("artifacts/api-server/src/routes/admin-question-studio-async-production-chapters.ts");
  const mount=get("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts");
  const docker=get("Dockerfile.examtree-qs-prod-universal-worker");
  assert.match(receiver,/createProductionChapterSnapshotGuard\(runId\)/);
  assert.match(receiver,/claimQuestionStudioAsyncTask\(\s*runId,chapterGuard/);
  assert.match(worker,/assertProductionChapterWorkerInput\(input\)/);
  assert.match(docker,/question-studio-capabilities\.json/);
  assert.match(route,/requireAdminPermission\("content\.generation\.run"\)/);
  assert.match(route,/EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED/);
  assert.match(route,/validateProductionChapterReview/);
  assert.match(mount,/adminQuestionStudioAsyncProductionChaptersRouter/);
  assert.doesNotMatch(route,/content\.questions/);
});

test("chapter cockpit and admin client remain explicit opt-in, without changing default Generate",()=>{
  const get=p=>readFileSync(p,"utf8");
  const page=get("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx");
  const api=get("artifacts/admin-app/src/features/question-studio/api.ts");
  assert.match(page,/VITE_QUESTION_STUDIO_ASYNC_PRODUCTION_CHAPTER === 'true'/);
  assert.match(page,/enqueueQuestionStudioProductionChapterRun\(asyncInput,/);
  assert.match(page,/const result = await generate\(input\)/);
  assert.match(api,/\/admin\/question-studio\/runs\/async-production-chapter/);
  assert.match(api,/Idempotency-Key/);
  // Seed must come from the server, not client-controlled production input.
  const start=api.indexOf("export function enqueueQuestionStudioProductionChapterRun(");
  const end=api.indexOf("export function updateGenerationItems",start);
  assert.ok(start>=0 && end>start);
  assert.doesNotMatch(api.slice(start,end),/seed: input\.seed/);
});
