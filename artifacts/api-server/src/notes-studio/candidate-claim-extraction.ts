import { createHash } from 'node:crypto';

export const NOTES_CLAIM_EXTRACTION_PROMPT_VERSION = 'notes-claim-extraction-v1';
export const MAX_CLAIM_EXTRACTION_BLOCKS = 40;
export const MAX_CLAIM_EXTRACTION_OUTPUTS = 60;

export type ClaimExtractionEvidenceBlock = {
  id: string;
  sourceDocumentId: string;
  sourceTitle: string;
  excerpt: string;
};

export type ClaimExtractionInput = {
  jobId: string;
  noteTitle: string;
  languageCode: string;
  blocks: ClaimExtractionEvidenceBlock[];
};

export type ExtractedCandidateClaim = {
  claimText: string;
  confidence: number;
  contradictionKey: string | null;
  evidenceBlockIds: string[];
};

export type CandidateClaimExtraction = {
  claims: ExtractedCandidateClaim[];
};

function stableObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stableObject(item)]),
    );
  }
  return value;
}

export function candidateClaimInputFingerprint(input: ClaimExtractionInput): string {
  return createHash('sha256')
    .update(JSON.stringify(stableObject({ promptVersion: NOTES_CLAIM_EXTRACTION_PROMPT_VERSION, input })))
    .digest('hex');
}

export function candidateClaimOutputFingerprint(output: CandidateClaimExtraction): string {
  return createHash('sha256').update(JSON.stringify(stableObject(output))).digest('hex');
}

export function buildCandidateClaimInstruction(input: ClaimExtractionInput): string {
  return [
    'You are extracting atomic factual claims for an exam-preparation research workflow.',
    'Use ONLY the supplied evidence excerpts. Do not use outside knowledge or infer facts that are not directly supported.',
    'Return candidate claims for human editorial review; nothing you return is automatically accepted.',
    'Each claim must express one checkable factual proposition in concise wording.',
    'Preserve names, dates, numbers, percentages, constitutional/article numbers, formulas, official terms and proper nouns exactly when they appear in evidence.',
    'Avoid advice, opinions, learner-facing prose, questions, memory tricks, examples invented by you, or broad summaries.',
    'Every claim must cite one or more evidenceBlockIds from the supplied block IDs. Never invent an ID.',
    'Use multiple evidenceBlockIds only when every cited block directly supports the same factual proposition.',
    'If two excerpts make incompatible claims about the same factual field, emit separate candidate claims and give them the same short contradictionKey. Otherwise contradictionKey must be null.',
    'Confidence measures only how directly the cited excerpt supports the exact claim, not whether you believe the real-world fact is true.',
    `The note source language is ${input.languageCode}; write claimText in that language unless the evidence is an official proper noun/term that should remain unchanged.`,
    `Return at most ${MAX_CLAIM_EXTRACTION_OUTPUTS} claims as strict JSON matching the requested schema.`,
    '',
    JSON.stringify({
      noteTitle: input.noteTitle,
      evidenceBlocks: input.blocks,
    }),
  ].join('\n');
}

export const candidateClaimJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['claims'],
  properties: {
    claims: {
      type: 'array',
      minItems: 0,
      maxItems: MAX_CLAIM_EXTRACTION_OUTPUTS,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['claimText', 'confidence', 'contradictionKey', 'evidenceBlockIds'],
        properties: {
          claimText: { type: 'string', minLength: 5, maxLength: 1200 },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          contradictionKey: { type: ['string', 'null'], maxLength: 240 },
          evidenceBlockIds: {
            type: 'array',
            minItems: 1,
            maxItems: 8,
            items: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

export function validateCandidateClaimExtraction(
  value: unknown,
  allowedBlockIds: Set<string>,
): CandidateClaimExtraction {
  if (!value || typeof value !== 'object') throw new Error('Model returned no structured candidate-claim output.');
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.claims) || record.claims.length > MAX_CLAIM_EXTRACTION_OUTPUTS) {
    throw new Error(`Candidate-claim output must contain at most ${MAX_CLAIM_EXTRACTION_OUTPUTS} claims.`);
  }

  const seen = new Set<string>();
  const claims: ExtractedCandidateClaim[] = [];
  for (const [index, raw] of record.claims.entries()) {
    if (!raw || typeof raw !== 'object') throw new Error(`Candidate claim ${index + 1} is invalid.`);
    const item = raw as Record<string, unknown>;
    const claimText = typeof item.claimText === 'string' ? item.claimText.trim() : '';
    if (claimText.length < 5 || claimText.length > 1200) throw new Error(`Candidate claim ${index + 1} has invalid text.`);
    const confidence = Number(item.confidence);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error(`Candidate claim ${index + 1} has invalid confidence.`);
    const contradictionKey = item.contradictionKey == null ? null : String(item.contradictionKey).trim().slice(0, 240) || null;
    if (!Array.isArray(item.evidenceBlockIds) || item.evidenceBlockIds.length < 1 || item.evidenceBlockIds.length > 8) {
      throw new Error(`Candidate claim ${index + 1} must cite 1-8 evidence blocks.`);
    }
    const evidenceBlockIds = [...new Set(item.evidenceBlockIds.map(String))];
    if (evidenceBlockIds.some((blockId) => !allowedBlockIds.has(blockId))) {
      throw new Error(`Candidate claim ${index + 1} referenced an evidence block outside the editor-selected input set.`);
    }
    const normalized = claimText.normalize('NFC').replace(/\s+/g, ' ').trim().toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    claims.push({
      claimText,
      confidence: Math.round(confidence * 1000) / 1000,
      contradictionKey,
      evidenceBlockIds,
    });
  }
  return { claims };
}
