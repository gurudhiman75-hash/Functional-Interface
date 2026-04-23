import { useMemo } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  Clock3,
  CheckCircle2,
  FileQuestion,
  Timer,
  Shield,
  LineChart,
  HelpCircle,
  Flame,
  Play,
  Zap,
  RefreshCcw,
  Brain,
  Trophy,
  CalendarCheck,
  SlidersHorizontal,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";
import { getUser } from "@/lib/storage";
import { getAttempts, getActiveTestSessions, getStreak } from "@/lib/storage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CATEGORY_STYLES: Record<string, string> = {
  blue: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  emerald: "linear-gradient(135deg,#10b981,#047857)",
  violet: "linear-gradient(135deg,#8b5cf6,#5b21b6)",
  amber: "linear-gradient(135deg,#f59e0b,#d97706)",
  orange: "linear-gradient(135deg,#f97316,#ea580c)",
  rose: "linear-gradient(135deg,#f43f5e,#e11d48)",
  indigo: "linear-gradient(135deg,#6366f1,#4338ca)",
  red: "linear-gradient(135deg,#ef4444,#dc2626)",
};

const FAQ_ITEMS = [
  {
    q: "Is EXAMTREE free to use?",
    a: "Many mocks are free to practice. Some tests may be marked as paid ",
  },
  {
    q: "Do I need to create an account?",
    a: "To attempt tests and save progress on this device, sign in with Google or use the development login when Firebase is not configured.",
  },
  {
    q: "Can I pause a test?",
    a: "Yes. Your attempt is saved automatically if you leave mid-test, and you can resume from where you left off whenever you want.",
  },
  {
    q: "Where do I see solutions?",
    a: "After you submit, open the result screen and switch to the review tab for per-question explanations when available.",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const attempts = getAttempts();
  const activeSessionsCount = Object.keys(getActiveTestSessions()).length;
  const streak = getStreak();
  const { categories, tests, isLoading, error } = useExamCatalog();

  const totalQuestions = tests.reduce((sum, test) => sum + test.totalQuestions, 0);

  const topCategory = useMemo(() => {
    if (categories.length === 0) return null;
    return [...categories].sort((a, b) => (b.testsCount ?? 0) - (a.testsCount ?? 0))[0];
  }, [categories]);

  const featuredTests = useMemo(() => {
    return [...tests]
      .sort((a, b) => {
        const af = (a.access ?? "free") === "free" ? 0 : 1;
        const bf = (b.access ?? "free") === "free" ? 0 : 1;
        if (af !== bf) return af - bf;
        return (b.attempts ?? 0) - (a.attempts ?? 0);
      })
      .slice(0, 4);
  }, [tests]);

  const latestAttempt = attempts[0] ?? null;
  const latestAttemptTest = latestAttempt
    ? tests.find((test) => test.id === latestAttempt.testId) ?? null
    : null;

  const totalAttempts = attempts.length;

  const accuracy = useMemo(() => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((s, a) => s + (a.correct + a.wrong), 0);
    const correct = attempts.reduce((s, a) => s + a.correct, 0);
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [attempts]);

  const weakAreas = useMemo(() => {
    const sectionMap: Record<string, { correct: number; total: number }> = {};
    for (const a of attempts) {
      if (!a.sectionStats) continue;
      for (const sec of a.sectionStats) {
        if (!sectionMap[sec.name]) sectionMap[sec.name] = { correct: 0, total: 0 };
        sectionMap[sec.name].correct += sec.correct ?? 0;
        sectionMap[sec.name].total += sec.totalQuestions ?? 0;
      }
    }
    return Object.entries(sectionMap)
      .map(([name, { correct, total }]) => ({
        name,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      }))
      .filter((s) => s.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 4);
  }, [attempts]);

  const recentTests = attempts.slice(0, 3);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">Could not load the Exams</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Start the API server and check{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">{API_BASE_URL}</code>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">{error.message}</p>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-14 w-2/3 max-w-md rounded-2xl bg-muted" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-36 rounded-3xl bg-muted" />
              <div className="h-36 rounded-3xl bg-muted" />
              <div className="h-36 rounded-3xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Logged-in: Dashboard ──────────────────────────────────────────────────
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">

        {/* Greeting header */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Welcome back</p>
                <h1 className="mt-0.5 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {user.name?.split(" ")[0] ?? "Student"} 👋
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {totalAttempts === 0
                    ? "You haven't attempted any tests yet. Start below!"
                    : `${totalAttempts} test${totalAttempts !== 1 ? "s" : ""} completed · ${accuracy}% accuracy`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {streak.currentStreak > 0 && (
                  <div className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-2 text-sm font-semibold text-orange-700">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {streak.currentStreak} day streak
                  </div>
                )}
                <Button className="rounded-xl" onClick={() => setLocation("/exams")} data-testid="btn-browse-exams">
                  Browse Exams
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">

          {/* Resume test */}
          {latestAttemptTest && latestAttempt && (
            <div className="overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50 shadow-sm">
              <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-indigo-500" />
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
                    <RefreshCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-sky-600">Last Attempt</p>
                    <p className="mt-0.5 text-base font-bold text-slate-800 leading-snug line-clamp-1">{latestAttemptTest.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Score: <span className="font-semibold text-slate-700">{latestAttempt.score}%</span>
                      {" "}· {latestAttempt.correct} correct · {latestAttempt.wrong} wrong
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    className="rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50"
                    onClick={() => setLocation(`/result?testId=${latestAttemptTest.id}&tab=review`)}
                  >
                    Review
                  </Button>
                  <Button
                    className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
                    onClick={() => setLocation(`/test/${latestAttemptTest.id}`)}
                  >
                    <Play className="mr-1.5 h-4 w-4" />
                    Retake
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Tests Completed", value: totalAttempts, icon: BadgeCheck, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
              { label: "Accuracy", value: `${accuracy}%`, icon: Target, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
              { label: "Day Streak", value: streak.currentStreak, icon: Flame, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
              { label: "Active Sessions", value: activeSessionsCount, icon: Timer, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
            ].map(({ label, value, icon: Icon, color, bg, border }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} p-4 shadow-sm`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className={`mt-3 text-2xl font-black tabular-nums ${color}`}>{value}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Quick practice */}
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">Quick Practice</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "10 Questions", sub: "~10 min warm-up", icon: Zap, gradient: "from-amber-400 to-orange-500" },
                { label: "25 Questions", sub: "~25 min session", icon: Brain, gradient: "from-violet-500 to-purple-600" },
                { label: "Full Mock", sub: "Complete paper", icon: GraduationCap, gradient: "from-sky-500 to-blue-600" },
                { label: "Daily Quiz", sub: "Today's challenge", icon: CalendarCheck, gradient: "from-emerald-500 to-teal-600" },
              ].map((mode) => (
                <button
                  key={mode.label}
                  type="button"
                  onClick={() => setLocation("/exams")}
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md text-left"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${mode.gradient} text-white shadow-sm transition-transform group-hover:scale-110`}>
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{mode.label}</p>
                    <p className="text-xs text-muted-foreground">{mode.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exam categories */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Exam Categories</h2>
              <button
                type="button"
                onClick={() => setLocation("/exams")}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((cat) => {
                const gradient = CATEGORY_STYLES[cat.color] ?? CATEGORY_STYLES.blue;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setLocation(`/category/${cat.id}`)}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] text-left"
                    data-testid={`category-card-${cat.id}`}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundImage: gradient }}
                    >
                      <CategoryIcon icon={cat.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 leading-snug">{cat.name}</p>
                      <p className="text-xs text-slate-500">{cat.testsCount} tests</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weak areas + Recent tests side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weak areas */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                </div>
                <h3 className="font-bold text-foreground">Weak Areas</h3>
              </div>
              {weakAreas.length === 0 ? (
                <div className="rounded-xl bg-muted/40 p-6 text-center">
                  <Trophy className="mx-auto h-8 w-8 text-amber-400" />
                  <p className="mt-2 text-sm font-medium text-foreground">No weak areas yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Attempt more tests to see your weak sections</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weakAreas.map((area) => (
                    <div key={area.name} className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-medium text-foreground truncate">{area.name}</span>
                          <span className="ml-2 shrink-0 font-semibold text-red-600">{area.accuracy}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-red-400 to-rose-500"
                            style={{ width: `${area.accuracy}%` }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLocation("/exams")}
                        className="shrink-0 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/5"
                      >
                        Practice
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent tests */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Clock3 className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Recent Tests</h3>
                </div>
                {attempts.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setLocation("/performance")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    See all
                  </button>
                )}
              </div>
              {recentTests.length === 0 ? (
                <div className="rounded-xl bg-muted/40 p-6 text-center">
                  <FileQuestion className="mx-auto h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm font-medium text-foreground">No tests yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Attempt a test to see your history here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTests.map((a, i) => (
                    <button
                      key={a.id ?? i}
                      type="button"
                      onClick={() => setLocation(`/result?testId=${a.testId}&tab=summary`)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {a.score}%
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{a.testName}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.correct}✓ · {a.wrong}✗ · {a.unanswered} skipped
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Practice modes */}
          <div>
            <h2 className="mb-3 text-lg font-bold text-foreground">Practice Modes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Topic-wise", desc: "Focus on one concept at a time", icon: BookOpen, gradient: "from-blue-500 to-indigo-600" },
                { title: "Sectional", desc: "Practice a single section only", icon: SlidersHorizontal, gradient: "from-violet-500 to-purple-600" },
                { title: "Full Mock", desc: "Simulate the full exam experience", icon: GraduationCap, gradient: "from-emerald-500 to-teal-600" },
                { title: "Daily Quiz", desc: "Fresh questions every day", icon: CalendarCheck, gradient: "from-amber-500 to-orange-600" },
              ].map((mode) => (
                <button
                  key={mode.title}
                  type="button"
                  onClick={() => setLocation("/exams")}
                  className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] overflow-hidden relative"
                >
                  <div className={`absolute right-0 top-0 h-20 w-20 rounded-full bg-gradient-to-br ${mode.gradient} opacity-5 -translate-y-6 translate-x-6`} />
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${mode.gradient} text-white shadow-sm transition-transform group-hover:scale-105`}>
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-bold text-foreground">{mode.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{mode.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                    Start <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-border bg-card/50 py-6">
          <p className="text-center text-xs text-muted-foreground">© 2026 EXAMTREE · Content for practice only.</p>
        </footer>
      </div>
    );
  }

  // ── Logged-out: Landing Page ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-sky-500/5 to-violet-500/8" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-16 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-violet-500/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm"
            >
              <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-amber-500" />
              {tests.length} mocks · {categories.length} categories · {totalQuestions.toLocaleString()}+ questions
            </Badge>

            <h1
              className="text-balance text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.05]"
              data-testid="hero-title"
            >
              Crack SSC, Banking &{" "}
              <span className="bg-gradient-to-r from-primary via-sky-500 to-violet-600 bg-clip-text text-transparent">
                Punjab Exams
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Full-length mocks, topic-wise practice, and instant analysis — designed to match the real exam experience for SSC, Banking, PSTET, PPSC, and more.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-12 rounded-xl px-8 text-base shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                onClick={() => setLocation("/exams")}
                data-testid="btn-start-test"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Free Test
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-border bg-card/80 px-8 text-base backdrop-blur-sm"
                onClick={() => setLocation("/login/student")}
                data-testid="btn-google-login"
              >
                Continue with Google
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              No credit card required · Free forever for free tests
            </p>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border">
            {[
              { label: "Categories", value: String(categories.length), icon: BookOpen },
              { label: "Full Mocks", value: String(tests.length), icon: FileQuestion },
              { label: "Questions", value: totalQuestions > 0 ? `${(totalQuestions / 1000).toFixed(1)}k+` : "1k+", icon: LineChart },
              { label: "Free Tests", value: String(tests.filter((t) => (t.access ?? "free") === "free").length), icon: Shield },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-1 px-2 py-2 text-center sm:py-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-bold tabular-nums text-foreground sm:text-xl">{value}</p>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-border/60 bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Everything you need to score higher</h2>
            <p className="mt-3 text-muted-foreground">Built around the way top scorers actually prepare.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Target,
                title: "Topic-wise Practice",
                desc: "Drill any topic in isolation — build strong foundations before attempting full mocks.",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: GraduationCap,
                title: "Full-Length Mock Tests",
                desc: "Simulate real exam conditions with timed papers, section tabs, and an answer palette.",
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                icon: BarChart3,
                title: "Smart Analysis",
                desc: "Instant score breakdown, section-wise accuracy, and time-per-question insights.",
                gradient: "from-violet-500 to-purple-600",
              },
              {
                icon: Brain,
                title: "Weak Area Tracking",
                desc: "The system spots your weakest sections and surfaces them so you focus where it matters.",
                gradient: "from-amber-500 to-orange-600",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-sm transition-transform group-hover:scale-105`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exams covered ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Exams we cover</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              From central government to state-level — pick your exam and dive straight into practice.
            </p>
          </div>

          <div className={topCategory ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
            {topCategory && (
              <button
                type="button"
                onClick={() => setLocation(`/category/${topCategory.id}`)}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:col-span-2 lg:row-span-2 lg:col-span-1"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-primary/8 opacity-70" />
                <Badge className="relative rounded-lg bg-primary/15 text-primary hover:bg-primary/20">Top Category</Badge>
                <h3 className="relative mt-4 text-2xl font-black text-foreground">{topCategory.name}</h3>
                <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{topCategory.description}</p>
                <div className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
                  {topCategory.testsCount} tests available
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            )}

            {categories
              .filter((c) => !topCategory || c.id !== topCategory.id)
              .slice(0, topCategory ? 4 : 8)
              .map((cat) => {
                const gradient = CATEGORY_STYLES[cat.color] ?? CATEGORY_STYLES.blue;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setLocation(`/category/${cat.id}`)}
                    className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)] overflow-hidden relative"
                    data-testid={`category-card-${cat.id}`}
                  >
                    <div className="h-1 w-full rounded-full mb-4" style={{ backgroundImage: gradient }} />
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                      style={{ backgroundImage: gradient }}
                    >
                      {cat.color === "emerald" ? (
                        <Heart className="h-5 w-5" />
                      ) : cat.color === "violet" ? (
                        <BarChart3 className="h-5 w-5" />
                      ) : (
                        <Cpu className="h-5 w-5" />
                      )}
                    </div>
                    <h3 className="mt-3 font-bold text-slate-800">{cat.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{cat.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">{cat.testsCount} mocks</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </button>
                );
              })}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-xl" onClick={() => setLocation("/exams")} data-testid="btn-view-all-tests">
              Browse all exams
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-border/60 bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Simple as 1 – 2 – 3</h2>
            <p className="mt-3 text-muted-foreground">No complicated setup. Just pick and start.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Pick your exam", desc: "Choose from SSC, Banking, Punjab state exams, and more.", icon: Target },
              { step: "02", title: "Attempt under time", desc: "Timer, palette, and section tabs mirror the real console.", icon: Timer },
              { step: "03", title: "Review & improve", desc: "Score breakdown, flagged questions, and history in one view.", icon: TrendingUp },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-xs font-black tabular-nums text-primary">{item.step}</span>
                <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular mocks ── */}
      {featuredTests.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Popular mocks</h2>
                <p className="mt-1 text-muted-foreground">Start with tests other students attempt most often.</p>
              </div>
              <Button variant="outline" className="w-fit rounded-xl" onClick={() => setLocation("/exams")}>
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredTests.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLocation(`/test/${t.id}`)}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="rounded-lg text-[10px] uppercase tracking-wider">
                      {(t.access ?? "free") === "free" ? "Free" : "Pro"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{t.difficulty}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                    {t.name}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Timer className="h-3.5 w-3.5" />{t.duration} min</span>
                    <span className="inline-flex items-center gap-1"><FileQuestion className="h-3.5 w-3.5" />{t.totalQuestions} Q</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="border-t border-border/60 bg-muted/25 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-black text-foreground">FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-card px-4">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border-border/80">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-sky-500 to-violet-600 p-10 text-center shadow-xl sm:p-16">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            </div>
            <Badge className="relative mb-4 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Award className="mr-1.5 inline h-3.5 w-3.5" />
              Free to start — no card required
            </Badge>
            <h2 className="relative text-3xl font-black tracking-tight text-white sm:text-4xl">
              Start your first mock test today
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-white/80">
              Join thousands of students preparing for SSC, Banking, and Punjab state exams with focused practice.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-transform hover:scale-[1.02]"
                onClick={() => setLocation("/login/student")}
                data-testid="btn-cta-login"
              >
                Create free account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/40 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                onClick={() => setLocation("/exams")}
              >
                Browse as guest
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-bold text-foreground">EXAMTREE</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">Mock tests and review for competitive exams—clear flow, honest progress.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="font-semibold text-foreground">Product</p>
              <button type="button" className="mt-2 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/exams")}>Catalog</button>
              <button type="button" className="mt-1 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/dashboard")}>Dashboard</button>
            </div>
            <div>
              <p className="font-semibold text-foreground">Account</p>
              <button type="button" className="mt-2 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/login/student")}>Sign in</button>
              <button type="button" className="mt-1 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/packages")}>Packages</button>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-semibold text-foreground">Note</p>
              <p className="mt-2 text-muted-foreground">Content is for practice only; always follow your official exam guidelines.</p>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">© 2026 EXAMTREE</p>
      </footer>
    </div>
  );
}
