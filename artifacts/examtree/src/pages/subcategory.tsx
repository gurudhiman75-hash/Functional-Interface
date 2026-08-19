import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock3,
  CreditCard,
  Hash,
  LayoutGrid,
  List,
  Lock,
  LogIn,
  Play,
  RotateCcw,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { getActiveTestSessions, getAttempts, getUser } from "@/lib/storage";
import { mockUnlockTest, getPackages, getUserPackages, getBundles, getPackagesByExam, type Test, type Package, type Bundle } from "@/lib/data";
import { openRazorpayCheckoutForTest } from "@/lib/razorpay-checkout";
import { getRuntimeExamGroup } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { ApiError, getApiErrorCode } from "@/lib/api";
import { useMyEntitlements } from "@/hooks/use-my-entitlements";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CategoryIcon, isImageIcon } from "@/components/CategoryIcon";

type ExamTab = "full-length" | "sectional" | "topic-wise";

const TAB_LABELS: Record<ExamTab, string> = {
  "full-length": "Full Length",
  sectional: "Sectional",
  "topic-wise": "Topic Wise",
};

const TAB_DESCRIPTIONS: Record<ExamTab, string> = {
  "full-length": "Exam-like mocks covering the complete syllabus and timing.",
  sectional: "Focused practice for specific sections with targeted timing.",
  "topic-wise": "Topic-specific drills for revision and weak-area improvement.",
};

const CATEGORY_STYLES: Record<string, string> = {
  blue: "linear-gradient(to right, #0ea5e9, #3b82f6, #6366f1)",
  emerald: "linear-gradient(to right, #10b981, #14b8a6, #06b6d4)",
  violet: "linear-gradient(to right, #8b5cf6, #d946ef, #ec4899)",
  amber: "linear-gradient(to right, #f59e0b, #f97316, #f43f5e)",
  orange: "linear-gradient(to right, #f97316, #f59e0b, #eab308)",
  rose: "linear-gradient(to right, #f43f5e, #ec4899, #d946ef)",
  indigo: "linear-gradient(to right, #6366f1, #3b82f6, #06b6d4)",
  red: "linear-gradient(to right, #ef4444, #f43f5e, #f97316)",
};

function sortTests(
  examTests: Test[],
  attemptsByTestId: Map<string, ReturnType<typeof getAttempts>[number]>,
  activeSessions: ReturnType<typeof getActiveTestSessions>,
) {
  return [...examTests].sort((left, right) => {
    const leftAttempted = attemptsByTestId.has(left.id) ? 1 : 0;
    const rightAttempted = attemptsByTestId.has(right.id) ? 1 : 0;
    if (leftAttempted !== rightAttempted) return rightAttempted - leftAttempted;

    const leftActive = activeSessions[left.id] ? 1 : 0;
    const rightActive = activeSessions[right.id] ? 1 : 0;
    if (leftActive !== rightActive) return rightActive - leftActive;

    const leftFree = (left.access ?? "free") === "free" ? 1 : 0;
    const rightFree = (right.access ?? "free") === "free" ? 1 : 0;
    if (leftFree !== rightFree) return rightFree - leftFree;

    return left.name.localeCompare(right.name);
  });
}

