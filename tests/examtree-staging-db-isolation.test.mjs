import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = (path) => readFileSync(path, 'utf8');
const script = source('scripts/isolate-examtree-cloudrun-staging-neon.sh');
const deploy = source('scripts/deploy-examtree-api-cloudrun-staging.sh');
const worker = source('artifacts/api-server/src/cloud-run-background.ts');

test('staging isolation requires approval, exact Neon branch, and separate GCP secret', () => {
  assert.match(script, /EXAMTREE_STAGING_DB_SWITCH_APPROVED/);
  assert.match(script, /ep-wild-water-atrzmssw\.c-9\.us-east-1\.aws\.neon\.tech/);
  assert.match(script, /ep-polished-king-atj47i5y/);
  assert.match(script, /examtree-api-staging-database-url/);
  assert.match(script, /read -r -s/);
  assert.match(script, /gcloud secrets versions add/);
  assert.match(script, /--update-secrets/);
  assert.match(script, /EXAMTREE_API_STAGING=true/);
  assert.match(script, /--command=\/usr\/bin\/false/);
  assert.match(script, /OUTBOX_PUBLISHER_ENABLED/);
  assert.doesNotMatch(script, /gcloud run (jobs execute|services update-traffic)/);
  assert.doesNotMatch(script, /EXAMTREE_API_UPSTREAM_ORIGIN/);
});

test('staging deploy and review writes cannot reuse main Neon', () => {
  assert.match(deploy, /SECRET="examtree-api-staging-database-url"/);
  assert.match(deploy, /validate-examtree-staging-neon-url\.py/);
  assert.doesNotMatch(deploy, /SECRET="examtree-api-database-url"/);
  assert.match(worker, /EXAMTREE_API_STAGING === "true"/);
  assert.match(worker, /Staging background job execution is forbidden/);
  assert.match(deploy, /EXAMTREE_API_STAGING=true/);
  assert.match(deploy, /OUTBOX_PUBLISHER_ENABLED=false/);
});

test('staging isolation script is non-destructive to live services', () => {
  for (const forbidden of [
    'gcloud run services delete',
    'gcloud run services update-traffic',
    'gcloud run jobs execute',
    'gcloud scheduler jobs create',
    'drop database',
    'truncate table',
    'neon branches delete',
  ]) assert.equal(script.toLowerCase().includes(forbidden.toLowerCase()), false, forbidden);
});
