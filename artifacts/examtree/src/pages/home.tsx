import { useMemo } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  Cpu,
  Heart,
  BarChart3,
  Sparkles,
  Clock3,
  CheckCircle2,
  FileQuestion,
  Timer,
  Shield,
  LineChart,
  HelpCircle,
} from "lucide-react";
import { getUser } from "@/lib/storage";
import { getAttempts, getActiveTestSessions } from "@/lib/storage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CATEGORY_ACCENT: Record<string, { gradient: string; ring: string }> = {
  blue: { gradient: "from-sky-500 to-blue-600", ring: "ring-blue-500/20" },
  emerald: { gradient: "from-emerald-500 to-teal-600", ring: "ring-emerald-500/20" },
  violet: { gradient: "from-violet-500 to-indigo-600", ring: "ring-violet-500/20" },
  amber: { gradient: "from-amber-500 to-orange-600", ring: "ring-amber-500/20" },
  orange: { gradient: "from-orange-500 to-rose-500", ring: "ring-orange-500/20" },
  rose: { gradient: "from-rose-500 to-pink-600", ring: "ring-rose-500/20" },
  indigo: { gradient: "from-indigo-500 to-blue-600", ring: "ring-indigo-500/20" },
  red: { gradient: "from-red-500 to-rose-600", ring: "ring-red-500/20" },
};

