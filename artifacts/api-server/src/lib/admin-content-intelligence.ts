import { createHash } from "node:crypto";

import { ContentReviewError } from "./admin-content-review";

export type DuplicateMatchKind = "exact" | "template" | "semantic";
export type DuplicateDecision = "unresolved" | "duplicate" | "intentional_variant" | "false_positive";
export type ChapterFreezeAction = "freeze" | "unfreeze" | "reopen";

export interface IntelligenceQuestionSnapshot {
  id: string;
  publicCode: string;
  status: string;
  versionId: string;
  stem: string;
  explanation: string;
  questionType: string;
  difficulty: string;
  options: Array<{ text: string; isCorrect?: boolean }>;
  updatedAt: string;
  testUsageCount: number;
}

export interface DuplicateDecisionRecord {
  decision: DuplicateDecision;
  canonicalQuestionId: string | null;
  reason: string | null;
  decidedAt: string | null;
  decidedByName: string | null;
}

export interface DuplicateCandidate {
  pairKey: string;
  left: IntelligenceQuestionSnapshot;
  right: IntelligenceQuestionSnapshot;
  kind: DuplicateMatchKind;
  severity: "critical" | "warning";
  score: number;
  signals: string[];
  decision: DuplicateDecisionRecord;
}

export interface ChapterReadinessInput {
  questionCount: number;
  approvedQuestionCount: number;
  targetCoverage: number | null;
  unresolvedPlaceholderCount: number;
  unresolvedCriticalDuplicateCount: number;
  unresolvedWarningDuplicateCount: number;
  openCommentCount: number;
  testUsageCount: number;
  scanTruncated: boolean;
}

export interface ChapterReadiness {
  ready: boolean;
  blockers: Array<{ code: string; message: string; count?: number }>;
  warnings: Array<{ code: string; message: string; count?: number }>;
}

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "if", "in",
  "is", "it", "of", "on", "or", "that", "the", "then", "to", "was", "were", "what", "which",
  "with", "find", "calculate", "determine", "given", "following", "respectively",
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function assertUuid(value: unknown, field: string): string {
  const text = asText(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) {
    throw new ContentReviewError("INVALID_CONTENT_INTELLIGENCE_ID", `${field} is invalid.`);
  }
  return text;
}

