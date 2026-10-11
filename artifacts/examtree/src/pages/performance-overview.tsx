import { useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Activity, ArrowRight, BarChart3, CheckCircle2, Clock3, FileText,
  Filter, Gauge, RefreshCw, Target, TrendingUp, Trophy,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie,
  PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

import { getUserAttempts, type TestAttempt } from "@/lib/data";
import { getUser } from "@/lib/storage";
import {
  aggregateSections, aggregateTopics, confirmedRealAttempts,
  scoreTrend, summarizePerformance,
} from "@/lib/performance-metrics";

type Range = "all" | "30" | "90";

function pct(value: number | null): string {
  return value == null ? "—" : String(value) + "%";
}

function duration(seconds: number): string {
  if (seconds <= 0) return "—";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return String(minutes) + " min";
  return String(Math.floor(minutes / 60)) + "h " + String(minutes % 60) + "m";
}

function dateLabel(value: string | Date): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Date unavailable" :
    new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parsed);
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function BlankChart({ children }: { children: ReactNode }) {
  return <p className="flex min-h-44 items-center justify-center rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">{children}</p>;
}

export default function PerformanceOverview() {
  const user = getUser();
  const [examFilter, setExamFilter] = useState("all");
  const [testFilter, setTestFilter] = useState("all");
  const [range, setRange] = useState<Range>("all");

  const attemptsQuery = useQuery({
    queryKey: ["canonical-attempt-history", user?.id],
    queryFn: () => getUserAttempts(user?.id),
    enabled: Boolean(user),
    staleTime: 30_000,
    retry: false,
  });

  const allAttempts = useMemo(
    () => confirmedRealAttempts(attemptsQuery.data ?? []),
    [attemptsQuery.data],
  );

  const examNames = useMemo(
    () => Array.from(new Set(allAttempts.map((a) => a.category?.trim() || "Other"))).sort(),
    [allAttempts],
  );

  const availableTests = useMemo(() => {
    const map = new Map<string, string>();
    for (const attempt of allAttempts) {
      if (examFilter !== "all" && (attempt.category?.trim() || "Other") !== examFilter) continue;
      map.set(attempt.testId, attempt.testName || "Test");
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [allAttempts, examFilter]);

  const selected = useMemo(() => {
    const now = Date.now();
    const minDate = range === "all" ? null : now - Number(range) * 24 * 60 * 60 * 1000;
    return allAttempts.filter((a) => {
      if (examFilter !== "all" && (a.category?.trim() || "Other") !== examFilter) return false;
      if (testFilter !== "all" && a.testId !== testFilter) return false;
      if (minDate !== null && !(new Date(a.createdAt).getTime() >= minDate)) return false;
      return true;
    });
  }, [allAttempts, examFilter, testFilter, range]);

  const summary = useMemo(() => summarizePerformance(selected), [selected]);
  const sections = useMemo(() => aggregateSections(selected), [selected]);
  const topics = useMemo(() => aggregateTopics(selected), [selected]);
  const trend = useMemo(() => scoreTrend(selected), [selected]);
  const focusTopics = useMemo(() => topics.filter((t) => t.answered >= 5), [topics]);
  const weakTopics = focusTopics.slice(0, 5);
  const strongTopics = [...focusTopics].sort((a, b) => b.accuracy - a.accuracy || b.answered - a.answered).slice(0, 5);
  const measuredSections = sections.filter((s) => s.answered >= 5 && s.accuracy !== null);
  const weakestSection = measuredSections.length > 0 ? measuredSections[measuredSections.length - 1] : null;
  const responseMix = [
    { name: "Correct", value: summary.correct, color: "#16a085" },
    { name: "Incorrect", value: summary.wrong, color: "#f97373" },
    { name: "Unanswered", value: summary.unanswered, color: "#cbd5e1" },
  ];

  const tiles = [
    { label: "Tests completed", value: String(summary.completed), note: "Confirmed real attempts", icon: FileText },
    { label: "Average score", value: pct(summary.averageScore), note: "Mean of saved test scores", icon: BarChart3 },
    { label: "Best score", value: pct(summary.bestScore), note: "Highest saved test score", icon: Trophy },
    { label: "Answer accuracy", value: pct(summary.accuracy), note: "Correct ÷ answered questions", icon: CheckCircle2 },
    { label: "Attempt rate", value: pct(summary.attemptRate), note: "Answered ÷ available questions", icon: Target },
    { label: "Time per answer", value: summary.secondsPerAnswered == null ? "—" : String(summary.secondsPerAnswered) + "s", note: "Recorded time ÷ answered questions", icon: Gauge },
  ];

  return (
    <main id="main-content" className="mx-auto w-full max-w-7xl space-y-6 px-4 py-7 sm:px-6 lg:py-9" data-testid="canonical-performance">
      <header className="rounded-3xl border border-[#dfe5f6] bg-gradient-to-r from-[#eef3ff] via-white to-[#f1f8ff] px-5 py-7 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600"><Activity size={15} /> Your preparation insights</span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Performance Analytics</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Understand your scores, accuracy, speed and focus areas from saved test attempts.</p>
          </div>
          <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">My activity <ArrowRight size={16} /></Link>
        </div>
        <p className="mt-5 text-xs text-slate-500">Only confirmed attempts are included. Rank, percentile and cutoff predictions are not shown without verified comparison data.</p>
      </header>

      {attemptsQuery.isLoading ? (
        <div role="status" className="rounded-2xl border bg-white p-8 text-slate-600">Loading saved performance…</div>
      ) : attemptsQuery.isError ? (
        <div role="alert" className="rounded-2xl border bg-white p-8">
          <h2 className="font-bold text-slate-900">Your performance is temporarily unavailable</h2>
          <p className="mt-2 text-sm text-slate-600">We could not retrieve confirmed attempts. No estimated results are displayed.</p>
          <button type="button" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white" onClick={() => void attemptsQuery.refetch()}><RefreshCw size={16} /> Try again</button>
        </div>
      ) : allAttempts.length === 0 ? (
        <div className="rounded-2xl border bg-white p-9 text-center">
          <BarChart3 className="mx-auto mb-4 text-indigo-600" size={35} />
          <h2 className="text-xl font-bold text-slate-900">Your results will appear here</h2>
          <p className="mt-2 text-sm text-slate-600">Complete a published test to start building your performance history.</p>
          <Link href="/mock-tests" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white">Explore tests <ArrowRight size={16} /></Link>
        </div>
      ) : (
        <>
          <section aria-label="Performance filters" className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 self-center pr-2 text-sm font-bold text-slate-700"><Filter size={17} /> Filters</div>
            <label className="min-w-36 flex-1 text-xs font-semibold text-slate-600">Exam category
              <select className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900" value={examFilter} onChange={(event) => { setExamFilter(event.target.value); setTestFilter("all"); }}>
                <option value="all">All categories</option>
                {examNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <label className="min-w-36 flex-1 text-xs font-semibold text-slate-600">Test
              <select className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900" value={testFilter} onChange={(event) => setTestFilter(event.target.value)}>
                <option value="all">All tests</option>
                {availableTests.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
            <label className="min-w-36 flex-1 text-xs font-semibold text-slate-600">Time period
              <select className="mt-1 block min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900" value={range} onChange={(event) => setRange(event.target.value as Range)}>
                <option value="all">All time</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
              </select>
            </label>
            <button type="button" className="min-h-11 rounded-xl px-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-50" onClick={() => { setExamFilter("all"); setTestFilter("all"); setRange("all"); }}>Reset</button>
          </section>

          {selected.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center">
              <h2 className="font-bold text-slate-900">No attempts match these filters</h2>
              <p className="mt-2 text-sm text-slate-500">Choose another exam, test or time period to view your saved performance.</p>
              <button type="button" className="mt-4 min-h-11 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white" onClick={() => { setExamFilter("all"); setTestFilter("all"); setRange("all"); }}>Show all attempts</button>
            </div>
          ) : (
            <>
              <section aria-label="Performance summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {tiles.map(({ label, value, note, icon: Icon }) => (
                  <article key={label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="mb-4 inline-flex rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Icon size={19} /></span>
                    <p className="text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
                    <h2 className="mt-1 text-xs font-bold text-slate-700">{label}</h2>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">{note}</p>
                  </article>
                ))}
              </section>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
                <Panel title="Score & accuracy trend" subtitle="Up to 12 latest attempts, ordered oldest to newest. Different tests may have different difficulty levels.">
                  {trend.length < 2 ? <BlankChart>Complete another test to see a trend.</BlankChart> : (
                    <>
                      <div role="img" aria-label="Line chart comparing percentage score and answer accuracy over the latest saved tests" className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trend} margin={{ top: 10, right: 12, left: -15, bottom: 0 }}>
                            <defs><linearGradient id="et-score-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f46e5" stopOpacity={0.23} /><stop offset="100%" stopColor="#4f46e5" stopOpacity={0.01} /></linearGradient></defs>
                            <CartesianGrid stroke="#edf0f7" strokeDasharray="3 4" vertical={false} />
                            <XAxis dataKey="index" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                            <Tooltip labelFormatter={(value) => "Attempt " + String(value)} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                            <Area type="monotone" dataKey="score" name="Score %" stroke="#4f46e5" strokeWidth={3} fill="url(#et-score-gradient)" />
                            <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#0d9488" strokeWidth={2} fill="transparent" connectNulls={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Latest: {trend[trend.length - 1].name} · {dateLabel(trend[trend.length - 1].date)}</p>
                      {summary.scoreChangePoints !== null ? <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700"><TrendingUp size={14} /> Last score change: {summary.scoreChangePoints > 0 ? "+" : ""}{summary.scoreChangePoints} percentage points versus previous attempt</p> : null}
                    </>
                  )}
                </Panel>

                <Panel title="Answer breakdown" subtitle="Share of all questions in the selected attempts.">
                  {summary.questions === 0 ? <BlankChart>Answer counts are not available.</BlankChart> : (
                    <>
                      <div role="img" aria-label="Donut chart showing correct, incorrect and unanswered questions" className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart><Pie data={responseMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
                            {responseMix.map((item) => <Cell key={item.name} fill={item.color} />)}
                          </Pie><Tooltip /></PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {responseMix.map((item) => <div key={item.name}><span className="mx-auto mb-1 block h-2 w-6 rounded-full" style={{ backgroundColor: item.color }} /><p className="text-lg font-extrabold text-slate-900">{item.value}</p><p className="text-[11px] text-slate-500">{item.name}</p></div>)}
                      </div>
                    </>
                  )}
                </Panel>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Panel title="Section-wise performance" subtitle="Accuracy is correct ÷ answered questions; attempt rate is answered ÷ available questions.">
                  {sections.length === 0 ? <BlankChart>Section-level statistics are not available for these attempts.</BlankChart> : (
                    <>
                      <div role="img" aria-label="Bar chart of measured section accuracy and attempt rate" className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={sections.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 15, left: 4, bottom: 0 }}>
                            <CartesianGrid stroke="#edf0f7" horizontal={false} strokeDasharray="3 4" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <YAxis type="category" dataKey="name" width={115} tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="accuracy" name="Accuracy %" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={12} />
                            <Bar dataKey="attemptRate" name="Attempt rate %" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={12} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-3 space-y-2">
                        {sections.map((section) => <div key={section.name} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-2 text-xs"><span className="font-semibold text-slate-800">{section.name}</span><span className="text-slate-500">{section.correct} correct · {section.wrong} wrong · {section.unanswered} skipped · {pct(section.accuracy)} accuracy</span></div>)}
                      </div>
                    </>
                  )}
                </Panel>

                <Panel title="Areas to improve" subtitle="Focus suggestions require at least five answered questions per section or topic.">
                  {weakestSection ? <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Section to review</p>
                    <p className="mt-1 text-lg font-extrabold text-slate-900">{weakestSection.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{pct(weakestSection.accuracy)} accuracy across {weakestSection.answered} answered questions.</p>
                  </div> : <p className="mb-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">More answered questions are needed for a reliable section suggestion.</p>}
                  {weakTopics.length > 0 ? <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Topics needing attention</h3>
                    {weakTopics.map((topic) => <div key={topic.section + "|" + topic.topic}>
                      <div className="flex items-start justify-between gap-2 text-xs"><div><p className="font-semibold text-slate-800">{topic.topic}</p><p className="text-slate-500">{topic.section} · {topic.answered} answered</p></div><span className="font-bold text-amber-700">{pct(topic.accuracy)}</span></div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: String(topic.accuracy) + "%" }} /></div>
                    </div>)}
                  </div> : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Topic-level insights will appear when saved questions have topic tags and sufficient answered questions.</p>}
                </Panel>
              </div>

              {strongTopics.length > 0 ? (
                <Panel title="Strongest topics" subtitle="Your higher-accuracy topics with at least five answered questions each.">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{strongTopics.map((topic) => (
                    <div key={topic.section + "|" + topic.topic} className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
                      <p className="text-xs font-semibold text-teal-700">{topic.section}</p>
                      <p className="mt-1 font-bold text-slate-900">{topic.topic}</p>
                      <p className="mt-2 text-xl font-extrabold text-teal-700">{pct(topic.accuracy)}</p>
                      <p className="text-xs text-slate-600">Across {topic.answered} answered questions</p>
                    </div>
                  ))}</div>
                </Panel>
              ) : null}

              <Panel title="Recent test attempts" subtitle="Open a saved attempt for question-level review and explanations.">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[660px] text-left text-sm">
                    <thead><tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500"><th className="pb-3 pr-4">Test</th><th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Score</th><th className="pb-3 pr-4">Accuracy</th><th className="pb-3 pr-4">Time</th><th className="pb-3 text-right">Result</th></tr></thead>
                    <tbody>{[...selected].reverse().slice(0, 20).map((attempt: TestAttempt) => {
                      const accuracy = attempt.correct + attempt.wrong > 0 ? Math.round(1000 * attempt.correct / (attempt.correct + attempt.wrong)) / 10 : null;
                      return <tr key={attempt.id} className="border-b border-slate-100 last:border-0">
                        <td className="max-w-56 py-3 pr-4"><p className="truncate font-semibold text-slate-900" title={attempt.testName}>{attempt.testName || "Test attempt"}</p><p className="text-xs text-slate-500">{attempt.correct} correct · {attempt.wrong} wrong</p></td>
                        <td className="py-3 pr-4 whitespace-nowrap text-slate-600">{dateLabel(attempt.createdAt)}</td>
                        <td className="py-3 pr-4 font-bold text-indigo-700">{pct(Math.round(attempt.score * 10) / 10)}</td>
                        <td className="py-3 pr-4">{pct(accuracy)}</td>
                        <td className="py-3 pr-4 whitespace-nowrap"><span className="inline-flex items-center gap-1 text-slate-600"><Clock3 size={13} /> {duration(attempt.timeSpent)}</span></td>
                        <td className="py-3 text-right"><Link href={"/result?attemptId=" + encodeURIComponent(attempt.id)} className="inline-flex min-h-10 items-center gap-1 whitespace-nowrap rounded-lg border border-indigo-200 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-50">Review <ArrowRight size={13} /></Link></td>
                      </tr>;
                    })}</tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-slate-500">Showing up to 20 recent saved attempts. All selected attempts contribute to summary metrics and section/topic insights. Recorded total time: {duration(summary.recordedSeconds)}.</p>
              </Panel>
            </>
          )}
        </>
      )}
    </main>
  );
}
