import { createHash, randomUUID } from "node:crypto";
import { type Request, type Response } from "express";
import Razorpay from "razorpay";

import { CommercePaymentError, finalizeCapturedPayment } from "../lib/canonical-commerce-payments";
import { sqlClient } from "../lib/db";
import { logger } from "../lib/logger";

type RazorpayWebhookPayload = {
  event?: string;
  created_at?: number;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
        currency?: string;
        status?: string;
        captured?: boolean;
      };
    };
  };
};

function eventId(req: Request, rawBody: string): string {
  const header = req.headers["x-razorpay-event-id"];
  if (typeof header === "string" && header.trim()) return header.trim().slice(0, 180);
  return `sha256:${createHash("sha256").update(rawBody).digest("hex")}`;
}

export default async function billingWebhookHandler(req: Request, res: Response): Promise<void> {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    logger.warn("Canonical Razorpay webhook called without RAZORPAY_WEBHOOK_SECRET");
    res.status(503).json({ error: "Webhook not configured" });
    return;
  }
  const signature = req.headers["x-razorpay-signature"];
  if (typeof signature !== "string") {
    res.status(400).json({ error: "Missing x-razorpay-signature" });
    return;
  }
  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  try {
    if (!Razorpay.validateWebhookSignature(rawBody, signature, secret)) {
      res.status(400).json({ error: "Invalid signature" });
      return;
    }
  } catch (error) {
    logger.warn({ error }, "Razorpay webhook signature validation failed");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  let body: RazorpayWebhookPayload;
  try { body = JSON.parse(rawBody) as RazorpayWebhookPayload; }
  catch { res.status(400).json({ error: "Invalid JSON" }); return; }

  const providerEventId = eventId(req, rawBody);
  const eventType = String(body.event ?? "unknown").slice(0, 120);
  try {
    const result = await sqlClient.begin(async (tx) => {
      const recorded = await tx`
        INSERT INTO commerce.payment_events (
          id, provider, provider_event_id, event_type, signature_verified, payload, received_at
        ) VALUES (
          ${randomUUID()}::uuid, 'razorpay', ${providerEventId}, ${eventType}, true, ${tx.json(body)}, now()
        )
        ON CONFLICT (provider, provider_event_id) DO NOTHING
        RETURNING id::text AS id
      `;
      if (!recorded[0]) return { duplicate: true, processed: false };
      if (eventType !== "payment.captured") {
        await tx`
          UPDATE commerce.payment_events SET processed_at = now()
          WHERE provider = 'razorpay' AND provider_event_id = ${providerEventId}
        `;
        return { duplicate: false, processed: false };
      }

      const payment = body.payload?.payment?.entity;
      const providerPaymentId = String(payment?.id ?? "");
      const providerOrderId = String(payment?.order_id ?? "");
      const amountMinor = Number(payment?.amount);
      const currency = String(payment?.currency ?? "").toUpperCase();
      if (!providerPaymentId || !providerOrderId || !Number.isSafeInteger(amountMinor) || amountMinor < 0 || !/^[A-Z]{3}$/.test(currency)) {
        throw new CommercePaymentError("MALFORMED_CAPTURE_EVENT", "Captured payment event is missing canonical provider fields", 409);
      }

      const finalized = await finalizeCapturedPayment({
        client: tx as typeof sqlClient,
        provider: "razorpay",
        providerOrderId,
        providerPaymentId,
        amountMinor,
        currency,
        capturedAt: body.created_at ? new Date(body.created_at * 1000).toISOString() : null,
      });
      await tx`
        UPDATE commerce.payment_events
        SET payment_attempt_id = (
          SELECT id FROM commerce.payment_attempts
          WHERE provider = 'razorpay' AND provider_order_id = ${providerOrderId}
          LIMIT 1
        ), processed_at = now(), processing_error = null
        WHERE provider = 'razorpay' AND provider_event_id = ${providerEventId}
      `;
      return { duplicate: false, processed: true, ...finalized };
    });
    res.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment event processing failed";
    try {
      await sqlClient`
        UPDATE commerce.payment_events
        SET processing_error = ${message.slice(0, 2000)}
        WHERE provider = 'razorpay' AND provider_event_id = ${providerEventId}
      `;
    } catch (recordError) {
      logger.error({ recordError, providerEventId }, "Unable to persist payment event failure");
    }
    logger.error({ error, providerEventId, eventType }, "Canonical payment webhook processing failed");
    res.status(error instanceof CommercePaymentError ? error.statusCode : 500).json({ ok: false, error: message });
  }
}
