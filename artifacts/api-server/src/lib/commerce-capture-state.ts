/** Cashfree / Razorpay settlement state gate.
 *
 * A late success callback must NEVER resurrect an expired, cancelled,
 * fully refunded, or partially refunded order, or reset refund history.
 * Retry success is permitted only while the canonical order is open.
 */
export type CaptureDisposition = "already_finalized" | "process" | "reject";

export function captureDisposition(orderStatus: string, paymentStatus: string): CaptureDisposition {
  if (orderStatus === "paid" && paymentStatus === "captured") return "already_finalized";
  if (
    (orderStatus === "created" || orderStatus === "payment_pending") &&
    ["created", "authorized", "failed", "cancelled"].includes(paymentStatus)
  ) return "process";
  return "reject";
}
