import assert from 'node:assert/strict';

import {
  approvalVersionFingerprint,
  approvedContentHash,
  buildApprovedBody,
  canonicalNotePublicCode,
  evaluateNotesLocalization,
  localizationContentHash,
  type ApprovedSectionInput,
} from './approval-versioning';

const sections: ApprovedSectionInput[] = [
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Second',
    sortOrder: 2,
    markdown: 'Value is 42%.',
    outputFingerprint: 'b'.repeat(64),
    qualityRunId: '00000000-0000-4000-8000-000000000012',
    evidenceFingerprint: 'd'.repeat(64),
  },
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'First',
    sortOrder: 1,
    markdown: 'Visit https://example.com and remember 2026.',
    outputFingerprint: 'a'.repeat(64),
    qualityRunId: '00000000-0000-4000-8000-000000000011',
    evidenceFingerprint: 'c'.repeat(64),
  },
];

const body = buildApprovedBody(sections);
assert.equal(body.startsWith('## First'), true);
assert.equal(body.indexOf('## First') < body.indexOf('## Second'), true);

const fingerprintA = approvalVersionFingerprint({
  jobId: '00000000-0000-4000-8000-000000000099',
  sourceLanguage: 'en',
  learnerTitle: 'Canonical note',
  learnerSummary: 'Approved learner summary.',
  examIds: ['00000000-0000-4000-8000-000000000088'],
  brief: { depth: 'standard' },
  sections,
});
const fingerprintB = approvalVersionFingerprint({
  jobId: '00000000-0000-4000-8000-000000000099',
  sourceLanguage: 'en',
  learnerTitle: 'Canonical note',
  learnerSummary: 'Approved learner summary.',
  examIds: ['00000000-0000-4000-8000-000000000088'],
  brief: { depth: 'standard' },
  sections: [...sections].reverse(),
});
assert.equal(fingerprintA, fingerprintB);
assert.match(fingerprintA, /^[0-9a-f]{64}$/);

const contentHash = approvedContentHash({ title: 'Canonical note', summary: 'Summary', bodyMarkdown: body });
assert.match(contentHash, /^[0-9a-f]{64}$/);
assert.equal(canonicalNotePublicCode('12345678-1234-4123-8123-123456789abc'), 'NOTE_1234567812344123');
assert.equal(canonicalNotePublicCode('12345678-1234-4123-8123-123456789abc', 'hi'), 'NOTE_1234567812344123_HI');

const hindi = evaluateNotesLocalization({
  sourceTitle: 'Canonical note 2026',
  sourceSummary: 'The value is 42%.',
  sourceBodyMarkdown: '## First\n\nVisit https://example.com.\n\n## Second\n\nValue is 42%.',
  localizedTitle: 'कैनोनिकल नोट 2026',
  localizedSummary: 'मान 42% है।',
  localizedBodyMarkdown: '## पहला\n\nhttps://example.com देखें।\n\n## दूसरा\n\nमान 42% है।',
  languageCode: 'hi',
});
assert.equal(hindi.ready, true);
assert.equal(hindi.expectedScriptPresent, true);
assert.equal(hindi.headingCountMatches, true);
assert.deepEqual(hindi.missingUrls, []);

const missingProtectedValue = evaluateNotesLocalization({
  sourceTitle: 'Canonical note 2026',
  sourceSummary: 'The value is 42%.',
  sourceBodyMarkdown: '## First\n\nVisit https://example.com.',
  localizedTitle: 'ਕੈਨੋਨਿਕਲ ਨੋਟ 2026',
  localizedSummary: 'ਮੁੱਲ ਦਿੱਤਾ ਗਿਆ ਹੈ।',
  localizedBodyMarkdown: '## ਪਹਿਲਾ\n\nਵੇਰਵਾ।',
  languageCode: 'pa',
});
assert.equal(missingProtectedValue.ready, false);
assert.equal(missingProtectedValue.shared.approvable, false);
assert.deepEqual(missingProtectedValue.missingUrls, ['https://example.com']);

const localizationHash = localizationContentHash({
  approvedVersionId: '00000000-0000-4000-8000-000000000099',
  sourceContentHash: contentHash,
  languageCode: 'hi',
  title: 'कैनोनिकल नोट 2026',
  summary: 'मान 42% है।',
  bodyMarkdown: '## पहला\n\nमान 42% है।',
});
assert.match(localizationHash, /^[0-9a-f]{64}$/);

console.log('Notes Studio NS-006 approval/versioning/localization contracts passed');
