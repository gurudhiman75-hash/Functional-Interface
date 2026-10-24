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
  test(engine+" blocks unauthorized package, CP, and publication escalation",()=>{
    assert.equal(validateProductionChapterReview(snapshot(engine,"FAKE-001"),m,s),false);
    assert.equal(validateProductionChapterReview(snapshot(engine,p,["UNKNOWN-CP"],1),m,s),false);
    for(const changed of [
      {automaticStudentPublication:true},{productionReleaseAuthorized:true},
      {manualApprovalRequired:false},{publiclyPublishable:true},
      {reviewSurfaceRequired:false},{enabled:false},{cpIds:[]}
    ]){
      assert.equal(validateProductionChapterReview(snapshot(engine,p),
        manifest({...pkg(engine,p,cp),...changed}),s),false);
    }
  });
}
test("canonical BANK_ONLY bank-writable chapter remains eligible for manual review",()=>{
  const [e,p,cp]=cases[0];
  const source={...pkg(e,p,cp),lifecycleStage:"BANK_ONLY",
    questionBankWritable:true,testEligible:true,mockTestEligible:true};
  assert.equal(validateProductionChapterReview(snapshot(e,p),
    manifest(source),scope(e,p)),true);
  // Existing package metadata does not grant automatic student publication.
  for(const changed of [{automaticStudentPublication:true},
                         {productionReleaseAuthorized:true},
                         {publiclyPublishable:true}]){
    assert.equal(validateProductionChapterReview(snapshot(e,p),
      manifest({...source,...changed}),scope(e,p)),false);
  }
});
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
test("catalog-wide scope covers ALL eligible chapters beyond the 100-name limit",()=>{
  const catalog=[];
  for(let n=1;n<=140;n++){
    const [engine]=cases[n%cases.length];
    const id="CAT-"+String(n).padStart(3,"0");
    catalog.push(pkg(engine,id,[id+"-CP-001"]));
  }
  const good=manifest(...catalog,
    {...pkg("knowledge-v1","BLOCKED-001",["BLOCKED-001-CP-001"]),enabled:false},
    {...pkg("quant-v4","BLOCKED-002",["BLOCKED-002-CP-001"]),automaticStudentPublication:true});
  const setting={EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify({
    mode:"all-eligible-chapters",reviewOnly:true,chapterWide:true
  })};
  const granted=readProductionChapterScope(setting,good);
  assert.equal(granted.length,140);
  assert.equal(new Set(granted.map(x=>x.engineId+":"+x.packageId)).size,140);
  assert.ok(granted.every(x=>x.reviewOnly===true && x.chapterWide===true));
  assert.equal(validateProductionChapterReview(snapshot(catalog[0].engineId,catalog[0].packageId),
    good,granted),true);
  assert.equal(validateProductionChapterReview(snapshot("knowledge-v1","BLOCKED-001"),
    good,granted),false);
  assert.equal(validateProductionChapterReview(snapshot("quant-v4","BLOCKED-002"),
    good,granted),false);
});
test("catalog-wide scope fails closed on malformed mode, duplicates, and invalid registry",()=>{
  const [engine,p,cp]=cases[0];
  const env={EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify({
    mode:"all-eligible-chapters",reviewOnly:true,chapterWide:true
  })};
  for(const bad of [
    {mode:"*",reviewOnly:true,chapterWide:true},
    {mode:"all-eligible-chapters",reviewOnly:false,chapterWide:true},
    {mode:"all-eligible-chapters",reviewOnly:true,chapterWide:true,publish:true}
  ])assert.throws(()=>readProductionChapterScope({
    EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify(bad)
  },manifest(pkg(engine,p,cp))),/SCOPE_INVALID/);
  assert.throws(()=>readProductionChapterScope(env,manifest()),/CATALOG_INVALID/);
  assert.throws(()=>readProductionChapterScope(env,
    manifest(pkg(engine,p,cp),pkg(engine,p,cp))),/CATALOG_INVALID/);
  assert.throws(()=>readProductionChapterScope(env,{
    source:"not-canonical",schemaVersion:1,packages:[pkg(engine,p,cp)]
  }),/MANIFEST_INVALID/);
});
test("live service paths and Docker build include independent chapter checks",()=>{
  const get=p=>readFileSync(p,"utf8");
  const receiver=get("artifacts/api-server/src/async-task-receiver-prod-standalone.ts");
  const worker=get("artifacts/api-server/universal-question-studio-worker-service.mjs");
  const route=get("artifacts/api-server/src/routes/admin-question-studio-async-production-chapters.ts");
  const mount=get("artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts");
  const docker=get("Dockerfile.examtree-qs-prod-universal-worker");
  assert.match(receiver,/createProductionChapterSnapshotGuard\(runId\)/);
  assert.match(receiver,/reviewOnlyOutput: Boolean\(chapterGuard\)/);
  const commit=get("artifacts/api-server/src/question-studio/async-review-commit.ts");
  assert.match(commit,/questionBankWritable:false/);
  assert.match(commit,/reviewOnlyOutput/);
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
