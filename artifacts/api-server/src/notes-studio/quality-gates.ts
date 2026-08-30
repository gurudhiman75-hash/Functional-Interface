import { createHash } from 'node:crypto';

export const NOTES_QUALITY_POLICY_VERSION = 'notes-quality-v1';

export type QualityStatus = 'pass' | 'warning' | 'fail';

export type QualityClaimInput = {
  id: string;
  text: string;
  state: string;
  coverageLinked: boolean;
  activeSupportCount: number;
  supportEvidence: Array<{
    sourceId: string;
    excerpt: string;
    excerptHash: string;
  }>;
};

export type QualitySiblingSection = {
  id: string;
  markdown: string;
};

export type NotesSectionQualityInput = {
  sectionId: string;
  markdown: string;
  coveragePriority: string;
  plannedDepth: string;
  claims: QualityClaimInput[];
  activeConflictCount: number;
  siblingSections: QualitySiblingSection[];
};

export type QualityCheck = {
  code: string;
  label: string;
  status: QualityStatus;
  blocking: boolean;
  summary: string;
  metrics: Record<string, number | string | boolean | null>;
};

export type NotesSectionQualityEvaluation = {
  policyVersion: string;
  passed: boolean;
  warningCount: number;
  failCount: number;
  checks: QualityCheck[];
};

const WORD_RE = /[\p{L}\p{N}]+/gu;

function words(value: string): string[] {
  return (value.normalize('NFKC').toLowerCase().match(WORD_RE) ?? []).filter(Boolean);
}

function normalizedParagraphs(markdown: string): string[] {
  return markdown
    .split(/\n\s*\n/g)
    .map((paragraph) => words(paragraph).join(' '))
    .filter((paragraph) => paragraph.length >= 40);
}

function shingles(tokens: string[], width: number): Set<string> {
  const result = new Set<string>();
  if (tokens.length < width) return result;
  for (let index = 0; index <= tokens.length - width; index += 1) {
    result.add(tokens.slice(index, index + width).join(' '));
  }
  return result;
}

function jaccard(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const value of left) if (right.has(value)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function longestSharedRun(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) return 0;
  const previous = new Array<number>(right.length + 1).fill(0);
  let best = 0;
  for (let i = 1; i <= left.length; i += 1) {
    const current = new Array<number>(right.length + 1).fill(0);
    for (let j = 1; j <= right.length; j += 1) {
      if (left[i - 1] === right[j - 1]) {
        current[j] = previous[j - 1] + 1;
        if (current[j] > best) best = current[j];
      }
    }
    for (let j = 0; j < current.length; j += 1) previous[j] = current[j];
  }
  return best;
}

function groundingCheck(input: NotesSectionQualityInput): QualityCheck {
  const unaccepted = input.claims.filter((claim) => claim.state !== 'accepted').length;
  const unlinked = input.claims.filter((claim) => !claim.coverageLinked).length;
  const unsupported = input.claims.filter((claim) => claim.activeSupportCount < 1).length;
  const failed = input.claims.length === 0 || unaccepted > 0 || unlinked > 0 || unsupported > 0;
  return {
    code: 'evidence_support',
    label: 'Evidence support',
    status: failed ? 'fail' : 'pass',
    blocking: true,
    summary: failed
      ? 'Every section claim must still be accepted, mapped to this coverage target, and backed by active supporting evidence.'
      : 'All section claims remain accepted, coverage-linked, and actively supported.',
    metrics: { claimCount: input.claims.length, unaccepted, unlinked, unsupported },
  };
}

function contradictionCheck(input: NotesSectionQualityInput): QualityCheck {
  const failed = input.activeConflictCount > 0;
  return {
    code: 'contradiction_state',
    label: 'Contradiction state',
    status: failed ? 'fail' : 'pass',
    blocking: true,
    summary: failed ? 'Active evidence conflicts must be resolved before review.' : 'No active evidence conflicts are blocking this job.',
    metrics: { activeConflictCount: input.activeConflictCount },
  };
}

