import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type KeyboardEvent } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock3,
  CreditCard,
  Crown,
  Lock,
  LogIn,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Unlock,
} from "lucide-react";
import { getActiveTestSessions, getAttempts, getUser } from "@/lib/storage";
import { mockUnlockTest, type Test } from "@/lib/data";
import { openRazorpayCheckoutForTest } from "@/lib/razorpay-checkout";
import { getRuntimeExamGroup } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL, ApiError, getApiErrorCode } from "@/lib/api";
import { useMyEntitlements } from "@/hooks/use-my-entitlements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  blue: "from-sky-500 via-blue-500 to-indigo-500",
  emerald: "from-emerald-500 via-teal-500 to-cyan-500",
  violet: "from-violet-500 via-fuchsia-500 to-pink-500",
  amber: "from-amber-500 via-orange-500 to-rose-500",
  orange: "from-orange-500 via-amber-500 to-yellow-500",
  rose: "from-rose-500 via-pink-500 to-fuchsia-500",
  indigo: "from-indigo-500 via-blue-500 to-cyan-500",
  red: "from-red-500 via-rose-500 to-orange-500",
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

  const attempts = useMemo(() => getAttempts(), []);
  const attemptsByTestId = useMemo(() => new Map(attempts.map((attempt) => [attempt.testId, attempt])), [attempts]);
  const activeSessions = useMemo(() => getActiveTestSessions(), []);
  const { categories, tests, isLoading, error } = useExamCatalog();
  const { data: entitlementPayload, refetch: refetchEntitlements } = useMyEntitlements();
  const entitledIds = useMemo(
    () => new Set(entitlementPayload?.testIds ?? []),
    [entitlementPayload],
  );
  const user = getUser();
  const exam = useMemo(() => (id ? getRuntimeExamGroup(id, categories, tests) : null), [id, categories, tests]);
  const category = categories.find((item) => item.id === exam?.categoryId);
  const gradient = CATEGORY_STYLES[category?.color ?? "blue"] ?? CATEGORY_STYLES.blue;

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">Could not load exam</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            API expected at <code className="rounded bg-muted px-1 py-0.5 text-xs">{API_BASE_URL}</code>
          </p>
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
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
              Exam unavailable
            </Badge>
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

  return (
    <div className="min-h-screen bg-background">

      <section className="border-b border-border/70 bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <button
            onClick={() => setLocation(`/category/${exam.categoryId}`)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/5 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="btn-back-category"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {category?.name ?? "category"}
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 rounded-full border border-border/50 bg-muted/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Exam Detail
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{exam.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {exam.description || `Browse ${exam.name} by full-length, sectional, and topic-wise practice.`}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-border/50 bg-muted/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.totalTests}</span>
                  total tests
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.fullLengthCount}</span>
                  full-length
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.sectionalCount}</span>
                  sectional
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.topicWiseCount}</span>
                  topic-wise
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-6 text-foreground shadow-sm">
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">Student view</p>
                    <h2 className="mt-2 text-2xl font-bold">{exam.name}</h2>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/60 px-3 py-2 text-right">
                    <p className="text-xs text-muted-foreground">Free now</p>
                    <p className="text-xl font-bold text-foreground">{examTests.filter((test) => (test.access ?? "free") === "free").length}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-muted/75 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/65">
                      <Unlock className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold">Free tests open instantly</p>
                    <p className="mt-1 text-sm text-white/75">Students can start unlocked mocks directly from the exam tabs.</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/75 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/65">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold">Attempt-aware actions</p>
                    <p className="mt-1 text-sm text-white/75">Completed mocks show Retry and Solution instead of a generic CTA.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border/70 bg-muted/75 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">Catalog mix</p>
                      <p className="mt-1 text-sm text-white/80">Paid and free mocks are separated on each tab</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-300">{examTests.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[1.8rem] border border-border/70 bg-card p-3 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(TAB_LABELS) as ExamTab[]).map((tab) => {
              const count = examTests.filter((test) => (test.kind ?? "full-length") === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-[1.4rem] px-4 py-4 text-left transition-all ${
                    isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/35 text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{TAB_LABELS[tab]}</p>
                      <p className={`mt-1 text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {TAB_DESCRIPTIONS[tab]}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-card-15" : "bg-card"}`}>
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">{TAB_LABELS[activeTab]}</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{TAB_LABELS[activeTab]} tests in {exam.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{TAB_DESCRIPTIONS[activeTab]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              <Unlock className="h-4 w-4" />
              {freeCount} free
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700">
              <Lock className="h-4 w-4" />
              {paidCount} paid
            </span>
          </div>
        </div>

        {tabTests.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-border/70 bg-card/70 px-6 py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No {TAB_LABELS[activeTab].toLowerCase()} tests yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">More tests coming soon....</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tabTests.map((test) => {
              const attempted = attemptsByTestId.has(test.id);
              const activeSession = activeSessions[test.id];
              const isFree = (test.access ?? "free") === "free";
              const hasEntitlement = entitledIds.has(test.id);
              const hasAccess = isFree || hasEntitlement;
              const isLocked = !hasAccess;

              const openTest = () => setLocation(`/test/${test.id}`);
              const onCardActivate = () => {
                if (isLocked) void startPaidCheckout(test);
                else openTest();
              };
              const onCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onCardActivate();
                }
              };

              return (
                <div
                  key={test.id}
                  role="button"
                  tabIndex={0}
                  onClick={onCardActivate}
                  onKeyDown={onCardKeyDown}
                  aria-label={
                    isLocked
                      ? `${test.name}, premium test. Press Enter to ${user ? "open checkout" : "sign in and unlock"}.`
                      : `${test.name}. Press Enter to ${activeSession ? "resume" : attempted ? "retry" : "start"}.`
                  }
                  className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.85rem] border p-6 pl-7 shadow-sm ring-offset-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgba(59,130,246,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isLocked
                      ? "border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-card dark:from-amber-950/20"
                      : "border-border/60 bg-card hover:border-primary/20"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${gradient} opacity-90 transition-all group-hover:w-2`}
                    aria-hidden
                  />
                  <div className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full bg-primary/[0.05] blur-2xl" aria-hidden />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full border border-border/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
                        {TAB_LABELS[activeTab]}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                          isFree ? "border border-emerald-200/80 bg-emerald-50 text-emerald-800" : "border border-amber-200/80 bg-amber-50 text-amber-900"
                        }`}
                      >
                        {isFree ? "Free" : "Paid"}
                      </Badge>
                      {attempted && (
                        <Badge variant="secondary" className="rounded-full border border-sky-200/80 bg-sky-50 text-[11px] font-semibold text-sky-800">
                          Attempted
                        </Badge>
                      )}
                    </div>
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner ring-1 transition-transform duration-300 group-hover:scale-105 ${
                        isLocked ? "bg-amber-100 text-amber-700 ring-amber-200/50" : "bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-primary/10"
                      }`}
                    >
                      {isLocked ? <Crown className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    </div>
                  </div>

                  <h3 className="relative mt-4 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">{test.name}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {isLocked
                      ? "Premium mock. Unlock this paper to access the complete attempt flow."
                      : "Tap anywhere on this card to start, or use the shortcuts below for solution and browsing."}
                  </p>

                  <div className="relative mt-5 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 rounded-xl border border-border/35 bg-muted/25 px-3 py-2.5">
                      <Clock3 className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        <span className="font-semibold text-foreground">{test.duration}</span> min
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-border/35 bg-muted/25 px-3 py-2.5">
                      <BookOpen className="h-4 w-4 shrink-0 text-secondary" />
                      <span>
                        <span className="font-semibold text-foreground">{test.totalQuestions}</span> Qs
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-border/35 bg-muted/25 px-3 py-2.5">
                      <Target className="h-4 w-4 shrink-0 text-amber-600" />
                      <span>
                        Avg <span className="font-semibold text-foreground">{test.avgScore}%</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-border/35 bg-muted/25 px-3 py-2.5">
                      <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="font-semibold text-foreground">{test.attempts.toLocaleString()}</span>
                      <span className="text-muted-foreground">attempts</span>
                    </div>
                  </div>

                  <div className="relative mt-5 space-y-3">
                    {activeSession && (
                      <div className="rounded-2xl border border-sky-200/80 bg-sky-50 px-3 py-2 text-xs text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
                        Saved progress — resume from where you left off.
                      </div>
                    )}
                    {attempted && !activeSession && (
                      <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                        Completed before — retry or open the solution walkthrough.
                      </div>
                    )}
                    {isLocked && (
                      <div className="rounded-2xl border border-dashed border-amber-300/90 bg-amber-100/50 px-3 py-3 text-xs text-amber-950 dark:bg-amber-950/25 dark:text-amber-100">
                        {user
                          ? "One-time purchase unlocks this mock on your account (start, resume, and retry)."
                          : "Sign in with Google, then complete checkout to unlock this premium mock."}
                      </div>
                    )}

                    <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/[0.04] px-4 py-3 text-center text-sm font-semibold text-primary">
                      {isLocked
                        ? user
                          ? "Tap card to open secure checkout"
                          : "Tap card to sign in and unlock"
                        : activeSession
                          ? "Tap card to resume"
                          : attempted
                            ? "Tap card to retry"
                            : "Tap card to start"}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2" onClick={(event) => event.stopPropagation()}>
                      {isLocked ? (
                        <>
                          <Button
                            className="w-full rounded-xl"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (!user) setLocation("/login/student");
                              else void startPaidCheckout(test);
                            }}
                            data-testid={`btn-unlock-${test.id}`}
                          >
                            {!user ? (
                              <>
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign in to unlock
                              </>
                            ) : (
                              <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Unlock
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-xl bg-background/80"
                            onClick={(event) => {
                              event.stopPropagation();
                              setLocation("/exams");
                            }}
                          >
                            Browse Exams
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="w-full rounded-xl"
                            onClick={(event) => {
                              event.stopPropagation();
                              openTest();
                            }}
                            data-testid={`btn-start-${test.id}`}
                          >
                            {activeSession ? "Resume" : attempted ? "Retry" : "Start"}
                            {activeSession ? (
                              <Play className="ml-2 h-4 w-4" />
                            ) : attempted ? (
                              <RotateCcw className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronRight className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                          {attempted ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full rounded-xl bg-background/80"
                              onClick={(event) => {
                                event.stopPropagation();
                                setLocation(`/result?testId=${test.id}&tab=review`);
                              }}
                              data-testid={`btn-solution-${test.id}`}
                            >
                              Solution
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full rounded-xl bg-background/80"
                              onClick={(event) => {
                                event.stopPropagation();
                                setLocation(`/category/${exam.categoryId}`);
                              }}
                            >
                              More Exams
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
