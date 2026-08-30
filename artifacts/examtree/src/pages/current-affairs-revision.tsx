import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Languages,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createCurrentAffairsAttemptId,
  getCurrentAffairsRevisionQueue,
  submitCurrentAffairsRevision,
  type CurrentAffairsGrade,
  type CurrentAffairsLanguage,
} from "@/lib/current-affairs";

const LANGUAGE_OPTIONS: Array<{ value: CurrentAffairsLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
];

function dueLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Due";
  const hours = Math.max(0, Math.floor((Date.now() - date.getTime()) / 3_600_000));
  if (hours < 1) return "Due now";
  if (hours < 24) return `${hours}h overdue`;
  return `${Math.floor(hours / 24)}d overdue`;
}

export default function CurrentAffairsRevisionPage() {
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState<CurrentAffairsLanguage>("en");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [grade, setGrade] = useState<CurrentAffairsGrade | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const queueQuery = useQuery({
    queryKey: ["current-affairs-revision", language],
    queryFn: () => getCurrentAffairsRevisionQueue(language, 30),
    retry: false,
    staleTime: 15_000,
  });

  const due = queueQuery.data?.due ?? [];
  const resultById = useMemo(() => new Map((grade?.results ?? []).map((result) => [result.id, result])), [grade]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const clientAttemptId = attemptId ?? createCurrentAffairsAttemptId();
      if (!attemptId) setAttemptId(clientAttemptId);
      const response = await submitCurrentAffairsRevision(
        clientAttemptId,
        language,
        due.map((question) => ({
          id: question.id,
          selectedIndex: Number.isInteger(answers[question.id]) ? answers[question.id]! : null,
        })),
      );
      return {
        total: response.attempt.total,
        correct: response.attempt.correct,
        wrong: response.attempt.wrong,
        unanswered: response.attempt.unanswered,
        scorePercent: response.attempt.scorePercent,
        results: response.results,
      } satisfies CurrentAffairsGrade;
    },
    onSuccess: async (result) => {
      setGrade(result);
      await queryClient.invalidateQueries({ queryKey: ["current-affairs-learner-dashboard"] });
    },
  });

  function switchLanguage(next: CurrentAffairsLanguage) {
    if (next === language) return;
    setLanguage(next);
    setAnswers({});
    setGrade(null);
    setAttemptId(null);
    submitMutation.reset();
  }

  async function loadNextBatch() {
    setAnswers({});
    setGrade(null);
    setAttemptId(null);
    submitMutation.reset();
    await queueQuery.refetch();
  }

  if (queueQuery.isLoading) {
    return <div className="mx-auto max-w-4xl pb-12"><div className="skeleton-shimmer h-40 rounded-3xl" /><div className="mt-5 skeleton-shimmer h-[32rem] rounded-3xl" /></div>;
  }

  const queue = queueQuery.data;
  if (!queue) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <BrainCircuit className="mx-auto h-8 w-8 text-slate-300" />
        <h1 className="mt-3 text-xl font-semibold text-slate-900">Revision queue could not be loaded</h1>
        <p className="mt-2 text-sm text-slate-500">Your account must be linked to an active student profile to save Current Affairs progress.</p>
        <Button asChild className="mt-5 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]"><Link href="/current-affairs">Back to Current Affairs</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-12" data-testid="current-affairs-revision-runner">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="rounded-xl px-2 text-slate-500 hover:bg-[#f5f3ff] hover:text-[#6657e8]">
          <Link href="/current-affairs"><ArrowLeft className="mr-2 h-4 w-4" />Current Affairs</Link>
        </Button>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <Languages className="ml-1 h-4 w-4 text-slate-400" />
          {LANGUAGE_OPTIONS.map((option) => (
            <button key={option.value} type="button" disabled={submitMutation.isPending} onClick={() => switchLanguage(option.value)} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${language === option.value ? "bg-[#f0edff] text-[#6657e8]" : "text-slate-500 hover:bg-slate-50"}`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <header className="rounded-3xl border border-[#e2ddf5] bg-[radial-gradient(circle_at_90%_5%,rgba(102,87,232,0.15),transparent_23rem),linear-gradient(135deg,#ffffff,#faf9ff)] p-6 shadow-[0_10px_34px_rgba(37,42,68,0.045)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2"><Badge className="rounded-full bg-[#efeaff] text-[#6657e8] hover:bg-[#efeaff]">Spaced revision</Badge><Badge variant="outline" className="rounded-full border-slate-200 text-slate-500">D3 · D7 · D15 · D30 · D60</Badge></div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">What your memory needs today</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Only questions whose review time has arrived are shown. Correct answers move forward; wrong or skipped items return in recovery.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm"><p className="text-2xl font-semibold text-slate-950">{queue.dueCount}</p><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Due now</p></div>
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm"><p className="text-2xl font-semibold text-slate-950">{queue.upcomingCount}</p><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Upcoming</p></div>
          </div>
        </div>
      </header>

      {due.length === 0 ? (
        <section className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
          <h2 className="mt-3 text-xl font-semibold text-emerald-900">You’re caught up</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-emerald-700">No Current Affairs question is due right now. {queue.nextUpcomingAt ? "Your next review is already scheduled." : "Take a tracked quiz to start your revision ladder."}</p>
          <Button asChild className="mt-5 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]"><Link href="/current-affairs">Open Current Affairs packs</Link></Button>
        </section>
      ) : (
        <>
          {grade ? (
            <section className="mt-5 rounded-3xl border border-[#ddd8f2] bg-white p-6 shadow-[0_8px_30px_rgba(37,42,68,0.04)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#efeaff] text-[#6657e8]"><Sparkles className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-wide text-[#6657e8]">Revision complete</p><p className="mt-1 text-2xl font-semibold text-slate-950">{Math.round(grade.scorePercent)}% · {grade.correct}/{grade.total} correct</p></div></div>
                <Button onClick={() => void loadNextBatch()} variant="outline" className="rounded-xl border-[#dcd7ef] text-[#6657e8]"><RotateCcw className="mr-2 h-4 w-4" />Load next due</Button>
              </div>
            </section>
          ) : null}

          <div className="mt-5 space-y-4">
            {due.map((question, questionIndex) => {
              const result = resultById.get(question.id);
              const selected = answers[question.id];
              const isCorrect = result ? (result.isCorrect ?? result.result === "correct") : false;
              return (
                <article key={question.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(37,42,68,0.03)] sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-400">
                    <span className="rounded-lg bg-[#f1efff] px-2 py-1 text-[#6657e8]">{question.revision.stageLabel}</span>
                    <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{dueLabel(question.revision.dueAt)}</span>
                    <span>{question.sourceQuizCode}</span>
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="flex h-8 min-w-8 items-center justify-center rounded-xl bg-slate-50 text-xs font-bold text-slate-500">{questionIndex + 1}</span>
                    <h2 className="pt-1 text-[15px] font-semibold leading-7 text-slate-900 sm:text-base">{question.stem}</h2>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrectOption = result?.correctIndex === optionIndex;
                      let className = "border-slate-200 bg-white text-slate-700 hover:border-[#b8aff0] hover:bg-[#faf9ff]";
                      if (!grade && isSelected) className = "border-[#8f83eb] bg-[#f3f1ff] text-[#5546cf] ring-1 ring-[#cfc8f6]";
                      if (grade && isCorrectOption) className = "border-emerald-200 bg-emerald-50 text-emerald-800";
                      else if (grade && isSelected && !isCorrectOption) className = "border-rose-200 bg-rose-50 text-rose-800";
                      return <button key={optionIndex} type="button" disabled={Boolean(grade) || submitMutation.isPending} onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition ${className}`}><span className="mr-2 font-semibold opacity-60">{String.fromCharCode(65 + optionIndex)}.</span>{option}</button>;
                    })}
                  </div>
                  {result ? (
                    <div className={`mt-4 rounded-2xl border p-4 ${isCorrect ? "border-emerald-100 bg-emerald-50/70" : "border-rose-100 bg-rose-50/60"}`}>
                      <p className={`text-xs font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>{isCorrect ? "Memory strengthened" : "Recovery scheduled"}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700"><strong>Answer:</strong> {result.correctAnswer ?? question.options[result.correctIndex] ?? "—"}</p>
                      {result.explanation ? <p className="mt-2 text-sm leading-6 text-slate-600">{result.explanation}</p> : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="sticky bottom-3 z-20 mt-5 rounded-2xl border border-[#e0dcf2] bg-white/95 p-3 shadow-[0_12px_38px_rgba(37,42,68,0.12)] backdrop-blur-md sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="px-2 py-1 text-xs text-slate-500"><span className="font-semibold text-slate-800">{Object.keys(answers).length}/{due.length}</span> answered in this due batch</div>
            {!grade ? <Button disabled={submitMutation.isPending || due.length === 0} onClick={() => submitMutation.mutate()} className="mt-2 w-full rounded-xl bg-[#6657e8] px-6 hover:bg-[#594bd9] sm:mt-0 sm:w-auto"><BrainCircuit className="mr-2 h-4 w-4" />{submitMutation.isPending ? "Saving…" : "Complete revision"}</Button> : <Button asChild className="mt-2 w-full rounded-xl bg-[#6657e8] hover:bg-[#594bd9] sm:mt-0 sm:w-auto"><Link href="/current-affairs">Back to hub</Link></Button>}
          </div>
          {submitMutation.isError ? <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">Revision could not be saved. Your selections remain on screen; try again.</p> : null}
        </>
      )}
    </div>
  );
}
