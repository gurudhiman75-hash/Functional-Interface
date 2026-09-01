import { createHash, randomUUID } from "node:crypto";

export const CURRENT_AFFAIRS_CATEGORIES = [
  "national",
  "economy_banking",
  "international",
  "appointments",
  "awards",
  "reports_indices",
  "sports",
  "science_technology",
  "space",
  "defence",
  "environment",
  "books_authors",
  "important_days",
  "summits",
  "obituaries",
  "punjab",
  "other",
] as const;

export const CURRENT_AFFAIRS_EXAM_FAMILIES = [
  "ssc",
  "banking",
  "punjab",
  "railways",
  "general",
] as const;

export type CurrentAffairsCategory = (typeof CURRENT_AFFAIRS_CATEGORIES)[number];
export type CurrentAffairsExamFamily = (typeof CURRENT_AFFAIRS_EXAM_FAMILIES)[number];

export type AtomicFactInput = {
  key: string;
  value: string;
  type?: "string" | "number" | "date" | "money" | "percentage" | "entity" | "boolean";
  confidence?: number;
};

export type EventCandidateInput = {
  title: string;
  summary?: string;
  importanceReason?: string;
  eventDate: string;
  category: CurrentAffairsCategory;
  subcategory?: string;
  sourceKey: string;
  sourceUrl: string;
  sourceTitle?: string;
  sourcePublishedAt?: string;
  sourceTrustScore?: number;
  isPrimarySource?: boolean;
  facts?: AtomicFactInput[];
};

export type ExamRelevanceScore = {
  examFamily: CurrentAffairsExamFamily;
  score: number;
  includeRecommended: boolean;
  reasons: string[];
};

const GENERAL_CATEGORY_BASE: Record<CurrentAffairsCategory, number> = {
  national: 70,
  economy_banking: 76,
  international: 62,
  appointments: 72,
  awards: 66,
  reports_indices: 74,
  sports: 63,
  science_technology: 68,
  space: 72,
  defence: 70,
  environment: 62,
  books_authors: 54,
  important_days: 52,
  summits: 65,
  obituaries: 46,
  punjab: 72,
  other: 40,
};

// CP-043: relevance is a product-fit decision, not a proxy for source quality.
// These baselines deliberately differ by exam family. Evidence trust may nudge a
// score a few points, but it can no longer turn an unrelated category into a
// recommended Banking/Punjab/SSC story merely because the source is official.
const EXAM_CATEGORY_BASE: Record<CurrentAffairsExamFamily, Record<CurrentAffairsCategory, number>> = {
  ssc: {
    national: 72,
    economy_banking: 66,
    international: 66,
    appointments: 74,
    awards: 70,
    reports_indices: 70,
    sports: 68,
    science_technology: 68,
    space: 72,
    defence: 72,
    environment: 64,
    books_authors: 52,
    important_days: 64,
    summits: 66,
    obituaries: 48,
    punjab: 52,
    other: 35,
  },
  banking: {
    national: 66,
    economy_banking: 80,
    international: 66,
    appointments: 70,
    awards: 62,
    reports_indices: 76,
    sports: 54,
    science_technology: 54,
    space: 54,
    defence: 54,
    environment: 52,
    books_authors: 48,
    important_days: 52,
    summits: 62,
    obituaries: 44,
    punjab: 46,
    other: 35,
  },
  punjab: {
    national: 66,
    economy_banking: 58,
    international: 54,
    appointments: 68,
    awards: 64,
    reports_indices: 60,
    sports: 64,
    science_technology: 56,
    space: 56,
    defence: 58,
    environment: 56,
    books_authors: 50,
    important_days: 56,
    summits: 54,
    obituaries: 46,
    punjab: 82,
    other: 35,
  },
  railways: {
    national: 70,
    economy_banking: 62,
    international: 60,
    appointments: 72,
    awards: 68,
    reports_indices: 66,
    sports: 68,
    science_technology: 68,
    space: 70,
    defence: 68,
    environment: 60,
    books_authors: 50,
    important_days: 62,
    summits: 62,
    obituaries: 46,
    punjab: 48,
    other: 35,
  },
  general: GENERAL_CATEGORY_BASE,
};

