import assert from 'node:assert/strict';

import {
  NOTES_QUALITY_POLICY_VERSION,
  evaluateNotesSectionQuality,
  notesQualityEvidenceFingerprint,
  type NotesSectionQualityInput,
} from './quality-gates';

const baseInput = (): NotesSectionQualityInput => ({
  sectionId: 'section-1',
  markdown: [
    '## Punjab river system',
    '',
    'The Punjab river system is organised around the Indus basin and its major tributaries. For exam revision, distinguish the eastern and western rivers and connect each river with its important tributaries, dams, and interstate relevance.',
    '',
    '- The river network is best revised basin-wise rather than as an isolated list.',
    '- Map-based questions frequently test relative position and tributary relationships.',
    '- Administrative and historical names should be kept separate from hydrological facts.',
  ].join('\n'),
  coveragePriority: 'required',
  plannedDepth: 'standard',
  activeConflictCount: 0,
  claims: [{
    id: 'claim-1',
    text: 'The Punjab river system forms part of the Indus basin.',
    state: 'accepted',
    coverageLinked: true,
    activeSupportCount: 1,
    supportEvidence: [{
      sourceId: 'source-1',
      excerptHash: 'a'.repeat(64),
      excerpt: 'The Indus river system includes the Jhelum, Chenab, Ravi, Beas and Sutlej among its major tributary rivers in the north-western subcontinent.',
    }],
  }],
  siblingSections: [{
    id: 'section-2',
    markdown: 'A separate section explains dams, irrigation projects, and river-water agreements with concise exam-oriented tables.',
  }],
});

{
  const result = evaluateNotesSectionQuality(baseInput());
  assert.equal(result.policyVersion, NOTES_QUALITY_POLICY_VERSION);
  assert.equal(result.passed, true);
  assert.equal(result.checks.find((check) => check.code === 'evidence_support')?.status, 'pass');
  assert.equal(result.checks.find((check) => check.code === 'contradiction_state')?.status, 'pass');
}

{
  const input = baseInput();
  input.claims[0] = { ...input.claims[0], state: 'rejected', activeSupportCount: 0, supportEvidence: [] };
  const result = evaluateNotesSectionQuality(input);
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((check) => check.code === 'evidence_support')?.status, 'fail');
}

{
  const input = baseInput();
  input.activeConflictCount = 1;
  const result = evaluateNotesSectionQuality(input);
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((check) => check.code === 'contradiction_state')?.status, 'fail');
}

{
  const copied = 'the indus river system includes the jhelum chenab ravi beas and sutlej among its major tributary rivers in the north western subcontinent';
  const input = baseInput();
  input.markdown = `${copied} ${copied} ${copied}`;
  input.claims[0].supportEvidence[0].excerpt = copied;
  const result = evaluateNotesSectionQuality(input);
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((check) => check.code === 'source_overlap')?.status, 'fail');
}

{
  const input = baseInput();
  const repeated = 'This paragraph repeats the same exam note content with enough words to trigger deterministic duplicate paragraph detection for quality review.';
  input.markdown = `${repeated}\n\n${repeated}`;
  const result = evaluateNotesSectionQuality(input);
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((check) => check.code === 'duplication')?.status, 'fail');
}

{
  const input = baseInput();
  input.markdown = '<script>alert(1)</script> unsafe note body';
  const result = evaluateNotesSectionQuality(input);
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((check) => check.code === 'formatting')?.status, 'fail');
}

{
  const one = notesQualityEvidenceFingerprint(baseInput());
  const reordered = baseInput();
  reordered.claims = [...reordered.claims].reverse();
  const two = notesQualityEvidenceFingerprint(reordered);
  assert.equal(one, two);
  assert.match(one, /^[0-9a-f]{64}$/);

  reordered.activeConflictCount = 2;
  assert.notEqual(notesQualityEvidenceFingerprint(reordered), one);
}

console.log('Notes Studio NS-005 quality gate contracts passed');
