import { randomUUID } from "node:crypto";

import { sqlClient } from "./db";

export const WEB_EXAM_SECTION_TYPES = [
  "hero",
  "test_catalog",
  "exam_information",
  "syllabus",
  "preparation",
  "topic_practice",
  "custom",
  "details_overview",
  "details_syllabus",
  "details_pattern",
  "details_preparation",
  "details_practice",
  "details_updates",
  "details_custom",
] as const;

const SECTION_TYPES = new Set<string>(WEB_EXAM_SECTION_TYPES);
const LAYOUTS = new Set(["tabs", "list", "grid", "horizontal", "cards"]);
const CARD_STYLES = new Set(["default", "compact", "bordered", "minimal", "featured"]);
const TAB_STYLES = new Set(["pills", "underline", "segmented"]);

function text(value: unknown, max = 1000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function integer(value: unknown, fallback: number, min: number, max: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}

function normalizeCard(value: unknown, index: number) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    id: text(raw.id, 80) || randomUUID(),
    title: text(raw.title, 180),
    text: text(raw.text, 2000),
    badge: text(raw.badge, 80),
    ctaLabel: text(raw.ctaLabel, 80),
    href: text(raw.href, 1000),
    isVisible: raw.isVisible !== false,
    sortOrder: integer(raw.sortOrder, index + 1, 1, 500),
  };
}

function normalizeLabels(value: unknown) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(
    Object.entries(raw)
      .slice(0, 40)
      .map(([key, label]) => [text(key, 80), text(label, 140)])
      .filter(([key, label]) => Boolean(key && label)),
  );
}

function normalizeSection(value: unknown, index: number) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const type = text(raw.type, 40);
  const layout = text(raw.layout, 40);
  const cardStyle = text(raw.cardStyle, 40);
  const tabStyle = text(raw.tabStyle, 40);
  return {
    id: text(raw.id, 80) || randomUUID(),
    type: SECTION_TYPES.has(type) ? type : "custom",
    isVisible: raw.isVisible !== false,
    sortOrder: integer(raw.sortOrder, index + 1, 1, 500),
    eyebrow: text(raw.eyebrow, 120),
    title: text(raw.title, 220),
    description: text(raw.description, 1200),
    body: text(raw.body, 5000),
    layout: LAYOUTS.has(layout) ? layout : "cards",
    columns: integer(raw.columns, 3, 1, 4),
    cardStyle: CARD_STYLES.has(cardStyle) ? cardStyle : "default",
    tabStyle: TAB_STYLES.has(tabStyle) ? tabStyle : "pills",
    showCounts: raw.showCounts !== false,
    labels: normalizeLabels(raw.labels),
    ctaLabel: text(raw.ctaLabel, 100),
    ctaHref: text(raw.ctaHref, 1000),
    cards: Array.isArray(raw.cards) ? raw.cards.slice(0, 100).map(normalizeCard) : [],
  };
}

export function normalizeWebExamPageConfiguration(value: unknown) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    pageEyebrow: text(raw.pageEyebrow, 160),
    pageTitle: text(raw.pageTitle, 240),
    pageDescription: text(raw.pageDescription, 1200),
    sections: Array.isArray(raw.sections)
      ? raw.sections.slice(0, 40).map(normalizeSection)
      : [],
  };
}

export function defaultWebExamPageConfiguration() {
  return normalizeWebExamPageConfiguration({
    sections: [
      { id: "hero", type: "hero", isVisible: true, sortOrder: 1, layout: "cards", columns: 3 },
      { id: "test-catalog", type: "test_catalog", isVisible: true, sortOrder: 2, layout: "tabs", columns: 1, tabStyle: "pills", showCounts: true },
      { id: "exam-information", type: "exam_information", isVisible: true, sortOrder: 3, layout: "grid", columns: 3 },
      { id: "syllabus", type: "syllabus", isVisible: true, sortOrder: 4, layout: "grid", columns: 2 },
      { id: "preparation", type: "preparation", isVisible: true, sortOrder: 5, layout: "grid", columns: 3 },
      { id: "topic-practice", type: "topic_practice", isVisible: true, sortOrder: 6, layout: "grid", columns: 3 },
      { id: "details-overview", type: "details_overview", isVisible: true, sortOrder: 20, layout: "grid", columns: 3 },
      { id: "details-syllabus", type: "details_syllabus", isVisible: true, sortOrder: 21, layout: "grid", columns: 2 },
      { id: "details-pattern", type: "details_pattern", isVisible: true, sortOrder: 22, layout: "grid", columns: 3 },
      { id: "details-preparation", type: "details_preparation", isVisible: true, sortOrder: 23, layout: "grid", columns: 3 },
      { id: "details-practice", type: "details_practice", isVisible: true, sortOrder: 24, layout: "grid", columns: 3 },
      { id: "details-updates", type: "details_updates", isVisible: true, sortOrder: 25, layout: "list", columns: 2 },
      { id: "details-eligibility", type: "details_custom", isVisible: false, sortOrder: 26, eyebrow: "Eligibility", title: "Eligibility & selection process", layout: "grid", columns: 2 },
      { id: "details-dates", type: "details_custom", isVisible: false, sortOrder: 27, eyebrow: "Important dates", title: "Important dates & vacancies", layout: "grid", columns: 2 },
      { id: "details-salary", type: "details_custom", isVisible: false, sortOrder: 28, eyebrow: "Job profile", title: "Salary & job profile", layout: "grid", columns: 2 },
      { id: "details-faq", type: "details_custom", isVisible: false, sortOrder: 29, eyebrow: "FAQ", title: "Frequently asked questions", layout: "list", columns: 1, cardStyle: "bordered" },
    ],
  });
}

let schemaPromise: Promise<void> | null = null;

export function ensureWebExamPagesSchema() {
  schemaPromise ??= (async () => {
    await sqlClient`
      CREATE TABLE IF NOT EXISTS platform.web_exam_pages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        exam_slug text NOT NULL UNIQUE,
        title text NOT NULL DEFAULT '',
        is_active boolean NOT NULL DEFAULT true,
        configuration jsonb NOT NULL DEFAULT '{"sections":[]}'::jsonb,
        created_by text,
        updated_by text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sqlClient`
      CREATE INDEX IF NOT EXISTS web_exam_pages_active_updated_idx
      ON platform.web_exam_pages (is_active, updated_at DESC)
    `;
  })();
  return schemaPromise;
}
