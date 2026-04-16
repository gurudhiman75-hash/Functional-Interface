import React, { useMemo, useState, useEffect, useCallback, type ChangeEvent } from "react";
import { useLocation } from "wouter";
import { getAnalytics, getUserAttempts, getLeaderboard, type TestAttempt } from "@/lib/data";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle, BarChart3, Trophy, BookOpen, TrendingUp, TrendingDown,
  Target, Zap, Award, Users, Minus, Clock, Timer, Filter, BarChart2,
} from "lucide-react";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { getUser } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";

// ─── helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function scoreBg(score: number): string {
  if (score >= 75) return "bg-emerald-50 border-emerald-200";
  if (score >= 50) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

function consistencyColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function formatSeconds(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  tooltip?: string;
  icon: React.ReactNode;
  accent?: string;
  bg?: string;
}

function StatCard({ label, value, sub, tooltip, icon, accent = "text-primary", bg = "bg-primary/10" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden" title={tooltip}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
              {label}
              {tooltip && <span className="text-muted-foreground/50 cursor-help text-[10px]" title={tooltip}>ⓘ</span>}
            </p>
            <p className={`text-2xl font-bold leading-none ${accent}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
          </div>
          <div className={`flex-shrink-0 h-10 w-10 rounded-xl ${bg} flex items-center justify-center ${accent}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function PerformancePage() {
  const [, setLocation] = useLocation();
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

  // ── URL-persisted leaderboard test ─────────────────────────────────────
  const initialTestId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("testId") ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [testId, setTestId] = useState(initialTestId);

  useEffect(() => {
    const url = testId ? `/performance?testId=${encodeURIComponent(testId)}` : "/performance";
    window.history.replaceState(null, "", url);
  }, [testId]);

  // ── Analytics filter (filters chart, stats, sections by test) ──────────
  const [filterTestId, setFilterTestId] = useState<string>("");

  const selectedTest = useMemo(
    () => tests.find((t) => t.id === testId) ?? null,
    [tests, testId],
  );

  const testOptions = useMemo(
    () => tests.map((t) => <option key={t.id} value={t.id}>{t.name}</option>),
    [tests],
  );

  const { data: leaderboardData, isLoading: leaderboardLoading, error: leaderboardError } = useQuery({
    queryKey: ["leaderboard", testId],
    queryFn: () => getLeaderboard(testId),
    enabled: Boolean(testId),
    retry: false,
    staleTime: 60_000,
  });

  const leaderboard = leaderboardData?.leaderboard ?? [];
  const currentUserRow = user ? leaderboard.find((row) => row.userId === user.id) : undefined;
  const showUserRank = Boolean(user && leaderboardData?.currentUserRank && !currentUserRow);

  const analytics = analyticsQuery.data;
  const allAttempts = attemptsQuery.data ?? [];

  // ── Filtered attempts (for analytics section) ───────────────────────────
  const filteredAttempts = useMemo(() => {
    if (!filterTestId) return allAttempts;
    return allAttempts.filter((a) => a.testId === filterTestId);
  }, [allAttempts, filterTestId]);

  // All real attempts from filtered set, sorted oldest-first
  const realAttempts = useMemo(
    () =>
      [...filteredAttempts]
        .filter((a) => !a.attemptType || a.attemptType === "REAL")
        .sort((a, b) => (a.date < b.date ? -1 : 1)),
    [filteredAttempts],
  );

  // ── Chart: ALL real attempts chronologically ────────────────────────────
  const chartData = useMemo(
    () =>
      realAttempts.map((a, i) => ({
        label: new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        score: a.score,
        testName: a.testName,
        change: i > 0 ? +(a.score - realAttempts[i - 1].score).toFixed(1) : null,
      })),
    [realAttempts],
  );

  const avgScore = useMemo(
    () =>
      realAttempts.length > 0
        ? Math.round(realAttempts.reduce((s, a) => s + a.score, 0) / realAttempts.length)
        : null,
    [realAttempts],
  );

  // ── Improvement: % change using ((last - prev) / prev) * 100 ───────────
  const improvement = useMemo(() => {
    if (realAttempts.length < 2) return null;
    const last = realAttempts[realAttempts.length - 1].score;
    const prev = realAttempts[realAttempts.length - 2].score;
    if (prev === 0) return null; // avoid divide-by-zero
    return +((( last - prev) / prev) * 100).toFixed(1);
  }, [realAttempts]);

  // ── Accuracy % ──────────────────────────────────────────────────────────
  const overallAccuracy = useMemo(() => {
    const total = filteredAttempts.reduce((s, a) => s + a.totalQuestions, 0);
    const correct = filteredAttempts.reduce((s, a) => s + a.correct, 0);
    return total > 0 ? Math.round((correct / total) * 100) : null;
  }, [filteredAttempts]);

  // ── Section analysis: last 5 real attempts, recency-weighted ───────────
  const sectionStats = useMemo(() => {
    const recent = realAttempts.slice(-5); // last 5
    const map = new Map<string, { wCorrect: number; wTotal: number }>();
    recent.forEach((attempt, idx) => {
      const weight = idx + 1; // index 0 = oldest in slice, higher idx = more recent
      if (!attempt.sectionStats) return;
      for (const s of attempt.sectionStats) {
        const prev = map.get(s.name) ?? { wCorrect: 0, wTotal: 0 };
        map.set(s.name, {
          wCorrect: prev.wCorrect + s.correct * weight,
          wTotal: prev.wTotal + s.totalQuestions * weight,
        });
      }
    });
    return [...map.entries()]
      .map(([name, { wCorrect, wTotal }]) => ({
        name,
        accuracy: wTotal > 0 ? Math.round((wCorrect / wTotal) * 100) : 0,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [realAttempts]);

  const strongest = sectionStats[0] ?? null;
  const weakest = sectionStats[sectionStats.length - 1] ?? null;

  // ── Consistency score: 100 - (2 * stdDev), clamped 0–100 ───────────────
  const consistencyScore = useMemo(() => {
    if (realAttempts.length < 3) return null;
    const scores = realAttempts.map((a) => a.score);
    const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
    const variance = scores.reduce((s, v) => s + (v - mean) ** 2, 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, Math.min(100, Math.round(100 - stdDev * 2)));
  }, [realAttempts]);

  // ── Time analysis ────────────────────────────────────────────────────────
  const timeStats = useMemo(() => {
    const withTime = filteredAttempts.filter((a) => a.timeSpent > 0);
    if (withTime.length === 0) return null;
    const totalSec = withTime.reduce((s, a) => s + a.timeSpent, 0);
    const totalQ = withTime.reduce((s, a) => s + a.totalQuestions, 0);
    return {
      totalMinutes: Math.round(totalSec / 60),
      avgSecondsPerQ: totalQ > 0 ? Math.round(totalSec / totalQ) : 0,
    };
  }, [filteredAttempts]);

  // ── Leaderboard metrics ──────────────────────────────────────────────────
  const topperScore = leaderboard[0]?.score ?? null;
  const userScoreDiff =
    currentUserRow && topperScore != null
      ? +(currentUserRow.score - topperScore).toFixed(1)
      : null;

  // percentile = ((totalUsers - rank) / totalUsers) * 100
  // We estimate totalUsers as max(leaderboardSize, currentUserRank)
  const percentile = useMemo(() => {
    if (!leaderboardData?.currentUserRank) return null;
    const rank = leaderboardData.currentUserRank;
    const total = Math.max(leaderboard.length, rank);
    return Math.min(100, Math.max(0, Math.round(((total - rank) / total) * 100)));
  }, [leaderboardData, leaderboard.length]);

  const leaderboardSize = leaderboard.length;
  // ── Weak areas: last 5 real attempts, threshold >= 5 questions, accuracy < 60% ──
  const weakAreaSections = useMemo(() => {
    const recent = realAttempts.slice(-5);
    const map = new Map<string, { correct: number; total: number }>();
    recent.forEach((attempt) => {
      if (!attempt.sectionStats) return;
      for (const s of attempt.sectionStats) {
        const prev = map.get(s.name) ?? { correct: 0, total: 0 };
        map.set(s.name, { correct: prev.correct + s.correct, total: prev.total + s.totalQuestions });
      }
    });
    return [...map.entries()]
      .filter(([, { total }]) => total >= 5)
      .map(([name, { correct, total }]) => ({
        name,
        accuracy: Math.round((correct / total) * 100),
        total,
      }))
      .filter((s) => s.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
  }, [realAttempts]);

  // Helper: classify section (future-safe, only core names hardcoded here)
  function getSectionType(name: string): "core" | "other" {
    if (["Quant", "Reasoning", "English"].includes(name)) return "core";
    return "other";
  }

  const weakCoreAreas = weakAreaSections.filter((s) => getSectionType(s.name) === "core");
  const weakOtherAreas = weakAreaSections.filter((s) => getSectionType(s.name) === "other");

  // Most recent real attempt's testId (for Practice Section navigation)
  const latestRealTestId = realAttempts.length > 0 ? realAttempts[realAttempts.length - 1].testId : null;
  // ── Insights ────────────────────────────────────────────────────────────
  const insights = useMemo(() => {
    const list: { icon: React.ReactNode; text: string; color: string }[] = [];
    if (improvement !== null) {
      if (improvement > 0)
        list.push({ icon: <TrendingUp size={14} />, text: `You improved by +${improvement}% relative to your previous attempt`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" });
      else if (improvement < 0)
        list.push({ icon: <TrendingDown size={14} />, text: `Your score dropped by ${improvement}% relative to your previous attempt`, color: "text-red-500 bg-red-50 border-red-200" });
      else
        list.push({ icon: <Minus size={14} />, text: "Your score was the same as your previous attempt", color: "text-muted-foreground bg-muted/40 border-border" });
    }
    if (weakest && sectionStats.length > 1)
      list.push({ icon: <Target size={14} />, text: `Weakest section: "${weakest.name}" (${weakest.accuracy}% accuracy, based on last 5 attempts)`, color: "text-red-500 bg-red-50 border-red-200" });
    if (strongest && sectionStats.length > 1)
      list.push({ icon: <Zap size={14} />, text: `Strongest section: "${strongest.name}" (${strongest.accuracy}% accuracy)`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" });
    if (consistencyScore !== null) {
      if (consistencyScore >= 80)
        list.push({ icon: <BarChart2 size={14} />, text: `Very consistent scorer — consistency score ${consistencyScore}/100`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" });
      else if (consistencyScore < 50)
        list.push({ icon: <BarChart2 size={14} />, text: `High score variance detected — consistency score ${consistencyScore}/100. Focus on steady performance.`, color: "text-amber-500 bg-amber-50 border-amber-200" });
    }
    if (percentile !== null)
      list.push({ icon: <Users size={14} />, text: `You are ahead of ${percentile}% of users on the selected test`, color: "text-primary bg-primary/10 border-primary/20" });
    if (timeStats && timeStats.avgSecondsPerQ > 0)
      list.push({ icon: <Clock size={14} />, text: `You spend an average of ${formatSeconds(timeStats.avgSecondsPerQ)} per question`, color: "text-muted-foreground bg-muted/30 border-border" });
    if (analytics && analytics.totalAttempts >= 5 && analytics.averageScore >= 80)
      list.push({ icon: <Award size={14} />, text: `Excellent! Your average score of ${analytics.averageScore}% across all tests is outstanding`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" });
    return list;
  }, [improvement, weakest, strongest, consistencyScore, percentile, timeStats, analytics, sectionStats.length]);

  const handleTestChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setTestId(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setFilterTestId(e.target.value);
  }, []);

  // ── loading / error states ───────────────────────────────────────────────

  const isLoading = analyticsQuery.isLoading || attemptsQuery.isLoading || catalogLoading;
  const error = analyticsQuery.error || attemptsQuery.error || catalogError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your performance data…</p>
        </div>
      </div>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-red-700">Failed to load data. {message}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics && allAttempts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BarChart3 size={28} />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No data yet</h2>
          <p className="text-sm text-muted-foreground">Complete a mock test to see your performance analytics here.</p>
        </div>
      </div>
    );
  }

  const filterLabel = filterTestId ? tests.find((t) => t.id === filterTestId)?.name ?? "Selected test" : null;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-foreground">My Performance</h1>
              {improvement !== null && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  improvement > 5
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : improvement < -5
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-sky-50 border-sky-200 text-sky-700"
                }`}>
                  {improvement > 5 ? "🔥 On Fire" : improvement < -5 ? "⚠️ Needs Focus" : "🎯 Consistent"}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">Track your progress, identify weak areas, and beat the leaderboard.</p>
          </div>
          {/* Analytics filter */}
          <div className="flex-shrink-0 w-full sm:w-64">
            <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              <Filter size={12} /> Filter analytics by test
            </label>
            <select
              value={filterTestId}
              onChange={handleFilterChange}
              className="w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={tests.length === 0}
            >
              <option value="">All tests</option>
              {testOptions}
            </select>
          </div>
        </div>

        {filterLabel && (
          <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 w-fit">
            <Filter size={11} />
            <span>Showing analytics for: <span className="font-semibold">{filterLabel}</span></span>
            <button type="button" className="ml-1 text-primary/60 hover:text-primary" onClick={() => setFilterTestId("")}>✕</button>
          </div>
        )}

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Average Score"
            value={filterLabel ? (avgScore != null ? `${avgScore}%` : "—") : (analytics ? `${analytics.averageScore}%` : "—")}
            sub={filterLabel ? `For ${filterLabel}` : "Across all tests"}
            tooltip="Mean score across all selected attempts"
            icon={<BarChart3 size={18} />}
            accent={avgScore != null ? scoreColor(avgScore) : (analytics ? scoreColor(analytics.averageScore) : "text-primary")}
            bg={avgScore != null ? scoreBg(avgScore) : (analytics ? scoreBg(analytics.averageScore) : "bg-primary/10")}
          />
          <StatCard
            label="Best Score"
            value={analytics ? `${analytics.highestScore}%` : "—"}
            sub="Personal best"
            tooltip="Your highest score across all attempts"
            icon={<Trophy size={18} />}
            accent="text-amber-500"
            bg="bg-amber-50"
          />
          <StatCard
            label="Total Attempts"
            value={filterLabel ? filteredAttempts.length : (analytics?.totalAttempts ?? allAttempts.length)}
            sub={filterLabel ? `For selected test` : "Tests completed"}
            tooltip="Total number of test attempts"
            icon={<BookOpen size={18} />}
            accent="text-primary"
            bg="bg-primary/10"
          />
          <StatCard
            label="Accuracy"
            value={overallAccuracy != null ? `${overallAccuracy}%` : "—"}
            sub="Correct answers overall"
            tooltip="(Total correct / Total questions) × 100 across selected attempts"
            icon={<Target size={18} />}
            accent={overallAccuracy != null ? scoreColor(overallAccuracy) : "text-primary"}
            bg={overallAccuracy != null ? scoreBg(overallAccuracy) : "bg-primary/10"}
          />
          {/* Improvement */}
          {improvement !== null && (
            <StatCard
              label="Improvement"
              value={improvement > 0 ? `+${improvement}%` : `${improvement}%`}
              sub="vs previous attempt"
              tooltip="Percentage change: ((last score − previous score) / previous score) × 100"
              icon={improvement > 0 ? <TrendingUp size={18} /> : improvement < 0 ? <TrendingDown size={18} /> : <Minus size={18} />}
              accent={improvement > 0 ? "text-emerald-600" : improvement < 0 ? "text-red-500" : "text-muted-foreground"}
              bg={improvement > 0 ? "bg-emerald-50" : improvement < 0 ? "bg-red-50" : "bg-muted/40"}
            />
          )}
          {/* Consistency */}
          {consistencyScore !== null && (
            <StatCard
              label="Consistency"
              value={`${consistencyScore}/100`}
              sub={consistencyScore >= 80 ? "Very consistent" : consistencyScore >= 60 ? "Moderate variance" : "High variance"}
              tooltip="100 − (2 × score standard deviation). Higher = more consistent results."
              icon={<BarChart2 size={18} />}
              accent={consistencyColor(consistencyScore)}
              bg={consistencyScore >= 80 ? "bg-emerald-50" : consistencyScore >= 60 ? "bg-amber-50" : "bg-red-50"}
            />
          )}
          {/* Strongest section */}
          {strongest && sectionStats.length > 1 && (
            <StatCard
              label="Strongest Section"
              value={`${strongest.accuracy}%`}
              sub={strongest.name}
              tooltip="Highest accuracy section based on last 5 attempts (recency-weighted)"
              icon={<Zap size={18} />}
              accent="text-emerald-600"
              bg="bg-emerald-50"
            />
          )}
          {/* Weakest section */}
          {weakest && sectionStats.length > 1 && weakest.name !== strongest?.name && (
            <StatCard
              label="Weakest Section"
              value={`${weakest.accuracy}%`}
              sub={weakest.name}
              tooltip="Lowest accuracy section based on last 5 attempts (recency-weighted)"
              icon={<Target size={18} />}
              accent="text-red-500"
              bg="bg-red-50"
            />
          )}
          {/* Time stats */}
          {timeStats && (
            <>
              <StatCard
                label="Avg Time / Question"
                value={formatSeconds(timeStats.avgSecondsPerQ)}
                sub="Across selected attempts"
                tooltip="Total time spent ÷ total questions answered"
                icon={<Timer size={18} />}
                accent="text-primary"
                bg="bg-primary/10"
              />
              <StatCard
                label="Total Time Spent"
                value={formatMinutes(timeStats.totalMinutes)}
                sub="In practice"
                tooltip="Sum of time across all selected attempts"
                icon={<Clock size={18} />}
                accent="text-primary"
                bg="bg-primary/10"
              />
            </>
          )}
        </div>

        {/* ── Performance Insights ── */}
        {insights.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-primary" /> Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {insights.map((ins, i) => (
                  <div key={i} className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium ${ins.color}`}>
                    <span className="mt-0.5 flex-shrink-0">{ins.icon}</span>
                    <span>{ins.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Recommended Practice ── */}
        {latestRealTestId && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-primary" /> Recommended Practice
              </CardTitle>
              <p className="text-xs text-muted-foreground">Personalized based on your weakest section</p>
            </CardHeader>
            <CardContent>
              {weakAreaSections.length === 0 ? (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-emerald-700 font-medium">You are performing well. Try a full test.</p>
                  <button
                    type="button"
                    onClick={() => setLocation("/exams")}
                    className="flex-shrink-0 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Browse Tests
                  </button>
                </div>
              ) : (() => {
                const rec = weakAreaSections[0];
                return (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-foreground truncate">{rec.name}</span>
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border ${
                          rec.accuracy >= 50 ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-red-50 border-red-200 text-red-700"
                        }`}>{rec.accuracy}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            rec.accuracy >= 50 ? "bg-amber-400" : "bg-red-500"
                          }`}
                          style={{ width: `${rec.accuracy}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">Up to 15 questions · Practice mode · No timer</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocation(`/test/${latestRealTestId}?section=${encodeURIComponent(rec.name)}`)}
                      className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Start Practice
                    </button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* ── Weak Areas ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-red-500" /> Weak Areas
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Sections with &lt;60% accuracy across last 5 attempts (min 5 questions)
            </p>
          </CardHeader>
          <CardContent>
            {weakAreaSections.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">You are performing well across all sections</p>
              </div>
            ) : (
              <div className="space-y-4">
                {weakCoreAreas.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Core Areas</p>
                    <div className="space-y-2.5">
                      {weakCoreAreas.map((s) => (
                        <div key={s.name} className="flex items-center gap-3">
                          <span className="text-xs text-foreground font-medium w-28 truncate flex-shrink-0" title={s.name}>{s.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                s.accuracy >= 50 ? "bg-amber-400" : "bg-red-500"
                              }`}
                              style={{ width: `${s.accuracy}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold w-10 text-right ${
                            s.accuracy >= 50 ? "text-amber-600" : "text-red-500"
                          }`}>{s.accuracy}%</span>
                          {latestRealTestId && (
                            <button
                              type="button"
                              onClick={() => setLocation(`/test/${latestRealTestId}?section=${encodeURIComponent(s.name)}`)}
                              className="text-[11px] px-2 py-1 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
                            >
                              Practice
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {weakOtherAreas.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Other Areas</p>
                    <div className="space-y-2.5">
                      {weakOtherAreas.map((s) => (
                        <div key={s.name} className="flex items-center gap-3">
                          <span className="text-xs text-foreground font-medium w-28 truncate flex-shrink-0" title={s.name}>{s.name}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                s.accuracy >= 50 ? "bg-amber-400" : "bg-red-500"
                              }`}
                              style={{ width: `${s.accuracy}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold w-10 text-right ${
                            s.accuracy >= 50 ? "text-amber-600" : "text-red-500"
                          }`}>{s.accuracy}%</span>
                          {latestRealTestId && (
                            <button
                              type="button"
                              onClick={() => setLocation(`/test/${latestRealTestId}?section=${encodeURIComponent(s.name)}`)}
                              className="text-[11px] px-2 py-1 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
                            >
                              Practice
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Score Trend Chart ── */}
        {chartData.length >= 2 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Score Trend</CardTitle>
              <p className="text-xs text-muted-foreground">
                All real attempts in chronological order{filterLabel ? ` · ${filterLabel}` : ""}
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="label"
                    angle={-40}
                    textAnchor="end"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    height={60}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  {avgScore != null && (
                    <ReferenceLine
                      y={avgScore}
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="4 4"
                      label={{ value: `avg ${avgScore}%`, position: "insideTopRight", fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                  )}
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(v: number, _name: string, props: { payload?: { change: number | null } }) => {
                      const change = props?.payload?.change;
                      const changeStr = change !== null && change !== undefined
                        ? ` (${change > 0 ? "+" : ""}${change}%)`
                        : "";
                      return [`${v}%${changeStr}`, "Score"];
                    }}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.testName ?? label}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={(props: { cx: number; cy: number; value: number; index: number }) => {
                      const { cx, cy, value, index } = props;
                      const fill = value >= 75 ? "#10b981" : value >= 50 ? "#f59e0b" : "#ef4444";
                      return <circle key={index} cx={cx} cy={cy} r={4} fill={fill} />;
                    }}
                    activeDot={{ r: 6 }}
                    name="Score %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* ── Section-wise Analysis ── */}
        {sectionStats.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Section-wise Analysis</CardTitle>
              <p className="text-xs text-muted-foreground">
                Recency-weighted accuracy from last 5 attempts{filterLabel ? ` · ${filterLabel}` : ""}
              </p>
            </CardHeader>
            <CardContent>
              {sectionStats.length >= 3 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={sectionStats} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      angle={-35}
                      textAnchor="end"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      height={60}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                      formatter={(v: number) => [`${v}%`, "Accuracy"]}
                    />
                    <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                      {sectionStats.map((s, i) => (
                        <Cell
                          key={i}
                          fill={
                            i === 0
                              ? "#10b981"
                              : i === sectionStats.length - 1
                              ? "#ef4444"
                              : "hsl(var(--primary))"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="space-y-2.5">
                  {sectionStats.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-36 truncate flex-shrink-0" title={s.name}>{s.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${i === 0 ? "bg-emerald-500" : i === sectionStats.length - 1 ? "bg-red-400" : "bg-primary"}`}
                          style={{ width: `${s.accuracy}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold w-10 text-right ${scoreColor(s.accuracy)}`}>{s.accuracy}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Recent Attempts ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Recent Attempts{filterLabel ? <span className="text-muted-foreground font-normal text-sm ml-2">· {filterLabel}</span> : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAttempts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No attempts recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Test</th>
                      <th className="text-right py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Score</th>
                      <th className="text-center py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Accuracy</th>
                      <th className="text-right py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Time</th>
                      <th className="text-right py-3 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttempts.slice(0, 20).map((attempt, idx) => {
                      const accuracy = attempt.totalQuestions > 0
                        ? Math.round((attempt.correct / attempt.totalQuestions) * 100)
                        : 0;
                      const avgTime = attempt.timeSpent > 0 && attempt.totalQuestions > 0
                        ? Math.round(attempt.timeSpent / attempt.totalQuestions)
                        : null;
                      return (
                        <tr key={`${attempt.testId}-${attempt.date}-${idx}`} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3 text-foreground font-medium text-sm">{attempt.testName}</td>
                          <td className="text-right py-3 px-3">
                            <span className={`font-bold text-sm ${scoreColor(attempt.score)}`}>{attempt.score}%</span>
                          </td>
                          <td className="text-center py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${scoreBg(accuracy)} ${scoreColor(accuracy)}`}>
                              {accuracy}%
                            </span>
                          </td>
                          <td className="text-right py-3 px-3 text-muted-foreground text-xs hidden sm:table-cell">
                            {avgTime != null ? <span title="Avg time per question">{formatSeconds(avgTime)}/q</span> : "—"}
                          </td>
                          <td className="text-right py-3 px-3 text-muted-foreground text-xs hidden sm:table-cell">
                            {new Date(attempt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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

        {/* ── Leaderboard ── */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Leaderboard
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time rankings based on best attempt scores.
                </p>
                {selectedTest && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Showing: <span className="font-semibold text-foreground">{selectedTest.name}</span>
                  </p>
                )}
              </div>
              <div className="w-full sm:w-72 flex-shrink-0">
                <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="leaderboard-test-select">
                  Select test
                </label>
                <select
                  id="leaderboard-test-select"
                  value={testId}
                  onChange={handleTestChange}
                  className="w-full cursor-pointer rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={catalogLoading || tests.length === 0}
                >
                  <option value="" disabled>
                    {catalogLoading ? "Loading tests…" : tests.length === 0 ? "No tests available" : "Choose a test…"}
                  </option>
                  {testOptions}
                </select>
              </div>
            </div>

            {testId && !leaderboardLoading && currentUserRow && topperScore != null && (
              <div className="mt-4 p-3 rounded-xl border border-border bg-muted/20">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Your score vs topper</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground w-14 flex-shrink-0">Topper</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: "100%" }} />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600 w-12 text-right">{topperScore.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-primary font-medium w-14 flex-shrink-0">You</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          currentUserRow.score >= 75 ? "bg-emerald-500" : currentUserRow.score >= 50 ? "bg-amber-500" : "bg-red-400"
                        }`}
                        style={{ width: `${(currentUserRow.score / topperScore) * 100}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-semibold w-12 text-right ${currentUserRow.score >= 75 ? "text-emerald-600" : currentUserRow.score >= 50 ? "text-amber-600" : "text-red-500"}`}>
                      {currentUserRow.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
            {testId && !leaderboardLoading && currentUserRow && (
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs" title="Your rank in this test">
                  <Trophy size={12} className="text-primary" />
                  <span className="text-muted-foreground">Your rank:</span>
                  <span className="font-bold text-foreground">#{currentUserRow.rank}</span>
                </div>
                {topperScore != null && userScoreDiff != null && (
                  <div
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${userScoreDiff >= 0 ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
                    title="Difference between your score and the top scorer"
                  >
                    <span className="text-muted-foreground">vs topper:</span>
                    <span className={`font-bold ${userScoreDiff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {userScoreDiff >= 0 ? `+${userScoreDiff}%` : `${userScoreDiff}%`}
                    </span>
                  </div>
                )}
                {percentile !== null && (
                  <div
                    className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs"
                    title="Percentile = ((total users − your rank) / total users) × 100"
                  >
                    <Users size={12} className="text-primary" />
                    <span className="text-muted-foreground">Percentile:</span>
                    <span className="font-bold text-foreground">{percentile}th</span>
                  </div>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {!testId ? (
              <div className="rounded-2xl border border-border bg-muted/20 p-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Trophy className="w-5 h-5" />
                </div>
                <p className="font-semibold text-foreground">Select a test to view its leaderboard</p>
                <p className="mt-1 text-xs text-muted-foreground">Choose from the dropdown above.</p>
              </div>
            ) : leaderboardLoading ? (
              <div className="py-10 text-center">
                <div className="mx-auto h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Loading leaderboard…</p>
              </div>
            ) : leaderboardError ? (
              <div className="py-10 text-center">
                <AlertCircle className="mx-auto mb-2 text-red-400" size={24} />
                <p className="text-sm text-muted-foreground">Could not load leaderboard. Please try again.</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-10 text-center">
                <BookOpen className="mx-auto mb-2 text-muted-foreground/50" size={24} />
                <p className="text-sm text-muted-foreground">No attempts recorded for this test yet.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-2.5 bg-muted/50 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-7">User</div>
                  <div className="col-span-4 text-right">Score</div>
                </div>
                <div className="divide-y divide-border">
                  {leaderboard.map((row) => {
                    const isCurrent = user?.id === row.userId;
                    const medal = row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : null;
                    return (
                      <div
                        key={`${row.userId}-${row.rank}`}
                        className={`grid grid-cols-12 px-4 py-3 items-center transition-colors ${isCurrent ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-muted/20"}`}
                      >
                        <div className="col-span-1">
                          {medal ? (
                            <span className="text-base">{medal}</span>
                          ) : (
                            <span className="text-sm font-bold text-muted-foreground">#{row.rank}</span>
                          )}
                        </div>
                        <div className="col-span-7 min-w-0 flex items-center gap-2">
                          <p className={`text-sm font-semibold truncate ${isCurrent ? "text-primary" : "text-foreground"}`}>{row.userName}</p>
                          {isCurrent && <Badge variant="secondary" className="text-[10px] flex-shrink-0">You</Badge>}
                        </div>
                        <div className="col-span-4 text-right">
                          <span className={`text-sm font-bold ${scoreColor(row.score)}`}>{row.score.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {showUserRank && (
              <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Your global rank for this test</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">#{leaderboardData?.currentUserRank}</p>
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  Outside the top {leaderboardSize} but still ranked globally.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

