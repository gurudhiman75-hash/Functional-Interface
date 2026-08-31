import { createHash } from 'node:crypto';

export const NOTES_COVERAGE_GAP_RESEARCH_PROMPT_VERSION = 'notes-coverage-gap-research-v1';
export const MAX_COVERAGE_GAP_ITEMS = 30;
export const MAX_RESEARCH_QUESTIONS_PER_GAP = 6;
export const MAX_RESEARCH_QUERIES_PER_GAP = 5;

export const RESEARCH_SOURCE_ROLES = [
  'primary_authority',
  'core_reference',
  'exam_context',
  'supplemental',
] as const;
export type ResearchSourceRole = typeof RESEARCH_SOURCE_ROLES[number];

export type CoverageGapResearchItem = {
  id: string;
  title: string;
  syllabusRef: string;
  priority: 'required' | 'high';
  plannedDepth: string;
  examRationale: string;
  status: 'uncovered' | 'partial' | 'blocked';
  acceptedClaims: Array<{ id: string; text: string }>;
};

export type CoverageGapResearchInput = {
  jobId: string;
  noteTitle: string;
  languageCode: string;
  gaps: CoverageGapResearchItem[];
};

export type CoverageGapResearchBrief = {
  coverageItemId: string;
  researchQuestions: string[];
  evidenceNeeds: Array<{
    description: string;
    preferredSourceRole: ResearchSourceRole;
  }>;
  researchQueries: string[];
};

export type CoverageGapResearchOutput = {
  briefs: CoverageGapResearchBrief[];
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

export function coverageGapResearchInputFingerprint(input: CoverageGapResearchInput): string {
  return createHash('sha256')
    .update(JSON.stringify(stableObject({ promptVersion: NOTES_COVERAGE_GAP_RESEARCH_PROMPT_VERSION, input })))
    .digest('hex');
}

export function coverageGapResearchOutputFingerprint(output: CoverageGapResearchOutput): string {
  return createHash('sha256').update(JSON.stringify(stableObject(output))).digest('hex');
}

export function buildCoverageGapResearchInstruction(input: CoverageGapResearchInput): string {
  return [
    'You are preparing research briefs for unresolved syllabus coverage in an exam-preparation note workflow.',
    'Do NOT answer the research questions and do NOT invent factual claims, dates, numbers, names, definitions, examples, exceptions, comparisons, causal statements, or conclusions.',
    'Your job is only to describe what an editor should verify or find evidence for next.',
    'The supplied acceptedClaims are already editor-approved facts. You may use them only to avoid asking for evidence that is already present; do not expand them with outside knowledge.',
    'For each supplied coverage gap, create concrete neutral research questions, evidence needs, and short search-query phrases that would help an editor locate authoritative material.',
    'Research questions should normally be written as questions, not statements containing an assumed answer.',
    'Evidence-need descriptions must identify the type of proposition/document needed without asserting what the proposition is true to be.',
    'Choose preferredSourceRole only from primary_authority, core_reference, exam_context, supplemental.',
    'Research queries are suggestions only. Do not browse, cite URLs, name a source that was not supplied, or claim that a source exists.',
    'Every output brief must reference exactly one supplied coverageItemId. Never invent IDs.',
    `Write research text in language code ${input.languageCode}, while preserving syllabus/proper-noun wording already supplied.`,
    'Return strict JSON only. These briefs are editorial planning metadata and cannot create claims or learner content.',
    '',
    JSON.stringify({ noteTitle: input.noteTitle, coverageGaps: input.gaps }),
  ].join('\n');
}

export const coverageGapResearchJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['briefs'],
  properties: {
    briefs: {
      type: 'array',
      minItems: 0,
      maxItems: MAX_COVERAGE_GAP_ITEMS,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['coverageItemId', 'researchQuestions', 'evidenceNeeds', 'researchQueries'],
        properties: {
          coverageItemId: { type: 'string' },
          researchQuestions: {
            type: 'array', minItems: 1, maxItems: MAX_RESEARCH_QUESTIONS_PER_GAP,
            items: { type: 'string', minLength: 5, maxLength: 500 },
          },
          evidenceNeeds: {
            type: 'array', minItems: 1, maxItems: MAX_RESEARCH_QUESTIONS_PER_GAP,
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['description', 'preferredSourceRole'],
              properties: {
                description: { type: 'string', minLength: 5, maxLength: 500 },
                preferredSourceRole: { type: 'string', enum: [...RESEARCH_SOURCE_ROLES] },
              },
            },
          },
          researchQueries: {
            type: 'array', minItems: 1, maxItems: MAX_RESEARCH_QUERIES_PER_GAP,
            items: { type: 'string', minLength: 2, maxLength: 250 },
          },
        },
      },
    },
  },
} as const;