function categoryAccent(color: string) {
  return CATEGORY_ACCENT[color] ?? CATEGORY_ACCENT.blue;
}

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
  const { categories, tests, isLoading, error } = useExamCatalog();

  const totalQuestions = tests.reduce((sum, test) => sum + test.totalQuestions, 0);
  const averageScore =
    tests.length > 0
      ? Math.round(tests.reduce((sum, test) => sum + test.avgScore, 0) / tests.length)
      : 0;

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

  const handleStartTest = () => {
    if (user) {
      setLocation("/exams");
    } else {
      setLocation("/login/student");
    }
  };

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

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative border-b border-border/60 bg-gradient-to-b from-muted/50 via-background to-background">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 top-32 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium shadow-sm"
            >
              <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-amber-500" />
              {tests.length} mocks · {categories.length} exam categories · {totalQuestions}+ questions
            </Badge>
            <h1
              className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
              data-testid="hero-title"
            >
              Mock tests that feel like the{" "}
              <span className="bg-gradient-to-r from-primary via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                real exam hall
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Timed papers, section-wise flow, instant scoring, and solution review—built for JEE, NEET, banking,
              state exams, and more in one focused workspace.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-12 rounded-xl px-8 text-base shadow-lg shadow-primary/25"
                onClick={handleStartTest}
                data-testid="btn-start-test"
              >
                {user ? "Continue practice" : "Start practicing free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-border bg-card px-8 text-base"
                onClick={() => setLocation("/exams")}
                data-testid="btn-browse-home-tests"
              >
                Browse All Exams
              </Button>
              {latestAttemptTest ? (
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 rounded-xl px-6"
                  onClick={() => setLocation(`/result?testId=${latestAttemptTest.id}&tab=review`)}
                  data-testid="btn-latest-solution"
                >
                  Review your last attempt
                </Button>
              ) : null}
            </div>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border">
            {[
              { label: "Categories", value: String(categories.length), icon: BookOpen },
              { label: "Full mocks", value: String(tests.length), icon: FileQuestion },
              { label: "Avg. difficulty mix", value: averageScore > 0 ? `${averageScore}% avg` : "Curated", icon: LineChart },
              { label: "Saved sessions", value: activeSessionsCount > 0 ? String(activeSessionsCount) : "—", icon: Clock3 },
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

      {/* How it works */}
      <section className="border-b border-border/60 bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How it works</h2>
            <p className="mt-2 text-muted-foreground">Same rhythm as leading test-prep platforms—minimal friction.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Pick your exam",
                desc: "Choose a category and mock—full-length, sectional, or topic-wise where available.",
                icon: Target,
              },
              {
                step: "02",
                title: "Attempt under time",
                desc: "Timer, palette, and section tabs mirror real online exam consoles.",
                icon: Timer,
              },
              {
                step: "03",
                title: "Review & improve",
                desc: "See score breakdown, revisit flagged questions, and track history on your dashboard.",
                icon: TrendingUp,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-xs font-bold tabular-nums text-primary">{item.step}</span>
                <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular mocks */}
      {featuredTests.length > 0 ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Popular mocks</h2>
                <p className="mt-1 text-muted-foreground">Start with tests other students attempt most often.</p>
              </div>
              <Button variant="outline" className="w-fit rounded-xl" onClick={() => setLocation("/exams")}>
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredTests.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setLocation(`/test/${t.id}`)}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
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
                    <span className="inline-flex items-center gap-1">
                      <Timer className="h-3.5 w-3.5" />
                      {t.duration} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FileQuestion className="h-3.5 w-3.5" />
                      {t.totalQuestions} Q
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Bento categories */}
      <section className="border-t border-border/60 bg-muted/20 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Explore by exam</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Jump into the category you are preparing for—each hub lists mocks and tracks.
            </p>
          </div>

          <div
            className={
              topCategory
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            }
          >
            {topCategory ? (
              <button
                type="button"
                onClick={() => setLocation(`/category/${topCategory.id}`)}
                className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-left shadow-sm ring-1 transition-all hover:shadow-lg sm:col-span-2 lg:row-span-2 lg:col-span-1 ${categoryAccent(topCategory.color).ring}`}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 opacity-70"
                />
                <Badge className="relative rounded-lg bg-primary/15 text-primary hover:bg-primary/20">Top pick</Badge>
                <h3 className="relative mt-4 text-2xl font-bold text-foreground">{topCategory.name}</h3>
                <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {topCategory.description}
                </p>
                <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                  {topCategory.testsCount} tests
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ) : null}

            {categories
              .filter((c) => !topCategory || c.id !== topCategory.id)
              .slice(0, topCategory ? 4 : 8)
              .map((cat) => {
                const acc = categoryAccent(cat.color);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setLocation(`/category/${cat.id}`)}
                    className="flex flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                    data-testid={`category-card-${cat.id}`}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm"
                    >
                      {cat.color === "emerald" ? (
                        <Heart className="h-5 w-5" />
                      ) : cat.color === "violet" ? (
                        <BarChart3 className="h-5 w-5" />
                      ) : (
                        <Cpu className="h-5 w-5" />
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-foreground">{cat.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{cat.description}</p>
                    <span className="mt-3 text-xs font-medium text-primary">{cat.testsCount} mocks</span>
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

      {/* Features */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Built for serious prep</h2>
            <p className="mt-2 text-muted-foreground">Features you will recognize from top mock-test experiences.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, title: "Instant results", desc: "Score and breakdown as soon as you submit." },
              { icon: Award, title: "Rank-ready practice", desc: "Structured attempts you can repeat to improve." },
              { icon: Shield, title: "Session safety", desc: "Autosave while you attempt (signed-in sessions)." },
              { icon: Target, title: "Section focus", desc: "Tabs and timing that respect multi-section papers." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/60 bg-muted/25 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">FAQ</h2>
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

      {/* CTA */}
      {!user ? (
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center shadow-sm sm:p-14">
              <div className="pointer-events-none absolute inset-0 bg-primary/5" />
              <h2 className="relative text-2xl font-bold text-foreground sm:text-3xl">Start your next mock today</h2>
              <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
                Sign in to sync attempts, or browse all exams and pick a free test to try first.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="h-12 rounded-xl px-8" onClick={() => setLocation("/login/student")} data-testid="btn-cta-login">
                  Create free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-xl border-border bg-background/80 px-8" onClick={() => setLocation("/exams")}>
                  Browse as guest
                </Button>
              </div>
              <p className="relative mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                No credit card required for free mocks
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <footer className="border-t border-border bg-card/50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="font-semibold text-foreground">EXAMTREE</p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">Mock tests and review for competitive exams—clear flow, honest progress.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="font-medium text-foreground">Product</p>
              <button type="button" className="mt-2 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/exams")}>
                Catalog
              </button>
              <button type="button" className="mt-1 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/dashboard")}>
                Dashboard
              </button>
            </div>
            <div>
              <p className="font-medium text-foreground">Practice</p>
              <button type="button" className="mt-2 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/leaderboard")}>
                Leaderboard
              </button>
              <button type="button" className="mt-1 block text-muted-foreground hover:text-foreground" onClick={() => setLocation("/login/student")}>
                Sign in
              </button>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="font-medium text-foreground">Note</p>
              <p className="mt-2 text-muted-foreground">Content is for practice only; always follow your official exam guidelines.</p>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">© 2026 EXAMTREE</p>
      </footer>
    </div>
  );
}
