import { createHmac, timingSafeEqual } from "node:crypto";

export const cashfreeSelected = () => process.env.EXAMTREE_PAYMENT_PROVIDER === "cashfree";
export const cashfreeMode = () => process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";

/** A failed or abandoned gateway attempt must never grant test access.
 * Cashfree may still accept a later successful retry on the same order.
 */
export function classifyCashfreeNonSuccess(status: unknown): "failed" | "cancelled" | null {
  if (status === "FAILED") return "failed";
  if (status === "USER_DROPPED" || status === "CANCELLED") return "cancelled";
  return null;
}

function cashfreeOrigin() {
  return cashfreeMode() === "production" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";
}

function credentials() {
  const id = process.env.CASHFREE_CLIENT_ID;
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!id || !secret) throw new Error("CASHFREE_NOT_CONFIGURED");
  return { id, secret };
}

export async function cashfreeApi<T>(method: "GET" | "POST", route: string, body?: unknown, idempotencyKey?: string): Promise<T> {
  const { id, secret } = credentials();
  const response = await fetch(cashfreeOrigin() + "/pg" + route, {
    method,
    headers: {
      "x-client-id": id,
      "x-client-secret": secret,
      "x-api-version": "2025-01-01",
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Object.assign(new Error("Cashfree gateway request failed: HTTP " + response.status), { providerHttpStatus: response.status });
  return await response.json() as T;
}

export type CashfreeOrder = {
  order_id: string;
  order_status?: string;
  payment_session_id?: string;
  order_amount?: number;
  order_currency?: string;
};
export type CashfreePayment = {
  cf_payment_id?: string | number;
  payment_status?: string;
  payment_amount?: number;
  payment_currency?: string;
  payment_time?: string;
};

export async function createCashfreeOrder(input: {
  orderId: string; userId: string; amountMinor: number; currency: string; phone: string; email?: string;
}) {
  const publicOrigin = (process.env.EXAMTREE_PUBLIC_ORIGIN || "https://examtree-new.onrender.com").replace(/\/$/, "");
  // The browser may be hosted on Cloudflare Pages while the API/webhook lives on Render.
  // Never send Cashfree server-to-server webhooks to a static Pages origin.
  const apiOrigin = (process.env.EXAMTREE_API_ORIGIN || "https://examtree-new.onrender.com").replace(/\/$/, "");
  for (const origin of [publicOrigin, apiOrigin]) {
    const url = new URL(origin);
    if ((url.protocol !== "https:" && !(url.hostname === "localhost" && url.protocol === "http:"))
      || url.origin !== origin || url.username || url.password) throw new Error("INVALID_CHECKOUT_ORIGIN");
  }
  return cashfreeApi<CashfreeOrder>("POST", "/orders", {
    order_id: input.orderId,
    order_amount: input.amountMinor / 100,
    order_currency: input.currency,
    customer_details: {
      customer_id: input.userId.replace(/-/g, ""),
      customer_phone: input.phone,
      ...(input.email ? { customer_email: input.email } : {}),
    },
    order_expiry_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    order_meta: {
      return_url: publicOrigin + "/orders/" + encodeURIComponent(input.orderId),
      notify_url: apiOrigin + "/api/billing/cashfree/webhook",
    },
  });
}

export const fetchCashfreeOrder = (orderId: string) =>
  cashfreeApi<CashfreeOrder>("GET", "/orders/" + encodeURIComponent(orderId));
export const fetchCashfreePayments = (orderId: string) =>
  cashfreeApi<CashfreePayment[]>("GET", "/orders/" + encodeURIComponent(orderId) + "/payments");

export function verifyCashfreeWebhook(raw: string, signature: unknown, timestamp: unknown): boolean {
  if (typeof signature !== "string" || typeof timestamp !== "string" || !/^\d{10,13}$/.test(timestamp)) return false;
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!secret) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(timestamp + raw).digest("base64"), "utf8");
  const supplied = Buffer.from(signature, "utf8");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

/** The merchant refund reference is derived from the immutable canonical UUID.
 * This makes retries safe even when a provider response was lost.
 */
export function cashfreeRefundReference(refundUuid: string): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(refundUuid)) throw new Error("INVALID_REFUND_ID");
  return "et" + refundUuid.replace(/-/g, "").toLowerCase();
}
export function refundUuidFromCashfreeReference(reference: unknown): string | null {
  if (typeof reference !== "string" || !/^et[0-9a-f]{32}$/i.test(reference)) return null;
  const id = reference.slice(2).toLowerCase();
  const uuid = [id.slice(0,8), id.slice(8,12), id.slice(12,16), id.slice(16,20), id.slice(20)].join("-");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid) ? uuid : null;
}
export type CashfreeRefund = {
  refund_id?: string; cf_refund_id?: string | number; order_id?: string;
  cf_payment_id?: string | number; refund_amount?: number; refund_currency?: string;
  refund_status?: string; processed_at?: string | null;
};
/**
 * A successful POST does not by itself prove a completed refund. Some gateway
 * acknowledgements may omit fields that are present in the subsequent GET.
 * Treat omitted fields as unverified, but flag actual contradictory fields.
 * Only reconcileCashfreeRefundRecord(GET) can change order/access state.
 */
export function assessCashfreeRefundAcknowledgement(receipt: CashfreeRefund, expected: {
  orderId: string; paymentId: string; refundId: string; amountMinor: number; currency: string;
}): { conflicts: string[]; providerRefundId: string | null } {
  const conflicts: string[] = [];
  const compare = (name: string, actual: unknown, value: string) => {
    if (actual !== undefined && actual !== null && String(actual) !== value) conflicts.push(name);
  };
  compare("refund_id", receipt.refund_id, cashfreeRefundReference(expected.refundId));
  compare("order_id", receipt.order_id, expected.orderId);
  compare("cf_payment_id", receipt.cf_payment_id, expected.paymentId);
  compare("refund_currency", receipt.refund_currency, expected.currency);
  if (receipt.refund_amount !== undefined && receipt.refund_amount !== null) {
    const minor = Math.round(Number(receipt.refund_amount) * 100);
    if (!Number.isSafeInteger(minor) || minor !== expected.amountMinor) conflicts.push("refund_amount");
  }
  const providerRefundId = receipt.cf_refund_id == null || String(receipt.cf_refund_id).length === 0
    ? null : String(receipt.cf_refund_id);
  return { conflicts, providerRefundId: conflicts.length ? null : providerRefundId };
}

export const createCashfreeRefund = (input: {
  orderId: string; refundUuid: string; amountMinor: number; reason: string;
}) => cashfreeApi<CashfreeRefund>(
  "POST", "/orders/" + encodeURIComponent(input.orderId) + "/refunds",
  {
    refund_id: cashfreeRefundReference(input.refundUuid),
    refund_amount: input.amountMinor / 100,
    refund_note: input.reason.slice(0, 100),
    refund_speed: "STANDARD",
  },
  cashfreeRefundReference(input.refundUuid),
);
export const fetchCashfreeRefund = (orderId: string, refundUuid: string) =>
  cashfreeApi<CashfreeRefund>("GET", "/orders/" + encodeURIComponent(orderId) + "/refunds/" + encodeURIComponent(cashfreeRefundReference(refundUuid)));
