import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { getCommercePurchases, formatCommerceMoney } from "@/lib/commerce";
import { getSessionUser } from "@/lib/session-user";
import { Button } from "@/components/ui/button";

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [startedAt] = useState(Date.now);
  const purchases = useQuery({
    queryKey: ["commerce-purchases", getSessionUser()?.id],
    queryFn: getCommercePurchases,
    staleTime: 0,
    retry: 1,
    refetchInterval: (query) => {
      const order = query.state.data?.orders.find((entry) => entry.id === id);
      return order && ["created", "payment_pending"].includes(order.status) && Date.now() - startedAt < 120_000 ? 3000 : false;
    },
  });
  const order = purchases.data?.orders.find((entry) => entry.id === id);
  const items = purchases.data?.items.filter((entry) => entry.orderId === id) ?? [];
  const hasAccess = purchases.data?.entitlements.some((entry) => entry.orderId === id && entry.accessStatus === "active");
  const pending = order && ["created", "payment_pending"].includes(order.status);
  const title = purchases.isLoading ? "Checking payment…" : purchases.isError ? "Unable to check payment" : !order ? "Order not found" : hasAccess ? "Your package is ready" : order.status === "paid" ? "Payment received" : order.status === "refunded" ? "Payment refunded" : order.status === "partially_refunded" ? "Payment partly refunded" : order.status === "cancelled" ? "Order cancelled" : order.status === "expired" ? "Checkout expired" : order.paymentStatus === "failed" ? "Payment unsuccessful" : "Waiting for payment confirmation";
  return <div className="mx-auto max-w-2xl px-4 py-10">
    <section className="rounded-2xl border bg-card p-6 sm:p-8" aria-live="polite">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{purchases.isError ? "Please try again to see the latest payment status." : !order && !purchases.isLoading ? "This order is unavailable for your signed-in account." : hasAccess ? "You can now open your package from My purchases." : pending ? "We are checking your payment. If money was deducted, allow a few minutes for confirmation before paying again." : order?.status === "paid" ? "Your payment is confirmed. Check My purchases for the latest package access." : "Review your order below or contact billing support for help."}</p>
      {order ? <dl className="mt-6 space-y-3 text-sm">
        <div><dt className="text-muted-foreground">Order number</dt><dd className="break-all font-semibold">{order.orderNumber}</dd></div>
        <div><dt className="text-muted-foreground">Package</dt><dd>{items.map((item) => item.title).join(", ") || "Package details unavailable"}</dd></div>
        <div><dt className="text-muted-foreground">Order total</dt><dd className="font-semibold">{formatCommerceMoney(order.totalMinor, order.currency)}</dd></div>
        <div><dt className="text-muted-foreground">Status</dt><dd>{order.status.replaceAll("_", " ")}</dd></div>
      </dl> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/my-packages" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-semibold text-primary-foreground">My purchases</Link>
        {!hasAccess ? <Button variant="outline" disabled={purchases.isFetching} onClick={() => purchases.refetch()}>Check again</Button> : null}
        {order && ["cancelled", "expired"].includes(order.status) && items[0] ? <Link className="inline-flex min-h-11 items-center underline" href={`/checkout/${encodeURIComponent(items[0].productId)}`}>Return to checkout</Link> : null}
        <Link href="/billing-help" className="inline-flex min-h-11 items-center underline">Payment help</Link>
      </div>
    </section>
  </div>;
}