function sourceOverlapCheck(input: NotesSectionQualityInput): QualityCheck {
  const sectionTokens = words(input.markdown);
  const sectionShingles = shingles(sectionTokens, 8);
  let maxShingleSimilarity = 0;
  let longestRun = 0;
  let evidenceCount = 0;
  for (const claim of input.claims) {
    for (const evidence of claim.supportEvidence) {
      const evidenceTokens = words(evidence.excerpt);
      evidenceCount += 1;
      maxShingleSimilarity = Math.max(maxShingleSimilarity, jaccard(sectionShingles, shingles(evidenceTokens, 8)));
      longestRun = Math.max(longestRun, longestSharedRun(sectionTokens, evidenceTokens));
    }
  }
  const failed = maxShingleSimilarity > 0.3 || longestRun >= 24;
  const warning = !failed && (maxShingleSimilarity > 0.18 || longestRun >= 14);
  return {
    code: 'source_overlap',
    label: 'Originality / source overlap',
    status: failed ? 'fail' : warning ? 'warning' : 'pass',
    blocking: true,
    summary: failed
      ? 'The section is too close to a supporting source excerpt and needs original rewriting.'
      : warning
        ? 'The section contains a notable exact overlap with supporting evidence; review wording before approval.'
        : 'No excessive source-text overlap detected in the bounded supporting evidence.',
    metrics: {
      evidenceCount,
      maxEightWordShingleSimilarity: Number(maxShingleSimilarity.toFixed(4)),
      longestExactWordRun: longestRun,
    },
  };
}

function duplicationCheck(input: NotesSectionQualityInput): QualityCheck {
  const paragraphs = normalizedParagraphs(input.markdown);
  const seen = new Set<string>();
  let repeatedParagraphs = 0;
  for (const paragraph of paragraphs) {
    if (seen.has(paragraph)) repeatedParagraphs += 1;
    seen.add(paragraph);
  }
  const currentShingles = shingles(words(input.markdown), 5);
  let maxSiblingSimilarity = 0;
  for (const sibling of input.siblingSections) {
    maxSiblingSimilarity = Math.max(maxSiblingSimilarity, jaccard(currentShingles, shingles(words(sibling.markdown), 5)));
  }
  const failed = repeatedParagraphs > 0 || maxSiblingSimilarity > 0.82;
  const warning = !failed && maxSiblingSimilarity > 0.65;
  return {
    code: 'duplication',
    label: 'Duplication',
    status: failed ? 'fail' : warning ? 'warning' : 'pass',
    blocking: true,
    summary: failed
      ? 'Repeated or near-duplicate note content must be consolidated.'
      : warning
        ? 'This section is unusually similar to another section and should be checked for redundancy.'
        : 'No severe within-section or cross-section duplication detected.',
    metrics: { repeatedParagraphs, maxSiblingSimilarity: Number(maxSiblingSimilarity.toFixed(4)) },
  };
}

function readabilityCheck(input: NotesSectionQualityInput): QualityCheck {
  const tokenCount = words(input.markdown).length;
  const paragraphWordCounts = input.markdown
    .split(/\n\s*\n/g)
    .map((paragraph) => words(paragraph).length)
    .filter((count) => count > 0);
  const sentenceWordCounts = input.markdown
    .split(/[.!?。！？]+/g)
    .map((sentence) => words(sentence).length)
    .filter((count) => count > 0);
  const maxParagraphWords = paragraphWordCounts.length ? Math.max(...paragraphWordCounts) : 0;
  const maxSentenceWords = sentenceWordCounts.length ? Math.max(...sentenceWordCounts) : 0;
  const averageSentenceWords = sentenceWordCounts.length
    ? sentenceWordCounts.reduce((sum, count) => sum + count, 0) / sentenceWordCounts.length
    : tokenCount;
  const failed = maxParagraphWords > 220 || maxSentenceWords > 120;
  const warning = !failed && (maxParagraphWords > 140 || maxSentenceWords > 70 || averageSentenceWords > 38);
  return {
    code: 'readability',
    label: 'Readability',
    status: failed ? 'fail' : warning ? 'warning' : 'pass',
    blocking: true,
    summary: failed
      ? 'The section contains extremely dense prose that must be broken into exam-readable units.'
      : warning
        ? 'Some prose is dense; consider shorter sentences, bullets, or tables.'
        : 'Section density is within the deterministic readability guardrails.',
    metrics: {
      wordCount: tokenCount,
      maxParagraphWords,
      maxSentenceWords,
      averageSentenceWords: Number(averageSentenceWords.toFixed(1)),
    },
  };
}

