import assert from 'node:assert/strict';

import {
  NOTES_QUALITY_GROUNDING_PROMPT_VERSION,
  buildQualityGroundingInstruction,
  validateQualityGroundingResult,
} from './quality-grounding';

const allowed = new Set(['claim-a', 'claim-b']);
const emptyFindings = {
  unsupportedStatements: [],
  internalConflicts: [],
  offScopeStatements: [],
  timeSensitiveStatements: [],
};
const instruction = buildQualityGroundingInstruction({
  languageCode: 'en',
  coverageTitle: 'Punjab river system',
  syllabusRef: 'Punjab Geography / Rivers',
  examRationale: 'Map-based and factual questions frequently test river relationships.',
  sectionMarkdown: 'The Ravi is one of the rivers covered in this section.',
  claims: [{ id: 'claim-a', text: 'The Ravi is a river in the Indus basin system.' }],
});
assert.ok(NOTES_QUALITY_GROUNDING_PROMPT_VERSION.startsWith('notes-quality-grounding-'));
assert.match(instruction, /Use ONLY the accepted claims supplied below as factual authority\./);
assert.doesNotMatch(instruction, /SOURCE DOCUMENT|RAW SOURCE|source excerpt/i);
assert.match(instruction, /Coverage target: Punjab river system/);
assert.match(instruction, /offScopeStatements/);
assert.match(instruction, /timeSensitiveStatements/);
assert.match(instruction, /\[claim-a\]/);

{
  const result = validateQualityGroundingResult({
    ...emptyFindings,
    usedClaimIds: ['claim-a', 'claim-a'],
  }, allowed);
  assert.deepEqual(result.usedClaimIds, ['claim-a']);
  assert.equal(result.unsupportedStatements.length, 0);
  assert.equal(result.internalConflicts.length, 0);
  assert.equal(result.offScopeStatements.length, 0);
  assert.equal(result.timeSensitiveStatements.length, 0);
}

{
  const result = validateQualityGroundingResult({
    ...emptyFindings,
    unsupportedStatements: [{ excerpt: 'Unsupported statement', reason: 'No accepted claim supports this statement.' }],
    internalConflicts: [{ excerpt: 'Conflicting value', reason: 'This conflicts with an accepted claim.' }],
    offScopeStatements: [{ excerpt: 'Unrelated tangent', reason: 'This is outside the river-system coverage target.' }],
    timeSensitiveStatements: [{ excerpt: 'currently ranks first', reason: 'A current ranking can change over time.' }],
    usedClaimIds: ['claim-b'],
  }, allowed);
  assert.equal(result.unsupportedStatements.length, 1);
  assert.equal(result.internalConflicts.length, 1);
  assert.equal(result.offScopeStatements.length, 1);
  assert.equal(result.timeSensitiveStatements.length, 1);
}

assert.throws(() => validateQualityGroundingResult({
  ...emptyFindings,
  usedClaimIds: ['claim-outside-set'],
}, allowed), /unauthorized claim/);

assert.throws(() => validateQualityGroundingResult({
  ...emptyFindings,
  unsupportedStatements: [{ excerpt: '', reason: 'Missing excerpt' }],
  usedClaimIds: [],
}, allowed), /fields are invalid/);

assert.throws(() => validateQualityGroundingResult({
  unsupportedStatements: [],
  usedClaimIds: [],
}, allowed), /internalConflicts is invalid/);

console.log('Notes Studio NS-005 semantic grounding contracts passed');
