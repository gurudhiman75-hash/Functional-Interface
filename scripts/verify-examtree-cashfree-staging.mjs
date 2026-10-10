import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const deployment = readFileSync(new URL("./deploy-examtree-api-cloudrun-staging.sh", import.meta.url), "utf8");

for (const mandatory of [
  'CASHFREE_SANDBOX="${EXAMTREE_ENABLE_CASHFREE_SANDBOX:-no}"',
  'if [[ "$CASHFREE_SANDBOX" != "yes" && "$CASHFREE_SANDBOX" != "no" ]]',
  'CASHFREE_CLIENT_ID_SECRET="examtree-cashfree-sandbox-client-id"',
  'CASHFREE_CLIENT_SECRET_SECRET="examtree-cashfree-sandbox-client-secret"',
  'REQUIRED_SECRETS+=("$CASHFREE_CLIENT_ID_SECRET" "$CASHFREE_CLIENT_SECRET_SECRET")',
  'API_ENV_VARS+=",EXAMTREE_PAYMENT_PROVIDER=cashfree,CASHFREE_ENV=sandbox"',
  'API_SECRETS+=",CASHFREE_CLIENT_ID=$CASHFREE_CLIENT_ID_SECRET:latest,CASHFREE_CLIENT_SECRET=$CASHFREE_CLIENT_SECRET_SECRET:latest"',
  '--set-env-vars="$API_ENV_VARS"',
  '--set-secrets="$API_SECRETS"',
  'result.checkoutProvider !== \'cashfree\'',
  'if [[ "$UNSIGNED_STATUS" != "400" ]]',
  'EXAMTREE_PUBLIC_ORIGIN=https://examtree.in',
  'GENERATION_JOB_WORKER_ENABLED=false',
  'OUTBOX_PUBLISHER_ENABLED=false',
]) {
  assert.ok(deployment.includes(mandatory), "Missing mandatory sandbox guard: " + mandatory);
}

assert.doesNotMatch(deployment, /CASHFREE_ENV=production/, "Never deploy Cashfree production to staging");
assert.doesNotMatch(deployment, /CASHFREE_REFUNDS_ENABLED=true/, "Do not enable refunds in staging preflight");
console.log("Cashfree sandbox-only Cloud Run deploy guard passed.");
