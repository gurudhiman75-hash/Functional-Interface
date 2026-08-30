import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildSectionSynthesisInstruction,
  collectGeneratedClaimIds,
  renderGeneratedSection,
  synthesisInputFingerprint,
  validateGeneratedSection,
  type SectionSynthesisInput,
} from './section-synthesis';

const input: SectionSynthesisInput = {
  jobId: '00000000-0000-4000-8000-000000000001',
  languageCode: 'en',
  noteTitle: 'Fundamental Rights',
  coverageItem: {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Article 14',
    syllabusRef: 'Polity → Fundamental Rights',
    priority: 'required',
    plannedDepth: 'standard',
    examRationale: 'Frequently tested equality provision.',
  },
  claims: [
    { id: '00000000-0000-4000-8000-000000000003', text: 'Article 14 guarantees equality before law and equal protection of the laws.' },
    { id: '00000000-0000-4000-8000-000000000004', text: 'Article 14 applies to all persons.' },
  ],
};

test('section synthesis fingerprint is deterministic', () => {
  assert.equal(synthesisInputFingerprint(input), synthesisInputFingerprint(structuredClone(input)));
  assert.match(synthesisInputFingerprint(input), /^[0-9a-f]{64}$/);
});

test('synthesis prompt exposes claims but not source excerpts or source URLs', () => {
  const instruction = buildSectionSynthesisInstruction(input);
  assert.match(instruction, /accepted claims/i);
  assert.match(instruction, /Article 14 guarantees equality/);
  assert.doesNotMatch(instruction, /sourceDocumentId/);
  assert.doesNotMatch(instruction, /sourceUrl/);
  assert.doesNotMatch(instruction, /evidence excerpt/i);
});

test('generated blocks must cite only allowed claim IDs', () => {
  const valid = validateGeneratedSection({
    title: 'Article 14: Right to Equality',
    blocks: [
      {
        kind: 'paragraph',
        markdown: 'Article 14 establishes the constitutional guarantee of equality before law and equal protection of the laws.',
        claimIds: [input.claims[0]!.id],
      },
      {
        kind: 'exam_tip',
        markdown: '**Exam tip:** The protection is framed for all persons.',
        claimIds: [input.claims[1]!.id],
      },
    ],
  }, new Set(input.claims.map((claim) => claim.id)));

  assert.equal(valid.blocks.length, 2);
  assert.deepEqual(collectGeneratedClaimIds(valid), [input.claims[0]!.id, input.claims[1]!.id]);
  assert.match(renderGeneratedSection(valid), /Exam tip/);

  assert.throws(() => validateGeneratedSection({
    title: 'Unsafe section',
    blocks: [{ kind: 'paragraph', markdown: 'Unsupported fact.', claimIds: ['00000000-0000-4000-8000-999999999999'] }],
  }, new Set(input.claims.map((claim) => claim.id))), /outside its accepted input set/);
});

test('generated blocks cannot omit provenance', () => {
  assert.throws(() => validateGeneratedSection({
    title: 'Article 14',
    blocks: [{ kind: 'paragraph', markdown: 'Equality provision.', claimIds: [] }],
  }, new Set(input.claims.map((claim) => claim.id))), /must cite accepted claims/);
});
