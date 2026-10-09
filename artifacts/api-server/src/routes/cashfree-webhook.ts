import { randomUUID, createHash } from "node:crypto";
import type { Request, Response } from "express";
import { classifyCashfreeNonSuccess, verifyCashfreeWebhook } from "../lib/cashfree-payments";
import { finalizeCapturedPayment, CommercePaymentError } from "../lib/canonical-commerce-payments";
import { sqlClient } from "../lib/db";
import { logger } from "../lib/logger";

type WebhookPayload = {
  type?: string;
  data?: {
    order?: { order_id?: string; order_amount?: number; order_currency?: string };
    payment?: { cf_payment_id?: string | number; payment_status?: string; payment_amount?: number; payment_currency?: string; payment_time?: string };
  };
};

export default async function cashfreeWebhook(req: Request, res: Response): Promise<void> {
  if (!process.env.CASHFREE_CLIENT_SECRET) {
    res.status(503).json({ error: "Cashfree webhook is not configured" }); return;
  }
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : typeof req.body === "string" ? req.body : "";
  const signature = req.headers["x-webhook-signature"];
  const timestamp = req.headers["x-webhook-timestamp"];
  if (!verifyCashfreeWebhook(rawBody, signature, timestamp)) {
    res.status(400).json({ error: "Invalid Cashfree webhook signature" }); return;
  }
  let event: WebhookPayload;
  try { event = JSON.parse(rawBody) as WebhookPayload; }
  catch { res.status(400).json({ error: "Invalid JSON" }); return; }
  const kind = String(event.type ?? "unknown").slice(0, 120);
  const payment = event.data?.payment;
  const order = event.data?.order;
  // Cashfree delivery can repeat; use the same event identifier for every retry.
  const paymentId = String(payment?.cf_payment_id ?? "");
  const providerEventId = (paymentId ? kind + ":" + paymentId : "sha256:" + createHash("sha256").update(rawBody).digest("hex")).slice(0, 180);
  try {
    const processed = await sqlClient.begin(async tx => {
      const rows = await tx`
        INSERT INTO commerce.payment_events (id, provider, provider_event_id, event_type, signature_verified, payload, received_at)
        VALUES (${randomUUID()}::uuid, 'cashfree', ${providerEventId}, ${kind}, true, ${tx.json(event)}, now())
        ON CONFLICT (provider, provider_event_id) DO NOTHING RETURNING id
      `;
      if (!rows[0]) return { duplicate: true };
      const nonSuccess = classifyCashfreeNonSuccess(payment?.payment_status);
      const verifiedOutcomeKind =
        (kind === "PAYMENT_FAILED_WEBHOOK" && nonSuccess === "failed") ||
        (kind === "PAYMENT_USER_DROPPED_WEBHOOK" && payment?.payment_status === "USER_DROPPED");
      if (nonSuccess && verifiedOutcomeKind && order?.order_id) {
        const providerOrderId = String(order.order_id);
        // Lock the canonical record. A delayed failure must never undo a
        // successful payment or revoke an already-granted entitlement.
        const attempts = await tx`
          SELECT pa.id::text AS id
          FROM commerce.payment_attempts pa
          JOIN commerce.orders o ON o.id = pa.order_id
          WHERE pa.provider = 'cashfree' AND pa.provider_order_id = ${providerOrderId}
          LIMIT 1 FOR UPDATE OF pa, o
        `;
        if (attempts[0]) {
          await tx`
            UPDATE commerce.payment_attempts pa
            SET status = ${nonSuccess},
                failure_code = ${String(payment?.payment_status ?? "")},
                failure_message = ${nonSuccess === "failed" ? "Cashfree payment failed" : "Customer left Cashfree payment flow"},
                failed_at = ${nonSuccess === "failed" ? new Date().toISOString() : null}::timestamptz,
                updated_at = now()
            WHERE pa.id = ${String(attempts[0].id)}::uuid
              AND pa.status <> 'captured'
              AND EXISTS (
                SELECT 1 FROM commerce.orders o
                WHERE o.id = pa.order_id AND o.status IN ('created', 'payment_pending')
              )
          `;
          // Keep the order payment_pending: Cashfree permits another attempt
          // before the order expires, even after an unsuccessful payment.
          await tx`
            UPDATE commerce.payment_events
            SET payment_attempt_id = ${String(attempts[0].id)}::uuid, processed_at = now()
            WHERE provider = 'cashfree' AND provider_event_id = ${providerEventId}
          `;
        } else {
          await tx`
            UPDATE commerce.payment_events SET processed_at = now()
            WHERE provider = 'cashfree' AND provider_event_id = ${providerEventId}
          `;
        }
        return { duplicate: false, processed: Boolean(attempts[0]), paymentStatus: nonSuccess };
      }
      if (kind === "PAYMENT_SUCCESS_WEBHOOK" && payment?.payment_status === "SUCCESS") {
        const providerOrderId = String(order?.order_id ?? "");
        const amount = Number(payment.payment_amount);
        const amountMinor = Math.round(amount * 100);
        const currency = String(payment.payment_currency ?? order?.order_currency ?? "").trim().toUpperCase();
        if (!providerOrderId || !paymentId || !Number.isFinite(amount) || amount <= 0 || !Number.isSafeInteger(amountMinor) || !/^[A-Z]{3}$/.test(currency)) {
          throw new CommercePaymentError("MALFORMED_CASHFREE_EVENT", "Cashfree payment evidence is incomplete", 409);
        }
        const finalized = await finalizeCapturedPayment({
          client: tx as typeof sqlClient, provider: "cashfree", providerOrderId,
          providerPaymentId: paymentId, amountMinor, currency,
          capturedAt: payment.payment_time && !Number.isNaN(Date.parse(payment.payment_time)) ? new Date(payment.payment_time).toISOString() : null,
        });
        await tx`UPDATE commerce.payment_events SET payment_attempt_id = (SELECT id FROM commerce.payment_attempts WHERE provider = 'cashfree' AND provider_order_id = ${providerOrderId} LIMIT 1), processed_at = now() WHERE provider = 'cashfree' AND provider_event_id = ${providerEventId}`;
        return { duplicate: false, processed: true, orderId: finalized.orderId };
      }
      await tx`UPDATE commerce.payment_events SET processed_at = now() WHERE provider = 'cashfree' AND provider_event_id = ${providerEventId}`;
      return { duplicate: false, processed: false };
    });
    res.json({ ok: true, ...processed });
  } catch (error) {
    logger.error({ error, providerEventId, kind }, "Cashfree webhook processing failed");
    res.status(error instanceof CommercePaymentError ? error.statusCode : 500).json({ error: "Cashfree webhook could not be processed" });
  }
}
