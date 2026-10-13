import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read = path => readFileSync(path,"utf8");
const deploy = read("scripts/deploy-question-studio-universal-staging-num-contract-candidate.sh");
const verify = read("scripts/verify-question-studio-universal-staging.sh");

test("new NUM-contract staging revision cannot steal traffic or affect production",()=>{
  for(const required of [
    "examtree-universal-staging",
    "numfix",
    "--no-traffic --tag",
    'TAG=numfix',
    'if (( ${#SERVICE} + ${#TAG} > 46 ))',
    'EXAMTREE_UNIVERSAL_REUSE_IMAGE_SHA',
    'skipping Cloud Build',
    "EXAMTREE_UNIVERSAL_STAGING_NUM_CONTRACT_APPROVED",
    "EXAMTREE_BUDGET_READY",
    "gcloud config get-value project",
    "git branch --show-current",
    "git rev-parse origin/New-main",
    "examtree-trg002-worker-token",
    "sum(int(x.get('percent',0)) for x in traffic if x.get('revisionName')==old)==100",
    "assert not any(x.get('tag')=='numfix'",
    "assert any(x.get('tag')=='fix-candidate' and int(x.get('percent',0))==0",
    "assert not any(k in env for k in ('DATABASE_URL'",
  ]) assert.ok(deploy.includes(required),required);
  for(const forbidden of [
    "gcloud run services update-traffic",
    "gcloud run services delete",
    "gcloud secrets versions access",
    "EXAMTREE_ADMIN_UPSTREAM=",
    "examtree-api --",
  ]) assert.equal(deploy.includes(forbidden),false,forbidden);
});
test("new tagged verifier proves NUM-001 difficulty defaults and provenance",()=>{
  for(const required of [
    'candidate in ("fix-candidate","numfix")',
    "candidate must be ready and serve zero percent",
    "previous revision must retain all live staging traffic",
    'EXAMTREE_UNIVERSAL_STAGING_TAG:-}" == "numfix"',
    "NUM-CP-001|1",
    'if g["DIFF"]!="none": req["difficulty"]=g["DIFF"]',
    'if p=="NUM-001" and g["DIFF"]!="none":',
    'payload["difficultyFilterSupported"]=False',
    'payload["forwardLegacyExamProfile"]=True',
    'q.get("generationContext",{}).get("difficultyFilterApplied") is False',
    'batch.get("generationContexts",[])',
    "all universal Cloud Run staging generation cases completed",
  ]) assert.ok(verify.includes(required),required);
});
