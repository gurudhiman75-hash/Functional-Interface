import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_CLAIM_EXTRACTION_BLOCKS,
  NOTES_CLAIM_EXTRACTION_PROMPT_VERSION,
  buildCandidateClaimInstruction,
  candidateClaimInputFingerprint,
  candidateEvidenceBlockEligible,
  validateCandidateClaimExtraction,
  type ClaimExtractionInput,
} from './candidate-claim-extraction';

const input: ClaimExtractionInput = {
  jobId: 'job-1',
  noteTitle: 'Punjab Rivers',
  languageCode: 'en',
  blocks: [
    {
      id: 'block-a',
      sourceDocumentId: 'source-1',
      sourceTitle: 'Official source',
      evidenceKind: 'retained_excerpt',
      excerpt: 'The Sutlej enters Punjab near Nangal.',
    },
    {
      id: 'block-b',
      sourceDocumentId: 'source-2',
      sourceTitle: 'Reference source',
      evidenceKind: 'editor_reference_note',
      excerpt: 'The reviewed source identifies Ravi, Beas and Sutlej as rivers flowing through present-day Punjab.',
    },
  ],
};

test('candidate extraction input is fingerprinted deterministically and uses the evidence-aware prompt', () => {
  const first = candidateClaimInputFingerprint(input);
  const second = candidateClaimInputFingerprint({ ...input, blocks: [...input.blocks] });
  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(NOTES_CLAIM_EXTRACTION_PROMPT_VERSION, 'notes-claim-extraction-v2');
  assert.equal(MAX_CLAIM_EXTRACTION_BLOCKS, 40);
});

test('candidate evidence eligibility accepts governed retained excerpts and reviewed reference notes only', () => {
  assert.equal(candidateEvidenceBlockEligible({
    evidenceKind: 'retained_excerpt',
    retentionMode: 'extracted_text',
    extractionStatus: 'processed',
  }), true);
  assert.equal(candidateEvidenceBlockEligible({
    evidenceKind: 'retained_excerpt',
    retentionMode: 'metadata_only',
    extractionStatus: 'metadata_only',
  }), false);
  assert.equal(candidateEvidenceBlockEligible({
    evidenceKind: 'editor_reference_note',
    reviewedAt: '2026-08-31T08:00:00Z',
    retentionMode: 'metadata_only',
    extractionStatus: 'metadata_only',
  }), true);
  assert.equal(candidateEvidenceBlockEligible({
    evidenceKind: 'editor_reference_note',
    reviewedAt: null,
    retentionMode: 'metadata_only',
    extractionStatus: 'metadata_only',
  }), false);
  assert.equal(candidateEvidenceBlockEligible({ evidenceKind: 'unknown' }), false);
});

test('instruction preserves candidate-only boundaries and distinguishes editor reference notes from publisher text', () => {
  const instruction = buildCandidateClaimInstruction(input);
  assert.match(instruction, /nothing you return is automatically accepted/i);
  assert.match(instruction, /ONLY the supplied evidence blocks/i);
  assert.match(instruction, /editor_reference_note/i);
  assert.match(instruction, /NOT publisher wording/i);
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
