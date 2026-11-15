import { test } from 'node:test';
import assert from 'node:assert/strict';
import { profileVerificationError } from '../artifacts/examtree/src/lib/profile-verification-errors.ts';
import { profileStorageError } from '../artifacts/api-server/src/lib/profile-storage-error.ts';
test('CAPTCHA failures distinguish retryable expiry from website configuration errors', () => {
  assert.match(profileVerificationError('auth/captcha-check-failed'), /fresh challenge/);
  assert.match(profileVerificationError('auth/unauthorized-domain'), /not configured/);
  assert.match(profileVerificationError('auth/invalid-app-credential'), /auth\/invalid-app-credential/);
  assert.match(profileVerificationError('auth/quota-exceeded'), /quota/);
  assert.equal(profileVerificationError(undefined), null);
  assert.equal(profileVerificationError('auth/other'), null);
});
test('photo storage service errors do not become anonymous internal-server failures', () => {
  assert.equal(profileStorageError({code:403}).status, 503);
  assert.equal(profileStorageError({code:'403'}).code, 'PROFILE_STORAGE_ACCESS_DENIED');
  assert.equal(profileStorageError({code:404}).code, 'PROFILE_STORAGE_NOT_FOUND');
  assert.equal(profileStorageError({code:'23505'}), null);
  assert.equal(profileStorageError(null), null);
});
