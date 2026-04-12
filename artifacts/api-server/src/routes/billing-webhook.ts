import { type Request, type Response } from "express";
import Razorpay from "razorpay";
import { logger } from "../lib/logger";
import { grantTestEntitlement } from "../lib/razorpay-billing";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        notes?: Record<string, string>;
      };
    };
  };
};

export default async function billingWebhookHandler(req: Request, res: Response): Promise<void> {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.warn("Razorpay webhook called but RAZORPAY_WEBHOOK_SECRET is missing");
    res.status(503).json({ error: "Webhook not configured" });
    return;
  }

  const signature = req.headers["x-razorpay-signature"];
  if (typeof signature !== "string") {
    res.status(400).json({ error: "Missing x-razorpay-signature" });
    return;
  }

  const rawBody = Buffer.isBuffer(req.body)
    ? req.body.toString("utf8")
    : typeof req.body === "string"
      ? req.body
      : JSON.stringify(req.body);

  try {
    const valid = Razorpay.validateWebhookSignature(rawBody, signature, webhookSecret);
    if (!valid) {
      logger.warn("Razorpay webhook signature mismatch");
      res.status(400).json({ error: "Invalid signature" });
      return;
    }
  } catch (err) {
    logger.warn({ err }, "Razorpay webhook signature validation failed");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  let body: RazorpayWebhookPayload;
  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const event = body.event;
  if (event === "payment.captured") {
    const entity = body.payload?.payment?.entity;
    const paymentId = entity?.id;
    const orderId = entity?.order_id;
    const notes = entity?.notes;
    const userId = notes?.userId;
    const testId = notes?.testId;

    if (!paymentId || !orderId || !userId || !testId) {
      logger.warn({ event }, "Razorpay webhook missing payment/order/notes");
      res.json({ ok: true });
      return;
    }

    await grantTestEntitlement({
      userId,
      testId,
      source: "razorpay",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });
  }

  res.json({ ok: true });
}
