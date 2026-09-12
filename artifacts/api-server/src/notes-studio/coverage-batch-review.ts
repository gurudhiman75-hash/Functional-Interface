import { createHash } from 'node:crypto';

export const NOTES_COVERAGE_BATCH_REVIEW_PROMPT_VERSION = 'notes-coverage-batch-review-v1';
export const MAX_COVERAGE_BATCH_REVIEW_CLAIMS = 160;
export const MAX_COVERAGE_BATCH_REVIEW_ITEMS = 80;
export const MAX_COVERAGE_BATCH_REVIEW_CLAIMS_PER_ITEM = 12;

export type CoverageBatchReviewClaim = {
  id: string;
  text: string;
};

export type CoverageBatchReviewItem = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: string;
  plannedDepth: string;
  examRationale: string;
  linkedClaimIds: string[];
};

export type CoverageBatchReviewInput = {
  jobId: string;
  noteTitle: string;
  languageCode: string;
  claims: CoverageBatchReviewClaim[];
  coverageItems: CoverageBatchReviewItem[];
};

export type CoverageBatchAssessment = 'sufficient' | 'partial' | 'missing';

export type CoverageBatchReviewDecision = {
  coverageItemId: string;
  assessment: CoverageBatchAssessment;
  claimIds: string[];
  confidence: number;
  rationale: string;
};

export type CoverageBatchReviewOutput = {
  reviews: CoverageBatchReviewDecision[];
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

export function coverageBatchReviewInputFingerprint(input: CoverageBatchReviewInput): string {
  return createHash('sha256')
    .update(JSON.stringify(stableObject({ promptVersion: NOTES_COVERAGE_BATCH_REVIEW_PROMPT_VERSION, input })))
    .digest('hex');
}

export function coverageBatchReviewOutputFingerprint(output: CoverageBatchReviewOutput): string {
  return createHash('sha256').update(JSON.stringify(stableObject(output))).digest('hex');
}

export function buildCoverageBatchReviewInstruction(input: CoverageBatchReviewInput): string {
  return [
    'You are assisting an editor with syllabus coverage review for an exam-preparation note.',
    'Every supplied claim has already been accepted by an editor and has active source provenance. Treat only those claim texts as factual inputs.',
    'Your task is NOT to judge factual truth. Your task is to assess whether the supplied accepted claims collectively cover each supplied coverage target.',
    'Assess every coverage target exactly once as sufficient, partial, or missing.',
    'Use sufficient only when the selected claims directly cover the central factual requirement implied by the target title, syllabus reference, exam rationale, and planned depth.',
    'A generic association, shared keyword, or one narrow fact is not sufficient for a broad target such as course and significance, role and functions, comparison, or a deep target.',
    'Use partial when one or more claims materially support the target but important requested scope remains uncovered.',
    'Use missing when no supplied accepted claim materially supports the target.',
    `Return at most ${MAX_COVERAGE_BATCH_REVIEW_CLAIMS_PER_ITEM} materially relevant claim IDs per target.`,
    'For missing targets return an empty claimIds array. For sufficient or partial targets return at least one claim ID.',
    'Do not invent facts, claims, IDs, syllabus requirements, coverage targets, or learner wording.',
    'Confidence is confidence in the coverage assessment, not confidence in factual truth.',
    'Rationale must be short editorial metadata explaining why the available accepted claims are sufficient, partial, or missing.',
    'Return strict JSON only. The result is advisory until an editor explicitly approves sufficient targets in one batch action.',
    '',
    JSON.stringify({
      noteTitle: input.noteTitle,
      languageCode: input.languageCode,
      acceptedClaims: input.claims,
      coverageItems: input.coverageItems,
    }),
  ].join('\n');
}

export const coverageBatchReviewJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['reviews'],
  properties: {
    reviews: {
      type: 'array',
      minItems: 1,
      maxItems: MAX_COVERAGE_BATCH_REVIEW_ITEMS,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['coverageItemId', 'assessment', 'claimIds', 'confidence', 'rationale'],
        properties: {
          coverageItemId: { type: 'string' },
          assessment: { type: 'string', enum: ['sufficient', 'partial', 'missing'] },
          claimIds: {
            type: 'array',
            minItems: 0,
            maxItems: MAX_COVERAGE_BATCH_REVIEW_CLAIMS_PER_ITEM,
            items: { type: 'string' },
          },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          rationale: { type: 'string', minLength: 2, maxLength: 500 },
        },
      },
    },
  },
} as const;

export function validateCoverageBatchReviewOutput(
  value: unknown,
  allowedClaimIds: Set<string>,
  coverageItemIdsInOrder: string[],
): CoverageBatchReviewOutput {
  if (!value || typeof value !== 'object') throw new Error('Model returned no structured batch coverage review output.');
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.reviews) || record.reviews.length !== coverageItemIdsInOrder.length) {
    throw new Error('Batch coverage review must assess every supplied coverage target exactly once.');
  }

  const allowedCoverageIds = new Set(coverageItemIdsInOrder);
  const byCoverageId = new Map<string, CoverageBatchReviewDecision>();
  for (const [index, raw] of record.reviews.entries()) {
    if (!raw || typeof raw !== 'object') throw new Error(`Batch coverage review ${index + 1} is invalid.`);
    const item = raw as Record<string, unknown>;
    const coverageItemId = String(item.coverageItemId ?? '').trim();
    if (!allowedCoverageIds.has(coverageItemId)) throw new Error(`Batch coverage review ${index + 1} referenced a coverage target outside the supplied plan.`);
    if (byCoverageId.has(coverageItemId)) throw new Error(`Batch coverage review duplicated coverage target ${coverageItemId}.`);
    const assessment = String(item.assessment ?? '').trim() as CoverageBatchAssessment;
    if (!['sufficient', 'partial', 'missing'].includes(assessment)) throw new Error(`Batch coverage review ${index + 1} has an invalid assessment.`);
    if (!Array.isArray(item.claimIds) || item.claimIds.length > MAX_COVERAGE_BATCH_REVIEW_CLAIMS_PER_ITEM) {
      throw new Error(`Batch coverage review ${index + 1} has invalid claim IDs.`);
    }
    const claimIds = [...new Set(item.claimIds.map((claimId) => String(claimId).trim()).filter(Boolean))];
    if (claimIds.some((claimId) => !allowedClaimIds.has(claimId))) {
      throw new Error(`Batch coverage review ${index + 1} referenced a claim outside the accepted input set.`);
    }
    if (assessment === 'missing' && claimIds.length !== 0) throw new Error(`Missing coverage target ${coverageItemId} must not contain claim IDs.`);
    if (assessment !== 'missing' && claimIds.length === 0) throw new Error(`${assessment} coverage target ${coverageItemId} requires at least one relevant claim.`);
    const confidence = Number(item.confidence);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error(`Batch coverage review ${index + 1} has invalid confidence.`);
    const rationale = String(item.rationale ?? '').trim();
    if (rationale.length < 2 || rationale.length > 500) throw new Error(`Batch coverage review ${index + 1} has invalid rationale.`);
    byCoverageId.set(coverageItemId, {
      coverageItemId,
      assessment,
      claimIds,
      confidence: Math.round(confidence * 1000) / 1000,
      rationale,
    });
  }

  return {
    reviews: coverageItemIdsInOrder.map((coverageItemId) => {
      const review = byCoverageId.get(coverageItemId);
      if (!review) throw new Error(`Batch coverage review omitted coverage target ${coverageItemId}.`);
      return review;
    }),
  };
}
