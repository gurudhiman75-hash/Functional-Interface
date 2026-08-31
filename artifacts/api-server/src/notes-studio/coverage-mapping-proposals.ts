import { createHash } from 'node:crypto';

export const NOTES_COVERAGE_PROPOSAL_PROMPT_VERSION = 'notes-coverage-proposals-v1';
export const MAX_COVERAGE_PROPOSAL_CLAIMS = 120;
export const MAX_COVERAGE_PROPOSAL_ITEMS = 80;
export const MAX_COVERAGE_LINKS_PER_CLAIM = 4;

export type CoverageProposalClaim = {
  id: string;
  text: string;
};

export type CoverageProposalItem = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: string;
  plannedDepth: string;
  examRationale: string;
};

export type CoverageProposalInput = {
  jobId: string;
  noteTitle: string;
  languageCode: string;
  claims: CoverageProposalClaim[];
  coverageItems: CoverageProposalItem[];
};

export type CoverageMappingProposal = {
  claimId: string;
  coverageItemIds: string[];
  confidence: number;
  rationale: string;
};

export type CoverageProposalOutput = {
  proposals: CoverageMappingProposal[];
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

export function coverageProposalInputFingerprint(input: CoverageProposalInput): string {
  return createHash('sha256')
    .update(JSON.stringify(stableObject({ promptVersion: NOTES_COVERAGE_PROPOSAL_PROMPT_VERSION, input })))
    .digest('hex');
}

export function coverageProposalOutputFingerprint(output: CoverageProposalOutput): string {
  return createHash('sha256').update(JSON.stringify(stableObject(output))).digest('hex');
}

export function buildCoverageProposalInstruction(input: CoverageProposalInput): string {
  return [
    'You are proposing syllabus-coverage links for an exam-preparation note authoring workflow.',
    'The supplied claims have already been accepted by an editor and have active source provenance. Treat only those claim texts as factual inputs.',
    'Map a claim to a coverage item only when the claim materially supports that syllabus target. Do not map merely because words overlap.',
    'Do not invent claims, coverage items, IDs, facts, syllabus requirements, or learner content.',
    'A claim may support more than one coverage item only when the same factual proposition is genuinely relevant to each target.',
    `Use at most ${MAX_COVERAGE_LINKS_PER_CLAIM} coverage item IDs per claim.`,
    'Omit claims that do not clearly support any supplied coverage item.',
    'Confidence is confidence in the mapping relationship, not confidence in the factual truth of the accepted claim.',
    'Rationale is short editorial metadata explaining why the claim belongs under the proposed syllabus target; it is not learner-facing copy.',
    'Return strict JSON only. An editor will review the proposals before any link is written.',
    '',
    JSON.stringify({
      noteTitle: input.noteTitle,
      languageCode: input.languageCode,
      acceptedClaims: input.claims,
      coverageItems: input.coverageItems,
    }),
  ].join('\n');
}

export const coverageProposalJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['proposals'],
  properties: {
    proposals: {
      type: 'array',
      minItems: 0,
      maxItems: MAX_COVERAGE_PROPOSAL_CLAIMS,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['claimId', 'coverageItemIds', 'confidence', 'rationale'],
        properties: {
          claimId: { type: 'string' },
          coverageItemIds: {
            type: 'array',
            minItems: 1,
            maxItems: MAX_COVERAGE_LINKS_PER_CLAIM,
            items: { type: 'string' },
          },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
          rationale: { type: 'string', minLength: 2, maxLength: 500 },
        },
      },
    },
  },
} as const;

export function validateCoverageProposalOutput(
  value: unknown,
  allowedClaimIds: Set<string>,
  allowedCoverageItemIds: Set<string>,
): CoverageProposalOutput {
  if (!value || typeof value !== 'object') throw new Error('Model returned no structured coverage-proposal output.');
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.proposals) || record.proposals.length > MAX_COVERAGE_PROPOSAL_CLAIMS) {
    throw new Error(`Coverage proposal output must contain at most ${MAX_COVERAGE_PROPOSAL_CLAIMS} proposals.`);
  }

  const seenClaims = new Set<string>();
  const proposals: CoverageMappingProposal[] = [];
  for (const [index, raw] of record.proposals.entries()) {
    if (!raw || typeof raw !== 'object') throw new Error(`Coverage proposal ${index + 1} is invalid.`);
    const item = raw as Record<string, unknown>;
    const claimId = String(item.claimId ?? '').trim();
    if (!allowedClaimIds.has(claimId)) throw new Error(`Coverage proposal ${index + 1} referenced a claim outside the accepted input set.`);
    if (seenClaims.has(claimId)) throw new Error(`Coverage proposal ${index + 1} duplicated claim ${claimId}.`);
    seenClaims.add(claimId);
    if (!Array.isArray(item.coverageItemIds) || item.coverageItemIds.length < 1 || item.coverageItemIds.length > MAX_COVERAGE_LINKS_PER_CLAIM) {
      throw new Error(`Coverage proposal ${index + 1} must contain 1-${MAX_COVERAGE_LINKS_PER_CLAIM} coverage item IDs.`);
    }
    const coverageItemIds = [...new Set(item.coverageItemIds.map(String))];
    if (coverageItemIds.some((coverageId) => !allowedCoverageItemIds.has(coverageId))) {
      throw new Error(`Coverage proposal ${index + 1} referenced a coverage item outside the supplied plan.`);
    }
    const confidence = Number(item.confidence);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error(`Coverage proposal ${index + 1} has invalid confidence.`);
    const rationale = String(item.rationale ?? '').trim();
    if (rationale.length < 2 || rationale.length > 500) throw new Error(`Coverage proposal ${index + 1} has invalid rationale.`);
    proposals.push({
      claimId,
      coverageItemIds,
      confidence: Math.round(confidence * 1000) / 1000,
      rationale,
    });
  }
  return { proposals };
}
