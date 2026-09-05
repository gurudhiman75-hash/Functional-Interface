import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AlertCircle, Check, CreditCard } from "lucide-react";
import { getPackages, type Package } from "@/lib/data";
import { Button } from "@/components/ui/button";

const COMPARISON_ROWS = [
  { feature: "Mock test access", free: "Limited free tests", paid: "Full test series" },
  { feature: "Reasoning Logic Playback", free: "Sample access", paid: "Full access" },
  { feature: "Step-by-Step Reasoning", free: "Available after attempts", paid: "Available across all tests" },
  { feature: "Performance Analytics", free: "Basic score summary", paid: "Detailed diagnostic dashboard" },
  { feature: "Practice History", free: "Recent attempts", paid: "Full history and trends" },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getPackages();
        setPackages(data.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.order - b.order));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    void fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-10">
        <div className="skeleton-shimmer h-12 w-72 rounded-md" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="skeleton-shimmer h-80 rounded-md" />
          <div className="skeleton-shimmer h-80 rounded-md" />
          <div className="skeleton-shimmer h-80 rounded-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="flex items-start gap-3 rounded-md border border-rose-200 bg-rose-50 p-4">
          <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={20} />
          <span className="text-rose-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section className="data-card p-6">
        <p className="professional-badge mb-3">Packages</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">All-access test preparation</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Unlock full mock series, detailed analytics, and complete reasoning playback for serious preparation.
            </p>
          </div>
          <CreditCard className="hidden h-8 w-8 text-indigo-600 lg:block" />
        </div>
      </section>

      {packages.length === 0 ? (
        <div className="data-card py-14 text-center text-muted-foreground">No packages available yet.</div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const testCount = pkg.tests?.length ?? pkg.testCount ?? 0;
            return (
              <article
                key={pkg.id}
                className={`rounded-md border bg-white p-5 shadow-sm dark:bg-slate-900 ${
                  pkg.isPopular ? "border-indigo-500" : "border-zinc-200 dark:border-slate-800"
                }`}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {pkg.isPopular ? "Recommended" : "Package"}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">{pkg.name}</h2>
                    {pkg.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{pkg.description}</p>}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      ₹{(pkg.finalPriceCents / 100).toLocaleString("en-IN")}
                    </span>
                    {pkg.discountPercent > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{(pkg.originalPriceCents / 100).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {testCount > 0 ? `${testCount} tests included` : "Full access package"}
                  </p>
                </div>

                <ul className="mb-6 space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-slate-800">
                  {(pkg.features?.length ? pkg.features : ["Full access to Reasoning Logic Playback", "Diagnostic analytics", "Complete mock series"]).slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/packages/${pkg.id}`}>
                  <Button className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700">
                    Get All-Access
                  </Button>
                </Link>
              </article>
            );
          })}
        </section>
      )}

      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.14em] text-muted-foreground dark:border-slate-800 dark:bg-slate-950">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Unlock</th>
              <th className="px-5 py-3 text-left font-semibold">Free</th>
              <th className="px-5 py-3 text-left font-semibold text-indigo-600">All-Access</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature} className="border-b border-zinc-100 last:border-b-0 dark:border-slate-800">
                <td className="px-5 py-3 font-medium">{row.feature}</td>
                <td className="px-5 py-3 text-muted-foreground">{row.free}</td>
                <td className="px-5 py-3 font-medium text-emerald-600">{row.paid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
