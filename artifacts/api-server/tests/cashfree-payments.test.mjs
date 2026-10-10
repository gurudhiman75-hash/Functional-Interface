import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { build } from "esbuild";

// Never call Cashfree in this test: all provider responses are simulated.
await build({
  entryPoints: ["src/lib/cashfree-payments.ts"],
  outfile: "dist/cashfree-payments-fixture.mjs",
  platform: "node",
  format: "esm",
  bundle: true,
  packages: "external",
});
const {
  cashfreeMode, cashfreeSelected, classifyCashfreeNonSuccess, createCashfreeOrder,
  fetchCashfreeOrder, fetchCashfreePayments, verifyCashfreeWebhook,
  cashfreeRefundReference, refundUuidFromCashfreeReference, createCashfreeRefund, fetchCashfreeRefund,
  assessCashfreeRefundAcknowledgement, assessCashfreeRefundEvidence, parseCashfreeJson,
  isRoundedCashfreePaymentReference,
} = await import("../dist/cashfree-payments-fixture.mjs");

const previousEnv = Object.fromEntries([
  "CASHFREE_CLIENT_ID", "CASHFREE_CLIENT_SECRET", "CASHFREE_ENV",
  "EXAMTREE_PAYMENT_PROVIDER", "EXAMTREE_PUBLIC_ORIGIN", "EXAMTREE_API_ORIGIN",
].map(key => [key, process.env[key]]));
const originalFetch = globalThis.fetch;

