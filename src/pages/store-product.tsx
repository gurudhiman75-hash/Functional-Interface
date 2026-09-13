import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  LoaderCircle,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApiError, getApiErrorCode } from "@/lib/api";
import {
  commerceDiscountPercent,
  formatCommerceMoney,
  getCommerceProducts,
  openCommerceCheckout,
  type CommerceProduct,
} from "@/lib/commerce";
import { getSessionUser } from "@/lib/session-user";

type PaymentSubmitted = {
  orderId: string;
  orderNumber: string;
  paymentId: string;
};

function formatSaleDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function checkoutErrorMessage(error: string) {
  if (/Online payments are not configured/i.test(error)) return "Online checkout is not configured right now. No order has been presented as paid.";
  return error;
}

function ProductSummary({ product }: { product: CommerceProduct }) {
  const discount = commerceDiscountPercent(product);
  const saleEnd = formatSaleDate(product.saleEndAt);

  return (
    <div className="rounded-[28px] border border-[#e3dff5] bg-white p-6 shadow-[0_16px_48px_rgba(47,43,83,0.055)] dark:border-border dark:bg-card sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300"><Package className="h-6 w-6" /></span>
        <div className="flex flex-wrap gap-2">
          {discount > 0 ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{discount}% off</span> : null}
          <span className="rounded-full border border-[#e4e0f4] bg-[#faf9ff] px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:border-border dark:bg-muted dark:text-muted-foreground">{product.code}</span>
        </div>
      </div>

      <h1 className="mt-6 text-3xl font-black leading-[1.08] tracking-[-0.045em] text-slate-950 dark:text-foreground sm:text-4xl">{product.title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-muted-foreground">{product.description || "Published ExamTree preparation package."}</p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#f8f7fc] p-4 dark:bg-muted/45">
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-400 dark:text-muted-foreground">Included tests</p>
          <p className="mt-2 text-xl font-black text-slate-950 dark:text-foreground">{product.testCount}</p>
        </div>
        <div className="rounded-2xl bg-[#f8f7fc] p-4 dark:bg-muted/45">
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-400 dark:text-muted-foreground">Validity</p>
          <p className="mt-2 text-sm font-black text-slate-950 dark:text-foreground">{product.validityDays && product.validityDays > 0 ? `${product.validityDays} days` : "Not specified"}</p>
        </div>
        <div className="rounded-2xl bg-[#f8f7fc] p-4 dark:bg-muted/45">
          <p className="text-[10px] font-black uppercase tracking-[0.13em] text-slate-400 dark:text-muted-foreground">Sale window</p>
          <p className="mt-2 text-sm font-black text-slate-950 dark:text-foreground">{saleEnd ? `Until ${saleEnd}` : "No end date configured"}</p>
        </div>
      </div>
    </div>
  );
}

export default function StoreProductPage() {
  const params = useParams<{ id: string }>();
  const productId = decodeURIComponent(params.id ?? "");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = getSessionUser();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState<PaymentSubmitted | null>(null);

  const productsQuery = useQuery({
    queryKey: ["commerce-products"],
    queryFn: getCommerceProducts,
    retry: 1,
    staleTime: 60_000,
  });

  const product = useMemo(
    () => productsQuery.data?.products.find((item) => item.id === productId),
    [productId, productsQuery.data?.products],
  );

  const startCheckout = async () => {
    if (!product) return;
    if (!user) {
      setLocation(`/login/student?next=${encodeURIComponent(`/store/product/${product.id}`)}`);
      return;
    }
    if (product.salePriceMinor <= 0) {
      setLocation("/exams");
      return;
    }

    setCheckoutBusy(true);
    setCheckoutError(null);
    await openCommerceCheckout({
      product,
      studentName: user.name,
      studentEmail: user.email,
      onPaymentSubmitted: (details) => {
        setPaymentSubmitted(details);
        setCheckoutBusy(false);
        toast({
          title: "Payment submitted",
          description: "Access will activate after ExamTree receives and verifies the provider capture event.",
        });
      },
      onDismiss: () => setCheckoutBusy(false),
      onError: (message) => {
        setCheckoutBusy(false);
        setCheckoutError(checkoutErrorMessage(message));
      },
    });
  };

  if (productsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-8 dark:bg-background sm:px-6">
        <div className="mx-auto max-w-6xl space-y-5"><div className="skeleton-shimmer h-12 w-40 rounded-xl" /><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="skeleton-shimmer h-[430px] rounded-[28px]" /><div className="skeleton-shimmer h-[430px] rounded-[28px]" /></div></div>
      </div>
    );
  }

  if (productsQuery.isError) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-10 dark:bg-background sm:px-6">
        <div className="mx-auto max-w-xl rounded-[28px] border border-rose-200 bg-white p-8 text-center dark:border-rose-900 dark:bg-card">
          <ShoppingBag className="mx-auto h-7 w-7 text-rose-500" />
          <h1 className="mt-4 text-xl font-black text-slate-950 dark:text-foreground">Package could not be loaded</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">The Store catalog is temporarily unavailable. No cached price is being shown.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center"><Button variant="outline" className="min-h-11 rounded-xl" onClick={() => productsQuery.refetch()}>Try again</Button><Button className="min-h-11 rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]" onClick={() => setLocation("/store")}>Back to Store</Button></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-10 dark:bg-background sm:px-6">
        <div className="mx-auto max-w-xl rounded-[28px] border border-[#e4e1ef] bg-white p-8 text-center dark:border-border dark:bg-card">
          <Package className="mx-auto h-7 w-7 text-[#6657e8]" />
          <h1 className="mt-4 text-xl font-black text-slate-950 dark:text-foreground">This package is not available</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-muted-foreground">It may have been unpublished or moved outside its configured sale window.</p>
          <Button className="mt-5 min-h-11 rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]" onClick={() => setLocation("/store")}>Browse Store</Button>
        </div>
      </div>
    );
  }

  const discount = commerceDiscountPercent(product);
  const isFree = product.salePriceMinor <= 0;

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-background" data-testid="store-product-page">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <button type="button" onClick={() => setLocation("/store")} className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-bold text-slate-600 hover:text-[#6657e8] dark:text-muted-foreground dark:hover:text-violet-300">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </button>

        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ProductSummary product={product} />

          <aside className="rounded-[28px] border border-[#e3dff5] bg-white p-5 shadow-[0_16px_48px_rgba(47,43,83,0.055)] dark:border-border dark:bg-card sm:p-6" aria-label="Package checkout">
            {paymentSubmitted ? (
              <div data-testid="store-payment-submitted">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><CheckCircle2 className="h-5 w-5" /></span>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">Payment submitted</p>
                <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-slate-950 dark:text-foreground">Waiting for server verification</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-muted-foreground">ExamTree grants paid access only after the Razorpay capture event is verified by the server. This screen does not mark the package as purchased before that happens.</p>
                <div className="mt-4 rounded-xl bg-[#f8f7fc] p-3 text-xs dark:bg-muted/45"><span className="font-semibold text-slate-500 dark:text-muted-foreground">Order</span><p className="mt-1 break-all font-black text-slate-900 dark:text-foreground">{paymentSubmitted.orderNumber}</p></div>
                <Button className="mt-5 min-h-11 w-full rounded-xl bg-[#6657e8] font-bold text-white hover:bg-[#594bd9]" onClick={() => setLocation("/exams")}>Browse your tests <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6657e8] dark:text-violet-300">Package price</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-foreground">{isFree ? "Free" : formatCommerceMoney(product.salePriceMinor, product.currency)}</span>
                  {discount > 0 ? <span className="text-sm font-semibold text-slate-400 line-through">{formatCommerceMoney(product.listPriceMinor, product.currency)}</span> : null}
                </div>
                {discount > 0 ? <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">Save {formatCommerceMoney(product.listPriceMinor - product.salePriceMinor, product.currency)}</p> : null}

                <div className="mt-5 space-y-3 border-y border-[#ece9f4] py-5 dark:border-border">
                  <p className="flex items-start gap-2 text-sm text-slate-700 dark:text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /> {product.testCount} included {product.testCount === 1 ? "test" : "tests"}</p>
                  <p className="flex items-start gap-2 text-sm text-slate-700 dark:text-muted-foreground"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /> {product.validityDays && product.validityDays > 0 ? `${product.validityDays} days of configured access` : "No validity duration is published for this version"}</p>
                  <p className="flex items-start gap-2 text-sm text-slate-700 dark:text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /> Access is entitlement-controlled on the server</p>
                </div>

                {checkoutError ? (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300" role="alert">{checkoutError}</div>
                ) : null}

                <Button
                  className="mt-5 min-h-11 w-full rounded-xl bg-[#6657e8] font-bold text-white hover:bg-[#594bd9]"
                  onClick={startCheckout}
                  disabled={checkoutBusy}
                  data-testid="btn-store-checkout"
                >
                  {checkoutBusy ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Opening secure checkout…</> : isFree ? <>Explore included tests <ArrowRight className="ml-2 h-4 w-4" /></> : user ? <><CreditCard className="mr-2 h-4 w-4" /> Buy securely</> : <>Sign in to buy <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
                <p className="mt-3 text-center text-[11px] leading-5 text-slate-400 dark:text-muted-foreground">{isFree ? "Free products do not open a payment order from this page." : "Payment status and access are authoritative on the ExamTree server."}</p>
              </>
            )}
          </aside>
        </div>

        <section className="mt-5 grid gap-3 md:grid-cols-3" aria-label="Purchase information">
          {[
            [CreditCard, "Checkout", "A canonical order is created before Razorpay opens. If the provider is not configured, no simulated success is shown."],
            [ShieldCheck, "Verification", "The provider capture event is signature-verified by the backend before paid access is granted."],
            [CheckCircle2, "Entitlement", "The Test Runner relies on server-side entitlement checks for paid tests; the Store cannot bypass them."],
          ].map(([Icon, title, copy]) => {
            const ItemIcon = Icon as typeof CreditCard;
            return <div key={String(title)} className="rounded-2xl border border-[#e6e3f0] bg-white p-5 dark:border-border dark:bg-card"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300"><ItemIcon className="h-4 w-4" /></span><h3 className="mt-3 text-sm font-black text-slate-950 dark:text-foreground">{String(title)}</h3><p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">{String(copy)}</p></div>;
          })}
        </section>
      </div>
    </div>
  );
}
