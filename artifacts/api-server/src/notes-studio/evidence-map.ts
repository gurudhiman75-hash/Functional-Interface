import { createHash } from 'node:crypto';

export type NoteEvidenceBlockDraft = {
  blockIndex: number;
  excerpt: string;
  excerptHash: string;
  charStart: number;
  charEnd: number;
  locator: {
    blockIndex: number;
    charStart: number;
    charEnd: number;
  };
};

export type CoverageClaimState = 'candidate' | 'accepted' | 'rejected' | 'conflict';
export type CoverageStatus = 'uncovered' | 'partial' | 'covered' | 'blocked';
export type CoverageClaimReviewLink = {
  claimId: string;
  state: CoverageClaimState;
  hasActiveSupport: boolean;
};

const DEFAULT_MAX_BLOCK_CHARS = 900;
const DEFAULT_MAX_BLOCKS = 500;
const MIN_BLOCK_CHARS = 20;

export function normalizeEvidenceText(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function normalizedClaimText(value: string): string {
  return normalizeEvidenceText(value)
    .toLocaleLowerCase('en-US')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function noteClaimFingerprint(value: string): string {
  return createHash('sha256').update(normalizedClaimText(value)).digest('hex');
}

export function evidenceExcerptFingerprint(value: string): string {
  return createHash('sha256').update(normalizeEvidenceText(value)).digest('hex');
}

function sentenceChunks(paragraph: string, maxChars: number): string[] {
  if (paragraph.length <= maxChars) return [paragraph];
  const sentences = paragraph
    .split(/(?<=[.!?।॥])\s+(?=[\p{L}\p{N}(])/u)
    .map((part) => part.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };

  for (const sentence of sentences.length > 1 ? sentences : [paragraph]) {
    if (sentence.length > maxChars) {
      flush();
      for (let offset = 0; offset < sentence.length; offset += maxChars) {
        const slice = sentence.slice(offset, offset + maxChars).trim();
        if (slice) chunks.push(slice);
      }
      continue;
    }
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxChars) {
      flush();
      current = sentence;
    } else {
      current = candidate;
    }
  }
  flush();
  return chunks;
}

export function buildEvidenceBlocks(
  sourceText: string,
  options: { maxBlockChars?: number; maxBlocks?: number } = {},
): NoteEvidenceBlockDraft[] {
  const normalized = normalizeEvidenceText(sourceText);
  if (!normalized) return [];
  const maxBlockChars = Math.max(200, Math.min(1200, options.maxBlockChars ?? DEFAULT_MAX_BLOCK_CHARS));
  const maxBlocks = Math.max(1, Math.min(1000, options.maxBlocks ?? DEFAULT_MAX_BLOCKS));
  const paragraphs = normalized.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const blocks: NoteEvidenceBlockDraft[] = [];
  let cursor = 0;

  for (const paragraph of paragraphs) {
    if (blocks.length >= maxBlocks) break;
    const paragraphStart = normalized.indexOf(paragraph, cursor);
    const safeParagraphStart = paragraphStart >= 0 ? paragraphStart : cursor;
    let localCursor = 0;

    for (const chunk of sentenceChunks(paragraph, maxBlockChars)) {
      if (blocks.length >= maxBlocks) break;
      if (chunk.length < MIN_BLOCK_CHARS) continue;
      const localStart = paragraph.indexOf(chunk, localCursor);
      const safeLocalStart = localStart >= 0 ? localStart : localCursor;
      const charStart = safeParagraphStart + safeLocalStart;
      const charEnd = charStart + chunk.length;
      const blockIndex = blocks.length;
      blocks.push({
        blockIndex,
        excerpt: chunk,
        excerptHash: evidenceExcerptFingerprint(chunk),
        charStart,
        charEnd,
        locator: { blockIndex, charStart, charEnd },
      });
      localCursor = safeLocalStart + chunk.length;
    }
    cursor = safeParagraphStart + paragraph.length;
  }

  return blocks;
}

export function coverageStatusFromClaimStates(states: CoverageClaimState[]): CoverageStatus {
  if (states.includes('conflict')) return 'blocked';
  if (states.includes('accepted')) return 'covered';
  if (states.includes('candidate')) return 'partial';
  return 'uncovered';
}

/**
 * Coverage review is intentionally an editorial gate. Linking an accepted claim
 * proves that evidence exists, but it does not prove that the linked facts are
 * sufficient for the syllabus target. Only a current editor confirmation can
 * turn accepted evidence into `covered`.
 */
export function coverageStatusFromEditorialReview(
  states: CoverageClaimState[],
  editorConfirmed: boolean,
): CoverageStatus {
  if (states.includes('conflict')) return 'blocked';
  if (states.includes('accepted')) return editorConfirmed ? 'covered' : 'partial';
  if (states.includes('candidate')) return 'partial';
  return 'uncovered';
}

/**
 * Snapshot the accepted claims that currently have active supporting evidence.
 * Sorting makes the key deterministic. If links, claim states, or active support
 * change, the key changes and the prior editorial confirmation becomes stale.
 */
export function coverageAcceptedClaimKey(links: CoverageClaimReviewLink[]): string {
  return links
    .filter((link) => link.state === 'accepted' && link.hasActiveSupport)
    .map((link) => link.claimId)
    .filter(Boolean)
    .sort()
    .join(',');
}