export function validateCoverageGapResearchOutput(
  value: unknown,
  allowedCoverageIds: Set<string>,
): CoverageGapResearchOutput {
  if (!value || typeof value !== 'object') throw new Error('Model returned no structured coverage-gap research output.');
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.briefs) || record.briefs.length > MAX_COVERAGE_GAP_ITEMS) {
    throw new Error(`Coverage-gap research output must contain at most ${MAX_COVERAGE_GAP_ITEMS} briefs.`);
  }
  const seen = new Set<string>();
  const briefs: CoverageGapResearchBrief[] = record.briefs.map((raw, index) => {
    if (!raw || typeof raw !== 'object') throw new Error(`Research brief ${index + 1} is invalid.`);
    const item = raw as Record<string, unknown>;
    const coverageItemId = String(item.coverageItemId ?? '').trim();
    if (!allowedCoverageIds.has(coverageItemId)) throw new Error(`Research brief ${index + 1} referenced a coverage item outside the supplied gap set.`);
    if (seen.has(coverageItemId)) throw new Error(`Research brief ${index + 1} duplicated coverage item ${coverageItemId}.`);
    seen.add(coverageItemId);

    if (!Array.isArray(item.researchQuestions) || item.researchQuestions.length < 1 || item.researchQuestions.length > MAX_RESEARCH_QUESTIONS_PER_GAP) {
      throw new Error(`Research brief ${index + 1} has an invalid research-question list.`);
    }
    const researchQuestions = [...new Set(item.researchQuestions.map((entry) => String(entry).trim()).filter((entry) => entry.length >= 5 && entry.length <= 500))];
    if (researchQuestions.length < 1) throw new Error(`Research brief ${index + 1} has no usable research question.`);

    if (!Array.isArray(item.evidenceNeeds) || item.evidenceNeeds.length < 1 || item.evidenceNeeds.length > MAX_RESEARCH_QUESTIONS_PER_GAP) {
      throw new Error(`Research brief ${index + 1} has an invalid evidence-needs list.`);
    }
    const evidenceNeeds = item.evidenceNeeds.map((rawNeed, needIndex) => {
      if (!rawNeed || typeof rawNeed !== 'object') throw new Error(`Research brief ${index + 1} evidence need ${needIndex + 1} is invalid.`);
      const need = rawNeed as Record<string, unknown>;
      const description = String(need.description ?? '').trim();
      const preferredSourceRole = String(need.preferredSourceRole ?? '').trim() as ResearchSourceRole;
      if (description.length < 5 || description.length > 500) throw new Error(`Research brief ${index + 1} evidence need ${needIndex + 1} has invalid text.`);
      if (!(RESEARCH_SOURCE_ROLES as readonly string[]).includes(preferredSourceRole)) throw new Error(`Research brief ${index + 1} evidence need ${needIndex + 1} has an invalid source role.`);
      return { description, preferredSourceRole };
    });

    if (!Array.isArray(item.researchQueries) || item.researchQueries.length < 1 || item.researchQueries.length > MAX_RESEARCH_QUERIES_PER_GAP) {
      throw new Error(`Research brief ${index + 1} has an invalid research-query list.`);
    }
    const researchQueries = [...new Set(item.researchQueries.map((entry) => String(entry).trim()).filter((entry) => entry.length >= 2 && entry.length <= 250))];
    if (researchQueries.length < 1) throw new Error(`Research brief ${index + 1} has no usable research query.`);
    return { coverageItemId, researchQuestions, evidenceNeeds, researchQueries };
  });
  return { briefs };
}
