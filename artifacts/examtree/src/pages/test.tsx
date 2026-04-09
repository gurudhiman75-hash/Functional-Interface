import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Clock, Flag, X } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/auth";
import {
  addAttempt,
  clearActiveTestSession,
  getActiveTestSession,
  getUser,
  saveActiveTestSession,
} from "@/lib/storage";
import { getRuntimeTests } from "@/lib/test-bank";
import { useToast } from "@/hooks/use-toast";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((value) => String(value).padStart(2, "0")).join(":");
}

function getPaletteStyle(answered: boolean, flagged: boolean, current: boolean) {
  if (current) return "bg-primary/20 text-primary border-2 border-primary";
  if (flagged) return "bg-yellow-100 text-yellow-800 border border-yellow-300";
  if (answered) return "bg-green-100 text-green-800 border border-green-300";
  return "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200";
}

export default function Test() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();
  const allTests = useMemo(() => getRuntimeTests(), []);
  const test = useMemo(() => allTests.find((item) => item.id === id) ?? allTests[0], [allTests, id]);

  if (!test) return null;

  const totalQuestions = test.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const totalTime = test.duration * 60;
  const sectionLimitByName = useMemo(
    () =>
      Object.fromEntries(
        (test.sectionTimings ?? []).map((item) => [item.name.trim().toLowerCase(), Math.max(0, item.minutes)]),
      ) as Record<string, number>,
    [test.sectionTimings],
  );
  const hasSectionalTiming = test.sectionTimingMode === "fixed" && test.sections.length > 0;
  const hasLockedSections = Boolean(test.sectionSettings?.some((section) => section.locked));

  const getSectionLimitSeconds = useCallback(
    (sectionIndex: number) => {
      const sectionName = test.sections[sectionIndex]?.name.trim().toLowerCase() ?? "";
      const configuredMinutes = sectionLimitByName[sectionName];
      const minutes = configuredMinutes && configuredMinutes > 0 ? configuredMinutes : 1;
      return Math.round(minutes * 60);
    },
    [sectionLimitByName, test.sections],
  );

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [sectionTimeLeftByName, setSectionTimeLeftByName] = useState<Record<string, number>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const currentSection = test.sections[currentSectionIndex];
  const questions = currentSection.questions;
  const q = questions[currentQuestionIndex];
  const allQuestions = test.sections.flatMap((section) => section.questions);

  const currentQuestionNumber =
    test.sections
      .slice(0, currentSectionIndex)
      .reduce((sum, section) => sum + section.questions.length, 0) +
    currentQuestionIndex +
    1;

  const sectionTimeLeft = hasSectionalTiming
    ? sectionTimeLeftByName[currentSection.name] ?? getSectionLimitSeconds(currentSectionIndex)
    : 0;
  const currentSectionLimitSeconds = hasSectionalTiming ? getSectionLimitSeconds(currentSectionIndex) : 0;
  const currentSectionMinutes = hasSectionalTiming ? Math.max(1, Math.round(currentSectionLimitSeconds / 60)) : 0;
  const currentSectionElapsedSeconds = hasSectionalTiming
    ? Math.max(0, currentSectionLimitSeconds - sectionTimeLeft)
    : 0;
  const activeTimeLeft = hasSectionalTiming ? sectionTimeLeft : timeLeft;
  const isLowTime = activeTimeLeft < 300;
  const answered = allQuestions.filter((question) => answers[question.id] !== null && answers[question.id] !== undefined).length;
  const flagged = allQuestions.filter((question) => Boolean(flags[question.id])).length;
  const unanswered = totalQuestions - answered;
  const currentQuestionFlagged = Boolean(flags[q?.id]);
  const isFirstQuestion = currentSectionIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion =
    currentSectionIndex === test.sections.length - 1 && currentQuestionIndex === questions.length - 1;
  const primaryAdvanceLabel = isLastQuestion ? "Review & Submit" : "Save & Next";

  useEffect(() => {
    if (user) return;
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLocation("/login/student");
        return;
      }
      await upsertUserProfile(firebaseUser);
    });
    return () => unsub();
  }, [user, setLocation]);

  useEffect(() => {
    const defaultSectionTimes = Object.fromEntries(
      test.sections.map((section, index) => [section.name, getSectionLimitSeconds(index)]),
    );
    const draft = getActiveTestSession(test.id);

    if (draft) {
      setCurrentSectionIndex(
        Math.min(Math.max(draft.currentSectionIndex, 0), Math.max(0, test.sections.length - 1)),
      );
      setCurrentQuestionIndex(Math.max(draft.currentQuestionIndex, 0));
      setAnswers(draft.answers);
      setFlags(draft.flags);
      setTimeLeft(Math.max(0, Math.min(draft.timeLeft, totalTime)));
      setSectionTimeLeftByName({ ...defaultSectionTimes, ...draft.sectionTimeLeftByName });
      setShowSubmitModal(false);
      setDraftLoaded(true);
      toast({
        title: "Saved test resumed",
        description: `Restored your in-progress attempt for ${test.name}.`,
      });
      return;
    }

    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setTimeLeft(totalTime);
    setShowSubmitModal(false);
    setSectionTimeLeftByName(defaultSectionTimes);
    setDraftLoaded(false);
  }, [getSectionLimitSeconds, id, test.id, test.name, test.sections, toast, totalTime]);

  useEffect(() => {
    const normalizedQuestionIndex = Math.min(
      currentQuestionIndex,
      Math.max(0, questions.length - 1),
    );

    if (normalizedQuestionIndex !== currentQuestionIndex) {
      setCurrentQuestionIndex(normalizedQuestionIndex);
    }
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    if (!user || !q) return;

    const hasProgress =
      Object.keys(answers).length > 0 ||
      Object.keys(flags).length > 0 ||
      timeLeft < totalTime ||
      draftLoaded;

    if (!hasProgress) return;

    saveActiveTestSession({
      testId: test.id,
      testName: test.name,
      category: test.category,
      currentSectionIndex,
      currentQuestionIndex,
      answers,
      flags,
      timeLeft,
      sectionTimeLeftByName,
      updatedAt: Date.now(),
    });
  }, [
    answers,
    currentQuestionIndex,
    currentSectionIndex,
    draftLoaded,
    flags,
    q,
    sectionTimeLeftByName,
    test.category,
    test.id,
    test.name,
    timeLeft,
    totalTime,
    user,
  ]);

  useEffect(() => {
    const hasProgress =
      Object.keys(answers).length > 0 ||
      Object.keys(flags).length > 0 ||
      timeLeft < totalTime ||
      draftLoaded;

    if (!hasProgress) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, draftLoaded, flags, timeLeft, totalTime]);

  const handleSubmit = useCallback(() => {
    const correct = allQuestions.filter((question) => answers[question.id] === question.correct).length;
    const wrong = allQuestions.filter((question) => {
      const answer = answers[question.id];
      return answer !== null && answer !== undefined && answer !== question.correct;
    }).length;
    const unansweredCount = totalQuestions - correct - wrong;
    const score = Math.round((correct / totalQuestions) * 100);

    const sectionStats = test.sections.map((section) => {
      const sectionCorrect = section.questions.filter((question) => answers[question.id] === question.correct).length;
      const sectionWrong = section.questions.filter((question) => {
        const answer = answers[question.id];
        return answer !== null && answer !== undefined && answer !== question.correct;
      }).length;
      const sectionUnanswered = section.questions.length - sectionCorrect - sectionWrong;
      const answeredForAccuracy = sectionCorrect + sectionWrong;

      return {
        name: section.name,
        correct: sectionCorrect,
        wrong: sectionWrong,
        unanswered: sectionUnanswered,
        totalQuestions: section.questions.length,
        accuracy: answeredForAccuracy > 0 ? Math.round((sectionCorrect / answeredForAccuracy) * 100) : 0,
      };
    });

    const timeSpent = hasSectionalTiming
      ? Math.round(
          test.sections.reduce((sum, section, index) => {
            const limit = getSectionLimitSeconds(index);
            const remaining = sectionTimeLeftByName[section.name] ?? limit;
            return sum + Math.max(0, limit - remaining);
          }, 0) / 60,
        )
      : Math.round((totalTime - timeLeft) / 60);

    addAttempt({
      testId: test.id,
      testName: test.name,
      category: test.category,
      score,
      correct,
      wrong,
      unanswered: unansweredCount,
      totalQuestions,
      timeSpent,
      date: new Date().toLocaleDateString("en-CA"),
      sectionStats,
      sectionTimeSpent: hasSectionalTiming
        ? test.sections.map((section, index) => {
            const limit = getSectionLimitSeconds(index);
            const remaining = sectionTimeLeftByName[section.name] ?? limit;
            return {
              name: section.name,
              minutesSpent: Math.round(Math.max(0, limit - remaining) / 60),
            };
          })
        : undefined,
    });

    clearActiveTestSession(test.id);
    setLocation("/result");
  }, [
    allQuestions,
    answers,
    getSectionLimitSeconds,
    hasSectionalTiming,
    sectionTimeLeftByName,
    setLocation,
    test,
    timeLeft,
    totalQuestions,
    totalTime,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasSectionalTiming) {
        setSectionTimeLeftByName((current) => {
          const activeSectionName = test.sections[currentSectionIndex]?.name ?? "";
          const currentValue = current[activeSectionName] ?? getSectionLimitSeconds(currentSectionIndex);
          return {
            ...current,
            [activeSectionName]: currentValue <= 1 ? 0 : currentValue - 1,
          };
        });
        return;
      }

      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSectionIndex, getSectionLimitSeconds, handleSubmit, hasSectionalTiming, test.sections]);

  useEffect(() => {
    if (!hasSectionalTiming) return;
    if (sectionTimeLeft > 0) return;

    if (currentSectionIndex < test.sections.length - 1) {
      setCurrentSectionIndex((value) => value + 1);
      setCurrentQuestionIndex(0);
      window.scrollTo(0, 0);
      return;
    }

    handleSubmit();
  }, [currentSectionIndex, handleSubmit, hasSectionalTiming, sectionTimeLeft, test.sections.length]);

  const goToSection = (sectionIndex: number, questionIndex = 0) => {
    if (hasLockedSections && sectionIndex !== currentSectionIndex) return;
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(questionIndex);
    window.scrollTo(0, 0);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((value) => value - 1);
      window.scrollTo(0, 0);
      return;
    }

    if (!hasLockedSections && currentSectionIndex > 0) {
      const previousSectionIndex = currentSectionIndex - 1;
      goToSection(previousSectionIndex, test.sections[previousSectionIndex].questions.length - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((value) => value + 1);
      window.scrollTo(0, 0);
      return;
    }

    if (currentSectionIndex < test.sections.length - 1) {
      goToSection(currentSectionIndex + 1, 0);
      return;
    }

    setShowSubmitModal(true);
  };

  const clearResponse = () => {
    setAnswers((current) => ({ ...current, [q.id]: null }));
  };

  const toggleReview = () => {
    setFlags((current) => ({ ...current, [q.id]: !current[q.id] }));
  };

  if (!user || !q) return null;

  return (
    <div className="relative isolate z-[200] min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.14),transparent_25%),hsl(var(--background))]">
      <header className="exam-header sticky top-0 z-[210] border-b px-4">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4">
          <h1 className="truncate text-sm font-semibold text-foreground">{test.name}</h1>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-bold ${
                isLowTime
                  ? "border-red-500/20 bg-red-500/10 text-red-200"
                  : "border-white/10 bg-white/5 text-foreground"
              }`}
              data-testid="timer"
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTime(activeTimeLeft)}
            </div>
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-foreground hover:bg-white/10"
              data-testid="btn-exit"
            >
              <X className="mr-1 h-3.5 w-3.5" /> Exit
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-[205] mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="mb-4 glass-panel rounded-[1.75rem] p-6 shadow-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Question <span className="font-bold text-foreground">{currentQuestionNumber}</span> of {totalQuestions}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-foreground">
                  {currentSection.name}
                </span>
                {hasSectionalTiming && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {currentSectionMinutes} min section
                  </span>
                )}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Answered", value: answered, tone: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200" },
                  { label: "Unanswered", value: unanswered, tone: "border border-white/10 bg-white/5 text-muted-foreground" },
                  { label: "Flagged", value: flagged, tone: "border border-amber-500/20 bg-amber-500/10 text-amber-200" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl p-3 ${item.tone}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 glass-panel rounded-[1.5rem] p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {hasSectionalTiming ? "Section Timer" : "Section Progress"}
              </p>
              <p className="mt-2 text-xl font-bold text-foreground">
                {hasSectionalTiming ? formatTime(sectionTimeLeft) : `${currentQuestionIndex + 1} / ${questions.length}`}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasSectionalTiming
                  ? `${Math.round(currentSectionElapsedSeconds / 60)} of ${currentSectionMinutes} minutes used`
                  : "questions in this section"}
              </p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${
                      hasSectionalTiming
                        ? Math.max(8, (currentSectionElapsedSeconds / Math.max(1, currentSectionLimitSeconds)) * 100)
                        : Math.max(8, ((currentQuestionIndex + 1) / questions.length) * 100)
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="mb-4 glass-panel rounded-[1.7rem] p-6 shadow-lg">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-primary">{currentSection.name} Section</p>
                <p className="text-xs text-muted-foreground">
                  {currentQuestionIndex + 1} / {questions.length} in this section
                </p>
              </div>
              <p className="text-xl font-medium leading-relaxed text-foreground">{q.text}</p>
            </div>

            <div className="mb-6 space-y-3">
              {q.options.map((option, index) => {
                const selected = answers[q.id] === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setAnswers((current) => ({ ...current, [q.id]: index }))}
                    className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 bg-white text-foreground hover:border-primary/50 hover:bg-gray-50"
                    }`}
                    data-testid={`option-${index}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        selected ? "border-primary bg-primary text-white" : "border-gray-300 bg-gray-100 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                    {selected && <CheckCircle className="ml-auto h-4 w-4 shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>

            <div className="mb-6 glass-panel rounded-[1.5rem] p-4 shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-semibold text-foreground">Question Actions</p>
                <p className="text-xs text-muted-foreground">Clear your answer or mark the question to revisit later.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={clearResponse}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/10"
                  data-testid="btn-clear-response"
                >
                  Clear Response
                </button>
                <button
                  type="button"
                  onClick={toggleReview}
                  className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold ${
                    currentQuestionFlagged
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
                      : "border-white/10 bg-white/5 text-foreground hover:bg-white/10"
                  }`}
                  data-testid="btn-mark-review"
                >
                  <Flag className="mr-1.5 h-4 w-4" />
                  {currentQuestionFlagged ? "Marked for Review" : "Mark for Review"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={goToPrevious}
                disabled={isFirstQuestion}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-foreground hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                data-testid="btn-prev"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-95"
                data-testid="btn-next"
              >
                {primaryAdvanceLabel}
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="glass-panel rounded-[1.35rem] p-4 shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Navigator</p>
              <h3 className="mt-2 text-xl font-bold text-foreground">Question Palette</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasLockedSections ? "Use the palette within the active section." : "Jump to any section or question."}
              </p>
            </div>

            <div className="space-y-3">
              {test.sections.map((section, sectionIndex) => {
                const sectionAnswered = section.questions.filter((question) => answers[question.id] !== null && answers[question.id] !== undefined).length;
                const sectionFlagged = section.questions.filter((question) => Boolean(flags[question.id])).length;
                const isCurrentSection = sectionIndex === currentSectionIndex;

                return (
                  <div
                    key={section.id}
                    className={`rounded-lg border p-3 ${
                      isCurrentSection ? "border-primary/50 bg-primary/5" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => goToSection(sectionIndex, 0)}
                      className="w-full text-left disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={hasLockedSections && sectionIndex !== currentSectionIndex}
                      data-testid={`section-tab-${section.id}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{section.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {section.questions.length} questions
                            {hasSectionalTiming ? ` • ${Math.round(getSectionLimitSeconds(sectionIndex) / 60)} min` : ""}
                            {hasLockedSections && sectionIndex !== currentSectionIndex ? " • locked" : ""}
                          </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] ${isCurrentSection ? "bg-primary text-white" : hasLockedSections && sectionIndex !== currentSectionIndex ? "bg-gray-200 text-gray-500" : "bg-gray-100 text-gray-600"}`}>
                          {sectionAnswered}/{section.questions.length}
                        </span>
                      </div>
                    </button>

                    <div className="mt-3 grid grid-cols-5 gap-1.5">
                      {section.questions.map((question, questionIndex) => (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => goToSection(sectionIndex, questionIndex)}
                          disabled={hasLockedSections && sectionIndex !== currentSectionIndex}
                          className={`h-9 rounded-lg text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${getPaletteStyle(
                            answers[question.id] !== null && answers[question.id] !== undefined,
                            Boolean(flags[question.id]),
                            isCurrentSection && questionIndex === currentQuestionIndex,
                          )}`}
                          data-testid={`palette-q-${question.id}`}
                        >
                          {questionIndex + 1}
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{sectionAnswered} answered</span>
                      <span>{sectionFlagged} flagged</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glass-panel rounded-[1.35rem] p-4 shadow-lg">
              {[
                { label: "Answered", count: answered, color: "bg-green-500" },
                { label: "Marked", count: flagged, color: "bg-yellow-500" },
                { label: "Unanswered", count: unanswered, color: "bg-gray-300" },
                { label: "Marked", count: flagged, color: "bg-yellow-500" },
                { label: "Unanswered", count: unanswered, color: "bg-gray-300" },
                { label: "Marked", count: flagged, color: "bg-amber-500" },
                { label: "Unanswered", count: unanswered, color: "bg-slate-300" },
                ...(hasLockedSections
                  ? [{ label: "Locked", count: Math.max(0, test.sections.length - 1), color: "bg-slate-500" }]
                  : []),
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-secondary bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:brightness-95"
              data-testid="btn-submit-sidebar"
            >
              Submit Test
            </button>
          </aside>
        </div>
      </main>

      {showSubmitModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/50 p-4" data-testid="submit-modal">
          <div className="w-full max-w-sm rounded-2xl glass-panel p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Submit Test?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 text-center text-xs">
              <div>
                <p className="text-base font-bold text-green-600">{answered}</p>
                <p className="text-gray-500">Answered</p>
              </div>
              <div>
                <p className="text-base font-bold text-red-600">{unanswered}</p>
                <p className="text-gray-500">Unanswered</p>
              </div>
              <div>
                <p className="text-base font-bold text-yellow-600">{flagged}</p>
                <p className="text-gray-500">Marked</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                data-testid="btn-cancel-submit"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                data-testid="btn-confirm-submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
