import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Languages,
  LockKeyhole,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Link, useParams } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createCurrentAffairsAttemptId,
  getCurrentAffairsQuiz,
  gradeCurrentAffairsQuiz,
  submitTrackedCurrentAffairsQuiz,
  type CurrentAffairsGrade,
  type CurrentAffairsLanguage,
} from "@/lib/current-affairs";
import { getUser } from "@/lib/storage";

const LANGUAGE_OPTIONS: Array<{ value: CurrentAffairsLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
];

function initialLanguage(): CurrentAffairsLanguage {
  if (typeof window === "undefined") return "en";
  const value = new URLSearchParams(window.location.search).get("language")?.toLowerCase();
  return value === "hi" || value === "pa" ? value : "en";
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export default function CurrentAffairsQuizPage() {
  const params = useParams<{ code: string }>();
  const code = params.code ?? "";
  const user = getUser();
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState<CurrentAffairsLanguage>(initialLanguage);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [grade, setGrade] = useState<CurrentAffairsGrade | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const quizQuery = useQuery({
    queryKey: ["current-affairs-quiz", code, language],
    queryFn: () => getCurrentAffairsQuiz(code, language),
    enabled: Boolean(code),
    staleTime: 5 * 60_000,
  });

  const questions = quizQuery.data?.questions ?? [];
  const answeredCount = Object.keys(answers).length;
  const resultById = useMemo(() => new Map((grade?.results ?? []).map((result) => [result.id, result])), [grade]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const submittedAnswers = questions.map((question) => ({
        id: question.id,
        selectedIndex: Number.isInteger(answers[question.id]) ? answers[question.id]! : null,
      }));
      if (user) {
        const clientAttemptId = attemptId ?? createCurrentAffairsAttemptId();
        if (!attemptId) setAttemptId(clientAttemptId);
        const response = await submitTrackedCurrentAffairsQuiz(code, clientAttemptId, language, submittedAnswers);
        return {
          total: response.attempt.total,
          correct: response.attempt.correct,
          wrong: response.attempt.wrong,
          unanswered: response.attempt.unanswered,
          scorePercent: response.attempt.scorePercent,
          results: response.results,
        } satisfies CurrentAffairsGrade;
      }
      const response = await gradeCurrentAffairsQuiz(code, language, submittedAnswers);
      return response.grade;
    },
    onSuccess: async (result) => {
      setGrade(result);
      if (user) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["current-affairs-learner-dashboard"] }),
          queryClient.invalidateQueries({ queryKey: ["current-affairs-revision"] }),
        ]);
      }
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

  if (quizQuery.isLoading) {
    return <div className="mx-auto max-w-4xl pb-12"><div className="skeleton-shimmer h-36 rounded-3xl" /><div className="mt-4 skeleton-shimmer h-[38rem] rounded-3xl" /></div>;
  }

  const quiz = quizQuery.data?.quiz;
  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <CircleAlert className="mx-auto h-8 w-8 text-slate-300" />
        <h1 className="mt-3 text-xl font-semibold text-slate-900">Quiz is unavailable</h1>
        <p className="mt-2 text-sm text-slate-500">This Current Affairs quiz may have been revoked or replaced by a corrected release.</p>
        <Button asChild className="mt-5 rounded-xl bg-[#6657e8] hover:bg-[#594bd9]"><Link href="/current-affairs">Back to Current Affairs</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-12" data-testid="current-affairs-quiz-runner">
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

      <header className="rounded-3xl border border-[#e3dff5] bg-[radial-gradient(circle_at_90%_5%,rgba(102,87,232,0.13),transparent_22rem),linear-gradient(135deg,#ffffff,#faf9ff)] p-6 shadow-[0_10px_34px_rgba(37,42,68,0.045)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-[#efeaff] text-[#6657e8] hover:bg-[#efeaff]">{quiz.periodType.toUpperCase()}</Badge>
              <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500">{quiz.examFamily.toUpperCase()}</Badge>
              <Badge variant="outline" className="rounded-full border-slate-200 text-slate-500">{quiz.itemCount} questions</Badge>
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">Current Affairs Quiz</h1>
            <p className="mt-2 text-sm text-slate-500">{formatDate(quiz.periodStart)}{quiz.periodStart !== quiz.periodEnd ? ` – ${formatDate(quiz.periodEnd)}` : ""}</p>
          </div>
          <div className={`rounded-2xl border px-4 py-3 text-xs ${user ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-700"}`}>
            <div className="flex items-center gap-2 font-semibold">{user ? <CheckCircle2 className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}{user ? "Progress tracking on" : "Practice mode"}</div>
            <p className="mt-1 max-w-64 leading-5 opacity-80">{user ? "Your result will feed D3–D60 revision automatically." : "Sign in before a future attempt to save progress and revision."}</p>
          </div>
        </div>
      </header>

      {grade ? (
        <section className="mt-5 rounded-3xl border border-[#ddd8f2] bg-white p-6 shadow-[0_8px_30px_rgba(37,42,68,0.04)] sm:p-8" aria-label="Quiz result">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#efeaff] text-[#6657e8]"><Trophy className="h-7 w-7" /></span>
              <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8]">Quiz complete</p><p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{Math.round(grade.scorePercent)}%</p></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-emerald-50 px-4 py-3"><p className="font-semibold text-emerald-700">{grade.correct}</p><p className="text-[9px] text-emerald-600">Correct</p></div>
              <div className="rounded-xl bg-rose-50 px-4 py-3"><p className="font-semibold text-rose-700">{grade.wrong}</p><p className="text-[9px] text-rose-600">Wrong</p></div>
              <div className="rounded-xl bg-slate-50 px-4 py-3"><p className="font-semibold text-slate-700">{grade.unanswered}</p><p className="text-[9px] text-slate-500">Skipped</p></div>
            </div>
          </div>
          {user ? <p className="mt-5 rounded-xl bg-[#faf9ff] px-4 py-3 text-xs leading-5 text-slate-500">Your answers are saved. Correct items enter the spaced-repetition ladder; wrong or skipped items return sooner for recovery.</p> : null}
        </section>
      ) : null}

      <div className="mt-5 space-y-4">
        {questions.map((question, questionIndex) => {
          const result = resultById.get(question.id);
          const selected = answers[question.id];
          const correct = result ? (result.isCorrect ?? result.result === "correct") : false;
          return (
            <article key={question.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(37,42,68,0.03)] sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-8 min-w-8 items-center justify-center rounded-xl bg-[#f1efff] text-xs font-bold text-[#6657e8]">{questionIndex + 1}</span>
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
                  return (
                    <button key={optionIndex} type="button" disabled={Boolean(grade) || submitMutation.isPending} onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))} className={`min-h-12 rounded-2xl border px-4 py-3 text-left text-sm leading-6 transition ${className}`}>
                      <span className="mr-2 font-semibold opacity-60">{String.fromCharCode(65 + optionIndex)}.</span>{option}
                    </button>
                  );
                })}
              </div>
              {result ? (
                <div className={`mt-4 rounded-2xl border p-4 ${correct ? "border-emerald-100 bg-emerald-50/70" : "border-rose-100 bg-rose-50/60"}`}>
                  <p className={`text-xs font-bold ${correct ? "text-emerald-700" : "text-rose-700"}`}>{correct ? "Correct" : result.selectedIndex == null ? "Unanswered" : "Review this"}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700"><strong>Answer:</strong> {result.correctAnswer ?? question.options[result.correctIndex] ?? "—"}</p>
                  {result.explanation ? <p className="mt-2 text-sm leading-6 text-slate-600">{result.explanation}</p> : null}
                  {result.nextReviewAt ? <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Next revision scheduled automatically</p> : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="sticky bottom-3 z-20 mt-5 rounded-2xl border border-[#e0dcf2] bg-white/95 p-3 shadow-[0_12px_38px_rgba(37,42,68,0.12)] backdrop-blur-md sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="px-2 py-1 text-xs text-slate-500"><span className="font-semibold text-slate-800">{answeredCount}/{questions.length}</span> answered{grade ? " · explanations unlocked" : ""}</div>
        {grade ? (
          <div className="mt-2 flex gap-2 sm:mt-0">
            {user ? <Button asChild variant="outline" className="rounded-xl border-[#dcd7ef] text-[#6657e8]"><Link href="/current-affairs/revision"><RotateCcw className="mr-2 h-4 w-4" />Revision queue</Link></Button> : null}
            <Button asChild className="rounded-xl bg-[#6657e8] hover:bg-[#594bd9]"><Link href="/current-affairs">More packs</Link></Button>
          </div>
        ) : (
          <Button disabled={questions.length === 0 || submitMutation.isPending} onClick={() => submitMutation.mutate()} className="mt-2 w-full rounded-xl bg-[#6657e8] px-6 hover:bg-[#594bd9] sm:mt-0 sm:w-auto">
            <ClipboardCheck className="mr-2 h-4 w-4" />{submitMutation.isPending ? "Submitting…" : "Submit quiz"}
          </Button>
        )}
      </div>

      {submitMutation.isError ? <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">The quiz could not be submitted. Your selections are still here; try again.</p> : null}
    </div>
  );
}