export default function SubcategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ExamTab>("full-length");

  const { data: allPackages = [] } = useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: getPackages,
    staleTime: 5 * 60_000,
  });
  const attempts = useMemo(() => getAttempts(), []);
  const attemptsByTestId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getAttempts>[number]>();
    for (const attempt of attempts) {
      if (!map.has(attempt.testId)) map.set(attempt.testId, attempt);
    }
    return map;
  }, [attempts]);
  const activeSessions = useMemo(() => getActiveTestSessions(), []);
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const { data: entitlementPayload, refetch: refetchEntitlements } = useMyEntitlements();
  const entitledIds = useMemo(
    () => new Set(entitlementPayload?.testIds ?? []),
    [entitlementPayload],
  );
  const user = getUser();
  const { data: ownedPackages = [] } = useQuery<import("@/lib/data").UserPackage[]>({
    queryKey: ["user-packages"],
    queryFn: () => getUserPackages(),
    staleTime: 60_000,
    enabled: !!user,
  });
  const ownedPackageIds = useMemo(() => new Set(ownedPackages.map((p) => p.id)), [ownedPackages]);
  // Map testId → cheapest package containing it
  const packageByTestId = useMemo(() => {
    const map = new Map<string, Package>();
    for (const pkg of allPackages) {
      for (const pt of pkg.tests ?? []) {
        if (!map.has(pt.testId) || pkg.finalPriceCents < (map.get(pt.testId)!.finalPriceCents)) {
          map.set(pt.testId, pkg);
        }
      }
    }
    return map;
  }, [allPackages]);
  const exam = useMemo(() => (id ? getRuntimeExamGroup(id, categories, tests, subcategories) : null), [id, categories, tests, subcategories]);
  const category = categories.find((item) => item.id === exam?.categoryId);
  const gradient = CATEGORY_STYLES[category?.color ?? "blue"] ?? CATEGORY_STYLES.blue;
  const examIcon = exam?.icon ?? category?.icon ?? "";

  const examTests = useMemo(() => {
    if (!exam) return [];
    return sortTests(
      tests.filter((test) => {
        if (exam.id.startsWith("general-")) {
          return test.categoryId === exam.categoryId && !test.subcategoryId;
        }
        return test.subcategoryId === exam.id;
      }),
      attemptsByTestId,
      activeSessions,
    );
  }, [activeSessions, attemptsByTestId, exam, tests]);

  const tabTests = examTests.filter((test) => (test.kind ?? "full-length") === activeTab);
  const freeCount = tabTests.filter((test) => (test.access ?? "free") === "free").length;
  const paidCount = tabTests.length - freeCount;

  // Count distinct locked packages in the current tab
  const lockedPkgIds = useMemo(() => {
    const ids = new Set<string>();
    for (const test of tabTests) {
      const isFreeTest = (test.access ?? "free") === "free";
      const hasEntitlement = entitledIds.has(test.id);
      if (!isFreeTest && !hasEntitlement) {
        const pkg = packageByTestId.get(test.id);
        if (pkg && !ownedPackageIds.has(pkg.id)) ids.add(pkg.id);
      }
    }
    return ids;
  }, [tabTests, entitledIds, packageByTestId, ownedPackageIds]);

  const { data: allBundles = [] } = useQuery<Bundle[]>({
    queryKey: ["bundles"],
    queryFn: getBundles,
    staleTime: 5 * 60_000,
    enabled: lockedPkgIds.size >= 2,
  });

  // Pick the cheapest bundle as the suggestion (simple heuristic)
  const suggestedBundle = lockedPkgIds.size >= 2 && allBundles.length > 0
    ? allBundles.reduce((a, b) => a.price <= b.price ? a : b)
    : null;

  const { data: examPackages = [] } = useQuery({
    queryKey: ["packages-by-exam", id],
    queryFn: () => getPackagesByExam(id!),
    staleTime: 5 * 60_000,
    enabled: !!id,
  });

  // Best value: lowest price-per-test across packages (and bundle if available)
  const bestValueId = useMemo(() => {
    type Option = { id: string; priceCents: number; testCount: number; kind: "pkg" | "bundle" };
    const options: Option[] = examPackages
      .filter((p) => p.testIds.length > 0)
      .map((p) => ({ id: p.id, priceCents: p.finalPriceCents, testCount: p.testIds.length, kind: "pkg" }));
    if (suggestedBundle && suggestedBundle.price > 0) {
      const bundleTestCount = examPackages.reduce((n, p) => n + p.testIds.length, 0) || 1;
      options.push({ id: `bundle-${suggestedBundle.id}`, priceCents: suggestedBundle.price, testCount: bundleTestCount, kind: "bundle" });
    }
    if (options.length < 2) return options[0]?.id ?? null;
    return options.reduce((a, b) =>
      a.priceCents / a.testCount <= b.priceCents / b.testCount ? a : b
    ).id;
  }, [examPackages, suggestedBundle]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">Could not load exam</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The exam catalog is temporarily unavailable. Please try again.
          </p>
          <Button className="mt-5" variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-12">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="h-40 rounded-2xl bg-muted" />
            <div className="h-40 rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="glass-panel max-w-xl rounded-[2rem] border border-border/60 p-10 text-center shadow-lg">
            <span className="mb-4 inline-block rounded-full border border-border/50 bg-muted/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Exam unavailable
            </span>
            <h1 className="text-2xl font-bold text-foreground">Exam not found</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This exam page is not available right now.
            </p>
            <Button className="mt-6 rounded-2xl" onClick={() => setLocation("/exams")}>
              Back to Exams
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const startPaidCheckout = async (testItem: Test) => {
    if (!user) {
      setLocation("/login/student");
      return;
    }
    try {
      await openRazorpayCheckoutForTest({
        testId: testItem.id,
        successPath: `/test/${testItem.id}?checkout=success`,
        onPaid: async () => {
          await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
          await queryClient.invalidateQueries({ queryKey: ["user-packages"] });
          await refetchEntitlements();
          toast({
            title: "Payment successful",
            description: `${testItem.name} is now unlocked on your account.`,
          });
          setLocation(`/test/${testItem.id}?checkout=success`);
        },
        onError: (message) => {
          toast({
            title: "Payment could not be verified",
            description: message,
            variant: "destructive",
          });
        },
      });
    } catch (e) {
      if (
        import.meta.env.DEV &&
        e instanceof ApiError &&
        getApiErrorCode(e.body) === "RAZORPAY_NOT_CONFIGURED"
      ) {
        await mockUnlockTest(testItem.id);
        await refetchEntitlements();
        await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
        await queryClient.invalidateQueries({ queryKey: ["user-packages"] });
        toast({
          title: "Unlocked (development)",
          description: `${testItem.name} is available without Razorpay keys while you develop.`,
        });
        return;
      }
      toast({
        title: "Could not start payment",
        description: e instanceof Error ? e.message : "Try again later.",
        variant: "destructive",
      });
    }
  };

  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <button
            onClick={() => setLocation(`/category/${exam.categoryId}`)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            data-testid="btn-back-category"
          >
            <ArrowLeft className="h-4 w-4" />
            {category?.name ?? "Back"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-6 rounded-2xl overflow-hidden border border-sky-80 bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50 px-5 py-6 shadow-sm">
              <div className="inline-flex items-center rounded-full px-3 py-1 mb-3" style={{ backgroundImage: gradient }}>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/90">{category?.name}</span>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${isImageIcon(examIcon) ? "border border-slate-200 bg-white text-slate-700" : "text-white"}`}
                  style={isImageIcon(examIcon) ? undefined : { backgroundImage: gradient }}
                >
                  <CategoryIcon icon={examIcon} className="h-5 w-5" />
                </div>
                <h1 className="text-[34px] font-black tracking-tight text-foreground leading-tight sm:text-[40px]">{exam.name}</h1>
              </div>
              <ExamDescription
                text={exam.description || `Browse ${exam.name} by full-length, sectional, and topic-wise practice.`}
                examName={exam.name}
                freeCount={examTests.filter(t => (t.access ?? "free") === "free").length}
                paidCount={examTests.filter(t => (t.access ?? "free") !== "free").length}
                fullLengthCount={examTests.filter(t => (t.kind ?? "full-length") === "full-length").length}
                sectionalCount={examTests.filter(t => t.kind === "sectional").length}
                topicWiseCount={examTests.filter(t => t.kind === "topic-wise").length}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs font-medium text-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary/70" />{examTests.length} total
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />{examTests.filter(t => (t.access ?? "free") === "free").length} free
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Lock className="h-3.5 w-3.5" />{examTests.filter(t => (t.access ?? "free") !== "free").length} paid
                </span>
                {attempts.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    <Users className="h-3.5 w-3.5" />{attempts.length} attempts saved
                  </span>
                )}
              </div>

              {examTests.length > 0 && (() => {
                const completedIds = new Set(attempts.map(a => a.testId));
                const completed = examTests.filter(t => completedIds.has(t.id)).length;
                const total = examTests.length;
                const pct = Math.round((completed / total) * 100);
                return (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground">Your progress</span>
                      <span className="text-[11px] font-semibold text-foreground">{completed} / {total} completed</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
              {(Object.keys(TAB_LABELS) as ExamTab[]).map((tab) => {
                const count = examTests.filter((t) => (t.kind ?? "full-length") === tab).length;
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all ${
                      isActive
                        ? "bg-sky-600 shadow-md text-white font-bold border border-sky-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
                    }`}
                  >
                    {TAB_LABELS[tab]}
                    <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-muted/60 text-muted-foreground/50"
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {tabTests.length} {TAB_LABELS[activeTab].toLowerCase()} test{tabTests.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {tabTests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/60 px-6 py-14 text-center">
                <BookOpen className="mx-auto h-9 w-9 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">No {TAB_LABELS[activeTab].toLowerCase()} tests yet</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {tabTests.map((test) => {
                  const latestAttempt = attemptsByTestId.get(test.id);
                  const attempted = Boolean(latestAttempt);
                  const activeSession = activeSessions[test.id];
                  const isFree = (test.access ?? "free") === "free";
                  const hasEntitlement = entitledIds.has(test.id);
                  const hasAccess = isFree || hasEntitlement;
                  const isLocked = !hasAccess;
                  const pkg = packageByTestId.get(test.id);
                  const pkgOwned = pkg ? ownedPackageIds.has(pkg.id) : false;

                  const borderAccent = attempted
                    ? "border-l-sky-400"
                    : !isLocked || pkgOwned
                      ? isFree ? "border-l-emerald-400" : "border-l-violet-400"
                      : "border-l-amber-400";

                  return (
                    <div
                      key={test.id}
                      className={`group relative flex flex-col gap-3 rounded-xl border border-slate-100 border-l-4 ${borderAccent} bg-white/80 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:bg-white cursor-pointer`}
                      onClick={() => !isLocked || pkgOwned ? setLocation(`/test/${test.id}`) : undefined}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[18px] font-bold text-slate-800 leading-snug">{test.name}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[14px] text-slate-400">
                            <span className="flex items-center gap-1"><Clock3 className="h-3 w-3 text-primary/50" />{test.duration} min</span>
                            <span className="flex items-center gap-1"><Hash className="h-3 w-3 text-slate-400" />{test.totalQuestions} Qs</span>
                            <DifficultyBadge difficulty={test.difficulty} />
                          </div>
                        </div>
                        <TestStatusBadge isFree={isFree} isLocked={isLocked} pkgOwned={pkgOwned} attempted={attempted} activeSession={!!activeSession} />
                      </div>
                      {latestAttempt && (
                        <p className="text-[11px] text-muted-foreground/70">
                          Last attempt: {new Date(latestAttempt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          {latestAttempt.score != null && <> &middot; <span className={latestAttempt.score >= 70 ? "text-emerald-600" : latestAttempt.score >= 40 ? "text-amber-600" : "text-rose-600"}>{latestAttempt.score}%</span></>}
                        </p>
                      )}
                      <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
                        <TestActionButton
                          test={test}
                          isLocked={isLocked}
                          pkgOwned={pkgOwned}
                          pkg={pkg}
                          activeSession={!!activeSession}
                          attempted={attempted}
                          user={user}
                          onStart={() => setLocation(`/test/${test.id}`)}
                          onBuy={() => setLocation("/packages")}
                          onUnlock={() => user ? void startPaidCheckout(test) : setLocation("/login/student")}
                          onReview={() => latestAttempt && setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(test.id)}&tab=review`)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {tabTests.map((test) => {
                  const latestAttempt = attemptsByTestId.get(test.id);
                  const attempted = Boolean(latestAttempt);
                  const activeSession = activeSessions[test.id];
                  const isFree = (test.access ?? "free") === "free";
                  const hasEntitlement = entitledIds.has(test.id);
                  const hasAccess = isFree || hasEntitlement;
                  const isLocked = !hasAccess;
                  const pkg = packageByTestId.get(test.id);
                  const pkgOwned = pkg ? ownedPackageIds.has(pkg.id) : false;

                  const borderAccent = attempted
                    ? "border-l-sky-400"
                    : !isLocked || pkgOwned
                      ? isFree ? "border-l-emerald-400" : "border-l-violet-400"
                      : "border-l-amber-400";

                  return (
                    <div
                      key={test.id}
                      className={`group flex items-center gap-3 rounded-xl border border-slate-100 border-l-4 ${borderAccent} bg-white/80 px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:translate-x-0.5 hover:bg-white cursor-pointer`}
                      onClick={() => !isLocked || pkgOwned ? setLocation(`/test/${test.id}`) : undefined}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isLocked && !pkgOwned ? "bg-amber-100 text-amber-600" : attempted ? "bg-sky-100 text-sky-600" : "bg-primary/10 text-primary"
                      }`}>
                        {isLocked && !pkgOwned ? <Lock className="h-4 w-4" /> : attempted ? <RotateCcw className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[18px] font-bold text-slate-800 leading-snug">{test.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[14px] text-slate-400">
                          <TestStatusBadge isFree={isFree} isLocked={isLocked} pkgOwned={pkgOwned} attempted={attempted} activeSession={!!activeSession} />
                          <span className="flex items-center gap-0.5"><Clock3 className="h-3 w-3 text-primary/50" />{test.duration} min</span>
                          <span className="flex items-center gap-0.5"><Hash className="h-3 w-3 text-slate-400" />{test.totalQuestions} Qs</span>
                          <DifficultyBadge difficulty={test.difficulty} />
                          {activeSession && <span className="font-medium text-sky-600">In progress</span>}
                        </div>
                        {latestAttempt && (
                          <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                            {new Date(latestAttempt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {latestAttempt.score != null && <> &middot; <span className={latestAttempt.score >= 70 ? "text-emerald-600 font-medium" : latestAttempt.score >= 40 ? "text-amber-600 font-medium" : "text-rose-600 font-medium"}>{latestAttempt.score}%</span></>}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                        <TestActionButton
                          test={test}
                          isLocked={isLocked}
                          pkgOwned={pkgOwned}
                          pkg={pkg}
                          activeSession={!!activeSession}
                          attempted={attempted}
                          user={user}
                          onStart={() => setLocation(`/test/${test.id}`)}
                          onBuy={() => setLocation("/packages")}
                          onUnlock={() => user ? void startPaidCheckout(test) : setLocation("/login/student")}
                          onReview={() => latestAttempt && setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(test.id)}&tab=review`)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {examPackages.length > 0 && (
            <div className="w-full xl:w-72 xl:shrink-0">
              <div className="sticky top-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">Unlock a Package</p>
                {examPackages.map((ep) => {
                  const isBest = ep.id === bestValueId;
                  const owned = ownedPackageIds.has(ep.id);
                  return (
                    <div
                      key={ep.id}
                      className={`relative rounded-xl border overflow-hidden transition-all duration-200 hover:scale-[1.015] ${
                        owned
                          ? "border-emerald-300/70 shadow-lg shadow-emerald-100/50"
                          : isBest
                            ? "border-violet-400/60 shadow-lg shadow-violet-100/60 ring-1 ring-violet-300/40"
                            : "border-border/60 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <div className={`px-4 pt-4 pb-3 ${
                        owned
                          ? "bg-gradient-to-br from-emerald-50 to-teal-50/60"
                          : isBest
                            ? "bg-gradient-to-br from-violet-50 to-indigo-50/60"
                            : "bg-gradient-to-br from-muted/40 to-muted/10"
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            {owned && (
                              <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                ✓ Purchased
                              </span>
                            )}
                            {!owned && isBest && (
                              <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                <Zap className="h-2.5 w-2.5" /> Best Value
                              </span>
                            )}
                            <p className="text-[14px] font-bold text-foreground leading-snug">{ep.name}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-black tracking-tight text-foreground">₹{(ep.finalPriceCents / 100).toFixed(0)}</p>
                            {ep.originalPriceCents && ep.originalPriceCents > ep.finalPriceCents && (
                              <p className="text-[11px] font-normal text-muted-foreground/70 line-through">₹{(ep.originalPriceCents / 100).toFixed(0)}</p>
                            )}
                            {ep.discountPercent > 0 && (
                              <p className="text-[11px] font-bold text-emerald-600">{ep.discountPercent}% off</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-card px-4 py-3 border-t border-border/40">
                        <div className="grid grid-cols-2 divide-x divide-border/40 mb-3 text-center">
                          <div className="pr-2">
                            <p className="text-sm font-black text-foreground">{ep.testIds.length}</p>
                            <p className="text-[10px] font-medium text-muted-foreground leading-tight">Tests</p>
                          </div>
                          <div className="pl-2">
                            <p className="text-sm font-black text-foreground">Full</p>
                            <p className="text-[10px] font-medium text-muted-foreground leading-tight">Access</p>
                          </div>
                        </div>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-600" />
                            Attempts and solution review
                          </li>
                          <li className="flex items-center gap-1.5">
                            <RotateCcw className="h-3 w-3 shrink-0 text-sky-600" />
                            Retake available tests
                          </li>
                        </ul>
                        <Button
                          size="sm"
                          className={`mt-3 w-full rounded-lg font-semibold ${
                            owned
                              ? "bg-emerald-600 hover:bg-emerald-600 cursor-default"
                              : isBest
                                ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-sm"
                                : ""
                          }`}
                          disabled={owned}
                          onClick={() => !owned && setLocation("/packages")}
                        >
                          {owned ? "✓ Purchased" : "Buy Now"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">What you'll get</p>
                <ul className="space-y-1.5">
                  {[
                    { icon: <ShieldCheck className="h-3 w-3 text-emerald-600" />, text: "Detailed answer explanations" },
                    { icon: <RotateCcw className="h-3 w-3 text-sky-600" />, text: "Retake available tests" },
                    { icon: <Clock3 className="h-3 w-3 text-primary/70" />, text: "Configured timed test environment" },
                    { icon: <Hash className="h-3 w-3 text-violet-500" />, text: "Saved scores and solution review" },
                    { icon: <BookOpen className="h-3 w-3 text-amber-600" />, text: "Published full and sectional coverage" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {item.icon}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type TestActionButtonProps = {
  test: Test;
  isLocked: boolean;
  pkgOwned: boolean;
  pkg: Package | undefined;
  activeSession: boolean;
  attempted: boolean;
  user: ReturnType<typeof getUser>;
  onStart: () => void;
  onBuy: () => void;
  onUnlock: () => void;
  onReview: () => void;
};

function TestActionButton({ isLocked, pkgOwned, pkg, activeSession, attempted, user, onStart, onBuy, onUnlock, onReview }: TestActionButtonProps) {
  if (!isLocked || pkgOwned) {
    if (activeSession && !attempted) {
      return (
        <Button size="sm" className="rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-sm font-bold" onClick={onStart}>
          <Play className="mr-1.5 h-3.5 w-3.5" />Resume
        </Button>
      );
    }
    if (attempted) {
      return (
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" className="rounded-lg border-muted-foreground/30 hover:border-foreground/40 font-medium" onClick={onStart}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />Retry
          </Button>
          <Button size="sm" variant="outline" className="rounded-lg border-purple-300 text-purple-700 hover:bg-purple-50 font-medium" onClick={onReview}>
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />Review
          </Button>
        </div>
      );
    }
    return (
      <Button size="sm" className="rounded-lg shadow-sm font-bold" onClick={onStart}>
        <ChevronRight className="mr-1.5 h-3.5 w-3.5" />Start
      </Button>
    );
  }
  if (pkg) {
    return (
      <Button
        size="sm"
        className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm shadow-amber-200"
        onClick={onBuy}
      >
        <Lock className="mr-1.5 h-3.5 w-3.5" />Buy
      </Button>
    );
  }
  return (
    <Button size="sm" variant="outline" className="rounded-lg border-muted-foreground/30 font-medium" onClick={onUnlock}>
      {user ? <><CreditCard className="mr-1.5 h-3.5 w-3.5" />Unlock</> : <><LogIn className="mr-1.5 h-3.5 w-3.5" />Sign in</>}
    </Button>
  );
}

type TestStatusBadgeProps = {
  isFree: boolean;
  isLocked: boolean;
  pkgOwned: boolean;
  attempted: boolean;
  activeSession: boolean;
};

function TestStatusBadge({ isFree, isLocked, pkgOwned, attempted }: TestStatusBadgeProps) {
  if (isLocked && !pkgOwned) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
        <Lock className="h-2.5 w-2.5" />Locked
      </span>
    );
  }
  if (attempted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
        <RotateCcw className="h-2.5 w-2.5" />Attempted
      </span>
    );
  }
  if (isFree) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        <ShieldCheck className="h-2.5 w-2.5" />Free
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
      <ShieldCheck className="h-2.5 w-2.5" />Purchased
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty?: "Easy" | "Medium" | "Hard" }) {
  if (!difficulty) return null;
  const styles = {
    Easy:   "bg-emerald-50 text-emerald-600",
    Medium: "bg-amber-50   text-amber-600",
    Hard:   "bg-rose-50    text-rose-600",
  }[difficulty];
  return (
    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${styles}`}>
      {difficulty}
    </span>
  );
}

function ExamDescription({
  text,
  examName,
  freeCount,
  paidCount,
  fullLengthCount,
  sectionalCount,
  topicWiseCount,
}: {
  text: string;
  examName: string;
  freeCount: number;
  paidCount: number;
  fullLengthCount: number;
  sectionalCount: number;
  topicWiseCount: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const CLAMP = 120;
  const isLong = text.length > CLAMP;
  const shortText = isLong ? `${text.slice(0, CLAMP)}…` : text;

  const bullets = [
    {
      icon: <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary/70" />,
      text: `Coverage — ${examName} uses the current published test catalog and configured topic coverage.`,
    },
    {
      icon: <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-violet-500" />,
      text: `Published formats — ${
        [fullLengthCount > 0 && `${fullLengthCount} full-length`, sectionalCount > 0 && `${sectionalCount} sectional`, topicWiseCount > 0 && `${topicWiseCount} topic-wise`]
          .filter(Boolean)
          .join(", ") || "no"
      } tests are currently available.`,
    },
    {
      icon: <Clock3 className="h-3.5 w-3.5 shrink-0 text-sky-600" />,
      text: "Timing — Each published test uses its configured duration and section rules.",
    },
    {
      icon: <Zap className="h-3.5 w-3.5 shrink-0 text-amber-500" />,
      text: "Difficulty — Published tests show the difficulty configured in the catalog.",
    },
    {
      icon: <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600" />,
      text: `Access — ${freeCount} free test${freeCount !== 1 ? "s" : ""} available${paidCount > 0 ? `; ${paidCount} locked test${paidCount !== 1 ? "s" : ""} require entitlement` : ""}.`,
    },
  ];

  return (
    <div className="mt-2">
      <p className="text-[13px] leading-[1.65] text-muted-foreground">
        {!expanded ? shortText : text}
      </p>

      {expanded && (
        <ul className="mt-3 space-y-2 rounded-xl border border-border/50 bg-muted/25 px-4 py-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] leading-[1.6] text-muted-foreground">
              <span className="mt-0.5">{b.icon}</span>
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1.5 text-[12px] font-semibold text-primary hover:underline"
      >
        {expanded ? "Show less ↑" : "Read more ↓"}
      </button>
    </div>
  );
}