export function normalizeQuestionText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en")
    .replace(/<[^>]*>/g, " ")
    .replace(/[“”‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/[^\p{L}\p{N}%₹$+\-*/=<>.' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeQuestionTemplate(value: string): string {
  return normalizeQuestionText(value)
    .replace(/(?:₹|rs\.?|inr|\$)\s*\d+(?:[,.]\d+)*(?:\.\d+)?/gi, " {money} ")
    .replace(/\b\d+(?:[,.]\d+)*(?:\.\d+)?\s*%/g, " {percent} ")
    .replace(/\b\d+(?:[,.]\d+)*(?:\.\d+)?\b/g, " {number} ")
    .replace(/\b[a-z]\b/g, " {variable} ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalizeQuestionText(value)
    .split(/\s+/)
    .map((token) => token.replace(/^['.-]+|['.-]+$/g, ""))
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function tokenBigrams(value: string): Set<string> {
  const list = tokens(value);
  const result = new Set<string>();
  for (let index = 0; index < list.length - 1; index += 1) {
    result.add(`${list[index]} ${list[index + 1]}`);
  }
  return result;
}

function setSimilarity(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

export function lexicalSemanticSimilarity(left: string, right: string): number {
  const leftTokens = new Set(tokens(left));
  const rightTokens = new Set(tokens(right));
  const unigram = setSimilarity(leftTokens, rightTokens);
  const bigram = setSimilarity(tokenBigrams(left), tokenBigrams(right));
  return Number((unigram * 0.7 + bigram * 0.3).toFixed(4));
}

export function duplicatePairKey(leftQuestionId: string, rightQuestionId: string): string {
  return [leftQuestionId, rightQuestionId].sort().join(":");
}

function defaultDecision(): DuplicateDecisionRecord {
  return {
    decision: "unresolved",
    canonicalQuestionId: null,
    reason: null,
    decidedAt: null,
    decidedByName: null,
  };
}

export function findDuplicateCandidates(
  questions: IntelligenceQuestionSnapshot[],
  decisions: ReadonlyMap<string, DuplicateDecisionRecord> = new Map(),
): DuplicateCandidate[] {
  const candidates: DuplicateCandidate[] = [];
  const normalized = questions.map((question) => ({
    question,
    exact: normalizeQuestionText(question.stem),
    template: normalizeQuestionTemplate(question.stem),
  }));

  for (let leftIndex = 0; leftIndex < normalized.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < normalized.length; rightIndex += 1) {
      const left = normalized[leftIndex];
      const right = normalized[rightIndex];
      if (!left.exact || !right.exact) continue;
      if (left.question.questionType && right.question.questionType && left.question.questionType !== right.question.questionType) continue;

      const pairKey = duplicatePairKey(left.question.id, right.question.id);
      const signals: string[] = [];
      let kind: DuplicateMatchKind | null = null;
      let severity: "critical" | "warning" = "warning";
      let score = 0;

      if (left.exact.length >= 20 && left.exact === right.exact) {
        kind = "exact";
        severity = "critical";
        score = 1;
        signals.push("Identical normalized stems");
      } else if (left.template.length >= 20 && left.template === right.template) {
        kind = "template";
        severity = "critical";
        score = 0.97;
        signals.push("Same stem after number and variable normalization");
      } else {
        const lengthRatio = Math.min(left.exact.length, right.exact.length) / Math.max(left.exact.length, right.exact.length);
        const semanticScore = lexicalSemanticSimilarity(left.question.stem, right.question.stem);
        if (lengthRatio >= 0.62 && semanticScore >= 0.78) {
          kind = "semantic";
          severity = semanticScore >= 0.9 ? "critical" : "warning";
          score = semanticScore;
          signals.push("High weighted token and phrase overlap");
          if (lengthRatio >= 0.9) signals.push("Closely matched stem length");
        }
      }

      if (!kind) continue;
      const explanationScore = lexicalSemanticSimilarity(left.question.explanation, right.question.explanation);
      if (explanationScore >= 0.8) signals.push("Explanations are also highly similar");
      const leftCorrect = left.question.options.find((option) => option.isCorrect)?.text;
      const rightCorrect = right.question.options.find((option) => option.isCorrect)?.text;
      if (leftCorrect && rightCorrect && normalizeQuestionText(leftCorrect) === normalizeQuestionText(rightCorrect)) {
        signals.push("Correct answers match");
      }

      candidates.push({
        pairKey,
        left: left.question,
        right: right.question,
        kind,
        severity,
        score,
        signals,
        decision: decisions.get(pairKey) ?? defaultDecision(),
      });
    }
  }

  return candidates.sort((left, right) => {
    const severity = Number(right.severity === "critical") - Number(left.severity === "critical");
    return severity || right.score - left.score || left.pairKey.localeCompare(right.pairKey);
  });
}

export function hasUnresolvedPlaceholder(value: string): boolean {
  return /\{\{[^{}]+\}\}|\$\{[^{}]+\}|\[\[[^\[\]]+\]\]|<\s*(?:placeholder|token|variable)[^>]*>|__+[A-Z0-9_]{2,}__+/i.test(value);
}

export function computeChapterReadiness(input: ChapterReadinessInput): ChapterReadiness {
  const blockers: ChapterReadiness["blockers"] = [];
  const warnings: ChapterReadiness["warnings"] = [];
  const pendingReviewCount = Math.max(0, input.questionCount - input.approvedQuestionCount);

  if (input.questionCount === 0) {
    blockers.push({ code: "NO_QUESTIONS", message: "The chapter has no canonical questions." });
  }
  if (input.targetCoverage !== null && input.questionCount < input.targetCoverage) {
    blockers.push({
      code: "COVERAGE_SHORTFALL",
      message: `Coverage is ${input.questionCount}/${input.targetCoverage}.`,
      count: input.targetCoverage - input.questionCount,
    });
  }
  if (pendingReviewCount > 0) {
    blockers.push({
      code: "QUESTIONS_NOT_APPROVED",
      message: `${pendingReviewCount} question${pendingReviewCount === 1 ? " is" : "s are"} not approved or published.`,
      count: pendingReviewCount,
    });
  }
  if (input.unresolvedPlaceholderCount > 0) {
    blockers.push({
      code: "UNRESOLVED_PLACEHOLDERS",
      message: `${input.unresolvedPlaceholderCount} question${input.unresolvedPlaceholderCount === 1 ? " contains" : "s contain"} unresolved placeholders.`,
      count: input.unresolvedPlaceholderCount,
    });
  }
  if (input.unresolvedCriticalDuplicateCount > 0) {
    blockers.push({
      code: "CRITICAL_DUPLICATES",
      message: `${input.unresolvedCriticalDuplicateCount} critical duplicate candidate${input.unresolvedCriticalDuplicateCount === 1 ? " is" : "s are"} unresolved.`,
      count: input.unresolvedCriticalDuplicateCount,
    });
  }
  if (input.openCommentCount > 0) {
    blockers.push({
      code: "OPEN_REVIEW_COMMENTS",
      message: `${input.openCommentCount} Content Review comment${input.openCommentCount === 1 ? " remains" : "s remain"} open.`,
      count: input.openCommentCount,
    });
  }
  if (input.scanTruncated) {
    blockers.push({
      code: "DUPLICATE_SCAN_TRUNCATED",
      message: "The duplicate scan reached its safety limit; narrow or split the chapter before freezing.",
    });
  }
  if (input.targetCoverage === null) {
    warnings.push({ code: "COVERAGE_TARGET_MISSING", message: "No canonical target coverage is configured for this chapter." });
  }
  if (input.unresolvedWarningDuplicateCount > 0) {
    warnings.push({
      code: "NEAR_DUPLICATES",
      message: `${input.unresolvedWarningDuplicateCount} near-duplicate candidate${input.unresolvedWarningDuplicateCount === 1 ? " needs" : "s need"} editorial review.`,
      count: input.unresolvedWarningDuplicateCount,
    });
  }
  if (input.testUsageCount === 0 && input.questionCount > 0) {
    warnings.push({ code: "NO_TEST_USAGE", message: "No current question version in this chapter is used by a test draft or publication." });
  }

  return { ready: blockers.length === 0, blockers, warnings };
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonicalize(entry)]),
  );
}

export function contentIntelligenceReportHash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}

