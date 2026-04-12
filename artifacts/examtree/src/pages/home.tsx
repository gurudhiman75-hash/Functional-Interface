import { useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Cpu,
  Heart,
  BarChart3,
  Sparkles,
  Clock3,
} from "lucide-react";
import { useMemo } from "react";
import { getUser } from "@/lib/storage";
import { getAttempts, getActiveTestSessions } from "@/lib/storage";
import { getRuntimeCategories, getRuntimeTests } from "@/lib/test-bank";
import type { Category, Test } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

console.log("home.tsx loaded");

const CATEGORY_STYLES = [
  {
    icon: <Cpu className="w-7 h-7" />,
    gradient: "from-blue-500 to-sky-500",
    card: "bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40",
  },
  {
    icon: <Heart className="w-7 h-7" />,
    gradient: "from-emerald-500 to-teal-500",
    card: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40",
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    gradient: "from-cyan-500 to-indigo-500",
    card: "bg-cyan-50 border-cyan-100 dark:bg-cyan-950/30 dark:border-cyan-900/40",
  },
];

const features = [
  { icon: <Zap className="w-5 h-5 text-primary" />, title: "Instant Results", desc: "Get detailed analytics right after completing each test" },
  { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, title: "Performance Tracking", desc: "Monitor your progress with detailed charts and trends" },
  { icon: <Award className="w-5 h-5 text-amber-600" />, title: "Competitive Rankings", desc: "Compare scores and compete with thousands of students" },
  { icon: <Target className="w-5 h-5 text-cyan-700" />, title: "Section Analytics", desc: "Identify weak areas with subject-wise performance breakdown" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const attempts = getAttempts();
  const activeSessionsCount = Object.keys(getActiveTestSessions()).length;
  const categories = useMemo(() => getRuntimeCategories(), []);
  const tests = useMemo(() => getRuntimeTests(), []);

  const totalQuestions = tests.reduce((sum, test) => sum + test.totalQuestions, 0);
  const totalAttempts = tests.reduce((sum, test) => sum + test.attempts, 0);
  const averageScore =
    tests.length > 0
      ? Math.round(tests.reduce((sum, test) => sum + test.avgScore, 0) / tests.length)
      : 0;
  const featuredCategories = categories.slice(0, 3);
  const topCategories = [...categories]
    .sort((a, b) => (b.testsCount ?? 0) - (a.testsCount ?? 0))
    .slice(0, 4);
  const topCategoryMax = Math.max(...topCategories.map((category) => category.testsCount), 1);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),transparent_28%)]">
        <div className="absolute inset-0 aurora-bg -z-10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold shadow-sm animate-fadeInUp text-muted-foreground">
                {tests.length} live mocks across {categories.length} categories
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fadeInUp" data-testid="hero-title">
                One platform for
                <span className="block bg-gradient-to-r from-primary via-sky-500 to-secondary bg-clip-text text-transparent">
                  sharper practice, calmer exams
                </span>
              </h1>
              <p className="text-lg text-muted-foreground/95 mb-8 leading-relaxed animate-fadeInUp max-w-2xl">
                Practice with refined mocks, revisit every solution, and track progress with a cleaner workflow built around students.
              </p>
              <div className="flex flex-col sm:flex-row animate-fadeInUp gap-3">
                <Button size="lg" onClick={handleStartTest} className="gap-2 text-base rounded-2xl px-6 shadow-[0_20px_45px_-24px_hsl(var(--primary)/0.8)]" data-testid="btn-start-test">
                  Start Student Practice
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setLocation("/exams")} className="rounded-2xl px-6 bg-white/80" data-testid="btn-browse-home-tests">
                  Browse Exams
                </Button>
                {latestAttemptTest && (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setLocation(`/result?testId=${latestAttemptTest.id}&tab=review`)}
                    className="rounded-2xl px-6"
                    data-testid="btn-latest-solution"
                  >
                    Latest Solution
                  </Button>
                )}
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: <Sparkles className="w-4 h-4" />, label: "Student-first flow", value: "Focused sign-in and practice" },
                  { icon: <Clock3 className="w-4 h-4" />, label: "Timed tests", value: "Sectional control ready" },
                  { icon: <TrendingUp className="w-4 h-4" />, label: "Progress insight", value: "Fast performance review" },
                ].map((item) => (
                  <div key={item.label} className="glass-panel rounded-2xl p-4 shadow-sm">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-[0_30px_90px_-45px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">Live Snapshot</p>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">Today on EXAMTREE</h2>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2 text-right shadow-sm border border-white/10">
                    <p className="text-xs text-muted-foreground">Available tests</p>
                    <p className="text-lg font-bold text-foreground">{tests.length}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      title: "Question bank",
                      text: `${totalQuestions} runtime questions are available across the current mock library.`,
                      icon: <BookOpen className="w-5 h-5" />,
                    },
                    {
                      title: "Saved progress",
                      text:
                        activeSessionsCount > 0
                          ? `${activeSessionsCount} in-progress test ${activeSessionsCount === 1 ? "session is" : "sessions are"} ready to resume on this device.`
                          : "New attempts and saved progress appear here once you start practicing.",
                      icon: <TrendingUp className="w-5 h-5" />,
                    },
                    {
                      title: "Latest review",
                      text: latestAttempt
                        ? `Your last score was ${latestAttempt.score}% on ${latestAttempt.testName}. Open the solution review to revisit missed questions.`
                        : "Your latest attempt and solution review will appear here after you complete a test.",
                      icon: <Sparkles className="w-5 h-5" />,
                    },
                  ].map((panel) => (
                    <div key={panel.title} className="rounded-2xl border border-white/10 bg-card/90 p-4 shadow-sm">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted/80 text-primary">{panel.icon}</div>
                      <h3 className="font-semibold text-foreground">{panel.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{panel.text}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/70 bg-slate-950 p-5 text-white shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">Catalog coverage</p>
                      <p className="text-lg font-semibold">Top categories by test count</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-300">{totalQuestions}</p>
                  </div>
                  {latestAttempt && (
                    <div className="mb-4 rounded-2xl border border-white/10 bg-white/8 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Recent attempt</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{latestAttempt.testName}</p>
                          <p className="text-xs text-white/65">{latestAttempt.score}% score • {latestAttempt.timeSpent} min</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="rounded-xl"
                          onClick={() => setLocation(`/result?testId=${latestAttempt.testId}&tab=review`)}
                          data-testid="btn-home-review"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-2 items-end">
                    {topCategories.map((category) => (
                      <div key={category.id} className="rounded-xl bg-white/8 p-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                          {category.name.slice(0, 3)}
                        </p>
                        <div className="mt-3 flex h-20 items-end rounded-full bg-white/8 p-1">
                          <div
                            className="w-full rounded-full bg-gradient-to-t from-secondary to-sky-400"
                            style={{ height: `${Math.max(20, Math.round((category.testsCount / topCategoryMax) * 100))}%` }}
                          />
                        </div>
                        <p className="mt-2 text-[10px] text-white/70">{category.testsCount} tests</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/35 border-y border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { value: categories.length.toString(), label: "Categories", icon: <BookOpen className="w-5 h-5" />, color: "text-primary" },
              { value: tests.length.toString(), label: "Mock Tests", icon: <TrendingUp className="w-5 h-5" />, color: "text-secondary" },
              { value: averageScore > 0 ? `${averageScore}%` : "N/A", label: "Average Score", icon: <Target className="w-5 h-5" />, color: "text-emerald-600" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 bg-card/70 border border-white/60 rounded-[1.6rem] py-5 shadow-sm" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Choose Your Exam Category</h2>
          <p className="text-muted-foreground">Select from our comprehensive range of competitive exams</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, index) => {
            const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];
            return (
            <button
              key={cat.id}
              onClick={() => setLocation(`/category/${cat.id}`)}
              className={`group text-left p-6 rounded-[1.7rem] border-2 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 ${style.card}`}
              data-testid={`category-card-${cat.id}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                {style.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">{cat.testsCount} tests available</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" className="rounded-2xl border-white/30 bg-card/90 text-foreground" onClick={() => setLocation("/exams")} data-testid="btn-view-all-tests">
            Browse All Exams
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      <section className="py-16 bg-muted/25 border-y border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground">Powerful tools designed for serious exam preparation</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat) => (
              <div key={feat.title} className="bg-card/90 rounded-[1.6rem] p-5 border border-white/70 shadow-sm hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary/12 via-background to-secondary/12 rounded-[2rem] p-12 border border-white/70 shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Begin?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start with {tests.length} currently available mock tests and track your own progress from the first attempt.
            </p>
            <Button size="lg" onClick={() => setLocation("/login/student")} data-testid="btn-cta-login">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      <footer className="border-t border-border py-8 bg-card/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 EXAMTREE. Helping students achieve their dreams.</p>
        </div>
      </footer>
    </div>
  );
}
