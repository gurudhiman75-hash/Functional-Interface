import { type Request, type Response } from "express";
import Razorpay from "razorpay";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tests } from "@workspace/db";
import { logger } from "../lib/logger";
import { webhookRateLimit } from "../middlewares/rateLimit";
import { grantTestEntitlement } from "../lib/razorpay-billing";

type RazorpayWebhookPayload = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        amount?: number;
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
    const amount = entity?.amount;
    const notes = entity?.notes;
    const userId = notes?.userId;
    const testId = notes?.testId;

    logger.info({
      event,
      paymentId,
      orderId,
      userId,
      testId,
      amount,
      action: "webhook_payment_captured_received"
    });

    if (!paymentId || !orderId || !userId || !testId) {
      logger.warn({
        event,
        paymentId,
        orderId,
        userId,
        testId,
        error: "webhook_missing_required_data"
      });
      res.json({ ok: true });
      return;
    }

    // 🔥 PAYMENT AMOUNT VALIDATION (VERY IMPORTANT)
    try {
      const testRows = await db.select().from(tests).where(eq(tests.id, testId)).limit(1);
      const test = testRows[0];
      if (!test) {
        logger.warn({
          event,
          paymentId,
          orderId,
          userId,
          testId,
          error: "webhook_test_not_found"
        });
        res.json({ ok: true });
        return;
      }

      const expectedAmount = test.priceCents && test.priceCents > 0 ? test.priceCents : 499;
      if (amount !== expectedAmount) {
        logger.error({
          event,
          paymentId,
          orderId,
          userId,
          testId,
          amount,
          expectedAmount,
          error: "webhook_amount_mismatch"
        });
        res.json({ ok: true }); // Don't return error to webhook, just log
        return;
      }
    } catch (err) {
      logger.error({
        event,
        paymentId,
        orderId,
        userId,
        testId,
        error: "webhook_amount_validation_error",
        err
      });
      res.json({ ok: true });
      return;
    }

    try {
      const success = await grantTestEntitlement({
        userId,
        testId,
        source: "razorpay",
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
      });

      if (success) {
        logger.info({
          event,
          paymentId,
          orderId,
          userId,
          testId,
          amount,
          status: "webhook_entitlement_granted_successfully"
        });
      } else {
        logger.warn({
          event,
          paymentId,
          orderId,
          userId,
          testId,
          amount,
          error: "webhook_entitlement_grant_failed"
        });
      }
    } catch (err) {
      logger.error({
        event,
        paymentId,
        orderId,
        userId,
        testId,
        error: "webhook_entitlement_grant_error",
        err
      });
    }
  } else {
    logger.info({
      event,
      action: "webhook_ignored_non_payment_captured_event"
    });
  }

  res.json({ ok: true });
}
