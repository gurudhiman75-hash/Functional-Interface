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
  BookOpen,
  Landmark,
  LockKeyhole,
  Package,
  Smartphone,
  TreePine,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  commerceDiscountPercent,
  formatCommerceMoney,
  getCommerceProducts,
  getCommercePurchases,
  openCommerceCheckout,
  type CommerceProduct,
} from "@/lib/commerce";
import { getSessionUser } from "@/lib/session-user";

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


type CheckoutPageProps = {
  product: CommerceProduct;
  user: ReturnType<typeof getSessionUser>;
  discount: number;
  isFree: boolean;
  ownsProduct: boolean | undefined;
  checkoutBusy: boolean;
  checkoutError: string | null;
  purchasesLoading: boolean;
  purchasesError: boolean;
  onRetryPurchaseCheck: () => void;
  onBack: () => void;
  onStartCheckout: () => void;
};

function CheckoutPage({
  product,
  user,
  discount,
  isFree,
  ownsProduct,
  checkoutBusy,
  checkoutError,
  purchasesLoading,
  purchasesError,
  onRetryPurchaseCheck,
  onBack,
  onStartCheckout,
}: CheckoutPageProps) {
  const amount = formatCommerceMoney(product.salePriceMinor, product.currency);
  const validity = product.validityDays && product.validityDays > 0
    ? product.validityDays + " days of access"
    : "Validity details shown in your package";
  const paymentMethods = [
    { label: "UPI", Icon: Smartphone },
    { label: "Cards", Icon: CreditCard },
    { label: "Net banking", Icon: Landmark },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111b36] lg:grid lg:grid-cols-[minmax(340px,0.82fr)_minmax(0,1.18fr)]" data-testid="store-product-page">
      <section className="relative isolate overflow-hidden bg-[#071a38] px-5 py-6 text-white sm:px-8 sm:py-8 lg:min-h-screen lg:px-10 lg:py-9 xl:px-14">
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 -left-28 h-[26rem] w-[26rem] rounded-full border border-white/[0.07]">
          <div className="absolute inset-8 rounded-full border border-white/[0.06]" />
          <div className="absolute inset-16 rounded-full border border-white/[0.05]" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-[560px] flex-col lg:ml-auto lg:mr-0">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3c65d] text-[#071a38] shadow-[0_5px_18px_rgba(243,198,93,0.22)]">
              <TreePine className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="text-[19px] font-extrabold tracking-[-0.04em]">Examtree</span>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="mt-8 inline-flex min-h-10 w-fit items-center gap-2 rounded-lg text-sm font-semibold text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to packages
          </button>

          <div className="mt-5 sm:mt-7">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#f3c65d]">A clearer path to your next goal</p>
            <h1 className="mt-3 max-w-lg text-[34px] font-black leading-[1.03] tracking-[-0.055em] sm:text-[42px] lg:text-[46px]">
              Your next chapter starts here.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-blue-100/70 sm:text-[15px]">
              Everything included in your package, together in one place.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 sm:mt-7 sm:gap-5 sm:p-4">
            <div className="relative grid h-[88px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#163d78] to-[#0b2550] text-[#f3c65d] shadow-[0_10px_24px_rgba(0,0,0,0.22)] sm:h-[100px] sm:w-[82px]">
              <div aria-hidden="true" className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-[#f3c65d]/20" />
              <div aria-hidden="true" className="absolute -right-3 -top-3 h-14 w-14 rounded-full border border-[#f3c65d]/15" />
              <TreePine className="relative h-9 w-9" strokeWidth={1.5} />
              <span className="absolute bottom-2 text-[8px] font-black uppercase tracking-[0.16em] text-white/70">Exam prep</span>
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.13em] text-blue-100">{product.code}</span>
                {discount > 0 ? <span className="rounded-full bg-emerald-300/15 px-2.5 py-1 text-[9px] font-extrabold text-emerald-200">{discount}% off</span> : null}
              </div>
              <h2 className="text-[16px] font-extrabold leading-snug tracking-[-0.02em] sm:text-[18px]">{product.title}</h2>
              <p className="mt-1.5 text-xs text-blue-100/65">
                {validity} <span className="px-1">·</span> {product.testCount} {product.testCount === 1 ? "test" : "tests"}
              </p>
            </div>
          </div>

          <ul className="mt-5 grid gap-3 text-[13px] text-blue-50/85 sm:mt-6">
            <li className="flex items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/[0.09] text-[#f3c65d]"><BookOpen className="h-3.5 w-3.5" /></span>
              {product.testCount} included {product.testCount === 1 ? "test" : "tests"}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/[0.09] text-[#f3c65d]"><Clock3 className="h-3.5 w-3.5" /></span>
              {validity}
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/[0.09] text-[#f3c65d]"><ShieldCheck className="h-3.5 w-3.5" /></span>
              Access appears in My purchases after payment confirmation
            </li>
          </ul>

          <div className="mt-6 border-t border-white/15 pt-4 sm:mt-7 sm:pt-5">
            <div className="flex items-center justify-between text-[13px] text-blue-100/75">
              <span>{discount > 0 ? "List price" : "Package price"}</span>
              <span className={discount > 0 ? "text-white/55 line-through" : "font-semibold text-white"}>
                {isFree ? "Free" : formatCommerceMoney(discount > 0 ? product.listPriceMinor : product.salePriceMinor, product.currency)}
              </span>
            </div>
            {discount > 0 ? (
              <div className="mt-2.5 flex items-center justify-between text-[13px]">
                <span className="text-blue-100/75">Your savings</span>
                <span className="font-bold text-emerald-300">−{formatCommerceMoney(product.listPriceMinor - product.salePriceMinor, product.currency)}</span>
              </div>
            ) : null}
            <div className="mt-3.5 flex items-end justify-between border-t border-white/15 pt-3.5">
              <span className="pb-1 text-sm font-semibold">Total payable</span>
              <span className="text-[32px] font-black leading-none tracking-[-0.055em] sm:text-[36px]">{amount}</span>
            </div>
            <p className="mt-2 text-[10px] text-blue-100/55">Final amount for this package. No coupon is required.</p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[11px] text-blue-100/60 lg:mt-auto lg:pt-6">
            <LockKeyhole className="h-3.5 w-3.5 shrink-0 text-[#f3c65d]" />
            Secure checkout powered by Razorpay
          </div>
        </div>
      </section>

      <section className="min-w-0 bg-white px-5 pb-32 pt-6 sm:px-8 sm:pb-32 sm:pt-8 lg:px-11 lg:pb-10 lg:pt-9 xl:px-16">
        <div className="mx-auto max-w-[640px]">
          <div className="mb-7 flex items-center justify-end gap-2 text-[11px] font-semibold text-slate-500 sm:mb-8">
            <LockKeyhole className="h-4 w-4 text-[#1769ed]" />
            Secure checkout
          </div>

          <div className="mb-6 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.14em] sm:mb-8 sm:text-[11px]">
            <div className="flex items-center gap-2 text-[#1769ed]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#eaf2ff]"><Check className="h-3.5 w-3.5" /></span>
              Account
            </div>
            <span aria-hidden="true" className="h-px flex-1 bg-[#dbe4f0]" />
            <div className="flex items-center gap-2 text-[#111b36]" aria-current="step">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1769ed] text-white shadow-[0_4px_12px_rgba(23,105,237,0.25)]">2</span>
              Payment
            </div>
          </div>

          <header>
            <h2 className="text-[30px] font-black leading-tight tracking-[-0.055em] text-[#101a33] sm:text-[36px]">Checkout</h2>
            <p className="mt-1.5 text-[13px] text-slate-500 sm:text-sm">Review your account and continue to payment.</p>
          </header>

          <div className="mt-6 flex items-center gap-3.5 border-b border-[#e5eaf1] pb-5 sm:mt-7 sm:pb-6">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e8f1ff] text-sm font-extrabold text-[#1769ed]">
              {user ? (user.name || user.email).trim().slice(0, 1).toUpperCase() : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-[#111b36] sm:text-sm">{user?.name || "Sign in required"}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{user?.email || "Sign in to continue to secure payment"}</p>
            </div>
            {user ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Signed in</span> : null}
          </div>

          {!isFree && !ownsProduct ? (
            <section className="mt-6" aria-labelledby="payment-methods-title">
              <h3 id="payment-methods-title" className="text-[18px] font-extrabold tracking-[-0.03em] text-[#111b36]">Payment method</h3>
              <p className="mt-1 text-xs text-slate-500 sm:text-[13px]">Choose your method in the secure Razorpay checkout.</p>
              <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-3">
                {paymentMethods.map((method) => {
                  const MethodIcon = method.Icon;
                  return (
                    <div key={method.label} className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-2 py-3 text-center shadow-[0_3px_14px_rgba(17,27,54,0.025)] sm:min-h-[84px] sm:flex-row sm:justify-start sm:gap-2.5 sm:px-3.5 sm:text-left">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f0f6ff] text-[#1769ed]">
                        <MethodIcon className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-bold text-[#263653] sm:text-xs">{method.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-[#f5f8fc] px-3.5 py-3 text-[11px] leading-5 text-slate-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1769ed]" />
                <span>Payment details are entered in Razorpay. Examtree does not store your card or UPI details.</span>
              </div>
            </section>
          ) : null}

          {isFree ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p>This package is free. Continue to access its included tests.</p>
            </div>
          ) : null}

          {ownsProduct ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <p>You already have access to this package. Open it from My purchases.</p>
            </div>
          ) : null}

          {purchasesError ? (
            <div role="alert" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-5 text-amber-900">
              We could not verify existing access. <button className="min-h-10 font-bold underline underline-offset-2" onClick={onRetryPurchaseCheck}>Try again</button>
            </div>
          ) : null}

          {checkoutError ? (
            <div role="alert" aria-live="polite" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs leading-5 text-rose-700">
              {checkoutError}
            </div>
          ) : null}

          <p className="mt-5 text-[10px] leading-5 text-slate-400 sm:text-[11px]">
            By continuing, you agree to our <a className="font-semibold text-slate-600 underline underline-offset-2" href="/terms-and-conditions">Terms</a> and <a className="font-semibold text-slate-600 underline underline-offset-2" href="/refund-policy">Refund Policy</a>.
          </p>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e4e9f0] bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(20,34,62,0.08)] backdrop-blur sm:px-8 lg:static lg:mx-auto lg:mt-6 lg:max-w-[640px] lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
          <div className="mx-auto flex max-w-[640px] items-center gap-3 lg:block">
            <div className="min-w-[88px] lg:hidden">
              <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">Total</span>
              <span className="block text-[17px] font-black leading-tight tracking-[-0.04em] text-[#101a33]">{amount}</span>
            </div>
            <Button
              className="min-h-[52px] flex-1 rounded-xl bg-[#1769ed] px-5 text-sm font-extrabold text-white shadow-[0_7px_18px_rgba(23,105,237,0.22)] hover:bg-[#1258ce] disabled:opacity-60 lg:w-full"
              onClick={onStartCheckout}
              disabled={checkoutBusy || (!!user && (purchasesLoading || purchasesError))}
              data-testid="btn-store-checkout"
            >
              {checkoutBusy ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Opening secure checkout…</> : (
                <>
                  {ownsProduct ? "Open my package" : isFree ? "Access included tests" : user ? "Continue to secure payment" : "Sign in to continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="mt-3 hidden text-center text-[10px] text-slate-400 lg:block">
              <LockKeyhole className="mr-1 inline h-3 w-3" /> Secure checkout powered by Razorpay
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function StoreProductPage() {
  const params = useParams<{ id: string }>();
  const productId = decodeURIComponent(params.id ?? "");
  const [location, setLocation] = useLocation();
  const isCheckout = location.startsWith("/checkout/");
  const user = getSessionUser();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const productsQuery = useQuery({
    queryKey: ["commerce-products"],
    queryFn: getCommerceProducts,
    retry: 1,
    staleTime: 60_000,
  });

  const purchasesQuery = useQuery({
    queryKey: ["commerce-purchases", user?.id], queryFn: getCommercePurchases, enabled: !!user, staleTime: 0, retry: 1,
  });
  const ownsProduct = purchasesQuery.data?.entitlements.some((entry) => entry.productId === productId && entry.accessStatus === "active");

  const product = useMemo(
    () => productsQuery.data?.products.find((item) => item.id === productId),
    [productId, productsQuery.data?.products],
  );

  const startCheckout = async () => {
    if (!product) return;
    if (ownsProduct) { const owned = purchasesQuery.data?.entitlements.find((entry) => entry.productId === productId && entry.accessStatus === "active"); setLocation(owned ? `/my-packages/${owned.id}` : "/my-packages"); return; }
    if (!isCheckout) { setLocation(`/checkout/${encodeURIComponent(product.id)}`); return; }
    if (purchasesQuery.isLoading || purchasesQuery.isError) return;
    if (!user) {
      setLocation(`/login/student?next=${encodeURIComponent(`/checkout/${product.id}`)}`);
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
        setCheckoutBusy(false);
        setLocation(`/orders/${encodeURIComponent(details.orderId)}`);
      },
      onDismiss: () => { setCheckoutBusy(false); setCheckoutError("Checkout closed. If money was deducted, check My purchases before trying again."); },
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

  if (isCheckout) {
    return (
      <CheckoutPage
        product={product}
        user={user}
        discount={discount}
        isFree={isFree}
        ownsProduct={ownsProduct}
        checkoutBusy={checkoutBusy}
        checkoutError={checkoutError}
        purchasesLoading={purchasesQuery.isLoading}
        purchasesError={purchasesQuery.isError}
        onRetryPurchaseCheck={() => purchasesQuery.refetch()}
        onBack={() => setLocation("/store")}
        onStartCheckout={startCheckout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] dark:bg-background" data-testid="store-product-page">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <button type="button" onClick={() => setLocation("/store")} className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-bold text-slate-600 hover:text-[#6657e8] dark:text-muted-foreground dark:hover:text-violet-300">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </button>

        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <ProductSummary product={product} />

          <aside className="rounded-[28px] border border-[#e3dff5] bg-white p-5 shadow-[0_16px_48px_rgba(47,43,83,0.055)] dark:border-border dark:bg-card sm:p-6" aria-label="Package checkout">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6657e8] dark:text-violet-300">Package price</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-foreground">{isFree ? "Free" : formatCommerceMoney(product.salePriceMinor, product.currency)}</span>
                  {discount > 0 ? <span className="text-sm font-semibold text-slate-400 line-through">{formatCommerceMoney(product.listPriceMinor, product.currency)}</span> : null}
                </div>
                {discount > 0 ? <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">Save {formatCommerceMoney(product.listPriceMinor - product.salePriceMinor, product.currency)}</p> : null}

                <div className="mt-5 space-y-3 border-y border-[#ece9f4] py-5 dark:border-border">
                  <p className="flex items-start gap-2 text-sm text-slate-700 dark:text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /> {product.testCount} included {product.testCount === 1 ? "test" : "tests"}</p>
                  <p className="flex items-start gap-2 text-sm text-slate-700 dark:text-muted-foreground"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /> {product.validityDays && product.validityDays > 0 ? `${product.validityDays} days of configured access` : "No validity duration is published for this version"}</p>
                  <p className="flex items-start gap-2 text-sm text-slate-700 dark:text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /> Access your included tests from My purchases</p>
                </div>

                {purchasesQuery.isError ? <div role="alert" className="mt-4 text-sm">We could not check your existing access. <button className="underline min-h-11" onClick={() => purchasesQuery.refetch()}>Try again</button></div> : null}
                {isCheckout ? <p className="mt-4 text-sm">Review the package and price, then continue to secure payment. <a className="underline" href="/refund-policy">Refund policy</a> · <a className="underline" href="/terms-and-conditions">Terms</a></p> : null}
                {checkoutError ? (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300" role="alert">{checkoutError}</div>
                ) : null}

                <Button
                  className="mt-5 min-h-11 w-full rounded-xl bg-[#6657e8] font-bold text-white hover:bg-[#594bd9]"
                  onClick={startCheckout}
                  disabled={checkoutBusy || (!!user && (purchasesQuery.isLoading || purchasesQuery.isError))}
                  data-testid="btn-store-checkout"
                >
                  {checkoutBusy ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Opening secure checkout…</> : ownsProduct ? <>Open my package <ArrowRight className="ml-2 h-4 w-4" /></> : isFree ? <>Explore included tests <ArrowRight className="ml-2 h-4 w-4" /></> : user ? <><CreditCard className="mr-2 h-4 w-4" /> {isCheckout ? "Pay securely" : "Buy now"}</> : <>Sign in to buy <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
                <p className="mt-3 text-center text-[11px] leading-5 text-slate-400 dark:text-muted-foreground">{isFree ? "Free products do not open a payment order from this page." : "Your package appears in My purchases after payment confirmation."}</p>
          </aside>
        </div>

        <section className="mt-5 grid gap-3 md:grid-cols-3" aria-label="Purchase information">
          {[
            [CreditCard, "Checkout", "Review your package and price before paying securely with Razorpay."],
            [ShieldCheck, "Verification", "Your payment status updates automatically after confirmation."],
            [CheckCircle2, "Entitlement", "Open your purchased package and start its included tests from My purchases."],
          ].map(([Icon, title, copy]) => {
            const ItemIcon = Icon as typeof CreditCard;
            return <div key={String(title)} className="rounded-2xl border border-[#e6e3f0] bg-white p-5 dark:border-border dark:bg-card"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300"><ItemIcon className="h-4 w-4" /></span><h3 className="mt-3 text-sm font-black text-slate-950 dark:text-foreground">{String(title)}</h3><p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">{String(copy)}</p></div>;
          })}
        </section>
      </div>
    </div>
  );
}
