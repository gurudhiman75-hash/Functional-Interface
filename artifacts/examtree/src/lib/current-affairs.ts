import { apiRequest } from "@/lib/api";

export type CurrentAffairsDashboardResponse = {
  generatedAt: string;
  today: string;
  summary: {
    attemptCount: number;
    quizAttempts: number;
    revisionAttempts: number;
    questionCount: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    accuracy: number;
    averageScore: number;
    streak: number;
    lastStudyAt: string | null;
  };
  revision: {
    activeItems: number;
    dueNow: number;
    overdue: number;
    mastered: number;
    recovery: number;
    nextReviewAt: string | null;
    stages: Array<{
      stage: number;
      label: string;
      count: number;
      due: number;
      masteryState: "recovery" | "learning" | "strong" | "mastered";
    }>;
  };
  sevenDayActivity: Array<{
    day: string;
    attempts: number;
    questions: number;
    correct: number;
    accuracy: number;
  }>;
  categories: Array<{
    category: string;
    label: string;
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    accuracy: number;
    due: number;
    recovery: number;
    mastered: number;
    weaknessScore: number;
  }>;
  weakAreas: Array<{
    category: string;
    label: string;
    total: number;
    accuracy: number;
    due: number;
    recovery: number;
    mastered: number;
    weaknessScore: number;
  }>;
  todayFocus: Array<{
    category: string;
    label: string;
    due: number;
    recovery: number;
    oldestDueAt: string | null;
  }>;
  recentAttempts: Array<{
    id: string;
    attemptType: string;
    languageCode: string;
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    scorePercent: number;
    submittedAt: string;
    quizCode: string | null;
    examFamily: string | null;
    periodType: string | null;
  }>;
  latestDailyQuizzes: Array<{
    quizCode: string;
    itemCount: number;
    publishedAt: string;
    periodStart: string;
    periodEnd: string;
    examFamily: string;
    attempted: boolean;
    bestScore: number | null;
  }>;
};

export async function getCurrentAffairsDashboard(): Promise<CurrentAffairsDashboardResponse> {
  return apiRequest<CurrentAffairsDashboardResponse>("/current-affairs/dashboard");
}
