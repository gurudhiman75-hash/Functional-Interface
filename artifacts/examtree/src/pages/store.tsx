import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  commerceDiscountPercent,
  formatCommerceMoney,
  getCommerceProducts,
  type CommerceProduct,
} from "@/lib/commerce";

type StoreFilter = "all" | "discounted";
type StoreSort = "catalog" | "price-asc" | "price-desc";

function validityLabel(product: CommerceProduct) {
  if (!product.validityDays || product.validityDays <= 0) return "Validity shown at checkout";
  return `${product.validityDays} day${product.validityDays === 1 ? "" : "s"} access`;
}

function StoreCard({ product, onOpen }: { product: CommerceProduct; onOpen: () => void }) {
  const discount = commerceDiscountPercent(product);
  const free = product.salePriceMinor <= 0;

  return (
    <article className="group flex min-h-[330px] flex-col rounded-[26px] border border-[#e6e3f3] bg-white p-5 shadow-[0_12px_36px_rgba(48,44,83,0.045)] transition hover:-translate-y-0.5 hover:border-[#d7d1f5] hover:shadow-[0_18px_44px_rgba(48,44,83,0.08)] dark:border-border dark:bg-card sm:p-6" data-testid={`store-product-${product.id}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300">
          <Package className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          {discount > 0 ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{discount}% off</span> : null}
          <span className="rounded-full border border-[#e5e1f5] bg-[#faf9ff] px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:border-border dark:bg-muted dark:text-muted-foreground">{product.code}</span>
        </div>
      </div>

      <h2 className="mt-5 text-lg font-black leading-6 tracking-[-0.025em] text-slate-950 dark:text-foreground">{product.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-muted-foreground">{product.description || "Published ExamTree preparation package."}</p>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-[#f8f7fc] px-3 py-3 dark:bg-muted/50">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Tests</p>
          <p className="mt-1 font-bold text-slate-800 dark:text-foreground">{product.testCount}</p>
        </div>
        <div className="rounded-xl bg-[#f8f7fc] px-3 py-3 dark:bg-muted/50">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Validity</p>
          <p className="mt-1 truncate font-bold text-slate-800 dark:text-foreground">{validityLabel(product)}</p>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-muted-foreground">Current price</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-foreground">{free ? "Free" : formatCommerceMoney(product.salePriceMinor, product.currency)}</span>
              {discount > 0 ? <span className="text-xs font-semibold text-slate-400 line-through">{formatCommerceMoney(product.listPriceMinor, product.currency)}</span> : null}
            </div>
          </div>
          <Button onClick={onOpen} className="min-h-11 rounded-xl bg-[#6657e8] px-4 font-bold text-white hover:bg-[#594bd9]" data-testid={`btn-view-store-product-${product.id}`}>
            View <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function StorePage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StoreFilter>("all");
  const [sort, setSort] = useState<StoreSort>("catalog");

  const productsQuery = useQuery({
    queryKey: ["commerce-products"],
    queryFn: getCommerceProducts,
    retry: 1,
    staleTime: 60_000,
  });

  const products = productsQuery.data?.products ?? [];
  const discountedCount = useMemo(() => products.filter((product) => commerceDiscountPercent(product) > 0).length, [products]);
  const visibleProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const matching = products.filter((product) => {
      if (filter === "discounted" && commerceDiscountPercent(product) <= 0) return false;
      if (!needle) return true;
      return `${product.title} ${product.description} ${product.code}`.toLowerCase().includes(needle);
    });

    if (sort === "price-asc") return [...matching].sort((left, right) => left.salePriceMinor - right.salePriceMinor);
    if (sort === "price-desc") return [...matching].sort((left, right) => right.salePriceMinor - left.salePriceMinor);
    return matching;
  }, [filter, products, search, sort]);

  return (
    <div className="sites-page-shell store-page min-h-screen bg-[#f7f8fc] dark:bg-background" data-testid="store-page">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <section className="overflow-hidden rounded-[30px] border border-[#e3dff5] bg-[radial-gradient(circle_at_90%_10%,rgba(102,87,232,0.14),transparent_24rem),linear-gradient(135deg,#ffffff_0%,#f5f2ff_62%,#faf9ff_100%)] shadow-[0_18px_52px_rgba(44,42,76,0.055)] dark:border-border dark:bg-none dark:bg-card">
          <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-center lg:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ddd7fb] bg-white/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300">
                <ShoppingBag className="h-3.5 w-3.5" /> ExamTree Store
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl font-black leading-[1.08] tracking-[-0.045em] text-slate-950 dark:text-foreground sm:text-4xl">Choose preparation access with clear pricing and real coverage.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-muted-foreground sm:text-[15px]">
                Every package shown here comes from the active ExamTree commerce catalog. Prices, validity and included-test counts are read from the published product version—not invented in the storefront.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-muted-foreground">
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e6e2f5] bg-white/80 px-3 dark:border-border dark:bg-muted/40"><ShieldCheck className="h-4 w-4 text-[#6657e8]" /> Server-verified access</span>
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e6e2f5] bg-white/80 px-3 dark:border-border dark:bg-muted/40"><CreditCard className="h-4 w-4 text-[#6657e8]" /> Razorpay checkout</span>
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#e6e2f5] bg-white/80 px-3 dark:border-border dark:bg-muted/40"><CheckCircle2 className="h-4 w-4 text-[#6657e8]" /> Canonical entitlements</span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/90 bg-white/88 p-5 shadow-[0_12px_34px_rgba(73,62,139,0.08)] backdrop-blur dark:border-border dark:bg-muted/40">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300"><Sparkles className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400 dark:text-muted-foreground">Published now</p>
                  <p className="mt-0.5 text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-foreground">{productsQuery.isLoading ? "—" : products.length}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-muted-foreground">Only products currently active and inside their configured sale window are returned by the Store API.</p>
              <button type="button" onClick={() => document.getElementById("store-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="et-interactive mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6657e8] px-4 text-sm font-bold text-white hover:bg-[#594bd9]">
                Browse packages <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section id="store-catalog" className="scroll-mt-24 pt-7" aria-labelledby="store-catalog-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#6657e8] dark:text-violet-300">Store catalog</p>
              <h2 id="store-catalog-title" className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-foreground">Available packages</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-muted-foreground">Search the currently published commerce catalog.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-[minmax(240px,1fr)_auto] lg:min-w-[560px]">
              <label className="relative block">
                <span className="sr-only">Search Store</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search packages"
                  className="min-h-11 w-full rounded-xl border border-[#e2dfed] bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#9c91ef] focus:ring-2 focus:ring-[#6657e8]/10 dark:border-border dark:bg-card dark:text-foreground"
                  data-testid="store-search"
                />
              </label>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as StoreSort)}
                className="min-h-11 rounded-xl border border-[#e2dfed] bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#9c91ef] dark:border-border dark:bg-card dark:text-foreground"
                aria-label="Sort Store packages"
              >
                <option value="catalog">Catalog order</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Store filters">
            <button type="button" onClick={() => setFilter("all")} aria-pressed={filter === "all"} className={`et-interactive min-h-11 rounded-xl border px-4 text-sm font-bold transition ${filter === "all" ? "border-[#6657e8] bg-[#6657e8] text-white" : "border-[#e2dfed] bg-white text-slate-600 hover:border-[#c9c2f3] hover:text-[#6657e8] dark:border-border dark:bg-card dark:text-muted-foreground"}`}>
              All packages {products.length > 0 ? `(${products.length})` : ""}
            </button>
            <button type="button" onClick={() => setFilter("discounted")} aria-pressed={filter === "discounted"} className={`et-interactive min-h-11 rounded-xl border px-4 text-sm font-bold transition ${filter === "discounted" ? "border-[#6657e8] bg-[#6657e8] text-white" : "border-[#e2dfed] bg-white text-slate-600 hover:border-[#c9c2f3] hover:text-[#6657e8] dark:border-border dark:bg-card dark:text-muted-foreground"}`}>
              On sale {discountedCount > 0 ? `(${discountedCount})` : ""}
            </button>
          </div>

          {productsQuery.isLoading ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading Store packages">
              {Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton-shimmer h-[330px] rounded-[26px]" />)}
            </div>
          ) : productsQuery.isError ? (
            <div className="mt-6 rounded-[26px] border border-rose-200 bg-white p-7 text-center shadow-sm dark:border-rose-900 dark:bg-card">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"><ShoppingBag className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-foreground">Store is temporarily unavailable</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-muted-foreground">The commerce catalog could not be loaded. No cached or sample pricing is being shown.</p>
              <Button variant="outline" className="mt-5 min-h-11 rounded-xl" onClick={() => productsQuery.refetch()}>Try again</Button>
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="store-product-grid">
              {visibleProducts.map((product) => (
                <StoreCard key={product.id} product={product} onOpen={() => setLocation(`/store/product/${encodeURIComponent(product.id)}`)} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-6 rounded-[26px] border border-dashed border-[#dcd8eb] bg-white px-6 py-12 text-center dark:border-border dark:bg-card">
              <ShoppingBag className="mx-auto h-7 w-7 text-[#6657e8]" />
              <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-foreground">No packages are currently published for sale</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-muted-foreground">When an active commerce product is published, it will appear here automatically. You can continue using available tests in the meantime.</p>
              <Button className="mt-5 min-h-11 rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]" onClick={() => setLocation("/exams")}>Browse tests</Button>
            </div>
          ) : (
            <div className="mt-6 rounded-[26px] border border-dashed border-[#dcd8eb] bg-white px-6 py-10 text-center dark:border-border dark:bg-card">
              <Search className="mx-auto h-6 w-6 text-slate-400" />
              <h3 className="mt-3 font-black text-slate-950 dark:text-foreground">No packages match these filters</h3>
              <button type="button" className="et-interactive mt-3 min-h-11 rounded-xl px-4 text-sm font-bold text-[#6657e8] hover:bg-[#f3f0ff] dark:text-violet-300 dark:hover:bg-violet-950/30" onClick={() => { setSearch(""); setFilter("all"); }}>Clear filters</button>
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-3 pb-8 md:grid-cols-3" aria-label="Store trust information">
          {[
            [ShieldCheck, "Server-confirmed access", "Paid access is granted by canonical entitlements only after the payment event is verified on the server."],
            [CreditCard, "Provider-backed checkout", "Paid orders use the configured Razorpay provider. If payments are not configured, Store reports that instead of simulating a purchase."],
            [Clock3, "Published validity", "Where a package has a configured validity period, Store shows that exact value from its current product version."],
          ].map(([Icon, title, description]) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return (
              <div key={String(title)} className="rounded-2xl border border-[#e7e4f1] bg-white p-5 dark:border-border dark:bg-card">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300"><ItemIcon className="h-4 w-4" /></span>
                <h3 className="mt-4 text-sm font-black text-slate-950 dark:text-foreground">{String(title)}</h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-muted-foreground">{String(description)}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
