import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock3,
  Crown,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Unlock,
} from "lucide-react";
import { getActiveTestSessions, getAttempts } from "@/lib/storage";
import { getRuntimeCategories, getRuntimeExamGroup, getRuntimeTests } from "@/lib/test-bank";
import { Navbar } from "@/components/Navbar";
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
  examTests: ReturnType<typeof getRuntimeTests>,
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
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ExamTab>("full-length");

  const attempts = useMemo(() => getAttempts(), []);
  const attemptsByTestId = useMemo(() => new Map(attempts.map((attempt) => [attempt.testId, attempt])), [attempts]);
  const activeSessions = useMemo(() => getActiveTestSessions(), []);
  const tests = useMemo(() => getRuntimeTests(), []);
  const exam = useMemo(() => (id ? getRuntimeExamGroup(id) : null), [id]);
  const categories = useMemo(() => getRuntimeCategories(), []);
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

  if (!exam) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
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

  const handleLockedClick = (testName: string) => {
    toast({
      title: "Paid exam",
      description: `${testName} is marked as paid. We can wire the purchase flow next.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),transparent_26%)]">
        <div className="absolute inset-0 -z-10 aurora-bg" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <button
            onClick={() => setLocation(`/category/${exam.categoryId}`)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="btn-back-category"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {category?.name ?? "category"}
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Exam Detail
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{exam.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {exam.description || `Browse ${exam.name} by full-length, sectional, and topic-wise practice.`}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.totalTests}</span>
                  total tests
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.fullLengthCount}</span>
                  full-length
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.sectionalCount}</span>
                  sectional
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exam.topicWiseCount}</span>
                  topic-wise
                </div>
              </div>
            </div>

            <div className={`glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${gradient} p-6 text-white shadow-[0_30px_90px_-45px_rgba(0,0,0,0.55)]`}>
              <div className="absolute inset-x-0 top-0 h-28 bg-white/10" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">Student view</p>
                    <h2 className="mt-2 text-2xl font-bold">{exam.name}</h2>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right">
                    <p className="text-xs text-white/70">Free now</p>
                    <p className="text-xl font-bold">{examTests.filter((test) => (test.access ?? "free") === "free").length}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <Unlock className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold">Free tests open instantly</p>
                    <p className="mt-1 text-sm text-white/75">Students can start unlocked mocks directly from the exam tabs.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold">Attempt-aware actions</p>
                    <p className="mt-1 text-sm text-white/75">Completed mocks show Retry and Solution instead of a generic CTA.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
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
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-white/15" : "bg-card"}`}>
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
            <p className="mt-2 text-sm text-muted-foreground">Add this test type from admin and it will show here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tabTests.map((test) => {
              const attempted = attemptsByTestId.has(test.id);
              const activeSession = activeSessions[test.id];
              const isFree = (test.access ?? "free") === "free";
              const isLocked = !isFree && !attempted && !activeSession;

              return (
                <article
                  key={test.id}
                  className={`rounded-[1.8rem] border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                    isLocked ? "border-amber-200 bg-amber-50/50" : "border-border/70 bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]">
                        {TAB_LABELS[activeTab]}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] ${
                          isFree ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isFree ? "Free" : "Paid"}
                      </Badge>
                      {attempted && (
                        <Badge variant="secondary" className="rounded-full border border-sky-200 bg-sky-50 text-[11px] text-sky-700">
                          Attempted
                        </Badge>
                      )}
                    </div>
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isLocked ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                      {isLocked ? <Crown className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-foreground">{test.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {isLocked
                      ? "Premium mock. Unlock this paper to access the complete attempt flow."
                      : "Ready to launch with attempt tracking, saved progress, retry, and solution review."}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="rounded-xl bg-muted/40 px-3 py-2">
                      <Clock3 className="mb-1 h-4 w-4 text-primary" />
                      {test.duration} min
                    </div>
                    <div className="rounded-xl bg-muted/40 px-3 py-2">
                      <BookOpen className="mb-1 h-4 w-4 text-secondary" />
                      {test.totalQuestions} questions
                    </div>
                    <div className="rounded-xl bg-muted/40 px-3 py-2">
                      <Target className="mb-1 h-4 w-4 text-amber-600" />
                      Avg {test.avgScore}%
                    </div>
                    <div className="rounded-xl bg-muted/40 px-3 py-2">
                      <Sparkles className="mb-1 h-4 w-4 text-emerald-600" />
                      {test.attempts.toLocaleString()} attempts
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {activeSession && (
                      <div className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
                        Saved progress is available. Resume from where you left off.
                      </div>
                    )}
                    {attempted && !activeSession && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                        This mock was already attempted. You can retry it or jump straight to the solution review.
                      </div>
                    )}
                    {isLocked && (
                      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-100/60 px-3 py-3 text-xs text-amber-800">
                        Locked premium test. Students should see this as paid until a purchase unlock is added.
                      </div>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                      {isLocked ? (
                        <>
                          <Button className="w-full rounded-xl" onClick={() => handleLockedClick(test.name)} data-testid={`btn-locked-${test.id}`}>
                            Locked
                            <Lock className="ml-2 h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" className="w-full rounded-xl bg-white/70" onClick={() => setLocation("/exams")}>
                            Browse Exams
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button className="w-full rounded-xl" onClick={() => setLocation(`/test/${test.id}`)} data-testid={`btn-start-${test.id}`}>
                            {activeSession ? "Resume" : attempted ? "Retry" : "Start"}
                            {activeSession ? <Play className="ml-2 h-4 w-4" /> : attempted ? <RotateCcw className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
                          </Button>
                          {attempted ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full rounded-xl bg-white/70"
                              onClick={() => setLocation(`/result?testId=${test.id}&tab=review`)}
                              data-testid={`btn-solution-${test.id}`}
                            >
                              Solution
                            </Button>
                          ) : (
                            <Button type="button" variant="outline" className="w-full rounded-xl bg-white/70" onClick={() => setLocation(`/category/${exam.categoryId}`)}>
                              More Exams
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
