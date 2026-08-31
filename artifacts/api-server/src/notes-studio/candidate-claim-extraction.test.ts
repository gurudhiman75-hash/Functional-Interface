import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_CLAIM_EXTRACTION_BLOCKS,
  NOTES_CLAIM_EXTRACTION_PROMPT_VERSION,
  buildCandidateClaimInstruction,
  candidateClaimInputFingerprint,
  validateCandidateClaimExtraction,
  type ClaimExtractionInput,
} from './candidate-claim-extraction';

const input: ClaimExtractionInput = {
  jobId: 'job-1',
  noteTitle: 'Punjab Rivers',
  languageCode: 'en',
  blocks: [
    { id: 'block-a', sourceDocumentId: 'source-1', sourceTitle: 'Official source', excerpt: 'The Sutlej enters Punjab near Nangal.' },
    { id: 'block-b', sourceDocumentId: 'source-2', sourceTitle: 'Reference source', excerpt: 'The Sutlej enters Punjab near Nangal.' },
  ],
};

test('candidate extraction input is fingerprinted deterministically', () => {
  const first = candidateClaimInputFingerprint(input);
  const second = candidateClaimInputFingerprint({ ...input, blocks: [...input.blocks] });
  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(NOTES_CLAIM_EXTRACTION_PROMPT_VERSION, 'notes-claim-extraction-v1');
  assert.equal(MAX_CLAIM_EXTRACTION_BLOCKS, 40);
});

test('instruction explicitly preserves candidate-only and bounded-evidence boundaries', () => {
  const instruction = buildCandidateClaimInstruction(input);
  assert.match(instruction, /nothing you return is automatically accepted/i);
  assert.match(instruction, /ONLY the supplied evidence excerpts/i);
  assert.match(instruction, /Never invent an ID/i);
  assert.doesNotMatch(instruction, /full source document/i);
});

test('validator rejects provenance outside the editor-selected evidence set', () => {
  assert.throws(() => validateCandidateClaimExtraction({
    claims: [{
      claimText: 'The Sutlej enters Punjab near Nangal.',
      confidence: 0.98,
      contradictionKey: null,
      evidenceBlockIds: ['block-outside'],
    }],
  }, new Set(['block-a', 'block-b'])), /outside the editor-selected input set/);
});

test('validator deduplicates equivalent claim text and preserves exact provenance ids', () => {
  const result = validateCandidateClaimExtraction({
    claims: [
      {
        claimText: 'The Sutlej enters Punjab near Nangal.',
        confidence: 0.9811,
        contradictionKey: null,
        evidenceBlockIds: ['block-a', 'block-b', 'block-a'],
      },
      {
        claimText: '  the sutlej enters punjab near nangal.  ',
        confidence: 0.7,
        contradictionKey: null,
        evidenceBlockIds: ['block-b'],
      },
    ],
  }, new Set(['block-a', 'block-b']));
  assert.equal(result.claims.length, 1);
  assert.deepEqual(result.claims[0]?.evidenceBlockIds, ['block-a', 'block-b']);
  assert.equal(result.claims[0]?.confidence, 0.981);
});
