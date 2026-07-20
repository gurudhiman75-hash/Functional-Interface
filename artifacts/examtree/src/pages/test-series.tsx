import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileQuestion,
  LockKeyhole,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getStudentTestSeriesDetail, type StudentSeriesMember } from "@/lib/test-series";

function formatDate(value: string | null): string {
  if (!value) return "No fixed date";
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

function MemberStatus({ member }: { member: StudentSeriesMember }) {
  if (member.completed && member.scoreRequirementMet) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Completed</span>;
  }
  if (member.completed && !member.scoreRequirementMet) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"><RefreshCw className="h-3.5 w-3.5" />Retake needed</span>;
  }
  if (member.unlocked) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700"><PlayCircle className="h-3.5 w-3.5" />Available</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"><LockKeyhole className="h-3.5 w-3.5" />Locked</span>;
}

export default function TestSeriesPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
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

  if (query.isLoading) {
    return <div className="mx-auto max-w-6xl space-y-5"><div className="skeleton-shimmer h-56 rounded-2xl" /><div className="skeleton-shimmer h-96 rounded-2xl" /></div>;
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
        <LockKeyhole className="mx-auto h-9 w-9 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Could not load this test series</h1>
        <p className="mt-2 text-sm text-muted-foreground">{query.error instanceof Error ? query.error.message : "The series may be unavailable or your session may have expired."}</p>
        <Button className="mt-5" variant="outline" onClick={() => setLocation("/tests")}><ArrowLeft className="mr-2 h-4 w-4" />Back to tests</Button>
      </div>
    );
  }

  const { series, eligibility } = query.data;
  const unavailable = !eligibility.available;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button type="button" onClick={() => setLocation("/tests")} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Tests &amp; exams
      </button>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-primary/15 via-background to-background p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{series.examFamilyName} · {series.examName}</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">{series.name}</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{series.description || "A structured sequence of ExamTree mock tests."}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                <span className="rounded-full border bg-background px-3 py-1.5">{progressionLabel(series.progressionMode)}</span>
                <span className="rounded-full border bg-background px-3 py-1.5">Version {series.versionNumber}</span>
                {series.completionThreshold != null && <span className="rounded-full border bg-background px-3 py-1.5">Default pass {series.completionThreshold}%</span>}
              </div>
            </div>
            <div className="min-w-[240px] rounded-xl border bg-background/85 p-4 backdrop-blur">
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Required progress</span><strong>{eligibility.progressPercent}%</strong></div>
              <Progress value={eligibility.progressPercent} className="mt-3 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">{eligibility.completedRequiredCount} of {eligibility.requiredCount} required tests completed</p>
              <Button className="mt-4 w-full" disabled={unavailable || !nextMember} onClick={() => nextMember && setLocation(`/test/${nextMember.testId}?seriesId=${encodeURIComponent(series.id)}`)}>
                {nextMember?.completed ? <RefreshCw className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                {nextMember ? (nextMember.completed ? "Retake available test" : "Continue series") : "Series completed"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-px border-t bg-border sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><FileQuestion className="h-4 w-4" />Tests</div><p className="mt-1 text-lg font-semibold">{eligibility.totalCount}</p></div>
          <div className="bg-card p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Trophy className="h-4 w-4" />Completed</div><p className="mt-1 text-lg font-semibold">{eligibility.completedCount}</p></div>
          <div className="bg-card p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarClock className="h-4 w-4" />Opens</div><p className="mt-1 text-sm font-semibold">{formatDate(series.availabilityStartAt)}</p></div>
          <div className="bg-card p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="h-4 w-4" />Closes</div><p className="mt-1 text-sm font-semibold">{formatDate(series.availabilityEndAt)}</p></div>
        </div>
      </section>

      {eligibility.availabilityReason && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>{eligibility.availabilityReason}</strong> The test list remains visible so you can review the planned sequence.
        </div>
      )}

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold">Series tests</h2>
          <p className="text-sm text-muted-foreground">Progress is calculated from your evaluated ExamTree attempts and best percentage score.</p>
        </div>
        {eligibility.members.map((member, index) => (
          <article key={member.id} className={`rounded-2xl border bg-card p-5 shadow-sm ${member.unlocked ? "border-primary/25" : "opacity-90"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${member.completed ? "bg-emerald-100 text-emerald-700" : member.unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {member.completed ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{member.title}</h3><MemberStatus member={member} />{!member.isRequired && <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">Optional</span>}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{member.questionCount} questions · {Math.max(1, Math.ceil(member.durationSeconds / 60))} minutes · {member.totalMarks} marks</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {member.attemptCount > 0 && <span>Attempts: {member.attemptCount}</span>}
                    {member.bestScore != null && <span>Best score: {member.bestScore}%</span>}
                    {member.scoreRequirement != null && <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" />Required: {member.scoreRequirement}%</span>}
                    {member.unlockAt && <span>Release: {formatDate(member.unlockAt)}</span>}
                  </div>
                  {!member.unlocked && member.lockReason && <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700"><LockKeyhole className="h-3.5 w-3.5" />{member.lockReason}</p>}
                </div>
              </div>
              <Button
                className="shrink-0"
                variant={member.completed ? "outline" : "default"}
                disabled={!member.unlocked}
                onClick={() => setLocation(`/test/${member.testId}?seriesId=${encodeURIComponent(series.id)}`)}
              >
                {member.completed ? <RefreshCw className="mr-2 h-4 w-4" /> : member.unlocked ? <PlayCircle className="mr-2 h-4 w-4" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                {member.completed ? "Retake" : member.unlocked ? "Start test" : "Locked"}
              </Button>
            </div>
          </article>
        ))}
      </section>

      <div className="rounded-xl border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
        <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><p>Unlocking is enforced by the ExamTree server when the test opens and again when an attempt is submitted. Browser changes cannot skip the configured order or score requirement.</p></div>
      </div>
    </div>
  );
}
