import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const reconciler = readFileSync(
  new URL("../src/lib/cashfree-refunds.ts", import.meta.url), "utf8",
);
const admin = readFileSync(
  new URL("../src/routes/admin-commerce-orders.ts", import.meta.url), "utf8",
);
const webhook = readFileSync(
  new URL("../src/routes/cashfree-webhook.ts", import.meta.url), "utf8",
);

test("admin reconciliations are RBAC guarded and attributed to a real authenticated actor", () => {
  const route = admin.slice(admin.indexOf('router.post("/:orderId/refunds/:refundId/reconcile"'));
  assert.match(route, /requireAdminPermission\("commerce\.orders\.manage"\)/);
  assert.match(route, /reconcileCashfreeRefundRecord\(refundId, orderId, req\.adminSession!\.user\.id\)/);
  assert.match(admin, /reconcileCashfreeRefundRecord\(refundId, orderId, req\.adminSession!\.user\.id\)/);
  assert.match(webhook, /reconcileCashfreeRefundRecord\(refundId\)/);
  assert.doesNotMatch(webhook, /adminActorUserId/);
});

test("provider-verified successful partial refund writes audit in the same ledger transaction", () => {
  assert.match(reconciler, /export async function reconcileCashfreeRefundRecord\(refundId: string, canonicalOrderId\?: string, adminActorUserId\?: string\)/);
  const start = reconciler.indexOf('if (status === "SUCCESS")');
  const end = reconciler.indexOf('if (status === "FAILED"', start);
  assert.ok(start > 0 && end > start);
  const success = reconciler.slice(start, end);
  assert.match(reconciler, /return sqlClient\.begin\(async tx =>/);
  assert.match(success, /await reconcileProcessedRefund\(/);
  assert.match(success, /if \(adminActorUserId\) \{/);
  assert.match(success, /await tx`[\s\S]*INSERT INTO platform\.audit_events/);
  assert.match(success, /'commerce\.refund\.reconciled'/);
  assert.match(success, /'user'::audit_actor_type/);
  assert.match(success, /refundedMinor|amountMinor/);
  assert.match(success, /repairedRoundedPaymentId: repairCandidate/);
  assert.match(success, /fullRefund: result\.fullRefund/);
  assert.ok(success.indexOf("await reconcileProcessedRefund") < success.indexOf("INSERT INTO platform.audit_events"));
  assert.ok(success.indexOf("INSERT INTO platform.audit_events") < success.indexOf('return { refundId, status: "processed"'));
  assert.doesNotMatch(success, /\bcreateCashfreeRefund\(/);
});
