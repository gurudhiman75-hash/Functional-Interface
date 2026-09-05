import type { ContradictionGroup, CorpusDoc, Fact, Period, StyleSpec } from '../domain/types';

export const NOTES_STUDIO_PERIODS: Period[] = [
  {
    id: 'gupta',
    name: 'Gupta Empire',
    orderIndex: 1,
    subCategories: [
      'Political',
      'Administration',
      'Economy',
      'Science',
      'Art',
      'Society',
      'Decline',
    ].map((name, index) => ({
      id: `gupta-${index + 1}`,
      periodId: 'gupta',
      name,
      orderIndex: index + 1,
    })),
  },
];

export const NOTES_STUDIO_CORPUS: CorpusDoc[] = [
  {
    id: 'source-a',
    periodId: 'gupta',
    title: 'History Reference A',
    sourceType: 'textbook',
    subCategoryHints: ['Administration', 'Society'],
    file: '/corpus/gupta/source-a.pdf',
  },
  {
    id: 'source-b',
    periodId: 'gupta',
    title: 'History Reference B',
    sourceType: 'reference',
    subCategoryHints: ['Administration', 'Political'],
    file: '/corpus/gupta/source-b.pdf',
  },
  {
    id: 'source-c',
    periodId: 'gupta',
    title: 'Academic Reference C',
    sourceType: 'academic',
    file: '/corpus/gupta/source-c.pdf',
  },
];

export const NOTES_STUDIO_FACTS: Fact[] = [
  {
    id: 'gupta-admin-0007',
    periodId: 'gupta',
    subCategoryId: 'gupta-2',
    subCategory: 'Administration',
    claim: 'Provincial governors were called Uparikas.',
    entities: ['Uparika', 'Gupta provincial administration'],
    confidence: 'confirmed',
    examFrequency: 'medium',
    sourceRefs: [
      { corpusDocId: 'source-a', locator: 'p. 42', extractedText: 'Verification-only source span A.' },
      { corpusDocId: 'source-b', locator: 'sec. 3.2', extractedText: 'Verification-only source span B.' },
    ],
  },
  {
    id: 'gupta-disputed-0001',
    periodId: 'gupta',
    subCategoryId: 'gupta-1',
    subCategory: 'Political',
    claim: 'Illustrative chronology claim from source A.',
    entities: ['Illustrative chronology'],
    confidence: 'disputed',
    sourceRefs: [
      { corpusDocId: 'source-a', locator: 'p. 8', extractedText: 'Conflicting verification span A.' },
    ],
  },
  {
    id: 'gupta-disputed-0002',
    periodId: 'gupta',
    subCategoryId: 'gupta-1',
    subCategory: 'Political',
    claim: 'Illustrative conflicting chronology claim from source B.',
    entities: ['Illustrative chronology'],
    confidence: 'disputed',
    sourceRefs: [
      { corpusDocId: 'source-b', locator: 'p. 11', extractedText: 'Conflicting verification span B.' },
    ],
  },
];

export const NOTES_STUDIO_CONTRADICTIONS: ContradictionGroup[] = [
  {
    id: 'gupta-contradiction-0001',
    periodId: 'gupta',
    subCategoryId: 'gupta-1',
    status: 'open',
    factIds: ['gupta-disputed-0001', 'gupta-disputed-0002'],
  },
];

export const NOTES_STUDIO_STYLE_SPEC: StyleSpec = {
  id: 'history-default',
  name: 'History — default voice',
  tone: 'direct, exam-focused, no narrative flourishes',
  sentenceLength: 'short',
  terminologyConventions: {},
  exampleStructure: 'Use examples only where they clarify a fact or relationship.',
  avoid: ['rhetorical questions', 'decorative quotations'],
  exemplarNoteVersionIds: [],
  isActive: false,
};
