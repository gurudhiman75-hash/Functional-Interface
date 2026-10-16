import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const load=(p)=>readFileSync(p,"utf8");
const page=load("artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx");
const api=load("artifacts/admin-app/src/features/question-studio/api.ts");
const server=load("artifacts/api-server/src/routes/admin-question-studio.ts");

test("production sync Generate remains the default; async is explicitly staging-only",()=>{
  assert.match(page,/VITE_QUESTION_STUDIO_ASYNC_STAGING === 'true'/);
  assert.match(page,/stagingAsyncSelected, setStagingAsyncSelected] = useState\(false\)/);
  assert.match(page,/const result = await generate\(input\)/);
  assert.match(api,/\/admin\/question-studio\/runs['"]/);
  assert.match(page,/enqueueQuestionStudioStagingRun\(asyncInput,/);
  assert.match(api,/\/admin\/question-studio\/runs\/async-staging/);
  assert.match(api,/'Idempotency-Key': idempotencyKey/);
  assert.match(page,/stagingAsyncRetry\.current\.signature !== signature/);
  assert.match(page,/stagingAsyncRetry\.current = null/);
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
