import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(p,"utf8");
const facade=read("artifacts/api-server/prod-universal-worker-service.mjs");
const worker=read("artifacts/api-server/universal-question-studio-worker-service.mjs");
const docker=read("Dockerfile.examtree-qs-prod-universal-worker");
const config=read("cloudbuild.examtree-qs-chapter-images.yaml");
const script=read("scripts/submit-qs-chapter-cloud-build.sh");

test("production worker starts chapter mode with separate, expiring authorization",()=>{
  assert.match(facade,/env\.EXAMTREE_QS_PRODUCTION_WORKER_APPROVED!=="true"/);
  assert.match(facade,/env\.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED==="true"/);
  assert.match(facade,/productionChapterReleaseActive\(env\)/);
  assert.match(facade,/readProductionChapterScope\(env\)/);
  assert.match(facade,/readCanonicalChapterManifest\(\)/);
  assert.match(facade,/else \{\s*assertProductionWorkerCanaryEnvironment\(env\)/);
  assert.ok(facade.indexOf("productionChapterReleaseActive(env)")<
    facade.indexOf("await import(\"./universal-question-studio-worker-service.mjs\")"));
  assert.match(worker,/assertProductionChapterWorkerInput\(input\)/);
  assert.match(worker,/assertProductionWorkerCanaryInput\(input\)/);
  assert.match(docker,/COPY --from=builder .*prod-chapter-review-policy\.mjs/);
});
test("single Cloud Build builds exactly receiver, worker, API images with the same SHA",()=>{
  for(const dockerName of ["Dockerfile.examtree-qs-prod-task-receiver",
    "Dockerfile.examtree-qs-prod-universal-worker","Dockerfile.examtree-cloudrun-api"]){
    assert.equal(config.split(dockerName).length-1,1);
  }
  for(const repo of ["examtree-qs-receiver-prod",
    "examtree-universal-prod","examtree-api"]){
    assert.equal(config.split("examtree-workers/"+repo+":").length-1,2);
  }
  assert.equal(config.split("gcr.io/cloud-builders/docker").length-1,3);
  assert.match(config,/logging: CLOUD_LOGGING_ONLY/);
  assert.doesNotMatch(config,/gcloud run deploy|gcloud tasks|gcloud scheduler|run\.jobs\.run|--allow-unauthenticated/);
});
test("single Cloud Shell invocation pins tracked source, excludes credentials, and makes no deploy",()=>{
  assert.match(script,/git merge-base --is-ancestor/);
  assert.match(script,/git status --porcelain/);
  assert.match(script,/git rev-parse HEAD/);
  assert.match(script,/gcloud artifacts repositories describe/);
  assert.match(script,/gcloud builds submit/);
  assert.match(script,/Dockerfile\.question-studio-worker\.dockerignore/);
  assert.match(script,/_RELEASE_SHA=\$SHA/);
  assert.doesNotMatch(script,/gcloud run deploy|gcloud tasks queues resume|gcloud scheduler jobs resume/);
});
