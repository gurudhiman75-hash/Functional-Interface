import { Router, type IRouter } from "express";
import Razorpay from "razorpay";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { tests } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { getRazorpayCurrency, grantTestEntitlement, verifyPaymentSignature } from "../lib/razorpay-billing";

const router: IRouter = Router();

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

router.post("/razorpay/create-order", authenticate, async (req, res) => {
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

router.post("/razorpay/verify", authenticate, async (req, res) => {
  const userId = req.user!.id;
  const testId = typeof req.body?.testId === "string" ? req.body.testId : "";
  const orderId = typeof req.body?.razorpay_order_id === "string" ? req.body.razorpay_order_id : "";
  const paymentId = typeof req.body?.razorpay_payment_id === "string" ? req.body.razorpay_payment_id : "";
  const signature = typeof req.body?.razorpay_signature === "string" ? req.body.razorpay_signature : "";

  if (!testId || !orderId || !paymentId || !signature) {
    return res.status(400).json({ error: "testId, razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" });
  }

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    return res.status(400).json({ error: "Invalid payment signature" });
  }

  const rz = getRazorpay();
  if (!rz) {
    return res.status(503).json({ error: "Razorpay is not configured" });
  }

  try {
    const order = await rz.orders.fetch(orderId);
    const notes = order.notes as Record<string, string> | undefined;
    if (notes?.userId !== userId || notes?.testId !== testId) {
      return res.status(403).json({ error: "Order does not belong to this account or test" });
    }
  } catch (err) {
    console.error("Razorpay orders.fetch failed:", err);
    return res.status(400).json({ error: "Could not verify order" });
  }

  await grantTestEntitlement({
    userId,
    testId,
    source: "razorpay",
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
  });

  return res.json({ ok: true });
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
