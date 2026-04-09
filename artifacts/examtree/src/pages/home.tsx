import { useLocation } from "wouter";
import {
  ArrowRight,
  Users,
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
import { getUser } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "1": <Cpu className="w-7 h-7" />,
  "2": <Heart className="w-7 h-7" />,
  "3": <BarChart3 className="w-7 h-7" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  "1": "from-blue-500 to-sky-500",
  "2": "from-emerald-500 to-teal-500",
  "3": "from-cyan-500 to-indigo-500",
};

const CATEGORY_BG: Record<string, string> = {
  "1": "bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40",
  "2": "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40",
  "3": "bg-cyan-50 border-cyan-100 dark:bg-cyan-950/30 dark:border-cyan-900/40",
};

const featuredCategories = [
  { id: "1", name: "JEE Main", description: "Joint Entrance Examination for top engineering colleges", testsCount: 50 },
  { id: "2", name: "NEET", description: "National Eligibility cum Entrance Test", testsCount: 45 },
  { id: "3", name: "CAT", description: "Common Admission Test for MBA aspirants", testsCount: 40 },
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

  const handleStartTest = () => {
    if (user) {
      setLocation("/tests");
    } else {
      setLocation("/login/student");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 aurora-bg -z-10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-5 rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-xs font-semibold shadow-sm animate-fadeInUp">
                Trusted by 100K+ students across India
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fadeInUp" data-testid="hero-title">
                One platform for
                <span className="block bg-gradient-to-r from-primary via-sky-500 to-secondary bg-clip-text text-transparent">
                  sharper practice, calmer exams
                </span>
              </h1>
              <p className="text-lg text-muted-foreground/95 mb-8 leading-relaxed animate-fadeInUp max-w-2xl">
                Practice with expert-built mocks, review mistakes faster, and track progress with a cleaner workflow built around students.
              </p>
              <div className="flex animate-fadeInUp">
                <Button size="lg" onClick={handleStartTest} className="gap-2 text-base rounded-2xl px-6 shadow-[0_20px_45px_-24px_hsl(var(--primary)/0.8)]" data-testid="btn-start-test">
                  Start Student Practice
                  <ArrowRight className="w-4 h-4" />
                </Button>
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

            <div className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/60 p-6 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)]">
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15" />
              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">Live Snapshot</p>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">Today on EXAMTREE</h2>
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-2 text-right shadow-sm">
                    <p className="text-xs text-muted-foreground">Active now</p>
                    <p className="text-lg font-bold text-foreground">12,842</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { title: "Student login", text: "Clean sign-in, faster mock access, and clearer test navigation.", icon: <BookOpen className="w-5 h-5" /> },
                    { title: "Exam flow", text: "Track pace, answers, and navigation with less friction during tests.", icon: <TrendingUp className="w-5 h-5" /> },
                  ].map((panel) => (
                    <div key={panel.title} className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">{panel.icon}</div>
                      <h3 className="font-semibold text-foreground">{panel.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{panel.text}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/70 bg-slate-950 p-5 text-white shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">Weekly momentum</p>
                      <p className="text-lg font-semibold">Average score uplift</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-300">+14%</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-end">
                    {[52, 60, 68, 81].map((v, index) => (
                      <div key={v} className="rounded-xl bg-white/8 p-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">W{index + 1}</p>
                        <div className="mt-3 flex h-20 items-end rounded-full bg-white/8 p-1">
                          <div className="w-full rounded-full bg-gradient-to-t from-secondary to-sky-400" style={{ height: `${v}%` }} />
                        </div>
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
              { value: "100K+", label: "Active Students", icon: <Users className="w-5 h-5" />, color: "text-primary" },
              { value: "500+", label: "Mock Tests", icon: <BookOpen className="w-5 h-5" />, color: "text-secondary" },
              { value: "95%", label: "Success Rate", icon: <Target className="w-5 h-5" />, color: "text-emerald-600" },
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Popular Exams</h2>
          <p className="text-muted-foreground">Choose from India's top competitive exams</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setLocation(`/subcategory/${cat.id}`)}
              className={`group text-left p-6 rounded-[1.7rem] border-2 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 ${CATEGORY_BG[cat.id]}`}
              data-testid={`category-card-${cat.id}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[cat.id]} flex items-center justify-center text-white mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                {CATEGORY_ICONS[cat.id]}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">{cat.testsCount} tests available</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button variant="outline" className="rounded-2xl border-white/70 bg-white/75" onClick={() => setLocation("/tests")} data-testid="btn-view-all-tests">
            View All Tests
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
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Join thousands of students already practicing on EXAMTREE.</p>
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
