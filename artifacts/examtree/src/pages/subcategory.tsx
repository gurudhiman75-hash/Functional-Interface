import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
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
  Sparkles,
  Target,
} from "lucide-react";

import { CategoryIcon, isImageIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { useMyEntitlements } from "@/hooks/use-my-entitlements";
import { useToast } from "@/hooks/use-toast";
import { ApiError, getApiErrorCode } from "@/lib/api";
import {
  getPackages,
  getPackagesByExam,
  getUserPackages,
  mockUnlockTest,
  type Package,
  type Test,
} from "@/lib/data";
import { openRazorpayCheckoutForTest } from "@/lib/razorpay-checkout";
import { getActiveTestSessions, getAttempts, getUser } from "@/lib/storage";
import { getRuntimeExamGroup } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

type ExamTab = "full-length" | "sectional" | "topic-wise";

type ViewMode = "grid" | "list";

const TAB_LABELS: Record<ExamTab, string> = {
  "full-length": "Full Length",
  sectional: "Sectional",
  "topic-wise": "Topic Wise",
};

const TAB_DESCRIPTIONS: Record<ExamTab, string> = {
  "full-length": "Exam-like mocks covering the complete syllabus and configured timing.",
  sectional: "Focused practice for specific sections with targeted timing.",
  "topic-wise": "Topic-specific drills for revision and weak-area improvement.",
};

const CATEGORY_TONES: Record<string, { icon: string; eyebrow: string }> = {
  blue: { icon: "bg-[#eef3ff] text-[#5f63df]", eyebrow: "text-[#6657e8]" },
  emerald: { icon: "bg-[#eaf8f2] text-[#238a68]", eyebrow: "text-[#238a68]" },
  violet: { icon: "bg-[#f4edff] text-[#8259c8]", eyebrow: "text-[#7455c6]" },
  amber: { icon: "bg-[#fff5e6] text-[#c98228]", eyebrow: "text-[#b87524]" },
  orange: { icon: "bg-[#fff2e9] text-[#cf7330]", eyebrow: "text-[#c46b2c]" },
  rose: { icon: "bg-[#fff0f4] text-[#c75b78]", eyebrow: "text-[#bc526f]" },
  indigo: { icon: "bg-[#efefff] text-[#6159cf]", eyebrow: "text-[#6159cf]" },
  red: { icon: "bg-[#fff0f0] text-[#c95454]", eyebrow: "text-[#b94c4c]" },
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Number(value) || 0));
}

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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const exam = useMemo(
    () => (id ? getRuntimeExamGroup(id, categories, tests, subcategories) : null),
    [id, categories, subcategories, tests],
  );
  const category = categories.find((item) => item.id === exam?.categoryId);
  const examIcon = exam?.icon ?? category?.icon ?? "";
  const categoryTone = CATEGORY_TONES[category?.color ?? "blue"] ?? CATEGORY_TONES.blue;

  const attempts = useMemo(() => getAttempts(), []);
  const attemptsByTestId = useMemo(() => {
    const map = new Map<string, ReturnType<typeof getAttempts>[number]>();
    for (const attempt of attempts) {
      if (!map.has(attempt.testId)) map.set(attempt.testId, attempt);
    }
    return map;
  }, [attempts]);
  const activeSessions = useMemo(() => getActiveTestSessions(), []);
  const user = getUser();

  const { data: entitlementPayload, refetch: refetchEntitlements } = useMyEntitlements();
  const entitledIds = useMemo(() => new Set(entitlementPayload?.testIds ?? []), [entitlementPayload]);

  const { data: allPackages = [] } = useQuery<Package[]>({
    queryKey: ["packages"],
    queryFn: getPackages,
    staleTime: 5 * 60_000,
  });
  const { data: ownedPackages = [] } = useQuery<import("@/lib/data").UserPackage[]>({
    queryKey: ["user-packages"],
    queryFn: () => getUserPackages(),
    staleTime: 60_000,
    enabled: !!user,
  });
  const ownedPackageIds = useMemo(() => new Set(ownedPackages.map((pkg) => pkg.id)), [ownedPackages]);
  const packageByTestId = useMemo(() => {
    const map = new Map<string, Package>();
    for (const pkg of allPackages) {
      for (const item of pkg.tests ?? []) {
        const existing = map.get(item.testId);
        if (!existing || pkg.finalPriceCents < existing.finalPriceCents) map.set(item.testId, pkg);
      }
    }
    return map;
  }, [allPackages]);

  const { data: examPackages = [] } = useQuery({
    queryKey: ["packages-by-exam", id],
    queryFn: () => getPackagesByExam(id!),
    staleTime: 5 * 60_000,
    enabled: !!id,
  });

  const examTests = useMemo(() => {
    if (!exam) return [];
    const scoped = tests.filter((test) => {
      if (exam.id.startsWith("general-")) {
        return test.categoryId === exam.categoryId && !test.subcategoryId;
      }
      return test.subcategoryId === exam.id;
    });
    return sortTests(scoped, attemptsByTestId, activeSessions);
  }, [activeSessions, attemptsByTestId, exam, tests]);

  const tabTests = examTests.filter((test) => (test.kind ?? "full-length") === activeTab);
  const totalFree = examTests.filter((test) => (test.access ?? "free") === "free").length;
  const totalLocked = examTests.length - totalFree;
  const attemptedInExam = examTests.filter((test) => attemptsByTestId.has(test.id)).length;
  const activeInExam = examTests.filter((test) => Boolean(activeSessions[test.id])).length;
  const progress = examTests.length ? Math.round((attemptedInExam / examTests.length) * 100) : 0;

  const bestValueId = useMemo(() => {
    const candidates = examPackages.filter((pkg) => pkg.testIds.length > 0);
    if (!candidates.length) return null;
    return candidates.reduce((best, current) =>
      best.finalPriceCents / best.testIds.length <= current.finalPriceCents / current.testIds.length ? best : current,
    ).id;
  }, [examPackages]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-slate-950">Could not load exam</h1>
          <p className="mt-2 text-sm text-slate-500">The exam catalog is temporarily unavailable. Please try again.</p>
          <Button className="mt-5 min-h-11" variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading exam tests">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-6 h-56 rounded-2xl bg-slate-200" />
          <div className="mt-8 h-12 rounded-xl bg-slate-200" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-48 rounded-2xl bg-slate-200" />)}
          </div>
          <span className="sr-only">Loading published tests…</span>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">Exam not found</h1>
            <p className="mt-3 text-sm text-slate-500">This exam page is not available right now.</p>
            <Button className="mt-6 min-h-11 rounded-xl" onClick={() => setLocation("/exams")}>Back to Exams</Button>
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
          toast({ title: "Payment successful", description: `${testItem.name} is now unlocked on your account.` });
          setLocation(`/test/${testItem.id}?checkout=success`);
        },
        onError: (message) => {
          toast({ title: "Payment could not be verified", description: message, variant: "destructive" });
        },
      });
    } catch (checkoutError) {
      if (
        import.meta.env.DEV &&
        checkoutError instanceof ApiError &&
        getApiErrorCode(checkoutError.body) === "RAZORPAY_NOT_CONFIGURED"
      ) {
        await mockUnlockTest(testItem.id);
        await refetchEntitlements();
        await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
        await queryClient.invalidateQueries({ queryKey: ["user-packages"] });
        toast({ title: "Unlocked (development)", description: `${testItem.name} is available without Razorpay keys while you develop.` });
        return;
      }

      toast({
        title: "Could not start payment",
        description: checkoutError instanceof Error ? checkoutError.message : "Try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="sites-page-shell subcategory-page min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-8">
        <button
          type="button"
          onClick={() => setLocation(`/category/${exam.categoryId}`)}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"
          data-testid="btn-back-category"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {category?.name ?? "Back"}
        </button>

        <section className="mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(26,32,44,0.04)]" aria-labelledby="subcategory-title">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isImageIcon(examIcon) ? "border border-slate-200 bg-white text-slate-700" : categoryTone.icon}`}>
                  <CategoryIcon icon={examIcon} className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${categoryTone.eyebrow}`}>{category?.name ?? "Exam"}</p>
                  <h1 id="subcategory-title" className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl">{exam.name}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                    {exam.description || `Choose full-length, sectional or topic-wise practice for ${exam.name}.`}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 sm:max-w-xl">
                <StatCard label="Tests" value={formatCount(examTests.length)} />
                <StatCard label="Free" value={formatCount(totalFree)} valueClass="text-[#2d9b73]" />
                <StatCard label="Attempted" value={formatCount(attemptedInExam)} valueClass="text-[#6657e8]" />
              </div>

              {examTests.length > 0 ? (
                <div className="mt-6 max-w-xl">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Your progress</span>
                    <span className="text-slate-600">{attemptedInExam}/{examTests.length} attempted</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${exam.name} completion`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                    <span className="block h-full rounded-full bg-[#6657e8]" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-100 bg-[#17182c] p-6 text-white lg:border-l lg:border-t-0 lg:p-8">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8f84ff]">Exam snapshot</p>
              <div className="mt-5 space-y-4">
                <SnapshotRow icon={LayoutGrid} label="Full-length" value={exam.fullLengthCount} />
                <SnapshotRow icon={Target} label="Sectional" value={exam.sectionalCount} />
                <SnapshotRow icon={BookOpen} label="Topic-wise" value={exam.topicWiseCount} last />
              </div>
              {activeInExam > 0 ? (
                <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-xs text-white/65">
                  <span className="font-semibold text-white">{formatCount(activeInExam)}</span> test{activeInExam !== 1 ? "s" : ""} currently in progress on this device.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="test-formats-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6c5cf1]">Choose a format</p>
              <h2 id="test-formats-heading" className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-[28px]">Practice tests</h2>
              <p className="mt-2 text-sm text-slate-500">{TAB_DESCRIPTIONS[activeTab]}</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="Test layout">
              <ViewButton mode="grid" active={viewMode === "grid"} onClick={() => setViewMode("grid")} />
              <ViewButton mode="list" active={viewMode === "list"} onClick={() => setViewMode("list")} />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1" role="tablist" aria-label={`${exam.name} test format`}>
            {(Object.keys(TAB_LABELS) as ExamTab[]).map((tab) => {
              const count = examTests.filter((test) => (test.kind ?? "full-length") === tab).length;
              const selected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(tab)}
                  className={`min-h-11 rounded-lg px-2 text-xs font-semibold transition sm:text-sm ${selected ? "bg-[#6657e8] text-white shadow-sm" : "text-slate-500 hover:bg-[#f7f7ff] hover:text-slate-900"}`}
                >
                  {TAB_LABELS[tab]} <span className={selected ? "text-white/70" : "text-slate-400"}>({count})</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className={`mt-6 grid gap-6 ${examPackages.length > 0 ? "xl:grid-cols-[minmax(0,1fr)_300px]" : ""}`}>
          <section className="min-w-0" aria-label={`${TAB_LABELS[activeTab]} tests`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500">{formatCount(tabTests.length)} {TAB_LABELS[activeTab].toLowerCase()} test{tabTests.length !== 1 ? "s" : ""}</p>
              <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-[#2d9b73]" />{tabTests.filter((test) => (test.access ?? "free") === "free").length} free</span>
                <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3 text-[#b77b32]" />{tabTests.filter((test) => (test.access ?? "free") !== "free").length} locked</span>
              </div>
            </div>

            {tabTests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <BookOpen className="mx-auto h-9 w-9 text-slate-300" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-slate-500">No {TAB_LABELS[activeTab].toLowerCase()} tests are available yet.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2" data-testid="subcategory-test-grid">
                {tabTests.map((test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    latestAttempt={attemptsByTestId.get(test.id)}
                    activeSession={Boolean(activeSessions[test.id])}
                    entitledIds={entitledIds}
                    packageByTestId={packageByTestId}
                    ownedPackageIds={ownedPackageIds}
                    user={user}
                    onStart={() => setLocation(`/test/${test.id}`)}
                    onBuy={() => setLocation("/packages")}
                    onUnlock={() => user ? void startPaidCheckout(test) : setLocation("/login/student")}
                    onReview={(latestAttempt) => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(test.id)}&tab=review`)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3" data-testid="subcategory-test-list">
                {tabTests.map((test) => (
                  <TestRow
                    key={test.id}
                    test={test}
                    latestAttempt={attemptsByTestId.get(test.id)}
                    activeSession={Boolean(activeSessions[test.id])}
                    entitledIds={entitledIds}
                    packageByTestId={packageByTestId}
                    ownedPackageIds={ownedPackageIds}
                    user={user}
                    onStart={() => setLocation(`/test/${test.id}`)}
                    onBuy={() => setLocation("/packages")}
                    onUnlock={() => user ? void startPaidCheckout(test) : setLocation("/login/student")}
                    onReview={(latestAttempt) => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(test.id)}&tab=review`)}
                  />
                ))}
              </div>
            )}
          </section>

          {examPackages.length > 0 ? (
            <aside className="w-full" aria-label="Exam packages">
              <div className="sticky top-20 space-y-3">
                <div className="rounded-2xl bg-[#17182c] p-5 text-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8f84ff]">Exam access</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight">Unlock more tests</h2>
                  <p className="mt-2 text-xs leading-5 text-white/50">Choose from the currently published packages for this exam.</p>
                </div>

                {examPackages.map((pkg) => {
                  const owned = ownedPackageIds.has(pkg.id);
                  const isBestValue = pkg.id === bestValueId && examPackages.length > 1;
                  return (
                    <div key={pkg.id} className={`rounded-2xl border bg-white p-5 shadow-[0_5px_20px_rgba(26,32,44,0.035)] ${owned ? "border-[#6fbea0]" : isBestValue ? "border-[#aaa2f8]" : "border-slate-200"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {owned ? <PackageBadge tone="green">Purchased</PackageBadge> : isBestValue ? <PackageBadge tone="purple">Best value</PackageBadge> : null}
                          <h3 className="mt-2 text-sm font-semibold leading-5 text-slate-900">{pkg.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-semibold tracking-tight text-slate-950">₹{(pkg.finalPriceCents / 100).toFixed(0)}</div>
                          {pkg.originalPriceCents && pkg.originalPriceCents > pkg.finalPriceCents ? <div className="text-[10px] text-slate-400 line-through">₹{(pkg.originalPriceCents / 100).toFixed(0)}</div> : null}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#fafaff] px-3 py-3 text-xs">
                        <span className="text-slate-500">Published tests</span>
                        <span className="font-semibold text-slate-900">{formatCount(pkg.testIds.length)}</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={owned}
                        onClick={() => !owned && setLocation("/packages")}
                        className={`mt-4 min-h-11 w-full rounded-lg font-semibold ${owned ? "bg-[#2d9b73] hover:bg-[#2d9b73]" : "bg-[#6657e8] hover:bg-[#594bd9]"}`}
                      >
                        {owned ? "Purchased" : "View package"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </aside>
          ) : null}
        </div>

        <section className="mt-14 overflow-hidden rounded-2xl bg-[#17182c] text-white" aria-labelledby="exam-ready-heading">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)] lg:items-center lg:p-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8f84ff]">Before you start</p>
              <h2 id="exam-ready-heading" className="mt-3 max-w-xl text-2xl font-medium leading-tight tracking-[-0.04em] sm:text-3xl">Everything on this page comes from the live test catalogue.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Each published test uses its configured duration and section rules.</p>
            </div>
            <div className="rounded-2xl bg-white p-5 text-slate-950 shadow-xl sm:p-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400"><Sparkles className="h-4 w-4 text-[#6657e8]" />Test readiness</div>
              <div className="mt-5 space-y-4">
                <ReadinessItem title="Timing is test-specific" text="Duration is shown directly on every published test card." />
                <ReadinessItem title="Access is explicit" text={`${totalFree} free and ${totalLocked} locked tests are currently published for this exam.`} />
                <ReadinessItem title="Your attempts stay visible" text="Resume, retry and review actions appear only when the matching session or saved attempt exists." />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, valueClass = "text-slate-950" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-xl bg-[#fafaff] px-3 py-3 ring-1 ring-slate-100">
      <div className={`text-xl font-semibold tracking-tight ${valueClass}`}>{value}</div>
      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</div>
    </div>
  );
}

function SnapshotRow({ icon: Icon, label, value, last = false }: { icon: typeof LayoutGrid; label: string; value: number; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${last ? "" : "border-b border-white/[0.08] pb-4"}`}>
      <span className="flex items-center gap-2 text-xs text-white/60"><Icon className="h-4 w-4 text-[#8f84ff]" />{label}</span>
      <span className="text-lg font-semibold">{formatCount(value)}</span>
    </div>
  );
}

function ViewButton({ mode, active, onClick }: { mode: ViewMode; active: boolean; onClick: () => void }) {
  const Icon = mode === "grid" ? LayoutGrid : List;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${mode === "grid" ? "Grid" : "List"} view`}
      aria-pressed={active}
      className={`flex h-11 w-11 items-center justify-center rounded-lg transition ${active ? "bg-[#f0efff] text-[#6657e8]" : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

type SharedTestProps = {
  test: Test;
  latestAttempt: ReturnType<typeof getAttempts>[number] | undefined;
  activeSession: boolean;
  entitledIds: Set<string>;
  packageByTestId: Map<string, Package>;
  ownedPackageIds: Set<string>;
  user: ReturnType<typeof getUser>;
  onStart: () => void;
  onBuy: () => void;
  onUnlock: () => void;
  onReview: (attempt: ReturnType<typeof getAttempts>[number]) => void;
};

function resolveAccess(props: SharedTestProps) {
  const isFree = (props.test.access ?? "free") === "free";
  const hasEntitlement = props.entitledIds.has(props.test.id);
  const pkg = props.packageByTestId.get(props.test.id);
  const pkgOwned = pkg ? props.ownedPackageIds.has(pkg.id) : false;
  return { isFree, isLocked: !(isFree || hasEntitlement), pkg, pkgOwned };
}

function TestCard(props: SharedTestProps) {
  const { test, latestAttempt, activeSession, onStart, onBuy, onUnlock, onReview } = props;
  const { isFree, isLocked, pkg, pkgOwned } = resolveAccess(props);
  const attempted = Boolean(latestAttempt);

  return (
    <article className="group flex min-h-[205px] flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_5px_20px_rgba(26,32,44,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(26,32,44,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold leading-6 tracking-[-0.02em] text-slate-900">{test.name}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-slate-400" />{test.duration} min</span>
            <span className="inline-flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-slate-400" />{test.totalQuestions} Qs</span>
            <DifficultyBadge difficulty={test.difficulty} />
          </div>
        </div>
        <TestStatusBadge isFree={isFree} isLocked={isLocked} pkgOwned={pkgOwned} attempted={attempted} activeSession={activeSession} />
      </div>

      {latestAttempt ? (
        <div className="mt-4 rounded-xl bg-[#fafaff] px-3 py-2.5 text-[11px] text-slate-500">
          Last attempt {new Date(latestAttempt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          {latestAttempt.score != null ? <> · <span className="font-semibold text-slate-700">{latestAttempt.score}%</span></> : null}
        </div>
      ) : activeSession ? (
        <div className="mt-4 rounded-xl bg-[#eef7ff] px-3 py-2.5 text-[11px] font-semibold text-[#467aa7]">A saved session is ready to resume.</div>
      ) : null}

      <div className="mt-auto pt-5">
        <TestActionButton
          isLocked={isLocked}
          pkgOwned={pkgOwned}
          pkg={pkg}
          activeSession={activeSession}
          attempted={attempted}
          user={props.user}
          onStart={onStart}
          onBuy={onBuy}
          onUnlock={onUnlock}
          onReview={() => latestAttempt && onReview(latestAttempt)}
        />
      </div>
    </article>
  );
}

function TestRow(props: SharedTestProps) {
  const { test, latestAttempt, activeSession, onStart, onBuy, onUnlock, onReview } = props;
  const { isFree, isLocked, pkg, pkgOwned } = resolveAccess(props);
  const attempted = Boolean(latestAttempt);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(26,32,44,0.03)] sm:flex-row sm:items-center">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isLocked && !pkgOwned ? "bg-[#fff5e8] text-[#b77b32]" : attempted ? "bg-[#eef7ff] text-[#467aa7]" : "bg-[#edf9f4] text-[#2d9b73]"}`}>
        {isLocked && !pkgOwned ? <Lock className="h-4 w-4" /> : attempted ? <RotateCcw className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[16px] font-semibold text-slate-900">{test.name}</h3>
          <TestStatusBadge isFree={isFree} isLocked={isLocked} pkgOwned={pkgOwned} attempted={attempted} activeSession={activeSession} />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{test.duration} min</span>
          <span className="inline-flex items-center gap-1"><Hash className="h-3 w-3" />{test.totalQuestions} Qs</span>
          <DifficultyBadge difficulty={test.difficulty} />
          {latestAttempt ? <span>Last attempt {new Date(latestAttempt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span> : null}
        </div>
      </div>
      <div className="shrink-0">
        <TestActionButton
          isLocked={isLocked}
          pkgOwned={pkgOwned}
          pkg={pkg}
          activeSession={activeSession}
          attempted={attempted}
          user={props.user}
          onStart={onStart}
          onBuy={onBuy}
          onUnlock={onUnlock}
          onReview={() => latestAttempt && onReview(latestAttempt)}
        />
      </div>
    </article>
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
      return <Button size="sm" className="min-h-11 rounded-lg bg-[#4b8bbf] font-semibold text-white hover:bg-[#3f7aa9]" onClick={onStart}><Play className="mr-1.5 h-3.5 w-3.5" />Resume</Button>;
    }
    if (attempted) {
      return (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="min-h-11 rounded-lg border-slate-200 font-semibold" onClick={onStart}><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Retry</Button>
          <Button size="sm" variant="outline" className="min-h-11 rounded-lg border-[#d8d3ff] font-semibold text-[#6657e8] hover:bg-[#f7f6ff]" onClick={onReview}><BookOpen className="mr-1.5 h-3.5 w-3.5" />Review</Button>
        </div>
      );
    }
    return <Button size="sm" className="min-h-11 rounded-lg bg-[#6657e8] font-semibold hover:bg-[#594bd9]" onClick={onStart}>Start test<ChevronRight className="ml-1.5 h-3.5 w-3.5" /></Button>;
  }

  if (pkg) {
    return <Button size="sm" variant="outline" className="min-h-11 rounded-lg border-[#ead5b9] font-semibold text-[#9b6728] hover:bg-[#fff8ef]" onClick={onBuy}><Lock className="mr-1.5 h-3.5 w-3.5" />View package</Button>;
  }

  return (
    <Button size="sm" variant="outline" className="min-h-11 rounded-lg border-slate-200 font-semibold" onClick={onUnlock}>
      {user ? <><CreditCard className="mr-1.5 h-3.5 w-3.5" />Unlock</> : <><LogIn className="mr-1.5 h-3.5 w-3.5" />Sign in</>}
    </Button>
  );
}

function TestStatusBadge({ isFree, isLocked, pkgOwned, attempted, activeSession }: { isFree: boolean; isLocked: boolean; pkgOwned: boolean; attempted: boolean; activeSession: boolean }) {
  if (activeSession && !attempted) return <span className="rounded-full bg-[#eef7ff] px-2.5 py-1 text-[10px] font-bold text-[#467aa7]">In progress</span>;
  if (isLocked && !pkgOwned) return <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5e8] px-2.5 py-1 text-[10px] font-bold text-[#a66d29]"><Lock className="h-3 w-3" />Locked</span>;
  if (attempted) return <span className="inline-flex items-center gap-1 rounded-full bg-[#eef7ff] px-2.5 py-1 text-[10px] font-bold text-[#467aa7]"><RotateCcw className="h-3 w-3" />Attempted</span>;
  if (isFree) return <span className="inline-flex items-center gap-1 rounded-full bg-[#edf9f4] px-2.5 py-1 text-[10px] font-bold text-[#238a68]"><ShieldCheck className="h-3 w-3" />Free</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-[#f0efff] px-2.5 py-1 text-[10px] font-bold text-[#6657e8]"><ShieldCheck className="h-3 w-3" />Purchased</span>;
}

function DifficultyBadge({ difficulty }: { difficulty?: "Easy" | "Medium" | "Hard" }) {
  if (!difficulty) return null;
  const styles = {
    Easy: "bg-[#edf9f4] text-[#238a68]",
    Medium: "bg-[#fff5e8] text-[#a66d29]",
    Hard: "bg-[#fff0f4] text-[#b65370]",
  }[difficulty];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles}`}>{difficulty}</span>;
}

function PackageBadge({ tone, children }: { tone: "green" | "purple"; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] ${tone === "green" ? "bg-[#edf9f4] text-[#238a68]" : "bg-[#f0efff] text-[#6657e8]"}`}>{children}</span>;
}

function ReadinessItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2d9b73]" />
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs leading-5 text-slate-500">{text}</div>
      </div>
    </div>
  );
}
