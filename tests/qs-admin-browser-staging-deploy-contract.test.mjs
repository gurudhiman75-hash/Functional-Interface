import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(p)=>readFileSync(p,"utf8");
const app=read("artifacts/api-server/src/app.ts");
const api=read("scripts/deploy-qs-admin-api-isolated-staging.sh");
const preview=read("scripts/build-qs-admin-preview.sh");

test("browser CORS explicitly allows the authorized async idempotency header",()=>{
  assert.match(app,/allowedHeaders: \[[^\]]*"Idempotency-Key"/);
  assert.match(api,/Access-Control-Request-Headers: authorization,content-type,idempotency-key/);
});
test("isolated admin API uses only validation Neon, Cloud Run staging and paused queue",()=>{
  for(const value of ["MODE=\"${MODE:-check}\"","examtree-qs-admin-api-staging","examtree-qs-staging",
    "ep-fancy-dawn-atvvlmom","examtree-qs-validation-database-url",
    "EXAMTREE_QUESTION_STUDIO_STAGING_ENQUEUE_APPROVED=true",
    "EXAMTREE_SALES_DISABLED=true","GENERATION_JOB_WORKER_ENABLED=false",
    "OUTBOX_PUBLISHER_ENABLED=false","EXAMTREE_BUDGET_READY"]){
      assert.ok(api.includes(value), "Missing admin safety gate "+value);
    }
  assert.doesNotMatch(api,/gcloud tasks queues resume/);
  assert.doesNotMatch(api,/gcloud run jobs execute/);
  assert.doesNotMatch(api,/examtree-api-staging\s*$/m);
});
test("isolated preview deploy never reuses production Pages API relay",()=>{
  assert.match(preview,/PROJECT=examtree-qs-admin-preview/);
  assert.match(preview,/VITE_QUESTION_STUDIO_ASYNC_STAGING=true/);
  assert.match(preview,/VITE_API_URL="\$API_ORIGIN\/api"/);
  assert.match(preview,/functions\/admin\/\[\[path\]\]\.js/);
  assert.doesNotMatch(preview,/functions\/api\/\[\[path\]\]\.js/);
  assert.match(preview,/EXAMTREE_QS_ADMIN_PREVIEW_DEPLOY_APPROVED/);
  assert.match(preview,/wrangler pages deploy/);
});