function bounded(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function normalizeCurrentAffairsText(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function assertDateOnly(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("eventDate must use YYYY-MM-DD");
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error("eventDate is invalid");
  }
  return value;
}

export function assertHttpsUrl(value: string, label = "sourceUrl"): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid HTTPS URL`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`${label} must use HTTPS`);
  }
  url.hash = "";
  return url.toString();
}

export function currentAffairsFingerprint(input: Pick<EventCandidateInput, "title" | "eventDate" | "category">): string {
  const normalizedTitle = normalizeCurrentAffairsText(input.title);
  const canonical = `${assertDateOnly(input.eventDate)}|${input.category}|${normalizedTitle}`;
  return createHash("sha256").update(canonical).digest("hex");
}

export function sourceCandidateDedupeKey(sourceKey: string, sourceUrl: string, rawTitle: string): string {
  const canonical = [
    normalizeCurrentAffairsText(sourceKey),
    assertHttpsUrl(sourceUrl),
    normalizeCurrentAffairsText(rawTitle),
  ].join("|");
  return createHash("sha256").update(canonical).digest("hex");
}

export function publicCurrentAffairsCode(date: string): string {
  const dateToken = assertDateOnly(date).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `CA-${dateToken}-${suffix}`;
}

export function validateEventCandidate(input: EventCandidateInput): EventCandidateInput {
  const title = input.title?.trim();
  if (!title || title.length < 8 || title.length > 240) {
    throw new Error("title must contain 8 to 240 characters");
  }
  if (!CURRENT_AFFAIRS_CATEGORIES.includes(input.category)) {
    throw new Error("unsupported current-affairs category");
  }
  const sourceKey = input.sourceKey?.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]{1,79}$/.test(sourceKey)) {
    throw new Error("sourceKey is invalid");
  }
  const sourceUrl = assertHttpsUrl(input.sourceUrl);
  const eventDate = assertDateOnly(input.eventDate);
  const sourceTrustScore = Number.isFinite(Number(input.sourceTrustScore))
    ? Math.max(0, Math.min(1, Number(input.sourceTrustScore)))
    : 0.7;
  const facts = (input.facts ?? []).slice(0, 50).map((fact) => {
    const key = String(fact.key ?? "").trim().slice(0, 120);
    const value = String(fact.value ?? "").trim().slice(0, 2000);
    if (!key || !value) throw new Error("facts require non-empty key and value");
    return {
      key,
      value,
      type: fact.type ?? "string",
      confidence: Number.isFinite(Number(fact.confidence))
        ? Math.max(0, Math.min(1, Number(fact.confidence)))
        : sourceTrustScore,
    };
  });

  return {
    ...input,
    title,
    eventDate,
    sourceKey,
    sourceUrl,
    sourceTrustScore,
    facts,
    summary: String(input.summary ?? "").trim().slice(0, 5000),
    importanceReason: String(input.importanceReason ?? "").trim().slice(0, 2000),
    subcategory: String(input.subcategory ?? "").trim().slice(0, 120) || undefined,
    sourceTitle: String(input.sourceTitle ?? "").trim().slice(0, 300) || undefined,
  };
}

export function scoreExamRelevance(input: EventCandidateInput): ExamRelevanceScore[] {
  const candidate = validateEventCandidate(input);
  const trustAdjustment = Math.round(((candidate.sourceTrustScore ?? 0.7) - 0.5) * 4);
  const primaryEvidenceAdjustment = candidate.isPrimarySource ? 2 : 0;
  const structuredFactAdjustment = Math.min(2, Math.floor((candidate.facts?.length ?? 0) / 3));

  return CURRENT_AFFAIRS_EXAM_FAMILIES.map((examFamily) => {
    const reasons: string[] = [];
    let score = EXAM_CATEGORY_BASE[examFamily][candidate.category];
    reasons.push(`Exam-family category fit: ${examFamily}/${candidate.category} = ${score}`);

    if (trustAdjustment) {
      score += trustAdjustment;
      reasons.push(`Evidence trust relevance nudge ${trustAdjustment >= 0 ? "+" : ""}${trustAdjustment}`);
    }
    if (primaryEvidenceAdjustment) {
      score += primaryEvidenceAdjustment;
      reasons.push("Primary evidence relevance nudge +2");
    }
    if (structuredFactAdjustment) {
      score += structuredFactAdjustment;
      reasons.push(`Structured-fact relevance nudge +${structuredFactAdjustment}`);
    }

    const normalized = bounded(score);
    return {
      examFamily,
      score: normalized,
      includeRecommended: normalized >= 65,
      reasons,
    };
  });
}

export function verificationConfidence(input: {
  evidence: Array<{ isPrimaryEvidence?: boolean; trustScore?: number }>;
  factConfidences?: number[];
}): number {
  if (input.evidence.length === 0) return 0;
  const evidenceScores = input.evidence.map((item) => {
    const trust = Math.max(0, Math.min(1, Number(item.trustScore ?? 0.5)));
    return Math.min(1, trust + (item.isPrimaryEvidence ? 0.15 : 0));
  });
  const evidenceAverage = evidenceScores.reduce((sum, value) => sum + value, 0) / input.evidence.length;
  const corroborationBoost = Math.min(0.12, Math.max(0, input.evidence.length - 1) * 0.04);
  const facts = (input.factConfidences ?? []).filter((value) => Number.isFinite(value));
  const factAverage = facts.length > 0
    ? facts.reduce((sum, value) => sum + Math.max(0, Math.min(1, value)), 0) / facts.length
    : evidenceAverage;
  return Math.max(0, Math.min(1, Number((evidenceAverage * 0.65 + factAverage * 0.35 + corroborationBoost).toFixed(4))));
}

export function canAutoVerify(input: {
  evidence: Array<{ isPrimaryEvidence?: boolean; trustScore?: number }>;
  factConfidences?: number[];
}): { allowed: boolean; confidence: number; reason: string } {
  const confidence = verificationConfidence(input);
  const hasPrimary = input.evidence.some((item) => item.isPrimaryEvidence && Number(item.trustScore ?? 0) >= 0.75);
  const strongCorroboration = input.evidence.filter((item) => Number(item.trustScore ?? 0) >= 0.72).length >= 2;
  const allowed = confidence >= 0.78 && (hasPrimary || strongCorroboration);
  return {
    allowed,
    confidence,
    reason: allowed
      ? hasPrimary
        ? "Primary-source evidence with sufficient confidence"
        : "Two or more sufficiently trusted sources corroborate the event"
      : "Event requires editorial verification",
  };
}

export function renderEventMarkdown(input: {
  title: string;
  summary: string;
  importanceReason?: string;
  facts: Array<{ key: string; value: string }>;
}): string {
  const lines = [`# ${input.title}`, ""];
  if (input.summary.trim()) {
    lines.push("## What happened", "", input.summary.trim(), "");
  }
  if (input.facts.length > 0) {
    lines.push("## Key facts", "");
    for (const fact of input.facts) lines.push(`- **${fact.key}:** ${fact.value}`);
    lines.push("");
  }
  if (input.importanceReason?.trim()) {
    lines.push("## Why it matters for exams", "", input.importanceReason.trim(), "");
  }
  return `${lines.join("\n").trim()}\n`;
}
