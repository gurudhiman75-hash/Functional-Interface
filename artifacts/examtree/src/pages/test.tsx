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
  getAttempts,
  getUser,
  saveActiveTestSession,
  type TestAttempt,
} from "@/lib/storage";
import { createAttempt, getTest, type Test } from "@/lib/data";
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
  const [attemptType, setAttemptType] = useState<"REAL" | "PRACTICE">("REAL");
  const [lockedSections, setLockedSections] = useState<number[]>([]);
  const [originalAttemptId, setOriginalAttemptId] = useState<string | undefined>();
  const [sectionCompletionTimes, setSectionCompletionTimes] = useState<Record<string, number>>({});
  const [showSectionSwitchWarning, setShowSectionSwitchWarning] = useState(false);
  const [pendingSectionSwitch, setPendingSectionSwitch] = useState<number | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number | null>>({}); // User's answers in practice mode
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);

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
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    if (!q) return;
    setVisitedQuestionIds((current) =>
      current.includes(q.id) ? current : [...current, q.id],
    );
  }, [q]);

  type QuestionStatus = "NOT_VISITED" | "NOT_ANSWERED" | "ANSWERED" | "MARKED";

  const getQuestionStatus = (question: { id: number }): QuestionStatus => {
    const answer = answers[question.id];
    const isFlagged = Boolean(flags[question.id]);
    const isVisited = visitedQuestionIds.includes(question.id);

    if (isFlagged) return "MARKED";
    if (answer !== null && answer !== undefined) return "ANSWERED";
    if (isVisited) return "NOT_ANSWERED";
    return "NOT_VISITED";
  };

  const statusCounts = useMemo(() => {
    return allQuestions.reduce(
      (counts, question) => {
        const status = getQuestionStatus(question);
        counts[status] += 1;
        return counts;
      },
      {
        NOT_VISITED: 0,
        NOT_ANSWERED: 0,
        ANSWERED: 0,
        MARKED: 0,
      } as Record<QuestionStatus, number>,
    );
  }, [allQuestions, answers, flags, visitedQuestionIds]);

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
      setAttemptType(draft.attemptType ?? "REAL");
      setLockedSections(draft.lockedSections ?? []);
      setOriginalAttemptId(draft.originalAttemptId);
      setSectionCompletionTimes(draft.sectionCompletionTimes ?? {});
      setShowSubmitModal(false);
      setDraftLoaded(true);
      toast({
        title: "Saved test resumed",
        description: `Restored your ${draft.attemptType?.toLowerCase() ?? 'saved'} attempt for ${test.name}.`,
      });
      return;
    }

    // Check if this is a practice attempt (has originalAttemptId in URL params)
    const searchParams = new URLSearchParams(window.location.search);
    const practiceParam = searchParams.get('practice');
    const originalId = searchParams.get('originalAttemptId');

    if (practiceParam === 'true' && originalId) {
      // Load original attempt data for practice mode
      const attempts = getAttempts();
      const originalAttempt = attempts.find((a: TestAttempt) => a.testId === test.id && a.attemptType === 'REAL');
      
      if (originalAttempt) {
        setAttemptType("PRACTICE");
        setOriginalAttemptId(originalId);
        // Load original answers and flags for comparison
        // Note: In practice mode, we'll start fresh but show original answers
        setAnswers({});
        setFlags({});
        setTimeLeft(totalTime); // No timer in practice mode
        setSectionTimeLeftByName(defaultSectionTimes);
        setLockedSections([]);
        setSectionCompletionTimes(originalAttempt.sectionTimeSpent?.reduce((acc: Record<string, number>, s: any) => {
          acc[s.name] = s.minutesSpent;
          return acc;
        }, {} as Record<string, number>) ?? {});
      } else {
        // Fallback to real attempt if no original found
        setAttemptType("REAL");
      }
    } else {
      setAttemptType("REAL");
    }

    setCurrentSectionIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setTimeLeft(totalTime);
    setShowSubmitModal(false);
    setSectionTimeLeftByName(defaultSectionTimes);
    setLockedSections([]);
    setSectionCompletionTimes({});
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
      attemptType,
      lockedSections,
      originalAttemptId,
      sectionCompletionTimes,
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

  const handleSubmit = useCallback(async () => {
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

    const attempt = {
      userId: user?.id ?? "unknown",
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
      attemptType,
      isFirstAttempt: attemptType === "REAL",
      originalAttemptId: attemptType === "PRACTICE" ? originalAttemptId : undefined,
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
    };

    addAttempt(attempt);

    if (getFirebaseAuth()?.currentUser) {
      void createAttempt(attempt).catch(() => {
        console.warn("Failed to sync attempt to backend. Local result is still available.");
      });
    }

    clearActiveTestSession(test.id);
    
    // For practice attempts, show practice results; for real attempts, show standard results
    if (attemptType === "PRACTICE") {
      setLocation(`/result?practiceAttemptId=${test.id}`);
    } else {
      setLocation("/result");
    }
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
    // Don't run timer in practice mode
    if (attemptType === "PRACTICE") return;

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
  }, [attemptType, currentSectionIndex, getSectionLimitSeconds, handleSubmit, hasSectionalTiming, test.sections]);

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
    // Check if trying to navigate to a locked section
    if (lockedSections.includes(sectionIndex)) {
      toast({
        title: "Section Locked",
        description: "This section has been completed and is now locked.",
        variant: "destructive",
      });
      return;
    }

    // If moving to a new section forward, show warning and lock current section
    if (sectionIndex > currentSectionIndex) {
      setPendingSectionSwitch(sectionIndex);
      setShowSectionSwitchWarning(true);
      return;
    }

    // Allow navigation within current section or to unlocked previous sections
    if (sectionIndex <= currentSectionIndex || !lockedSections.includes(sectionIndex)) {
      setCurrentSectionIndex(sectionIndex);
      setCurrentQuestionIndex(questionIndex);
      window.scrollTo(0, 0);
    }
  };

  const confirmSectionSwitch = () => {
    if (pendingSectionSwitch !== null) {
      // Lock the current section
      setLockedSections(prev => [...prev, currentSectionIndex]);
      
      // Record completion time for current section (for real attempts)
      if (attemptType === "REAL") {
        const sectionName = currentSection.name;
        const timeSpent = hasSectionalTiming 
          ? currentSectionLimitSeconds - sectionTimeLeft
          : totalTime - timeLeft;
        setSectionCompletionTimes(prev => ({
          ...prev,
          [sectionName]: Math.round(timeSpent / 60) // minutes
        }));
      }

      // Navigate to new section
      setCurrentSectionIndex(pendingSectionSwitch);
      setCurrentQuestionIndex(0);
      window.scrollTo(0, 0);
      
      setShowSectionSwitchWarning(false);
      setPendingSectionSwitch(null);
    }
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
    <div className="relative isolate z-[200] min-h-screen bg-gray-100 text-gray-900">
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 z-[300] -translate-x-1/2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Payment successful! Test unlocked.
          </div>
        </div>
      )}

      {/* Blue top bar */}
      <header className="sticky top-0 z-[210] bg-blue-600 shadow-md">
        <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
          <h1 className="text-base font-bold text-white sm:text-lg">{test.name}</h1>
          <div className={`font-mono text-sm font-semibold tabular-nums text-white ${isLowTime ? "text-red-200" : ""}`}>
            Time Left: {formatTime(activeTimeLeft)}
          </div>
        </div>

        {/* Sections row */}
        <div className="border-t border-blue-500/60 bg-white px-4 py-1.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Sections</span>
            {test.sections.map((section, sectionIndex) => {
              const isActive = sectionIndex === currentSectionIndex;
              const sectionLocked = hasLockedSections && sectionIndex !== currentSectionIndex;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => navigateToSection(sectionIndex, resumeQuestionIndexInSection(sectionIndex))}
                  disabled={sectionLocked}
                  className={`flex min-h-8 min-w-0 shrink-0 items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                  aria-label={
                    sectionLocked
                      ? `${section.name} (locked until current section is finished)`
                      : `Switch to ${section.name}`
                  }
                  data-testid={`section-tab-${section.id}`}
                >
                  {sectionLocked ? <Lock className="h-3 w-3 shrink-0" aria-hidden /> : null}
                  <span className="max-w-[10rem] truncate">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="px-3 py-4 sm:px-5 lg:py-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-start">
          <section className="min-w-0">
            {/* Question card */}
            <div className="rounded border border-gray-300 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                <p className="text-sm font-bold text-gray-700">Question No {currentQuestionNumber}</p>
                {hasSectionalTiming && (
                  <span className="text-xs font-semibold text-gray-500">Section time: {formatTime(sectionTimeLeft)}</span>
                )}
              </div>
              <div className="space-y-5 px-5 py-5">

              <div className="text-sm leading-7 text-gray-800 sm:text-base">
                <QuestionRichText content={q.text} />
              </div>

              <div className="grid gap-2">
                {q.options.map((option, index) => {
                  const selected = answers[q.id] === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (attemptType === "PRACTICE") {
                          setPracticeAnswers((current) => ({ ...current, [q.id]: index }));
                          setShowPracticeAnswer(true);
                        } else {
                          setAnswers((current) => ({ ...current, [q.id]: index }));
                        }
                      }}
                      className={`flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm transition-all ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 bg-gray-100 text-gray-600"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <QuestionRichText content={option} inline />
                      </div>
                      {selected ? <CheckCircle className="h-4 w-4 shrink-0 text-blue-600" aria-hidden /> : null}
                    </button>
                  );
                })}
              </div>

              {attemptType === "PRACTICE" && showPracticeAnswer && (
                <div className="mt-6 rounded-2xl border border-border bg-blue-50 p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3">Practice Mode Analysis</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Your Answer</p>
                      <div className="flex items-center gap-2">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold ${
                          practiceAnswers[q.id] === q.correct
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}>
                          {practiceAnswers[q.id] !== null && practiceAnswers[q.id] !== undefined 
                            ? String.fromCharCode(65 + practiceAnswers[q.id]!)
                            : "?"}
                        </span>
                        <span className="text-sm text-blue-900">
                          {practiceAnswers[q.id] !== null && practiceAnswers[q.id] !== undefined 
                            ? q.options[practiceAnswers[q.id]!]
                            : "Not answered"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Correct Answer</p>
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500 text-sm font-bold text-white">
                          {String.fromCharCode(65 + q.correct)}
                        </span>
                        <span className="text-sm text-blue-900">{q.options[q.correct]}</span>
                      </div>
                    </div>
                  </div>

                  {originalAttemptId && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Your Real Exam Answer</p>
                          <div className="flex items-center gap-2">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold ${
                              answers[q.id] === q.correct
                                ? "bg-green-500 text-white"
                                : answers[q.id] !== null && answers[q.id] !== undefined
                                ? "bg-red-500 text-white"
                                : "bg-muted/50 text-muted-foreground"
                            }`}>
                              {answers[q.id] !== null && answers[q.id] !== undefined 
                                ? String.fromCharCode(65 + answers[q.id]!)
                                : "?"}
                            </span>
                            <span className="text-sm text-blue-900">
                              {answers[q.id] !== null && answers[q.id] !== undefined 
                                ? q.options[answers[q.id]!]
                                : "Not answered in real exam"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Time Comparison</p>
                          <div className="text-sm text-blue-900">
                            <p>Real exam: {sectionCompletionTimes[currentSection.name] || 0} min</p>
                            <p>Practice: No time limit</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-blue-800">{q.explanation}</p>
                  </div>
                </div>
              )}
              </div>{/* end .space-y-5 inner */}
            </div>{/* end question card white box */}

            {/* Bottom action bar - part of question card */}
            <div className="mt-0 flex flex-wrap items-center justify-between gap-2 rounded-b border-x border-b border-gray-300 bg-gray-50 px-5 py-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleReview}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                    currentQuestionFlagged
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {currentQuestionFlagged ? "Marked for review" : "Mark for Review & Next"}
                </button>
                <button
                  type="button"
                  onClick={clearResponse}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  Clear Response
                </button>
              </div>
              <button
                type="button"
                onClick={goToNext}
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Save & Next
              </button>
            </div>
          </section>



          <aside className="min-w-0 space-y-3">
            {/* Legend */}
            <div className="rounded border border-gray-300 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-2.5">
                <p className="text-sm font-bold text-gray-700">Legend</p>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">{statusCounts.ANSWERED}</span>
                  <span className="text-gray-700">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{statusCounts.NOT_ANSWERED}</span>
                  <span className="text-gray-700">Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">{statusCounts.MARKED}</span>
                  <span className="text-gray-700">Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[10px] font-bold text-gray-500">{statusCounts.NOT_VISITED}</span>
                  <span className="text-gray-700">Not Visited</span>
                </div>
              </div>
            </div>

            {/* Question Palette */}
            <div className="rounded border border-gray-300 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
                <p className="text-sm font-bold text-gray-700">Question Palette:</p>
                <span className="text-xs text-gray-500">{answered}/{totalQuestions}</span>
              </div>
              <div className="space-y-4 p-3">
                {test.sections.map((section, sectionIndex) => {
                  const isLocked = lockedSections.includes(sectionIndex);
                  const isActive = sectionIndex === currentSectionIndex;
                  const isCompleted = sectionIndex < currentSectionIndex;
                  const sectionStatus = isLocked ? "Locked" : isActive ? "Active" : isCompleted ? "Completed" : "Pending";
                  const statusColor = isLocked ? "text-red-600" : isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400";

                  return (
                    <div key={section.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{section.name}</p>
                        <span className={`text-[10px] font-semibold ${statusColor}`}>{sectionStatus}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {section.questions.map((question, questionIndex) => {
                          const status = getQuestionStatus(question);
                          const isCurrent = sectionIndex === currentSectionIndex && questionIndex === currentQuestionIndex;
                          const isMarked = status === "MARKED";
                          const paletteClass = isCurrent
                            ? "bg-blue-600 text-white"
                            : isMarked
                            ? "bg-violet-600 text-white"
                            : status === "ANSWERED"
                            ? "bg-green-500 text-white"
                            : status === "NOT_ANSWERED"
                            ? "bg-red-500 text-white"
                            : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100";

                          return (
                            <button
                              key={question.id}
                              type="button"
                              disabled={isLocked && !isActive}
                              onClick={() => navigateToSection(sectionIndex, questionIndex)}
                              className={`flex h-8 w-full items-center justify-center rounded-md text-xs font-semibold tabular-nums transition-all disabled:opacity-40 ${paletteClass}`}
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
              <div className="border-t border-gray-200 p-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Submit test
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-[205] border-t border-gray-300 bg-gray-50 p-2 shadow-sm lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <button type="button" className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700" disabled={isFirstQuestion} onClick={goToPrevious}>
            <ChevronLeft className="mr-1 inline h-4 w-4" />Prev
          </button>
          <button type="button" className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white" onClick={goToNext}>
            Next<ChevronRight className="ml-1 inline h-4 w-4" />
          </button>
          <button type="button" className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700" onClick={() => setShowSubmitModal(true)}>
            Submit
          </button>
        </div>
      </div>

      {showSectionSwitchWarning && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-gray-900">Switch to Next Section?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  You will not be able to return to this section once you proceed.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => { setShowSectionSwitchWarning(false); setPendingSectionSwitch(null); }}>
                Stay Here
              </button>
              <button type="button" className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700" onClick={confirmSectionSwitch}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-4" data-testid="submit-modal">
          <div className="w-full max-w-md rounded border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-gray-900">Submit this attempt?</h3>
                <p className="mt-1 text-sm text-gray-600">You will not be able to change answers after submitting.</p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2 rounded bg-gray-50 p-3 text-center">
              <div>
                <p className="text-xl font-bold text-green-600">{answered}</p>
                <p className="text-xs text-gray-500">Answered</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-700">{unanswered}</p>
                <p className="text-xs text-gray-500">Skipped</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-600">{flagged}</p>
                <p className="text-xs text-gray-500">Marked</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setShowSubmitModal(false)} data-testid="btn-cancel-submit">
                Continue test
              </button>
              <button type="button" className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700" onClick={handleSubmit} data-testid="btn-confirm-submit">
                Submit now
              </button>
            </div>
          </div>
        </div>
      )}
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

    if (remoteError.status === 404 && code === "NO_QUESTIONS") {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
          <p className="text-lg font-semibold text-foreground">This test is not ready yet</p>
          <p className="text-center text-sm text-muted-foreground">
            The purchase completed, but this test currently has no questions available. Please try again later or contact support.
          </p>
          <Button variant="outline" onClick={() => setLocation("/exams")}>Back to exams</Button>
        </div>
      );
    }

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
