import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const app = read("artifacts/api-server/src/app.ts");
const entry = read("artifacts/api-server/src/index.ts");
const firebase = read("artifacts/api-server/src/lib/firebase-admin.ts");
const db = read("artifacts/api-server/src/lib/db.ts");
const docker = read("Dockerfile.examtree-cloudrun-api");
const deploy = read("scripts/deploy-examtree-api-cloudrun-staging.sh");
const background = read("artifacts/api-server/src/cloud-run-background.ts");
const scheduler = read("scripts/enable-examtree-api-background-scheduler.sh");
const ai = read("artifacts/api-server/src/lib/ai-providers/index.ts");
const buildScript = read("build-api.sh");
const schema = read("scripts/examtree-api-schema-bootstrap.sh");

test("Cloud Run API never starts request-throttled background loops", () => {
  assert.match(entry, /EXAMTREE_API_RUNTIME === "cloud-run"/);
  assert.match(entry, /startMobileNotificationWorker\(\)/);
  assert.match(entry, /startOutboxPublisher\(\)/);
  assert.match(background, /runMobileNotificationDelivery\(\)/);
  assert.match(background, /runOutboxPublisherOnce\(\)/);
  assert.match(background, /sqlClient\.end/);
  assert.match(app, /EXAMTREE_API_RUNTIME !== "cloud-run"/);
});

test("Firebase Cloud Run ADC avoids service-account private key copy", () => {
  assert.match(firebase, /admin\.credential\.applicationDefault\(\)/);
  assert.match(firebase, /EXAMTREE_API_RUNTIME === "cloud-run"/);
  assert.match(db, /export const sqlClient = postgres\(connectionString\)/);
});

test("staging deploy uses dedicated identity, Secret Manager and no cutover", () => {
  assert.match(deploy, /examtree-api-staging/);
  assert.match(deploy, /examtree-api-background-staging/);
  assert.match(deploy, /examtree-api-runtime/);
  assert.match(deploy, /EXAMTREE_BUDGET_READY/);
  assert.match(deploy, /examtree-api-database-url/);
  assert.match(deploy, /min-instances=0/);
  assert.match(deploy, /max-instances=1/);
  assert.match(deploy, /set-secrets/);
  assert.match(deploy, /smoke-examtree-api-staging/);
  for (const shell of [deploy, scheduler, schema, read("scripts/smoke-examtree-api-staging.sh")]) {
    assert.equal(shell.includes("\\${"), false, "Bash variables must not be shell-escaped literals");
  }
  assert.doesNotMatch(deploy, /cloudflare\.request|render\.com\/(?:api|web)|delete-service/);
  assert.match(schema, /EXAMTREE_SCHEMA_MIGRATION_APPROVED/);
  assert.match(schema, /ensure-current-affairs\.mjs/);
  assert.match(scheduler, /EXAMTREE_RENDER_STOPPED/);
  assert.match(scheduler, /EXAMTREE_BACKGROUND_JOB_VERIFIED/);
  assert.match(scheduler, /examtree-api-background-every-5m/);
  assert.match(docker, /USER node/);
  assert.match(docker, /cloud-run-preload\.mjs/);
  assert.match(docker, /build-runtime\.mjs/);
  assert.match(docker, /build-cloud-run-background\.mjs/);
  assert.match(deploy, /EXAMTREE_CLOUDRUN_STAGING=true/);
  assert.match(ai, /EXAMTREE_CLOUDRUN_STAGING === "true"/);
  assert.match(buildScript, /smoke-examtree-cloudrun-startup/);
  assert.match(docker, /smoke-examtree-cloudrun-startup/);
  assert.match(docker, /RUN node scripts\/smoke-examtree-cloudrun-startup\.mjs/);
  assert.match(docker, /COPY --from=builder \/src\/scripts\/smoke-examtree-cloudrun-startup\.mjs/);
});
