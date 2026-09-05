import { apiRequest } from "@/lib/api";

export type LearningResourceCategory = "current_affairs" | "notes" | "formula_sheet";
export type LearningResourceFormat = "article" | "pdf";

export type LearningResourceExam = {
  id: string;
  code: string;
  name: string;
  familyId: string | null;
  familyCode: string | null;
  familyName: string | null;
};

export type LearningResourceSummary = {
  id: string;
  publicCode: string;
  category: LearningResourceCategory;
  format: LearningResourceFormat;
  title: string;
  summary: string | null;
  languageCode: string;
  contentDate: string | null;
  contentUrl: string | null;
  hasInlineContent: boolean;
  publishedAt: string;
  expiresAt: string | null;
  isGeneral: boolean;
  exams: LearningResourceExam[];
};

export type LearningResourceDetail = Omit<LearningResourceSummary, "hasInlineContent"> & {
  bodyMarkdown: string | null;
};

type LearningResourceListResponse = {
  resources: LearningResourceSummary[];
  filters: {
    category: LearningResourceCategory | null;
    format: LearningResourceFormat | null;
    language: string | null;
  };
  generatedAt: string;
};

type LearningResourceDetailResponse = {
  resource: LearningResourceDetail;
};

export async function getLearningResources(params: {
  category?: LearningResourceCategory;
  format?: LearningResourceFormat;
  language?: string;
  limit?: number;
} = {}): Promise<LearningResourceListResponse> {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.format) search.set("format", params.format);
  if (params.language) search.set("language", params.language);
  search.set("limit", String(Math.max(1, Math.min(100, Math.round(params.limit ?? 100)))));
  return apiRequest<LearningResourceListResponse>(`/learning-resources?${search.toString()}`);
}

export async function getLearningResource(identifier: string): Promise<LearningResourceDetail> {
  const response = await apiRequest<LearningResourceDetailResponse>(
    `/learning-resources/${encodeURIComponent(identifier)}`,
  );
  return response.resource;
}

export function learningResourceDate(resource: Pick<LearningResourceSummary, "contentDate" | "publishedAt">): Date | null {
  const value = resource.contentDate || resource.publishedAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export function formatLearningResourceDate(resource: Pick<LearningResourceSummary, "contentDate" | "publishedAt">): string {
  const date = learningResourceDate(resource);
  if (!date) return "Published resource";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function learningResourceCategoryLabel(category: LearningResourceCategory): string {
  if (category === "current_affairs") return "Current Affairs";
  if (category === "formula_sheet") return "Formula Sheet";
  return "Study Notes";
}

export function learningResourceHref(resource: Pick<LearningResourceSummary, "id">): string {
  return `/resources/item/${encodeURIComponent(resource.id)}`;
}
