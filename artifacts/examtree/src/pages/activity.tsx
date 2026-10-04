import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Flame,
  Globe2,
  Landmark,
  Newspaper,
  Search,
  Target,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";

import { CategoryIcon } from "@/components/CategoryIcon";
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

const suggestedPractice = [
  { title: "Polity – Fundamental Rights", meta: "25 Questions  |  ~15 mins  |  Static GK", badge: "Weak Area", tone: "blue", icon: Landmark, href: "/mock-tests" },
  { title: "Geography – Rivers of India", meta: "30 Questions  |  ~20 mins  |  Static GK", badge: "Recommended", tone: "green", icon: Globe2, href: "/mock-tests" },
  { title: "Current Affairs – Weekly Revision", meta: "20 Questions  |  ~10 mins  |  Current Affairs", badge: "Quick Practice", tone: "indigo", icon: BarChart3, href: "/current-affairs" },
  { title: "Previous Year Questions", meta: "30 Questions  |  ~25 mins  |  SSC CGL", badge: "High Weightage", tone: "violet", icon: FileText, href: "/pyqs" },
] as const;

const upcomingTests = [
  { name: "SSC CGL 2025", detail: "Full Length Mock Test 05", meta: "200 Questions  |  2 hrs", date: "12", month: "OCT", logo: "/category-icons/SSC-CGL.png" },
  { name: "IBPS PO 2025", detail: "Prelims Mock Test 03", meta: "100 Questions  |  1 hr", date: "15", month: "OCT" },
  { name: "Punjab Patwari 2025", detail: "Full Mock Test 01", meta: "100 Questions  |  2 hrs", date: "18", month: "OCT", logo: "/category-icons/punjab.png" },
  { name: "Daily Current Affairs Quiz", detail: "10 Questions", meta: "10 Questions  |  10 mins", date: "TODAY", month: "", icon: BookOpen },
] as const;

