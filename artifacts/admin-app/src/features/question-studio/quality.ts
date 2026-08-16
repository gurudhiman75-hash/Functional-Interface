import type { QuestionStudioItem, QuestionStudioRun } from './api';

export type QualitySeverity = 'blocker' | 'warning';

export interface QualityIssue {
  code: string;
  severity: QualitySeverity;
  field: 'stem' | 'options' | 'answer' | 'explanation' | 'payload' | 'duplicate';
  message: string;
}

export interface ItemQualityReport {
  score: number;
  readyForApproval: boolean;
  blockerCount: number;
  warningCount: number;
  issues: QualityIssue[];
}

export interface DuplicateMatch {
  itemId: string;
  matchedItemId: string;
  matchedRunCode: string;
  similarity: number;
  exact: boolean;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((entry) => String(entry ?? '').trim())
    : [];
}

export function itemStem(payload: Record<string, unknown> | null): string {
  return asText(payload?.text) || asText(payload?.stem);
}

export function itemExplanation(payload: Record<string, unknown> | null): string {
  return asText(payload?.explanation);
}

export function itemOptionValues(payload: Record<string, unknown> | null): string[] {
  return stringArray(payload?.options);
}

export function itemStimulusSvgs(payload: Record<string, unknown> | null): string[] {
  return stringArray(payload?.stimulusSvgs).filter(Boolean);
}

export function itemOptionSvgs(payload: Record<string, unknown> | null): string[] {
  return stringArray(payload?.optionSvgs).filter(Boolean);
}

export function itemCorrectIndex(payload: Record<string, unknown> | null): number {
  const raw = Number(payload?.correctIndex ?? payload?.correct);
  return Number.isInteger(raw) ? raw : -1;
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\u0900-\u097f\u0a00-\u0a7f]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function containsUnresolvedPlaceholder(value: string): boolean {
  return /{{[^}]*}}|__+[A-Z0-9_]+__+|\[[A-Z][A-Z0-9_ -]{2,}\]/.test(value);
}

function isSpatialPayload(payload: Record<string, unknown>): boolean {
  return asText(payload.packageId).toUpperCase() === 'SPA-001' || itemOptionSvgs(payload).length > 0;
}

export function analyzeItemQuality(payloadValue: unknown): ItemQualityReport {
  const payload = asRecord(payloadValue);
  const stem = itemStem(payload);
  const explanation = itemExplanation(payload);
  const options = itemOptionValues(payload);
  const spatialOptions = itemOptionSvgs(payload);
  const effectiveOptions = spatialOptions.length > 0 ? spatialOptions : options;
  const correctIndex = itemCorrectIndex(payload);
  const issues: QualityIssue[] = [];

  const add = (
    code: string,
    severity: QualitySeverity,
    field: QualityIssue['field'],
    message: string,
  ) => issues.push({ code, severity, field, message });

  if (!stem) add('STEM_MISSING', 'blocker', 'stem', 'Question stem is missing.');
  else {
    if (stem.length < 20) add('STEM_TOO_SHORT', 'warning', 'stem', 'Question stem is unusually short.');
    if (containsUnresolvedPlaceholder(stem)) add('STEM_PLACEHOLDER', 'blocker', 'stem', 'Question stem contains an unresolved placeholder.');
  }

  if (isSpatialPayload(payload) && spatialOptions.length !== 4) {
    add('SPATIAL_OPTIONS_MISSING', 'blocker', 'options', 'Spatial questions require four rendered SVG options.');
  }

  if (effectiveOptions.length < 2) add('OPTIONS_MISSING', 'blocker', 'options', 'At least two answer options are required.');
  else {
    if (effectiveOptions.some((option) => !option)) add('OPTION_EMPTY', 'blocker', 'options', 'One or more answer options are empty.');
    const normalizedOptions = spatialOptions.length > 0
      ? effectiveOptions
      : effectiveOptions.filter(Boolean).map(normalized);
    if (new Set(normalizedOptions).size !== normalizedOptions.length) add('OPTION_DUPLICATE', 'blocker', 'options', 'Two or more answer options are duplicates.');
    if (spatialOptions.length === 0 && effectiveOptions.some(containsUnresolvedPlaceholder)) add('OPTION_PLACEHOLDER', 'blocker', 'options', 'An answer option contains an unresolved placeholder.');
    if (spatialOptions.some((svg) => !svg.includes('<svg') || !svg.includes('</svg>'))) {
      add('SPATIAL_SVG_INVALID', 'blocker', 'options', 'One or more Spatial options are not valid SVG figures.');
    }
  }

  if (correctIndex < 0 || correctIndex >= effectiveOptions.length) add('CORRECT_INDEX_INVALID', 'blocker', 'answer', 'Correct answer does not point to a valid option.');

  if (!explanation) add('EXPLANATION_MISSING', 'blocker', 'explanation', 'A question-specific explanation is required.');
  else {
    if (explanation.length < 24) add('EXPLANATION_TOO_SHORT', 'warning', 'explanation', 'Explanation is very short.');
    if (containsUnresolvedPlaceholder(explanation)) add('EXPLANATION_PLACEHOLDER', 'blocker', 'explanation', 'Explanation contains an unresolved placeholder.');
  }

  const blockerCount = issues.filter((issue) => issue.severity === 'blocker').length;
  const warningCount = issues.length - blockerCount;
  return {
    score: Math.max(0, 100 - blockerCount * 30 - warningCount * 8),
    readyForApproval: blockerCount === 0,
    blockerCount,
    warningCount,
    issues,
  };
}

