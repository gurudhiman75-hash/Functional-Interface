import assert from 'node:assert/strict';

import {
  EXTRACTED_FACT_SCHEMA,
  buildExtractionRequest,
  buildFactGraph,
  buildGenerationRequest,
  extractedFactQualityRejectionReasons,
  generationInputJson,
  sourceOverlapScore,
  validateExtractedFacts,
  validateExtractedFactsWithQuality,
  validateNoteBlocks,
  type FactRow,
} from './core';

const rows: FactRow[] = [
  {
    id: 'f-high',
    periodId: 'p1',
    subCategoryId: 's1',
    subCategory: 'Political',
    claim: 'Confirmed high-frequency claim.',
    entities: ['A'],
    confidence: 'confirmed',
    examFrequency: 'high',
    sourceRefs: [{ corpusDocId: 'c1', locator: 'p. 1' }],
    extractedText: 'SOURCE PROSE MUST NEVER CROSS GENERATION',
  },
  {
    id: 'f-low',
    periodId: 'p1',
    subCategoryId: 's1',
    subCategory: 'Political',
    claim: 'Low-frequency but still eligible claim.',
    entities: ['B'],
    confidence: 'single-source',
    examFrequency: 'low',
    sourceRefs: [{ corpusDocId: 'c2', locator: 'p. 2' }],
  },
  {
    id: 'f-disputed',
    periodId: 'p1',
    subCategoryId: 's1',
    subCategory: 'Political',
    claim: 'Unresolved conflicting claim.',
    entities: ['C'],
    confidence: 'disputed',
    extractedText: 'BLOCKED DISPUTED SOURCE TEXT',
  },
];

const graph = buildFactGraph(rows);
assert.deepEqual(graph.map((fact) => fact.id), ['f-high', 'f-low']);
assert.equal('sourceRefs' in graph[0], false);
assert.equal('extractedText' in graph[0], false);

const serialized = generationInputJson(graph);
assert.match(serialized, /f-high/);
assert.match(serialized, /f-low/);
assert.doesNotMatch(serialized, /f-disputed/);
assert.doesNotMatch(serialized, /SOURCE PROSE/);
assert.doesNotMatch(serialized, /locator/);

const extractedFactItemSchema = EXTRACTED_FACT_SCHEMA.properties.facts.items;
assert.deepEqual(
  [...extractedFactItemSchema.required].sort(),
  Object.keys(extractedFactItemSchema.properties).sort(),
  'Strict structured-output schemas must require every declared fact property; nullable fields stay required and use null for absence.',
);
assert.deepEqual(extractedFactItemSchema.properties.dateOrEra.type, ['string', 'null']);

const extractedQuality = validateExtractedFactsWithQuality({
  facts: [
    {
      subCategory: 'Political',
      claim: 'Maski is mentioned on page 60.',
      entities: ['Maski'],
      dateOrEra: null,
      locator: 'Index',
      extractedText: 'Maski 60',
    },
    {
      subCategory: 'Political',
      claim: 'Bead is mentioned on page 80.',
      entities: ['Bead'],
      dateOrEra: null,
      locator: 'p. 394',
      extractedText: 'bead 80',
    },
    {
      subCategory: 'Political',
      claim: 'Ashoka adopted dhamma as an important principle of governance.',
      entities: ['Ashoka', 'dhamma'],
      dateOrEra: null,
      locator: 'p. 201',
      extractedText: 'Ashoka adopted dhamma as an important principle of governance.',
    },
    {
      subCategory: 'Political',
      claim: 'The inscription dates to 150 BCE.',
      entities: ['inscription'],
      dateOrEra: '150 BCE',
      locator: 'p. 205',
      extractedText: 'The inscription dates to 150 BCE.',
    },
  ],
}, ['Political']);

assert.equal(extractedQuality.rawCount, 4);
assert.equal(extractedQuality.candidates.length, 2);
assert.equal(extractedQuality.rejections.length, 2);
assert.deepEqual(
  extractedQuality.candidates.map((fact) => fact.claim),
  [
    'Ashoka adopted dhamma as an important principle of governance.',
    'The inscription dates to 150 BCE.',
  ],
);
assert.deepEqual(
  extractedQuality.rejections[0]?.reasons,
  ['pointer-claim', 'back-matter-locator', 'index-like-evidence'],
);
assert.ok(extractedQuality.rejections[1]?.reasons.includes('pointer-claim'));
assert.ok(extractedQuality.rejections[1]?.reasons.includes('index-like-evidence'));
assert.equal(validateExtractedFacts({
  facts: [{
    subCategory: 'Political',
    claim: 'Prakash is mentioned in the index of Indias Ancient Past by R.S. Sharma.',
    entities: ['Prakash'],
    dateOrEra: null,
    locator: 'Index',
    extractedText: 'Prakash 123',
  }],
}, ['Political']).length, 0);
assert.deepEqual(
  extractedFactQualityRejectionReasons({
    subCategory: 'Political',
    claim: 'King Bimbisara is traditionally reported to have summoned 86,000 village headmen.',
    entities: ['Bimbisara'],
    locator: 'p. 98',
    extractedText: 'Bimbisara summoned 86,000 village headmen.',
  }),
  [],
);

const extractionRequest = buildExtractionRequest({
  sourceTitle: 'Example',
  taxonomy: ['Political'],
  sourceText: 'Index material',
});
assert.match(extractionRequest.prompt.system, /index entries/i);
assert.match(extractionRequest.prompt.system, /empty facts array/i);

const style = {
  tone: 'direct',
  sentenceLength: 'short' as const,
  terminologyConventions: {},
  exampleStructure: 'Compact revision blocks.',
  avoid: ['source-like phrasing'],
};

const english = buildGenerationRequest({
  language: 'en',
  facts: graph,
  style,
  noteLevel: 'topic',
  targetLabel: 'Example period',
});
const hindi = buildGenerationRequest({
  language: 'hi',
  facts: graph,
  style,
  noteLevel: 'topic',
  targetLabel: 'Example period',
});
assert.match(english.prompt.system, /directly in en/);
assert.match(hindi.prompt.system, /directly in hi/);
assert.notEqual(english.prompt.system, hindi.prompt.system);
assert.match(english.prompt.user, /Low-frequency but still eligible claim/);
assert.doesNotMatch(english.prompt.user, /SOURCE PROSE/);

assert.deepEqual(validateNoteBlocks({
  blocks: [
    { type: 'text', content: '  concise note  ' },
    { type: 'figure', svgRef: null, placeholder: 'Map placeholder' },
  ],
}), [
  { type: 'text', content: 'concise note' },
  { type: 'figure', svgRef: null, placeholder: 'Map placeholder' },
]);

assert.equal(sourceOverlapScore('alpha beta gamma delta epsilon zeta eta', 'alpha beta gamma delta epsilon zeta theta'), 0.5);
assert.equal(sourceOverlapScore('one two three four five six', 'entirely different words here now please'), 0);

console.log('notes-studio-v2 core invariants: ok');
