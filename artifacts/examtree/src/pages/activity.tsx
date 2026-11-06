import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Target,
} from "lucide-react";
import { Link } from "wouter";

import { getCommercePurchases } from "@/lib/commerce";
import { getTests, getUserAttempts, type TestAttempt } from "@/lib/data";
import { getUser, getActiveTestSessions } from "@/lib/storage";
import { hasCanonicalAttemptSession } from "@/lib/api";
import "@/styles/dashboard-approved.css";

function localDayNumber(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export default function ActivityPage() {
  const user = getUser();
  const attemptsQuery = useQuery({ queryKey: ["canonical-attempt-history", user?.id], queryFn: () => getUserAttempts(user?.id), enabled: Boolean(user), retry: false, staleTime: 30_000 });
  const testsQuery = useQuery({ queryKey: ["tests"], queryFn: getTests, staleTime: 60_000 });
  const purchasesQuery = useQuery({ queryKey: ["commerce-purchases", user?.id], queryFn: getCommercePurchases, enabled: Boolean(user), retry: false, staleTime: 30_000 });
  const attempts = useMemo(() => (attemptsQuery.data ?? []).filter(a => !a.attemptType || a.attemptType === "REAL").sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [attemptsQuery.data]);
  const catalogue = testsQuery.data ?? [];
  const access = purchasesQuery.data?.entitlements?.filter(item => item.accessStatus === "active") ?? [];
  const resume = Object.values(getActiveTestSessions()).filter(item => item.attemptType === "REAL" && hasCanonicalAttemptSession(item.testId) && item.timeLeft > 0).sort((a,b) => b.updatedAt - a.updatedAt)[0];
  const today = localDayNumber(new Date()) ?? 0;
  const monday = today - ((new Date().getDay() + 6) % 7);
  const week = attempts.filter(a => { const day = localDayNumber(a.createdAt); return day !== null && day >= monday && day <= today; });
  const questions = week.reduce((sum,a) => sum + a.totalQuestions, 0);
  const accuracy = questions ? Math.round(week.reduce((sum,a) => sum + a.correct, 0) / questions * 100) : null;
  const minutes = Math.round(week.reduce((sum,a) => sum + a.timeSpent, 0) / 60);
  const days = Array.from({length:7},(_,i) => ({label:["M","T","W","T","F","S","S"][i],count:week.filter(a => localDayNumber(a.createdAt) === monday+i).length}));
  const maxCount = Math.max(1,...days.map(d => d.count));
  const topicTests = catalogue.filter(test => test.kind === "topic-wise" || test.kind === "sectional");
  const subjects = [...new Set(topicTests.flatMap(test => test.sections?.map(section => section.name) ?? []).filter(Boolean))].slice(0,4);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Student";
  const formatDate = (value:string | Date) => new Date(value).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
  return <div className="student-hub-dashboard" data-testid="student-dashboard">
    <header className="series-welcome"><div><h1>Welcome back, {firstName}</h1><p>Continue your preparation.</p></div><Link href="/exams" className="series-exam-link">Explore exams <ChevronRight /></Link></header>
    <nav className="series-tabs" aria-label="Preparation views"><Link href="/dashboard" aria-current="page">Overview</Link><Link href="/my-packages">My learning</Link><Link href="/performance">Performance</Link></nav>
    {resume ? <section className="series-resume" aria-label="Continue saved test"><Clock3 /><div><h2>{resume.testName}</h2><p>{Object.values(resume.answers).filter(value => value !== null).length} questions answered · {Math.ceil(resume.timeLeft/60)} min saved</p></div><Link className="series-button" href={"/test/"+encodeURIComponent(resume.testId)}>Resume test <ArrowRight /></Link></section> :
      <section className="series-resume"><Clock3 /><div><h2>Ready for your next attempt?</h2><p>Choose a mock test or a short topic practice.</p></div><Link href="/mock-tests" className="series-button">Browse tests <ArrowRight /></Link></section>}
    <div className="series-main-grid">
      <section className="series-panel series-library"><div className="series-panel-head"><h2>My test series</h2><Link href="/my-packages">View all <ArrowRight /></Link></div>
        {purchasesQuery.isLoading ? <p className="series-empty" role="status">Loading your test series…</p> : purchasesQuery.isError ? <div className="series-empty"><p>Your test series could not be loaded.</p><button onClick={() => void purchasesQuery.refetch()}>Try again</button></div> : access.length ? <div className="series-cards">{access.slice(0,2).map((item,index) => {
          const ids = item.tests?.map(t => t.id);
          const completed = ids ? new Set(attempts.filter(a => ids.includes(a.testId)).map(a => a.testId)).size : null;
          const total = ids ? ids.length : item.testCount;
          const next = item.tests?.find(t => !attempts.some(a => a.testId === t.id)) ?? item.tests?.[0];
          return <article className="series-course" key={item.id}>
            <div className={"series-cover cover-"+(index%2)}><FileText /><div><h3>{item.productTitle}</h3><p>{total} tests · Active access</p></div></div>
            <div className="series-course-body">
              {completed !== null && !attemptsQuery.isError && !attemptsQuery.isLoading ? <><p>{completed} of {total} tests completed</p><progress value={completed} max={Math.max(1,total)} aria-label={item.productTitle+" completion"} /></> : <p>{item.endsAt ? "Valid until "+formatDate(item.endsAt) : "Your series is ready to explore"}</p>}
              <Link className="series-button" href={next ? "/published-tests/"+encodeURIComponent(next.id) : "/my-packages"}>{next ? "Continue" : "Open series"} <ArrowRight /></Link>
            </div>
          </article>;
        })}</div> : <div className="series-empty"><BookOpen /><h3>Your preparation starts here</h3><p>Your purchased or granted test series will appear here.</p><Link className="series-button" href="/store">Explore test series <ArrowRight /></Link><Link href="/mock-tests">Try a free test</Link></div>}
      </section>
      <section className="series-panel series-week"><div className="series-panel-head"><h2>This week</h2></div>
        {attemptsQuery.isLoading ? <p className="series-empty" role="status">Loading your activity…</p> : attemptsQuery.isError ? <div className="series-empty"><p>Activity could not be loaded.</p><button onClick={() => void attemptsQuery.refetch()}>Try again</button></div> : <>
        <dl><div><dt><FileText />Tests attempted</dt><dd>{week.length}</dd></div><div><dt><Target />Accuracy</dt><dd>{accuracy === null ? "—" : accuracy+"%"}</dd></div><div><dt><Clock3 />Practice time</dt><dd>{minutes >= 60 ? Math.floor(minutes/60)+"h "+minutes%60+"m" : minutes+" min"}</dd></div></dl>
        <div className="series-week-chart" role="img" aria-label={"Tests completed Monday to Sunday: "+days.map(d => d.count).join(", ")}>{days.map((d,i) => <div key={i}><div className="series-bar-track"><span style={{height:(d.count/maxCount*100)+"%"}} title={d.count+" tests"} /></div><span>{d.label}</span></div>)}</div>
        {!week.length && <p className="series-chart-note">Complete your first test this week.</p>}
        </>}
      </section>
      <section className="series-panel series-results"><div className="series-panel-head"><h2>Recent results</h2><Link href="/performance">View all <ArrowRight /></Link></div>
        {attemptsQuery.isLoading ? <p className="series-empty" role="status">Loading results…</p> : attemptsQuery.isError ? <p className="series-empty">Your results are temporarily unavailable.</p> : attempts.length ? <div className="series-result-list">{attempts.slice(0,3).map(a => <article key={a.id}><FileText /><div><h3>{a.testName}</h3><small>{formatDate(a.createdAt)}</small></div><strong>{a.score}%</strong><Link href={"/result?attemptId="+encodeURIComponent(a.id)}>Review <ArrowRight /></Link></article>)}</div> : <div className="series-empty"><CheckCircle2 /><p>Complete a test to see your results here.</p></div>}
      </section>
      <section className="series-panel series-subjects"><div className="series-panel-head"><h2>Practise by subject</h2></div>
        {testsQuery.isLoading ? <p className="series-empty" role="status">Loading practice…</p> : testsQuery.isError ? <div className="series-empty"><p>Practice could not be loaded.</p><button onClick={() => void testsQuery.refetch()}>Try again</button></div> : subjects.length ? <div className="series-subject-grid">{subjects.map(subject => {
          const test = topicTests.find(t => t.sections?.some(s => s.name === subject));
          return <Link key={subject} href={test ? "/published-tests/"+encodeURIComponent(test.id) : "/mock-tests"}><BookOpen /><span>{subject}</span><ChevronRight /></Link>;
        })}</div> : <div className="series-empty"><Target /><p>Find available topic and sectional tests.</p></div>}
        <Link href="/mock-tests" className="series-browse">Browse all practice <ArrowRight /></Link>
      </section>
    </div>
    <section className="series-resources" aria-label="Study resources"><Link href="/resources"><BookOpen />Study material</Link><Link href="/current-affairs"><FileText />Current affairs</Link><Link href="/pyqs"><Bookmark />Previous year papers</Link></section>
  </div>;
}
