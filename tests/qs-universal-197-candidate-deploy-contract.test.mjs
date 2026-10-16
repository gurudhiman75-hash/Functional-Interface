import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const deploy=readFileSync("scripts/deploy-question-studio-universal-197-candidate.sh","utf8");
const verify=readFileSync("scripts/verify-question-studio-universal-staging.sh","utf8");
test("197-package candidate stays isolated from production and preserves current staging",()=>{
 for(const required of [
  "SERVICE=examtree-universal-staging","PROJECT=sarbedutech","REGION=asia-south1",
  "TAG=qs197","MODE=\"$(printenv MODE || echo check)\"",
  "EXAMTREE_UNIVERSAL_197_STAGING_APPROVED","EXAMTREE_BUDGET_READY",
  "origin/New-main","--no-traffic --tag=\"$TAG\"",
  "examTreeNeverOccursInThisTest".replace("examTreeNeverOccursInThisTest","examtree-qs-staging"),
  'q.get("state")=="PAUSED"',
  'get("percent",0))==100',"secretKeyRef",
  'not any(x in env for x in ("DATABASE_URL"',
  'CODE" == 401',
  "previous staging traffic changed"
 ]) assert.ok(deploy.includes(required),required);
 for(const forbidden of [
  "gcloud run services update-traffic","gcloud tasks queues resume",
  "gcloud run services delete","gcloud secrets versions access",
  "gcloud run deploy examtree-api","--set-env-vars",
  "gcloud iam"
 ]) assert.equal(deploy.includes(forbidden),false,forbidden);
});
test("tagged existing verifier checks zero traffic and six real compute cases",()=>{
 assert.match(verify,/candidate=="qs197"/);
 assert.match(verify,/candidate must be ready and serve zero percent/);
 assert.match(verify,/previous revision must retain all live staging traffic/);
 for(const pkg of ["TRG-002","NUM-001","OPS-001","ENG-001","COM-001"])assert.ok(verify.includes(pkg));
});
