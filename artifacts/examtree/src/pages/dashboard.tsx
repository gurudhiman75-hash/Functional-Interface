import { useLocation } from "wouter";
import { useEffect } from "react";
import { TrendingUp, BookOpen, Award, Target, ArrowRight, Calendar, ChevronRight, BarChart2, Clock } from "lucide-react";
import { getActiveTestSessions, getUser, getAttempts } from "@/lib/storage";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const performanceData = [
  { day: "Mon", score: 65 },
  { day: "Tue", score: 68 },
  { day: "Wed", score: 71 },
  { day: "Thu", score: 75 },
  { day: "Fri", score: 78 },
  { day: "Sat", score: 72 },
  { day: "Sun", score: 82 },
];

const accuracyData = [
  { name: "Correct", value: 128, color: "#10b981" },
  { name: "Wrong", value: 20, color: "#ef4444" },
  { name: "Skipped", value: 12, color: "#94a3b8" },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const attempts = getAttempts();
  const activeSession = Object.values(getActiveTestSessions())
    .sort((a, b) => b.updatedAt - a.updatedAt)[0] ?? null;

  useEffect(() => {
    if (user) return;
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLocation("/login/student");
        return;
      }
      await upsertUserProfile(firebaseUser);
    });
    return () => unsub();
  }, [user, setLocation]);

  if (!user) return null;

  const stats = [
    { label: "Tests Taken", value: attempts.length || 12, icon: <BookOpen className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Avg. Score", value: "72.5%", icon: <BarChart2 className="w-5 h-5" />, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Global Rank", value: "#1,250", icon: <Award className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
    { label: "Accuracy", value: "82.3%", icon: <Target className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
  ];

  const recentAttempts = attempts.length > 0 ? attempts.slice(0, 5) : [
    { testName: "JEE Main Mock 1", category: "JEE", score: 75, date: "2026-04-05", correct: 68, wrong: 8, unanswered: 4, totalQuestions: 90, timeSpent: 120, testId: "1" },
    { testName: "NEET Mock 1", category: "NEET", score: 68, date: "2026-04-03", correct: 122, wrong: 30, unanswered: 28, totalQuestions: 180, timeSpent: 170, testId: "3" },
    { testName: "JEE Main Mock 2", category: "JEE", score: 80, date: "2026-04-01", correct: 72, wrong: 7, unanswered: 11, totalQuestions: 90, timeSpent: 165, testId: "2" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--card)/0.72))] p-6 shadow-[0_22px_65px_-42px_rgba(15,23,42,0.55)] animate-fadeInUp">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge variant="secondary" className="mb-3 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
              Performance Hub
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="dashboard-title">
              Welcome back, <span className="text-primary capitalize">{user.name}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Here's your performance overview</p>
          </div>
          <Button onClick={() => setLocation("/tests")} className="gap-2 shrink-0 rounded-2xl shadow-[0_16px_35px_-24px_hsl(var(--primary)/0.8)]" data-testid="btn-new-test">
            Start New Test
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card/85 border border-border/70 rounded-2xl p-5 shadow-sm surface-hover" data-testid={`stat-card-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center ${s.color} mb-3`}>
                {s.icon}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {activeSession && (
          <div className="mb-8 rounded-[2rem] border border-blue-100 bg-blue-50/80 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  In Progress
                </p>
                <h2 className="mt-2 text-lg font-bold text-foreground">{activeSession.testName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your progress is saved automatically. Continue from where you left off.
                </p>
              </div>
              <Button onClick={() => setLocation(`/test/${activeSession.testId}`)} className="gap-2 shrink-0">
                Resume Test
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Score Trend (Last 7 Days)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(v) => [`${v}%`, "Score"]}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-primary" />
              Answer Distribution
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={accuracyData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {accuracyData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => <span style={{ color: "hsl(var(--foreground))", fontSize: "11px" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {accuracyData.map((d) => (
                <div key={d.name} className="text-center">
                  <p className="text-sm font-bold" style={{ color: d.color }}>{d.value}</p>
                  <p className="text-[10px] text-muted-foreground">{d.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card/85 border border-border/70 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Recent Test Attempts</h3>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/tests")} className="text-primary gap-1">
              All Tests <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No tests attempted yet</p>
              <Button variant="link" onClick={() => setLocation("/tests")} className="mt-2 text-primary">
                Start your first test
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentAttempts.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors list-item-animate" data-testid={`attempt-row-${i}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{a.testName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5">{a.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {a.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {a.timeSpent} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getScoreColor(a.score)}`}>{a.score}%</p>
                      <p className="text-[10px] text-muted-foreground">{a.correct}/{a.totalQuestions} correct</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setLocation("/result")} className="text-primary">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
