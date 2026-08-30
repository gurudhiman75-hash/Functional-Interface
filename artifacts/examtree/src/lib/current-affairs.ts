import { apiRequest } from "@/lib/api";

export type CurrentAffairsLanguage = "en" | "hi" | "pa";
export type CurrentAffairsPeriod = "daily" | "weekly" | "monthly";
export type CurrentAffairsExamFamily = "ssc" | "banking" | "punjab" | "railways" | "general";

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

export type CurrentAffairsHubResource = {
  languageCode: CurrentAffairsLanguage;
  publicCode: string;
  title: string;
  summary: string;
  contentDate: string | null;
  format: string;
};

export type CurrentAffairsHubPack = {
  releaseCode: string;
  periodType: CurrentAffairsPeriod;
  periodStart: string;
  periodEnd: string;
  examFamily: CurrentAffairsExamFamily;
  releaseVersion: number;
  approvedAt: string;
  languages: readonly CurrentAffairsLanguage[];
  resources: Partial<Record<CurrentAffairsLanguage, CurrentAffairsHubResource>>;
  quiz: {
    publicCode: string;
    itemCount: number;
    publishedAt: string | null;
  } | null;
};

export type CurrentAffairsHubResponse = {
  packs: CurrentAffairsHubPack[];
  filters: {
    periodType: CurrentAffairsPeriod | null;
    examFamily: CurrentAffairsExamFamily | null;
  };
  generatedAt: string;
};

export type CurrentAffairsResourceDetail = {
  id: string;
  publicCode: string;
  category: string;
  format: string;
  title: string;
  summary: string;
  languageCode: CurrentAffairsLanguage;
  contentDate: string | null;
  bodyMarkdown: string | null;
  contentUrl: string | null;
  publishedAt: string;
  expiresAt: string | null;
};

export type CurrentAffairsLearnerQuestion = {
  id: string;
  itemNumber: number;
  questionFamily: string;
  stem: string;
  options: string[];
};

export type CurrentAffairsQuizResponse = {
  quiz: {
    publicCode: string;
    periodType: CurrentAffairsPeriod;
    periodStart: string;
    periodEnd: string;
    examFamily: CurrentAffairsExamFamily;
    releaseVersion: number;
    languageCode: CurrentAffairsLanguage;
    itemCount: number;
    publishedAt: string;
  };
  questions: CurrentAffairsLearnerQuestion[];
};

export type CurrentAffairsAnswer = {
  id: string;
  selectedIndex: number | null;
};

export type CurrentAffairsResultItem = {
  id: string;
  itemNumber?: number;
  questionFamily?: string;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect?: boolean;
  result?: "correct" | "wrong" | "unanswered";
  correctAnswer: string | null;
  explanation: string | null;
  revisionStageBefore?: number;
  revisionStageAfter?: number;
  nextReviewAt?: string;
};

export type CurrentAffairsGrade = {
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  scorePercent: number;
  results: CurrentAffairsResultItem[];
};

export type CurrentAffairsPublicGradeResponse = {
  quiz: {
    publicCode: string;
    languageCode: CurrentAffairsLanguage;
    periodType: CurrentAffairsPeriod;
    periodStart: string;
    periodEnd: string;
    examFamily: CurrentAffairsExamFamily;
  };
  grade: CurrentAffairsGrade;
};

export type CurrentAffairsTrackedAttemptResponse = {
  attempt: {
    id: string;
    attemptType: "quiz" | "revision";
    languageCode: CurrentAffairsLanguage;
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
    scorePercent: number;
    submittedAt: string;
  };
  results: CurrentAffairsResultItem[];
  idempotentReplay: boolean;
};

export type CurrentAffairsRevisionQuestion = CurrentAffairsLearnerQuestion & {
  sourceQuizCode: string;
  revision: {
    stage: number;
    stageLabel: string;
    dueAt: string;
    lastResult: string;
    reviewCount: number;
  };
};

export type CurrentAffairsRevisionQueue = {
  languageCode: CurrentAffairsLanguage;
  due: CurrentAffairsRevisionQuestion[];
  dueCount: number;
  upcomingCount: number;
  nextUpcomingAt: string | null;
  generatedAt: string;
};

export async function getCurrentAffairsDashboard(): Promise<CurrentAffairsDashboardResponse> {
  return apiRequest<CurrentAffairsDashboardResponse>("/current-affairs/dashboard");
}

export async function getCurrentAffairsHub(filters?: {
  periodType?: CurrentAffairsPeriod | null;
  examFamily?: CurrentAffairsExamFamily | null;
  limit?: number;
}): Promise<CurrentAffairsHubResponse> {
  const search = new URLSearchParams();
  if (filters?.periodType) search.set("period", filters.periodType);
  if (filters?.examFamily) search.set("family", filters.examFamily);
  search.set("limit", String(filters?.limit ?? 60));
  return apiRequest<CurrentAffairsHubResponse>(`/current-affairs/hub?${search.toString()}`);
}

export async function getCurrentAffairsResource(publicCode: string): Promise<CurrentAffairsResourceDetail> {
  const response = await apiRequest<{ resource: CurrentAffairsResourceDetail }>(
    `/learning-resources/${encodeURIComponent(publicCode)}`,
  );
  return response.resource;
}

export async function getCurrentAffairsQuiz(
  publicCode: string,
  languageCode: CurrentAffairsLanguage,
): Promise<CurrentAffairsQuizResponse> {
  return apiRequest<CurrentAffairsQuizResponse>(
    `/current-affairs/quizzes/${encodeURIComponent(publicCode)}?language=${encodeURIComponent(languageCode)}`,
  );
}

export async function gradeCurrentAffairsQuiz(
  publicCode: string,
  languageCode: CurrentAffairsLanguage,
  answers: CurrentAffairsAnswer[],
): Promise<CurrentAffairsPublicGradeResponse> {
  return apiRequest<CurrentAffairsPublicGradeResponse>(
    `/current-affairs/quizzes/${encodeURIComponent(publicCode)}/grade`,
    {
      method: "POST",
      body: JSON.stringify({ languageCode, answers }),
    },
  );
}

export async function submitTrackedCurrentAffairsQuiz(
  publicCode: string,
  clientAttemptId: string,
  languageCode: CurrentAffairsLanguage,
  answers: CurrentAffairsAnswer[],
): Promise<CurrentAffairsTrackedAttemptResponse> {
  return apiRequest<CurrentAffairsTrackedAttemptResponse>(
    `/current-affairs/quizzes/${encodeURIComponent(publicCode)}/attempts`,
    {
      method: "POST",
      body: JSON.stringify({ clientAttemptId, languageCode, answers }),
    },
  );
}

export async function getCurrentAffairsRevisionQueue(
  languageCode: CurrentAffairsLanguage,
  limit = 30,
): Promise<CurrentAffairsRevisionQueue> {
  return apiRequest<CurrentAffairsRevisionQueue>(
    `/current-affairs/revision?language=${encodeURIComponent(languageCode)}&limit=${Math.max(1, Math.min(100, limit))}`,
  );
}

export async function submitCurrentAffairsRevision(
  clientAttemptId: string,
  languageCode: CurrentAffairsLanguage,
  answers: CurrentAffairsAnswer[],
): Promise<CurrentAffairsTrackedAttemptResponse> {
  return apiRequest<CurrentAffairsTrackedAttemptResponse>("/current-affairs/revision/attempts", {
    method: "POST",
    body: JSON.stringify({ clientAttemptId, languageCode, answers }),
  });
}

export function createCurrentAffairsAttemptId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
