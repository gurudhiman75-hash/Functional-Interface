import { useMemo, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Globe2,
  Landmark,
  Newspaper,
  Target,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";

import { ExamIdentityIcon } from "@/components/ExamIdentityIcon";
import { getCommercePurchases } from "@/lib/commerce";
import { getTests, getUserAttempts, type TestAttempt } from "@/lib/data";
import { getUser } from "@/lib/storage";
import "@/styles/dashboard-approved.css";

function localDayNumber(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

function getCurrentStreak(attempts: TestAttempt[]) {
  const uniqueDays = Array.from(
    new Set(attempts.map((attempt) => localDayNumber(attempt.createdAt)).filter((value): value is number => value !== null)),
  ).sort((a, b) => b - a);
  if (!uniqueDays.length) return 0;
  const today = localDayNumber(new Date());
  if (today === null) return 0;
  if (uniqueDays[0] !== today && uniqueDays[0] !== today - 1) return 0;
  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    if (uniqueDays[index] === uniqueDays[index - 1] - 1) streak += 1;
    else break;
  }
  return streak;
}

const quickActions = [
  { label: "Take a Mock Test", helper: "Full length tests", icon: FileText, href: "/mock-tests", tone: "blue" },
  { label: "Practice by Topic", helper: "Topic-wise questions", icon: Target, href: "/mock-tests", tone: "violet" },
  { label: "Previous Year Papers", helper: "All exams", icon: Bookmark, href: "/pyqs", tone: "rose" },
  { label: "Study Material", helper: "Notes & PDFs", icon: BookOpen, href: "/resources", tone: "green" },
  { label: "Current Affairs", helper: "Daily updates", icon: Newspaper, href: "/current-affairs", tone: "orange" },
  { label: "Performance", helper: "Detailed analysis", icon: BarChart3, href: "/performance", tone: "indigo" },
] as const;

export default function ActivityPage() {
  const user = getUser();
  const attemptsQuery = useQuery({
    queryKey: ["canonical-attempt-history", user?.id],
    queryFn: () => getUserAttempts(user?.id),
    enabled: Boolean(user),
    retry: false,
    staleTime: 30_000,
  });
  const testsQuery = useQuery({ queryKey: ["tests"], queryFn: getTests, staleTime: 60_000 });

  const purchasesQuery = useQuery({ queryKey: ["commerce-purchases", user?.id], queryFn: getCommercePurchases, enabled: Boolean(user), retry: false, staleTime: 30_000 });

  const realAttempts = useMemo(
    () => (attemptsQuery.data ?? [])
      .filter((attempt) => !attempt.attemptType || attempt.attemptType === "REAL")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [attemptsQuery.data],
  );

  const stats = useMemo(() => {
    const totalQuestions = realAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const correct = realAttempts.reduce((sum, a) => sum + a.correct, 0);
    const average = realAttempts.length ? Math.round(realAttempts.reduce((sum, a) => sum + a.score, 0) / realAttempts.length) : 0;
    return {
      count: realAttempts.length,
      average,
      accuracy: totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0,
      streak: getCurrentStreak(realAttempts),
    };
  }, [realAttempts]);

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Student";
  const latest = realAttempts[0];
  const catalogue = testsQuery.data ?? [];
  const suggestedTests = useMemo(() => {
    const attempted = new Set(realAttempts.map(item => item.testId));
    const recentCategory = catalogue.find(item => item.id === latest?.testId)?.categoryId;
    return [...catalogue].sort((a, b) => {
      const rank = (item: typeof a) => (item.categoryId === recentCategory ? 2 : 0) + (!attempted.has(item.id) ? 1 : 0);
      return rank(b) - rank(a);
    }).slice(0, 4);
  }, [catalogue, realAttempts, latest?.testId]);
  const focusTest = suggestedTests[0];
  const activeAccess = purchasesQuery.data?.entitlements.filter(item => item.accessStatus === "active") ?? [];
  const formatDate = (value: string | Date) => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const formatTime = (value: number) => Math.round(value / 60) + " min";
  const trend = realAttempts.slice(0, 8).reverse().map(item => Math.max(0, Math.min(100, item.score)));

  return (
    <div className="student-hub-dashboard" data-testid="student-dashboard">
      <section className="dash-hero">
        <div className="dash-hero-copy">
          <span className="dash-kicker">YOUR PREPARATION WORKSPACE</span>
          <h1>Welcome back, {firstName}!</h1>
          <p>Choose your next practice. Review what you learned.</p>
          <Link href={focusTest ? "/published-tests/" + encodeURIComponent(focusTest.id) : "/exams"} className="dash-primary-btn dash-hero-cta">{focusTest ? "Start practice" : "Choose an exam"} <ArrowRight /></Link>
        </div>
        <div className="dash-focus-card">
          <div className="dash-focus-logo"><ExamIdentityIcon name={focusTest?.subcategoryName || focusTest?.name || "ExamTree"} icon={focusTest?.iconUrl || undefined} /></div>
          <div className="dash-focus-main">
            <div className="dash-focus-topline"><span>Next available practice</span><Link href="/exams">Browse exams</Link></div>
            <h2>{focusTest?.name || "Find your exam"}</h2>
            <p>{testsQuery.isLoading ? "Loading available tests…" : testsQuery.isError ? "Available tests could not be loaded." : focusTest ? focusTest.totalQuestions + " questions · " + focusTest.duration + " min" : "Explore exams, syllabus and preparation resources."}</p>
          </div>
        </div>
      </section>
      <section className="dash-summary" aria-label="Preparation summary">
        {[{icon:FileText,label:"Tests attempted",value:stats.count},{icon:CheckCircle2,label:"Accuracy",value:realAttempts.length ? stats.accuracy + "%" : "—"},{icon:Flame,label:"Study streak",value:stats.streak + (stats.streak === 1 ? " day" : " days")},{icon:BookOpen,label:"Active packages",value:purchasesQuery.isError ? "—" : activeAccess.length}].map(({icon:Icon,label,value}) => <div key={label}><Icon /><span><b>{attemptsQuery.isLoading && label !== "Active packages" ? "…" : attemptsQuery.isError && label !== "Active packages" ? "—" : purchasesQuery.isLoading && label === "Active packages" ? "…" : value}</b><small>{label}</small></span></div>)}
      </section>

      <section className="dash-quick-actions" aria-label="Quick actions">
        {quickActions.map((item) => (
          <Link key={item.label} href={item.href} className="dash-quick-card">
            <span className={"dash-quick-icon tone-" + item.tone}><item.icon /></span>
            <span><b>{item.label}</b><small>{item.helper}</small></span>
          </Link>
        ))}
      </section>

      <section className="dash-main-grid">
        <article className="dash-panel dash-practice-panel">
          <div className="dash-panel-head">
            <div><h2>Suggested Practice for You</h2><p>Available tests, prioritised by your recent exam activity</p></div>
            <Link href="/mock-tests">View All <ArrowRight /></Link>
          </div>
          <div className="dash-practice-list">
            {testsQuery.isLoading ? <p className="dash-empty" role="status">Loading practice…</p> : testsQuery.isError ? <div className="dash-empty"><p>Practice is temporarily unavailable.</p><button onClick={() => void testsQuery.refetch()}>Try again</button></div> : suggestedTests.length ? suggestedTests.map(item => (
              <div className="dash-practice-row" key={item.id}>
                <span className="dash-practice-icon"><ExamIdentityIcon name={item.subcategoryName || item.name} icon={item.iconUrl || undefined} /></span>
                <div className="dash-practice-copy"><div><b>{item.name}</b>{item.access ? <span className="dash-badge tone-blue">{item.access === "free" ? "Free" : "Paid"}</span> : null}</div><small>{item.totalQuestions} questions · {item.duration} min · {item.kind === "sectional" ? "Sectional" : item.kind === "topic-wise" ? "Topic practice" : "Full mock"}</small></div>
                <Link href={"/published-tests/" + encodeURIComponent(item.id)} className="dash-primary-btn">{item.access === "paid" ? "View test" : "Start practice"}</Link>
              </div>
            )) : <div className="dash-empty"><Target /><h3>Your next practice starts here</h3><p>Published tests will appear here as they become available.</p><Link href="/exams">Explore exams <ArrowRight /></Link></div>}
          </div>
        </article>

        <article className="dash-panel dash-performance-panel">
          <div className="dash-panel-head"><h2>Performance</h2><Link href="/performance">View analysis <ArrowRight /></Link></div>
          {attemptsQuery.isLoading ? <p className="dash-empty" role="status">Loading performance…</p> : attemptsQuery.isError ? <div className="dash-empty"><p>Attempt history could not be loaded.</p><button onClick={() => void attemptsQuery.refetch()}>Try again</button></div> : realAttempts.length ? <>
            <div className="dash-performance-top"><div className="dash-score-ring" style={{ "--score": Math.max(0, Math.min(100,stats.average)) } as CSSProperties}><div><b>{stats.average}%</b><span>Average score</span></div></div><p className="dash-performance-note">Review your recent results and use the detailed analysis to identify areas for revision.</p></div>
            <div className="dash-trend"><div className="dash-trend-title">Last {trend.length} test scores</div><div className="dash-chart" role="img" aria-label={"Recent scores: " + trend.join(", ") + " percent"}>{trend.map((value,index) => <span key={index} title={value + "%"} style={{height:value+"%"}}><i /></span>)}</div></div>
          </> : <div className="dash-empty"><BarChart3 /><h3>Build your performance picture</h3><p>Your scores and trends appear after your first completed test.</p><Link href="/bookmarks">Review bookmarked questions <ArrowRight /></Link></div>}
        </article>

        <article className="dash-panel dash-upcoming-panel">
          <div className="dash-panel-head"><h2>Recent attempts</h2><Link href="/performance">View all <ArrowRight /></Link></div>
          <div className="dash-attempt-list">
            {attemptsQuery.isLoading ? <p className="dash-empty" role="status">Loading attempts…</p> : attemptsQuery.isError ? <p className="dash-empty">Recent attempts are unavailable. Try refreshing your performance data.</p> : realAttempts.length ? realAttempts.slice(0,3).map((item,index) => <article key={item.id || index}><div><b>{item.testName}</b><small>{formatDate(item.createdAt)} · {formatTime(item.timeSpent)}</small><span>Score {item.score}% · Accuracy {item.totalQuestions ? Math.round(item.correct/item.totalQuestions*100) : 0}%</span></div><Link className="et-interactive inline-flex min-h-11 items-center gap-2" href={"/result?attemptId="+encodeURIComponent(item.id)}>Review mistakes <ArrowRight /></Link></article>) : <div className="dash-empty"><Clock3 /><h3>No attempts yet</h3><p>Complete a test to review your answers here.</p></div>}
          </div>
        </article>
      </section>

      <section className="dash-recommended">
        <div className="dash-panel-head"><div><h2>My series &amp; packages</h2><p>Your active purchased or granted access</p></div><Link href="/my-purchases">Manage purchases <ArrowRight /></Link></div>
        {purchasesQuery.isLoading ? <p className="dash-empty" role="status">Loading your access…</p> : purchasesQuery.isError ? <div className="dash-empty"><p>Your packages could not be loaded.</p><button onClick={() => void purchasesQuery.refetch()}>Try again</button></div> : activeAccess.length ? <div className="dash-series-grid">{activeAccess.slice(0,4).map(item => <Link className="dash-series-card" href="/my-purchases" key={item.id}><span className="dash-series-logo"><BookOpen /></span><span className="dash-series-copy"><b>{item.productTitle}</b><small>{item.testCount} tests · Active access</small><small>{item.endsAt ? "Valid until " + formatDate(item.endsAt) : "No end date"}</small></span><span className="dash-series-arrow"><ChevronRight /></span></Link>)}</div> : <div className="dash-empty dash-access-empty"><BookOpen /><p>Your active series and packages will appear here.</p><Link href="/store">Explore store <ArrowRight /></Link></div>}
      </section>
    </div>
  );
}
