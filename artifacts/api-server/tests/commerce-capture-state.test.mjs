import assert from "node:assert/strict";
import { build } from "esbuild";

await build({
  entryPoints: ["src/lib/commerce-capture-state.ts"],
  outfile: "dist/commerce-capture-state-test-fixture.mjs",
  bundle: true, platform: "node", format: "esm",
});
const { captureDisposition } = await import("../dist/commerce-capture-state-test-fixture.mjs");

for (const s of ["created", "payment_pending"]) {
  for (const p of ["created", "authorized", "failed", "cancelled"]) {
    assert.equal(captureDisposition(s, p), "process", s + " " + p);
  }
}
assert.equal(captureDisposition("paid", "captured"), "already_finalized");
for (const order of [
  "expired", "cancelled", "payment_failed", "refunded",
  "partially_refunded", "paid", "payment_pending", "created",
]) {
  for (const payment of ["refunded", "partially_refunded", "captured"]) {
    if (order === "paid" && payment === "captured") continue;
    assert.equal(captureDisposition(order, payment), "reject", order + " " + payment);
  }
}
for (const order of ["expired", "cancelled", "payment_failed", "refunded", "partially_refunded", "paid"]) {
  for (const payment of ["created", "failed", "cancelled", "authorized"]) {
    assert.equal(captureDisposition(order, payment), "reject", order + " " + payment);
  }
}
console.log("PASS: terminal settlement states cannot reopen after success callbacks");
