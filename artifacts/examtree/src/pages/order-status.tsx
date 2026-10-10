import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  HelpCircle,
  LoaderCircle,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  TreePine,
  XCircle,
} from "lucide-react";

import { getCommercePurchases, formatCommerceMoney } from "@/lib/commerce";
import { getSessionUser } from "@/lib/session-user";

type OrderViewState =
  | "loading"
  | "ready"
  | "activating"
  | "pending"
  | "failed"
  | "cancelled"
  | "expired"
  | "refunded"
  | "partially-refunded"
  | "not-found"
  | "error";

function humanizeStatus(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function OrderStatusPage() {
  const { id = "" } = useParams<{ id: string }>();
  const [startedAt] = useState(Date.now);
  const user = getSessionUser();
  const purchases = useQuery({
    queryKey: ["commerce-purchases", user?.id],
    queryFn: getCommercePurchases,
    staleTime: 0,
    retry: 1,
    refetchInterval: (query) => {
      const order = query.state.data?.orders.find((entry) => entry.id === id);
      if (!order) return false;
      const hasAccess = query.state.data?.entitlements.some(
        (entry) => entry.orderId === id && entry.accessStatus === "active",
      );
      const needsPaymentCheck = ["created", "payment_pending"].includes(order.status);
      const needsAccessCheck = order.status === "paid" && !hasAccess;
      return needsPaymentCheck || needsAccessCheck
        ? Date.now() - startedAt < 120_000 ? 3_000 : false
        : false;
    },
  });

  const order = purchases.data?.orders.find((entry) => entry.id === id);
  const items = purchases.data?.items.filter((entry) => entry.orderId === id) ?? [];
  const hasAccess = purchases.data?.entitlements.some(
    (entry) => entry.orderId === id && entry.accessStatus === "active",
  ) ?? false;

  let viewState: OrderViewState = "loading";
  if (!purchases.isLoading && purchases.isError) viewState = "error";
  else if (!purchases.isLoading && !order) viewState = "not-found";
  else if (order?.status === "refunded") viewState = "refunded";
  else if (order?.status === "partially_refunded") viewState = "partially-refunded";
  else if (hasAccess) viewState = "ready";
  else if (order?.status === "paid") viewState = "activating";
  else if (order?.paymentStatus === "failed" || order?.status === "failed") viewState = "failed";
  else if (order?.status === "cancelled") viewState = "cancelled";
  else if (order?.status === "expired") viewState = "expired";
  else if (order) viewState = "pending";

  const copy: Record<OrderViewState, { label: string; title: string; subtitle: string; eyebrow: string; cardTitle: string; cardCopy: string }> = {
    loading: {
      label: "CHECKING ORDER",
      title: "Checking your payment…",
      subtitle: "We’re fetching the latest status for your order.",
      eyebrow: "ORDER STATUS",
      cardTitle: "One moment.",
      cardCopy: "Your order details are loading.",
    },
    ready: {
      label: "ACCESS READY",
      title: "Your package is ready.",
      subtitle: "Payment confirmed and your package is active.",
      eyebrow: "PURCHASE COMPLETE",
      cardTitle: "You’re all set.",
      cardCopy: "Open My purchases to see your package and included tests.",
    },
    activating: {
      label: "PAYMENT RECEIVED",
      title: "Payment received. Access is syncing.",
      subtitle: "Your payment is confirmed. We’re checking that package access is active.",
      eyebrow: "PAYMENT CONFIRMED",
      cardTitle: "We’re finishing setup.",
      cardCopy: "Your package is being prepared. Check this page again shortly before starting another payment.",
    },
    pending: {
      label: "VERIFYING PAYMENT",
      title: "We’re confirming your payment.",
      subtitle: "Please wait while we check the final status with the payment provider.",
      eyebrow: "PLEASE WAIT",
      cardTitle: "Your order is being checked.",
      cardCopy: "If money was deducted, allow a few minutes for the status to update. Avoid paying again while this order is pending.",
    },
    failed: {
      label: "PAYMENT UNSUCCESSFUL",
      title: "The payment wasn’t completed.",
      subtitle: "No active package access is recorded for this order.",
      eyebrow: "PAYMENT NOT COMPLETE",
      cardTitle: "Check with us before retrying.",
      cardCopy: "If your bank shows a debit, contact payment help with this order number before trying again.",
    },
    cancelled: {
      label: "ORDER CANCELLED",
      title: "This order was cancelled.",
      subtitle: "No package access was created for this order.",
      eyebrow: "ORDER CANCELLED",
      cardTitle: "You can return to checkout.",
      cardCopy: "Review the package and current price before starting a new payment.",
    },
    expired: {
      label: "CHECKOUT EXPIRED",
      title: "This checkout has expired.",
      subtitle: "The payment window for this order is no longer active.",
      eyebrow: "ORDER EXPIRED",
      cardTitle: "Ready when you are.",
      cardCopy: "Return to checkout to review the package and start a new order.",
    },
    refunded: {
      label: "REFUND CONFIRMED",
      title: "This payment was refunded.",
      subtitle: "The refund has been recorded for this order.",
      eyebrow: "REFUND RECORDED",
      cardTitle: "Need help with your refund?",
      cardCopy: "Keep this order number handy if you contact payment support.",
    },
    "partially-refunded": {
      label: "PARTIAL REFUND",
      title: "A partial refund was recorded.",
      subtitle: "Review the refund amount in your order summary.",
      eyebrow: "REFUND RECORDED",
      cardTitle: "Need help with your refund?",
      cardCopy: "Keep this order number handy if you contact payment support.",
    },
    "not-found": {
      label: "ORDER NOT FOUND",
      title: "We couldn’t find this order.",
      subtitle: "Make sure you’re signed in to the account used during checkout.",
      eyebrow: "CHECK YOUR ACCOUNT",
      cardTitle: "This order isn’t available here.",
      cardCopy: "Try checking your purchases or refresh this page to load the latest order details.",
    },
    error: {
      label: "STATUS UNAVAILABLE",
      title: "We couldn’t check the payment.",
      subtitle: "Your payment status couldn’t be refreshed right now.",
      eyebrow: "TRY AGAIN",
      cardTitle: "Your order is still safe.",
      cardCopy: "Check again in a moment. Don’t start another payment until the current order status is clear.",
    },
  };

  const status = copy[viewState];
  const StatusIcon = viewState === "ready"
    ? CheckCircle2
    : viewState === "pending" || viewState === "activating" || viewState === "loading"
      ? viewState === "loading" ? LoaderCircle : Clock3
      : viewState === "failed" || viewState === "cancelled" || viewState === "expired"
        ? XCircle
        : viewState === "refunded" || viewState === "partially-refunded"
          ? ShieldCheck
          : AlertCircle;

  const statusTone = viewState === "ready"
    ? "bg-emerald-50 text-emerald-700"
    : viewState === "pending" || viewState === "activating" || viewState === "loading"
      ? "bg-amber-50 text-amber-800"
      : viewState === "failed" || viewState === "cancelled" || viewState === "expired"
        ? "bg-rose-50 text-rose-700"
        : viewState === "refunded" || viewState === "partially-refunded"
          ? "bg-slate-100 text-slate-700"
          : "bg-blue-50 text-blue-700";

  const iconTone = viewState === "ready"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-50"
    : viewState === "pending" || viewState === "activating" || viewState === "loading"
      ? "bg-amber-50 text-amber-700 ring-amber-50"
      : viewState === "failed" || viewState === "cancelled" || viewState === "expired"
        ? "bg-rose-50 text-rose-700 ring-rose-50"
        : viewState === "refunded" || viewState === "partially-refunded"
          ? "bg-slate-100 text-slate-700 ring-slate-100"
          : "bg-blue-50 text-blue-700 ring-blue-50";

  const paymentDone = ["ready", "activating", "refunded", "partially-refunded"].includes(viewState);
  const accessDone = viewState === "ready";
  const accessPending = viewState === "activating";
  const canRetry = ["pending", "activating", "failed", "not-found", "error"].includes(viewState);
  const retryLabel = purchases.isFetching ? "Checking status…" : viewState === "failed" ? "Check this order again" : "Check payment status";
  const canReturnToCheckout = !!order && !!items[0] && ["cancelled", "expired"].includes(order.status);
  const primaryHref = viewState === "ready" ? "/my-packages" : viewState === "refunded" || viewState === "partially-refunded" ? "/store" : canReturnToCheckout ? "/checkout/" + encodeURIComponent(items[0].productId) : "";
  const primaryLabel = viewState === "ready" ? "Open My purchases" : viewState === "refunded" || viewState === "partially-refunded" ? "Browse packages" : "Return to checkout";
  const note = viewState === "ready"
    ? "This order is verified. Your access is available from My purchases."
    : viewState === "activating"
      ? "Payment is confirmed. Package access will appear here once it is active."
      : viewState === "pending"
        ? "Avoid starting a second payment while this order is being checked."
        : viewState === "refunded" || viewState === "partially-refunded"
          ? "Contact payment help if you need assistance with this order."
          : viewState === "failed"
            ? "If your bank shows a debit, use payment help before retrying."
            : "Keep this order number handy if you contact support.";

  const paymentStepCurrent = !paymentDone && viewState !== "loading" && viewState !== "error" && viewState !== "not-found";
  const hasOrder = !!order;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#14213b]" data-testid="order-status-page">
      <header className="h-16 border-b border-[#e5eaf1] bg-white">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/store" className="flex min-h-11 items-center gap-2.5 rounded-lg text-[19px] font-extrabold tracking-[-0.04em] text-[#0b1b38] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#0b1b38] text-[#efc45c]">
              <TreePine className="h-5 w-5" strokeWidth={2.1} />
            </span>
            Examtree
          </Link>
          <Link href="/billing-help" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:text-[#1769ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
            <HelpCircle className="h-4 w-4" />
            <span>Payment help</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <nav className="mx-auto mb-6 flex max-w-[490px] items-center justify-center" aria-label="Purchase progress">
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 sm:text-[11px]">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-emerald-100 bg-emerald-50"><Check className="h-3.5 w-3.5" /></span>
            Package
          </div>
          <span aria-hidden="true" className={"mx-3 h-px flex-1 " + (paymentDone ? "bg-emerald-200" : "bg-slate-200")} />
          <div className={"flex items-center gap-2 text-[10px] font-bold sm:text-[11px] " + (paymentStepCurrent ? "text-[#0b1b38]" : paymentDone ? "text-emerald-700" : "text-slate-400")}>
            <span className={"grid h-7 w-7 place-items-center rounded-full border " + (paymentDone ? "border-emerald-100 bg-emerald-50 text-emerald-700" : paymentStepCurrent ? "border-[#1769ed] bg-[#1769ed] text-white shadow-[0_4px_12px_rgba(23,105,237,0.22)]" : "border-slate-200 bg-white text-slate-400")}>
              {paymentDone ? <Check className="h-3.5 w-3.5" /> : "2"}
            </span>
            Payment
          </div>
          <span aria-hidden="true" className={"mx-3 h-px flex-1 " + (accessDone ? "bg-emerald-200" : "bg-slate-200")} />
          <div className={"flex items-center gap-2 text-[10px] font-bold sm:text-[11px] " + (accessDone ? "text-emerald-700" : accessPending ? "text-[#0b1b38]" : "text-slate-400")}>
            <span className={"grid h-7 w-7 place-items-center rounded-full border " + (accessDone ? "border-emerald-100 bg-emerald-50 text-emerald-700" : accessPending ? "border-[#1769ed] bg-[#1769ed] text-white" : "border-slate-200 bg-white text-slate-400")}>
              {accessDone ? <Check className="h-3.5 w-3.5" /> : "3"}
            </span>
            Access
          </div>
        </nav>

        <section className="mb-6 text-center" aria-live="polite">
          <span className={"inline-flex min-h-7 items-center gap-2 rounded-full px-3 py-1 text-[9px] font-extrabold tracking-[0.12em] " + statusTone}>
            <span className={"h-1.5 w-1.5 rounded-full " + (viewState === "pending" || viewState === "activating" ? "animate-pulse bg-current" : "bg-current")} />
            {status.label}
          </span>
          <h1 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.055em] text-[#0b1b38] sm:text-[36px]">{status.title}</h1>
          <p className="mx-auto mt-1.5 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">{status.subtitle}</p>
        </section>

        <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.35fr)_minmax(290px,0.8fr)] lg:gap-5">
          <section className="rounded-[18px] border border-[#e5eaf1] bg-white p-5 shadow-[0_8px_28px_rgba(27,43,70,0.035)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className={"grid h-14 w-14 shrink-0 place-items-center rounded-full ring-8 " + iconTone}>
                <StatusIcon className={"h-7 w-7 " + (viewState === "loading" || viewState === "activating" || viewState === "pending" ? "animate-pulse" : "")} />
              </span>
              <div className="pt-1">
                <p className={"text-[9px] font-extrabold tracking-[0.15em] " + (viewState === "ready" ? "text-emerald-700" : viewState === "failed" || viewState === "cancelled" || viewState === "expired" ? "text-rose-700" : "text-[#1769ed]")}>{status.eyebrow}</p>
                <h2 className="mt-1 text-[20px] font-extrabold tracking-[-0.035em] text-[#0b1b38] sm:text-[23px]">{status.cardTitle}</h2>
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-600 sm:ml-[72px] sm:mt-3 sm:text-[13px]">{status.cardCopy}</p>

            <div className="mt-5 flex flex-col gap-2.5 sm:ml-[72px] sm:flex-row">
              {primaryHref ? (
                <Link href={primaryHref} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b1b38] px-4 text-xs font-extrabold text-white shadow-[0_6px_15px_rgba(11,27,56,0.15)] transition hover:bg-[#142a50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  {primaryLabel}<ArrowRight className="h-4 w-4" />
                </Link>
              ) : canRetry ? (
                <button type="button" onClick={() => void purchases.refetch()} disabled={purchases.isFetching} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b1b38] px-4 text-xs font-extrabold text-white shadow-[0_6px_15px_rgba(11,27,56,0.15)] transition hover:bg-[#142a50] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                  <RefreshCw className={"h-4 w-4 " + (purchases.isFetching ? "animate-spin" : "")} />
                  {retryLabel}
                </button>
              ) : viewState === "refunded" || viewState === "partially-refunded" ? (
                <Link href="/store" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b1b38] px-4 text-xs font-extrabold text-white hover:bg-[#142a50]">
                  Browse packages<ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}

              {viewState === "ready" ? (
                <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e1e7ef] bg-white px-4 text-xs font-bold text-[#34445e] hover:border-slate-300">
                  Go to dashboard
                </Link>
              ) : (
                <Link href="/billing-help" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e1e7ef] bg-white px-4 text-xs font-bold text-[#34445e] hover:border-slate-300">
                  <HelpCircle className="h-4 w-4" />Payment help
                </Link>
              )}
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#e2eee7] bg-[#f8fcf9] px-3.5 py-3 text-[10px] leading-5 text-slate-600 sm:ml-[72px] sm:text-[11px]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <span>{status.cardCopy} {hasOrder && order ? "Order status: " + humanizeStatus(order.status) + "." : ""}</span>
            </div>
          </section>

          {order ? (
            <aside className="overflow-hidden rounded-[18px] border border-[#e5eaf1] bg-white shadow-[0_8px_28px_rgba(27,43,70,0.035)]" aria-label="Order summary">
              <div className="bg-[#0b1b38] px-5 py-4 text-white">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-100/70">Order confirmation</p>
                <p className="mt-1 text-sm font-extrabold">Order #{order.orderNumber}</p>
              </div>
              <div className="p-5">
                <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">Package{items.length === 1 ? "" : "s"}</p>
                <div className="space-y-3 border-b border-[#e7ebf1] pb-4">
                  {items.length ? items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf4ff] text-[#1769ed]"><PackageCheck className="h-5 w-5" /></span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-[#14213b]">{item.title}</p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {item.validityDays && item.validityDays > 0 ? item.validityDays + " days" : "Package access"}
                          <span className="px-1">·</span>
                          {item.testCount} {item.testCount === 1 ? "test" : "tests"}
                        </p>
                      </div>
                    </div>
                  )) : <p className="text-xs text-slate-500">Package details are not available.</p>}
                </div>

                <dl className="space-y-3 py-4 text-[11px]">
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Payment status</dt><dd className="text-right font-bold text-[#34445e]">{order.paymentStatus ? humanizeStatus(order.paymentStatus) : humanizeStatus(order.status)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-slate-500">Order number</dt><dd className="text-right font-bold text-[#34445e]">{order.orderNumber}</dd></div>
                  {order.refundedMinor > 0 ? <div className="flex justify-between gap-3"><dt className="text-slate-500">Refunded</dt><dd className="text-right font-bold text-slate-700">{formatCommerceMoney(order.refundedMinor, order.currency)}</dd></div> : null}
                </dl>

                <div className="flex items-end justify-between border-t border-[#e7ebf1] pt-4">
                  <span className="pb-0.5 text-xs font-semibold text-slate-600">{viewState === "ready" ? "Paid" : viewState === "pending" || viewState === "activating" ? "Order total" : "Total"}</span>
                  <strong className="text-[25px] font-black leading-none tracking-[-0.05em] text-[#0b1b38]">{formatCommerceMoney(order.totalMinor, order.currency)}</strong>
                </div>
                <p className="mt-3 rounded-lg bg-[#f5f8fc] px-3 py-2.5 text-[10px] leading-5 text-slate-600">{note}</p>
              </div>
            </aside>
          ) : (
            <aside className="rounded-[18px] border border-[#e5eaf1] bg-white p-5 shadow-[0_8px_28px_rgba(27,43,70,0.035)] sm:p-6" aria-label="Order lookup">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf4ff] text-[#1769ed]"><LockKeyhole className="h-5 w-5" /></span>
              <h2 className="mt-3 text-sm font-extrabold text-[#0b1b38]">{viewState === "error" ? "Order status is temporarily unavailable." : viewState === "loading" ? "Loading order details…" : "Check your signed-in account."}</h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">{viewState === "error" ? "Try again to refresh the latest payment status." : "Only orders placed by this account can be shown here."}</p>
              {canRetry ? <button type="button" onClick={() => void purchases.refetch()} disabled={purchases.isFetching} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#e1e7ef] px-3 text-xs font-bold text-[#34445e] hover:border-slate-300 disabled:opacity-60"><RefreshCw className={"h-3.5 w-3.5 " + (purchases.isFetching ? "animate-spin" : "")} />Try again</button> : null}
            </aside>
          )}
        </div>

        <footer className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-slate-400">
          <LockKeyhole className="h-3 w-3" />
          <span>Payment status is verified before package access is shown.</span>
          <span className="px-1">·</span>
          <Link href="/billing-help" className="font-bold text-[#1769ed] hover:underline">Payment help</Link>
        </footer>
      </main>
    </div>
  );
}
