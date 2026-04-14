import { Router, type IRouter } from "express";
import Razorpay from "razorpay";
import { eq, and } from "drizzle-orm";
import { db } from "../lib/db";
import { tests, userTestEntitlements } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { paymentRateLimit } from "../middlewares/rateLimit";
import { getRazorpayCurrency, grantTestEntitlement, verifyPaymentSignature } from "../lib/razorpay-billing";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/check-purchase", authenticate, async (req, res) => {
  const userId = req.user!.id;
  const testId = typeof req.query.testId === "string" ? req.query.testId : "";

  if (!testId) {
    return res.status(400).json({ error: "testId query parameter is required" });
  }

  try {
    // Check if test exists and is paid
    const testRows = await db.select().from(tests).where(eq(tests.id, testId)).limit(1);
    const test = testRows[0];

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    // If test is free, always return purchased: true
    if (test.access !== "paid") {
      return res.json({
        purchased: true,
        testId,
        access: "free",
        priceCents: null
      });
    }

    // Check if user has entitlement
    const entitlementRows = await db
      .select()
      .from(userTestEntitlements)
      .where(and(
        eq(userTestEntitlements.userId, userId),
        eq(userTestEntitlements.testId, testId)
      ))
      .limit(1);

    const purchased = entitlementRows.length > 0;

    logger.info({
      userId,
      testId,
      purchased,
      action: "purchase_status_checked"
    });

    return res.json({
      purchased,
      testId,
      access: "paid",
      priceCents: test.priceCents ?? 499
    });

  } catch (error) {
    logger.error({
      userId,
      testId,
      error: "check_purchase_failed",
      err: error
    });
    return res.status(500).json({ error: "Failed to check purchase status" });
  }
});

function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function receiptForOrder(testId: string, userId: string): string {
  const raw = `t_${testId}_${userId}`.replace(/[^a-zA-Z0-9_]/g, "_");
  return raw.length <= 40 ? raw : raw.slice(0, 40);
}

router.post("/razorpay/create-order", authenticate, paymentRateLimit, async (req, res) => {
  const rz = getRazorpay();
  if (!rz) {
    return res.status(503).json({
      error:
        "Razorpay is not configured (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET). In development you can use POST /api/billing/mock-unlock instead.",
      code: "RAZORPAY_NOT_CONFIGURED",
    });
  }

  const userId = req.user!.id;
  const testId = typeof req.body?.testId === "string" ? req.body.testId : "";
  if (!testId) {
    return res.status(400).json({ error: "testId is required" });
  }

  const testRows = await db.select().from(tests).where(eq(tests.id, testId)).limit(1);
  const test = testRows[0];
  if (!test) return res.status(404).json({ error: "Test not found" });
  if (test.access !== "paid") {
    return res.status(400).json({ error: "This test is free; no payment is needed." });
  }

  const amountMinor = test.priceCents && test.priceCents > 0 ? test.priceCents : 499;
  const currency = getRazorpayCurrency();

  try {
    const order = await rz.orders.create({
      amount: amountMinor,
      currency,
      receipt: receiptForOrder(testId, userId),
      notes: {
        userId,
        testId,
      },
    });

    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      return res.status(500).json({ error: "RAZORPAY_KEY_ID missing" });
    }

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      testName: test.name,
    });
  } catch (err) {
    console.error("Razorpay orders.create failed:", err);
    return res.status(500).json({ error: "Could not create payment order" });
  }
});

