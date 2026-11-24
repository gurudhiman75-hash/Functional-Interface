import "@/styles/student-typography.css";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, ClipboardList, Clock3, Search, ShoppingBag } from "lucide-react";

import { ExamIdentityIcon } from "@/components/ExamIdentityIcon";
import { Button } from "@/components/ui/button";
import { formatCommerceMoney, getCommerceProducts, type CommerceProduct } from "@/lib/commerce";
import { resolveExamIdentity } from "@/lib/exam-identity";

const VIEWS = [
  { value: "all", label: "All products" },
  { value: "package", label: "Packages" },
  { value: "bundle", label: "Bundles" },
] as const;
type StoreView = (typeof VIEWS)[number]["value"];
type StoreSort = "catalog" | "price-asc" | "price-desc";

const EMPTY_PRODUCTS: CommerceProduct[] = [];
const control = "min-h-11 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-border dark:bg-card dark:text-foreground";
const filterControl = control + " et-interactive px-3 font-semibold aria-pressed:border-blue-400 aria-pressed:text-[#2443b5] dark:aria-pressed:text-blue-300";
const statusPanel = "rounded-2xl border border-slate-200 bg-white px-5 py-9 text-center dark:border-border dark:bg-card";

function isBundle(product: CommerceProduct) {
  return (product.exams?.length ?? 0) > 1 || /\bbundles?\b/i.test(product.title + " " + product.code.replace(/[_-]/g, " "));
}

function StoreMarks({ product }: { product: CommerceProduct }) {
  const exams = product.exams?.length ? product.exams.map((exam) => ({
    name: exam.name,
    examCode: exam.examCode,
    familyCode: exam.familyCode ?? undefined,
  })) : [{ name: product.title, examCode: product.code }];
  const marks = new Map<string, (typeof exams)[number]>();
  for (const exam of exams) {
    const key = resolveExamIdentity(exam)?.label ?? exam.examCode;
    if (!marks.has(key)) marks.set(key, exam);
  }
  return (
    <div className="flex shrink-0 items-center gap-2" aria-hidden="true">
      {Array.from(marks).slice(0, 2).map(([key, exam]) => (
        <span key={key} className="flex size-12 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 sm:size-[52px]">
          <ExamIdentityIcon {...exam} />
        </span>
      ))}
      {marks.size > 2 && <span className="rounded-md bg-white px-1.5 py-1 text-xs font-semibold text-slate-600">+{marks.size - 2}</span>}
    </div>
  );
}

function ProductDetails({ product, bundle }: { product: CommerceProduct; bundle: boolean }) {
  const days = product.validityDays;
  return (
    <ul className={bundle ? "mb-2 flex flex-wrap gap-x-3 gap-y-1 text-xs" : "my-3 grid gap-2 text-xs"}>
      <li className="flex items-center gap-1.5 text-slate-600 dark:text-muted-foreground">
        <ClipboardList className="size-4 shrink-0 text-[#5168a3] dark:text-blue-300" aria-hidden="true" />
        {product.testCount} {product.testCount === 1 ? "test" : "tests"}
      </li>
      <li className="flex items-center gap-1.5 text-slate-600 dark:text-muted-foreground">
        <Clock3 className="size-4 shrink-0 text-[#5168a3] dark:text-blue-300" aria-hidden="true" />
        {days ? days + (days === 1 ? " day access" : " days access") : "Validity shown at checkout"}
      </li>
    </ul>
  );
}

function ProductPrice({ product }: { product: CommerceProduct }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-foreground">
        {product.salePriceMinor <= 0 ? "Free" : formatCommerceMoney(product.salePriceMinor, product.currency)}
      </span>
      {product.listPriceMinor > product.salePriceMinor && (
        <s className="text-xs text-slate-600 dark:text-muted-foreground">{formatCommerceMoney(product.listPriceMinor, product.currency)}</s>
      )}
    </div>
  );
}

