import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const workflow=readFileSync('.github/workflows/qs-admin-preview-manual-deploy.yml','utf8');
const script=readFileSync('scripts/build-qs-admin-preview.sh','utf8');

test('isolated preview deploy requires explicit New-main manual dispatch',()=>{
  assert.match(workflow,/workflow_dispatch:/);
  assert.match(workflow,/github\.event_name == 'workflow_dispatch'/);
  assert.match(workflow,/github\.ref == 'refs\/heads\/New-main'/);
  assert.match(workflow,/inputs\.confirm == 'deploy'/);
  assert.match(workflow,/CLOUDFLARE_API_TOKEN: \$\{\{ secrets\.CLOUDFLARE_API_TOKEN \}\}/);
  assert.match(workflow,/CLOUDFLARE_ACCOUNT_ID: \$\{\{ secrets\.CLOUDFLARE_ACCOUNT_ID \}\}/);
  assert.match(workflow,/MODE: deploy/);
  assert.match(script,/PROJECT=examtree-qs-admin-preview/);
  assert.match(script,/EXAMTREE_QS_ADMIN_PREVIEW_DEPLOY_APPROVED/);
  assert.match(script,/wrangler pages deploy/);
  assert.doesNotMatch(workflow,/examtree-api-1083299267005|EXAMTREE_API_UPSTREAM_ORIGIN|EXAMTREE_QS_PRODUCTION_RECEIVER_APPROVED/);
  assert.doesNotMatch(workflow,/gcloud\s+(?:tasks|run|sql)|neon\.tech|DATABASE_URL/);
});

test('staging API binding and frontend-only configuration are fail-closed',()=>{
  assert.match(workflow,/EXAMTREE_QS_ADMIN_API_ORIGIN: https:\/\/examtree-qs-admin-api-staging-/);
  assert.match(script,/EXPECTED_API_PREFIX="https:\/\/examtree-qs-admin-api-staging-"/);
  assert.match(script,/VITE_QUESTION_STUDIO_ASYNC_STAGING=true/);
  assert.match(script,/VITE_API_URL="\$API_ORIGIN\/api"/);
  for(const key of [
    'VITE_FIREBASE_API_KEY','VITE_FIREBASE_AUTH_DOMAIN','VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET','VITE_FIREBASE_MESSAGING_SENDER_ID','VITE_FIREBASE_APP_ID'
  ])assert.ok(workflow.includes("'"+key+"'"));
  assert.match(workflow,/key==='VITE_FIREBASE_PROJECT_ID' && value!=='sarbedutech'/);
  assert.match(workflow,/no private keys accessed/);
  assert.doesNotMatch(workflow,/FIREBASE_PRIVATE_KEY|CASHFREE_SECRET_KEY/);
  assert.doesNotMatch(script,/functions\/api\/\[\[path\]\]\.js/);
});
