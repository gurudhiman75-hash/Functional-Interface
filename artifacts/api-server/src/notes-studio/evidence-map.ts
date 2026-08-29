import { createHash } from 'node:crypto';

export type EvidenceClaimType = 'definition' | 'provision' | 'statistic' | 'date_fact' | 'fact';

export type EvidenceCandidate = {
  normalizedKey: string;
  normalizedText: string;
  claimText: string;
  claimType: EvidenceClaimType;
  confidence: number;
  excerpt: string;
  excerptHash: string;
  location: {
    paragraphIndex: number;
    sentenceIndex: number;
    charStart: number;
    charEnd: number;
  };
};

export type CoverageTargetSeed = {
  targetKey: string;
  label: string;
  sourceKind: 'topic' | 'syllabus_emphasis';
  required: boolean;
  position: number;
};

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'being', 'by', 'for', 'from', 'has', 'have',
  'in', 'into', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'their', 'this', 'to', 'was',
  'were', 'which', 'with', 'under', 'about', 'including', 'include', 'includes', 'through', 'than',
]);

const MONTH_PATTERN = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
const PROVISION_PATTERN = /\b(?:article|section|schedule|part|act|rule|regulation|amendment)\s+(?:[ivxlcdm]+|\d+[a-z]?)\b/i;
const STATISTIC_PATTERN = /(?:₹|\brs\.?\s*)?\b\d[\d,.]*(?:\.\d+)?\s*(?:%|percent|crore|lakh|million|billion|trillion|km|kg|mw|gw|years?|days?|members?|seats?)\b/i;
const DATE_PATTERN = /\b(?:18|19|20|21)\d{2}\b/;
const DEFINITION_PATTERN = /\b(?:is defined as|are defined as|means|refers to|is known as|are known as|is a|is an|are a|are an)\b/i;
const BOILERPLATE_PATTERN = /\b(?:click here|read more|subscribe|privacy policy|terms of use|all rights reserved|sign in|log in|cookie policy)\b/i;

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function collapseSpaces(value: string): string {
  return value.replace(/[\s\u00a0]+/g, ' ').trim();
}

export function normalizeEvidenceText(value: string): string {
  return collapseSpaces(
    value
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[“”„‟]/g, '"')
      .replace(/[‘’‚‛]/g, "'")
      .replace(/[–—−]/g, '-')
      .replace(/[^\p{L}\p{N}%₹$€£.+\-/ ]+/gu, ' '),
  );
}

export function evidenceClaimKey(value: string): string {
  return sha256(normalizeEvidenceText(value));
}

function classifyClaim(value: string): { claimType: EvidenceClaimType; confidence: number } {
  if (PROVISION_PATTERN.test(value)) return { claimType: 'provision', confidence: 0.76 };
  if (STATISTIC_PATTERN.test(value)) return { claimType: 'statistic', confidence: 0.74 };
  if (MONTH_PATTERN.test(value) || DATE_PATTERN.test(value)) return { claimType: 'date_fact', confidence: 0.68 };
  if (DEFINITION_PATTERN.test(value)) return { claimType: 'definition', confidence: 0.66 };
  return { claimType: 'fact', confidence: 0.56 };
}

function sentencePieces(paragraph: string): Array<{ text: string; start: number; end: number }> {
  const pieces: Array<{ text: string; start: number; end: number }> = [];
  const pattern = /[^.!?\n]+(?:[.!?]+(?=\s|$)|$)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(paragraph)) !== null) {
    const raw = match[0];
    const leading = raw.search(/\S/);
    if (leading < 0) continue;
    const text = collapseSpaces(raw);
    if (!text) continue;
    const start = match.index + leading;
    pieces.push({ text, start, end: start + text.length });
  }
  return pieces;
}

function isCandidateSentence(value: string): boolean {
  const words = value.split(/\s+/).filter(Boolean);
  if (value.length < 40 || value.length > 520) return false;
  if (words.length < 7 || words.length > 90) return false;
  if (BOILERPLATE_PATTERN.test(value)) return false;
  if (/^(?:home|menu|contents|introduction|references|bibliography)\s*[:.-]?$/i.test(value)) return false;
  const letterCount = (value.match(/\p{L}/gu) ?? []).length;
  return letterCount >= 20;
}

