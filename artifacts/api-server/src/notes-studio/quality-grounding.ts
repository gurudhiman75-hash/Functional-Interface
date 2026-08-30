export const NOTES_QUALITY_GROUNDING_PROMPT_VERSION = 'notes-quality-grounding-v1';

export type QualityGroundingInput = {
  languageCode: string;
  sectionMarkdown: string;
  claims: Array<{ id: string; text: string }>;
};

export type QualityGroundingResult = {
  unsupportedStatements: Array<{ excerpt: string; reason: string }>;
  usedClaimIds: string[];
};

export const qualityGroundingJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['unsupportedStatements', 'usedClaimIds'],
  properties: {
    unsupportedStatements: {
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
    },
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
    'You are the factual re-grounding verifier for Examtree Notes Studio.',
    'Use ONLY the accepted claims supplied below as factual authority. Do not use outside knowledge.',
    'Inspect the note section sentence by sentence. A factual assertion passes only when it is directly supported by, or is a faithful paraphrase/inference from, one or more supplied claims.',
    'Do not flag headings, transitions, study advice, formatting text, or clearly non-factual mnemonic wording unless they assert a fact.',
    'If a sentence combines supported and unsupported factual content, include the shortest exact excerpt that contains the unsupported part.',
    'Do not require verbatim wording. Judge semantic support conservatively.',
    'Return every unsupported factual statement you find, up to the schema limit. If none exist, return an empty unsupportedStatements array.',
    'usedClaimIds must contain only claim IDs actually used to support factual content in the section.',
    `Language: ${input.languageCode || 'en'}`,
    '',
    'ACCEPTED CLAIMS:',
    claimLines || '(none)',
    '',
    'SECTION MARKDOWN:',
    input.sectionMarkdown,
  ].join('\n');
}

export function validateQualityGroundingResult(value: unknown, allowedClaimIds: Set<string>): QualityGroundingResult {
  if (!value || typeof value !== 'object') throw new Error('Quality grounding output must be an object.');
  const raw = value as Record<string, unknown>;
  if (!Array.isArray(raw.unsupportedStatements) || raw.unsupportedStatements.length > 20) {
    throw new Error('Quality grounding unsupportedStatements is invalid.');
  }
  if (!Array.isArray(raw.usedClaimIds) || raw.usedClaimIds.length > 100) {
    throw new Error('Quality grounding usedClaimIds is invalid.');
  }
  const unsupportedStatements = raw.unsupportedStatements.map((item) => {
    if (!item || typeof item !== 'object') throw new Error('Quality grounding statement is invalid.');
    const statement = item as Record<string, unknown>;
    const excerpt = typeof statement.excerpt === 'string' ? statement.excerpt.trim() : '';
    const reason = typeof statement.reason === 'string' ? statement.reason.trim() : '';
    if (!excerpt || excerpt.length > 300 || !reason || reason.length > 500) {
      throw new Error('Quality grounding statement fields are invalid.');
    }
    return { excerpt, reason };
  });
  const usedClaimIds = [...new Set(raw.usedClaimIds.map((id) => String(id).trim()).filter(Boolean))];
  for (const claimId of usedClaimIds) {
    if (!allowedClaimIds.has(claimId)) throw new Error(`Quality grounding referenced unauthorized claim ${claimId}.`);
  }
  return { unsupportedStatements, usedClaimIds };
}
