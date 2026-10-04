import { apiRequest } from "@/lib/api";

export type WebExamSectionType =
  | "hero"
  | "test_catalog"
  | "exam_information"
  | "syllabus"
  | "preparation"
  | "topic_practice"
  | "custom";

export type WebExamSectionLayout = "tabs" | "list" | "grid" | "horizontal" | "cards";
export type WebExamCardStyle = "default" | "compact" | "bordered" | "minimal" | "featured";
export type WebExamTabStyle = "pills" | "underline" | "segmented";

export interface WebExamCustomCard {
  id: string;
  title: string;
  text: string;
  badge: string;
  ctaLabel: string;
  href: string;
  isVisible: boolean;
  sortOrder: number;
}

export interface WebExamPageSection {
  id: string;
  type: WebExamSectionType;
  isVisible: boolean;
  sortOrder: number;
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  layout: WebExamSectionLayout;
  columns: number;
  cardStyle: WebExamCardStyle;
  tabStyle: WebExamTabStyle;
  showCounts: boolean;
  labels: Record<string, string>;
  ctaLabel: string;
  ctaHref: string;
  cards: WebExamCustomCard[];
}

export interface WebExamPageConfiguration {
  pageEyebrow: string;
  pageTitle: string;
  pageDescription: string;
  sections: WebExamPageSection[];
}

export interface WebExamPageConfigurationResponse {
  examSlug: string;
  configured: boolean;
  title: string;
  configuration: WebExamPageConfiguration | null;
  updatedAt: string | null;
}

export const DEFAULT_WEB_EXAM_PAGE_CONFIGURATION: WebExamPageConfiguration = {
  pageEyebrow: "",
  pageTitle: "",
  pageDescription: "",
  sections: [
    { id: "hero", type: "hero", isVisible: true, sortOrder: 1, eyebrow: "", title: "", description: "", body: "", layout: "cards", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: true, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "test-catalog", type: "test_catalog", isVisible: true, sortOrder: 2, eyebrow: "", title: "", description: "", body: "", layout: "tabs", columns: 1, cardStyle: "default", tabStyle: "pills", showCounts: true, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "exam-information", type: "exam_information", isVisible: true, sortOrder: 3, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: true, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "syllabus", type: "syllabus", isVisible: true, sortOrder: 4, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 2, cardStyle: "default", tabStyle: "pills", showCounts: true, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "preparation", type: "preparation", isVisible: true, sortOrder: 5, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: true, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "topic-practice", type: "topic_practice", isVisible: true, sortOrder: 6, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: true, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
  ],
};

export function getWebExamPageConfiguration(examSlug: string) {
  return apiRequest<WebExamPageConfigurationResponse>(`/web/exam-pages/${encodeURIComponent(examSlug)}`);
}
