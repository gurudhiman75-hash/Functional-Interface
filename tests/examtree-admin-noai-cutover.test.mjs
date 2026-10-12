import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=(p)=>readFileSync(p,"utf8");
const app=read("artifacts/api-server/src/app.ts");
const providers=read("artifacts/api-server/src/lib/ai-providers/index.ts");
const proxy=read("functions/api/[[path]].js");
const deploy=read("scripts/deploy-examtree-cloudrun-admin-noai-zero-traffic.sh");
const verify=read("scripts/verify-examtree-cloudrun-admin-noai-tagged-readonly.sh");

test("production startup tolerates absent AI only for guarded no-provider deterministic admin", ()=>{
  for(const required of [
    'EXAMTREE_API_RUNTIME', 'EXAMTREE_API_STAGING',
    'EXAMTREE_SALES_DISABLED', 'EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER',
    'EXAMTREE_ADMIN_DETERMINISTIC_ONLY',
    'GENERATION_JOB_WORKER_ENABLED','OUTBOX_PUBLISHER_ENABLED'
  ])assert.ok(providers.includes(required), required);
  assert.match(providers,/!temporaryDeterministicAdminBridge/);
  assert.match(providers,/!temporaryAdminRenderBridge/);
  assert.match(providers,/AI_EXTRACTION_REQUIRED/);
  assert.match(providers,/OPENAI_EXTRACTION_REQUIRED/);
});

test("direct *.run.app admin calls fail closed for all unreviewed features", ()=>{
  assert.match(app,/EXAMTREE_ADMIN_DETERMINISTIC_ONLY === "true"/);
  assert.match(app,/ADMIN_FEATURE_HANDLED_BY_RENDER_DURING_CUTOVER/);
  assert.match(app,/FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER/);
  for(const p of ["/api/admin/session","/api/admin/question-studio"]){
    assert.ok(app.includes(p) && proxy.includes(p));
  }
  assert.ok(app.indexOf("ADMIN_FEATURE_HANDLED_BY_RENDER_DURING_CUTOVER")
    < app.indexOf('app.use("/api/admin/session"'));
  assert.match(proxy,/cloud-run-deterministic/);
});

test("no-provider canary requires workers, is zero-traffic, and preserves student plus finance", ()=>{
  for(const marker of [
    '--no-traffic --tag=admin-candidate',
    'EXAMTREE_PRODUCTION_ADMIN_CANARY_APPROVED',
    'EXAMTREE_BUDGET_READY',
    'EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER=false',
    'EXAMTREE_ADMIN_DETERMINISTIC_ONLY=true',
    'EXAMTREE_PAYMENT_PROVIDER',
    'GENERATION_JOB_WORKER_ENABLED',
    'OUTBOX_PUBLISHER_ENABLED',
    'examtree-trg002-prod',
    'examtree-generation-prod',
    'examtree-question-studio-prod-worker-token',
    'examtree-api-database-url',
    'FINANCE_HANDLED_BY_RENDER_DURING_CUTOVER',
    "'OPENAI_API_KEY' not in env",
    'admin-candidate',
  ])assert.ok(deploy.includes(marker),marker);
  for(const forbidden of ['--to-latest','gcloud run services update-traffic','CASHFREE_CLIENT_ID=$','--set-secrets="OPENAI_API_KEY']){
    assert.equal(deploy.includes(forbidden),false,forbidden);
  }
});

test("no-provider verifier checks authorized Question Studio and rejected AI paths", ()=>{
  assert.match(verify,/read -r -s/);
  assert.match(verify,/question-studio\/capabilities/);
  assert.match(verify,/question-studio\/review-page/);
  assert.match(verify,/notes-studio-v2\/capabilities/);
  assert.match(verify,/ADMIN_FEATURE_HANDLED_BY_RENDER_DURING_CUTOVER/);
  assert.doesNotMatch(verify,/gcloud run services update-traffic/);
});
