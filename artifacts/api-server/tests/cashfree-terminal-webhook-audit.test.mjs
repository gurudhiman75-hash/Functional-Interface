import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const hook = readFileSync("src/routes/cashfree-webhook.ts", "utf8");
const finalize = readFileSync("src/lib/canonical-commerce-payments.ts", "utf8");

assert.match(finalize, /captureDisposition\(String\(row.orderStatus\), String\(row.paymentStatus\)\)/);
assert.match(finalize, /disposition !== "process"/);
assert.match(finalize, /new CommercePaymentError\("PAYMENT_ORDER_NOT_OPEN"/);
assert.match(hook, /error\.code === "PAYMENT_ORDER_NOT_OPEN"/);
assert.match(hook, /processing_error = \$\{error.code \+ ": " \+ error.message\}/);
assert.match(hook, /reconciliationRequired: true/);
assert.match(hook, /ON CONFLICT \(provider, provider_event_id\) DO NOTHING RETURNING id/);
console.log("PASS: signed terminal-order callbacks are recorded for review, not recaptured");
