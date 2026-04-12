import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { tests, userTestEntitlements } from "@workspace/db";
import { logger } from "./logger";

export function getRazorpayCurrency(): string {
  return (process.env.RAZORPAY_CURRENCY ?? "INR").toUpperCase();
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === signature;
}

export async function grantTestEntitlement(params: {
  userId: string;
  testId: string;
  source: "razorpay" | "mock" | "admin";
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
}): Promise<boolean> {
  const testRows = await db.select().from(tests).where(eq(tests.id, params.testId)).limit(1);
  const test = testRows[0];
  if (!test || test.access !== "paid") {
    logger.warn({ testId: params.testId }, "grantTestEntitlement skipped: invalid test");
    return false;
  }

  try {
    await db
      .insert(userTestEntitlements)
      .values({
        userId: params.userId,
        testId: params.testId,
        source: params.source,
        razorpayOrderId: params.razorpayOrderId ?? null,
        razorpayPaymentId: params.razorpayPaymentId ?? null,
      })
      .onConflictDoNothing();
    return true;
  } catch (err) {
    logger.error({ err, ...params }, "grantTestEntitlement failed");
    return false;
  }
}
