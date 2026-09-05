import { apiRequest } from "@/lib/api";

export interface PublishedTestSummary {
  id: string;
  publicCode: string;
  examVersionId: string;
  publishedVersionId: string;
  title: string;
  description: string | null;
  durationSeconds: number;
  totalMarks: number;
  settings: Record<string, unknown>;
  examCode: string;
  examName: string;
  examFamilyCode: string;
  examFamilyName: string;
  questionCount: number;
  publishedAt: string | null;
  closesAt: string | null;
}

export interface PublishedTestOption {
  id: string;
  key: string;
  text: string;
  sortOrder: number;
}

export interface PublishedTestQuestion {
  testSectionId: string;
  questionVersionId: string;
  position: number;
  marks: number;
  negativeMarks: number;
  settings: Record<string, unknown>;
  publicCode: string;
  questionType: string;
  difficulty: string;
  stem: string;
  options: PublishedTestOption[];
}

export interface PublishedTestSection {
  id: string;
  sectionKey: string;
  name: string;
  sortOrder: number;
  durationSeconds: number | null;
  settings: Record<string, unknown>;
  questions: PublishedTestQuestion[];
}

export interface PublishedTestDetail {
  test: PublishedTestSummary & {
    instructions: Record<string, unknown>;
  };
  sections: PublishedTestSection[];
  generatedAt: string;
}

export function getPublishedTests() {
  return apiRequest<{ tests: PublishedTestSummary[]; generatedAt: string }>("/published-tests");
}

export function getPublishedTest(identifier: string) {
  return apiRequest<PublishedTestDetail>(`/published-tests/${encodeURIComponent(identifier)}`);
}
