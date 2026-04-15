import React, { useMemo, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { getAnalytics, getUserAttempts, getLeaderboard, AnalyticsResponse, TestAttempt } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BarChart3, Trophy, BookOpen } from "lucide-react";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { getUser } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";

interface ChartDataPoint {
  name: string;
  score: number;
  date: string;
}

export default function PerformancePage() {
  const [location, setLocation] = useLocation();
  const user = getUser();
  const { tests, isLoading: catalogLoading, error: catalogError } = useExamCatalog();

  const analyticsQuery = useQuery({
    queryKey: ["analytics", user?.id],
    queryFn: () => getAnalytics(user?.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 60_000,
  });

  const attemptsQuery = useQuery({
    queryKey: ["my-attempts", user?.id],
    queryFn: () => getUserAttempts(user?.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 60_000,
  });

  const testId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("testId") ?? "";
  }, [location]);

  const selectedTest = useMemo(
    () => tests.find((test) => test.id === testId) ?? null,
    [tests, testId],
  );

  const { data: leaderboardData, isLoading: leaderboardLoading, error: leaderboardError } = useQuery({
    queryKey: ["leaderboard", testId],
    queryFn: () => getLeaderboard(testId),
    enabled: Boolean(testId),
    retry: false,
    staleTime: 60_000,
  });

  const leaderboard = leaderboardData?.leaderboard ?? [];
  const leaderboardSize = leaderboardData?.leaderboard?.length ?? 10;
  const currentUserRow = user ? leaderboard.find((row) => row.userId === user.id) : undefined;
  const showUserRank = Boolean(user && leaderboardData?.currentUserRank && !currentUserRow);

  const analytics = analyticsQuery.data;
  const allAttempts = attemptsQuery.data ?? [];

  const chartData = useMemo(() => {
    return allAttempts
      .slice()
      .reverse()
      .map((attempt) => ({
        name: attempt.testName.substring(0, 15),
        score: attempt.score,
        date: attempt.date,
      }));
  }, [allAttempts]);

  const isLoading = analyticsQuery.isLoading || attemptsQuery.isLoading || catalogLoading;
  const error =
    analyticsQuery.error ||
    attemptsQuery.error ||
    catalogError ||
    leaderboardError;

  const handleTestChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setLocation(selectedId ? `/performance?testId=${encodeURIComponent(selectedId)}` : "/performance");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-red-700">Failed to load data. {message}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics && allAttempts.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto text-center text-gray-500">
          No data available. Complete a mock test to see your performance here.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Performance</h1>
          <p className="text-gray-600">Track your progress and achievement metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Average Score Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
                <BarChart3 className="text-blue-500" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.averageScore}</p>
              <p className="text-xs text-gray-500 mt-1">Based on all attempts</p>
            </CardContent>
          </Card>

          {/* Best Score Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Best Score</CardTitle>
                <Trophy className="text-amber-500" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.highestScore}</p>
              <p className="text-xs text-gray-500 mt-1">Your highest score</p>
            </CardContent>
          </Card>

          {/* Total Attempts Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Attempts</CardTitle>
                <BookOpen className="text-green-500" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalAttempts}</p>
              <p className="text-xs text-gray-500 mt-1">Tests completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    dot={{ fill: "#3b82f6", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Score %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Attempts List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            {allAttempts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No attempts recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Test Name</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAttempts.slice(0, 20).map((attempt, idx) => {
                      const accuracy = attempt.totalQuestions > 0 
                        ? Math.round((attempt.correct / attempt.totalQuestions) * 100)
                        : 0;
                      return (
                        <tr key={attempt.id} className="border-b border-base-50 hover:bg-bg-50">
                          <td className="py-3 px-4 text-foreground">{attempt.testName}</td>
                          <td className="text-right py-3 px-4">
                            <span className="font-semibold text-foreground">{attempt.score}%</span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              {accuracy}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">
                            {new Date(attempt.date).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard Section */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Leaderboard
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  A real-time leaderboard powered by global test attempts.
                </p>
                {selectedTest ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Viewing leaderboard for <span className="font-semibold text-foreground">{selectedTest.name}</span>.
                  </p>
                ) : null}
              </div>

              <div className="w-full sm:w-80">
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="leaderboard-test-select">
                  Select a test
                </label>
                <select
                  id="leaderboard-test-select"
                  value={testId}
                  onChange={handleTestChange}
                  className="w-full cursor-pointer rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={catalogLoading || tests.length === 0}
                  aria-label="Select a test for leaderboard"
                >
                  <option value="" disabled>
                    {catalogLoading ? "Loading tests…" : tests.length === 0 ? "No tests available" : "Choose a test to view"}
                  </option>
                  {tests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.name}
                    </option>
                  ))}
                </select>
                {catalogError ? (
                  <p className="mt-2 text-xs text-destructive">Unable to load tests. Try refreshing the page.</p>
                ) : null}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!testId ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No test selected</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a test from the selector above to load its leaderboard.
                </p>
              </div>
            ) : leaderboardLoading ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
              </div>
            ) : leaderboardError ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <h3 className="text-xl font-semibold text-foreground">Could not load leaderboard</h3>
                <p className="mt-2 text-sm text-muted-foreground">Please try again or verify the selected test.</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No leaderboard data yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No attempts have been recorded for this test yet.
                </p>
              </div>
            ) : (
              <div className="glass-panel rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-3 bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-6">User</div>
                  <div className="col-span-5 text-right">Score</div>
                </div>

                <div className="divide-y divide-border">
                  {leaderboard.map((row) => {
                    const isCurrent = user?.id === row.userId;
                    return (
                      <div
                        key={`${row.userId}-${row.rank}`}
                        className={`grid grid-cols-12 px-6 py-4 items-center transition-colors ${
                          isCurrent ? "bg-primary/10" : "hover:bg-muted/30"
                        }`}
                        data-testid={`leaderboard-row-${row.rank}`}
                      >
                        <div className="col-span-1 flex items-center">
                          <span className="text-sm font-bold text-muted-foreground">#{row.rank}</span>
                        </div>
                        <div className="col-span-6 min-w-0">
                          <p className="font-semibold text-foreground text-sm truncate">{row.userName}</p>
                          {isCurrent ? (
                            <Badge variant="secondary" className="text-[10px] mt-1 inline-flex">
                              You
                            </Badge>
                          ) : null}
                        </div>
                        <div className="col-span-5 text-right">
                          <span className="font-bold text-foreground">{row.score.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showUserRank && (
              <div className="mt-6 rounded-2xl border border-border bg-card/80 p-5">
                <p className="text-sm text-foreground font-semibold">Your rank</p>
                <p className="mt-2 text-3xl font-bold text-foreground">#{leaderboardData?.currentUserRank}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your best attempt is outside the top {leaderboardSize}, but it still counts toward your global rank.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