export function extractEvidenceCandidates(text: string, maxClaims = 600): EvidenceCandidate[] {
  const normalizedSource = text.normalize('NFC').replace(/\r\n?/g, '\n');
  const paragraphs = normalizedSource.split(/\n{2,}|\n(?=\s*[-•▪◦])/g);
  const candidates: EvidenceCandidate[] = [];
  const seen = new Set<string>();
  let sourceOffset = 0;

  for (let paragraphIndex = 0; paragraphIndex < paragraphs.length && candidates.length < maxClaims; paragraphIndex += 1) {
    const paragraph = paragraphs[paragraphIndex];
    const paragraphStart = normalizedSource.indexOf(paragraph, sourceOffset);
    if (paragraphStart >= 0) sourceOffset = paragraphStart + paragraph.length;
    const pieces = sentencePieces(paragraph);

    for (let sentenceIndex = 0; sentenceIndex < pieces.length && candidates.length < maxClaims; sentenceIndex += 1) {
      const piece = pieces[sentenceIndex];
      if (!isCandidateSentence(piece.text)) continue;
      const normalizedText = normalizeEvidenceText(piece.text);
      if (normalizedText.length < 30) continue;
      const normalizedKey = sha256(normalizedText);
      if (seen.has(normalizedKey)) continue;
      seen.add(normalizedKey);
      const { claimType, confidence } = classifyClaim(piece.text);
      const excerpt = piece.text.slice(0, 600);
      candidates.push({
        normalizedKey,
        normalizedText,
        claimText: piece.text,
        claimType,
        confidence,
        excerpt,
        excerptHash: sha256(excerpt),
        location: {
          paragraphIndex,
          sentenceIndex,
          charStart: Math.max(0, (paragraphStart >= 0 ? paragraphStart : 0) + piece.start),
          charEnd: Math.max(0, (paragraphStart >= 0 ? paragraphStart : 0) + piece.end),
        },
      });
    }
  }

  return candidates;
}

function targetTokens(value: string): Set<string> {
  return new Set(
    normalizeEvidenceText(value)
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length >= 2 && !STOP_WORDS.has(token)),
  );
}

function targetKey(value: string): string {
  return sha256(normalizeEvidenceText(value));
}

function cleanTarget(value: string): string {
  return collapseSpaces(value.replace(/^[-•▪◦*\d.)\s]+/, '').replace(/[.;:,]+$/, ''));
}

export function coverageTargetsFromBrief(brief: {
  topicLabel?: string | null;
  syllabusEmphasis?: string | null;
}): CoverageTargetSeed[] {
  const seeds: CoverageTargetSeed[] = [];
  const seen = new Set<string>();
  const add = (raw: string, sourceKind: CoverageTargetSeed['sourceKind'], required: boolean) => {
    const label = cleanTarget(raw);
    if (label.length < 3 || label.length > 240) return;
    const key = targetKey(label);
    if (seen.has(key)) return;
    seen.add(key);
    seeds.push({ targetKey: key, label, sourceKind, required, position: seeds.length });
  };

  if (brief.topicLabel) add(brief.topicLabel, 'topic', true);
  const emphasis = String(brief.syllabusEmphasis ?? '').trim();
  if (emphasis) {
    const pieces = emphasis
      .split(/\n+|;|(?<=\.)\s+(?=[A-Z0-9])/)
      .flatMap((piece) => piece.split(/\s+[•▪◦]\s+/))
      .map(cleanTarget)
      .filter(Boolean)
      .slice(0, 24);
    for (const piece of pieces) add(piece, 'syllabus_emphasis', true);
  }
  return seeds;
}

export function coverageScore(claimText: string, targetLabel: string): number {
  const claimNormalized = normalizeEvidenceText(claimText);
  const targetNormalized = normalizeEvidenceText(targetLabel);
  if (!claimNormalized || !targetNormalized) return 0;
  if (claimNormalized.includes(targetNormalized)) return 0.95;

  const claim = targetTokens(claimText);
  const target = targetTokens(targetLabel);
  if (claim.size === 0 || target.size === 0) return 0;
  let shared = 0;
  for (const token of target) if (claim.has(token)) shared += 1;
  if (shared === 0) return 0;
  const union = new Set([...claim, ...target]).size;
  const recall = shared / target.size;
  const jaccard = shared / union;
  const score = recall * 0.78 + jaccard * 0.22;
  return Math.max(0, Math.min(1, Number(score.toFixed(4))));
}

export function shouldMapClaimToCoverage(claimText: string, targetLabel: string): { map: boolean; score: number } {
  const score = coverageScore(claimText, targetLabel);
  const target = targetTokens(targetLabel);
  const claim = targetTokens(claimText);
  let shared = 0;
  for (const token of target) if (claim.has(token)) shared += 1;
  const containsNumber = [...target].some((token) => /\d/.test(token));
  const numberMatch = !containsNumber || [...target].filter((token) => /\d/.test(token)).every((token) => claim.has(token));
  const minShared = target.size <= 2 ? 1 : 2;
  return { map: numberMatch && shared >= minShared && score >= 0.42, score };
}

export function evidenceRunInputHash(input: {
  jobId: string;
  brief: unknown;
  sources: Array<{ id: string; contentHash: string }>;
  extractorVersion: string;
}): string {
  const sources = [...input.sources]
    .map((source) => ({ id: source.id, contentHash: source.contentHash }))
    .sort((a, b) => `${a.id}:${a.contentHash}`.localeCompare(`${b.id}:${b.contentHash}`));
  return sha256(JSON.stringify({
    jobId: input.jobId,
    brief: input.brief,
    sources,
    extractorVersion: input.extractorVersion,
  }));
}
