import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
const load=(p)=>readFileSync(p,"utf8");
const page=load("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx");
const api=load("artifacts/admin-app/src/features/question-studio/api.ts");
const server=load("artifacts/api-server/src/routes/admin-question-studio.ts");

test("sync Generate remains default unless production chapter review is explicitly opted in",()=>{
  assert.match(page,/VITE_QUESTION_STUDIO_ASYNC_STAGING === 'true'/);
  assert.match(page,/VITE_QUESTION_STUDIO_ASYNC_PRODUCTION_CHAPTER === 'true'/);
  const flags=page.match(/^const (?:STAGING_ASYNC_ENABLED|CHAPTER_ASYNC_ENABLED|ASYNC_ENABLED) = .+;$/gm);
  assert.equal(flags?.length,3,"both independent flags and their combined availability must be declared");
  const initial=page.match(/stagingAsyncSelected, setStagingAsyncSelected\] = useState\(([^)]+)\)/)?.[1];
  assert.ok(initial,"missing initial async selection");
  for(const [staging,chapter,available,selected] of [
    [undefined,undefined,false,false],
    ['true',undefined,true,false],
    [undefined,'true',true,true],
    ['true','true',true,true],
    ['false','false',false,false],
    ['true','TRUE',true,false],
  ]){
    const result=runInNewContext(flags.join('\n').replaceAll('import.meta.env','buildEnv')+
      `\n({available: ASYNC_ENABLED, selected: ${initial}})`,{buildEnv:{
        VITE_QUESTION_STUDIO_ASYNC_STAGING:staging,
        VITE_QUESTION_STUDIO_ASYNC_PRODUCTION_CHAPTER:chapter,
      }});
    assert.equal(result.available,available);
    assert.equal(result.selected,selected);
  }
  assert.match(page,/const result = await generate\(input\)/);
  assert.match(api,/\/admin\/question-studio\/runs['"]/);
  assert.match(page,/enqueueQuestionStudioStagingRun\(asyncInput,/);
  assert.match(api,/\/admin\/question-studio\/runs\/async-staging/);
  assert.match(api,/'Idempotency-Key': idempotencyKey/);
  assert.match(page,/stagingAsyncRetry\.current\.signature !== signature/);
  assert.match(page,/stagingAsyncRetry\.current = null/);
});

test("staging async uses the selected package runtime and keeps synchronous Generate unchanged",()=>{
  assert.match(page,/const asyncInput: CreateGenerationRunInput = \{ \.\.\.input, runtimeMode: activePackage\.runtimeMode \}/);
  assert.match(page,/const signature = JSON\.stringify\(asyncInput\)/);
  assert.match(page,/enqueueQuestionStudioStagingRun\(asyncInput, stagingAsyncRetry\.current\.key\)/);
  assert.match(api,/runtimeMode: input\.runtimeMode/);
  assert.doesNotMatch(api,/runtimeMode: 'review-only'/);
  assert.match(page,/const result = await generate\(input\)/);
  assert.match(page,/caught\.code/);
});

test("async request uses the canonical worker compute envelope",()=>{
  assert.match(api,/request,\s*count: input\.count,\s*selectedCpIds: input\.cpIds \?\? \[\]/);
  for(const property of ["engineId","packageId","exam","subject","topic","subtopic","language","difficulty","count","runtimeMode"]){
    assert.match(api,new RegExp(property.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+":"),"missing canonical request "+property);
  }
});

test("progress polling refreshes Review without creating a second run",()=>{
  assert.match(page,/getQuestionStudioRunProgress\(runId\)/);
  assert.match(page,/setStagingAsyncRun\(progress\)/);
  assert.match(page,/await refreshReviewPage\(\)/);
  assert.match(page,/setWorkspaceView\('review'\)/);
  assert.match(page,/window\.clearTimeout\(timer\)/);
});

test("server Review filtering accepts legacy flat and async nested snapshots",()=>{
  for(const key of ["subject","topic","subtopic","packageId","exam"]){
    assert.ok(server.includes(`COALESCE(r.request_snapshot ->> '${key}', r.request_snapshot -> 'request' ->> '${key}')`),
      `missing nested request fallback for ${key}`);
  }
  assert.match(server,/router\.get\("\/review-page"/);
});
