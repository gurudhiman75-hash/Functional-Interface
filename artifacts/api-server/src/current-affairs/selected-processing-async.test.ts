import assert from "node:assert/strict";
import fs from "node:fs";

const job = fs.readFileSync(new URL("./selected-affairs-processing-job.ts", import.meta.url), "utf8");
const route = fs.readFileSync(new URL("../routes/admin-current-affairs-selected-processing.ts", import.meta.url), "utf8");
const frontend = fs.readFileSync(new URL("../../../admin-app/src/features/current-affairs/selected-processing-api.ts", import.meta.url), "utf8");
const migration = fs.readFileSync(new URL("../../migrations/20260903_current_affairs_selected_processing_runs.sql", import.meta.url), "utf8");

assert.match(job, /setImmediate\(\(\) =>/);
assert.match(job, /recoverSelectedPrimaryEvidence/);
assert.match(job, /processSelectedCurrentAffairs/);
assert.match(job, /setInterval\(\(\) =>/);
assert.match(job, /heartbeat_at/);
assert.match(job, /worker_interrupted/);
assert.match(job, /canonicalApprovalAuthority: false/);
assert.match(job, /publicationAuthority: false/);
assert.match(job, /questionBankPromotionAuthority: false/);

assert.match(route, /startSelectedAffairsProcessingRun/);
assert.match(route, /getSelectedAffairsProcessingRun/);
assert.match(route, /res\.status\(run\.status === "completed" \? 200 : 202\)/);
assert.doesNotMatch(route, /await processSelectedCurrentAffairs/);
assert.doesNotMatch(route, /await recoverSelectedPrimaryEvidence/);

assert.match(frontend, /POLL_INTERVAL_MS/);
assert.match(frontend, /readProcessingRun/);
assert.match(frontend, /MAX_TRANSIENT_POLL_FAILURES/);
assert.match(frontend, /Failed to fetch\|NetworkError\|network request/);

assert.match(migration, /current_affairs_selected_processing_runs/);
assert.match(migration, /WHERE status IN \('queued', 'running'\)/);
assert.match(migration, /result JSONB/);

console.log("Current Affairs async selected-processing contract passed");
