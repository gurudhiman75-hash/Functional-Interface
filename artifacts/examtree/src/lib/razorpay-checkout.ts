import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/data";

export type RazorpayOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  testName: string;
};

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout script"));
    document.body.appendChild(script);
  });
}

/**
 * Creates a Razorpay order and opens Checkout. Calls `verifyRazorpayPayment` after success.
 */
export async function openRazorpayCheckoutForTest(params: {
  testId: string;
  successPath?: string;
  onPaid: () => void;
  onDismiss?: () => void;
  onError?: (message: string) => void;
}): Promise<void> {
  const order = (await createRazorpayOrder({
    testId: params.testId,
    successPath: params.successPath,
  })) as RazorpayOrderResponse;

  await loadRazorpayScript();
  const RZP = (window as any).Razorpay;
  if (!RZP) {
    params.onError?.("Razorpay failed to initialize");
    return;
  }

  const rzp = new RZP({
    key: order.keyId,
    amount: order.amount,
    currency: order.currency,
    order_id: order.orderId,
    name: "ExamTree",
    description: order.testName,
    handler: async (response: RazorpaySuccess) => {
      try {
        await verifyRazorpayPayment({
          testId: params.testId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        params.onPaid();
      } catch (e) {
        params.onError?.(e instanceof Error ? e.message : "Payment verification failed");
      }
    },
    modal: {
      ondismiss: () => params.onDismiss?.(),
    },
  });

  rzp.open();
}
