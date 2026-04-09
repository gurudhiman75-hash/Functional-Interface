import { Trophy, Medal, TrendingUp, BookOpen, Target } from "lucide-react";
import { getAttempts } from "@/lib/storage";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

export default function Leaderboard() {
  const attempts = getAttempts();
  const testsTaken = attempts.length;
  const bestScore = testsTaken > 0
    ? Math.max(...attempts.map((attempt) => attempt.score))
    : 0;
  const averageScore = testsTaken > 0
    ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / testsTaken
    : 0;
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correct, 0);
  const totalWrong = attempts.reduce((sum, attempt) => sum + attempt.wrong, 0);
  const accuracy = totalCorrect + totalWrong > 0
    ? (totalCorrect / (totalCorrect + totalWrong)) * 100
    : 0;
  const bestAttempts = [...attempts]
    .sort((a, b) => b.score - a.score || b.correct - a.correct)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Performance Board</h1>
          <p className="text-muted-foreground text-sm">
            A live summary of your completed test history on this device.
          </p>
        </div>

        <div className="glass-panel hero-panel rounded-[2rem] p-6 text-foreground mb-8 animate-fadeInUp" data-testid="your-stats">
          <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-4">Your Progress Snapshot</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground text-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tests</span>
              </div>
              <p className="text-3xl font-bold" data-testid="your-tests">{testsTaken}</p>
            </div>
            <div className="border-x border-border">
              <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Avg. Score</span>
              </div>
              <p className="text-3xl font-bold" data-testid="your-score">
                {testsTaken > 0 ? averageScore.toFixed(1) : "N/A"}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-muted-foreground text-xs">
                <Medal className="w-3.5 h-3.5" />
                <span>Accuracy</span>
              </div>
              <p className="text-3xl font-bold" data-testid="your-accuracy">
                {testsTaken > 0 ? `${accuracy.toFixed(1)}%` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {bestAttempts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Trophy className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No completed attempts yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Finish a test and we&apos;ll show your strongest performances here instead of fake global rankings.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Test</div>
              <div className="col-span-2 text-right">Score</div>
              <div className="col-span-2 text-right">Accuracy</div>
              <div className="col-span-2 text-right">Correct</div>
            </div>

            <div className="divide-y divide-border">
              {bestAttempts.map((attempt, index) => {
                const attemptAccuracy = attempt.correct + attempt.wrong > 0
                  ? (attempt.correct / (attempt.correct + attempt.wrong)) * 100
                  : 0;

                return (
                  <div
                    key={`${attempt.testId}-${attempt.date}-${index}`}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
                    data-testid={`leaderboard-row-${index + 1}`}
                  >
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                    </div>
                    <div className="col-span-5 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{attempt.testName}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{attempt.category}</Badge>
                        <span className="text-xs text-muted-foreground">{attempt.date}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="font-bold text-foreground">{attempt.score.toFixed(1)}%</span>
                    </div>
                    <div className="col-span-2 text-right text-sm text-muted-foreground">
                      {attemptAccuracy.toFixed(1)}%
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                        <Target className="w-3.5 h-3.5 text-primary" />
                        <span>{attempt.correct}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {testsTaken > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card/80 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Best Score</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{bestScore.toFixed(1)}%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on your completed attempts stored on this device.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
