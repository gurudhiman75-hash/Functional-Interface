import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const build=readFileSync("artifacts/api-server/build-qs-prod-task-receiver.mjs","utf8");
const docker=readFileSync("Dockerfile.examtree-qs-prod-task-receiver","utf8");
const legacy=readFileSync("artifacts/api-server/src/question-studio/prod-one-run-enqueue.ts","utf8");
const newTx=readFileSync("artifacts/api-server/src/question-studio/prod-reviewed-enqueue-transaction.ts","utf8");
test("new reviewed enqueue bundled but legacy COM-001 remains only executable job",()=>{
 assert.match(build,/prod-reviewed-enqueue-transaction\.ts/);
 assert.match(build,/prod-one-run-enqueue\.ts/);
 assert.match(legacy,/enqueueOneCanary\(\)\.catch/);
 assert.doesNotMatch(newTx,/process\.argv\[1\]|enqueueOneProductionReview\(\)\.catch/);
 assert.doesNotMatch(legacy,/enqueueOneProductionReview/);
 assert.match(docker,/CMD \["node","artifacts\/api-server\/dist\/async-task-receiver-prod-standalone\.mjs"\]/);
});
test("review transaction validation precedes any DB connection",()=>{
 assert.ok(newTx.indexOf("authorizeProductionReviewEnqueue(runId")<
           newTx.indexOf('import("../lib/db")'));
 assert.match(newTx,/sqlClient\.begin\(async tx=>/);
 assert.match(newTx,/pg_advisory_xact_lock/);
});
