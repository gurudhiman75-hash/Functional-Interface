import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { getPackages, Package } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Check, Lock, ShoppingCart, Sparkles, Star, Trophy, Zap } from "lucide-react";

// Free vs Package comparison rows
const COMPARISON_ROWS = [
  { label: "Mock tests", free: "2–3 per category", paid: "Full series (all tests)" },
  { label: "Detailed analytics", free: "Basic score", paid: "Section trends & weak areas" },
  { label: "Solutions & explanations", free: "✓", paid: "✓" },
  { label: "Retake tests", free: "✓", paid: "✓" },
  { label: "Priority access", free: "✗", paid: "New tests added first" },
  { label: "Progress tracking", free: "Limited", paid: "Full history & leaderboard" },
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
        // Sort: popular first, then by order
        setPackages(data.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.order - b.order));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-background dark:to-background">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 space-y-16">

        {/* ── Hero ── */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Unlock your full potential
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Test Packages
          </h1>
          <p className="text-lg text-muted-foreground">
            Get the complete mock test series for your exam — at a fraction of the cost.<br />
            Practice more, score higher.
          </p>
        </div>

        {/* ── Package Cards ── */}
        {packages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No packages available yet — check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {packages.map((pkg) => {
              const testCount = pkg.tests?.length ?? pkg.testCount ?? 0;
              const perTestPrice = testCount > 0
                ? (pkg.finalPriceCents / testCount / 100).toFixed(0)
                : null;
              const savingsAmount = pkg.originalPriceCents && pkg.originalPriceCents > pkg.finalPriceCents
                ? pkg.originalPriceCents - pkg.finalPriceCents
                : 0;

              return (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col rounded-2xl border shadow-sm transition-shadow hover:shadow-md bg-card ${
                    pkg.isPopular
                      ? "border-primary ring-2 ring-primary/30 dark:ring-primary/40"
                      : "border-border/70"
                  }`}
                >
                  {/* Most Popular ribbon */}
                  {Boolean(pkg.isPopular) && (
                    <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow">
                        <Star className="w-3 h-3 fill-current" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`p-6 ${pkg.isPopular ? "pt-7" : ""}`}>
                    {/* Name + description */}
                    <h2 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h2>
                    {pkg.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pkg.description}</p>
                    )}

                    {/* Value statement — "50 tests for ₹199" */}
                    <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 mb-5">
                      <p className="text-sm font-semibold text-primary">
                        {testCount > 0
                          ? `${testCount} mock test${testCount !== 1 ? "s" : ""} for ₹${(pkg.finalPriceCents / 100).toLocaleString("en-IN")}`
                          : `Full test series for ₹${(pkg.finalPriceCents / 100).toLocaleString("en-IN")}`}
                      </p>
                      {perTestPrice && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Just ₹{perTestPrice} per test — less than a cup of tea
                        </p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-extrabold text-foreground">
                        ₹{(pkg.finalPriceCents / 100).toLocaleString("en-IN")}
                      </span>
                      {pkg.discountPercent > 0 && (
                        <span className="text-base text-muted-foreground line-through">
                          ₹{(pkg.originalPriceCents / 100).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {pkg.discountPercent > 0 && (
                      <div className="flex items-center gap-2 mb-5">
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {pkg.discountPercent}% off
                        </span>
                        <span className="text-xs text-muted-foreground">
                          You save ₹{(savingsAmount / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {/* Test count badge */}
                    {testCount > 0 && (
                      <div className="flex items-center gap-1.5 mb-5">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-foreground">{testCount} tests included</span>
                      </div>
                    )}

                    {/* Top 5 tests preview */}
                    {pkg.tests && pkg.tests.length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {pkg.tests.slice(0, 5).map((test) => (
                          <li key={test.testId} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{test.testName}</span>
                          </li>
                        ))}
                        {pkg.tests.length > 5 && (
                          <li className="text-xs text-primary font-medium pl-5">
                            + {pkg.tests.length - 5} more tests
                          </li>
                        )}
                      </ul>
                    )}

                    {/* Features */}
                    {pkg.features && pkg.features.length > 0 && (
                      <ul className="space-y-1 mb-5 border-t pt-4">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Zap className="w-3 h-3 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* CTA */}
                    <Link href={`/packages/${pkg.id}`}>
                      <Button
                        className={`w-full gap-2 text-base py-5 ${
                          pkg.isPopular
                            ? "bg-primary hover:bg-primary/90 shadow-md"
                            : ""
                        }`}
                        size="lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Get this package
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Free vs Package comparison ── */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Free vs Package</h2>
            <p className="text-muted-foreground mt-1">See exactly what you're unlocking</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border/70 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40">
                  <th className="text-left px-5 py-4 font-semibold text-foreground w-1/2">Feature</th>
                  <th className="px-5 py-4 font-semibold text-muted-foreground text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Free
                    </div>
                  </th>
                  <th className="px-5 py-4 font-semibold text-primary text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" />
                      Package
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-border/40 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">{row.label}</td>
                    <td className="px-5 py-3.5 text-center text-muted-foreground">{row.free}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-emerald-600 dark:text-emerald-400">{row.paid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom CTA below comparison */}
          {packages.length > 0 && (
            <div className="mt-8 text-center">
              <Link href={`/packages/${packages.find(p => p.isPopular)?.id ?? packages[0].id}`}>
                <Button size="lg" className="gap-2 px-8 py-5 text-base shadow-md">
                  <Trophy className="w-4 h-4" />
                  Unlock full test series
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">One-time payment · Instant access · All tests included</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
