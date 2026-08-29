import { apiRequest } from "@/lib/api";

export type CommerceProduct = {
  id: string;
  code: string;
  title: string;
  description: string;
  currency: string;
  listPriceMinor: number;
  salePriceMinor: number;
  validityDays: number | null;
  saleStartAt: string | null;
  saleEndAt: string | null;
  testCount: number;
};

type CommerceProductsResponse = {
  products: CommerceProduct[];
  generatedAt: string;
};

export type CommerceCheckoutOrder = {
  orderId: string;
  orderNumber: string;
  status: string;
  amountMinor: number;
  discountMinor: number;
  currency: string;
  provider: "razorpay";
  providerOrderId: string;
  keyId: string;
};

export type CommercePurchaseOrder = {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  refundedMinor: number;
  paymentStatus: string | null;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  cancelledAt: string | null;
  expiresAt: string | null;
};

export type CommercePurchaseItem = {
  id: string;
  orderId: string;
  productId: string;
  productVersionId: string;
  productCode: string;
  title: string;
  description: string;
  validityDays: number | null;
  testCount: number;
  quantity: number;
  unitPriceMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  createdAt: string;
};

export type CommerceEntitlement = {
  id: string;
  orderItemId: string | null;
  orderId: string | null;
  productVersionId: string;
  productId: string;
  productCode: string;
  productTitle: string;
  productDescription: string;
  status: string;
  accessStatus: string;
  startsAt: string;
  endsAt: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
  grantSource: string;
  createdAt: string;
  testCount: number;
};

export type CommercePurchasesResponse = {
  orders: CommercePurchaseOrder[];
  items: CommercePurchaseItem[];
  entitlements: CommerceEntitlement[];
  generatedAt: string;
};

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailure = {
  error?: {
    description?: string;
    reason?: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on?: (event: string, handler: (response: RazorpayFailure) => void) => void;
    };
  }
}

export async function getCommerceProducts(): Promise<CommerceProductsResponse> {
  return apiRequest<CommerceProductsResponse>("/commerce/products");
}

export async function getCommercePurchases(): Promise<CommercePurchasesResponse> {
  return apiRequest<CommercePurchasesResponse>("/commerce/purchases");
}

function checkoutStorageKey(productId: string) {
  return `examtree.commerce.checkout.${productId}`;
}

function checkoutIdempotencyKey(productId: string): string {
  const fallback = `checkout-${productId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  if (typeof window === "undefined") return fallback;

  const key = checkoutStorageKey(productId);
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw) {
      const saved = JSON.parse(raw) as { value?: unknown; createdAt?: unknown };
      const value = typeof saved.value === "string" ? saved.value : "";
      const createdAt = Number(saved.createdAt ?? 0);
      if (value.length >= 12 && Date.now() - createdAt < 25 * 60 * 1000) return value;
    }

    const value = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? `store-${crypto.randomUUID()}`
      : fallback;
    window.sessionStorage.setItem(key, JSON.stringify({ value, createdAt: Date.now() }));
    return value;
  } catch {
    return fallback;
  }
}

export async function createCommerceOrder(productId: string): Promise<CommerceCheckoutOrder> {
  return apiRequest<CommerceCheckoutOrder>("/commerce/orders", {
    method: "POST",
    body: JSON.stringify({
      productId,
      idempotencyKey: checkoutIdempotencyKey(productId),
    }),
  });
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Razorpay checkout")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export async function openCommerceCheckout(params: {
  product: CommerceProduct;
  studentName?: string;
  studentEmail?: string;
  onPaymentSubmitted: (details: { orderId: string; orderNumber: string; paymentId: string }) => void;
  onDismiss?: () => void;
  onError?: (message: string) => void;
}): Promise<void> {
  try {
    const order = await createCommerceOrder(params.product.id);
    await loadRazorpayScript();
    if (!window.Razorpay) throw new Error("Razorpay failed to initialize");

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amountMinor,
      currency: order.currency,
      order_id: order.providerOrderId,
      name: "ExamTree",
      description: params.product.title,
      prefill: {
        name: params.studentName ?? "",
        email: params.studentEmail ?? "",
      },
      theme: { color: "#6657e8" },
      handler: (response: RazorpaySuccess) => {
        params.onPaymentSubmitted({
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          paymentId: response.razorpay_payment_id,
        });
      },
      modal: {
        ondismiss: () => params.onDismiss?.(),
      },
    });

    checkout.on?.("payment.failed", (response: RazorpayFailure) => {
      params.onError?.(response.error?.description ?? response.error?.reason ?? "Payment could not be completed");
    });
    checkout.open();
  } catch (error) {
    params.onError?.(error instanceof Error ? error.message : "Unable to start checkout");
  }
}

export function formatCommerceMoney(minor: number, currency: string): string {
  const safeCurrency = /^[A-Z]{3}$/i.test(currency) ? currency.toUpperCase() : "INR";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number(minor) || 0) / 100);
}

export function commerceDiscountPercent(product: CommerceProduct): number {
  if (product.listPriceMinor <= 0 || product.salePriceMinor >= product.listPriceMinor) return 0;
  return Math.max(0, Math.min(100, Math.round(((product.listPriceMinor - product.salePriceMinor) / product.listPriceMinor) * 100)));
}
