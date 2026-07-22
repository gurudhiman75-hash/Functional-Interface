import assert from 'node:assert/strict';

import {
  StudentAdministrationError,
  assertStudentUuid,
  maskStudentIp,
  normalizeStudentDirectoryQuery,
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

assert.equal(maskStudentIp('49.36.22.14'), '49.36.x.x');
assert.equal(maskStudentIp('2001:db8:85a3::8a2e:370:7334'), '2001:db8:…');
assert.equal(maskStudentIp(''), null);
assert.equal(maskStudentIp('private-host'), 'Redacted');

console.log('admin student administration contracts passed');
