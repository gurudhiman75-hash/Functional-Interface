import assert from 'node:assert/strict';

import {
  classifyPasswordResetFailure,
  normalizeRecoveryEmail,
  validateManualRecovery,
  validateRecoveryEmail,
} from './account-recovery-contract';

assert.equal(normalizeRecoveryEmail('  Student@Example.COM '), 'student@example.com');
assert.equal(validateRecoveryEmail('student@example.com'), null);
assert.equal(validateRecoveryEmail('bad-email'), 'Enter a valid email address.');
assert.equal(validateRecoveryEmail(''), 'Enter your account email.');

assert.deepEqual(
  validateManualRecovery({
    identifier: 'STU-001',
    contactEmail: 'support@example.com',
    explanation: 'I no longer have access to my original email account.',
  }),
  {},
);

assert.deepEqual(
  validateManualRecovery({
    identifier: 'x',
    contactEmail: 'bad',
    explanation: 'Too short',
  }),
  {
    identifier: 'Enter your registered email or registration code.',
    contactEmail: 'Enter a valid contact email.',
    explanation: 'Explain the access problem in at least 20 characters.',
  },
);

assert.equal(
  classifyPasswordResetFailure({ code: 'auth/user-not-found' }),
  'accepted',
);
assert.equal(
  classifyPasswordResetFailure({ code: 'auth/invalid-email' }),
  'invalid-email',
);
assert.equal(
  classifyPasswordResetFailure({ code: 'auth/too-many-requests' }),
  'rate-limited',
);
assert.equal(
  classifyPasswordResetFailure({ code: 'auth/network-request-failed' }),
  'network',
);
assert.equal(classifyPasswordResetFailure(new Error('unexpected')), 'unavailable');

console.log('Web account recovery contract tests passed.');