try {
  process.env.CASHFREE_CLIENT_ID = "sandbox-test-client";
  process.env.CASHFREE_CLIENT_SECRET = "sandbox-test-secret";
  process.env.CASHFREE_ENV = "sandbox";
  process.env.EXAMTREE_PAYMENT_PROVIDER = "cashfree";
  process.env.EXAMTREE_PUBLIC_ORIGIN = "https://examtree-new.onrender.com";
  process.env.EXAMTREE_API_ORIGIN = "https://examtree-new.onrender.com";

  assert.equal(cashfreeSelected(), true);
  assert.equal(cashfreeMode(), "sandbox");

  // Failed and user-abandoned payments must not count as successful captures.
  assert.equal(classifyCashfreeNonSuccess("FAILED"), "failed");
  assert.equal(classifyCashfreeNonSuccess("USER_DROPPED"), "cancelled");
  assert.equal(classifyCashfreeNonSuccess("CANCELLED"), "cancelled");
  assert.equal(classifyCashfreeNonSuccess("SUCCESS"), null);
  assert.equal(classifyCashfreeNonSuccess("PENDING"), null);
  assert.equal(classifyCashfreeNonSuccess("NOT_ATTEMPTED"), null);

  const timestamp = "1760000000";
  const raw = '{"type":"PAYMENT_SUCCESS_WEBHOOK","data":{"payment":{"payment_status":"SUCCESS"}}}';
  const signature = createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET)
    .update(timestamp + raw).digest("base64");
  assert.equal(verifyCashfreeWebhook(raw, signature, timestamp), true);
  assert.equal(verifyCashfreeWebhook(raw.replace("SUCCESS", "FAILED"), signature, timestamp), false);
  assert.equal(verifyCashfreeWebhook(raw, signature.slice(0, -2) + "00", timestamp), false);
  assert.equal(verifyCashfreeWebhook(raw, signature, ""), false);
  assert.equal(verifyCashfreeWebhook(raw, signature, "not-a-timestamp"), false);

  const requests = [];
  globalThis.fetch = async (url, init) => {
    const endpoint = String(url);
    requests.push({ url: endpoint, init });
    const response = endpoint.endsWith("/payments")
      ? [{ cf_payment_id: 123, payment_status: "SUCCESS" }]
      : { order_id: "order-test-123", payment_session_id: "sandbox-payment-session" };
    return new Response(JSON.stringify(response), { status: 200, headers: { "content-type": "application/json" } });
  };

  const order = await createCashfreeOrder({
    orderId: "order-test-123", userId: "11111111-1111-4111-8111-111111111111",
    amountMinor: 2199, currency: "INR", phone: "9876543210", email: "test@example.invalid",
  });
  assert.equal(order.order_id, "order-test-123");
  assert.equal(requests[0].url, "https://sandbox.cashfree.com/pg/orders");
  assert.equal(requests[0].init.headers["x-api-version"], "2025-01-01");
  const body = JSON.parse(requests[0].init.body);
  assert.equal(body.order_amount, 21.99);
  assert.equal(body.customer_details.customer_phone, "9876543210");
  assert.equal(body.order_meta.notify_url, "https://examtree-new.onrender.com/api/billing/cashfree/webhook");
  assert.equal(body.order_meta.return_url, "https://examtree-new.onrender.com/orders/order-test-123");
  assert.ok(new Date(body.order_expiry_time).getTime() > Date.now());

  await fetchCashfreeOrder("order-test-123");
  await fetchCashfreePayments("order-test-123");
  assert.equal(requests[1].url, "https://sandbox.cashfree.com/pg/orders/order-test-123");
  assert.equal(requests[2].url, "https://sandbox.cashfree.com/pg/orders/order-test-123/payments");

  process.env.EXAMTREE_PUBLIC_ORIGIN = "http://unsafe.example";
  await assert.rejects(createCashfreeOrder({
    orderId: "another", userId: "student", amountMinor: 500, currency: "INR", phone: "9876543210",
  }), /INVALID_CHECKOUT_ORIGIN/);
  assert.equal(requests.length, 3, "Invalid callback origin must not call the provider");

  process.env.EXAMTREE_PUBLIC_ORIGIN = "https://examtree-new.onrender.com";
  process.env.CASHFREE_ENV = "production";
  assert.equal(cashfreeMode(), "production");
  await fetchCashfreeOrder("order-test-123");
  assert.equal(requests[3].url, "https://api.cashfree.com/pg/orders/order-test-123");

  // Split deployment: checkout returns to Cloudflare Pages, but the signed
  // provider webhook must be delivered directly to the Render API.
  process.env.CASHFREE_ENV = "sandbox";
  process.env.EXAMTREE_PUBLIC_ORIGIN = "https://functional-interface.pages.dev";
  process.env.EXAMTREE_API_ORIGIN = "https://examtree-new.onrender.com";
  await createCashfreeOrder({
    orderId: "order-test-123", userId: "11111111-1111-4111-8111-111111111111",
    amountMinor: 2199, currency: "INR", phone: "9876543210",
  });
  assert.equal(requests[4].url, "https://sandbox.cashfree.com/pg/orders");
  const splitBody = JSON.parse(requests[4].init.body);
  assert.equal(splitBody.order_meta.return_url, "https://functional-interface.pages.dev/orders/order-test-123");
  assert.equal(splitBody.order_meta.notify_url, "https://examtree-new.onrender.com/api/billing/cashfree/webhook");

  process.env.EXAMTREE_API_ORIGIN = "http://unsafe.example";
  await assert.rejects(createCashfreeOrder({
    orderId: "another", userId: "student", amountMinor: 500, currency: "INR", phone: "9876543210",
  }), /INVALID_CHECKOUT_ORIGIN/);
  assert.equal(requests.length, 5, "Invalid webhook origin must not call the provider");

  // Cashfree refund IDs are deterministic and gateway refunds use rupees,
  // while our canonical database uses paise.
  const canonicalRefundId = "d3eb72fa-7f39-41f4-b1c1-22085b4f6084";
  const merchantRefundId = cashfreeRefundReference(canonicalRefundId);
  assert.equal(merchantRefundId, "etd3eb72fa7f3941f4b1c122085b4f6084");
  assert.equal(refundUuidFromCashfreeReference(merchantRefundId), canonicalRefundId);
  assert.equal(refundUuidFromCashfreeReference("not-a-refund"), null);
  assert.throws(() => cashfreeRefundReference("invalid"), /INVALID_REFUND_ID/);
  const refundCalls = [];
  globalThis.fetch = async (url, init) => {
    refundCalls.push({ url: String(url), init });
    return new Response(JSON.stringify({
      refund_id: merchantRefundId, cf_refund_id: "cf_refund_123", order_id: "order-test-123",
      cf_payment_id: "123", refund_amount: 10, refund_currency: "INR", refund_status: "PENDING",
    }), { status: 200, headers: { "content-type": "application/json" } });
  };
  const createdRefund = await createCashfreeRefund({
    orderId: "order-test-123", refundUuid: canonicalRefundId, amountMinor: 1000, reason: "Sandbox complete refund check",
  });
  assert.equal(createdRefund.refund_status, "PENDING");
  assert.equal(refundCalls[0].url, "https://sandbox.cashfree.com/pg/orders/order-test-123/refunds");
  assert.equal(refundCalls[0].init.headers["x-idempotency-key"], merchantRefundId);
  const refundBody = JSON.parse(refundCalls[0].init.body);
  assert.equal(refundBody.refund_amount, 10);
  assert.equal(refundBody.refund_id, merchantRefundId);
  assert.equal(refundBody.refund_speed, "STANDARD");
  await fetchCashfreeRefund("order-test-123", canonicalRefundId);
  assert.equal(refundCalls[1].url, "https://sandbox.cashfree.com/pg/orders/order-test-123/refunds/" + merchantRefundId);
  assert.equal(refundCalls[1].init.method, "GET");

  // Cashfree can acknowledge a request with a sparse POST receipt.
  // An omitted field is NOT proof of a mismatch, but a contradicting value is.
  const expected = {
    orderId: "order-test-123", paymentId: "123", refundId: canonicalRefundId,
    amountMinor: 1000, currency: "INR",
  };
  const completeReceipt = {
    refund_id: merchantRefundId, cf_refund_id: "cf_refund_123",
    order_id: "order-test-123", cf_payment_id: "123",
    refund_amount: 10, refund_currency: "INR", refund_status: "PENDING",
  };
  assert.deepEqual(assessCashfreeRefundAcknowledgement(completeReceipt, expected),
    { conflicts: [], providerRefundId: "cf_refund_123" });
  assert.deepEqual(assessCashfreeRefundAcknowledgement(
    { refund_status: "PENDING" }, expected
  ), { conflicts: [], providerRefundId: null });
  assert.deepEqual(assessCashfreeRefundAcknowledgement(
    { cf_refund_id: 71332, refund_amount: 10 }, expected
  ), { conflicts: [], providerRefundId: "71332" });
  const inconsistent = assessCashfreeRefundAcknowledgement(
    { ...completeReceipt, order_id: "different-order", refund_amount: 11 }, expected
  );
  assert.deepEqual(inconsistent.conflicts, ["order_id", "refund_amount"]);
  assert.equal(inconsistent.providerRefundId, null,
    "Untrusted provider ID must not be stored when the acknowledgement conflicts");

  // IDs from real Cashfree gateway payloads can be 19 decimal digits.
  // JSON.parse would round some of them, causing false mismatches.
  const correctCaptured = "1462287015601527808";
  const roundedCaptured = "1462287015601527800";
  assert.equal(String(Number(correctCaptured)), roundedCaptured,
    "This historic 19-digit ID was rounded by JSON.parse");
  assert.equal(isRoundedCashfreePaymentReference(roundedCaptured, correctCaptured), true);
  assert.equal(isRoundedCashfreePaymentReference(correctCaptured, correctCaptured), false);
  assert.equal(isRoundedCashfreePaymentReference("1462287015601527801", correctCaptured), false);
  assert.equal(isRoundedCashfreePaymentReference("1462287015601527800", "1462287015601527908"), false);
  assert.equal(isRoundedCashfreePaymentReference("other", correctCaptured), false);
  assert.equal(isRoundedCashfreePaymentReference("1234", "1235"), false);
  assert.equal(isRoundedCashfreePaymentReference("1462287015601527800", "146228701560152780A"), false);
  // A payment reference that differs but is NOT a known Number rounding
  // artifact must remain forbidden, even if the refund GET is successful.
    const bigPayment = "1461997756726467584";
  const numericRefund = "1319911206123456789";
  const parsed = parseCashfreeJson('{"cf_payment_id":' + bigPayment
    + ',"cf_refund_id":' + numericRefund + ',"refund_amount":5}');
  assert.equal(parsed.cf_payment_id, bigPayment);
  assert.equal(parsed.cf_refund_id, numericRefund);
  assert.equal(parsed.refund_amount, 5);
  assert.notEqual(String(JSON.parse('{"cf_payment_id":' + bigPayment + '}').cf_payment_id), bigPayment);

  const evidence = {
    orderId: "order-test-123", paymentId: bigPayment,
    refundId: canonicalRefundId, amountMinor: 500, currency: "INR",
  };
  const responseEvidence = {
    refund_id: merchantRefundId, cf_refund_id: numericRefund,
    order_id: evidence.orderId, cf_payment_id: bigPayment,
    refund_amount: 5, refund_currency: "INR", refund_status: "SUCCESS",
  };
  const match = assessCashfreeRefundEvidence(responseEvidence, evidence);
  assert.deepEqual(match.mismatched, []);
  assert.deepEqual(match.missing, []);
  assert.equal(match.providerRefundId, numericRefund);
  assert.equal(match.status, "SUCCESS");
  assert.equal(match.amountMinor, 500);
  const absent = assessCashfreeRefundEvidence({ refund_id: merchantRefundId }, evidence);
  assert.deepEqual(absent.mismatched, []);
  assert.ok(absent.missing.includes("cf_payment_id"));
  assert.ok(absent.missing.includes("refund_amount"));
  assert.ok(absent.missing.includes("refund_status"));
  const conflict = assessCashfreeRefundEvidence(
    { ...responseEvidence, cf_payment_id: "different", refund_amount: 6 }, evidence,
  );
  assert.deepEqual(conflict.mismatched, ["cf_payment_id", "refund_amount"]);
  assert.deepEqual(conflict.missing, []);
  assert.deepEqual(assessCashfreeRefundEvidence(
    { ...responseEvidence, refund_status: "PENDING" }, evidence,
  ).mismatched, []);
  assert.deepEqual(assessCashfreeRefundEvidence(
    { ...responseEvidence, refund_status: "UNRECOGNIZED" }, evidence,
  ).mismatched, ["refund_status"]);
  // GET endpoint also receives the lossless provider ID.
  globalThis.fetch = async () => new Response(
    '{"refund_id":"' + merchantRefundId + '","cf_payment_id":' + bigPayment
      + ',"cf_refund_id":' + numericRefund
      + ',"refund_amount":5,"refund_currency":"INR","refund_status":"SUCCESS"}',
    { status: 200 },
  );
  const fromGateway = await fetchCashfreeRefund("order-test-123", canonicalRefundId);
  assert.equal(fromGateway.cf_payment_id, bigPayment);
  assert.equal(fromGateway.cf_refund_id, numericRefund);

  globalThis.fetch = async () => new Response('{"message":"provider rejected"}', { status: 403 });
  await assert.rejects(fetchCashfreeOrder("order-test-123"), /HTTP 403/);
  console.log("PASS: Cashfree signatures, origins, idempotent refund creation and status fetching, sandbox/production endpoints, and rejection handling. No real payments.");
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
