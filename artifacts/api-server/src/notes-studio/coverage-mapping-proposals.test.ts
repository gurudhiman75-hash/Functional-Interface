import assert from 'node:assert/strict';
import test from 'node:test';

import {
  NOTES_COVERAGE_PROPOSAL_PROMPT_VERSION,
  buildCoverageProposalInstruction,
  coverageProposalInputFingerprint,
  validateCoverageProposalOutput,
  type CoverageProposalInput,
} from './coverage-mapping-proposals';

const input: CoverageProposalInput = {
  jobId: 'job-1',
  noteTitle: 'Punjab Rivers',
  languageCode: 'en',
  claims: [
    { id: 'claim-1', text: 'The Sutlej enters Punjab near Nangal.' },
    { id: 'claim-2', text: 'The Beas joins the Sutlej at Harike.' },
  ],
  coverageItems: [
    { id: 'coverage-1', title: 'Sutlej', syllabusRef: 'PB-GEO-RIVERS-SUTLEJ', priority: 'required', plannedDepth: 'standard', examRationale: 'Major Punjab river.' },
    { id: 'coverage-2', title: 'River confluences', syllabusRef: 'PB-GEO-RIVERS-CONFLUENCE', priority: 'high', plannedDepth: 'standard', examRationale: 'Common factual questions.' },
  ],
};

test('coverage proposal input fingerprint is deterministic', () => {
  const first = coverageProposalInputFingerprint(input);
  const second = coverageProposalInputFingerprint({ ...input, claims: [...input.claims] });
  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(NOTES_COVERAGE_PROPOSAL_PROMPT_VERSION, 'notes-coverage-proposals-v1');
});

test('instruction makes reviewed-apply boundary explicit', () => {
  const instruction = buildCoverageProposalInstruction(input);
  assert.match(instruction, /accepted by an editor/i);
  assert.match(instruction, /editor will review/i);
  assert.match(instruction, /Do not invent claims, coverage items, IDs/i);
});

test('validator rejects claims or coverage ids outside the authorized input set', () => {
  assert.throws(() => validateCoverageProposalOutput({
    proposals: [{ claimId: 'claim-outside', coverageItemIds: ['coverage-1'], confidence: 0.9, rationale: 'Relevant.' }],
  }, new Set(['claim-1']), new Set(['coverage-1'])), /outside the accepted input set/);

  assert.throws(() => validateCoverageProposalOutput({
    proposals: [{ claimId: 'claim-1', coverageItemIds: ['coverage-outside'], confidence: 0.9, rationale: 'Relevant.' }],
  }, new Set(['claim-1']), new Set(['coverage-1'])), /outside the supplied plan/);
});

test('validator preserves bounded unique mappings and rounds confidence', () => {
  const result = validateCoverageProposalOutput({
    proposals: [{
      claimId: 'claim-2',
      coverageItemIds: ['coverage-2', 'coverage-2'],
      confidence: 0.9349,
      rationale: 'The accepted confluence fact directly supports this target.',
    }],
  }, new Set(['claim-1', 'claim-2']), new Set(['coverage-1', 'coverage-2']));
  assert.deepEqual(result.proposals[0]?.coverageItemIds, ['coverage-2']);
  assert.equal(result.proposals[0]?.confidence, 0.935);
});
