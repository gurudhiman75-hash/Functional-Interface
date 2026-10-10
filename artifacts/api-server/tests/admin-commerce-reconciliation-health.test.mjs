import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const route = readFileSync(new URL("../src/routes/admin-commerce-orders.ts", import.meta.url), "utf8");
const begin = route.indexOf('router.get("/reconciliation/health"');
const end = route.indexOf('router.post("/:orderId/refunds"', begin);
const health = route.slice(begin, end);

test("commerce reconciliation diagnostics are RBAC gated and read only", () => {
  assert.ok(begin >= 0 && end > begin);
  assert.match(health, /requireAdminPermission\("commerce\.orders\.read"\)/);
  assert.match(health, /pe\.signature_verified = true/);
  assert.match(health, /pe\.processed_at IS NOT NULL/);
  assert.match(health, /IS DISTINCT FROM pa\.provider_payment_id/);
  assert.match(health, /r\.status NOT IN \('processed', 'failed', 'cancelled'\)/);
  assert.match(health, /o\.status = 'payment_pending'/);
  assert.match(health, /o\.expires_at < now\(\)/);
  assert.match(health, /requiresProviderVerification: true/);
  assert.match(health, /truncated:/);
  assert.doesNotMatch(health, /\b(INSERT|UPDATE|DELETE|TRUNCATE)\s+(INTO\s+|FROM\s+|[a-z_]+\.)/i);
  assert.doesNotMatch(health, /createCashfreeRefund|finalizeCapturedPayment|fetchCashfreeOrder|fetchCashfreePayments/);
});