function StoreCard({ product, bundle = false, teal = false }: { product: CommerceProduct; bundle?: boolean; teal?: boolean }) {
  const savings = product.listPriceMinor - product.salePriceMinor;
  const coverage = product.exams?.map((exam) => exam.name).join(" + ") || product.description;
  const family = product.exams?.[0]?.familyName;
  const banner = teal ? "bg-[#e9f5f4] dark:bg-teal-950/45" : "bg-[#ebf1ff] dark:bg-blue-950/45";
  const rings = teal ? "border-teal-200 outline-teal-200 dark:border-teal-900 dark:outline-teal-900" : "border-blue-200 outline-blue-200 dark:border-blue-900 dark:outline-blue-900";
  const buttonTone = bundle
    ? teal ? "bg-[#13746c] text-white hover:bg-[#105f59]" : "bg-[#244ace] text-white hover:bg-[#1b3cb1]"
    : "border border-[#d9e2fc] bg-white text-[#2443b5] hover:bg-blue-50 dark:border-border dark:bg-card dark:text-blue-300 dark:hover:bg-muted";
  const action = bundle ? "View bundle" : "View package";
  const title = <h3 className={"font-bold leading-tight tracking-tight text-slate-950 dark:text-foreground " + (bundle ? "text-lg sm:text-[22px]" : "text-base")}>{product.title}</h3>;
  const details = <ProductDetails product={product} bundle={bundle} />;

  return (
    <article className={"flex h-full min-w-0 flex-col overflow-hidden border border-slate-200 bg-white dark:border-border dark:bg-card " + (bundle ? "rounded-2xl" : "rounded-xl p-4 shadow-sm")} data-testid={"store-product-" + product.id}>
      {bundle ? (
        <div className={"relative isolate flex flex-1 flex-wrap items-center justify-between gap-3 overflow-hidden p-4 sm:min-h-32 sm:p-5 " + banner}>
          <span aria-hidden="true" className={"pointer-events-none absolute -right-16 -top-16 -z-10 size-52 rounded-full border outline outline-offset-[14px] " + rings} />
          <div className="min-w-0 flex-1 basis-40">
            {savings > 0 && (
              <span className={"mb-2 inline-flex rounded-md bg-white px-2 py-1 text-xs font-semibold dark:bg-card " + (teal ? "text-[#12665f] dark:text-teal-300" : "text-[#2043ba] dark:text-blue-300")}>
                Save {formatCommerceMoney(savings, product.currency)}
              </span>
            )}
            {title}
            {coverage && <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-muted-foreground">{coverage}</p>}
          </div>
          <StoreMarks product={product} />
        </div>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <StoreMarks product={product} />
            {family && <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-[#284786] dark:bg-blue-950/45 dark:text-blue-300">{family}</span>}
          </div>
          {title}
          {product.description && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-muted-foreground">{product.description}</p>}
          {details}
        </>
      )}
      <div className={"mt-auto flex flex-wrap items-center justify-between gap-2 " + (bundle ? "px-4 py-3 sm:px-5" : "border-t border-slate-200 pt-2 dark:border-border")}>
        <div className={bundle ? undefined : "py-1"}>
          {bundle && details}
          <ProductPrice product={product} />
        </div>
        <Link
          href={"/store/product/" + encodeURIComponent(product.id)}
          aria-label={action + ": " + product.title}
          className={"et-interactive inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold " + buttonTone}
          data-testid={"btn-view-store-product-" + product.id}
        >
          {action} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function StorePage() {
  const [view, setView] = useState<StoreView>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<StoreSort>("catalog");
  const [family, setFamily] = useState("");
  const [discounted, setDiscounted] = useState(false);

  const productsQuery = useQuery({
    queryKey: ["commerce-products"],
    queryFn: getCommerceProducts,
    retry: 1,
    staleTime: 60_000,
  });
  const products = productsQuery.data?.products ?? EMPTY_PRODUCTS;
  const { bundles, packages, families } = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const familyLabels = new Map<string, string>();
    for (const product of products) {
      if (isBundle(product)) continue;
      for (const exam of product.exams ?? []) {
        if (exam.familyCode && exam.familyName) familyLabels.set(exam.familyCode, exam.familyName);
      }
    }
    const matching = products.filter((product) => {
      if (discounted && product.salePriceMinor >= product.listPriceMinor) return false;
      const terms = [product.title, product.code, product.description, ...(product.exams ?? []).flatMap((exam) => [exam.name, exam.examCode, exam.familyName])];
      return terms.join(" ").toLowerCase().includes(needle);
    });
    if (sort !== "catalog") {
      matching.sort((a, b) => sort === "price-asc" ? a.salePriceMinor - b.salePriceMinor : b.salePriceMinor - a.salePriceMinor);
    }
    return {
      bundles: matching.filter(isBundle),
      packages: matching.filter((product) => !isBundle(product) && (!family || product.exams?.some((exam) => exam.familyCode === family))),
      families: Array.from(familyLabels).sort((a, b) => a[1].localeCompare(b[1])),
    };
  }, [products, search, sort, family, discounted]);

  const showBundles = view !== "package" && (bundles.length > 0 || view === "bundle");
  const showPackages = view !== "bundle" && (packages.length > 0 || Boolean(family) || view === "package");
  const hasResults = (showBundles && bundles.length > 0) || (showPackages && packages.length > 0);
  const emptyResults = <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-600 dark:border-border dark:text-muted-foreground">No products match this selection.</p>;

  return (
    <div className="sites-page-shell store-page min-h-screen bg-[#f7f9fc] dark:bg-background" data-testid="store-page">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-foreground sm:text-4xl">ExamTree Store</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-muted-foreground sm:text-base">Shop test packages for individual exams or bundles for multiple exams.</p>
          </div>
          <Link href="/my-packages" className={control + " et-interactive inline-flex items-center gap-2 px-3 font-semibold"}>
            <ShoppingBag className="size-4 text-[#244ace] dark:text-blue-300" aria-hidden="true" /> My purchases
          </Link>
        </div>
        <div className="my-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex max-w-full flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-muted" role="group" aria-label="Product type">
            {VIEWS.map(({ value, label }) => (
              <button key={value} type="button" onClick={() => { setView(value); setFamily(""); }} aria-pressed={view === value} className={"et-interactive min-h-11 rounded-lg px-3 text-sm font-semibold sm:px-4 " + (view === value ? "bg-white text-[#2243b5] shadow-sm dark:bg-card dark:text-blue-300" : "text-slate-600 dark:text-muted-foreground")}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <label className="relative min-w-0 flex-1 sm:w-64">
              <span className="sr-only">Search the store</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search exams, packages, or bundles" className={control + " w-full pl-9 pr-2"} data-testid="store-search" />
            </label>
            <select value={sort} onChange={(event) => setSort(event.target.value as StoreSort)} aria-label="Sort store products" className={control + " max-w-full px-2"}>
              <option value="catalog">Catalog order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            <button type="button" onClick={() => setDiscounted(!discounted)} aria-pressed={discounted} className={filterControl}>On sale</button>
          </div>
        </div>

        {productsQuery.data?.salesEnabled === false && (
          <p role="status" className="mb-5 text-sm font-medium text-amber-800 dark:text-amber-300">Purchases are temporarily paused.</p>
        )}
        {productsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Loading the store">
            {[0, 1].map((index) => <div key={index} className="skeleton-shimmer h-48 rounded-2xl" />)}
          </div>
        ) : productsQuery.isError ? (
          <div className={statusPanel}>
            <h2 className="text-lg font-semibold">Store is temporarily unavailable</h2>
            <Button variant="outline" className="mt-4 min-h-11" onClick={() => productsQuery.refetch()}>Try again</Button>
          </div>
        ) : products.length === 0 ? (
          <div className={statusPanel}>
            <h2 className="text-lg font-semibold">No products are currently published for sale</h2>
            <Button asChild className="mt-4 min-h-11"><Link href="/exams">Browse tests</Link></Button>
          </div>
        ) : (
          <div className="space-y-7" data-testid="store-product-grid">
            {showBundles && (
              <section aria-labelledby="store-bundles-title">
                <h2 id="store-bundles-title" className="mb-3 text-2xl font-bold tracking-tight">Exam bundles</h2>
                {bundles.length > 0 ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {bundles.map((product, index) => <StoreCard key={product.id} product={product} bundle teal={index % 2 === 1} />)}
                  </div>
                ) : emptyResults}
              </section>
            )}
            {showPackages && (
              <section aria-labelledby="store-packages-title">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 id="store-packages-title" className="text-2xl font-bold tracking-tight">Exam packages</h2>
                  {families.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter packages by exam family">
                      {[["", "All exams"], ...families].map(([value, label]) => (
                        <button key={value} type="button" onClick={() => setFamily(value)} aria-pressed={family === value} className={filterControl}>{label}</button>
                      ))}
                    </div>
                  )}
                </div>
                {packages.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {packages.map((product) => <StoreCard key={product.id} product={product} />)}
                  </div>
                ) : emptyResults}
              </section>
            )}
            {!showBundles && !showPackages && emptyResults}
            {!hasResults && (search.trim() || family || discounted) && (
              <Button variant="outline" className="min-h-11" onClick={() => { setSearch(""); setFamily(""); setDiscounted(false); }}>Clear filters</Button>
            )}
          </div>
        )}
        <p className="mt-5 text-xs text-slate-600 dark:text-muted-foreground">Independent exam preparation by ExamTree.</p>
      </div>
    </div>
  );
}
