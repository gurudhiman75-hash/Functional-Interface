import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { getCommercePurchases, formatCommerceMoney } from "@/lib/commerce";
import { getSessionUser } from "@/lib/session-user";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [startedAt] = useState(Date.now);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");
  const purchases = useQuery({
    queryKey: ["commerce-purchases", getSessionUser()?.id],
    queryFn: getCommercePurchases,
    staleTime: 0,
    retry: 1,
    refetchInterval: (query) => {
      const current = query.state.data?.orders.find((entry) => entry.id === id);
      return current && ["created", "payment_pending"].includes(current.status) && Date.now() - startedAt < 120_000 ? 3000 : false;
    },
  });
  const order = purchases.data?.orders.find((entry) => entry.id === id);
  const items = purchases.data?.items.filter((entry) => entry.orderId === id) ?? [];
  const hasAccess = purchases.data?.entitlements.some((entry) => entry.orderId === id && entry.accessStatus === "active") ?? false;

  const unsettledOrder = order != null && ["created", "payment_pending"].includes(order.status);
  const paymentFailed = unsettledOrder && order.paymentStatus === "failed";
  const userDropped = unsettledOrder && order.paymentStatus === "cancelled";
  const checkoutExpired = unsettledOrder && order.expiresAt != null && Date.parse(order.expiresAt) <= Date.now();
  const waiting = unsettledOrder && !paymentFailed && !userDropped && !checkoutExpired;
  const isFinalized = order != null && ["paid", "partially_refunded", "refunded"].includes(order.status);

  useEffect(() => {
    if (!id || !unsettledOrder) return;
    // A return URL is not payment proof. Reconcile only on the authenticated backend.
    void apiRequest(`/commerce/orders/${encodeURIComponent(id)}/reconcile`, { method: "POST" })
      .then(() => purchases.refetch())
      .catch(() => { /* Purchase history remains authoritative if the provider is temporarily unavailable. */ });
  }, [id, Boolean(unsettledOrder)]);

  async function checkAgain() {
    setChecking(true);
    setCheckError("");
    try {
      if (id && unsettledOrder) {
        await apiRequest(`/commerce/orders/${encodeURIComponent(id)}/reconcile`, { method: "POST" });
      }
      await purchases.refetch();
    } catch {
      setCheckError("We couldn't verify the latest payment result. Please try again or contact billing support.");
      await purchases.refetch().catch(() => {});
    } finally {
      setChecking(false);
    }
  }

  const title = purchases.isLoading ? "Checking payment…"
    : purchases.isError ? "Unable to check payment"
    : !order ? "Order not found"
    : hasAccess ? "Your package is ready"
    : order.status === "refunded" ? "Payment refunded"
    : order.status === "partially_refunded" ? "Payment partly refunded"
    : order.status === "paid" ? "Payment received"
    : paymentFailed ? "Payment failed"
    : userDropped ? "Payment not completed"
    : order.status === "cancelled" ? "Order cancelled"
    : order.status === "expired" || checkoutExpired ? "Checkout expired"
    : "Waiting for payment confirmation";

  const message = purchases.isError ? "Please try again to see the latest payment status."
    : !order && !purchases.isLoading ? "This order is unavailable for your signed-in account."
    : hasAccess ? "Your payment is confirmed and the purchased test is unlocked."
    : paymentFailed ? "Cashfree reported a failed payment. No charge is confirmed and no test access has been granted."
    : userDropped ? "You left the payment flow before completing payment. The demo test remains locked."
    : checkoutExpired ? "This checkout window has expired without a confirmed payment. Start a new checkout if you wish to try again."
    : order?.status === "paid" ? "Payment is confirmed. Refresh to check your package access."
    : waiting ? "We're still checking for a successful payment. If money was deducted, wait for confirmation before trying again."
    : "Review the order below or contact billing support for help.";

  const paymentResult = !order ? "Unavailable"
    : hasAccess || isFinalized ? "Payment confirmed"
    : paymentFailed ? "FAILED — payment not successful"
    : userDropped ? "USER_DROPPED — payment not completed"
    : checkoutExpired || ["expired", "cancelled"].includes(order.status) ? "No confirmed payment"
    : "Awaiting payment";

  return <div className="mx-auto max-w-2xl px-4 py-10">
    <section className="rounded-2xl border bg-card p-6 sm:p-8" aria-live="polite">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      {order ? <dl className="mt-6 space-y-3 text-sm">
        <div><dt className="text-muted-foreground">Order number</dt><dd className="break-all font-semibold">{order.orderNumber}</dd></div>
        <div><dt className="text-muted-foreground">Package</dt><dd>{items.map((item) => item.title).join(", ") || "Package details unavailable"}</dd></div>
        <div><dt className="text-muted-foreground">Order total</dt><dd className="font-semibold">{formatCommerceMoney(order.totalMinor, order.currency)}</dd></div>
        <div><dt className="text-muted-foreground">Payment result</dt><dd className="font-semibold">{paymentResult}</dd></div>
        <div><dt className="text-muted-foreground">Test access</dt><dd>{hasAccess ? "Unlocked" : "Not unlocked"}</dd></div>
        {checkoutExpired && !isFinalized ? <div><dt className="text-muted-foreground">Checkout window</dt><dd>Expired (the order record is retained for audit)</dd></div> : null}
      </dl> : null}
      {checkError ? <p role="alert" className="mt-4 text-sm text-destructive">{checkError}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/my-packages" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-semibold text-primary-foreground">My purchases</Link>
        {!hasAccess && order ? <Button variant="outline" disabled={checking || purchases.isFetching} onClick={() => void checkAgain()}>{checking ? "Verifying…" : "Check again"}</Button> : null}
        {order && !hasAccess && (paymentFailed || userDropped || checkoutExpired || ["cancelled", "expired"].includes(order.status)) && items[0] ? <Link className="inline-flex min-h-11 items-center underline" href={`/checkout/${encodeURIComponent(items[0].productId)}`}>Try a new checkout</Link> : null}
        <Link href="/billing-help" className="inline-flex min-h-11 items-center underline">Payment help</Link>
      </div>
    </section>
  </div>;
}
