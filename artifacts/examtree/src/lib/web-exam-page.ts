import { apiRequest } from "@/lib/api";

export type WebExamSectionType =
  | "hero"
  | "test_catalog"
  | "exam_information"
  | "syllabus"
  | "preparation"
  | "topic_practice"
  | "custom"
  | "details_overview"
  | "details_syllabus"
  | "details_pattern"
  | "details_preparation"
  | "details_practice"
  | "details_updates"
  | "details_custom";

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
    { id: "details-overview", type: "details_overview", isVisible: true, sortOrder: 20, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-syllabus", type: "details_syllabus", isVisible: true, sortOrder: 21, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 2, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-pattern", type: "details_pattern", isVisible: true, sortOrder: 22, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-preparation", type: "details_preparation", isVisible: true, sortOrder: 23, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-practice", type: "details_practice", isVisible: true, sortOrder: 24, eyebrow: "", title: "", description: "", body: "", layout: "grid", columns: 3, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-updates", type: "details_updates", isVisible: true, sortOrder: 25, eyebrow: "", title: "", description: "", body: "", layout: "list", columns: 2, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-eligibility", type: "details_custom", isVisible: false, sortOrder: 26, eyebrow: "Eligibility", title: "Eligibility & selection process", description: "", body: "", layout: "grid", columns: 2, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-dates", type: "details_custom", isVisible: false, sortOrder: 27, eyebrow: "Important dates", title: "Important dates & vacancies", description: "", body: "", layout: "grid", columns: 2, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-salary", type: "details_custom", isVisible: false, sortOrder: 28, eyebrow: "Job profile", title: "Salary & job profile", description: "", body: "", layout: "grid", columns: 2, cardStyle: "default", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
    { id: "details-faq", type: "details_custom", isVisible: false, sortOrder: 29, eyebrow: "FAQ", title: "Frequently asked questions", description: "", body: "", layout: "list", columns: 1, cardStyle: "bordered", tabStyle: "pills", showCounts: false, labels: {}, ctaLabel: "", ctaHref: "", cards: [] },
  ],
};

export function getWebExamPageConfiguration(examSlug: string) {
  return apiRequest<WebExamPageConfigurationResponse>(`/web/exam-pages/${encodeURIComponent(examSlug)}`);
}