router.post("/razorpay/verify", authenticate, paymentRateLimit, async (req, res) => {
  const userId = req.user!.id;
  const testId = typeof req.body?.testId === "string" ? req.body.testId : "";
  const orderId = typeof req.body?.razorpay_order_id === "string" ? req.body.razorpay_order_id : "";
  const paymentId = typeof req.body?.razorpay_payment_id === "string" ? req.body.razorpay_payment_id : "";
  const signature = typeof req.body?.razorpay_signature === "string" ? req.body.razorpay_signature : "";

  logger.info({
    userId,
    testId,
    orderId,
    paymentId,
    action: "payment_verification_started"
  });

  if (!testId || !orderId || !paymentId || !signature) {
    logger.warn({
      userId,
      testId,
      orderId,
      paymentId,
      error: "missing_required_parameters"
    });
    return res.status(400).json({ error: "testId, razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" });
  }

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    logger.warn({
      userId,
      testId,
      orderId,
      paymentId,
      error: "invalid_payment_signature"
    });
    return res.status(400).json({ error: "Invalid payment signature" });
  }

  const rz = getRazorpay();
  if (!rz) {
    logger.error({ error: "razorpay_not_configured" });
    return res.status(503).json({ error: "Razorpay is not configured" });
  }

  try {
    const order = await rz.orders.fetch(orderId);
    const notes = order.notes as Record<string, string> | undefined;

    // 🔥 STRICT ORDER OWNERSHIP VERIFICATION
    if (!notes?.userId || !notes?.testId) {
      logger.warn({
        userId,
        testId,
        orderId,
        paymentId,
        error: "order_missing_notes"
      });
      return res.status(400).json({ error: "Order metadata is incomplete" });
    }

    if (notes.userId !== userId) {
      logger.warn({
        userId,
        testId,
        orderId,
        paymentId,
        orderUserId: notes.userId,
        error: "order_ownership_mismatch"
      });
      return res.status(403).json({ error: "Order does not belong to this account" });
    }

    if (notes.testId !== testId) {
      logger.warn({
        userId,
        testId,
        orderId,
        paymentId,
        orderTestId: notes.testId,
        error: "order_test_mismatch"
      });
      return res.status(403).json({ error: "Order does not match the requested test" });
    }

    // 🔥 PAYMENT AMOUNT VALIDATION (VERY IMPORTANT)
    const testRows = await db.select().from(tests).where(eq(tests.id, testId)).limit(1);
    const test = testRows[0];
    if (!test) {
      logger.warn({
        userId,
        testId,
        orderId,
        paymentId,
        error: "test_not_found"
      });
      return res.status(404).json({ error: "Test not found" });
    }

    const expectedAmount = test.priceCents && test.priceCents > 0 ? test.priceCents : 499;
    if (order.amount !== expectedAmount) {
      logger.warn({
        userId,
        testId,
        orderId,
        paymentId,
        orderAmount: order.amount,
        expectedAmount,
        error: "amount_mismatch"
      });
      return res.status(400).json({ error: "Payment amount does not match expected amount" });
    }

  } catch (err) {
    logger.error({
      userId,
      testId,
      orderId,
      paymentId,
      error: "order_fetch_failed",
      err
    });
    return res.status(400).json({ error: "Could not verify order" });
  }

  try {
    const success = await grantTestEntitlement({
      userId,
      testId,
      source: "razorpay",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });

    if (!success) {
      logger.error({
        userId,
        testId,
        orderId,
        paymentId,
        error: "entitlement_grant_failed"
      });
      return res.status(500).json({ error: "Could not grant test access" });
    }

    logger.info({
      userId,
      testId,
      orderId,
      paymentId,
      status: "payment_verified_successfully"
    });

    return res.json({ ok: true });
  } catch (err) {
    logger.error({
      userId,
      testId,
      orderId,
      paymentId,
      error: "entitlement_grant_error",
      err
    });
    return res.status(500).json({ error: "Could not process payment" });
  }
});

router.post("/mock-unlock", authenticate, async (req, res) => {
  const allow =
    process.env.NODE_ENV === "development" ||
    process.env.ALLOW_MOCK_PAYMENTS === "true" ||
    process.env.ALLOW_MOCK_PAYMENTS === "1";
  if (!allow) {
    return res.status(403).json({ error: "Mock unlock is only allowed in development" });
  }

  const userId = req.user!.id;
  const testId = typeof req.body?.testId === "string" ? req.body.testId : "";
  if (!testId) {
    return res.status(400).json({ error: "testId is required" });
  }

  const testRows = await db.select().from(tests).where(eq(tests.id, testId)).limit(1);
  const test = testRows[0];
  if (!test) return res.status(404).json({ error: "Test not found" });
  if (test.access !== "paid") {
    return res.status(400).json({ error: "Test is already free" });
  }

  await grantTestEntitlement({ userId, testId, source: "mock" });

  return res.json({ ok: true });
});

export default router;