function formattingCheck(input: NotesSectionQualityInput): QualityCheck {
  const markdown = input.markdown.trim();
  const unsafeMarkup = /<\s*(script|iframe|object|embed)\b|javascript\s*:/i.test(markdown);
  const overdeepHeading = /^#{5,}\s+/m.test(markdown);
  const excessiveBlankLines = /\n{6,}/.test(markdown);
  const failed = markdown.length === 0 || unsafeMarkup || overdeepHeading;
  const warning = !failed && excessiveBlankLines;
  return {
    code: 'formatting',
    label: 'Formatting',
    status: failed ? 'fail' : warning ? 'warning' : 'pass',
    blocking: true,
    summary: failed
      ? 'Unsafe markup, over-deep headings, or empty Markdown must be fixed.'
      : warning
        ? 'Formatting contains unusually large blank gaps.'
        : 'Markdown passes the structural formatting guardrails.',
    metrics: { empty: markdown.length === 0, unsafeMarkup, overdeepHeading, excessiveBlankLines },
  };
}

function depthCheck(input: NotesSectionQualityInput): QualityCheck {
  const count = words(input.markdown).length;
  const minimum = input.plannedDepth === 'deep' ? 120 : input.plannedDepth === 'brief' ? 35 : 70;
  const short = count < minimum;
  return {
    code: 'planned_depth',
    label: 'Planned depth',
    status: short ? 'warning' : 'pass',
    blocking: false,
    summary: short
      ? `This ${input.plannedDepth || 'standard'} section is shorter than the planning heuristic; confirm it is sufficiently complete.`
      : 'Section length is consistent with the planned depth heuristic.',
    metrics: { wordCount: count, heuristicMinimumWords: minimum, coveragePriority: input.coveragePriority },
  };
}

export function evaluateNotesSectionQuality(input: NotesSectionQualityInput): NotesSectionQualityEvaluation {
  const checks = [
    groundingCheck(input),
    contradictionCheck(input),
    sourceOverlapCheck(input),
    duplicationCheck(input),
    readabilityCheck(input),
    formattingCheck(input),
    depthCheck(input),
  ];
  const failCount = checks.filter((check) => check.status === 'fail').length;
  const warningCount = checks.filter((check) => check.status === 'warning').length;
  return {
    policyVersion: NOTES_QUALITY_POLICY_VERSION,
    passed: !checks.some((check) => check.blocking && check.status === 'fail'),
    warningCount,
    failCount,
    checks,
  };
}

export function notesQualityEvidenceFingerprint(input: NotesSectionQualityInput): string {
  const payload = {
    activeConflictCount: input.activeConflictCount,
    claims: [...input.claims]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((claim) => ({
        id: claim.id,
        state: claim.state,
        coverageLinked: claim.coverageLinked,
        supports: [...claim.supportEvidence]
          .sort((a, b) => `${a.sourceId}:${a.excerptHash}`.localeCompare(`${b.sourceId}:${b.excerptHash}`))
          .map((evidence) => ({ sourceId: evidence.sourceId, excerptHash: evidence.excerptHash })),
      })),
  };
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}