const recommendedSeries = [
  { name: "SSC CGL Full Test Series", meta: "120+ Tests  |  Bilingual", price: "₹499", oldPrice: "₹999", logo: "/category-icons/SSC-CGL.png", href: "/ssc-cgl" },
  { name: "IBPS PO Test Series", meta: "100+ Tests  |  Bilingual", price: "₹399", oldPrice: "₹799", href: "/ibps-po" },
  { name: "Punjab Patwari Test Series", meta: "80+ Tests  |  Bilingual", price: "₹299", oldPrice: "₹599", logo: "/category-icons/punjab.png", href: "/punjab-patwari" },
  { name: "Static GK Complete Series", meta: "200+ Tests  |  Bilingual", price: "₹399", oldPrice: "₹799", href: "/mock-tests" },
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

  const realAttempts = useMemo(
    () => (attemptsQuery.data ?? [])
      .filter((attempt) => !attempt.attemptType || attempt.attemptType === "REAL")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [attemptsQuery.data],
  );

  const stats = useMemo(() => {
    const totalQuestions = realAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const correct = realAttempts.reduce((sum, a) => sum + a.correct, 0);
    const average = realAttempts.length ? Math.round(realAttempts.reduce((sum, a) => sum + a.score, 0) / realAttempts.length) : 72;
    return {
      count: realAttempts.length || 48,
      average,
      accuracy: totalQuestions ? Math.round((correct / totalQuestions) * 100) : 68,
      streak: getCurrentStreak(realAttempts) || 12,
    };
  }, [realAttempts]);

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Student";
  const trend = realAttempts.length
    ? realAttempts.slice(0, 8).reverse().map((a) => Math.max(20, Math.min(100, Math.round(a.score))))
    : [38, 43, 56, 66, 59, 71, 82, 88];

  const focusTest = testsQuery.data?.find((test) => /ssc cgl/i.test(test.name)) ?? testsQuery.data?.[0];

  return (
    <div className="student-hub-dashboard" data-testid="student-dashboard">
      <section className="dash-hero">
        <div className="dash-hero-copy">
          <h1>Welcome back, {firstName}! <span aria-hidden="true">👋</span></h1>
          <p>Stay consistent. Every test brings you closer to your goal.</p>

          <div className="dash-focus-card">
            <div className="dash-focus-logo">
              <img src="/category-icons/SSC-CGL.png" alt="" />
            </div>
            <div className="dash-focus-main">
              <div className="dash-focus-topline"><span>Your Current Focus</span><Link href="/exams">Change</Link></div>
              <h2>{focusTest?.name || "SSC CGL 2025"}</h2>
              <div className="dash-focus-progress"><span style={{ width: "62%" }} /></div>
              <div className="dash-focus-meta"><span>62% syllabus completed</span><span>38 topics left</span></div>
            </div>
          </div>
        </div>

        <div className="dash-study-scene" aria-hidden="true">
          <div className="dash-desk-glow" />
          <div className="dash-book-stack"><i>STATIC GK</i><i>BANKING</i><i>SSC</i></div>
          <div className="dash-pencil-cup"><span /><span /><span /></div>
          <div className="dash-note-pad" />
        </div>
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
            <div><h2>Suggested Practice for You</h2><p>Based on your progress, weak areas and recent tests</p></div>
            <Link href="/mock-tests">View All <ArrowRight /></Link>
          </div>
          <div className="dash-practice-list">
            {suggestedPractice.map((item) => (
              <div className="dash-practice-row" key={item.title}>
                <span className={"dash-practice-icon tone-" + item.tone}><item.icon /></span>
                <div className="dash-practice-copy">
                  <div><b>{item.title}</b><span className={"dash-badge tone-" + item.tone}>{item.badge}</span></div>
                  <small>{item.meta}</small>
                </div>
                <Link href={item.href} className="dash-primary-btn">Start Practice</Link>
              </div>
            ))}
          </div>
        </article>

        <article className="dash-panel dash-performance-panel">
          <div className="dash-panel-head">
            <h2>Performance Overview</h2>
            <Link href="/performance">View Detailed Analysis <ArrowRight /></Link>
          </div>
          <div className="dash-performance-top">
            <div className="dash-score-ring" style={{ "--score": stats.average } as React.CSSProperties}>
              <div><b>{stats.average}%</b><span>Average Score</span></div>
            </div>
            <div className="dash-performance-stats">
              <span><FileText /><b>{stats.count}</b><small>Tests Attempted</small></span>
              <span><CheckCircle2 /><b>{stats.accuracy}%</b><small>Accuracy Rate</small></span>
              <span><Flame /><b>{stats.streak}</b><small>Current Streak (Days)</small></span>
              <span><Trophy /><b>Top 35%</b><small>Among all aspirants</small></span>
            </div>
          </div>
          <div className="dash-trend">
            <div className="dash-trend-title">Score Trend (Last 10 Tests)</div>
            <div className="dash-chart">
              {trend.map((value, index) => <span key={index} style={{ height: value + "%" }}><i /></span>)}
            </div>
          </div>
        </article>

        <article className="dash-panel dash-upcoming-panel">
          <div className="dash-panel-head">
            <h2>Upcoming Tests</h2>
            <Link href="/mock-tests">View All <ArrowRight /></Link>
          </div>
          <div className="dash-upcoming-list">
            {upcomingTests.map((item) => (
              <div className="dash-upcoming-row" key={item.name}>
                <span className="dash-upcoming-logo">{item.logo ? <img src={item.logo} alt="" /> : item.icon ? <item.icon /> : <BookOpen />}</span>
                <div><b>{item.name}</b><span>{item.detail}</span><small><Clock3 /> {item.meta}</small></div>
                <time><strong>{item.date}</strong><span>{item.month}</span></time>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dash-recommended">
        <div className="dash-panel-head">
          <div><h2>Recommended for You</h2><p>Based on your preparation and performance</p></div>
          <Link href="/exams">View All <ArrowRight /></Link>
        </div>
        <div className="dash-series-grid">
          {recommendedSeries.map((item, index) => (
            <Link className="dash-series-card" href={item.href} key={item.name}>
              <span className="dash-series-logo">
                {item.logo ? <img src={item.logo} alt="" /> : index === 1 ? <span className="dash-ibps-mark">IB</span> : <FileText />}
              </span>
              <span className="dash-series-copy"><b>{item.name}</b><small>{item.meta}</small><span><strong>{item.price}</strong><del>{item.oldPrice}</del></span></span>
              <span className="dash-series-arrow"><ChevronRight /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
