export const NOTES_QUALITY_GROUNDING_PROMPT_VERSION = 'notes-quality-grounding-v2';

export type QualityGroundingFinding = { excerpt: string; reason: string };

export type QualityGroundingInput = {
  languageCode: string;
  coverageTitle: string;
  syllabusRef: string;
  examRationale: string;
  sectionMarkdown: string;
  claims: Array<{ id: string; text: string }>;
};

export type QualityGroundingResult = {
  unsupportedStatements: QualityGroundingFinding[];
  internalConflicts: QualityGroundingFinding[];
  offScopeStatements: QualityGroundingFinding[];
  timeSensitiveStatements: QualityGroundingFinding[];
  usedClaimIds: string[];
};

const findingArraySchema = {
  type: 'array',
  maxItems: 20,
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['excerpt', 'reason'],
    properties: {
      excerpt: { type: 'string', minLength: 1, maxLength: 300 },
      reason: { type: 'string', minLength: 1, maxLength: 500 },
    },
  },
} as const;

export const qualityGroundingJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'unsupportedStatements',
    'internalConflicts',
    'offScopeStatements',
    'timeSensitiveStatements',
    'usedClaimIds',
  ],
  properties: {
    unsupportedStatements: findingArraySchema,
    internalConflicts: findingArraySchema,
    offScopeStatements: findingArraySchema,
    timeSensitiveStatements: findingArraySchema,
    usedClaimIds: {
      type: 'array',
      maxItems: 100,
      items: { type: 'string', minLength: 1, maxLength: 80 },
    },
  },
} as const;

export function buildQualityGroundingInstruction(input: QualityGroundingInput): string {
  const claimLines = input.claims.map((claim) => `- [${claim.id}] ${claim.text}`).join('\n');
  return [
    'You are the factual and exam-relevance verifier for Examtree Notes Studio.',
    'Use ONLY the accepted claims supplied below as factual authority. Do not use outside knowledge.',
    'Inspect the note section sentence by sentence. A factual assertion passes only when it is directly supported by, or is a faithful paraphrase/inference from, one or more supplied claims.',
    'Do not flag headings, transitions, study advice, formatting text, or clearly non-factual mnemonic wording unless they assert a fact.',
    'unsupportedStatements: factual content that is not supported by the supplied accepted claims.',
    'internalConflicts: factual statements in the section that contradict each other or contradict the supplied accepted claims. Only flag a clear conflict, not a difference in wording or level of detail.',
    'offScopeStatements: factual tangents that are clearly irrelevant to the stated coverage target, syllabus reference, and exam rationale. Be conservative; useful examples, memory aids and context are in scope when they help the target.',
    'timeSensitiveStatements: factual statements whose correctness can materially change with time, such as current office-holders, current rankings, latest counts/statistics, active policies/schemes, present legal rules, or statements explicitly framed as current/latest/as-of. This list is for reviewer recency attention, not a claim that the statement is false.',
    'If a sentence combines supported and unsupported content, include the shortest exact excerpt that contains the finding.',
    'Do not require verbatim wording. Judge semantic support conservatively.',
    'Return every material finding you identify up to each schema limit. Return empty arrays when there are no findings.',
    'usedClaimIds must contain only claim IDs actually used to support factual content in the section.',
    `Language: ${input.languageCode || 'en'}`,
    `Coverage target: ${input.coverageTitle || '(not supplied)'}`,
    `Syllabus reference: ${input.syllabusRef || '(not supplied)'}`,
    `Exam rationale: ${input.examRationale || '(not supplied)'}`,
    '',
    'ACCEPTED CLAIMS:',
    claimLines || '(none)',
    '',
    'SECTION MARKDOWN:',
    input.sectionMarkdown,
  ].join('\n');
}

function parseFindingArray(value: unknown, label: string): QualityGroundingFinding[] {
  if (!Array.isArray(value) || value.length > 20) {
    throw new Error(`Quality grounding ${label} is invalid.`);
  }
  return value.map((item) => {
    if (!item || typeof item !== 'object') throw new Error(`Quality grounding ${label} finding is invalid.`);
    const statement = item as Record<string, unknown>;
    const excerpt = typeof statement.excerpt === 'string' ? statement.excerpt.trim() : '';
    const reason = typeof statement.reason === 'string' ? statement.reason.trim() : '';
    if (!excerpt || excerpt.length > 300 || !reason || reason.length > 500) {
      throw new Error(`Quality grounding ${label} fields are invalid.`);
    }
    return { excerpt, reason };
  });
}

export function validateQualityGroundingResult(value: unknown, allowedClaimIds: Set<string>): QualityGroundingResult {
  if (!value || typeof value !== 'object') throw new Error('Quality grounding output must be an object.');
  const raw = value as Record<string, unknown>;
  if (!Array.isArray(raw.usedClaimIds) || raw.usedClaimIds.length > 100) {
    throw new Error('Quality grounding usedClaimIds is invalid.');
  }
  const usedClaimIds = [...new Set(raw.usedClaimIds.map((id) => String(id).trim()).filter(Boolean))];
  for (const claimId of usedClaimIds) {
    if (!allowedClaimIds.has(claimId)) throw new Error(`Quality grounding referenced unauthorized claim ${claimId}.`);
  }
  return {
    unsupportedStatements: parseFindingArray(raw.unsupportedStatements, 'unsupportedStatements'),
    internalConflicts: parseFindingArray(raw.internalConflicts, 'internalConflicts'),
    offScopeStatements: parseFindingArray(raw.offScopeStatements, 'offScopeStatements'),
    timeSensitiveStatements: parseFindingArray(raw.timeSensitiveStatements, 'timeSensitiveStatements'),
    usedClaimIds,
  };
}
