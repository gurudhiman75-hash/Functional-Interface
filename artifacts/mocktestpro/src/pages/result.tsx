import { useLocation } from "wouter";
import { CheckCircle, XCircle, MinusCircle, Clock, Award, TrendingUp, RotateCcw, Trophy } from "lucide-react";
import { getAttempts } from "@/lib/storage";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const sectionData = [
  { name: "Mathematics", score: 87.5, color: "#2563eb" },
  { name: "Physics", score: 72.0, color: "#7c3aed" },
  { name: "Chemistry", score: 85.0, color: "#10b981" },
];

const percentileData = [
  { name: "You", score: 85.5, color: "#2563eb" },
  { name: "Average", score: 72.5, color: "#94a3b8" },
  { name: "75th %ile", score: 80.0, color: "#f59e0b" },
  { name: "90th %ile", score: 88.0, color: "#10b981" },
];

function getGrade(score: number) {
  if (score >= 90) return { label: "Outstanding", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
  if (score >= 80) return { label: "Excellent", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" };
  if (score >= 70) return { label: "Good", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" };
  if (score >= 60) return { label: "Average", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" };
  return { label: "Needs Work", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" };
}

export default function Result() {
  const [, setLocation] = useLocation();
  const attempts = getAttempts();

  const latest = attempts[0] ?? {
    testName: "JEE Main Mock 1",
    category: "JEE",
    score: 85,
    correct: 85,
    wrong: 10,
    unanswered: 5,
    totalQuestions: 100,
    timeSpent: 45,
  };

  const grade = getGrade(latest.score);
  const accuracy = Math.round((latest.correct / (latest.correct + latest.wrong)) * 100) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white text-center mb-8 animate-fadeInUp" data-testid="result-hero">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${grade.bg} ${grade.color}`}>
            <Award className="w-4 h-4" />
            {grade.label}
          </div>
          <p className="text-blue-100 text-sm mb-1">Your Score</p>
          <h1 className="text-6xl sm:text-7xl font-bold mb-2" data-testid="result-score">{latest.score}%</h1>
          <p className="text-blue-100">{latest.testName}</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-semibold text-blue-100">Global Rank: <span className="text-white">#1,250</span></span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <CheckCircle className="w-5 h-5" />, label: "Correct", value: latest.correct, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: <XCircle className="w-5 h-5" />, label: "Wrong", value: latest.wrong, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
            { icon: <MinusCircle className="w-5 h-5" />, label: "Skipped", value: latest.unanswered, color: "text-muted-foreground", bg: "bg-muted" },
            { icon: <Clock className="w-5 h-5" />, label: "Time Spent", value: `${latest.timeSpent}m`, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-xl p-5 shadow-sm text-center" data-testid={`stat-${item.label.toLowerCase()}`}>
              <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center ${item.color} mx-auto mb-2`}>
                {item.icon}
              </div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-primary" />
              Section Performance
            </h2>
            <div className="space-y-4">
              {sectionData.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.score}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${s.score}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Accuracy</span>
                <span className="font-bold text-primary">{accuracy}%</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
              <Award className="w-4 h-4 text-primary" />
              Percentile Comparison
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={percentileData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(v) => [`${v}%`, "Score"]}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {percentileData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={() => setLocation("/tests")} className="gap-2" data-testid="btn-take-another">
            <RotateCcw className="w-4 h-4" />
            Take Another Test
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/leaderboard")} className="gap-2" data-testid="btn-view-leaderboard">
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/dashboard")} data-testid="btn-dashboard">
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