function tokenSet(value: string): Set<string> {
  return new Set(normalized(value).split(' ').filter((token) => token.length > 1));
}

function jaccard(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function findDuplicateMatches(runs: QuestionStudioRun[]): Map<string, DuplicateMatch> {
  const entries = runs.flatMap((run) => run.items.map((item) => ({
    item,
    runCode: run.publicCode,
    stem: itemStem(item.payload),
    visualFingerprint: asText(item.payload?.contentFingerprint),
  }))).filter((entry) => entry.stem);
  const result = new Map<string, DuplicateMatch>();

  for (let leftIndex = 0; leftIndex < entries.length; leftIndex += 1) {
    const left = entries[leftIndex]!;
    const leftNormalized = normalized(left.stem);
    const leftTokens = tokenSet(left.stem);
    for (let rightIndex = leftIndex + 1; rightIndex < entries.length; rightIndex += 1) {
      const right = entries[rightIndex]!;
      if (
        left.visualFingerprint &&
        right.visualFingerprint &&
        left.visualFingerprint !== right.visualFingerprint
      ) {
        continue;
      }
      const rightNormalized = normalized(right.stem);
      const exact = leftNormalized === rightNormalized &&
        (!left.visualFingerprint || !right.visualFingerprint || left.visualFingerprint === right.visualFingerprint);
      const similarity = exact ? 1 : jaccard(leftTokens, tokenSet(right.stem));
      if (!exact && (leftTokens.size < 7 || similarity < 0.86)) continue;

      const leftMatch: DuplicateMatch = {
        itemId: left.item.id,
        matchedItemId: right.item.id,
        matchedRunCode: right.runCode,
        similarity,
        exact,
      };
      const rightMatch: DuplicateMatch = {
        itemId: right.item.id,
        matchedItemId: left.item.id,
        matchedRunCode: left.runCode,
        similarity,
        exact,
      };
      if (!result.has(left.item.id) || (result.get(left.item.id)?.similarity ?? 0) < similarity) result.set(left.item.id, leftMatch);
      if (!result.has(right.item.id) || (result.get(right.item.id)?.similarity ?? 0) < similarity) result.set(right.item.id, rightMatch);
    }
  }

  return result;
}

export function qualityWithDuplicate(
  item: QuestionStudioItem,
  duplicate?: DuplicateMatch,
): ItemQualityReport {
  const report = analyzeItemQuality(item.payload);
  if (!duplicate) return report;
  const duplicateIssue: QualityIssue = {
    code: duplicate.exact ? 'EXACT_DUPLICATE' : 'NEAR_DUPLICATE',
    severity: duplicate.exact ? 'blocker' : 'warning',
    field: 'duplicate',
    message: `${duplicate.exact ? 'Exact' : 'Near'} duplicate of an item in ${duplicate.matchedRunCode} (${Math.round(duplicate.similarity * 100)}% similarity).`,
  };
  const issues = [...report.issues, duplicateIssue];
  const blockerCount = issues.filter((issue) => issue.severity === 'blocker').length;
  const warningCount = issues.length - blockerCount;
  return {
    issues,
    blockerCount,
    warningCount,
    readyForApproval: blockerCount === 0,
    score: Math.max(0, 100 - blockerCount * 30 - warningCount * 8),
  };
}
