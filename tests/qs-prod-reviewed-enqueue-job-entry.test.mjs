import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const cli=readFileSync("artifacts/api-server/src/question-studio/prod-reviewed-enqueue-job.ts","utf8");
const build=readFileSync("artifacts/api-server/build-qs-prod-task-receiver.mjs","utf8");
const docker=readFileSync("Dockerfile.examtree-qs-prod-task-receiver","utf8");
test("dedicated reviewed enqueue executable is not default job command",()=>{
 assert.match(build,/prod-reviewed-enqueue-job\.ts/);
 assert.match(cli,/EXAMTREE_QS_PRODUCTION_REVIEW_JOB_EXECUTE_APPROVED/);
 assert.match(cli,/CLOUD_RUN_TASK_ATTEMPT!=="0"/);
 assert.match(cli,/CLOUD_RUN_JOB!=="examtree-qs-prod-one-run-enqueue"/);
 assert.match(docker,/CMD \["node","artifacts\/api-server\/dist\/async-task-receiver-prod-standalone\.mjs"\]/);
});