export function normalizeDuplicateDecisionInput(value: unknown): {
  chapterNodeId: string;
  leftQuestionId: string;
  rightQuestionId: string;
  decision: Exclude<DuplicateDecision, "unresolved">;
  canonicalQuestionId: string | null;
  reason: string;
} {
  const record = asRecord(value);
  const decision = asText(record.decision) as DuplicateDecision;
  if (!(["duplicate", "intentional_variant", "false_positive"] as DuplicateDecision[]).includes(decision)) {
    throw new ContentReviewError("INVALID_DUPLICATE_DECISION", "Choose duplicate, intentional variant or false positive.");
  }
  const chapterNodeId = assertUuid(record.chapterNodeId, "chapterNodeId");
  const leftQuestionId = assertUuid(record.leftQuestionId, "leftQuestionId");
  const rightQuestionId = assertUuid(record.rightQuestionId, "rightQuestionId");
  if (leftQuestionId === rightQuestionId) {
    throw new ContentReviewError("INVALID_DUPLICATE_PAIR", "Duplicate comparison requires two different questions.");
  }
  const canonicalQuestionId = record.canonicalQuestionId == null || record.canonicalQuestionId === ""
    ? null
    : assertUuid(record.canonicalQuestionId, "canonicalQuestionId");
  if (decision === "duplicate" && !canonicalQuestionId) {
    throw new ContentReviewError("CANONICAL_QUESTION_REQUIRED", "Select the canonical question for a confirmed duplicate.");
  }
  if (canonicalQuestionId && ![leftQuestionId, rightQuestionId].includes(canonicalQuestionId)) {
    throw new ContentReviewError("INVALID_CANONICAL_QUESTION", "The canonical question must belong to the compared pair.");
  }
  const reason = asText(record.reason);
  if (reason.length < 4 || reason.length > 1000) {
    throw new ContentReviewError("DUPLICATE_REASON_REQUIRED", "A decision reason of 4–1000 characters is required.");
  }
  return { chapterNodeId, leftQuestionId, rightQuestionId, decision, canonicalQuestionId, reason };
}

export function normalizeChapterFreezeInput(value: unknown): { action: ChapterFreezeAction; reason: string } {
  const record = asRecord(value);
  const action = asText(record.action) as ChapterFreezeAction;
  if (!(["freeze", "unfreeze", "reopen"] as ChapterFreezeAction[]).includes(action)) {
    throw new ContentReviewError("INVALID_CHAPTER_FREEZE_ACTION", "Choose freeze, unfreeze or reopen.");
  }
  const reason = asText(record.reason);
  if (reason.length < 4 || reason.length > 1000) {
    throw new ContentReviewError("CHAPTER_FREEZE_REASON_REQUIRED", "An audit reason of 4–1000 characters is required.");
  }
  return { action, reason };
}
