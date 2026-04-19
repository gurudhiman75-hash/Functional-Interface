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
  RotateCcw,
  Target,
  XCircle,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUserProfile } from "@/lib/auth";
import {
  addAttempt,
  clearActiveTestSession,
  countPriorAttempts,
  getActiveTestSession,
  getAttemptRecords,
  getAttemptResponses,
  getAttempts,
  getUser,
  saveActiveTestSession,
  saveAttemptRecord,
  saveQuestionResponse,
  type TestAttempt,
} from "@/lib/storage";
import { submitAttempt, getPackagesByTest, getTest, type Test } from "@/lib/data";
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
import { AppLayout } from "@/components/AppLayout";
import { getLocalizedQuestion, LANGUAGE_LABELS, type Language } from "@/lib/lang-utils";

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

function TestRunner({ test, showSuccessMessage, initialMode, subcategoryLanguages, wrongOnly, sectionParam }: { test: Test; showSuccessMessage?: boolean; initialMode?: "REAL" | "PRACTICE"; subcategoryLanguages?: string[]; wrongOnly?: boolean; sectionParam?: string | null }) {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const user = getUser();
  const { toast } = useToast();

  // Section-based practice filtering: filter + shuffle + sample up to 15
  const effectiveSections = useMemo(() => {
    if (!sectionParam) return test.sections;
    const matched = test.sections.filter(
      (sec) => sec.name.toLowerCase() === sectionParam.toLowerCase()
    );
    if (matched.length === 0) return test.sections;
    return matched.map((sec) => {
      const shuffled = [...sec.questions].sort(() => Math.random() - 0.5);
      return { ...sec, questions: shuffled.slice(0, 15) };
    });
  }, [test.sections, sectionParam]);

  const totalQuestions = effectiveSections.reduce((sum, section) => sum + section.questions.length, 0);
  const totalTime = test.duration * 60;
  const sectionLimitByName = useMemo(
    () =>
      Object.fromEntries(
        (test.sectionTimings ?? []).map((item) => [item.name.trim().toLowerCase(), Math.max(0, item.minutes)]),
      ) as Record<string, number>,
    [test.sectionTimings],
  );
  const hasSectionalTiming = test.sectionTimingMode === "fixed" && effectiveSections.length > 0 && !sectionParam;
  const hasLockedSections = Boolean(test.sectionSettings?.some((section) => section.locked)) && initialMode !== "PRACTICE" && !sectionParam;

  const getSectionLimitSeconds = useCallback(
    (sectionIndex: number) => {
      const sectionName = effectiveSections[sectionIndex]?.name.trim().toLowerCase() ?? "";
      const configuredMinutes = sectionLimitByName[sectionName];
      const minutes = configuredMinutes && configuredMinutes > 0 ? configuredMinutes : 1;
      return Math.round(minutes * 60);
    },
    [sectionLimitByName, effectiveSections],
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number | null>>({}); // User's answers in practice mode
  const [revealedPracticeQuestions, setRevealedPracticeQuestions] = useState<Set<number>>(new Set());
  const [realExamAnswers, setRealExamAnswers] = useState<Record<number, number | null>>({});
  const [realExamTimes, setRealExamTimes] = useState<Record<number, number>>({}); // questionId → seconds from real attempt
  const [practiceTimeTaken, setPracticeTimeTaken] = useState<Record<number, number>>({}); // questionId → seconds in this practice session
  const [questionOpenedAt, setQuestionOpenedAt] = useState<number>(() => Date.now());
  const [attemptRecordId] = useState<string>(() => `${test.id}_${getUser()?.id ?? "anon"}_${Date.now()}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Language availability ──────────────────────────────────────────────────
  // Priority 1: explicit config (subcategory or test) with > 1 lang
  // Priority 2: auto-detect from question translation fields (fallback)
  const availableLangs: Language[] = useMemo(() => {
    const explicitCfg =
      subcategoryLanguages && subcategoryLanguages.length > 1
        ? (subcategoryLanguages as Language[])
        : test.languages && test.languages.length > 1
          ? (test.languages as Language[])
          : null;
    if (explicitCfg) return explicitCfg;

    // Fallback: scan questions for populated translation fields
    const allQ = effectiveSections.flatMap((s) => s.questions);
    const langs: Language[] = [];
    if (allQ.some((q) => Boolean(q.text))) langs.push("en");
    if (allQ.some((q) => Boolean(q.textHi))) langs.push("hi");
    if (allQ.some((q) => Boolean(q.textPa))) langs.push("pa");
    if (langs.length === 0) langs.push("en"); // safety fallback
    return langs;
  }, [subcategoryLanguages, test.languages, effectiveSections]);

  const [lang, setLang] = useState<Language>(() => availableLangs[0] ?? "en");

  // Reset language if the selected language is no longer available
  useEffect(() => {
    if (!availableLangs.includes(lang)) setLang(availableLangs[0] ?? "en");
  }, [availableLangs, lang]);

  const currentSection = effectiveSections[currentSectionIndex];
  const questions = currentSection?.questions ?? [];
  const q = questions[currentQuestionIndex];
  const allQuestions = effectiveSections.flatMap((section) => section.questions);

  const currentQuestionNumber =
    effectiveSections
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
  const isLowTime = activeTimeLeft < 120;
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
    // Only reset the timer for unanswered practice questions so new time is tracked accurately
    if (attemptType !== "PRACTICE" || practiceAnswers[q.id] === undefined) {
      setQuestionOpenedAt(Date.now());
    }
  }, [q?.id]);

  // Load the user's first REAL attempt answers + times for comparison in practice mode
  useEffect(() => {
    if (attemptType !== "PRACTICE") return;
    const currentUserId = getUser()?.id;

    // Answers from TestAttempt.questionReview
    const firstReal = getAttempts().find(
      (a) => a.testId === test.id && a.attemptType === "REAL" && Array.isArray(a.questionReview),
    );
    if (firstReal?.questionReview) {
      const map: Record<number, number | null> = {};
      for (const qr of firstReal.questionReview) {
        map[qr.questionId] = qr.selected;
      }
      setRealExamAnswers(map);
    }

    // Per-question times from QuestionResponse records
    const realRecord = getAttemptRecords().find(
      (r) =>
        r.testId === test.id &&
        r.mode === "REAL" &&
        (!currentUserId || r.userId === currentUserId),
    );
    if (realRecord) {
      const responses = getAttemptResponses(realRecord.id) ?? [];
      const times: Record<number, number> = {};
      for (const resp of responses) {
        times[resp.questionId] = resp.timeTaken;
      }
      setRealExamTimes(times);
    }
  }, [attemptType, test.id]);

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
    currentSectionIndex === effectiveSections.length - 1 && currentQuestionIndex === questions.length - 1;
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
      effectiveSections.map((section, index) => [section.name, getSectionLimitSeconds(index)]),
    );
    const draft = getActiveTestSession(test.id);

    if (draft) {
      setCurrentSectionIndex(
        Math.min(Math.max(draft.currentSectionIndex, 0), Math.max(0, effectiveSections.length - 1)),
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
      if (Array.isArray(draft.visitedQuestionIds)) {
        setVisitedQuestionIds(draft.visitedQuestionIds);
      }
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
      const finalMode = initialMode ?? "REAL";
      setAttemptType(finalMode);
      if (finalMode === "REAL") {
        const uid = getUser()?.id ?? "unknown";
        saveAttemptRecord({
          id: attemptRecordId,
          userId: uid,
          testId: test.id,
          mode: "REAL",
          attemptNumber: countPriorAttempts(uid, test.id, "REAL") + 1,
          startTime: Date.now(),
          endTime: null,
        });
      }
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
  }, [getSectionLimitSeconds, id, test.id, test.name, effectiveSections, toast, totalTime]);

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
      visitedQuestionIds,
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

  // Intercept browser back button — show pause modal instead of silently navigating away
  useEffect(() => {
    const hasProgress =
      Object.keys(answers).length > 0 ||
      Object.keys(flags).length > 0 ||
      timeLeft < totalTime ||
      draftLoaded;

    if (!hasProgress) return;

    // Push a dummy history entry so we can catch the back navigation
    window.history.pushState({ testGuard: true }, "");

    const handlePopState = () => {
      // Re-push so the guard stays active if user dismisses the modal
      window.history.pushState({ testGuard: true }, "");
      setShowPauseModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftLoaded]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
    const timeSpent = hasSectionalTiming
      ? Math.round(
          effectiveSections.reduce((sum, section, index) => {
            const limit = getSectionLimitSeconds(index);
            const remaining = sectionTimeLeftByName[section.name] ?? limit;
            return sum + Math.max(0, limit - remaining);
          }, 0) / 60,
        )
      : Math.round((totalTime - timeLeft) / 60);

    const responsePayload = allQuestions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] ?? null,
      timeTaken: realExamTimes[q.id] ?? 0,
    }));

    const sectionTimeSpentPayload = hasSectionalTiming
      ? effectiveSections.map((section, index) => {
          const limit = getSectionLimitSeconds(index);
          const remaining = sectionTimeLeftByName[section.name] ?? limit;
          return {
            name: section.name,
            minutesSpent: Math.round(Math.max(0, limit - remaining) / 60),
          };
        })
      : undefined;

    // Finalise the attempt record with endTime (local tracking)
    const attemptRecord = getAttemptRecords().find(
      (r) => r.testId === test.id && r.mode === attemptType,
    );
    if (attemptType === "REAL" && attemptRecord) {
      saveAttemptRecord({ ...attemptRecord, endTime: Date.now() });
    }

    clearActiveTestSession(test.id);
    document.exitFullscreen?.().catch(() => {});

    // Submit to backend — server calculates and stores the authoritative score
    if (getFirebaseAuth()?.currentUser) {
      try {
        const saved = await submitAttempt({
          testId: test.id,
          testName: test.name,
          category: test.category,
          attemptType,
          timeSpent,
          responses: responsePayload,
          flags,
          sectionTimeSpent: sectionTimeSpentPayload,
          originalAttemptId: attemptType === "PRACTICE" ? originalAttemptId : undefined,
        });

        // Also persist locally using the server-computed result as source of truth
        addAttempt(saved as unknown as Parameters<typeof addAttempt>[0]);

        const serverAttemptId = saved.id!;
        if (attemptType === "PRACTICE") {
          const woParam = wrongOnly ? "&wrongOnly=true" : "";
          const secParam = sectionParam ? `&section=${encodeURIComponent(sectionParam)}` : "";
          setLocation(`/result?testId=${encodeURIComponent(test.id)}&practiceAttemptId=${test.id}&attemptId=${encodeURIComponent(serverAttemptId)}${woParam}${secParam}`);
        } else {
          setLocation(`/result?testId=${encodeURIComponent(test.id)}&attemptId=${encodeURIComponent(serverAttemptId)}`);
        }
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.warn("Failed to submit attempt to backend. Falling back to local result.", msg);
      }
    }

    // Fallback: navigate using local storage only (offline / unauthenticated)
    if (attemptType === "PRACTICE") {
      const woParam = wrongOnly ? "&wrongOnly=true" : "";
      const secParam = sectionParam ? `&section=${encodeURIComponent(sectionParam)}` : "";
      setLocation(`/result?testId=${encodeURIComponent(test.id)}&practiceAttemptId=${test.id}${woParam}${secParam}`);
    } else {
      setLocation(`/result?testId=${encodeURIComponent(test.id)}`);
    }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    allQuestions,
    answers,
    flags,
    attemptType,
    originalAttemptId,
    sectionParam,
    wrongOnly,
    effectiveSections,
    getSectionLimitSeconds,
    hasSectionalTiming,
    sectionTimeLeftByName,
    setLocation,
    test,
    timeLeft,
    totalTime,
    realExamTimes,
  ]);

  useEffect(() => {
    // Don't run timer in practice mode
    if (attemptType === "PRACTICE") return;

    const interval = setInterval(() => {
      if (hasSectionalTiming) {
        setSectionTimeLeftByName((current) => {
          const activeSectionName = effectiveSections[currentSectionIndex]?.name ?? "";
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
  }, [attemptType, currentSectionIndex, getSectionLimitSeconds, handleSubmit, hasSectionalTiming, effectiveSections]);

  useEffect(() => {
    if (!hasSectionalTiming) return;
    if (sectionTimeLeft > 0) return;

    if (currentSectionIndex < effectiveSections.length - 1) {
      setCurrentSectionIndex((value) => value + 1);
      setCurrentQuestionIndex(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    handleSubmit();
  }, [currentSectionIndex, handleSubmit, hasSectionalTiming, sectionTimeLeft, effectiveSections.length]);

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((value) => value - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!hasLockedSections && currentSectionIndex > 0) {
      const previousSectionIndex = currentSectionIndex - 1;
      const prevSectionLastIdx = Math.max(0, (effectiveSections[previousSectionIndex]?.questions.length ?? 1) - 1);
      navigateToSection(previousSectionIndex, prevSectionLastIdx);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((value) => value + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentSectionIndex < effectiveSections.length - 1) {
      // In locked-section exams, user must use the sidebar "Jump to Next Section" button
      if (hasLockedSections) return;
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

  const goToNextWrongQuestion = useCallback(() => {
    if (attemptType !== "PRACTICE" || Object.keys(realExamAnswers).length === 0) return;
    const currentGlobal =
      effectiveSections.slice(0, currentSectionIndex).reduce((sum, sec) => sum + sec.questions.length, 0) +
      currentQuestionIndex;
    for (let secIdx = 0; secIdx < effectiveSections.length; secIdx++) {
      const sec = effectiveSections[secIdx];
      const secOffset = effectiveSections.slice(0, secIdx).reduce((s, sec2) => s + sec2.questions.length, 0);
      for (let qIdx = 0; qIdx < sec.questions.length; qIdx++) {
        if (secOffset + qIdx <= currentGlobal) continue;
        const question = sec.questions[qIdx];
        const examAns = realExamAnswers[question.id];
        const isWrongOrSkipped = examAns === null || examAns === undefined || examAns !== question.correct;
        if (isWrongOrSkipped) {
          setCurrentSectionIndex(secIdx);
          setCurrentQuestionIndex(qIdx);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }
    }
    toast({ title: "All questions reviewed", description: "No more wrong or skipped questions ahead." });
  }, [attemptType, realExamAnswers, effectiveSections, currentSectionIndex, currentQuestionIndex, toast]);

  const navigateToSection = (sectionIndex: number, questionIndex = 0) => {
    // Practice mode: always allow free navigation
    if (attemptType === "PRACTICE") {
      setCurrentSectionIndex(sectionIndex);
      setCurrentQuestionIndex(questionIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Block locked (completed) sections
    if (lockedSections.includes(sectionIndex)) {
      toast({
        title: "Section Locked",
        description: "This section has been completed and cannot be revisited.",
        variant: "destructive",
      });
      return;
    }

    // For locked-section exams, block any backward navigation
    if (hasLockedSections && sectionIndex < currentSectionIndex) {
      return;
    }

    // Moving forward in a locked-section exam — show warning first
    if (hasLockedSections && sectionIndex > currentSectionIndex) {
      setPendingSectionSwitch(sectionIndex);
      setShowSectionSwitchWarning(true);
      return;
    }

    // Any other navigation (non-locked exam, same section)
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(questionIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmSectionSwitch = () => {
    if (pendingSectionSwitch !== null) {
      // Lock all sections from current up to (not including) the target
      const newLocked: number[] = [];
      for (let i = currentSectionIndex; i < pendingSectionSwitch; i++) {
        if (!lockedSections.includes(i)) newLocked.push(i);
      }
      setLockedSections(prev => [...prev, ...newLocked]);

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
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      setShowSectionSwitchWarning(false);
      setPendingSectionSwitch(null);
    }
  };

  /** First unanswered question in a section, or 0 if all have a selection. */
  const resumeQuestionIndexInSection = (sectionIndex: number) => {
    const section = effectiveSections[sectionIndex];
    if (!section) return 0;
    const idx = section.questions.findIndex(
      (qq) => answers[qq.id] === null || answers[qq.id] === undefined,
    );
    return idx === -1 ? 0 : idx;
  };

  if (!user) return null;
  if (!q) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 px-4">
        <p className="text-lg font-semibold text-gray-700">No questions available</p>
        <p className="text-sm text-gray-500">This test has no questions to display.</p>
      </div>
    );
 }

  const progressPercent =
    totalQuestions > 0 ? Math.min(100, Math.round((currentQuestionNumber / totalQuestions) * 100)) : 0;

  return (
    <div className="relative isolate z-[200] min-h-screen bg-gray-100 text-gray-900">
      {attemptType === "PRACTICE" && !wrongOnly && !sectionParam && (
        <div className="fixed top-4 left-1/2 z-[300] -translate-x-1/2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 shadow-md">
          Practice Mode &mdash; answers will not count toward your score
        </div>
      )}
      {wrongOnly && (
        <div className="fixed top-4 left-1/2 z-[300] -translate-x-1/2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-800 shadow-lg">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Retrying weak questions &mdash; {totalQuestions} question{totalQuestions !== 1 ? "s" : ""} shuffled
          </div>
        </div>
      )}
      {sectionParam && (
        <div className="fixed top-4 left-1/2 z-[300] -translate-x-1/2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800 shadow-lg">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Practice Mode &mdash; {sectionParam}
          </div>
        </div>
      )}

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
          <div className="flex items-center gap-3">
            <div className={`font-mono text-sm font-semibold tabular-nums ${isLowTime ? "animate-pulse text-red-200" : "text-white"}`}>
              Time Left: {formatTime(activeTimeLeft)}
            </div>
            <button
              type="button"
              onClick={() => setShowPauseModal(true)}
              className="rounded-md border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition"
            >
              Pause &amp; Exit
            </button>
          </div>
        </div>

        {/* Sections row */}
        <div className="border-t border-blue-500/60 bg-white px-4 py-1.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Sections</span>
            {test.sections.map((section, sectionIndex) => {
              const isActive = sectionIndex === currentSectionIndex;
              const isCompleted = lockedSections.includes(sectionIndex);

              if (hasLockedSections) {
                // Display-only — no clicking in locked-section exams
                return (
                  <span
                    key={section.id}
                    className={`flex min-h-8 min-w-0 shrink-0 items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : isCompleted
                        ? "border border-gray-200 bg-gray-100 text-gray-400"
                        : "border border-gray-300 bg-white text-gray-500 opacity-60"
                    }`}
                    data-testid={`section-tab-${section.id}`}
                  >
                    {isCompleted ? <Lock className="h-3 w-3 shrink-0" aria-hidden /> : null}
                    <span className="max-w-[10rem] truncate">{section.name}</span>
                  </span>
                );
              }

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => navigateToSection(sectionIndex, resumeQuestionIndexInSection(sectionIndex))}
                  className={`flex min-h-8 min-w-0 shrink-0 items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-label={`Switch to ${section.name}`}
                  data-testid={`section-tab-${section.id}`}
                >
                  <span className="max-w-[10rem] truncate">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="px-3 py-4 sm:px-5 lg:py-5">
        <div className={`grid gap-0 lg:items-start ${sidebarCollapsed ? "lg:grid-cols-[1fr_auto]" : "lg:grid-cols-[1fr_auto_280px]"}`}>
          <section className="min-w-0">
            {/* Question card */}
            <div className="rounded border border-gray-300 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                <p className="text-sm font-bold text-gray-700">Question No {currentQuestionNumber}</p>
                <div className="flex items-center gap-3">
                  {hasSectionalTiming && (
                    <span className="text-xs font-semibold text-gray-500">Section time: {formatTime(sectionTimeLeft)}</span>
                  )}
                  {availableLangs.length > 1 && (
                    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 p-1">
                      {availableLangs.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setLang(l)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            lang === l
                              ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-200"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          {LANGUAGE_LABELS[l]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-5 px-5 py-5">

              {/* DI Set context panel */}
              {q.diSetId && (q.diSetImageUrl || q.diSetDescription) && (
                <div className="mb-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  {q.diSetTitle && <p className="text-xs font-semibold text-blue-700 mb-2">{q.diSetTitle}</p>}
                  {q.diSetImageUrl && (
                    <img
                      src={q.diSetImageUrl}
                      alt={q.diSetTitle ?? "DI diagram"}
                      className="max-w-full rounded mb-2"
                    />
                  )}
                  {q.diSetDescription && (
                    <p className="text-sm text-blue-900 whitespace-pre-wrap">{q.diSetDescription}</p>
                  )}
                </div>
              )}

              {/* Question image */}
              {q.imageUrl && (
                <img
                  src={q.imageUrl}
                  alt="Question diagram"
                  className="max-w-full rounded-md border border-border mb-1"
                />
              )}

              <div className="text-sm leading-7 text-gray-800 sm:text-base">
                <QuestionRichText content={getLocalizedQuestion(q, lang).text} />
              </div>

              <div className="grid gap-2">
                {getLocalizedQuestion(q, lang).options.map((option, index) => {
                  const isPracticeRevealed = attemptType === "PRACTICE" && revealedPracticeQuestions.has(q.id);
                  const isCorrectOption = index === q.correct;
                  const isUserPracticeSelection = attemptType === "PRACTICE" && practiceAnswers[q.id] === index;
                  const isWrongSelection = isPracticeRevealed && isUserPracticeSelection && !isCorrectOption;
                  const isExamAnswer = isPracticeRevealed && realExamAnswers[q.id] === index;
                  const realSelected = attemptType === "REAL" && answers[q.id] === index;

                  let btnCls = "flex w-full items-center gap-3 rounded-md border p-3 text-left text-sm transition-all active:scale-[0.98] ";
                  let badgeCls = "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ";

                  if (isPracticeRevealed && isCorrectOption) {
                    btnCls += "border-green-500 bg-green-50 text-green-900";
                    badgeCls += "bg-green-600 text-white";
                  } else if (isWrongSelection) {
                    btnCls += "border-red-400 bg-red-50 text-red-900";
                    badgeCls += "bg-red-500 text-white";
                  } else if (isExamAnswer && isPracticeRevealed) {
                    // Exam answer that was neither correct nor the practice selection
                    btnCls += "border-amber-400 bg-amber-50 text-amber-900";
                    badgeCls += "bg-amber-500 text-white";
                  } else if (realSelected) {
                    btnCls += "border-blue-500 bg-blue-50 text-blue-900";
                    badgeCls += "bg-blue-600 text-white";
                  } else {
                    btnCls += isPracticeRevealed
                      ? "border-gray-200 bg-white text-gray-400 opacity-50"
                      : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-800";
                    badgeCls += "border border-gray-300 bg-gray-100 text-gray-600";
                  }

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={isPracticeRevealed}
                      onClick={() => {
                        const timeTaken = Math.round((Date.now() - questionOpenedAt) / 1000);
                        saveQuestionResponse({ attemptId: attemptRecordId, questionId: q.id, selectedOption: index, timeTaken });
                        if (attemptType === "PRACTICE") {
                          setPracticeAnswers((current) => ({ ...current, [q.id]: index }));
                          setPracticeTimeTaken((current) => ({ ...current, [q.id]: timeTaken }));
                          setRevealedPracticeQuestions((current) => new Set([...current, q.id]));
                        } else {
                          setAnswers((current) => ({ ...current, [q.id]: index }));
                        }
                      }}
                      className={btnCls}
                    >
                      <span className={badgeCls}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <QuestionRichText content={option} inline />
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {isPracticeRevealed && isExamAnswer && (
                          <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 border border-amber-300">
                            Exam
                          </span>
                        )}
                        {isPracticeRevealed && isCorrectOption && (
                          <CheckCircle className="h-4 w-4 text-green-600" aria-hidden />
                        )}
                        {isWrongSelection && (
                          <XCircle className="h-4 w-4 text-red-500" aria-hidden />
                        )}
                        {realSelected && (
                          <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {attemptType === "PRACTICE" && revealedPracticeQuestions.has(q.id) && (() => {
                const practiceSelected = practiceAnswers[q.id];
                const examSelected = realExamAnswers[q.id];
                const isCorrect = practiceSelected === q.correct;
                const hasExamData = examSelected !== null && examSelected !== undefined;

                const optionLabel = (idx: number | null | undefined) =>
                  idx !== null && idx !== undefined
                    ? `${String.fromCharCode(65 + idx)}`
                    : "–";

                return (
                  <div className={`mt-4 rounded-lg border ${
                    isCorrect ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                  }`}>
                    {/* Correct / Incorrect header */}
                    <div className={`flex items-center gap-2 px-4 py-2.5 ${
                      isCorrect ? "text-green-800" : "text-red-800"
                    }`}>
                      {isCorrect
                        ? <CheckCircle className="h-4 w-4 shrink-0" />
                        : <XCircle className="h-4 w-4 shrink-0" />}
                      <span className="text-sm font-semibold">{isCorrect ? "Correct!" : "Incorrect"}</span>
                    </div>

                    {/* Answer comparison rows */}
                    <div className="border-t border-gray-200 divide-y divide-gray-100 bg-white rounded-b-lg">
                      {hasExamData && (
                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <span className="w-36 shrink-0 text-xs font-medium text-gray-500">Your exam answer</span>
                          <span className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                            examSelected === q.correct ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                          }`}>{optionLabel(examSelected)}</span>
                          <span className="truncate text-gray-700">
                            {examSelected !== null && examSelected !== undefined ? q.options[examSelected] : "Not answered"}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <span className="w-36 shrink-0 text-xs font-medium text-gray-500">Your practice answer</span>
                        <span className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                          isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}>{optionLabel(practiceSelected)}</span>
                        <span className="truncate text-gray-700">
                          {practiceSelected !== null && practiceSelected !== undefined ? q.options[practiceSelected] : "Not answered"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <span className="w-36 shrink-0 text-xs font-medium text-gray-500">Correct answer</span>
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-green-500 text-xs font-bold text-white">
                          {optionLabel(q.correct)}
                        </span>
                        <span className="truncate text-gray-700">{q.options[q.correct]}</span>
                      </div>
                      {(realExamTimes[q.id] !== undefined || practiceTimeTaken[q.id] !== undefined) && (
                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <span className="w-36 shrink-0 text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Time taken
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {realExamTimes[q.id] !== undefined && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                Exam: {realExamTimes[q.id]}s
                              </span>
                            )}
                            {practiceTimeTaken[q.id] !== undefined && (
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                Practice: {practiceTimeTaken[q.id]}s
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {(() => {
                        const t = practiceTimeTaken[q.id];
                        if (t === undefined) return null;
                        if (t > 90) {
                          return (
                            <div className="flex items-center gap-2 px-4 py-2 text-xs text-amber-700 bg-amber-50 border-t border-amber-100">
                              <span>⏱</span>
                              <span>You spent too much time on this question</span>
                            </div>
                          );
                        }
                        if (isCorrect && t <= 30) {
                          return (
                            <div className="flex items-center gap-2 px-4 py-2 text-xs text-green-700 bg-green-50 border-t border-green-100">
                              <span>⚡</span>
                              <span>Good speed and accuracy</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="px-4 py-3 border-t border-gray-200">
                        <p className="text-sm leading-relaxed text-gray-600">{getLocalizedQuestion(q, lang).explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
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
                {attemptType === "PRACTICE" && Object.keys(realExamAnswers).length > 0 && (
                  <button
                    type="button"
                    onClick={goToNextWrongQuestion}
                    className="rounded-md border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100 transition"
                  >
                    Next Wrong Question
                  </button>
                )}
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

          {/* Sidebar toggle — between question and sidebar */}
          <div className="hidden lg:flex lg:items-start lg:justify-center lg:px-1 lg:pt-1">
            <button
              type="button"
              aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="flex h-8 w-5 items-center justify-center rounded border border-gray-300 bg-white text-gray-400 shadow-sm hover:bg-gray-50 hover:text-gray-600 transition"
            >
              {sidebarCollapsed ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>

          {!sidebarCollapsed && (
          <aside className="min-w-0 space-y-3">
            {/* Jump to Next Section */}
            {currentSectionIndex < effectiveSections.length - 1 && (
              <button
                type="button"
                onClick={() => navigateToSection(currentSectionIndex + 1, 0)}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition"
              >
                <ChevronRight className="h-4 w-4" />
                Jump to Next Section
              </button>
            )}

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
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-gray-900">{statusCounts.NOT_ANSWERED}</span>
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
                {effectiveSections.map((section, sectionIndex) => {
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
                            ? "bg-yellow-400 text-gray-900"
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
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting test…" : "Submit test"}
                </button>
              </div>
            </div>
          </aside>
          )}
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
          <button type="button" className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-60" disabled={isSubmitting} onClick={() => setShowSubmitModal(true)}>
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>

      {showPauseModal && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-gray-900">Pause &amp; Exit?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your progress will be saved. You can resume this test later from where you left off.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowPauseModal(false)}
              >
                Continue Test
              </button>
              <button
                type="button"
                className="flex-1 rounded-md bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                onClick={() => {
                  setShowPauseModal(false);
                  document.exitFullscreen?.().catch(() => {});
                  setLocation("/exams");
                }}
              >
                Save &amp; Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {showSectionSwitchWarning && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-gray-900">Move to Next Section?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Once you move to the next section, you <strong>cannot return</strong> to this section. All your answers in this section will be saved.
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
              <button type="button" className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60" disabled={isSubmitting} onClick={handleSubmit} data-testid="btn-confirm-submit">
                {isSubmitting ? "Submitting test…" : "Submit now"}
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
  const { tests: catalogTests, subcategories: catalogSubcategories, isLoading: catalogLoading, error: catalogError } = useExamCatalog();
  const { data: entitlements } = useMyEntitlements();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [started, setStarted] = useState(false);
  const isWrongOnlyMode = search.includes("wrongOnly=true");
  const sectionFilterParam = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get("section") ?? null;
  }, [search]);
  const [selectedMode, setSelectedMode] = useState<"REAL" | "PRACTICE" | "PRACTICE_WRONG">(isWrongOnlyMode ? "PRACTICE_WRONG" : "REAL");

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

  // Find packages containing this test (used for locked UI)
  const { data: testPackages } = useQuery({
    queryKey: ["packages", "by-test", id],
    queryFn: () => getPackagesByTest(id!),
    enabled: Boolean(id) && !hasInlineQuestions,
    staleTime: 60_000,
  });

  const resolvedTest = useMemo(() => {
    if (hasInlineQuestions && listCandidate) return listCandidate;
    if (remoteTest) return remoteTest as Test;
    return null;
  }, [hasInlineQuestions, listCandidate, remoteTest]);

  const firstRealAttempt = useMemo(
    () => getAttempts().find((a) => a.testId === id && a.attemptType === "REAL" && Array.isArray(a.questionReview)),
    [id],
  );

  const wrongQuestionIds = useMemo<Set<number>>(() => {
    if (!firstRealAttempt?.questionReview) return new Set();
    return new Set(
      firstRealAttempt.questionReview
        .filter((qr) => qr.selected === null || qr.selected === undefined || qr.selected !== qr.correct)
        .map((qr) => qr.questionId),
    );
  }, [firstRealAttempt]);

  const subcategoryLangs = useMemo<string[]>(() => {
    const subId = resolvedTest?.subcategoryId;
    if (subId) {
      const sub = catalogSubcategories.find((s) => s.id === subId);
      if (sub?.languages && sub.languages.length > 0) return sub.languages;
    }
    // Fall back to test.languages from API (which inherits from subcategory via join)
    if (resolvedTest?.languages && resolvedTest.languages.length > 0) return resolvedTest.languages;
    return ["en"];
  }, [resolvedTest, catalogSubcategories]);

  const filteredTest = useMemo<Test | null>(() => {
    if (!resolvedTest || wrongQuestionIds.size === 0) return null;
    const filteredSections = resolvedTest.sections
      .map((sec) => {
        const qs = sec.questions.filter((q) => wrongQuestionIds.has(q.id));
        // Shuffle for smart retry
        const shuffled = [...qs].sort(() => Math.random() - 0.5);
        return { ...sec, questions: shuffled };
      })
      .filter((sec) => sec.questions.length > 0);
    if (filteredSections.length === 0) return null;
    const totalFiltered = filteredSections.reduce((s, sec) => s + sec.questions.length, 0);
    return { ...resolvedTest, sections: filteredSections, totalQuestions: totalFiltered };
  }, [resolvedTest, wrongQuestionIds]);

  // Section practice filter (from performance page weak areas)
  const sectionFilteredTest = useMemo<Test | null>(() => {
    if (!resolvedTest || !sectionFilterParam) return null;
    const filtered = resolvedTest.sections.filter(
      (sec) => sec.name.toLowerCase() === sectionFilterParam.toLowerCase()
    );
    if (filtered.length === 0) return null;
    // Randomly sample up to 15 questions per section
    const sampledSections = filtered.map((sec) => {
      const shuffled = [...sec.questions].sort(() => Math.random() - 0.5);
      const sampled = shuffled.slice(0, 15);
      return { ...sec, questions: sampled };
    });
    const total = sampledSections.reduce((s, sec) => s + sec.questions.length, 0);
    return { ...resolvedTest, sections: sampledSections, totalQuestions: total };
  }, [resolvedTest, sectionFilterParam]);

  // Auto-start in wrongOnly mode (bypass pre-start screen)
  useEffect(() => {
    if (isWrongOnlyMode && resolvedTest && !started) {
      setStarted(true);
    }
  }, [isWrongOnlyMode, resolvedTest, started]);

  // Auto-start in section practice mode (bypass pre-start screen)
  useEffect(() => {
    if (sectionFilterParam && sectionFilteredTest && !started) {
      setStarted(true);
      setSelectedMode("PRACTICE");
    }
  }, [sectionFilterParam, sectionFilteredTest, started]);

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
      const containingPackage = testPackages && testPackages.length > 0 ? testPackages[0] : null;
      if (containingPackage) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
            <Lock className="h-12 w-12 text-gray-400" />
            <p className="text-lg font-semibold text-foreground">{testName}</p>
            <p className="text-center text-sm text-muted-foreground">
              This test is part of a paid package
            </p>
            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-6 py-4 text-center">
              <p className="font-semibold text-gray-800">{containingPackage.name}</p>
              <p className="mt-1 text-sm text-gray-500">{containingPackage.description}</p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                ₹{(containingPackage.finalPriceCents / 100).toFixed(0)}
                {containingPackage.originalPriceCents > containingPackage.finalPriceCents && (
                  <span className="ml-2 text-sm font-normal text-gray-400 line-through">
                    ₹{(containingPackage.originalPriceCents / 100).toFixed(0)}
                  </span>
                )}
              </p>
            </div>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setLocation(`/packages/${containingPackage.id}`)}
            >
              Buy Package
            </Button>
            <Button variant="outline" onClick={() => setLocation("/exams")}>Back to exams</Button>
          </div>
        );
      }
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

  if (!started) {
    const totalQ = resolvedTest.sections.reduce((s, sec) => s + sec.questions.length, 0);
    const hasDraft = Boolean(getActiveTestSession(id!));
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
          <h1 className="text-xl font-bold text-gray-900">{resolvedTest.name}</h1>
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-md bg-gray-50 p-4 text-center text-sm">
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="mt-0.5 font-semibold text-gray-800">{resolvedTest.duration} min</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Questions</p>
              <p className="mt-0.5 font-semibold text-gray-800">{totalQ}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Sections</p>
              <p className="mt-0.5 font-semibold text-gray-800">{resolvedTest.sections.length}</p>
            </div>
          </div>
          {resolvedTest.sections.length > 1 && (
            <div className="mt-4 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sections</p>
              {resolvedTest.sections.map((sec) => (
                <div key={sec.id} className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <span className="text-gray-700">{sec.name}</span>
                  <span className="text-xs text-gray-500">{sec.questions.length} questions</span>
                </div>
              ))}
            </div>
          )}
          {/* Marking scheme */}
          {((resolvedTest.marksPerQuestion ?? 1) !== 1 || (resolvedTest.negativeMarks ?? 0) !== 0) && (
            <div className="mt-4 rounded border border-blue-100 bg-blue-50 px-4 py-3 text-sm">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600">Marking Scheme</p>
              <div className="flex flex-wrap gap-4">
                <span className="font-semibold text-emerald-700">+{resolvedTest.marksPerQuestion ?? 1} correct</span>
                {(resolvedTest.negativeMarks ?? 0) > 0 && (
                  <span className="font-semibold text-red-600">−{resolvedTest.negativeMarks} wrong</span>
                )}
                <span className="text-gray-500">0 skipped</span>
              </div>
            </div>
          )}
          {hasDraft && (
            <p className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              You have a saved session for this test. Clicking Resume will continue from where you left off.
            </p>
          )}

          {!hasDraft && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Select Mode</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMode("REAL")}
                  className={`rounded-lg border p-3 text-left transition ${
                    selectedMode === "REAL"
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800">Real Exam</p>
                  <p className="mt-0.5 text-xs text-gray-500">Timed · Section rules apply</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode("PRACTICE")}
                  className={`rounded-lg border p-3 text-left transition ${
                    selectedMode === "PRACTICE"
                      ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800">Practice</p>
                  <p className="mt-0.5 text-xs text-gray-500">No timer · Free navigation</p>
                </button>
              </div>
              {filteredTest && (
                <button
                  type="button"
                  onClick={() => setSelectedMode("PRACTICE_WRONG")}
                  className={`mt-3 w-full rounded-lg border p-3 text-left transition ${
                    selectedMode === "PRACTICE_WRONG"
                      ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800">Practice Wrong Questions</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {wrongQuestionIds.size} question{wrongQuestionIds.size !== 1 ? "s" : ""} you got wrong or skipped · No timer
                  </p>
                </button>
              )}
            </div>
          )}
          {firstRealAttempt && (
            <div className="mt-5">
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                onClick={() => setLocation(`/result?testId=${encodeURIComponent(id!)}`)}
              >
                View Solutions &amp; Review
              </Button>
            </div>
          )}
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => setLocation("/exams")}>Back</Button>
            <Button
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                if (selectedMode === "REAL") {
                  document.documentElement.requestFullscreen?.().catch(() => {});
                }
                setStarted(true);
              }}
            >
              {hasDraft ? "Resume Test" : "Start Test"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMode === "PRACTICE") {
    return (
      <AppLayout>
        <TestRunner test={resolvedTest} showSuccessMessage={showSuccessMessage} initialMode="PRACTICE" subcategoryLanguages={subcategoryLangs} sectionParam={sectionFilterParam} />
      </AppLayout>
    );
  }

  if (selectedMode === "PRACTICE_WRONG") {
    if (!filteredTest) {
      // No wrong questions found — show friendly message
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">No wrong questions to practice</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You answered all questions correctly in your last attempt. Nothing to retry!
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setLocation("/exams")}>Back to Tests</Button>
            <Button onClick={() => setLocation(`/result?testId=${encodeURIComponent(id!)}`)}>View Result</Button>
          </div>
        </div>
      );
    }
    return (
      <AppLayout>
        <TestRunner test={filteredTest} showSuccessMessage={showSuccessMessage} initialMode="PRACTICE" subcategoryLanguages={subcategoryLangs} wrongOnly={true} />
      </AppLayout>
    );
  }

  return <TestRunner test={resolvedTest} showSuccessMessage={showSuccessMessage} initialMode="REAL" subcategoryLanguages={subcategoryLangs} />;
}

