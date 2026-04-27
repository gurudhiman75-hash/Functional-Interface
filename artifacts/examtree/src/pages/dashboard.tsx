import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Filter,
  Flame,
  Lock,
  Play,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Trophy,
  TrendingUp,
  Zap,
} from "lucide-react";
import { getMyTests, getPackages, getTests, getDailyChallenge, type PurchasedTest, type Test } from "@/lib/data";
import { getAttempts, getActiveTestSessions, getStreak, acknowledgeStreakCelebration, isDailyChallengeCompletedToday } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryTabsSection } from "@/components/CategoryTabsSection";
import { openRazorpayCheckoutForTest } from "@/lib/razorpay-checkout";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(cents / 100);
}

function TestCard({
  test,
  isPurchased,
  isDailyChallenge,
  onPurchase,
  onStart,
}: {
  test: Test | PurchasedTest;
  isPurchased: boolean;
  isDailyChallenge?: boolean;
  onPurchase: (testId: string, testName: string, priceCents: number) => void;
  onStart: (testId: string) => void;
}) {
  const displayCurrency = import.meta.env.VITE_RAZORPAY_CURRENCY ?? "INR";
  const priceCents = "priceCents" in test ? test.priceCents : 0;

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg leading-tight line-clamp-2">{test.name}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2 text-sm">
              <span className="capitalize">{test.category}</span>
              {test.subcategoryName && (
                <>
                  <span>â€¢</span>
                  <span>{test.subcategoryName}</span>
                </>
              )}
            </CardDescription>
          </div>
          {isPurchased && (
            <Badge variant="secondary" className="shrink-0">
              <Star className="h-3 w-3 mr-1" />
              Purchased
            </Badge>
          )}
          {isDailyChallenge && (
            <Badge className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0 gap-1">
              <Flame className="h-3 w-3" />
              Daily
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{Math.floor(test.duration / 60)}h {test.duration % 60}m</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{test.totalQuestions} Qs</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>{test.avgScore}% avg</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={test.difficulty === "Easy" ? "secondary" : test.difficulty === "Medium" ? "default" : "destructive"}>
              {test.difficulty}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {test.kind?.replace("-", " ")}
            </Badge>
          </div>

          {isPurchased ? (
            <Button
              onClick={() => onStart(test.id)}
              className="gap-2"
              size="sm"
            >
              <Play className="h-4 w-4" />
              Start Test
            </Button>
          ) : (
            <Button
              onClick={() => onPurchase(test.id, test.name, priceCents || 499)}
              variant="outline"
              className="gap-2"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy {formatPrice(priceCents || 499)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Local attempts for progress tracking
  const attempts = useMemo(() => getAttempts(), []);

  // Daily streak
  const streakData = useMemo(() => getStreak(), []);
  const streakMilestone = useMemo(() => {
    const n = streakData.currentStreak;
    if (n >= 30) return { label: "Legend", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/40", border: "border-purple-300 dark:border-purple-700" };
    if (n >= 7)  return { label: "On fire!", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40", border: "border-orange-300 dark:border-orange-700" };
    if (n >= 3)  return { label: "Great start!", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", border: "border-amber-300 dark:border-amber-700" };
    return null;
  }, [streakData.currentStreak]);
  const noAttemptToday = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return streakData.currentStreak > 0 && streakData.lastAttemptDate !== todayStr;
  }, [streakData]);
  const [celebratingStreak, setCelebratingStreak] = useState(() => {
    const s = getStreak();
    if (s.justIncremented) {
      acknowledgeStreakCelebration();
      return true;
    }
    return false;
  });

  // Fetch purchased tests
  const {
    data: myTestsData,
    isLoading: myTestsLoading,
    error: myTestsError,
  } = useQuery({
    queryKey: ["my-tests"],
    queryFn: getMyTests,
  });

  // Fetch all available tests
  const {
    data: allTests,
    isLoading: allTestsLoading,
    error: allTestsError,
  } = useQuery({
    queryKey: ["tests"],
    queryFn: getTests,
  });

  // Fetch all packages for "Recommended" section
  const { data: allPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
    staleTime: 300_000,
  });

  // Daily challenge
  const { data: dailyChallenge } = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: getDailyChallenge,
    staleTime: 300_000,
    retry: false,
  });
  const dailyChallengeCompleted = dailyChallenge
    ? isDailyChallengeCompletedToday(dailyChallenge.testId)
    : false;

  const purchasedTestIds = useMemo(() => {
    return new Set(myTestsData?.purchasedTests?.map(t => t.id) || []);
  }, [myTestsData]);

  const purchasedTests = myTestsData?.purchasedTests || [];
  const availableTests = useMemo(() => {
    return (allTests || []).filter(test => !purchasedTestIds.has(test.id));
  }, [allTests, purchasedTestIds]);

  // Per-category progress: free tests attempted vs total free
  const categoryProgress = useMemo(() => {
    if (!allTests) return [];
    const byCategory = new Map<string, { total: number; attempted: Set<string> }>();
    for (const t of allTests) {
      if ((t.access ?? "free") !== "free") continue;
      const cat = t.category;
      if (!byCategory.has(cat)) byCategory.set(cat, { total: 0, attempted: new Set() });
      byCategory.get(cat)!.total += 1;
    }
    for (const a of attempts) {
      if (a.attemptType !== "REAL") continue;
      const test = allTests.find(t => t.id === a.testId);
      if (!test || (test.access ?? "free") !== "free") continue;
      byCategory.get(test.category)?.attempted.add(test.id);
    }
    return Array.from(byCategory.entries())
      .map(([category, { total, attempted }]) => ({
        category,
        total,
        attempted: attempted.size,
      }))
      .filter(c => c.total > 0)
      .sort((a, b) => b.attempted - a.attempted);
  }, [allTests, attempts]);

  // Most active category (most attempts)
  const topCategory = categoryProgress[0] ?? null;
  const isPremium = purchasedTests.length > 0;
  const activeTestSession = useMemo(() => {
    const sessions = Object.values(getActiveTestSessions());
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;
  }, []);
  const latestAttempt = attempts[0] ?? null;
  const latestAttemptTest = useMemo(() => {
    if (!latestAttempt || !allTests) return null;
    return allTests.find((test) => test.id === latestAttempt.testId) ?? null;
  }, [allTests, latestAttempt]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const allTestsCombined = [...purchasedTests, ...availableTests];
    return Array.from(new Set(allTestsCombined.map(test => test.category))).sort();
  }, [purchasedTests, availableTests]);

  const nextActions = useMemo(() => {
    const actions: Array<{
      label: string;
      sub: string;
      icon: typeof Play;
      onClick: () => void;
      gradient: string;
    }> = [];

    if (activeTestSession) {
      actions.push({
        label: "Resume saved test",
        sub: `${activeTestSession.testName} · pick up where you left off`,
        icon: Play,
        onClick: () => setLocation(`/test/${activeTestSession.testId}`),
        gradient: "from-sky-500 to-indigo-500",
      });
    } else if (latestAttemptTest && latestAttempt) {
      actions.push({
        label: "Review last test",
        sub: `${latestAttemptTest.name} · ${latestAttempt.score}% score`,
        icon: Play,
        onClick: () => setLocation(`/result?testId=${latestAttemptTest.id}&tab=review`),
        gradient: "from-sky-500 to-indigo-500",
      });
    }

    if (dailyChallenge) {
      actions.push({
        label: dailyChallengeCompleted ? "Review today's challenge" : "Start today's challenge",
        sub: `${dailyChallenge.testName} · fresh for today`,
        icon: Flame,
        onClick: () => setLocation(`/test/${dailyChallenge.testId}`),
        gradient: "from-emerald-500 to-teal-600",
      });
    }

    if (topCategory) {
      actions.push({
        label: `Practice ${topCategory.category}`,
        sub: `${topCategory.attempted}/${topCategory.total} free tests done`,
        icon: Zap,
        onClick: () => setLocation("/exams"),
        gradient: "from-violet-500 to-purple-600",
      });
    }

    actions.push({
      label: "Browse all exams",
      sub: "Pick a new category or series",
      icon: BookOpen,
      onClick: () => setLocation("/exams"),
      gradient: "from-amber-500 to-orange-600",
    });

    return actions.slice(0, 4);
  }, [dailyChallenge, dailyChallengeCompleted, latestAttempt, latestAttemptTest, setLocation, topCategory]);

  // Filter and search logic
  const filteredPurchasedTests = useMemo(() => {
    return purchasedTests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || test.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [purchasedTests, searchQuery, categoryFilter]);

  const filteredAvailableTests = useMemo(() => {
    return availableTests.filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || test.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [availableTests, searchQuery, categoryFilter]);

  // Recommended packages: popular first, exclude already-owned
  const ownedPackageIds = useMemo(() => new Set<string>(), []); // extend if user packages available
  const recommendedPackages = useMemo(() => {
    if (!allPackages) return [];
    return allPackages
      .filter(p => !ownedPackageIds.has(p.id))
      .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || a.order - b.order)
      .slice(0, 3);
  }, [allPackages, ownedPackageIds]);

  const handlePurchase = async (testId: string, testName: string, priceCents: number) => {
    try {
      await openRazorpayCheckoutForTest({
        testId,
        successPath: `/dashboard?purchase=success`,
        onPaid: async () => {
          await queryClient.invalidateQueries({ queryKey: ["my-tests"] });
          await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
          toast({
            title: "Purchase successful!",
            description: `${testName} has been added to your tests.`,
          });
          setLocation(`/dashboard?purchase=success`);
        },
        onError: (message) => {
          toast({
            title: "Purchase failed",
            description: message,
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleStartTest = (testId: string) => {
    setLocation(`/test/${testId}`);
  };

  const loading = myTestsLoading || allTestsLoading;
  const error = myTestsError || allTestsError;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive mb-2">Failed to load dashboard</p>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              My Dashboard
            </h1>
            <p className="text-muted-foreground">
              Access your purchased tests and discover new ones to prepare for your exams.
            </p>
          </div>
          {/* ── Streak widget ── */}
          <div className="flex flex-col items-end gap-1.5">
            {streakData.currentStreak > 0 ? (
              <div
                className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-sm select-none transition-transform ${
                  celebratingStreak
                    ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30 scale-110 animate-bounce"
                    : streakMilestone
                    ? `${streakMilestone.bg} ${streakMilestone.border}`
                    : "border-orange-200 bg-orange-50/60 dark:border-orange-800 dark:bg-orange-950/20"
                }`}
                onAnimationEnd={() => setCelebratingStreak(false)}
                title={`Longest streak: ${streakData.longestStreak} day${streakData.longestStreak !== 1 ? "s" : ""}`}
              >
                <span className={`text-2xl leading-none ${streakData.currentStreak >= 7 ? "animate-pulse" : ""}`}>🔥</span>
                <div>
                  <p className={`text-sm font-bold leading-tight ${streakMilestone ? streakMilestone.color : "text-orange-700 dark:text-orange-400"}`}>
                    🔥 {streakData.currentStreak} day{streakData.currentStreak !== 1 ? "s" : ""} streak
                  </p>
                  {streakMilestone ? (
                    <p className={`text-[10px] font-semibold leading-tight ${streakMilestone.color}`}>{streakMilestone.label}</p>
                  ) : streakData.longestStreak > streakData.currentStreak ? (
                    <p className="text-[10px] text-orange-500/80 leading-tight">Best: {streakData.longestStreak}d</p>
                  ) : null}
                </div>
              </div>
            ) : null}
            {noAttemptToday && (
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1">
                <span>⚠️</span> Don&apos;t break your streak!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Next actions ── */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {nextActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="group rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-sm transition-transform group-hover:scale-105`}>
              <action.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{action.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{action.sub}</p>
          </button>
        ))}
      </div>

      <CategoryTabsSection
        title="Browse by category"
        subtitle="Open a category to see the subcategories available under it."
        ctaLabel="Open exams"
        defaultCtaPath="/exams"
        className="pt-2"
        showTopBadge={false}
      />

      {/* ── Daily Challenge banner ── */}
      {dailyChallenge && (
        <div className={`rounded-2xl border p-5 shadow-sm ${
          dailyChallengeCompleted
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
            : "border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-950/20"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              dailyChallengeCompleted
                ? "bg-emerald-100 dark:bg-emerald-900/40"
                : "bg-amber-100 dark:bg-amber-900/40"
            }`}>
              <Flame className={`w-5 h-5 ${dailyChallengeCompleted ? "text-emerald-600" : "text-amber-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className={`font-bold text-foreground`}>
                  {dailyChallengeCompleted ? "✅ Today's challenge — done!" : "🎯 Daily Challenge"}
                </p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  dailyChallengeCompleted
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                }`}>
                  {dailyChallengeCompleted ? "Completed" : "Today only"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{dailyChallenge.testName}</p>
              {dailyChallenge.totalParticipants > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {dailyChallenge.totalParticipants.toLocaleString()} participant{dailyChallenge.totalParticipants !== 1 ? "s" : ""} today
                </p>
              )}
            </div>
            {!dailyChallengeCompleted && (
              <Button
                className="shrink-0 gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
                onClick={() => setLocation(`/test/${dailyChallenge.testId}`)}
              >
                <Play className="w-4 h-4" />
                Start challenge
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── Progress + Next Step banner ── */}
      {!isPremium && topCategory && topCategory.attempted > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground">
                You completed {topCategory.attempted}/{topCategory.total} free tests in {topCategory.category}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {topCategory.attempted >= topCategory.total
                  ? "You've used all free mocks in this category — unlock the full series to keep going."
                  : `${topCategory.total - topCategory.attempted} free mock${topCategory.total - topCategory.attempted !== 1 ? "s" : ""} left. Unlock the full series for unlimited practice.`}
              </p>
              {/* Mini progress bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-primary/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${Math.min(100, (topCategory.attempted / topCategory.total) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary shrink-0">
                  {topCategory.attempted}/{topCategory.total}
                </span>
              </div>
            </div>
            <Button
              className="shrink-0 gap-2"
              onClick={() => setLocation("/packages")}
            >
              <Trophy className="w-4 h-4" />
              Unlock full series
            </Button>
          </div>
        </div>
      )}

      {/* ── Category progress cards (all active categories) ── */}
      {!isPremium && categoryProgress.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categoryProgress.slice(0, 4).map(({ category, total, attempted }) => {
            const pct = Math.round((attempted / total) * 100);
            return (
              <div
                key={category}
                className="rounded-xl border border-border/70 bg-card/85 p-4 shadow-sm cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => setLocation(`/exams`)}
              >
                <p className="text-sm font-semibold text-foreground truncate">{category}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{attempted}/{total} free mocks done</p>
                <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Recommended for you ── */}
      {recommendedPackages.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Recommended for you</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow bg-card/85 ${
                  pkg.isPopular ? "border-amber-300 dark:border-amber-700" : "border-border/70"
                }`}
                onClick={() => setLocation(`/packages/${pkg.id}`)}
              >
                {Boolean(pkg.isPopular) && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-bold text-white shadow">
                    Most Popular
                  </span>
                )}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-foreground leading-snug">{pkg.name}</p>
                </div>
                {pkg.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{pkg.description}</p>
                )}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-bold text-primary">
                    ₹{(pkg.finalPriceCents / 100).toLocaleString("en-IN")}
                  </span>
                  {(pkg.originalPriceCents ?? 0) > pkg.finalPriceCents && (
                    <span className="text-sm line-through text-muted-foreground">
                      ₹{((pkg.originalPriceCents ?? 0) / 100).toLocaleString("en-IN")}
                    </span>
                  )}
                  {pkg.discountPercent > 0 && (
                    <span className="text-xs font-semibold text-emerald-600">{pkg.discountPercent}% off</span>
                  )}
                </div>
                <Button size="sm" className="w-full gap-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                  View package
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            My Purchased Tests ({filteredPurchasedTests.length})
          </h2>
        </div>

        {filteredPurchasedTests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No purchased tests yet
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Purchase your first test below to start preparing for your exams.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPurchasedTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                isPurchased={true}
                isDailyChallenge={dailyChallenge?.testId === test.id}
                onPurchase={handlePurchase}
                onStart={handleStartTest}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">
            Available Tests ({filteredAvailableTests.length})
          </h2>
        </div>

        {filteredAvailableTests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tests available
              </h3>
              <p className="text-muted-foreground text-center">
                Check back later for new tests.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAvailableTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                isPurchased={false}
                isDailyChallenge={dailyChallenge?.testId === test.id}
                onPurchase={handlePurchase}
                onStart={handleStartTest}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
