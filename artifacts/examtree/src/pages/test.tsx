import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  ListOrdered,
  Lock,
} from "lucide-react";
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
import { getTest, type Test } from "@/lib/data";
import { useMyEntitlements } from "@/hooks/use-my-entitlements";
import { TestPaywall } from "@/components/TestPaywall";
import { testHasInlineQuestions } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL, ApiError, getApiErrorCode } from "@/lib/api";
import { checkPurchase } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { QuestionRichText } from "@/components/QuestionRichText";

function priceFromPaywallBody(body: unknown, fallback: number): number {
  if (typeof body === "object" && body !== null && "priceCents" in body) {
    const v = (body as { priceCents?: unknown }).priceCents;
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return fallback;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((value) => String(value).padStart(2, "0")).join(":");
}

function TestRunner({ test, showSuccessMessage }: { test: Test; showSuccessMessage?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();

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

  /** First unanswered question in a section, or 0 if all have a selection. */
  const resumeQuestionIndexInSection = (sectionIndex: number) => {
    const section = test.sections[sectionIndex];
    if (!section) return 0;
    const idx = section.questions.findIndex(
      (qq) => answers[qq.id] === null || answers[qq.id] === undefined,
    );
    return idx === -1 ? 0 : idx;
  };

  if (!user || !q) return null;

  const progressPercent =
    totalQuestions > 0 ? Math.min(100, Math.round((currentQuestionNumber / totalQuestions) * 100)) : 0;

  return (
    <div className="relative isolate z-[200] min-h-screen bg-muted/50 pb-24 lg:pb-6">
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 z-[300] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Payment successful! Test unlocked.
          </div>
        </div>
      )}
      <header className="sticky top-0 z-[210] border-b border-border bg-card/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/85">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-3 py-2.5 sm:px-4">
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            data-testid="btn-exit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Leave</span>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">{test.name}</h1>
            <p className="truncate text-xs text-muted-foreground">
              {currentSection.name} · Q {currentQuestionNumber}/{totalQuestions}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs font-bold tabular-nums sm:text-sm ${
                isLowTime
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-muted/80 text-foreground"
              }`}
              data-testid="timer"
            >
              <Clock className="h-3.5 w-3.5 shrink-0 opacity-80" />
              {formatTime(activeTimeLeft)}
            </div>
            <Button
              size="sm"
              className="hidden h-9 rounded-lg sm:inline-flex"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="px-3 sm:px-4">
          <Progress value={progressPercent} className="h-1 rounded-none bg-muted" />
        </div>
        <div className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-3 py-2 sm:px-4">
            {test.sections.map((section, sectionIndex) => {
              const isActive = sectionIndex === currentSectionIndex;
              const sectionLocked = hasLockedSections && sectionIndex !== currentSectionIndex;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => navigateToSection(sectionIndex, resumeQuestionIndexInSection(sectionIndex))}
                  disabled={sectionLocked}
                  className={`flex min-h-10 min-w-0 shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-left text-xs font-semibold transition-all sm:text-sm ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground ring-1 ring-border hover:bg-muted/80 hover:text-foreground"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                  aria-label={
                    sectionLocked
                      ? `${section.name} (locked until current section is finished)`
                      : `Switch to ${section.name}`
                  }
                  data-testid={`section-tab-${section.id}`}
                >
                  {sectionLocked ? <Lock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden /> : null}
                  <span className="max-w-[10rem] truncate sm:max-w-[14rem]">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-6">
          <div className="min-w-0 space-y-4">
            <div className="lg:hidden">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sections</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {test.sections.map((section, sectionIndex) => {
                  const isActive = sectionIndex === currentSectionIndex;
                  const sectionLocked = hasLockedSections && sectionIndex !== currentSectionIndex;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => navigateToSection(sectionIndex, resumeQuestionIndexInSection(sectionIndex))}
                      disabled={sectionLocked}
                      className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors sm:min-w-[200px] sm:max-w-[calc(50%-0.25rem)] sm:flex-1 ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground hover:bg-muted/60"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                      aria-label={`Switch to ${section.name}`}
                    >
                      <span className="line-clamp-2">{section.name}</span>
                      {sectionLocked ? (
                        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">Question {currentQuestionNumber}</span>
                <span className="hidden sm:inline">·</span>
                <span className="line-clamp-1">{currentSection.name}</span>
                {hasSectionalTiming ? (
                  <>
                    <span>·</span>
                    <span className="tabular-nums">
                      Section time {formatTime(sectionTimeLeft)} / {formatTime(currentSectionLimitSeconds)}
                    </span>
                  </>
                ) : null}
              </div>
              <div className="text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                <QuestionRichText content={q.text} />
              </div>

              <div className="mt-6 space-y-2.5">
                {q.options.map((option, index) => {
                  const selected = answers[q.id] === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAnswers((current) => ({ ...current, [q.id]: index }))}
                      className={`flex w-full items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all sm:p-4 ${
                        selected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/35 hover:bg-muted/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="min-w-0 flex-1 pt-1">
                        <QuestionRichText content={option} inline />
                      </div>
                      {selected ? (
                        <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <Separator className="my-6" />

              <div className="hidden flex-wrap items-center justify-between gap-3 lg:flex">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={clearResponse}>
                    Clear response
                  </Button>
                  <Button
                    type="button"
                    variant={currentQuestionFlagged ? "secondary" : "outline"}
                    size="sm"
                    className="rounded-lg"
                    onClick={toggleReview}
                  >
                    <Flag className="mr-1.5 h-3.5 w-3.5" />
                    {currentQuestionFlagged ? "Marked" : "Mark for review"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={isFirstQuestion}
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>
                  <Button type="button" size="sm" className="rounded-lg" onClick={goToNext}>
                    {primaryAdvanceLabel}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground lg:hidden">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Done {answered}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Marked {flagged}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  Left {unanswered}
                </span>
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-[7.5rem] lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ListOrdered className="h-4 w-4 text-primary" />
                  Navigator
                </h3>
                <span className="text-xs text-muted-foreground">
                  {answered}/{totalQuestions}
                </span>
              </div>
              <p className="mb-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-wide text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-primary" /> Current
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500/80" /> Done
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-amber-400" /> Flag
                </span>
              </p>
              <div className="max-h-[min(52vh,420px)] space-y-3 overflow-y-auto pr-1">
                {test.sections.map((section, sectionIndex) => {
                  const isCurrentSection = sectionIndex === currentSectionIndex;
                  const sectionLocked = hasLockedSections && sectionIndex !== currentSectionIndex;
                  const answeredInSection = section.questions.filter(
                    (qq) => answers[qq.id] !== null && answers[qq.id] !== undefined,
                  ).length;
                  return (
                    <div
                      key={section.id}
                      className={`rounded-xl border p-1.5 ${
                        isCurrentSection ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={sectionLocked}
                        onClick={() => navigateToSection(sectionIndex, resumeQuestionIndexInSection(sectionIndex))}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        aria-label={`Open section ${section.name}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-semibold leading-tight ${isCurrentSection ? "text-primary" : "text-foreground"}`}
                          >
                            {section.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {answeredInSection}/{section.questions.length} answered
                          </p>
                        </div>
                        {sectionLocked ? (
                          <Lock className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                        )}
                      </button>
                      <div className="grid grid-cols-5 gap-1.5 px-1 pb-1 sm:grid-cols-6">
                        {section.questions.map((question, questionIndex) => {
                          const isAnswered = answers[question.id] !== null && answers[question.id] !== undefined;
                          const isFlagged = Boolean(flags[question.id]);
                          const isCurrent = isCurrentSection && questionIndex === currentQuestionIndex;
                          return (
                            <button
                              key={question.id}
                              type="button"
                              onClick={() => navigateToSection(sectionIndex, questionIndex)}
                              disabled={sectionLocked}
                              className={`flex h-9 items-center justify-center rounded-md text-xs font-bold tabular-nums transition-all disabled:opacity-40 ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/25"
                                  : isFlagged
                                    ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300 dark:bg-amber-950/50 dark:text-amber-100"
                                    : isAnswered
                                      ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100"
                                      : "bg-muted/80 text-muted-foreground ring-1 ring-border hover:bg-muted"
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

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">Paper status</h3>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-emerald-500/10 py-2">
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{answered}</p>
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Done</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 py-2">
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{flagged}</p>
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Flag</p>
                </div>
                <div className="rounded-lg bg-muted py-2">
                  <p className="text-lg font-bold text-foreground">{unanswered}</p>
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Left</p>
                </div>
              </div>
              <Button className="mt-4 w-full rounded-xl" onClick={() => setShowSubmitModal(true)}>
                Submit test
              </Button>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-[205] border-t border-border bg-card/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-card/90 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Button type="button" variant="outline" size="sm" className="flex-1 rounded-xl" disabled={isFirstQuestion} onClick={goToPrevious}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev
          </Button>
          <Button type="button" size="sm" className="flex-1 rounded-xl" onClick={goToNext}>
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button type="button" variant="secondary" size="sm" className="shrink-0 rounded-xl px-3" onClick={() => setShowSubmitModal(true)}>
            Submit
          </Button>
        </div>
      </div>

      {showSubmitModal ? (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]" data-testid="submit-modal">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Submit this attempt?</h3>
                <p className="text-sm text-muted-foreground">You will not be able to change answers after submitting.</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-3 text-center">
              <div>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{answered}</p>
                <p className="text-xs text-muted-foreground">Answered</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{unanswered}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{flagged}</p>
                <p className="text-xs text-muted-foreground">Marked</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setShowSubmitModal(false)} data-testid="btn-cancel-submit">
                Continue test
              </Button>
              <Button type="button" className="flex-1 rounded-xl" onClick={handleSubmit} data-testid="btn-confirm-submit">
                Submit now
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Test() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { tests: catalogTests, isLoading: catalogLoading, error: catalogError } = useExamCatalog();
  const { data: entitlements } = useMyEntitlements();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for successful checkout
  useEffect(() => {
    if (search.includes("checkout=success")) {
      setShowSuccessMessage(true);
      // Remove the query parameter from URL
      setLocation(`/test/${id}`, { replace: true });
      // Hide success message after 5 seconds
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    } else {
      // No cleanup needed when condition is false
      return undefined;
    }
  }, [search, id, setLocation]);
  const listCandidate = useMemo(
    () => catalogTests.find((item) => item.id === id),
    [catalogTests, id],
  );
  const hasInlineQuestions = testHasInlineQuestions(listCandidate);

  const {
    data: remoteTest,
    isLoading: remoteLoading,
    isError: remoteIsError,
    error: remoteError,
  } = useQuery({
    queryKey: ["exam", "test-detail", id, entitlements?.testIds?.slice().sort().join(",") ?? ""],
    queryFn: () => getTest(id!),
    enabled: Boolean(id) && !hasInlineQuestions,
  });

  // Check purchase status for paid tests
  const {
    data: purchaseStatus,
    isLoading: purchaseLoading,
    refetch: refetchPurchase,
  } = useQuery({
    queryKey: ["purchase", "status", id],
    queryFn: () => checkPurchase(id!),
    enabled: Boolean(id) && !hasInlineQuestions,
  });

  const resolvedTest = useMemo(() => {
    if (hasInlineQuestions && listCandidate) return listCandidate;
    if (remoteTest) return remoteTest as Test;
    return null;
  }, [hasInlineQuestions, listCandidate, remoteTest]);

  if (!id) return null;

  if (catalogError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <p className="font-medium text-destructive">Could not load test</p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Check that the API is running at{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">{API_BASE_URL}</code>
        </p>
      </div>
    );
  }

  const loading = catalogLoading || (!hasInlineQuestions && (remoteLoading || purchaseLoading));
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-12 w-56 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!hasInlineQuestions && remoteIsError && remoteError instanceof ApiError) {
    const code = getApiErrorCode(remoteError.body);
    const testName = listCandidate?.name ?? "This test";
    const price = priceFromPaywallBody(remoteError.body, listCandidate?.priceCents ?? 499);

    // Check if user has purchased the test
    if (purchaseStatus?.purchased) {
      // User has purchased but API still returns error - this shouldn't happen
      // but let's show a retry option
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
          <p className="text-lg font-semibold text-foreground">Access granted but test failed to load</p>
          <p className="text-center text-sm text-muted-foreground">
            You have purchased this test. Please try refreshing the page.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </div>
      );
    }

    if (remoteError.status === 401 && code === "LOGIN_REQUIRED") {
      return <TestPaywall testId={id!} testName={testName} priceCents={price} reason="login" />;
    }
    if (remoteError.status === 403 && code === "PAYMENT_REQUIRED") {
      return <TestPaywall testId={id!} testName={testName} priceCents={price} reason="payment" />;
    }
  }

  if (!resolvedTest) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-lg font-semibold text-foreground">Test not found</p>
        {remoteIsError ? (
          <p className="text-center text-sm text-muted-foreground">This test is missing or has no questions.</p>
        ) : null}
        <Button variant="outline" onClick={() => setLocation("/exams")}>
          Back to exams
        </Button>
      </div>
    );
  }

  return <TestRunner test={resolvedTest} showSuccessMessage={showSuccessMessage} />;
}
