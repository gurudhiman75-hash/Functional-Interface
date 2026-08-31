import assert from 'node:assert/strict';
import test from 'node:test';

import {
  NOTES_COVERAGE_GAP_RESEARCH_PROMPT_VERSION,
  buildCoverageGapResearchInstruction,
  coverageGapResearchInputFingerprint,
  validateCoverageGapResearchOutput,
  type CoverageGapResearchInput,
} from './coverage-gap-research';

const input: CoverageGapResearchInput = {
  jobId: 'job-1',
  noteTitle: 'Punjab Rivers',
  languageCode: 'en',
  gaps: [{
    id: 'coverage-1',
    title: 'Sutlej course in Punjab',
    syllabusRef: 'PB-GEO-RIVERS-SUTLEJ',
    priority: 'required',
    plannedDepth: 'standard',
    examRationale: 'Major static-GK topic.',
    status: 'partial',
    acceptedClaims: [{ id: 'claim-1', text: 'The Sutlej enters Punjab near Nangal.' }],
  }],
};

test('coverage-gap research input fingerprint is deterministic', () => {
  const first = coverageGapResearchInputFingerprint(input);
  const second = coverageGapResearchInputFingerprint({ ...input, gaps: [...input.gaps] });
  assert.equal(first, second);
  assert.match(first, /^[0-9a-f]{64}$/);
  assert.equal(NOTES_COVERAGE_GAP_RESEARCH_PROMPT_VERSION, 'notes-coverage-gap-research-v1');
});

test('instruction forbids factual answering, browsing and claim creation', () => {
  const instruction = buildCoverageGapResearchInstruction(input);
  assert.match(instruction, /Do NOT answer the research questions/i);
  assert.match(instruction, /do NOT invent factual claims/i);
  assert.match(instruction, /Do not browse/i);
  assert.match(instruction, /cannot create claims or learner content/i);
});

test('validator rejects coverage ids outside the supplied gap set', () => {
  assert.throws(() => validateCoverageGapResearchOutput({
    briefs: [{
      coverageItemId: 'outside',
      researchQuestions: ['What authoritative fact needs verification?'],
      evidenceNeeds: [{ description: 'An authoritative source addressing the target.', preferredSourceRole: 'primary_authority' }],
      researchQueries: ['authoritative target source'],
    }],
  }, new Set(['coverage-1'])), /outside the supplied gap set/);
});

test('validator preserves neutral bounded research metadata', () => {
  const result = validateCoverageGapResearchOutput({
    briefs: [{
      coverageItemId: 'coverage-1',
      researchQuestions: ['Which official or standard reference describes the remaining course details?'],
      evidenceNeeds: [{ description: 'A source that directly states the remaining course details required by the syllabus target.', preferredSourceRole: 'core_reference' }],
      researchQueries: ['Sutlej Punjab course standard reference', 'Sutlej Punjab course standard reference'],
    }],
  }, new Set(['coverage-1']));
  assert.equal(result.briefs.length, 1);
  assert.deepEqual(result.briefs[0]?.researchQueries, ['Sutlej Punjab course standard reference']);
  assert.equal(result.briefs[0]?.evidenceNeeds[0]?.preferredSourceRole, 'core_reference');
});
