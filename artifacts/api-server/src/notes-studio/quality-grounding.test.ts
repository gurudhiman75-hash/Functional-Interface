import assert from 'node:assert/strict';

import {
  NOTES_QUALITY_GROUNDING_PROMPT_VERSION,
  buildQualityGroundingInstruction,
  validateQualityGroundingResult,
} from './quality-grounding';

const allowed = new Set(['claim-a', 'claim-b']);
const instruction = buildQualityGroundingInstruction({
  languageCode: 'en',
  sectionMarkdown: 'The Ravi is one of the rivers covered in this section.',
  claims: [{ id: 'claim-a', text: 'The Ravi is a river in the Indus basin system.' }],
});
assert.ok(NOTES_QUALITY_GROUNDING_PROMPT_VERSION.startsWith('notes-quality-grounding-'));
assert.match(instruction, /Use ONLY the accepted claims supplied below as factual authority\./);
assert.doesNotMatch(instruction, /SOURCE DOCUMENT|RAW SOURCE|source excerpt/i);
assert.match(instruction, /\[claim-a\]/);

{
  const result = validateQualityGroundingResult({
    unsupportedStatements: [],
    usedClaimIds: ['claim-a', 'claim-a'],
  }, allowed);
  assert.deepEqual(result.usedClaimIds, ['claim-a']);
  assert.equal(result.unsupportedStatements.length, 0);
}

{
  const result = validateQualityGroundingResult({
    unsupportedStatements: [{ excerpt: 'Unsupported statement', reason: 'No accepted claim supports this statement.' }],
    usedClaimIds: ['claim-b'],
  }, allowed);
  assert.equal(result.unsupportedStatements.length, 1);
}

assert.throws(() => validateQualityGroundingResult({
  unsupportedStatements: [],
  usedClaimIds: ['claim-outside-set'],
}, allowed), /unauthorized claim/);

assert.throws(() => validateQualityGroundingResult({
  unsupportedStatements: [{ excerpt: '', reason: 'Missing excerpt' }],
  usedClaimIds: [],
}, allowed), /fields are invalid/);

console.log('Notes Studio NS-005 semantic grounding contracts passed');
