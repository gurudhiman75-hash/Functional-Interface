export type NotesStudioV2Language = 'en' | 'hi' | 'pa';
export type NotesStudioV2Confidence = 'confirmed' | 'disputed' | 'single-source';

export type NotesStudioV2NoteBlock =
  | { type: 'text'; content: string }
  | { type: 'formula'; latex: string }
  | { type: 'figure'; svgRef: string | null; placeholder?: string }
  | { type: 'example'; problem: string; solution: string };

export type GenerationFact = {
  id: string;
  periodId: string;
  subCategoryId: string;
  subCategory: string;
  claim: string;
  entities: string[];
  dateOrEra?: string;
  examFrequency?: 'high' | 'medium' | 'low';
};

export type FactRow = GenerationFact & {
  confidence: NotesStudioV2Confidence;
  sourceRefs?: unknown;
  extractedText?: unknown;
};

export type StyleSpecForGeneration = {
  tone: string;
  sentenceLength: 'short' | 'medium' | 'mixed';
  terminologyConventions: Record<string, string>;
  exampleStructure: string;
  avoid: string[];
  exemplars?: string[];
};

export function buildFactGraph(rows: FactRow[]): GenerationFact[] {
  return rows
    .filter((row) => row.confidence !== 'disputed')
    .map((row) => ({
      id: row.id,
      periodId: row.periodId,
      subCategoryId: row.subCategoryId,
      subCategory: row.subCategory,
      claim: row.claim,
      entities: [...row.entities],
      ...(row.dateOrEra ? { dateOrEra: row.dateOrEra } : {}),
      ...(row.examFrequency ? { examFrequency: row.examFrequency } : {}),
    }));
}

export function generationInputJson(facts: GenerationFact[]) {
  return JSON.stringify(facts.map((fact) => ({
    id: fact.id,
    subCategory: fact.subCategory,
    claim: fact.claim,
    entities: fact.entities,
    ...(fact.dateOrEra ? { dateOrEra: fact.dateOrEra } : {}),
    ...(fact.examFrequency ? { examFrequency: fact.examFrequency } : {}),
  })));
}

export const NOTE_BLOCK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['blocks'],
  properties: {
    blocks: {
      type: 'array',
      items: {
        oneOf: [
          {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'content'],
            properties: { type: { const: 'text' }, content: { type: 'string' } },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'latex'],
            properties: { type: { const: 'formula' }, latex: { type: 'string' } },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'svgRef', 'placeholder'],
            properties: {
              type: { const: 'figure' },
              svgRef: { type: ['string', 'null'] },
              placeholder: { type: 'string' },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'problem', 'solution'],
            properties: {
              type: { const: 'example' },
              problem: { type: 'string' },
              solution: { type: 'string' },
            },
          },
        ],
      },
    },
  },
} as const;

export const EXTRACTED_FACT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['facts'],
  properties: {
    facts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['subCategory', 'claim', 'entities', 'locator', 'extractedText'],
        properties: {
          subCategory: { type: 'string' },
          claim: { type: 'string' },
          entities: { type: 'array', items: { type: 'string' } },
          dateOrEra: { type: ['string', 'null'] },
          locator: { type: 'string' },
          extractedText: { type: 'string' },
        },
      },
    },
  },
} as const;

export function buildExtractionRequest(input: {
  sourceTitle: string;
  taxonomy: string[];
  sourceText: string;
}) {
  return {
    prompt: {
      system: [
        'You extract atomic historical facts for ExamTree Notes Studio v2.',
        'Extract facts only; do not write learner-facing prose or summaries.',
        'Each fact must be independently understandable and assigned to one provided sub-category.',
        'Use sub-category hints as routing guidance, never as a reason to omit facts.',
        'Return an exact short source span in extractedText only for later verification.',
      ].join(' '),
      user: `Source: ${input.sourceTitle}\nAllowed sub-categories: ${input.taxonomy.join(', ')}\nExtract exhaustive atomic facts from the supplied source text.`,
    },
    input: input.sourceText,
    responseSchema: EXTRACTED_FACT_SCHEMA,
    responseSchemaName: 'notes_studio_v2_extracted_facts',
    temperature: 0,
  };
}

