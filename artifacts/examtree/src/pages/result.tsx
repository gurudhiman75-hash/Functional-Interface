import { useMemo, useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { getLocalizedQuestion, LANGUAGE_LABELS, type Language } from "@/lib/lang-utils";
import {
  ArrowRight,
  Award,
  BarChart2,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  ExternalLink,
  Flag,
  Lightbulb,
  Lock,
  Map,
  MinusCircle,
  RotateCcw,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAttemptRecords, getAttemptResponses, getAttempts, getPercentileHistory, getStreak, acknowledgeStreakCelebration, getUser, recordPercentile, recordDailyChallengeCompleted, isDailyChallengeCompletedToday, type TestAttempt } from "@/lib/storage";
import { MicroReward, type Reward } from "@/components/MicroReward";
import { getAttemptById, getCategoryFreeTestIds, getDailyChallenge, getLeaderboard, getPackagesByCategory, getPackagesByTest, getResponsesByAttemptId, getTests, getWeakAreaAnalysis } from "@/lib/data";
import { useMyEntitlements } from "@/hooks/use-my-entitlements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionRichText } from "@/components/QuestionRichText";

type ReviewFilter = "all" | "wrong" | "flagged" | "unanswered";
type ReviewItem = {
  questionId: number;
  section: string;
  text: string;
  options: string[];
  textHi?: string;
  textPa?: string;
  optionsHi?: string[];
  optionsPa?: string[];
  explanationHi?: string;
  explanationPa?: string;
  selected: number | null;
  correct: number;
  flagged: boolean;
  explanation: string;
};

function getGrade(score: number) {
  if (score >= 90) return { label: "Outstanding", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
  if (score >= 80) return { label: "Excellent", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" };
  if (score >= 70) return { label: "Good", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" };
  if (score >= 60) return { label: "Average", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" };
  return { label: "Needs Work", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" };
}

function getAnswerLabel(index: number) {
  return String.fromCharCode(65 + index);
}

function getReviewState(item: ReviewItem) {
  if (item.selected === null) return "unanswered";
  if (item.selected === item.correct) return "correct";
  return "wrong";
}

export default function Result() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const { data: entitlements } = useMyEntitlements();
  const attempts = getAttempts();
  const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const requestedTestId = query?.get("testId");
  const serverAttemptId = query?.get("attemptId") ?? null;
  const isWrongOnlyResult = query?.get("wrongOnly") === "true";
  const sectionPracticeParam = query?.get("section") ?? null;
  const requestedTab =
    query?.get("tab") === "review" ? "review" : query?.get("tab") === "analysis" ? "analysis" : "summary";
  const relevantAttempts = requestedTestId
    ? attempts.filter((attempt) => attempt.testId === requestedTestId)
    : attempts;
  const localLatest = relevantAttempts[0] ?? null;
  const activeTestId = requestedTestId ?? localLatest?.testId ?? "";
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ["leaderboard-rank", activeTestId],
    queryFn: () => getLeaderboard(activeTestId),
    enabled: Boolean(activeTestId && user),
    staleTime: 60_000,
  });

  const { data: dailyChallenge } = useQuery({
    queryKey: ["daily-challenge"],
    queryFn: getDailyChallenge,
    staleTime: 300_000,
    retry: false,
  });

  // Fetch all tests to get the global avgScore for this test
  const { data: allTests } = useQuery({
    queryKey: ["tests"],
    queryFn: getTests,
    staleTime: 300_000,
  });

  // Backend fetch when attemptId is present in URL
  const { data: backendAttempt, isLoading: backendAttemptLoading } = useQuery({
    queryKey: ["attempt-by-id", serverAttemptId],
    queryFn: () => getAttemptById(serverAttemptId!),
    enabled: Boolean(serverAttemptId && user),
    retry: false,
    staleTime: 60_000,
  });

  const { data: backendResponses, isLoading: backendResponsesLoading } = useQuery({
    queryKey: ["responses-by-attempt", serverAttemptId],
    queryFn: () => getResponsesByAttemptId(serverAttemptId!),
    enabled: Boolean(serverAttemptId && user),
    retry: false,
    staleTime: 60_000,
  });

  const { data: weakAreaData, isLoading: weakAreaLoading } = useQuery({
    queryKey: ["weak-areas", serverAttemptId ?? "aggregate"],
    queryFn: () => getWeakAreaAnalysis(serverAttemptId ?? undefined),
    enabled: Boolean(user),
    retry: false,
    staleTime: 300_000,
  });

  const { data: suggestedPackages } = useQuery({
    queryKey: ["packages-by-test", activeTestId],
    queryFn: () => getPackagesByTest(activeTestId),
    enabled: Boolean(activeTestId && user),
    retry: false,
    staleTime: 600_000,
  });

  // Fallback: category-level packages when the test isn't part of any package
  // Use localLatest here because `latest` is declared further down
  const categoryName = localLatest?.category ?? "";
  const { data: categoryPackages } = useQuery({
    queryKey: ["packages-by-category", categoryName],
    queryFn: () => getPackagesByCategory(categoryName),
    enabled: Boolean(categoryName && user && suggestedPackages !== undefined && suggestedPackages.length === 0),
    retry: false,
    staleTime: 600_000,
  });

  // Free test access limit tracking — fetch all free test IDs in this category
  const { data: categoryFreeTests } = useQuery({
    queryKey: ["category-free-ids", categoryName],
    queryFn: () => getCategoryFreeTestIds(categoryName),
    enabled: Boolean(categoryName),
    retry: false,
    staleTime: 600_000,
  });
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>(
    query?.get("filter") === "wrong" ? "wrong" : "all",
  );

  // Prefer backend attempt when attemptId is in the URL, else fall back to localStorage
  const latest: TestAttempt | null = (serverAttemptId && backendAttempt) ? (backendAttempt as TestAttempt) : localLatest;
  const questionReview = latest?.questionReview ?? [];

  const reviewCounts = useMemo(() => {
    const counts = { all: questionReview.length, correct: 0, wrong: 0, flagged: 0, unanswered: 0 };
    for (const item of questionReview) {
      const state = getReviewState(item);
      if (state === "correct") counts.correct += 1;
      if (state === "wrong") counts.wrong += 1;
      if (state === "unanswered") counts.unanswered += 1;
      if (item.flagged) counts.flagged += 1;
    }
    return counts;
  }, [questionReview]);

  const filteredReview = useMemo(() => {
    switch (reviewFilter) {
      case "wrong":
        return questionReview.filter((item) => getReviewState(item) === "wrong");
      case "flagged":
        return questionReview.filter((item) => item.flagged);
      case "unanswered":
        return questionReview.filter((item) => getReviewState(item) === "unanswered");
      default:
        return questionReview;
    }
  }, [questionReview, reviewFilter]);

  // Per-question timing: prefer backend responses, fall back to localStorage
  const matchingAttemptRecord = useMemo(() => {
    if (!latest || backendResponses) return null;
    return (
      getAttemptRecords().find(
        (r) => r.testId === latest.testId && r.mode === (latest.attemptType ?? "REAL"),
      ) ?? null
    );
  }, [latest, backendResponses]);

  const questionResponses = useMemo(() => {
    if (backendResponses && backendResponses.length > 0) return backendResponses;
    if (!matchingAttemptRecord) return [];
    return getAttemptResponses(matchingAttemptRecord.id);
  }, [backendResponses, matchingAttemptRecord]);

  const avgTimePerQuestion = useMemo(() => {
    if (questionResponses.length > 0) {
      const total = questionResponses.reduce((sum, r) => sum + r.timeTaken, 0);
      return Math.round(total / questionResponses.length);
    }
    if (!latest) return 0;
    return Math.round((latest.timeSpent * 60) / Math.max(latest.totalQuestions, 1));
  }, [questionResponses, latest]);

  const avgTimeBySectionFromResponses = useMemo((): Record<string, number> => {
    if (questionResponses.length === 0) return {};
    const qSectionMap: Record<number, string> = {};
    for (const qr of questionReview) qSectionMap[qr.questionId] = qr.section;
    const buckets: Record<string, number[]> = {};
    for (const resp of questionResponses) {
      const section = qSectionMap[resp.questionId];
      if (section) (buckets[section] ??= []).push(resp.timeTaken);
    }
    return Object.fromEntries(
      Object.entries(buckets).map(([name, times]) => [
        name,
        Math.round(times.reduce((s, t) => s + t, 0) / times.length),
      ]),
    );
  }, [questionResponses, questionReview]);

  // ── Review language state ─────────────────────────────────────────────────
  const [reviewLang, setReviewLang] = useState<Language>("en");

  const reviewAvailableLangs = useMemo(() => {
    const langs: Language[] = ["en"];
    if (questionReview.some((item) => Boolean(item.textHi))) langs.push("hi");
    if (questionReview.some((item) => Boolean(item.textPa))) langs.push("pa");
    return langs;
  }, [questionReview]);

  // ── Navigation panel state ───────────────────────────────────────────────
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const filteredIds = useMemo(
    () => new Set(filteredReview.map((i) => i.questionId)),
    [filteredReview],
  );

  const nextWrongFromActive = useCallback(() => {
    const wrongItems = filteredReview.filter((item) => getReviewState(item) === "wrong");
    if (wrongItems.length === 0) return;
    const currentIdx = activeQuestionId
      ? wrongItems.findIndex((item) => item.questionId === activeQuestionId)
      : -1;
    const nextItem = wrongItems[(currentIdx + 1) % wrongItems.length];
    document
      .getElementById(`question-${nextItem.questionId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filteredReview, activeQuestionId]);

  useEffect(() => {
    if (filteredReview.length === 0) return;
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.45;
      for (const item of filteredReview) {
        const el = document.getElementById(`question-${item.questionId}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top >= -80 && rect.top < threshold) {
          setActiveQuestionId(item.questionId);
          return;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredReview]);

  if (serverAttemptId && (backendAttemptLoading || backendResponsesLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading result...</div>
      </div>
    );
  }

  // ── Improvement vs previous attempt for this test ─────────────────────────
  // relevantAttempts is ordered newest-first; localLatest is index 0, previous is index 1.
  const lastRealAttemptForTest = useMemo(() => {
    const realOnes = relevantAttempts.filter(
      (a) => (!a.attemptType || a.attemptType === "REAL") && a !== localLatest,
    );
    return realOnes[0] ?? null;
  }, [relevantAttempts, localLatest]);

  const scoreImprovementDelta = useMemo(() => {
    if (!lastRealAttemptForTest || !latest) return null;
    return Math.round((latest.score - lastRealAttemptForTest.score) * 10) / 10;
  }, [latest, lastRealAttemptForTest]);

  // Per-section accuracy delta: current – previous (positive = improved)
  const sectionImprovements = useMemo(() => {
    if (!lastRealAttemptForTest?.sectionStats || !latest?.sectionStats) return null;
    type SectionStat = { name: string; accuracy: number };
    const prevMap: Record<string, SectionStat> = {};
    for (const s of lastRealAttemptForTest.sectionStats) prevMap[s.name] = s;
    return latest.sectionStats
      .filter((s) => s.name in prevMap)
      .map((s) => {
        const delta = Math.round((s.accuracy - prevMap[s.name].accuracy) * 10) / 10;
        return { name: s.name, current: s.accuracy, previous: prevMap[s.name].accuracy, delta };
      });
  }, [latest, lastRealAttemptForTest]);

  if (!latest) {
    return (
      <div className="min-h-screen bg-background">

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-[2rem] border border-border bg-card/85 p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {requestedTestId ? "No completed attempt found" : "No result available yet"}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {requestedTestId
                ? "You can retry this test now and come back here for the solution review."
                : "Complete a test first and this page will show your real score breakdown, section analysis, timing data, and solution review."}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => setLocation(requestedTestId ? `/test/${requestedTestId}` : "/exams")} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {requestedTestId ? "Retry Test" : "Start a Test"}
              </Button>
              {requestedTestId && (
                <Button variant="outline" onClick={() => setLocation("/result")}>
                  View Latest Result
                </Button>
              )}
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const grade = getGrade(latest.score);
  const accuracy = Math.round((latest.correct / (latest.correct + latest.wrong)) * 100) || 0;

  // For wrongOnly results: find the original REAL attempt to show improvement
  const previousRealAttempt = isWrongOnlyResult && activeTestId
    ? attempts.find((a) => a.testId === activeTestId && a.attemptType === "REAL")
    : null;
  const improvementDelta = previousRealAttempt ? latest.score - previousRealAttempt.score : null;

  // For section practice results: compare section accuracy against last REAL attempt
  const previousRealAttemptForSection = sectionPracticeParam && activeTestId
    ? attempts.find((a) => a.testId === activeTestId && (!a.attemptType || a.attemptType === "REAL"))
    : null;
  const previousSectionAccuracy = previousRealAttemptForSection?.sectionStats
    ?.find((s) => s.name.toLowerCase() === (sectionPracticeParam ?? "").toLowerCase())?.accuracy ?? null;
  const currentSectionAccuracy = sectionPracticeParam
    ? (latest.sectionStats?.find((s) => s.name.toLowerCase() === sectionPracticeParam.toLowerCase())?.accuracy ?? null)
    : null;
  const sectionImprovementDelta = (currentSectionAccuracy !== null && previousSectionAccuracy !== null)
    ? Math.round((currentSectionAccuracy - previousSectionAccuracy) * 10) / 10
    : null;

  const averageScore =
    attempts.length > 0 ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length : latest.score;
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((attempt) => attempt.score)) : latest.score;
  const totalAttempts = attempts.length;

  // Global average score for this test (from the tests catalogue: updated server-side after each attempt)
  const globalAvgScore = useMemo(() => {
    if (!allTests || !activeTestId) return null;
    const testMeta = allTests.find((t) => t.id === activeTestId);
    return testMeta?.avgScore ?? null;
  }, [allTests, activeTestId]);

  // ── Percentile derived from leaderboard data ──────────────────────────────
  // topPercent: lower = better. 5 means "you beat 95% of participants".
  const currentPercentile = useMemo(() => {
    const rank = leaderboardData?.currentUserRank;
    const total = leaderboardData?.totalParticipants;
    if (!rank || !total || total < 1) return null;
    return Math.max(1, Math.ceil((rank / total) * 100));
  }, [leaderboardData]);

  // Persist & compare for improvement banner
  const previousPercentile = useMemo(() => {
    if (!activeTestId) return null;
    return getPercentileHistory()[activeTestId] ?? null;
  }, [activeTestId]);

  // Record current percentile whenever it resolves and differs
  // ---- Micro rewards ----
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const pending: Reward[] = [];

    // Streak increase
    const streak = getStreak();
    if (streak.justIncremented) {
      pending.push({
        id: "streak",
        emoji: "🔥",
        title: `${streak.currentStreak}-day streak!`,
        subtitle: "Keep it up — you're on a roll.",
      });
      acknowledgeStreakCelebration();
    }

    // Score improvement
    if (scoreImprovementDelta !== null && scoreImprovementDelta > 0) {
      pending.push({
        id: "improvement",
        emoji: "📈",
        title: `Up +${scoreImprovementDelta}% from last time`,
        subtitle: "Great improvement!",
      });
    }

    // High percentile (top 10%)
    if (currentPercentile !== null && currentPercentile <= 10) {
      pending.push({
        id: "percentile",
        emoji: "🏅",
        title: `Top ${currentPercentile}%`,
        subtitle: "You're among the best!",
      });
    }

    if (pending.length > 0) setRewards(pending);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPercentile !== null && activeTestId) {
      recordPercentile(activeTestId, currentPercentile);
    }
  }, [currentPercentile, activeTestId]);

  // Daily challenge: record completion when this test is today's challenge
  const isCompletedDailyChallenge = Boolean(
    dailyChallenge &&
      activeTestId === dailyChallenge.testId &&
      latest?.attemptType === "REAL",
  );
  useEffect(() => {
    if (isCompletedDailyChallenge && dailyChallenge) {
      recordDailyChallengeCompleted(dailyChallenge.testId);
    }
  }, [isCompletedDailyChallenge, dailyChallenge]);

  // Whether this challenge was already done before opening results (already stored)
  const wasChallengeAlreadyDone = Boolean(
    dailyChallenge && isDailyChallengeCompletedToday(dailyChallenge.testId),
  );


  // "Improvement" means moving to a lower (better) percentile band
  const percentileImproved =
    currentPercentile !== null &&
    previousPercentile !== null &&
    currentPercentile < previousPercentile;


  const sectionStats = latest.sectionStats ?? [];
  const sectionTimeSpent = latest.sectionTimeSpent ?? [];

  const reviewChips: { key: ReviewFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: reviewCounts.all },
    { key: "wrong", label: "Wrong", count: reviewCounts.wrong },
    { key: "flagged", label: "Flagged", count: reviewCounts.flagged },
    { key: "unanswered", label: "Unanswered", count: reviewCounts.unanswered },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MicroReward
        rewards={rewards}
        onDismiss={(id) => setRewards((prev) => prev.filter((r) => r.id !== id))}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center mb-8 shadow-sm" data-testid="result-hero">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${grade.bg} ${grade.color}`}>
            <Award className="w-4 h-4" />
            {grade.label}
          </div>
          <p className="text-blue-100 text-sm mb-1">Your Score</p>
          <h1 className="text-6xl sm:text-7xl font-bold mb-2" data-testid="result-score">{latest.score}%</h1>
          <p className="text-blue-100">{latest.testName}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-blue-100">
            <span>{latest.category}</span>
            <span className="text-white/60">•</span>
            <span>{totalAttempts} completed {totalAttempts === 1 ? "attempt" : "attempts"} on this device</span>
          </div>
          {scoreImprovementDelta !== null && (
            <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${
              scoreImprovementDelta > 0
                ? "bg-emerald-500/20 text-emerald-200"
                : scoreImprovementDelta < 0
                ? "bg-red-500/20 text-red-200"
                : "bg-white/10 text-blue-100"
            }`}>
              {scoreImprovementDelta > 0 ? "↑" : scoreImprovementDelta < 0 ? "↓" : "→"}
              {scoreImprovementDelta > 0
                ? `You improved by +${scoreImprovementDelta}%`
                : scoreImprovementDelta < 0
                ? `Down ${scoreImprovementDelta}% from last attempt`
                : "Same score as last attempt"}
            </div>
          )}
        </div>

        <Tabs defaultValue={requestedTab} className="space-y-8">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-card/85 p-1 shadow-sm">
            <TabsTrigger value="summary" className="rounded-xl py-2.5 text-sm font-semibold">
              Summary
            </TabsTrigger>
            <TabsTrigger value="analysis" className="rounded-xl py-2.5 text-sm font-semibold">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="review" className="rounded-xl py-2.5 text-sm font-semibold">
              Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-8">

            {/* ── Daily challenge completion banner ── */}
            {(isCompletedDailyChallenge || wasChallengeAlreadyDone) && dailyChallenge && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/20 p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0 text-xl">
                  🎯
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground">You completed today's challenge!</p>
                  <p className="text-sm text-muted-foreground">{dailyChallenge.testName}</p>
                  {dailyChallenge.totalParticipants > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {dailyChallenge.totalParticipants.toLocaleString()} participant{dailyChallenge.totalParticipants !== 1 ? "s" : ""} attempted today
                      {leaderboardData?.currentUserRank
                        ? ` · You rank #${leaderboardData.currentUserRank}`
                        : ""}
                      {currentPercentile !== null
                        ? ` · Top ${currentPercentile}%`
                        : ""}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                  🏆 Completed
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <CheckCircle className="w-5 h-5" />, label: "Correct", value: latest.correct, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                { icon: <XCircle className="w-5 h-5" />, label: "Wrong", value: latest.wrong, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
                { icon: <MinusCircle className="w-5 h-5" />, label: "Skipped", value: latest.unanswered, color: "text-muted-foreground", bg: "bg-muted" },
                { icon: <Clock className="w-5 h-5" />, label: "Time Spent", value: `${latest.timeSpent}m`, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
              ].map((item) => (
                <div key={item.label} className="bg-card/85 border border-border/70 rounded-2xl p-5 shadow-sm text-center surface-hover" data-testid={`stat-${item.label.toLowerCase()}`}>
                  <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center ${item.color} mx-auto mb-2`}>
                    {item.icon}
                  </div>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                  <Trophy className="w-4 h-4 text-primary" />
                  Attempt Summary
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Latest Score</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{latest.score}%</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Average Score</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{averageScore.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Best Score</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{bestScore.toFixed(1)}%</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  These values come from the completed attempts currently stored on this device. For cross-user comparison, visit the Performance page and sign in to see your global rank.
                </p>

                {/* ── vs. Global average ── */}
                {globalAvgScore !== null && globalAvgScore > 0 && (
                  <div className={`mt-4 rounded-2xl border p-4 ${
                    latest.score >= globalAvgScore
                      ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
                      : "border-red-200 dark:border-red-800 bg-red-50/60 dark:bg-red-950/20"
                  }`}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        vs. All users
                      </p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        latest.score >= globalAvgScore
                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                      }`}>
                        {latest.score >= globalAvgScore ? "Above average" : "Below average"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-card/60 border border-border/60 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Your score</p>
                        <p className={`text-xl font-bold ${latest.score >= globalAvgScore ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                          {latest.score}%
                        </p>
                      </div>
                      <div className="rounded-xl bg-card/60 border border-border/60 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Average score</p>
                        <p className="text-xl font-bold text-foreground">{globalAvgScore}%</p>
                      </div>
                    </div>
                    {/* Progress bar comparing the two */}
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-right text-xs text-muted-foreground shrink-0">You</span>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${latest.score >= globalAvgScore ? "bg-emerald-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(100, latest.score)}%` }}
                          />
                        </div>
                        <span className="w-8 text-xs font-semibold text-foreground shrink-0">{latest.score}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-20 text-right text-xs text-muted-foreground shrink-0">Average</span>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-700 bg-muted-foreground/50"
                            style={{ width: `${Math.min(100, globalAvgScore)}%` }}
                          />
                        </div>
                        <span className="w-8 text-xs font-semibold text-foreground shrink-0">{globalAvgScore}%</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {latest.score >= globalAvgScore
                        ? `You scored ${(latest.score - globalAvgScore).toFixed(1)} percentage points above the average.`
                        : `You scored ${(globalAvgScore - latest.score).toFixed(1)} percentage points below the average.`}
                    </p>
                  </div>
                )}
                {user ? (
                  <div className="mt-4 rounded-2xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Global rank</p>
                    {isLeaderboardLoading ? (
                      <p className="mt-2 text-2xl font-bold text-foreground animate-pulse">Fetching…</p>
                    ) : leaderboardData?.currentUserRank ? (
                      <>
                        <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                          <p className="text-2xl font-bold text-foreground">
                            #{leaderboardData.currentUserRank}
                          </p>
                          {currentPercentile !== null && (
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-bold text-primary">
                              Top {currentPercentile}%
                            </span>
                          )}
                        </div>
                        {leaderboardData.totalParticipants && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            out of {leaderboardData.totalParticipants.toLocaleString()} participant{leaderboardData.totalParticipants !== 1 ? "s" : ""}
                          </p>
                        )}
                        {percentileImproved && currentPercentile !== null && previousPercentile !== null && (
                          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2">
                            <span className="text-base">📈</span>
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                              You moved from top {previousPercentile}% → top {currentPercentile}%
                            </p>
                          </div>
                        )}
                        <p className="mt-2 text-sm text-muted-foreground">
                          Your best score is being compared globally for this test.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-2 text-2xl font-bold text-foreground">Not ranked yet</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Complete this test while signed in to appear on the global leaderboard.
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Global rank</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">Sign in to see your rank</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Logging in will let you sync this score and compare it against other users globally.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                  <TimerReset className="w-4 h-4 text-primary" />
                  Section Timing
                </h2>
                {sectionTimeSpent.length === 0 ? (
                  <p className="empty-state text-sm">No sectional timing data was recorded for this attempt.</p>
                ) : (
                  <div className="space-y-3">
                    {sectionTimeSpent.map((section) => (
                      <div key={section.name} className="rounded-xl border border-border/70 bg-muted/40 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{section.name}</p>
                            <p className="text-xs text-muted-foreground">Time invested in this section</p>
                          </div>
                          <span className="text-sm font-bold text-primary">{section.minutesSpent} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Improvement vs Last Attempt ── */}
            {lastRealAttemptForTest && (
              <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Improvement vs Last Attempt
                </h2>

                {/* Overall score delta */}
                <div className={`flex items-center justify-between rounded-xl border px-5 py-4 mb-4 ${
                  scoreImprovementDelta === null
                    ? "border-border/70 bg-muted/40"
                    : scoreImprovementDelta > 0
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                    : scoreImprovementDelta < 0
                    ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                    : "border-border/70 bg-muted/40"
                }`}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">
                      Overall score
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-muted-foreground line-through">
                        {lastRealAttemptForTest.score}%
                      </span>
                      <span className="text-2xl font-bold text-foreground">{latest.score}%</span>
                    </div>
                  </div>
                  {scoreImprovementDelta !== null && (
                    <span className={`text-lg font-bold ${
                      scoreImprovementDelta > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : scoreImprovementDelta < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                    }`}>
                      {scoreImprovementDelta > 0 ? "+" : ""}{scoreImprovementDelta}%
                    </span>
                  )}
                </div>

                {/* Per-section breakdown */}
                {sectionImprovements && sectionImprovements.length > 0 ? (
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                      Section-wise
                    </p>
                    {sectionImprovements.map(({ name, current, previous, delta }) => (
                      <div key={name} className="flex items-center gap-3">
                        <p className="flex-1 text-sm font-medium text-foreground truncate">{name}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground">{previous}%</span>
                          <span className="text-muted-foreground text-xs">→</span>
                          <span className="text-sm font-semibold text-foreground">{current}%</span>
                          <span className={`min-w-[3rem] text-right text-sm font-bold ${
                            delta > 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : delta < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                          }`}>
                            {delta > 0 ? "+" : ""}{delta}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Section-by-section data not available for the previous attempt.
                  </p>
                )}
              </div>
            )}

            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-primary" />
                Strong &amp; Weak Areas
              </h2>
              {weakAreaLoading ? (
                <p className="text-sm text-muted-foreground">Analysing sections…</p>
              ) : !weakAreaData || (weakAreaData.weakestSections.length === 0 && weakAreaData.strongestSections.length === 0) ? (
                <p className="empty-state text-sm">Complete an exam to see your strong and weak section analysis.</p>
              ) : (
                <div className="space-y-5">
                  {weakAreaData.strongestSections.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">Strong Areas</h3>
                      <div className="space-y-3">
                        {weakAreaData.strongestSections.map((s) => (
                          <div key={s.section}>
                            <div className="flex justify-between items-center mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{s.section}</span>
                                {s.trend && (
                                  <span className={`text-xs font-semibold ${
                                    s.trend === "improving" ? "text-emerald-600" :
                                    s.trend === "declining" ? "text-red-600" : "text-muted-foreground"
                                  }`}>{s.trend === "improving" ? "↑" : s.trend === "declining" ? "↓" : "→"} {s.trendLabel}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-emerald-600">{s.accuracy}%</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs px-2"
                                  onClick={() => setLocation(activeTestId ? `/test/${encodeURIComponent(activeTestId)}?section=${encodeURIComponent(s.section)}` : "/exams")}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Practice
                                </Button>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="h-2.5 rounded-full transition-all duration-700 bg-emerald-500" style={{ width: `${s.accuracy}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {weakAreaData.weakestSections.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">Weak Areas</h3>
                      <div className="space-y-3">
                        {weakAreaData.weakestSections.map((s) => (
                          <div key={s.section}>
                            <div className="flex justify-between items-center mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{s.section}</span>
                                {s.trend && (
                                  <span className={`text-xs font-semibold ${
                                    s.trend === "improving" ? "text-emerald-600" :
                                    s.trend === "declining" ? "text-red-600" : "text-muted-foreground"
                                  }`}>{s.trend === "improving" ? "↑" : s.trend === "declining" ? "↓" : "→"} {s.trendLabel}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-red-600">{s.accuracy}%</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 gap-1 border-red-300 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs px-2"
                                  onClick={() => setLocation(activeTestId ? `/test/${encodeURIComponent(activeTestId)}?section=${encodeURIComponent(s.section)}` : "/exams")}
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Practice
                                </Button>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="h-2.5 rounded-full transition-all duration-700 bg-red-500" style={{ width: `${s.accuracy}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* ── Topic Insights (grouped by section) ── */}
                  {(weakAreaData.weakestTopics?.length > 0 || weakAreaData.strongestTopics?.length > 0) && (() => {
                    type TaggedTopic = (typeof weakAreaData.weakestTopics)[0] & { kind: "weak" | "strong" };
                    const allTopics: TaggedTopic[] = [
                      ...(weakAreaData.weakestTopics ?? []).map(t => ({ ...t, kind: "weak" as const })),
                      ...(weakAreaData.strongestTopics ?? []).map(t => ({ ...t, kind: "strong" as const })),
                    ];
                    const bySection = allTopics.reduce<Record<string, TaggedTopic[]>>((acc, t) => {
                      (acc[t.section] ??= []).push(t);
                      return acc;
                    }, {});
                    return (
                      <div className="pt-3 border-t border-border space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                          <Target className="w-3 h-3" /> Topics
                        </p>
                        {Object.entries(bySection).map(([section, topics]) => (
                          <div key={section}>
                            <p className="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-wider mb-1">{section}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {topics.map(t => (
                                <span
                                  key={t.topic}
                                  className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-0.5 ${
                                    t.kind === "weak"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                  }`}
                                >
                                  {t.kind === "weak" ? "⚠️" : "🔥"} {t.topic} ({t.accuracy}%)
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overall Accuracy</span>
                      <span className="font-bold text-primary">{accuracy}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Insights */}
            {(() => {
              const insights: { icon: React.ReactNode; text: string }[] = [];

              if (accuracy < 50) {
                insights.push({
                  icon: <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />,
                  text: `Your overall accuracy is ${accuracy}%. Focus on answering carefully rather than rushing — precision matters more than speed.`,
                });
              }

              // Section-based insights from the API
              if (weakAreaData?.weakestSections.length) {
                const weakest = weakAreaData.weakestSections[0];
                insights.push({
                  icon: <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
                  text: `"${weakest.section}" is your weakest section at ${weakest.accuracy}% accuracy. Dedicate focused revision time here before your next attempt.`,
                });
              }
              if (weakAreaData?.recommendations.length) {
                const rec = weakAreaData.recommendations[0];
                insights.push({
                  icon: <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />,
                  text: rec,
                });
              }

              const skipRate = latest.totalQuestions > 0
                ? Math.round((latest.unanswered / latest.totalQuestions) * 100)
                : 0;
              if (skipRate >= 20) {
                insights.push({
                  icon: <MinusCircle className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />,
                  text: `You skipped ${latest.unanswered} questions (${skipRate}% of the test). Try elimination strategies on unsure questions rather than leaving them blank.`,
                });
              }

              if (avgTimePerQuestion > 90) {
                insights.push({
                  icon: <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
                  text: `Your average time per question was ${avgTimePerQuestion}s — above 90s. Practice timed drills to build speed without losing accuracy.`,
                });
              } else if (avgTimePerQuestion > 0 && avgTimePerQuestion < 15) {
                insights.push({
                  icon: <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />,
                  text: `You averaged only ${avgTimePerQuestion}s per question. Spending a bit more time reading thoroughly could reduce avoidable mistakes.`,
                });
              }

              if (latest.score >= 80 && accuracy >= 80) {
                insights.push({
                  icon: <Trophy className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
                  text: `Strong result! You scored ${latest.score}% with ${accuracy}% accuracy. Keep up this momentum and aim for consistency across all sections.`,
                });
              }

              const displayed = insights.slice(0, 5);
              if (displayed.length === 0) return null;

              return (
                <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Insights
                  </h2>
                  <div className="space-y-3">
                    {displayed.map((insight, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border border-border/70 bg-muted/40 p-4">
                        {insight.icon}
                        <p className="text-sm text-foreground">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Practice Progress Card */}
            {sectionPracticeParam && currentSectionAccuracy !== null && (
              <div className={`rounded-2xl border p-6 shadow-sm ${
                sectionImprovementDelta !== null && sectionImprovementDelta > 5
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20"
                  : sectionImprovementDelta !== null && sectionImprovementDelta < -5
                  ? "border-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
              }`}>
                <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Practice Result — {sectionPracticeParam}
                </h2>
                <div className={`grid gap-4 text-center ${previousSectionAccuracy !== null ? "grid-cols-3" : "grid-cols-1 max-w-xs mx-auto"}`}>
                  {previousSectionAccuracy !== null && (
                    <div className="rounded-xl border border-border/70 bg-background p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Previous</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{Math.round(previousSectionAccuracy)}%</p>
                      <p className="text-xs text-muted-foreground mt-0.5">in real attempt</p>
                    </div>
                  )}
                  <div className="rounded-xl border border-border/70 bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Now</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{Math.round(currentSectionAccuracy)}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">in practice</p>
                  </div>
                  {previousSectionAccuracy !== null && (
                    <div className={`rounded-xl border p-4 ${
                      sectionImprovementDelta !== null && sectionImprovementDelta > 0
                        ? "border-emerald-300 bg-emerald-100 dark:bg-emerald-900/30"
                        : sectionImprovementDelta !== null && sectionImprovementDelta < 0
                        ? "border-red-300 bg-red-100 dark:bg-red-900/30"
                        : "border-border/70 bg-background"
                    }`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Change</p>
                      <p className={`mt-2 text-2xl font-bold ${
                        sectionImprovementDelta !== null && sectionImprovementDelta > 0
                          ? "text-emerald-600"
                          : sectionImprovementDelta !== null && sectionImprovementDelta < 0
                          ? "text-red-600"
                          : "text-foreground"
                      }`}>
                        {sectionImprovementDelta !== null
                          ? (sectionImprovementDelta > 0 ? `+${sectionImprovementDelta}` : `${sectionImprovementDelta}`)
                          : "—"}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sectionImprovementDelta !== null && sectionImprovementDelta > 0 ? "Improved!" : sectionImprovementDelta !== null && sectionImprovementDelta < 0 ? "Keep practicing" : "No change"}
                      </p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm font-medium text-center">
                  {sectionImprovementDelta !== null && sectionImprovementDelta > 5
                    ? "🔥 Great improvement! Keep up the momentum."
                    : sectionImprovementDelta !== null && sectionImprovementDelta >= -5
                    ? "📈 Keep practicing to push your score higher."
                    : sectionImprovementDelta !== null
                    ? "⚠️ Needs more focus — try this section again."
                    : "Complete a full test to track your improvement over time."}
                </p>
              </div>
            )}

            {/* Smart Retry Improvement Card */}
            {isWrongOnlyResult && previousRealAttempt && (
              <div className={`rounded-2xl border p-6 shadow-sm ${improvementDelta !== null && improvementDelta > 0 ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20" : improvementDelta !== null && improvementDelta < 0 ? "border-red-200 bg-red-50 dark:bg-red-900/20" : "border-border/70 bg-card/85"}`}>
                <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Smart Retry — Improvement Tracker
                </h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-xl border border-border/70 bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Original Score</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{previousRealAttempt.score}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">on {previousRealAttempt.totalQuestions} questions</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">This Retry</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{latest.score}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">on {latest.totalQuestions} weak questions</p>
                  </div>
                  <div className={`rounded-xl border p-4 ${improvementDelta !== null && improvementDelta > 0 ? "border-emerald-300 bg-emerald-100 dark:bg-emerald-900/30" : improvementDelta !== null && improvementDelta < 0 ? "border-red-300 bg-red-100 dark:bg-red-900/30" : "border-border/70 bg-background"}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Change</p>
                    <p className={`mt-2 text-2xl font-bold ${improvementDelta !== null && improvementDelta > 0 ? "text-emerald-600" : improvementDelta !== null && improvementDelta < 0 ? "text-red-600" : "text-foreground"}`}>
                      {improvementDelta !== null ? (improvementDelta > 0 ? `+${improvementDelta}` : `${improvementDelta}`) : "—"}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {improvementDelta !== null && improvementDelta > 0 ? "Improved!" : improvementDelta !== null && improvementDelta < 0 ? "Keep practicing" : "Same score"}
                    </p>
                  </div>
                </div>
                {latest.score < 100 && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    {latest.correct} of {latest.totalQuestions} weak questions answered correctly in this retry.
                    {latest.wrong > 0 && ` ${latest.wrong} still incorrect — retry again to keep improving.`}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 gap-2"
                onClick={() =>
                  setLocation(
                    activeTestId
                      ? `/result?testId=${encodeURIComponent(activeTestId)}&tab=review`
                      : "/result?tab=review",
                  )
                }
              >
                <BookOpen className="w-4 h-4" />
                Review Questions
              </Button>
              {isWrongOnlyResult ? (
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-orange-400 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  onClick={() =>
                    setLocation(
                      activeTestId
                        ? `/test/${encodeURIComponent(activeTestId)}?wrongOnly=true`
                        : "/exams",
                    )
                  }
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry Again
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() =>
                    setLocation(
                      activeTestId
                        ? `/test/${encodeURIComponent(activeTestId)}?wrongOnly=true`
                        : "/exams",
                    )
                  }
                >
                  <XCircle className="w-4 h-4" />
                  Practice Wrong Questions
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() =>
                  setLocation(activeTestId ? `/test/${activeTestId}` : "/exams")
                }
              >
                <RotateCcw className="w-4 h-4" />
                Reattempt Test
              </Button>
            </div>

            {/* Free test access limit banner */}
            {(() => {
              if (!categoryFreeTests || categoryFreeTests.length === 0) return null;

              // Count unique free tests the user has already attempted in this category (REAL attempts only)
              const freeTestIds = new Set(categoryFreeTests.map((t) => t.id));
              const attemptedFreeIds = new Set(
                attempts
                  .filter((a) => a.attemptType === "REAL" && freeTestIds.has(a.testId))
                  .map((a) => a.testId),
              );

              const totalFree = categoryFreeTests.length;
              const attemptedFree = attemptedFreeIds.size;
              const remaining = totalFree - attemptedFree;

              // Only show when the user has used at least 1 free test and has 0 or 1 left
              if (remaining > 1) return null;

              // Premium users (those with any purchased entitlement) don't need this nudge
              const isPremium = Boolean(entitlements?.testIds && entitlements.testIds.length > 0);
              if (isPremium) return null;

              const upsellPool =
                suggestedPackages && suggestedPackages.length > 0
                  ? suggestedPackages
                  : categoryPackages && categoryPackages.length > 0
                  ? categoryPackages
                  : null;

              const isLast = remaining === 0;

              return (
                <div className={`rounded-2xl border p-5 shadow-sm ${
                  isLast
                    ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20"
                    : "border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-900/10"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">
                        {isLast
                          ? `This was your last free test in ${latest.category}.`
                          : `Only 1 free test remaining in ${latest.category}.`}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isLast
                          ? "You've completed all free mocks in this category. Unlock the full series to keep practising."
                          : "Make the most of your remaining free test, or unlock the full series now."}
                      </p>
                      {upsellPool && upsellPool.length > 0 ? (
                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                          <Button
                            className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => setLocation(`/packages/${upsellPool[0].id}`)}
                          >
                            <Trophy className="w-4 h-4" />
                            Unlock full test series
                          </Button>
                          <span className="text-xs text-muted-foreground font-medium">
                            {totalFree} free mock{totalFree !== 1 ? "s" : ""} · {upsellPool[0].discountPercent > 0 ? `${upsellPool[0].discountPercent}% off` : ""}
                          </span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="mt-3 gap-2 border-amber-400 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          onClick={() => setLocation("/exams")}
                        >
                          <Trophy className="w-4 h-4" />
                          Explore more tests
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Progression-based upsell — shown after 2+ attempts on any test in this category */}
            {relevantAttempts.length >= 2 && (() => {
              const prevScore = relevantAttempts[1]?.score ?? 0;
              const delta = latest.score - prevScore;
              const isImproving = delta > 0;
              const isConsistent = Math.abs(delta) <= 3;

              const headline = isImproving
                ? `You're improving! +${delta}% since your last attempt.`
                : isConsistent
                ? `You're staying consistent. Ready for a bigger challenge?`
                : `Keep going — every attempt sharpens your skills.`;

              const subText = isImproving
                ? `Tackle advanced mock tests to keep the momentum going.`
                : `Push further with a full test series and targeted practice.`;

              const upsellPool =
                suggestedPackages && suggestedPackages.length > 0
                  ? suggestedPackages
                  : categoryPackages && categoryPackages.length > 0
                  ? categoryPackages
                  : null;

              return (
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-emerald-900/20 dark:to-emerald-900/10 p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-foreground">{headline}</p>
                        <span className="text-[11px] font-semibold rounded-full px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          {relevantAttempts.length} attempts
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{subText}</p>
                      {upsellPool && upsellPool.length > 0 ? (
                        <Button
                          className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => setLocation(`/packages/${upsellPool[0].id}`)}
                        >
                          <Trophy className="w-4 h-4" />
                          Unlock full test series
                        </Button>
                      ) : (
                        <Button
                          className="mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => setLocation("/exams")}
                        >
                          <Trophy className="w-4 h-4" />
                          Explore more tests
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="analysis-metrics">
              {[
                {
                  label: "Score",
                  value: `${latest.score}%`,
                  sub: "overall",
                  icon: <Target className="w-5 h-5" />,
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  label: "Accuracy",
                  value: `${accuracy}%`,
                  sub: `${latest.correct + latest.wrong} answered`,
                  icon: <CheckCircle className="w-5 h-5" />,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50 dark:bg-emerald-900/20",
                },
                {
                  label: "Total Time",
                  value: `${latest.timeSpent} min`,
                  sub: `${latest.totalQuestions} questions`,
                  icon: <Clock className="w-5 h-5" />,
                  color: "text-violet-600",
                  bg: "bg-violet-50 dark:bg-violet-900/20",
                },
                {
                  label: "Avg / Question",
                  value:
                    avgTimePerQuestion >= 60
                      ? `${Math.floor(avgTimePerQuestion / 60)}m ${avgTimePerQuestion % 60}s`
                      : `${avgTimePerQuestion}s`,
                  sub:
                    questionResponses.length > 0
                      ? `${questionResponses.length} tracked`
                      : "estimated",
                  icon: <TimerReset className="w-5 h-5" />,
                  color: "text-amber-600",
                  bg: "bg-amber-50 dark:bg-amber-900/20",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-card/85 border border-border/70 rounded-2xl p-5 text-center shadow-sm surface-hover"
                >
                  <div
                    className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
                  >
                    {item.icon}
                  </div>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Question breakdown with stacked bar */}
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                <BarChart2 className="w-4 h-4 text-primary" />
                Question Breakdown
              </h2>
              <div className="flex flex-wrap gap-5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">Correct</span>
                  <span className="text-sm font-bold text-emerald-600">{latest.correct}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Wrong</span>
                  <span className="text-sm font-bold text-red-600">{latest.wrong}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="text-sm text-muted-foreground">Skipped</span>
                  <span className="text-sm font-bold text-foreground">{latest.unanswered}</span>
                </div>
              </div>
              <div className="flex w-full overflow-hidden rounded-full h-4 bg-muted">
                {latest.correct > 0 && (
                  <div
                    className="bg-emerald-500 h-full transition-all duration-700"
                    style={{ width: `${(latest.correct / latest.totalQuestions) * 100}%` }}
                  />
                )}
                {latest.wrong > 0 && (
                  <div
                    className="bg-red-500 h-full transition-all duration-700"
                    style={{ width: `${(latest.wrong / latest.totalQuestions) * 100}%` }}
                  />
                )}
                {latest.unanswered > 0 && (
                  <div
                    className="bg-muted-foreground/20 h-full transition-all duration-700"
                    style={{ width: `${(latest.unanswered / latest.totalQuestions) * 100}%` }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0</span>
                <span>{latest.totalQuestions} total questions</span>
              </div>
            </div>

            {/* Section-wise performance */}
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-primary" />
                Section Performance
              </h2>
              {sectionStats.length === 0 ? (
                <p className="empty-state text-sm">No section data was recorded for this attempt.</p>
              ) : (
                <div className="space-y-4">
                  {sectionStats.map((section) => {
                    const sTime = sectionTimeSpent.find((s) => s.name === section.name);
                    const avgSQ = avgTimeBySectionFromResponses[section.name];
                    const barColor =
                      section.accuracy >= 70
                        ? "bg-emerald-500"
                        : section.accuracy >= 50
                        ? "bg-amber-500"
                        : "bg-red-500";
                    const textColor =
                      section.accuracy >= 70
                        ? "text-emerald-600"
                        : section.accuracy >= 50
                        ? "text-amber-600"
                        : "text-red-600";
                    return (
                      <div key={section.name} className="rounded-xl border border-border/70 bg-muted/30 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground">{section.name}</p>
                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                              <span className="text-emerald-600 font-medium">{section.correct} correct</span>
                              <span className="text-red-600 font-medium">{section.wrong} wrong</span>
                              <span className="text-muted-foreground">{section.unanswered} skipped</span>
                              <span className="text-muted-foreground">{section.totalQuestions} total</span>
                              {sTime && (
                                <span className="text-violet-600 font-medium">{sTime.minutesSpent} min</span>
                              )}
                              {avgSQ !== undefined && (
                                <span className="text-amber-600 font-medium">~{avgSQ}s per question</span>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className={`text-xl font-bold ${textColor}`}>{section.accuracy}%</p>
                            <p className="text-xs text-muted-foreground">accuracy</p>
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
                            style={{ width: `${section.accuracy}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time analysis */}
            <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                <TimerReset className="w-4 h-4 text-primary" />
                Time Analysis
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 mb-5">
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total Time Used</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{latest.timeSpent} min</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">across {latest.totalQuestions} questions</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Avg Time / Question</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {avgTimePerQuestion >= 60
                      ? `${Math.floor(avgTimePerQuestion / 60)}m ${avgTimePerQuestion % 60}s`
                      : `${avgTimePerQuestion}s`}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {questionResponses.length > 0
                      ? `based on ${questionResponses.length} tracked responses`
                      : "estimated from total time"}
                  </p>
                </div>
              </div>
              {sectionTimeSpent.length > 0 && (() => {
                const maxMin = Math.max(...sectionTimeSpent.map((s) => s.minutesSpent), 1);
                return (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Time Per Section</p>
                    {sectionTimeSpent.map((section) => {
                      const avgSQ = avgTimeBySectionFromResponses[section.name];
                      return (
                        <div key={section.name} className="flex items-center gap-3">
                          <div className="w-28 shrink-0 text-sm text-foreground truncate" title={section.name}>
                            {section.name}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full bg-violet-500 transition-all duration-700"
                                style={{ width: `${(section.minutesSpent / maxMin) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="shrink-0 text-right w-20">
                            <div className="text-sm font-semibold text-violet-600 tabular-nums">
                              {section.minutesSpent} min
                            </div>
                            {avgSQ !== undefined && (
                              <div className="text-[11px] text-amber-600">~{avgSQ}s/q</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Weak Area Analysis — only shown when a server attemptId is available */}
            {serverAttemptId && (
              <div className="bg-card/85 border border-border/70 rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-foreground flex items-center gap-2 mb-5">
                  <Target className="w-4 h-4 text-primary" />
                  Weak Area Analysis
                </h2>

                {weakAreaLoading ? (
                  <p className="text-sm text-muted-foreground">Analysing your sections…</p>
                ) : !weakAreaData ? (
                  <p className="text-sm text-muted-foreground">Could not load weak area data.</p>
                ) : (
                  <div className="space-y-6">
                    {/* Weakest sections */}
                    {weakAreaData.weakestSections.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
                          Weakest Sections
                        </h3>
                        <div className="space-y-3">
                          {weakAreaData.weakestSections.map((s) => (
                            <div
                              key={s.section}
                              className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-foreground">{s.section}</p>
                                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span>{s.totalQuestions} questions</span>
                                    <span className="text-amber-600 font-medium">
                                      avg {s.avgTimeSecs}s / question
                                    </span>
                                    {s.trend && (
                                      <span className={`font-semibold ${
                                        s.trend === "improving" ? "text-emerald-600" :
                                        s.trend === "declining" ? "text-red-600" :
                                        "text-muted-foreground"
                                      }`}>
                                        {s.trend === "improving" ? "↑" : s.trend === "declining" ? "↓" : "→"} {s.trendLabel}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="text-xl font-bold text-red-600">{s.accuracy}%</p>
                                  <p className="text-xs text-muted-foreground">accuracy</p>
                                </div>
                              </div>
                              <div className="mt-3 w-full bg-red-100 dark:bg-red-900/40 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-red-500 transition-all duration-700"
                                  style={{ width: `${s.accuracy}%` }}
                                />
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 gap-1.5 border-red-300 text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs"
                                onClick={() =>
                                  setLocation(
                                    activeTestId
                                      ? `/test/${encodeURIComponent(activeTestId)}?section=${encodeURIComponent(s.section)}`
                                      : "/exams",
                                  )
                                }
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Practice this section
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strongest sections */}
                    {weakAreaData.strongestSections.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                          Strongest Sections
                        </h3>
                        <div className="space-y-3">
                          {weakAreaData.strongestSections.map((s) => (
                            <div
                              key={s.section}
                              className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-foreground">{s.section}</p>
                                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span>{s.totalQuestions} questions</span>
                                    <span className="text-amber-600 font-medium">
                                      avg {s.avgTimeSecs}s / question
                                    </span>
                                    {s.trend && (
                                      <span className={`font-semibold ${
                                        s.trend === "improving" ? "text-emerald-600" :
                                        s.trend === "declining" ? "text-red-600" :
                                        "text-muted-foreground"
                                      }`}>
                                        {s.trend === "improving" ? "↑" : s.trend === "declining" ? "↓" : "→"} {s.trendLabel}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="text-xl font-bold text-emerald-600">{s.accuracy}%</p>
                                  <p className="text-xs text-muted-foreground">accuracy</p>
                                </div>
                              </div>
                              <div className="mt-3 w-full bg-emerald-100 dark:bg-emerald-900/40 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                                  style={{ width: `${s.accuracy}%` }}
                                />
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-xs"
                                onClick={() =>
                                  setLocation(
                                    activeTestId
                                      ? `/test/${encodeURIComponent(activeTestId)}?section=${encodeURIComponent(s.section)}`
                                      : "/exams",
                                  )
                                }
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Practice this section
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Topic Breakdown (grouped by section) ── */}
                    {(weakAreaData.weakestTopics?.length > 0 || weakAreaData.strongestTopics?.length > 0) && (() => {
                      type TaggedTopic = (typeof weakAreaData.weakestTopics)[0] & { kind: "weak" | "strong" };
                      const allTopics: TaggedTopic[] = [
                        ...(weakAreaData.weakestTopics ?? []).map(t => ({ ...t, kind: "weak" as const })),
                        ...(weakAreaData.strongestTopics ?? []).map(t => ({ ...t, kind: "strong" as const })),
                      ];
                      const bySection = allTopics.reduce<Record<string, TaggedTopic[]>>((acc, t) => {
                        (acc[t.section] ??= []).push(t);
                        return acc;
                      }, {});
                      return (
                        <div className="pt-4 border-t border-border">
                          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4" /> Topic Breakdown
                          </h3>
                          <div className="space-y-4">
                            {Object.entries(bySection).map(([section, topics]) => (
                              <div key={section}>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{section}</p>
                                <div className="space-y-2">
                                  {topics.map(t => (
                                    <div key={t.topic} className={`rounded-lg border px-3 py-2 ${
                                      t.kind === "weak"
                                        ? "border-red-200 bg-red-50/60 dark:bg-red-900/15 dark:border-red-800/60"
                                        : "border-emerald-200 bg-emerald-50/60 dark:bg-emerald-900/15 dark:border-emerald-800/60"
                                    }`}>
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${
                                          t.kind === "weak" ? "text-red-800 dark:text-red-200" : "text-emerald-800 dark:text-emerald-200"
                                        }`}>
                                          {t.kind === "weak" ? "⚠️" : "🔥"} {t.topic}
                                        </span>
                                        <span className={`text-sm font-bold ${
                                          t.kind === "weak" ? "text-red-600" : "text-emerald-600"
                                        }`}>{t.accuracy}%</span>
                                      </div>
                                      <div className={`mt-1.5 w-full rounded-full h-1 ${
                                        t.kind === "weak" ? "bg-red-100 dark:bg-red-900/40" : "bg-emerald-100 dark:bg-emerald-900/40"
                                      }`}>
                                        <div
                                          className={`h-1 rounded-full transition-all duration-700 ${
                                            t.kind === "weak" ? "bg-red-500" : "bg-emerald-500"
                                          }`}
                                          style={{ width: `${t.accuracy}%` }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Recommendations */}
                    {weakAreaData.recommendations.length > 0 && (
                      <div className="pt-4 border-t border-border space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Recommendations
                        </h3>
                        {weakAreaData.recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="flex gap-2 rounded-xl border border-border/70 bg-muted/40 p-3 text-sm text-foreground"
                          >
                            <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

{/* Contextual package recommendation */}
            {(() => {
              // Pick the most relevant package pool:
              // 1st priority: packages that directly contain this test
              // 2nd priority (fallback): packages from the same category
              const pool =
                suggestedPackages && suggestedPackages.length > 0
                  ? suggestedPackages
                  : categoryPackages && categoryPackages.length > 0
                  ? categoryPackages
                  : null;

              if (!pool || pool.length === 0) return null;

              const isExactMatch = Boolean(suggestedPackages && suggestedPackages.length > 0);

              // Derive reason tags per package based on weak section keyword matching
              const weakSection = weakAreaData?.weakestSections?.[0]?.section ?? "";
              const weakTokens = weakSection
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => w.length > 3);

              function reasonFor(pkg: { name: string; description: string }) {
                const haystack = `${pkg.name} ${pkg.description}`.toLowerCase();
                const hasWeakSectionMatch =
                  weakTokens.length > 0 && weakTokens.some((tok) => haystack.includes(tok));
                if (hasWeakSectionMatch) {
                  return `Includes ${weakSection} practice`;
                }
                if (isExactMatch) return `Contains this exam`;
                return `Matches ${latest?.category ?? ""} exams`;
              }

              // Header copy — personalised if we know the weak section
              const headerLine = weakSection
                ? `You're weak in ${weakSection} — get more practice with a full test series.`
                : `Get the full ${latest.category || latest.testName} test series and practise more.`;

              return (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Want to improve faster?</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{headerLine}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {pool.slice(0, 2).map((pkg) => {
                      const reason = reasonFor(pkg);
                      return (
                        <div
                          key={pkg.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-foreground truncate">{pkg.name}</p>
                              {Boolean(pkg.isPopular) && (
                                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                  Popular
                                </span>
                              )}
                            </div>
                            {/* Contextual reason tag */}
                            <p className="mt-0.5 text-[11px] font-medium text-primary/80">{reason}</p>
                            {pkg.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{pkg.description}</p>
                            )}
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-primary">
                                ₹{(pkg.finalPriceCents / 100).toLocaleString("en-IN")}
                              </span>
                              {(pkg.originalPriceCents ?? 0) > pkg.finalPriceCents && (
                                <span className="text-xs line-through text-muted-foreground">
                                  ₹{((pkg.originalPriceCents ?? 0) / 100).toLocaleString("en-IN")}
                                </span>
                              )}
                              {pkg.discountPercent > 0 && (
                                <span className="text-xs font-semibold text-emerald-600">{pkg.discountPercent}% off</span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="shrink-0 gap-1.5"
                            onClick={() => setLocation(`/packages/${pkg.id}`)}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          <TabsContent value="review" className="space-y-4">
            {/* ── Mobile Question Map ── */}
            {questionReview.length > 0 && (
              <div className="lg:hidden rounded-2xl border border-border/70 bg-card/85 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setNavOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-primary" />
                    Question Map
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      {reviewCounts.correct}&#10003;&nbsp;·&nbsp;{reviewCounts.wrong}&#10007;&nbsp;·&nbsp;{reviewCounts.unanswered}&nbsp;–
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${navOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {navOpen && (
                  <div className="border-t border-border/70 px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {questionReview.map((item, index) => {
                        const state = getReviewState(item);
                        const isActive = activeQuestionId === item.questionId;
                        const inFilter = filteredIds.has(item.questionId);
                        return (
                          <button
                            key={item.questionId}
                            type="button"
                            onClick={() => {
                              if (!inFilter) return;
                              document
                                .getElementById(`question-${item.questionId}`)
                                ?.scrollIntoView({ behavior: "smooth", block: "start" });
                              setNavOpen(false);
                            }}
                            title={`Q${index + 1} — ${state}${item.flagged ? " · flagged" : ""}`}
                            className={[
                              "relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all",
                              state === "correct"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : state === "wrong"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-muted text-muted-foreground",
                              item.flagged ? "ring-2 ring-yellow-400" : "",
                              isActive
                                ? "ring-2 ring-primary scale-110 shadow-md"
                                : inFilter
                                ? "hover:scale-105 hover:shadow-sm"
                                : "opacity-40 cursor-not-allowed",
                            ].join(" ")}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                    {reviewCounts.wrong > 0 && (
                      <button
                        type="button"
                        onClick={() => { nextWrongFromActive(); setNavOpen(false); }}
                        className="mt-3 flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Next Wrong
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-6 items-start">
              {/* ── Main question list ── */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Solution Review</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Review every question with your answer, the correct answer, and the explanation.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {reviewAvailableLangs.length > 1 && (
                        <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-1">
                          {reviewAvailableLangs.map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setReviewLang(l)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                                reviewLang === l
                                  ? "bg-background text-primary shadow-sm ring-1 ring-primary/30"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {LANGUAGE_LABELS[l]}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {reviewChips.map((chip) => (
                          <button
                            key={chip.key}
                            type="button"
                            onClick={() => setReviewFilter(chip.key)}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                              reviewFilter === chip.key
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground hover:bg-muted"
                            }`}
                          >
                            {chip.label}
                            <span className={`rounded-full px-1.5 py-0.5 text-xs ${reviewFilter === chip.key ? "bg-card-20" : "bg-muted"}`}>
                              {chip.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {questionReview.length === 0 ? (
                  <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">
                      This attempt does not include per-question review data yet. Take a new test to unlock the full solution view.
                    </p>
                  </div>
                ) : filteredReview.length === 0 ? (
                  <div className="rounded-2xl border border-border/70 bg-card/85 p-8 text-center shadow-sm">
                    <p className="text-sm text-muted-foreground">No questions match this filter.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReview.map((item) => {
                  const state = getReviewState(item);
                  const stateLabel =
                    state === "correct" ? "Correct" : state === "wrong" ? "Wrong" : "Unanswered";
                  const stateStyle =
                    state === "correct"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : state === "wrong"
                        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
                        : "border-muted bg-muted/40 text-muted-foreground";

                  // Localized content with en fallback
                  const localizedText =
                    reviewLang === "hi" && item.textHi ? item.textHi :
                    reviewLang === "pa" && item.textPa ? item.textPa :
                    item.text;
                  const localizedOptions =
                    reviewLang === "hi" && item.optionsHi && item.optionsHi.length > 0 ? item.optionsHi :
                    reviewLang === "pa" && item.optionsPa && item.optionsPa.length > 0 ? item.optionsPa :
                    item.options;
                  const localizedExplanation =
                    reviewLang === "hi" && item.explanationHi ? item.explanationHi :
                    reviewLang === "pa" && item.explanationPa ? item.explanationPa :
                    item.explanation;

                  const yourAnswer =
                    item.selected === null ? "Not answered" : `${getAnswerLabel(item.selected)}. ${localizedOptions[item.selected]}`;
                  const correctAnswer = `${getAnswerLabel(item.correct)}. ${localizedOptions[item.correct]}`;

                  return (
                    <article key={item.questionId} id={`question-${item.questionId}`} className="rounded-2xl border border-border/70 bg-card/85 p-6 shadow-sm scroll-mt-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl bg-primary/10 px-3 text-sm font-bold text-primary">
                              Q{item.questionId}
                            </span>
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${stateStyle}`}>
                              {stateLabel}
                            </span>
                            {item.flagged && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 dark:border-yellow-900/40 dark:bg-yellow-950/30 dark:text-yellow-300">
                                <Flag className="h-3.5 w-3.5" />
                                Flagged
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {item.section}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 text-lg font-semibold leading-relaxed text-foreground">
                        <QuestionRichText content={localizedText} />
                      </div>

                      <div className="mt-5 space-y-3">
                        {localizedOptions.map((option, index) => {
                          const isSelected = item.selected === index;
                          const isCorrect = item.correct === index;
                          const optionStyle = isCorrect
                            ? "border-emerald-300 bg-emerald-50/80 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100"
                            : isSelected
                              ? "border-red-300 bg-red-50/80 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100"
                              : "border-border bg-background text-foreground";

                          return (
                            <div key={`${item.questionId}-${index}`} className={`flex items-start gap-3 rounded-xl border p-4 ${optionStyle}`}>
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-current/20 text-sm font-bold">
                                {getAnswerLabel(index)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <QuestionRichText content={option} inline className="text-sm" />
                                {isCorrect && (
                                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]">Correct answer</p>
                                )}
                                {isSelected && !isCorrect && (
                                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]">Your selected answer</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your Answer</p>
                          <div className="mt-2 text-sm font-medium text-foreground">
                            {item.selected === null ? (
                              yourAnswer
                            ) : (
                              <QuestionRichText content={yourAnswer} inline />
                            )}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Correct Answer</p>
                          <div className="mt-2 text-sm font-medium text-foreground">
                            <QuestionRichText content={correctAnswer} inline />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-border/70 bg-muted/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Solution</p>
                        <div className="mt-2 text-sm leading-relaxed text-foreground">
                          {localizedExplanation?.trim() ? (
                            <QuestionRichText content={localizedExplanation} />
                          ) : (
                            "No explanation was provided for this question."
                          )}
                        </div>
                      </div>
                    </article>
                  );
                  })}
                  </div>
                )}
              </div>

              {/* ── Desktop sidebar navigation ── */}
              {questionReview.length > 0 && (
                <aside className="hidden lg:flex flex-col gap-3 w-52 shrink-0 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                  <div className="rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                      <Map className="w-4 h-4 text-primary" />
                      Question Map
                    </h3>
                    {/* Stats summary */}
                    <div className="mb-4 grid grid-cols-3 gap-1.5 text-center">
                      <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
                        <p className="text-base font-bold text-emerald-600">{reviewCounts.correct}</p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Correct</p>
                      </div>
                      <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                        <p className="text-base font-bold text-red-600">{reviewCounts.wrong}</p>
                        <p className="text-[10px] text-red-700 dark:text-red-400">Wrong</p>
                      </div>
                      <div className="rounded-lg bg-muted p-2">
                        <p className="text-base font-bold text-muted-foreground">{reviewCounts.unanswered}</p>
                        <p className="text-[10px] text-muted-foreground">Skip</p>
                      </div>
                    </div>
                    {/* Question grid */}
                    <div className="flex flex-wrap gap-1.5">
                      {questionReview.map((item, index) => {
                        const state = getReviewState(item);
                        const isActive = activeQuestionId === item.questionId;
                        const inFilter = filteredIds.has(item.questionId);
                        return (
                          <button
                            key={item.questionId}
                            type="button"
                            onClick={() =>
                              inFilter &&
                              document
                                .getElementById(`question-${item.questionId}`)
                                ?.scrollIntoView({ behavior: "smooth", block: "start" })
                            }
                            title={`Q${index + 1} — ${state}${item.flagged ? " · flagged" : ""}`}
                            className={[
                              "relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all",
                              state === "correct"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : state === "wrong"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-muted text-muted-foreground",
                              item.flagged ? "ring-2 ring-yellow-400" : "",
                              isActive
                                ? "ring-2 ring-primary scale-110 shadow-md"
                                : inFilter
                                ? "hover:scale-105 hover:shadow-sm cursor-pointer"
                                : "opacity-40 cursor-not-allowed",
                            ].join(" ")}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                    {/* Next Wrong button */}
                    {reviewCounts.wrong > 0 && (
                      <button
                        type="button"
                        onClick={nextWrongFromActive}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Next Wrong
                      </button>
                    )}
                  </div>
                </aside>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* What to do next */}
        {(() => {
          const weakSection = sectionStats.length > 0
            ? [...sectionStats].sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))[0]
            : null;

          const nextSteps: { icon: React.ReactNode; label: string; description: string; onClick: () => void }[] = [
            {
              icon: <RotateCcw className="w-5 h-5 text-blue-500" />,
              label: "Attempt next test",
              description: "Keep your momentum going",
              onClick: () => setLocation("/exams"),
            },
            ...(weakSection
              ? [{
                  icon: <Target className="w-5 h-5 text-orange-500" />,
                  label: `Practice ${weakSection.name}`,
                  description: `Your weakest section — ${weakSection.accuracy ?? 0}% accuracy`,
                  onClick: () =>
                    setLocation(
                      activeTestId
                        ? `/test/${encodeURIComponent(activeTestId)}?section=${encodeURIComponent(weakSection.name)}`
                        : "/exams"
                    ),
                }]
              : []),
            {
              icon: <BarChart2 className="w-5 h-5 text-emerald-500" />,
              label: "Review your performance",
              description: "See trends and improvement areas",
              onClick: () => setLocation("/performance"),
            },
          ];

          return (
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Next step</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nextSteps.map((step) => (
                  <button
                    key={step.label}
                    onClick={step.onClick}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background hover:bg-accent hover:border-primary/40 transition-colors p-4 text-left group"
                  >
                    <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:scale-110 transition-transform">
                      {step.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-sm text-foreground">{step.label}</span>
                      <span className="block text-xs text-muted-foreground truncate">{step.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={() => setLocation("/exams")} className="gap-2" data-testid="btn-take-another">
            <RotateCcw className="w-4 h-4" />
            Take Another Test
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/performance")} className="gap-2" data-testid="btn-view-leaderboard">
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
