import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Hash,
  Lock,
  LogIn,
  Package,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { useMyEntitlements } from "@/hooks/use-my-entitlements";
import { useToast } from "@/hooks/use-toast";
import { ApiError, getApiErrorCode } from "@/lib/api";
import {
  getBundles,
  getPackages,
  getPackagesByExam,
  getUserPackages,
  mockUnlockTest,
  type Bundle,
  type Package,
  type Test,
} from "@/lib/data";
import { openRazorpayCheckoutForTest } from "@/lib/razorpay-checkout";
import { getActiveTestSessions, getAttempts, getUser } from "@/lib/storage";
import { getRuntimeExamGroup } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

type ExamTab = "full-length" | "sectional" | "topic-wise";

const TAB_LABELS: Record<ExamTab, string> = {
  "full-length": "Full Length",
  sectional: "Sectional",
  "topic-wise": "Topic Wise",
};

const TAB_DESCRIPTIONS: Record<ExamTab, string> = {
  "full-length": "Complete mocks covering the configured exam structure and timing.",
  sectional: "Focused tests for a specific section and a shorter practice session.",
  "topic-wise": "Targeted drills for revision and weak-area practice.",
};

function sortTests(
  examTests: Test[],
  attemptsByTestId: Map<string, ReturnType<typeof getAttempts>[number]>,
  activeSessions: ReturnType<typeof getActiveTestSessions>,
) {
  return [...examTests].sort((left, right) => {
    const leftActive = activeSessions[left.id] ? 1 : 0;
    const rightActive = activeSessions[right.id] ? 1 : 0;
    if (leftActive !== rightActive) return rightActive - leftActive;

    const leftAttempted = attemptsByTestId.has(left.id) ? 1 : 0;
    const rightAttempted = attemptsByTestId.has(right.id) ? 1 : 0;
    if (leftAttempted !== rightAttempted) return rightAttempted - leftAttempted;

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
  const ownedPackageIds = useMemo(() => new Set(ownedPackages.map((item) => item.id)), [ownedPackages]);

  const packageByTestId = useMemo(() => {
    const map = new Map<string, Package>();
    for (const pkg of allPackages) {
      for (const packageTest of pkg.tests ?? []) {
        const current = map.get(packageTest.testId);
        if (!current || pkg.finalPriceCents < current.finalPriceCents) map.set(packageTest.testId, pkg);
      }
    }
    return map;
  }, [allPackages]);

  const exam = useMemo(
    () => (id ? getRuntimeExamGroup(id, categories, tests, subcategories) : null),
    [id, categories, tests, subcategories],
  );
  const category = categories.find((item) => item.id === exam?.categoryId);
  const examIcon = exam?.icon ?? category?.icon ?? "Landmark";

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
  const examFreeCount = examTests.filter((test) => (test.access ?? "free") === "free").length;
  const examPremiumCount = examTests.length - examFreeCount;
  const attemptedTestCount = examTests.filter((test) => attemptsByTestId.has(test.id)).length;

  const lockedPkgIds = useMemo(() => {
    const ids = new Set<string>();
    for (const test of tabTests) {
      const isFree = (test.access ?? "free") === "free";
      const hasEntitlement = entitledIds.has(test.id);
      if (!isFree && !hasEntitlement) {
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
  const suggestedBundle = lockedPkgIds.size >= 2 && allBundles.length > 0
    ? allBundles.reduce((left, right) => left.price <= right.price ? left : right)
    : null;

  const { data: examPackages = [] } = useQuery({
    queryKey: ["packages-by-exam", id],
    queryFn: () => getPackagesByExam(id!),
    staleTime: 5 * 60_000,
    enabled: !!id,
  });

  const bestValueId = useMemo(() => {
    type Option = { id: string; priceCents: number; testCount: number };
    const options: Option[] = examPackages
      .filter((pkg) => pkg.testIds.length > 0)
      .map((pkg) => ({ id: pkg.id, priceCents: pkg.finalPriceCents, testCount: pkg.testIds.length }));
    if (suggestedBundle && suggestedBundle.price > 0) {
      const bundleTestCount = examPackages.reduce((sum, pkg) => sum + pkg.testIds.length, 0) || 1;
      options.push({ id: `bundle-${suggestedBundle.id}`, priceCents: suggestedBundle.price, testCount: bundleTestCount });
    }
    if (options.length === 0) return null;
    return options.reduce((left, right) =>
      left.priceCents / left.testCount <= right.priceCents / right.testCount ? left : right
    ).id;
  }, [examPackages, suggestedBundle]);

  if (error) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-slate-950">Could not load exam</h1>
        <p className="mt-2 text-sm text-slate-600">
          The exam catalog is temporarily unavailable. Please try again.
        </p>
        <Button className="mt-5" variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="mt-10 h-12 w-80 rounded-lg bg-slate-200" />
        <div className="mt-4 h-5 max-w-2xl rounded bg-slate-200" />
        <div className="mt-10 space-y-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-28 rounded-xl bg-slate-200" />)}
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500">Exam unavailable</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">Exam not found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">This exam page is not available right now.</p>
          <Button className="mt-6" onClick={() => setLocation("/exams")}>Back to exams</Button>
        </div>
      </main>
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
          toast({ title: "Payment successful", description: `${testItem.name} is now unlocked on your account.` });
          setLocation(`/test/${testItem.id}?checkout=success`);
        },
        onError: (message) => {
          toast({ title: "Payment could not be verified", description: message, variant: "destructive" });
        },
      });
    } catch (caught) {
      if (
        import.meta.env.DEV
        && caught instanceof ApiError
        && getApiErrorCode(caught.body) === "RAZORPAY_NOT_CONFIGURED"
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
        description: caught instanceof Error ? caught.message : "Try again later.",
        variant: "destructive",
      });
    }
  };

  const progress = examTests.length > 0 ? Math.round((attemptedTestCount / examTests.length) * 100) : 0;

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setLocation(`/category/${exam.categoryId}`)}
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          data-testid="btn-back-category"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {category?.name ?? "Back"}
        </button>

        <header className="mt-8 border-b border-slate-200 pb-9">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700" aria-hidden="true">
              <CategoryIcon icon={examIcon} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-indigo-700">{category?.name ?? "Exam series"}</p>
              <h1 className="mt-1 text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">{exam.name}</h1>
            </div>
          </div>

          <ExamDescription
            text={exam.description || `Browse ${exam.name} by full-length, sectional and topic-wise practice.`}
            examName={exam.name}
            freeCount={examFreeCount}
            paidCount={examPremiumCount}
            fullLengthCount={examTests.filter((test) => (test.kind ?? "full-length") === "full-length").length}
            sectionalCount={examTests.filter((test) => test.kind === "sectional").length}
            topicWiseCount={examTests.filter((test) => test.kind === "topic-wise").length}
          />

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            <span><strong className="font-semibold text-slate-950">{examTests.length}</strong> published tests</span>
            <span><strong className="font-semibold text-emerald-700">{examFreeCount}</strong> free</span>
            {examPremiumCount > 0 && <span><strong className="font-semibold text-amber-800">{examPremiumCount}</strong> premium</span>}
            {attemptedTestCount > 0 && <span><strong className="font-semibold text-indigo-700">{attemptedTestCount}</strong> attempted</span>}
          </div>

          {attemptedTestCount > 0 && (
            <div className="mt-5 max-w-xl">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Your progress</span>
                <span>{attemptedTestCount}/{examTests.length} tests attempted</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </header>

        <section className="pt-9" aria-labelledby="test-inventory-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 id="test-inventory-heading" className="text-2xl font-semibold tracking-[-0.02em] text-slate-950">Available tests</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{TAB_DESCRIPTIONS[activeTab]}</p>
            </div>

            <div className="flex gap-5 overflow-x-auto border-b border-slate-200" role="tablist" aria-label="Test format">
              {(Object.keys(TAB_LABELS) as ExamTab[]).map((tab) => {
                const count = examTests.filter((test) => (test.kind ?? "full-length") === tab).length;
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab)}
                    className={`min-h-11 shrink-0 border-b-2 px-0.5 text-sm font-medium transition-colors ${
                      active ? "border-indigo-700 text-indigo-800" : "border-transparent text-slate-500 hover:text-slate-950"
                    }`}
                  >
                    {TAB_LABELS[tab]} <span className="ml-1 text-xs tabular-nums text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {tabTests.length === 0 ? (
            <div className="mt-6 border-y border-dashed border-slate-300 py-14 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-700">No {TAB_LABELS[activeTab].toLowerCase()} tests yet</p>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200 bg-white">
              {tabTests.map((test) => {
                const latestAttempt = attemptsByTestId.get(test.id);
                const attempted = Boolean(latestAttempt);
                const activeSession = Boolean(activeSessions[test.id]);
                const isFree = (test.access ?? "free") === "free";
                const hasEntitlement = entitledIds.has(test.id);
                const isLocked = !(isFree || hasEntitlement);
                const pkg = packageByTestId.get(test.id);
                const pkgOwned = pkg ? ownedPackageIds.has(pkg.id) : false;
                const canOpen = !isLocked || pkgOwned;

                return (
                  <article key={test.id} className="px-4 py-5 sm:px-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                      <button
                        type="button"
                        disabled={!canOpen}
                        onClick={() => canOpen && setLocation(`/test/${test.id}`)}
                        className="min-w-0 flex-1 text-left disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <TestStatusBadge isFree={isFree} isLocked={isLocked} pkgOwned={pkgOwned} attempted={attempted} activeSession={activeSession} />
                          {activeSession && <span className="text-xs font-semibold text-indigo-700">In progress</span>}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-950">{test.name}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{test.duration} min</span>
                          <span className="inline-flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" aria-hidden="true" />{test.totalQuestions} questions</span>
                          <DifficultyBadge difficulty={test.difficulty} />
                        </div>
                        {latestAttempt && (
                          <p className="mt-2 text-xs text-slate-500">
                            Last attempt {new Date(latestAttempt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            {latestAttempt.score != null && <> · <span className="font-semibold text-slate-700">{latestAttempt.score}%</span></>}
                          </p>
                        )}
                      </button>

                      <div className="shrink-0 lg:min-w-[220px] lg:text-right">
                        <TestActionButton
                          isLocked={isLocked}
                          pkgOwned={pkgOwned}
                          pkg={pkg}
                          activeSession={activeSession}
                          attempted={attempted}
                          user={user}
                          onStart={() => setLocation(`/test/${test.id}`)}
                          onBuy={() => setLocation("/packages")}
                          onUnlock={() => user ? void startPaidCheckout(test) : setLocation("/login/student")}
                          onReview={() => latestAttempt && setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(test.id)}&tab=review`)}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {examPackages.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-9" aria-labelledby="packages-heading">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="packages-heading" className="text-2xl font-semibold tracking-[-0.02em] text-slate-950">Packages for this exam</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">Optional access bundles for premium tests. Free tests remain available without a package.</p>
              </div>
              <Button variant="ghost" className="h-11 self-start px-0 text-indigo-700 hover:bg-transparent hover:text-indigo-900 sm:self-auto" onClick={() => setLocation("/packages")}>
                View all packages <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {examPackages.map((pkg) => {
                const owned = ownedPackageIds.has(pkg.id);
                const bestValue = pkg.id === bestValueId;
                return (
                  <article key={pkg.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-2">
                          {owned && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><Check className="h-3 w-3" aria-hidden="true" />Purchased</span>}
                          {!owned && bestValue && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">Best value</span>}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-slate-950">{pkg.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{pkg.testIds.length} tests · full access</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-semibold tabular-nums text-slate-950">₹{(pkg.finalPriceCents / 100).toFixed(0)}</p>
                        {pkg.originalPriceCents && pkg.originalPriceCents > pkg.finalPriceCents && (
                          <p className="text-xs text-slate-400 line-through">₹{(pkg.originalPriceCents / 100).toFixed(0)}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
                      <p className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />Attempts and solution review</p>
                      <p className="mt-2 inline-flex items-center gap-2"><RotateCcw className="h-4 w-4 text-indigo-500" aria-hidden="true" />Retake available tests</p>
                    </div>

                    <Button
                      className="mt-5 h-11 w-full"
                      variant={owned ? "outline" : "default"}
                      disabled={owned}
                      onClick={() => !owned && setLocation("/packages")}
                    >
                      {owned ? "Purchased" : "View package"}
                    </Button>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

type TestActionButtonProps = {
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
        <Button className="h-11 w-full lg:w-auto" onClick={onStart}>
          <Play className="mr-2 h-4 w-4" aria-hidden="true" />Resume test
        </Button>
      );
    }
    if (attempted) {
      return (
        <div className="flex gap-2 lg:justify-end">
          <Button className="h-11" variant="outline" onClick={onStart}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Retry
          </Button>
          <Button className="h-11" variant="outline" onClick={onReview}>
            <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />Review
          </Button>
        </div>
      );
    }
    return (
      <Button className="h-11 w-full lg:w-auto" onClick={onStart}>
        Start test <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>
    );
  }

  if (pkg) {
    return (
      <Button className="h-11 w-full lg:w-auto" variant="outline" onClick={onBuy}>
        <Package className="mr-2 h-4 w-4" aria-hidden="true" />View package
      </Button>
    );
  }

  return (
    <Button className="h-11 w-full lg:w-auto" variant="outline" onClick={onUnlock}>
      {user
        ? <><CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />Unlock test</>
        : <><LogIn className="mr-2 h-4 w-4" aria-hidden="true" />Sign in to unlock</>}
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

function TestStatusBadge({ isFree, isLocked, pkgOwned, attempted, activeSession }: TestStatusBadgeProps) {
  if (activeSession && !attempted) {
    return <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">In progress</span>;
  }
  if (isLocked && !pkgOwned) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"><Lock className="h-3 w-3" aria-hidden="true" />Premium</span>;
  }
  if (attempted) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"><RotateCcw className="h-3 w-3" aria-hidden="true" />Attempted</span>;
  }
  if (isFree) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck className="h-3 w-3" aria-hidden="true" />Free</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"><ShieldCheck className="h-3 w-3" aria-hidden="true" />Unlocked</span>;
}

function DifficultyBadge({ difficulty }: { difficulty?: "Easy" | "Medium" | "Hard" }) {
  if (!difficulty) return null;
  const textClass = {
    Easy: "text-emerald-700",
    Medium: "text-amber-700",
    Hard: "text-rose-700",
  }[difficulty];
  return <span className={`text-xs font-semibold ${textClass}`}>{difficulty}</span>;
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
  const clamp = 160;
  const isLong = text.length > clamp;
  const shortText = isLong ? `${text.slice(0, clamp)}…` : text;

  return (
    <div className="mt-5 max-w-3xl">
      <p className="text-base leading-7 text-slate-600">{expanded ? text : shortText}</p>

      {expanded && (
        <div className="mt-5 grid gap-3 border-l-2 border-indigo-100 pl-4 text-sm leading-6 text-slate-600 sm:grid-cols-2">
          <p><strong className="font-semibold text-slate-800">Coverage:</strong> {examName} uses the current published test catalog and configured topic coverage.</p>
          <p><strong className="font-semibold text-slate-800">Formats:</strong> {[fullLengthCount > 0 && `${fullLengthCount} full length`, sectionalCount > 0 && `${sectionalCount} sectional`, topicWiseCount > 0 && `${topicWiseCount} topic wise`].filter(Boolean).join(", ") || "No published tests yet"}.</p>
          <p><strong className="font-semibold text-slate-800">Timing:</strong> Each published test uses its configured duration and section rules.</p>
          <p><strong className="font-semibold text-slate-800">Access:</strong> {freeCount} free test{freeCount !== 1 ? "s" : ""}{paidCount > 0 ? ` and ${paidCount} premium test${paidCount !== 1 ? "s" : ""}` : ""}.</p>
        </div>
      )}

      {(isLong || !expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 min-h-10 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        >
          {expanded ? "Show less" : "Series details"}
        </button>
      )}
    </div>
  );
}