export function buildGenerationRequest(input: {
  language: NotesStudioV2Language;
  facts: GenerationFact[];
  style: StyleSpecForGeneration;
  noteLevel: 'topic' | 'subcategory';
  targetLabel: string;
}) {
  const styleJson = JSON.stringify({
    tone: input.style.tone,
    sentenceLength: input.style.sentenceLength,
    terminologyConventions: input.style.terminologyConventions,
    exampleStructure: input.style.exampleStructure,
    avoid: input.style.avoid,
    exemplars: input.style.exemplars ?? [],
  });
  return {
    prompt: {
      system: [
        'You generate ExamTree study notes strictly from a source-agnostic fact graph.',
        'Never invent facts, never cite or imitate a source, and never reconstruct source wording or paragraph structure.',
        `Write directly in ${input.language}; do not translate from another language version.`,
        'Coverage is exhaustive: exam-frequency tags are advisory emphasis metadata only and must never remove low-frequency facts.',
        'Return structured note blocks. For useful maps/timelines/trees, emit a figure block with svgRef null and a concise placeholder.',
      ].join(' '),
      user: [
        `Target: ${input.targetLabel}`,
        `Note level: ${input.noteLevel}`,
        `House style: ${styleJson}`,
        'Fact graph JSON follows. Use every relevant fact exactly as evidence for the note:',
        generationInputJson(input.facts),
      ].join('\n\n'),
    },
    responseSchema: NOTE_BLOCK_SCHEMA,
    responseSchemaName: `notes_studio_v2_${input.language}_blocks`,
    temperature: 0.35,
  };
}

export function validateNoteBlocks(value: unknown): NotesStudioV2NoteBlock[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { blocks?: unknown }).blocks)) {
    throw new Error('Generation did not return a blocks array.');
  }
  const blocks = (value as { blocks: unknown[] }).blocks.map((raw) => {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid note block.');
    const block = raw as Record<string, unknown>;
    if (block.type === 'text' && typeof block.content === 'string') {
      return { type: 'text', content: block.content.trim() } as const;
    }
    if (block.type === 'formula' && typeof block.latex === 'string') {
      return { type: 'formula', latex: block.latex.trim() } as const;
    }
    if (block.type === 'figure' && (block.svgRef === null || typeof block.svgRef === 'string') && typeof block.placeholder === 'string') {
      return { type: 'figure', svgRef: block.svgRef, placeholder: block.placeholder.trim() } as const;
    }
    if (block.type === 'example' && typeof block.problem === 'string' && typeof block.solution === 'string') {
      return { type: 'example', problem: block.problem.trim(), solution: block.solution.trim() } as const;
    }
    throw new Error(`Unsupported note block type: ${String(block.type)}`);
  });
  if (blocks.length === 0) throw new Error('Generation returned no note blocks.');
  return blocks;
}

export type ExtractedFactCandidate = {
  subCategory: string;
  claim: string;
  entities: string[];
  dateOrEra?: string;
  locator: string;
  extractedText: string;
};

export function validateExtractedFacts(value: unknown, taxonomy: string[]): ExtractedFactCandidate[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { facts?: unknown }).facts)) {
    throw new Error('Extraction did not return a facts array.');
  }
  const allowed = new Map(taxonomy.map((name) => [name.toLowerCase(), name]));
  return (value as { facts: unknown[] }).facts.map((raw) => {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid extracted fact.');
    const fact = raw as Record<string, unknown>;
    const subCategoryRaw = String(fact.subCategory ?? '').trim();
    const subCategory = allowed.get(subCategoryRaw.toLowerCase());
    if (!subCategory) throw new Error(`Unknown sub-category: ${subCategoryRaw}`);
    const claim = String(fact.claim ?? '').trim();
    const locator = String(fact.locator ?? '').trim();
    const extractedText = String(fact.extractedText ?? '').trim();
    const entities = Array.isArray(fact.entities)
      ? [...new Set(fact.entities.map((entity) => String(entity).trim()).filter(Boolean))]
      : [];
    if (!claim || !locator || !extractedText) throw new Error('Extracted facts require claim, locator and verification text.');
    const dateOrEra = typeof fact.dateOrEra === 'string' ? fact.dateOrEra.trim() : '';
    return {
      subCategory,
      claim,
      entities,
      ...(dateOrEra ? { dateOrEra } : {}),
      locator,
      extractedText,
    };
  });
}

export function renderedNoteText(blocks: NotesStudioV2NoteBlock[]) {
  return blocks.map((block) => {
    if (block.type === 'text') return block.content;
    if (block.type === 'formula') return block.latex;
    if (block.type === 'figure') return block.placeholder ?? '';
    return `${block.problem}\n${block.solution}`;
  }).join('\n');
}

function normalizedWords(text: string) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').split(/\s+/).filter(Boolean);
}

function ngrams(words: string[], size: number) {
  const set = new Set<string>();
  for (let i = 0; i <= words.length - size; i += 1) set.add(words.slice(i, i + size).join(' '));
  return set;
}

export function sourceOverlapScore(generatedText: string, sourceText: string, n = 6) {
  const generated = ngrams(normalizedWords(generatedText), n);
  const source = ngrams(normalizedWords(sourceText), n);
  if (generated.size === 0 || source.size === 0) return 0;
  let overlap = 0;
  for (const gram of generated) if (source.has(gram)) overlap += 1;
  return overlap / generated.size;
}
