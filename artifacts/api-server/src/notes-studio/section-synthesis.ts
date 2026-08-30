import { createHash } from 'node:crypto';

export const NOTES_SECTION_PROMPT_VERSION = 'notes-section-v1';

export type SectionClaimInput = {
  id: string;
  text: string;
};

export type SectionSynthesisInput = {
  jobId: string;
  languageCode: string;
  noteTitle: string;
  coverageItem: {
    id: string;
    title: string;
    syllabusRef: string;
    priority: string;
    plannedDepth: string;
    examRationale: string;
  };
  claims: SectionClaimInput[];
};

export type GeneratedSectionBlock = {
  kind: 'paragraph' | 'bullet_list' | 'table' | 'exam_tip' | 'memory_aid';
  markdown: string;
  claimIds: string[];
};

export type GeneratedSection = {
  title: string;
  blocks: GeneratedSectionBlock[];
};

function stableObject(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, stableObject(item)]),
    );
  }
  return value;
}

export function synthesisInputFingerprint(input: SectionSynthesisInput): string {
  return createHash('sha256')
    .update(JSON.stringify(stableObject({ promptVersion: NOTES_SECTION_PROMPT_VERSION, input })))
    .digest('hex');
}

export function synthesisOutputFingerprint(output: GeneratedSection): string {
  return createHash('sha256').update(JSON.stringify(stableObject(output))).digest('hex');
}

export function buildSectionSynthesisInstruction(input: SectionSynthesisInput): string {
  return [
    'You are writing one exam-preparation note section for Examtree.',
    'Use ONLY the accepted claims supplied below as factual authority.',
    'Do not add dates, numbers, names, definitions, exceptions, examples, causal claims, comparisons, or other factual assertions unless directly supported by those claims.',
    'Every substantive block must cite one or more claim IDs in claimIds. claimIds are machine provenance, not learner-facing citations, so do not print IDs inside markdown.',
    'Rewrite in original, concise learner-friendly language rather than copying source phrasing.',
    'Prefer exam-relevant distinctions, compact tables, memory aids, and traps only when the supplied claims support them.',
    `Write in language code: ${input.languageCode}. Preserve proper nouns, official terms, constitutional/article numbers, formulas, and canonical values exactly when present in a claim.`,
    `Planned depth: ${input.coverageItem.plannedDepth}.`,
    'Do not mention sources, evidence blocks, prompts, or the authoring workflow.',
    'Return structured JSON matching the requested schema only.',
    '',
    JSON.stringify({
      noteTitle: input.noteTitle,
      coverageTarget: input.coverageItem,
      acceptedClaims: input.claims,
    }),
  ].join('\n');
}

export const sectionSynthesisJsonSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'blocks'],
  properties: {
    title: { type: 'string', minLength: 2, maxLength: 300 },
    blocks: {
      type: 'array',
      minItems: 1,
      maxItems: 16,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['kind', 'markdown', 'claimIds'],
        properties: {
          kind: { type: 'string', enum: ['paragraph', 'bullet_list', 'table', 'exam_tip', 'memory_aid'] },
          markdown: { type: 'string', minLength: 1, maxLength: 10000 },
          claimIds: {
            type: 'array',
            minItems: 1,
            maxItems: 30,
            items: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

export function validateGeneratedSection(
  value: unknown,
  allowedClaimIds: Set<string>,
): GeneratedSection {
  if (!value || typeof value !== 'object') throw new Error('Model returned no structured section.');
  const record = value as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  if (title.length < 2 || title.length > 300) throw new Error('Generated section title is invalid.');
  if (!Array.isArray(record.blocks) || record.blocks.length < 1 || record.blocks.length > 16) {
    throw new Error('Generated section must contain 1-16 structured blocks.');
  }
  const kinds = new Set(['paragraph', 'bullet_list', 'table', 'exam_tip', 'memory_aid']);
  const blocks = record.blocks.map((rawBlock, blockIndex) => {
    if (!rawBlock || typeof rawBlock !== 'object') throw new Error(`Generated block ${blockIndex + 1} is invalid.`);
    const block = rawBlock as Record<string, unknown>;
    const kind = typeof block.kind === 'string' ? block.kind : '';
    const markdown = typeof block.markdown === 'string' ? block.markdown.trim() : '';
    if (!kinds.has(kind)) throw new Error(`Generated block ${blockIndex + 1} has an unsupported kind.`);
    if (!markdown || markdown.length > 10000) throw new Error(`Generated block ${blockIndex + 1} has invalid markdown.`);
    if (!Array.isArray(block.claimIds) || block.claimIds.length < 1 || block.claimIds.length > 30) {
      throw new Error(`Generated block ${blockIndex + 1} must cite accepted claims.`);
    }
    const claimIds = [...new Set(block.claimIds.map(String))];
    if (claimIds.some((claimId) => !allowedClaimIds.has(claimId))) {
      throw new Error(`Generated block ${blockIndex + 1} referenced a claim outside its accepted input set.`);
    }
    return { kind: kind as GeneratedSectionBlock['kind'], markdown, claimIds };
  });
  return { title, blocks };
}

export function renderGeneratedSection(section: GeneratedSection): string {
  return section.blocks.map((block) => block.markdown.trim()).filter(Boolean).join('\n\n');
}

export function collectGeneratedClaimIds(section: GeneratedSection): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const block of section.blocks) {
    for (const claimId of block.claimIds) {
      if (seen.has(claimId)) continue;
      seen.add(claimId);
      result.push(claimId);
    }
  }
  return result;
}
