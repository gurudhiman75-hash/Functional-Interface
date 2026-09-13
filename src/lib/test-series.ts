import { apiRequest } from "@/lib/api";

export interface StudentSeriesSummary {
  id: string;
  code: string;
  name: string;
  description: string;
  availabilityStartAt: string | null;
  availabilityEndAt: string | null;
  progressionMode: "open" | "sequential" | "score_gated";
  completionThreshold: number | null;
  examCode: string;
  examName: string;
  examFamilyCode: string;
  examFamilyName: string;
  testCount: number;
  liveTestCount: number;
  fullLengthTestCount: number;
  durationSeconds: number;
  questionCount: number;
  attemptCount: number;
}

export interface StudentSeriesMember {
  id: string;
  testId: string;
  publicCode: string;
  sortOrder: number;
  title: string;
  description: string | null;
  durationSeconds: number;
  totalMarks: number;
  questionCount: number;
  isRequired: boolean;
  unlockAt: string | null;
  minimumScore: number | null;
  testStatus: string;
  attemptCount: number;
  bestScore: number | null;
  lastAttemptAt: string | null;
  completed: boolean;
  scoreRequirement: number | null;
  scoreRequirementMet: boolean;
  unlocked: boolean;
  lockCode: string | null;
  lockReason: string | null;
}

export interface StudentSeriesDetail {
  series: {
    id: string;
    code: string;
    name: string;
    description: string;
    examVersionId: string;
    examCode: string;
    examName: string;
    examFamilyCode: string;
    examFamilyName: string;
    versionNumber: number;
    availabilityStartAt: string | null;
    availabilityEndAt: string | null;
    progressionMode: "open" | "sequential" | "score_gated";
    completionThreshold: number | null;
  };
  eligibility: {
    available: boolean;
    availabilityCode: string | null;
    availabilityReason: string | null;
    completedRequiredCount: number;
    requiredCount: number;
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    nextTestId: string | null;
    members: StudentSeriesMember[];
  };
  generatedAt: string;
}

export function getStudentTestSeries() {
  return apiRequest<{ series: StudentSeriesSummary[]; generatedAt: string }>("/test-series");
}

export function getStudentTestSeriesDetail(identifier: string) {
  return apiRequest<StudentSeriesDetail>(`/test-series/${encodeURIComponent(identifier)}`);
}
