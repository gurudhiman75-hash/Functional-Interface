import { Trophy, Medal, TrendingUp, Users, BookOpen } from "lucide-react";
import { leaderboardData } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl">🥇</span>;
  if (rank === 2) return <span className="text-xl">🥈</span>;
  if (rank === 3) return <span className="text-xl">🥉</span>;
  return <span className="text-sm font-bold text-muted-foreground">#{rank.toLocaleString()}</span>;
}

export default function Leaderboard() {
  const topEntries = leaderboardData.filter((e) => !e.isYou && e.rank <= 9);
  const userEntry = leaderboardData.find((e) => e.isYou);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Top performers across all exams</p>
        </div>

        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white mb-8 animate-fadeInUp" data-testid="your-stats">
          <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-4">Your Standing</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-white/70 text-xs">
                <Trophy className="w-3.5 h-3.5" />
                <span>Rank</span>
              </div>
              <p className="text-3xl font-bold" data-testid="your-rank">#1,250</p>
            </div>
            <div className="border-x border-white/20">
              <div className="flex items-center justify-center gap-1 mb-1 text-white/70 text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Score</span>
              </div>
              <p className="text-3xl font-bold" data-testid="your-score">85.50</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-white/70 text-xs">
                <Medal className="w-3.5 h-3.5" />
                <span>Percentile</span>
              </div>
              <p className="text-3xl font-bold" data-testid="your-percentile">92.5%</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Student</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-2 text-right">Accuracy</div>
            <div className="col-span-2 text-right">Tests</div>
          </div>

          <div className="divide-y divide-border">
            {topEntries.map((entry) => (
              <div
                key={entry.rank}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-muted/30 transition-colors"
                data-testid={`leaderboard-row-${entry.rank}`}
              >
                <div className="col-span-1 flex items-center">
                  <RankMedal rank={entry.rank} />
                </div>
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {entry.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.city}</p>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-bold text-foreground">{entry.score}</span>
                </div>
                <div className="col-span-2 text-right text-sm text-muted-foreground">
                  {entry.accuracy}%
                </div>
                <div className="col-span-2 text-right">
                  <Badge variant="secondary" className="text-xs">{entry.testsCount}</Badge>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center py-2 bg-muted/30">
              <span className="text-xs text-muted-foreground">• • •</span>
            </div>

            {userEntry && (
              <div className="grid grid-cols-12 px-6 py-4 items-center bg-primary/5 border-l-4 border-l-primary" data-testid="leaderboard-row-you">
                <div className="col-span-1">
                  <span className="text-sm font-bold text-primary">#{userEntry.rank.toLocaleString()}</span>
                </div>
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shrink-0">
                    Y
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-foreground text-sm">You</p>
                      <Badge className="text-[10px] py-0 px-1.5">You</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{userEntry.city}</p>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-bold text-foreground">{userEntry.score}</span>
                </div>
                <div className="col-span-2 text-right text-sm text-muted-foreground">
                  {userEntry.accuracy}%
                </div>
                <div className="col-span-2 text-right">
                  <Badge variant="secondary" className="text-xs">{userEntry.testsCount}</Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
