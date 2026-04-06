import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowRight, Users, BookOpen, Target, TrendingUp, Award, Zap, ChevronRight, Cpu, Heart, BarChart3 } from "lucide-react";
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
  "1": "from-blue-500 to-blue-600",
  "2": "from-emerald-500 to-emerald-600",
  "3": "from-violet-500 to-violet-600",
};

const CATEGORY_BG: Record<string, string> = {
  "1": "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40",
  "2": "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40",
  "3": "bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/40",
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
  { icon: <Target className="w-5 h-5 text-violet-600" />, title: "Section Analytics", desc: "Identify weak areas with subject-wise performance breakdown" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const user = getUser();

  const handleStartTest = () => {
    if (user) {
      setLocation("/tests");
    } else {
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4 text-xs font-semibold px-3 py-1 animate-fadeInUp">
              Trusted by 100K+ students across India
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fadeInUp" data-testid="hero-title">
              Ace Your Exams with{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smart Practice
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed animate-fadeInUp">
              Practice with expertly curated mock tests, get real-time analytics, and compete on leaderboards. Built for serious exam aspirants.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fadeInUp">
              <Button size="lg" onClick={handleStartTest} className="gap-2 text-base" data-testid="btn-start-test">
                Start Free Test
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/leaderboard")} data-testid="btn-view-leaderboard">
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { value: "100K+", label: "Active Students", icon: <Users className="w-5 h-5" />, color: "text-primary" },
              { value: "500+", label: "Mock Tests", icon: <BookOpen className="w-5 h-5" />, color: "text-secondary" },
              { value: "95%", label: "Success Rate", icon: <Target className="w-5 h-5" />, color: "text-emerald-600" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
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
              className={`group text-left p-6 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ${CATEGORY_BG[cat.id]}`}
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
          <Button variant="outline" onClick={() => setLocation("/tests")} data-testid="btn-view-all-tests">
            View All Tests
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>

      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground">Powerful tools designed for serious exam preparation</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat) => (
              <div key={feat.title} className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow">
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
          <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-2xl p-12 border border-border">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Begin?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Join thousands of students already practicing on MockTestPro.</p>
            <Button size="lg" onClick={() => setLocation("/login")} data-testid="btn-cta-login">
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      )}

      <footer className="border-t border-border py-8 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2026 MockTestPro. Helping students achieve their dreams.</p>
        </div>
      </footer>
    </div>
  );
}
