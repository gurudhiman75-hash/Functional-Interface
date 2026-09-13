import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiError, getApiErrorCode } from "@/lib/api";
import {
  formatCommerceMoney,
  getCommercePurchases,
  type CommerceEntitlement,
  type CommercePurchaseItem,
  type CommercePurchaseOrder,
} from "@/lib/commerce";

type Tone = "violet" | "emerald" | "amber" | "rose" | "slate" | "sky";

const toneClasses: Record<Tone, string> = {
  violet: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  rose: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  slate: "border-slate-200 bg-slate-50 text-slate-600 dark:border-border dark:bg-muted/45 dark:text-muted-foreground",
  sky: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
};

function formatDate(value?: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function orderStatusMeta(order: CommercePurchaseOrder): { label: string; tone: Tone } {
  switch (order.status) {
    case "paid":
      return { label: "Paid", tone: "emerald" };
    case "partially_refunded":
      return { label: "Partially refunded", tone: "amber" };
    case "refunded":
      return { label: "Refunded", tone: "sky" };
    case "payment_pending":
      return { label: "Payment pending", tone: "amber" };
    case "created":
      return { label: "Checkout started", tone: "slate" };
    case "cancelled":
      return { label: "Cancelled", tone: "rose" };
    case "expired":
      return { label: "Expired", tone: "slate" };
    default:
      return { label: order.status.replaceAll("_", " "), tone: "slate" };
  }
}

function accessStatusMeta(entitlement: CommerceEntitlement): { label: string; tone: Tone } {
  switch (entitlement.accessStatus) {
    case "active":
      return { label: "Active access", tone: "emerald" };
    case "scheduled":
      return { label: "Scheduled", tone: "amber" };
    case "expired":
      return { label: "Expired", tone: "slate" };
    case "revoked":
      return { label: "Revoked", tone: "rose" };
    default:
      return { label: entitlement.accessStatus.replaceAll("_", " "), tone: "slate" };
  }
}

function grantSourceLabel(source: string) {
  if (source === "paid_order") return "Purchased";
  if (source === "manual") return "Granted by ExamTree";
  return source.replaceAll("_", " ");
}

function StatusChip({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-[10px] font-black capitalize ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}

function AccessCard({ entitlement }: { entitlement: CommerceEntitlement }) {
  const meta = accessStatusMeta(entitlement);
  const active = entitlement.accessStatus === "active";

  return (
    <article className="rounded-[24px] border border-[#e4e1f0] bg-white p-5 shadow-[0_10px_30px_rgba(48,44,83,0.04)] dark:border-border dark:bg-card" data-testid={`purchase-entitlement-${entitlement.id}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/45 dark:text-violet-300"}`}>
          <PackageCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <StatusChip {...meta} />
      </div>

      <h3 className="mt-4 text-base font-black leading-6 tracking-[-0.02em] text-slate-950 dark:text-foreground">{entitlement.productTitle}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-muted-foreground">
        <span>{entitlement.productCode}</span>
        <span aria-hidden="true">•</span>
        <span>{entitlement.testCount} {entitlement.testCount === 1 ? "test" : "tests"}</span>
        <span aria-hidden="true">•</span>
        <span className="capitalize">{grantSourceLabel(entitlement.grantSource)}</span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-[#f8f7fc] px-3 py-3 dark:bg-muted/40">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Starts</p>
          <p className="mt-1 text-xs font-bold text-slate-800 dark:text-foreground">{formatDate(entitlement.startsAt)}</p>
        </div>
        <div className="rounded-xl bg-[#f8f7fc] px-3 py-3 dark:bg-muted/40">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Valid until</p>
          <p className="mt-1 text-xs font-bold text-slate-800 dark:text-foreground">{entitlement.endsAt ? formatDate(entitlement.endsAt) : "No end date"}</p>
        </div>
      </div>

      {entitlement.accessStatus === "revoked" && entitlement.revokeReason ? (
        <p className="mt-3 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2.5 text-xs leading-5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/25 dark:text-rose-300">
          {entitlement.revokeReason}
        </p>
      ) : null}

      {active ? (
        <Link href="/exams" className="et-interactive mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6657e8] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#594bd9]">
          Use this access <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </article>
  );
}

function OrderCard({
  order,
  items,
  entitlements,
}: {
  order: CommercePurchaseOrder;
  items: CommercePurchaseItem[];
  entitlements: CommerceEntitlement[];
}) {
  const meta = orderStatusMeta(order);
  const title = items[0]?.title ?? `Order ${order.orderNumber}`;
  const extraCount = Math.max(0, items.length - 1);
  const activeAccess = entitlements.some((item) => item.accessStatus === "active");

  return (
    <article className="rounded-[24px] border border-[#e4e1f0] bg-white p-5 shadow-[0_10px_30px_rgba(48,44,83,0.04)] dark:border-border dark:bg-card" data-testid={`purchase-order-${order.id}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/45 dark:text-violet-300">
            <ReceiptText className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-black tracking-[-0.02em] text-slate-950 dark:text-foreground">{title}</h3>
              {extraCount > 0 ? <span className="text-[10px] font-bold text-slate-400">+{extraCount} more</span> : null}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">Order {order.orderNumber} · {formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <StatusChip {...meta} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-[#f8f7fc] px-3 py-3 dark:bg-muted/40">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Amount</p>
          <p className="mt-1 text-sm font-black text-slate-900 dark:text-foreground">{formatCommerceMoney(order.totalMinor, order.currency)}</p>
        </div>
        <div className="rounded-xl bg-[#f8f7fc] px-3 py-3 dark:bg-muted/40">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Discount</p>
          <p className="mt-1 text-sm font-black text-slate-900 dark:text-foreground">{order.discountMinor > 0 ? formatCommerceMoney(order.discountMinor, order.currency) : "—"}</p>
        </div>
        <div className="rounded-xl bg-[#f8f7fc] px-3 py-3 dark:bg-muted/40">
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Refunded</p>
          <p className="mt-1 text-sm font-black text-slate-900 dark:text-foreground">{order.refundedMinor > 0 ? formatCommerceMoney(order.refundedMinor, order.currency) : "—"}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-muted-foreground">
        {order.paidAt ? <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Paid {formatDate(order.paidAt)}</span> : null}
        {activeAccess ? <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#6657e8]" /> Access active</span> : null}
        {!order.paidAt && order.paymentStatus ? <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Payment {order.paymentStatus.replaceAll("_", " ")}</span> : null}
      </div>

      <details className="mt-4 rounded-xl border border-[#ece9f4] bg-[#fbfaff] px-4 py-3 dark:border-border dark:bg-muted/25">
        <summary className="et-interactive min-h-11 cursor-pointer select-none py-3 text-sm font-bold text-slate-700 outline-none marker:text-[#6657e8] dark:text-foreground">
          Order details
        </summary>
        <div className="border-t border-[#ece9f4] pb-1 pt-3 dark:border-border">
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-muted-foreground">{item.productCode} · {item.testCount} {item.testCount === 1 ? "test" : "tests"}{item.validityDays ? ` · ${item.validityDays} days configured validity` : ""}</p>
                  </div>
                  <p className="text-sm font-black text-slate-800 dark:text-foreground">{formatCommerceMoney(item.totalMinor, order.currency)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-muted-foreground">No item details are available for this order.</p>
          )}
        </div>
      </details>
    </article>
  );
}

export default function MyPurchasesPage() {
  const purchasesQuery = useQuery({
    queryKey: ["commerce-purchases"],
    queryFn: getCommercePurchases,
    retry: 1,
    staleTime: 30_000,
  });

  const data = purchasesQuery.data;
  const orders = data?.orders ?? [];
  const items = data?.items ?? [];
  const entitlements = data?.entitlements ?? [];

  const summary = useMemo(() => {
    const activeAccess = entitlements.filter((item) => item.accessStatus === "active").length;
    const completedPayments = orders.filter((order) => ["paid", "partially_refunded", "refunded"].includes(order.status)).length;
    const refundedOrders = orders.filter((order) => order.refundedMinor > 0 || order.status === "refunded" || order.status === "partially_refunded").length;
    const latestPurchase = orders.find((order) => order.paidAt)?.paidAt ?? null;
    return { activeAccess, completedPayments, refundedOrders, latestPurchase };
  }, [entitlements, orders]);

  const activeEntitlements = useMemo(
    () => entitlements.filter((item) => item.accessStatus === "active"),
    [entitlements],
  );
  const inactiveEntitlements = useMemo(
    () => entitlements.filter((item) => item.accessStatus !== "active"),
    [entitlements],
  );
  const itemsByOrder = useMemo(() => {
    const grouped = new Map<string, CommercePurchaseItem[]>();
    for (const item of items) grouped.set(item.orderId, [...(grouped.get(item.orderId) ?? []), item]);
    return grouped;
  }, [items]);
  const entitlementsByOrder = useMemo(() => {
    const grouped = new Map<string, CommerceEntitlement[]>();
    for (const entitlement of entitlements) {
      if (!entitlement.orderId) continue;
      grouped.set(entitlement.orderId, [...(grouped.get(entitlement.orderId) ?? []), entitlement]);
    }
    return grouped;
  }, [entitlements]);

  const identityRequired = purchasesQuery.error instanceof ApiError
    && getApiErrorCode(purchasesQuery.error.body) === "STUDENT_IDENTITY_REQUIRED";

  if (purchasesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-7 dark:bg-background sm:px-6 lg:px-8" role="status" aria-label="Loading purchases">
        <div className="mx-auto max-w-6xl space-y-5">
          <div className="skeleton-shimmer h-52 rounded-[28px]" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-28 rounded-2xl" />)}</div>
          <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton-shimmer h-64 rounded-[24px]" />)}</div>
        </div>
      </div>
    );
  }

  if (purchasesQuery.isError) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-10 dark:bg-background sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-[28px] border border-rose-200 bg-white p-7 text-center shadow-sm dark:border-rose-900 dark:bg-card sm:p-9">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"><ReceiptText className="h-5 w-5" /></span>
          <h1 className="mt-4 text-xl font-black tracking-[-0.025em] text-slate-950 dark:text-foreground">{identityRequired ? "Purchase history needs your student profile" : "Purchase history is temporarily unavailable"}</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-muted-foreground">
            {identityRequired
              ? "Your signed-in account could not be matched to a canonical ExamTree student profile. No purchase data is being guessed or read from browser storage."
              : "ExamTree could not load your canonical orders and access records right now. No cached purchase state is being shown."}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" className="min-h-11 rounded-xl" onClick={() => purchasesQuery.refetch()}><RefreshCw className="mr-2 h-4 w-4" /> Try again</Button>
            <Link href={identityRequired ? "/profile" : "/store"} className="et-interactive inline-flex min-h-11 items-center justify-center rounded-xl bg-[#6657e8] px-4 text-sm font-bold text-white hover:bg-[#594bd9]">{identityRequired ? "Open profile" : "Open Store"}</Link>
          </div>
        </div>
      </div>
    );
  }

  const hasHistory = orders.length > 0 || entitlements.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-background" data-testid="my-purchases-page">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[30px] border border-[#e3dff5] bg-[radial-gradient(circle_at_92%_8%,rgba(102,87,232,0.15),transparent_22rem),linear-gradient(135deg,#ffffff_0%,#f5f2ff_60%,#faf9ff_100%)] shadow-[0_18px_52px_rgba(44,42,76,0.055)] dark:border-border dark:bg-none dark:bg-card">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ddd7fb] bg-white/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300">
                <BadgeCheck className="h-3.5 w-3.5" /> Canonical commerce record
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-[-0.045em] text-slate-950 dark:text-foreground sm:text-4xl">My purchases</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-muted-foreground sm:text-[15px]">
                Review server-recorded orders, processed refunds and the package access currently attached to your ExamTree account.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button variant="outline" className="min-h-11 rounded-xl border-[#ddd9ec] bg-white/80 font-bold dark:border-border dark:bg-muted/30" onClick={() => purchasesQuery.refetch()} data-testid="btn-refresh-purchases">
                <RefreshCw className={`mr-2 h-4 w-4 ${purchasesQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
              </Button>
              <Link href="/store" className="et-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6657e8] px-4 text-sm font-bold text-white shadow-sm hover:bg-[#594bd9]">
                Browse Store <ShoppingBag className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Purchase summary">
          {[
            [PackageCheck, "Active access", String(summary.activeAccess), "Current server-authorized packages", "violet"],
            [CreditCard, "Completed payments", String(summary.completedPayments), "Paid order records", "emerald"],
            [RotateCcw, "Orders with refunds", String(summary.refundedOrders), "Processed refund activity", "sky"],
            [CalendarDays, "Latest purchase", summary.latestPurchase ? formatDate(summary.latestPurchase) : "—", "Most recent paid order", "amber"],
          ].map(([Icon, label, value, helper, tone]) => {
            const ItemIcon = Icon as typeof PackageCheck;
            return (
              <div key={String(label)} className="rounded-2xl border border-[#e5e2ef] bg-white p-4 shadow-[0_8px_26px_rgba(47,43,83,0.03)] dark:border-border dark:bg-card">
                <div className="flex items-center justify-between gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone === "emerald" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : tone === "sky" ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" : tone === "amber" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" : "bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/45 dark:text-violet-300"}`}><ItemIcon className="h-4 w-4" /></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">{String(label)}</span>
                </div>
                <p className="mt-4 text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-foreground">{String(value)}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-muted-foreground">{String(helper)}</p>
              </div>
            );
          })}
        </section>

        {!hasHistory ? (
          <section className="mt-5 rounded-[28px] border border-dashed border-[#dcd8eb] bg-white px-6 py-12 text-center dark:border-border dark:bg-card" data-testid="purchases-empty-state">
            <ShoppingBag className="mx-auto h-7 w-7 text-[#6657e8]" />
            <h2 className="mt-4 text-xl font-black tracking-[-0.025em] text-slate-950 dark:text-foreground">No purchase history yet</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-muted-foreground">Paid orders and granted package access will appear here after they exist on the canonical ExamTree commerce account.</p>
            <Link href="/store" className="et-interactive mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6657e8] px-5 text-sm font-bold text-white hover:bg-[#594bd9]">Explore Store <ArrowRight className="h-4 w-4" /></Link>
          </section>
        ) : (
          <>
            <section className="mt-7" aria-labelledby="active-access-title">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:text-violet-300">Access</p>
                  <h2 id="active-access-title" className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-foreground">Active packages</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">Calculated by the server from entitlement status and validity dates.</p>
              </div>

              {activeEntitlements.length > 0 ? (
                <div className="mt-4 grid gap-4 lg:grid-cols-2" data-testid="active-purchases-grid">
                  {activeEntitlements.map((entitlement) => <AccessCard key={entitlement.id} entitlement={entitlement} />)}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-[#e5e2ef] bg-white p-6 text-sm text-slate-600 dark:border-border dark:bg-card dark:text-muted-foreground">No active paid or granted package entitlement is recorded right now.</div>
              )}
            </section>

            <section className="mt-7" aria-labelledby="order-history-title">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:text-violet-300">Payments</p>
                  <h2 id="order-history-title" className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-foreground">Order history</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">{orders.length} {orders.length === 1 ? "order" : "orders"} on this account</p>
              </div>

              {orders.length > 0 ? (
                <div className="mt-4 space-y-4" data-testid="purchase-order-list">
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      items={itemsByOrder.get(order.id) ?? []}
                      entitlements={entitlementsByOrder.get(order.id) ?? []}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-[#e5e2ef] bg-white p-6 text-sm text-slate-600 dark:border-border dark:bg-card dark:text-muted-foreground">No commerce orders are recorded for this account.</div>
              )}
            </section>

            {inactiveEntitlements.length > 0 ? (
              <section className="mt-7 pb-5" aria-labelledby="past-access-title">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:text-violet-300">History</p>
                  <h2 id="past-access-title" className="mt-1 text-xl font-black tracking-[-0.025em] text-slate-950 dark:text-foreground">Past or scheduled access</h2>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {inactiveEntitlements.map((entitlement) => <AccessCard key={entitlement.id} entitlement={entitlement} />)}
                </div>
              </section>
            ) : <div className="pb-5" />}
          </>
        )}

        <section className="mt-5 grid gap-3 pb-5 md:grid-cols-3" aria-label="Purchase data information">
          {[
            [ShieldCheck, "Server authoritative", "This page reads canonical commerce records. Browser storage is never treated as proof of purchase."],
            [Clock3, "Validity aware", "Active access reflects entitlement start, end and revocation state evaluated by the server."],
            [ReceiptText, "Refund aware", "Order cards show only refunds recorded as processed in canonical payment records."],
          ].map(([Icon, title, copy]) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return (
              <div key={String(title)} className="rounded-2xl border border-[#e6e3f0] bg-white p-5 dark:border-border dark:bg-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300"><ItemIcon className="h-4 w-4" /></span>
                <h3 className="mt-3 text-sm font-black text-slate-950 dark:text-foreground">{String(title)}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">{String(copy)}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
