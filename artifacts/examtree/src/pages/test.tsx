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
    if (!auth) {
      setLocation("/login/student");
      return;
    }
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

    const questionReview = allQuestions.map((question) => ({
      questionId: question.id,
      section: question.section,
      text: question.text,
      options: question.options,
      selected: answers[question.id] ?? null,
      correct: question.correct,
      flagged: Boolean(flags[question.id]),
      explanation: question.explanation,
    }));

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
      questionReview,
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

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((value) => value - 1);
      window.scrollTo(0, 0);
      return;
    }

    if (!hasLockedSections && currentSectionIndex > 0) {
      const previousSectionIndex = currentSectionIndex - 1;
      navigateToSection(previousSectionIndex, test.sections[previousSectionIndex].questions.length - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((value) => value + 1);
      window.scrollTo(0, 0);
      return;
    }

    if (currentSectionIndex < test.sections.length - 1) {
      navigateToSection(currentSectionIndex + 1, 0);
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

  const navigateToSection = (sectionIndex: number, questionIndex = 0) => {
    if (hasLockedSections && sectionIndex !== currentSectionIndex) return;
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(questionIndex);
    window.scrollTo(0, 0);
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-6">
            <section className="glass-panel rounded-2xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Sections</p>
                  <p className="mt-1 text-sm text-muted-foreground">Move through the paper with a cleaner section flow.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {test.sections.map((section, sectionIndex) => {
                    const isActive = sectionIndex === currentSectionIndex;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => navigateToSection(sectionIndex, 0)}
                        disabled={hasLockedSections && sectionIndex !== currentSectionIndex}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                        data-testid={`section-tab-${section.id}`}
                      >
                        {section.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Question Header */}
            <section className="glass-panel rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                    Q{currentQuestionNumber}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{currentSection.name}</h2>
                    <p className="text-sm text-muted-foreground">Question {currentQuestionNumber} of {totalQuestions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                    isLowTime ? "bg-red-50 text-red-700 border border-red-200" : "bg-primary/5 text-primary border border-primary/20"
                  }`}>
                    <Clock className="h-4 w-4" />
                    {formatTime(activeTimeLeft)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    <X className="h-4 w-4" />
                    Exit
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Answered: <span className="font-semibold text-green-600">{answered}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-muted-foreground">Marked: <span className="font-semibold text-yellow-600">{flagged}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-muted-foreground">Not Visited: <span className="font-semibold text-gray-600">{unanswered}</span></span>
                </div>
              </div>
            </section>


            {/* Question Content */}
            <section className="glass-panel rounded-2xl p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-medium text-foreground leading-relaxed mb-6">{q.text}</h3>

                <div className="grid gap-3">
                  {q.options.map((option, index) => {
                    const selected = answers[q.id] === index;
                    const isMarked = Boolean(flags[q.id]);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [q.id]: index }))}
                        className={`group relative w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                          selected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-gray-200 bg-white hover:border-primary/30 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold text-sm transition-colors ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300 bg-gray-50 text-gray-600 group-hover:border-primary/50"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-base leading-relaxed text-foreground flex-1">{option}</span>
                          {selected && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={clearResponse}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={toggleReview}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${
                      currentQuestionFlagged
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Flag className="h-4 w-4" />
                    {currentQuestionFlagged ? "Marked" : "Mark for Review"}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    disabled={isFirstQuestion}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 text-sm font-medium"
                  >
                    {primaryAdvanceLabel}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>


          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            {/* Question Palette */}
            <div className="glass-panel rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Question Palette</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{answered} Answered</span>
                  <span>•</span>
                  <span>{flagged} Marked</span>
                </div>
              </div>

              <div className="space-y-4">
                {test.sections.map((section, sectionIndex) => {
                  const sectionAnswered = section.questions.filter((question) => answers[question.id] !== null && answers[question.id] !== undefined).length;
                  const sectionFlagged = section.questions.filter((question) => Boolean(flags[question.id])).length;
                  const isCurrentSection = sectionIndex === currentSectionIndex;

                  return (
                    <div key={section.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${isCurrentSection ? 'text-primary' : 'text-foreground'}`}>
                          {section.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {sectionAnswered}/{section.questions.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {section.questions.map((question, questionIndex) => {
                          const isAnswered = answers[question.id] !== null && answers[question.id] !== undefined;
                          const isFlagged = Boolean(flags[question.id]);
                          const isCurrent = isCurrentSection && questionIndex === currentQuestionIndex;

                          return (
                            <button
                              key={question.id}
                              type="button"
                              onClick={() => navigateToSection(sectionIndex, questionIndex)}
                              disabled={hasLockedSections && sectionIndex !== currentSectionIndex}
                              className={`h-10 w-10 rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isCurrent
                                  ? "bg-primary text-white ring-2 ring-primary/30"
                                  : isFlagged
                                    ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                                    : isAnswered
                                      ? "bg-green-100 text-green-800 border-2 border-green-300"
                                      : "bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-primary/50"
                              }`}
                            >
                              {questionIndex + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Summary */}
            <div className="glass-panel rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Test Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Answered</span>
                  <span className="text-lg font-bold text-green-600">{answered}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-yellow-800">Marked for Review</span>
                  <span className="text-lg font-bold text-yellow-600">{flagged}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-800">Not Answered</span>
                  <span className="text-lg font-bold text-gray-600">{unanswered}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
              >
                Submit Test
              </button>
            </div>
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
