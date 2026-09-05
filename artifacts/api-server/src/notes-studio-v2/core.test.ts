import assert from 'node:assert/strict';

import {
  buildFactGraph,
  buildGenerationRequest,
  generationInputJson,
  sourceOverlapScore,
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

assert.equal(sourceOverlapScore('alpha beta gamma delta epsilon zeta eta', 'alpha beta gamma delta epsilon zeta theta'), 6, 1);
assert.equal(sourceOverlapScore('one two three four five six', 'entirely different words here now please'), 3, 0);

console.log('notes-studio-v2 core invariants: ok');
