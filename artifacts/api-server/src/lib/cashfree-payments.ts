import { createHmac, timingSafeEqual } from "node:crypto";

export const cashfreeSelected = () => process.env.EXAMTREE_PAYMENT_PROVIDER === "cashfree";
export const cashfreeMode = () => process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";

function cashfreeOrigin() {
  return cashfreeMode() === "production" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";
}

function credentials() {
  const id = process.env.CASHFREE_CLIENT_ID;
  const secret = process.env.CASHFREE_CLIENT_SECRET;
  if (!id || !secret) throw new Error("CASHFREE_NOT_CONFIGURED");
  return { id, secret };
}

export async function cashfreeApi<T>(method: "GET" | "POST", route: string, body?: unknown): Promise<T> {
  const { id, secret } = credentials();
  const response = await fetch(cashfreeOrigin() + "/pg" + route, {
    method,
    headers: {
      "x-client-id": id,
      "x-client-secret": secret,
      "x-api-version": "2025-01-01",
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Cashfree gateway request failed: HTTP " + response.status);
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
  const url = new URL(publicOrigin);
  if (url.protocol !== "https:" && !(url.hostname === "localhost" && url.protocol === "http:")) throw new Error("INVALID_CHECKOUT_ORIGIN");
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
      notify_url: publicOrigin + "/api/billing/cashfree/webhook",
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
