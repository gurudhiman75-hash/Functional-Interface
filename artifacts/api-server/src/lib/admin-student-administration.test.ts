import assert from 'node:assert/strict';

import {
  StudentAdministrationError,
  assertExpectedStudentStatus,
  assertStudentUuid,
  maskStudentIp,
  normalizeStudentAccountAction,
  normalizeStudentActionRequest,
  normalizeStudentDirectoryQuery,
  planStudentAccountAction,
} from './admin-student-administration';

const defaults = normalizeStudentDirectoryQuery({});
assert.deepEqual(defaults, {
  search: null,
  searchPattern: null,
  status: null,
  language: null,
  page: 1,
  pageSize: 25,
  offset: 0,
});

const filtered = normalizeStudentDirectoryQuery({
  search: '  Gurbaj_100%  ',
  status: 'ACTIVE',
  language: 'PA',
  page: '3',
  pageSize: '40',
});
assert.equal(filtered.search, 'Gurbaj_100%');
assert.equal(filtered.searchPattern, '%Gurbaj\\_100\\%%');
assert.equal(filtered.status, 'active');
assert.equal(filtered.language, 'pa');
assert.equal(filtered.offset, 80);

assert.throws(
  () => normalizeStudentDirectoryQuery({ status: 'deleted' }),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'INVALID_STUDENT_STATUS',
);
assert.throws(
  () => normalizeStudentDirectoryQuery({ language: '../pa' }),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'INVALID_STUDENT_LANGUAGE',
);

assert.equal(assertStudentUuid('0e58d235-c58b-4be9-845d-289a46156bc8'), '0e58d235-c58b-4be9-845d-289a46156bc8');
assert.throws(
  () => assertStudentUuid('not-a-uuid'),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'INVALID_STUDENT_ID',
);

assert.equal(normalizeStudentAccountAction(' SUSPEND '), 'suspend');
assert.equal(normalizeStudentAccountAction('reactivate'), 'reactivate');
assert.equal(normalizeStudentAccountAction('revoke-sessions'), 'revoke-sessions');
assert.throws(
  () => normalizeStudentAccountAction('delete'),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'INVALID_STUDENT_ACTION',
);

assert.deepEqual(
  normalizeStudentActionRequest({
    reason: '  Repeated   suspicious sign-in activity  ',
    expectedStatus: 'ACTIVE',
  }),
  {
    reason: 'Repeated suspicious sign-in activity',
    expectedStatus: 'active',
  },
);
assert.throws(
  () => normalizeStudentActionRequest({ reason: 'too short' }),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'STUDENT_ACTION_REASON_REQUIRED',
);
assert.throws(
  () => normalizeStudentActionRequest({ reason: 'A sufficiently detailed reason', expectedStatus: 'deleted' }),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'INVALID_EXPECTED_STUDENT_STATUS',
);

assert.deepEqual(planStudentAccountAction({ action: 'suspend', currentStatus: 'active' }), {
  nextStatus: 'suspended',
  statusChanged: true,
  revokeActiveSessions: true,
});
assert.deepEqual(planStudentAccountAction({ action: 'suspend', currentStatus: 'suspended' }), {
  nextStatus: 'suspended',
  statusChanged: false,
  revokeActiveSessions: true,
});
assert.deepEqual(planStudentAccountAction({ action: 'reactivate', currentStatus: 'suspended' }), {
  nextStatus: 'active',
  statusChanged: true,
  revokeActiveSessions: false,
});
assert.deepEqual(planStudentAccountAction({ action: 'reactivate', currentStatus: 'active' }), {
  nextStatus: 'active',
  statusChanged: false,
  revokeActiveSessions: false,
});
assert.deepEqual(planStudentAccountAction({ action: 'revoke-sessions', currentStatus: 'suspended' }), {
  nextStatus: 'suspended',
  statusChanged: false,
  revokeActiveSessions: true,
});
assert.throws(
  () => planStudentAccountAction({ action: 'reactivate', currentStatus: 'disabled' }),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'STUDENT_ACTION_NOT_ALLOWED',
);

assert.doesNotThrow(() => assertExpectedStudentStatus({
  expectedStatus: 'active',
  currentStatus: 'suspended',
  desiredStatus: 'suspended',
}));
assert.throws(
  () => assertExpectedStudentStatus({
    expectedStatus: 'active',
    currentStatus: 'invited',
    desiredStatus: 'suspended',
  }),
  (error: unknown) => error instanceof StudentAdministrationError && error.code === 'STUDENT_STATE_CHANGED',
);

assert.equal(maskStudentIp('49.36.22.14'), '49.36.x.x');
assert.equal(maskStudentIp('2001:db8:85a3::8a2e:370:7334'), '2001:db8:…');
assert.equal(maskStudentIp(''), null);
assert.equal(maskStudentIp('private-host'), 'Redacted');

console.log('admin student administration contracts passed');
