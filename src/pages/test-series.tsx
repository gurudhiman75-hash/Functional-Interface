import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileQuestion,
  Languages,
  ListChecks,
  LockKeyhole,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getStudentTestSeriesDetail, type StudentSeriesMember } from "@/lib/test-series";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

type SeriesFilter = "all" | "full-length" | "sectional" | "topic-wise";

const FILTER_LABELS: Record<SeriesFilter, string> = {
  all: "All tests",
  "full-length": "Full length",
  sectional: "Sectional",
  "topic-wise": "Topic wise",
};

function formatDate(value: string | null): string {
  if (!value) return "Not announced";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function progressionLabel(mode: "open" | "sequential" | "score_gated") {
  if (mode === "open") return "Open access";
  if (mode === "sequential") return "Complete in order";
  return "Score-gated progression";
}

function normalize(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function languageLabel(code: string) {
  if (code === "en") return "English";
  if (code === "hi") return "Hindi";
  if (code === "pa") return "Punjabi";
  return code.toUpperCase();
}

function MemberStatus({ member }: { member: StudentSeriesMember }) {
  if (member.completed && member.scoreRequirementMet) {
    return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Completed</span>;
  }
  if (member.completed && !member.scoreRequirementMet) {
    return <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><RefreshCw className="h-3.5 w-3.5" />Retake needed</span>;
  }
  if (member.unlocked) {
    return <span className="inline-flex items-center gap-1 rounded-full border border-[#dcd7ff] bg-[#f5f2ff] px-2.5 py-1 text-xs font-semibold text-[#6657e8]"><PlayCircle className="h-3.5 w-3.5" />Available</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600"><LockKeyhole className="h-3.5 w-3.5" />Locked</span>;
}

export default function TestSeriesPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const catalog = useExamCatalog();
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SeriesFilter>("all");

  const query = useQuery({
    queryKey: ["student-test-series", id],
    queryFn: () => getStudentTestSeriesDetail(id!),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const nextMember = useMemo(
    () => query.data?.eligibility.members.find((member) => member.testId === query.data?.eligibility.nextTestId) ?? null,
    [query.data],
  );

  const matchingSubcategory = useMemo(() => {
    const series = query.data?.series;
    if (!series) return null;
    const examName = normalize(series.examName);
    const examCode = normalize(series.examCode);
    return catalog.subcategories.find((subcategory) => {
      const candidate = normalize(subcategory.name);
      return candidate === examName || candidate === examCode || examName.includes(candidate) || candidate.includes(examName);
    }) ?? null;
  }, [catalog.subcategories, query.data?.series]);

  const matchingExamTests = useMemo(() => {
    const series = query.data?.series;
    if (!series) return [];
    const examName = normalize(series.examName);
    const subcategoryId = matchingSubcategory?.id ?? null;
    return catalog.tests.filter((test) => {
      if (subcategoryId && test.subcategoryId === subcategoryId) return true;
      const candidate = normalize(test.subcategoryName);
      return Boolean(candidate && (candidate === examName || candidate.includes(examName) || examName.includes(candidate)));
    });
  }, [catalog.tests, matchingSubcategory?.id, query.data?.series]);

  const catalogTestById = useMemo(() => new Map(catalog.tests.map((test) => [test.id, test])), [catalog.tests]);

  const subjectNames = useMemo(() => {
    const names = new Set<string>();
    matchingExamTests.forEach((test) => test.sections.forEach((section) => {
      const name = section.name.trim();
      if (name) names.add(name);
    }));
    return Array.from(names).slice(0, 12);
  }, [matchingExamTests]);

  const examLanguages = useMemo(() => {
    const codes = new Set<string>();
    matchingExamTests.forEach((test) => (test.languages ?? []).forEach((language) => codes.add(language)));
    if (matchingSubcategory?.languages) matchingSubcategory.languages.forEach((language) => codes.add(language));
    return Array.from(codes).map(languageLabel);
  }, [matchingExamTests, matchingSubcategory?.languages]);

  const filterCounts = useMemo(() => {
    const counts: Record<SeriesFilter, number> = { all: 0, "full-length": 0, sectional: 0, "topic-wise": 0 };
    const members = query.data?.eligibility.members ?? [];
    counts.all = members.length;
    members.forEach((member) => {
      const kind = catalogTestById.get(member.testId)?.kind;
      if (kind) counts[kind] += 1;
    });
    return counts;
  }, [catalogTestById, query.data?.eligibility.members]);

  const visibleMembers = useMemo(() => {
    const members = query.data?.eligibility.members ?? [];
    if (activeFilter === "all") return members;
    return members.filter((member) => catalogTestById.get(member.testId)?.kind === activeFilter);
  }, [activeFilter, catalogTestById, query.data?.eligibility.members]);

  if (query.isLoading) {
    return <div className="mx-auto max-w-6xl space-y-5"><div className="skeleton-shimmer h-64 rounded-3xl" /><div className="skeleton-shimmer h-96 rounded-3xl" /></div>;
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-[#e5e2f4] bg-white p-8 text-center shadow-[0_12px_38px_rgba(40,43,72,0.05)]">
        <LockKeyhole className="mx-auto h-9 w-9 text-slate-400" />
        <h1 className="mt-4 text-xl font-bold text-slate-950">Could not load this test series</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{query.error instanceof Error ? query.error.message : "The series may be unavailable or your session may have expired."}</p>
        <Button className="mt-5 min-h-11 rounded-xl" variant="outline" onClick={() => setLocation("/tests")}><ArrowLeft className="mr-2 h-4 w-4" />Back to tests</Button>
      </div>
    );
  }

  const { series, eligibility } = query.data;
  const unavailable = !eligibility.available;
  const examDescription = matchingSubcategory?.description || series.description || `Prepare for ${series.examName} with structured ExamTree mock tests.`;
  const scheduledRelease = eligibility.members
    .map((member) => member.unlockAt)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())[0] ?? null;
  const importantDates = [
    { label: "Series opens", value: series.availabilityStartAt, icon: CalendarDays },
    { label: "Scheduled release", value: scheduledRelease, icon: CalendarClock },
    { label: "Series closes", value: series.availabilityEndAt, icon: Clock3 },
  ];
  const hasConfiguredDate = importantDates.some((item) => Boolean(item.value));

  return (
    <div className="min-w-0 bg-[#f7f8fc] py-5 sm:py-7">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setLocation("/exams")} className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-slate-500 transition hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" />Back to exams
        </button>

        <section className="overflow-hidden rounded-3xl border border-[#e3dff5] bg-[radial-gradient(circle_at_92%_10%,rgba(108,92,241,0.14),transparent_24rem),linear-gradient(120deg,#ffffff_0%,#f7f5ff_100%)] shadow-[0_16px_44px_rgba(37,42,68,0.05)]" data-testid="test-series-hero">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch lg:p-8">
            <div className="min-w-0">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#ded9fa] bg-white text-[#6657e8] shadow-[0_8px_24px_rgba(71,61,145,0.08)]"><Trophy className="h-8 w-8" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">{series.examFamilyName} · {series.examName}</p>
                  <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-3xl lg:text-[34px]">{series.name}</h1>
                </div>
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[15px]">{examDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-black text-slate-600">
                <span className="rounded-full border border-[#e1def3] bg-white px-3 py-1.5">{progressionLabel(series.progressionMode)}</span>
                <span className="rounded-full border border-[#e1def3] bg-white px-3 py-1.5">{eligibility.totalCount} tests</span>
                {series.completionThreshold != null && <span className="rounded-full border border-[#d9eee4] bg-[#f3fbf7] px-3 py-1.5 text-[#247453]">Pass target {series.completionThreshold}%</span>}
              </div>
            </div>

            <aside className="flex min-w-0 flex-col rounded-2xl border border-white bg-white/90 p-5 shadow-[0_10px_30px_rgba(43,47,72,0.055)] backdrop-blur-sm" aria-label="Series progress">
              <div className="flex items-center justify-between gap-3"><span className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Your progress</span><strong className="text-xl text-slate-950">{eligibility.progressPercent}%</strong></div>
              <Progress value={eligibility.progressPercent} className="mt-3 h-2" />
              <p className="mt-2 text-xs leading-5 text-slate-500">{eligibility.completedRequiredCount} of {eligibility.requiredCount} required tests completed</p>
              <Button className="mt-auto min-h-11 w-full rounded-xl bg-[#6657e8] text-white hover:bg-[#594bd9]" disabled={unavailable || !nextMember} onClick={() => nextMember && setLocation(`/test/${nextMember.testId}?seriesId=${encodeURIComponent(series.id)}`)}>
                {nextMember?.completed ? <RefreshCw className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                {nextMember ? (nextMember.completed ? "Retake available test" : "Continue series") : "Series completed"}
              </Button>
            </aside>
          </div>

          <div className="grid gap-px border-t border-[#e9e6f4] bg-[#e9e6f4] sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white/85 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><FileQuestion className="h-4 w-4 text-[#6657e8]" />Tests</div><p className="mt-1 text-lg font-black text-slate-950">{eligibility.totalCount}</p></div>
            <div className="bg-white/85 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Trophy className="h-4 w-4 text-[#6657e8]" />Completed</div><p className="mt-1 text-lg font-black text-slate-950">{eligibility.completedCount}</p></div>
            <div className="bg-white/85 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><CalendarClock className="h-4 w-4 text-[#6657e8]" />Opens</div><p className="mt-1 text-sm font-bold text-slate-950">{formatDate(series.availabilityStartAt)}</p></div>
            <div className="bg-white/85 p-4"><div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><Clock3 className="h-4 w-4 text-[#6657e8]" />Closes</div><p className="mt-1 text-sm font-bold text-slate-950">{formatDate(series.availabilityEndAt)}</p></div>
          </div>
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]" aria-labelledby="exam-overview-heading">
          <div className="min-w-0 rounded-3xl border border-[#e5e5ee] bg-white p-5 shadow-[0_8px_26px_rgba(37,42,68,0.035)] sm:p-6">
            <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#6657e8]"><BookOpen className="h-5 w-5" /></span><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8]">Exam overview</p><h2 id="exam-overview-heading" className="mt-1 text-xl font-bold tracking-[-0.02em] text-slate-950">About {series.examName}</h2></div></div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{examDescription}</p>
            <button type="button" aria-expanded={showExamDetails} onClick={() => setShowExamDetails((value) => !value)} className="et-interactive mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#dedbea] bg-[#faf9ff] px-4 text-sm font-bold text-[#6657e8] transition hover:bg-[#f4f1ff]">
              {showExamDetails ? "Show less" : "Read more about exam"}{showExamDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showExamDetails ? (
              <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2" data-testid="exam-expanded-details">
                <div className="min-w-0 rounded-2xl border border-[#e8e5f5] bg-[#faf9ff] p-4">
                  <div className="flex items-center gap-2"><ListChecks className="h-4 w-4 text-[#6657e8]" /><h3 className="text-sm font-bold text-slate-950">Syllabus &amp; coverage</h3></div>
                  {subjectNames.length > 0 ? <div className="mt-3 flex flex-wrap gap-2">{subjectNames.map((subject) => <span key={subject} className="rounded-full border border-[#e4e0f4] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">{subject}</span>)}</div> : <p className="mt-3 text-xs leading-5 text-slate-500">Detailed subject coverage is not yet published in the live catalogue for this exam.</p>}
                </div>
                <div className="min-w-0 rounded-2xl border border-[#e8e5f5] bg-[#faf9ff] p-4">
                  <div className="flex items-center gap-2"><Target className="h-4 w-4 text-[#6657e8]" /><h3 className="text-sm font-bold text-slate-950">Test pattern</h3></div>
                  <div className="mt-3 space-y-2 text-xs text-slate-600"><p>{filterCounts["full-length"]} full-length · {filterCounts.sectional} sectional · {filterCounts["topic-wise"]} topic-wise tests in this series</p><p>{progressionLabel(series.progressionMode)}{series.completionThreshold != null ? ` · ${series.completionThreshold}% default pass target` : ""}</p></div>
                </div>
                <div className="min-w-0 rounded-2xl border border-[#e8e5f5] bg-[#faf9ff] p-4">
                  <div className="flex items-center gap-2"><Languages className="h-4 w-4 text-[#6657e8]" /><h3 className="text-sm font-bold text-slate-950">Languages</h3></div>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{examLanguages.length > 0 ? examLanguages.join(" · ") : "Language availability follows each published test."}</p>
                </div>
                <div className="min-w-0 rounded-2xl border border-[#e8e5f5] bg-[#faf9ff] p-4">
                  <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#6657e8]" /><h3 className="text-sm font-bold text-slate-950">What this series includes</h3></div>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{series.description || `${eligibility.totalCount} structured mocks with progress tracking, score requirements and detailed attempt review.`}</p>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="min-w-0 rounded-3xl border border-[#e3dff5] bg-[#f8f7ff] p-5 shadow-[0_8px_26px_rgba(37,42,68,0.03)] sm:p-6" aria-labelledby="important-dates-heading">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6657e8] shadow-sm"><CalendarDays className="h-5 w-5" /></span><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8]">Plan ahead</p><h2 id="important-dates-heading" className="mt-1 text-lg font-bold text-slate-950">Important dates</h2></div></div>
            {hasConfiguredDate ? <div className="mt-4 space-y-3">{importantDates.filter((item) => item.value).map((item) => { const Icon = item.icon; return <div key={item.label} className="flex items-start gap-3 rounded-xl border border-[#e7e3f7] bg-white p-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{item.label}</p><p className="mt-0.5 text-xs font-bold leading-5 text-slate-700">{formatDate(item.value)}</p></div></div>; })}</div> : <div className="mt-4 rounded-xl border border-dashed border-[#d9d4ef] bg-white/70 p-4 text-xs leading-5 text-slate-500">No official dates are configured for this series yet. The page will surface them here when they are published.</div>}
            <p className="mt-3 text-[11px] leading-5 text-slate-400">Only dates supplied by the live ExamTree series configuration are shown here.</p>
          </aside>
        </section>

        {eligibility.availabilityReason && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>{eligibility.availabilityReason}</strong> The test list remains visible so you can review the planned sequence.
          </div>
        )}

        <section className="min-w-0" aria-labelledby="series-tests-heading">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6657e8]">Preparation path</p><h2 id="series-tests-heading" className="mt-1.5 text-xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[22px]">Series tests</h2><p className="mt-1.5 text-sm leading-6 text-slate-500">Progress uses your evaluated ExamTree attempts and best percentage score.</p></div>
          </div>

          <div className="mt-4 max-w-full overflow-x-auto pb-1"><div role="tablist" aria-label="Series test type" className="inline-flex min-w-max rounded-xl border border-[#e4e3ec] bg-white p-1 shadow-[0_4px_14px_rgba(31,41,55,0.035)]">{(["all", "full-length", "sectional", "topic-wise"] as SeriesFilter[]).map((filter) => <button key={filter} type="button" role="tab" aria-selected={activeFilter === filter} onClick={() => setActiveFilter(filter)} className={`et-interactive min-h-11 rounded-lg px-3.5 text-sm font-bold transition ${activeFilter === filter ? "bg-[#6657e8] text-white" : "text-slate-600 hover:bg-[#f7f5ff]"}`}>{FILTER_LABELS[filter]}{filterCounts[filter] > 0 ? ` (${filterCounts[filter]})` : ""}</button>)}</div></div>

          <div className="mt-4 space-y-3">
            {visibleMembers.map((member, index) => {
              const catalogTest = catalogTestById.get(member.testId);
              return (
                <article key={member.id} className={`rounded-2xl border bg-white p-5 shadow-[0_7px_24px_rgba(37,42,68,0.035)] transition ${member.unlocked ? "border-[#ddd8f7] hover:border-[#cfc7f5]" : "border-slate-200 opacity-90"}`}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${member.completed ? "bg-emerald-50 text-emerald-700" : member.unlocked ? "bg-[#eeeaff] text-[#6657e8]" : "bg-slate-100 text-slate-500"}`}>
                        {member.completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-950">{member.title}</h3><MemberStatus member={member} />{!member.isRequired && <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-500">Optional</span>}{catalogTest?.access && <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${catalogTest.access === "free" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#e3dff8] bg-[#f8f7ff] text-[#6657e8]"}`}>{catalogTest.access === "free" ? "Free" : "Premium"}</span>}</div>
                        <p className="mt-1 text-sm text-slate-500">{member.questionCount} questions · {Math.max(1, Math.ceil(member.durationSeconds / 60))} minutes · {member.totalMarks} marks{catalogTest?.kind ? ` · ${catalogTest.kind.replace("-", " ")}` : ""}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          {member.attemptCount > 0 && <span>Attempts: {member.attemptCount}</span>}
                          {member.bestScore != null && <span>Best score: {member.bestScore}%</span>}
                          {member.scoreRequirement != null && <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" />Required: {member.scoreRequirement}%</span>}
                          {member.unlockAt && <span>Release: {formatDate(member.unlockAt)}</span>}
                        </div>
                        {!member.unlocked && member.lockReason && <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700"><LockKeyhole className="h-3.5 w-3.5" />{member.lockReason}</p>}
                      </div>
                    </div>
                    <Button
                      className={`min-h-11 w-full shrink-0 rounded-xl md:w-auto ${member.completed ? "" : "bg-[#6657e8] hover:bg-[#594bd9]"}`}
                      variant={member.completed ? "outline" : "default"}
                      disabled={!member.unlocked}
                      onClick={() => setLocation(`/test/${member.testId}?seriesId=${encodeURIComponent(series.id)}`)}
                    >
                      {member.completed ? <RefreshCw className="mr-2 h-4 w-4" /> : member.unlocked ? <PlayCircle className="mr-2 h-4 w-4" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                      {member.completed ? "Retake" : member.unlocked ? "Start test" : "Locked"}
                    </Button>
                  </div>
                </article>
              );
            })}
            {visibleMembers.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">No tests of this type are currently mapped to the live series catalogue.</div> : null}
          </div>
        </section>

        <div className="rounded-2xl border border-[#e5e2f4] bg-[#faf9ff] p-4 text-xs leading-5 text-slate-500">
          <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" /><p>Unlocking is enforced by the ExamTree server when the test opens and again when an attempt is submitted. Browser changes cannot skip the configured order or score requirement.</p></div>
        </div>
      </div>
    </div>
  );
}
