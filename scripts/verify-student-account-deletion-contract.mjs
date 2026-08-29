import assert from 'node:assert/strict';
import fs from 'node:fs';

const route = fs.readFileSync(
  'artifacts/api-server/src/routes/student-account-deletion.ts',
  'utf8',
);
const middleware = fs.readFileSync(
  'artifacts/api-server/src/middlewares/require-recent-auth.ts',
  'utf8',
);
const policy = fs.readFileSync(
  'artifacts/api-server/src/domain/student-account-deletion.ts',
  'utf8',
);
const index = fs.readFileSync(
  'artifacts/api-server/src/routes/index.ts',
  'utf8',
);

assert.match(route, /router\.delete\(\s*"\/me"/);
assert.match(route, /ACCOUNT_DELETION_CONFIRMATION/);
assert.match(route, /requireRecentFirebaseAuthentication/);
assert.match(middleware, /REAUTH_REQUIRED/);
assert.match(policy, /RECENT_AUTH_MAX_AGE_SECONDS = 10 \* 60/);

for (const requiredErase of [
  'DELETE FROM learning.rank_snapshots',
  'DELETE FROM learning.score_revisions',
  'DELETE FROM learning.attempts',
  'DELETE FROM commerce.entitlements',
  'DELETE FROM identity.sessions',
  'DELETE FROM identity.user_roles',
  'DELETE FROM identity.student_profiles',
]) {
  assert.ok(route.includes(requiredErase), `missing erase step: ${requiredErase}`);
}

assert.ok(route.includes("display_name = 'Deleted user'"));
assert.ok(route.includes("status = 'disabled'::user_status"));
assert.ok(route.includes('deleted.examtree.invalid'));
assert.ok(route.includes('student.account.privacy_erased'));
assert.ok(route.includes('student.account.firebase_identity_deleted'));
assert.ok(route.includes('DELETION_PENDING'));
assert.ok(route.includes('auth_identities'));
assert.ok(route.includes('deleteUser(firebaseUid)'));
assert.ok(route.includes('retentionBasis'));
assert.ok(route.includes('financial-and-security-records'));

assert.ok(!route.includes('DELETE FROM identity.users'));
assert.ok(index.includes('studentAccountDeletionRouter'));
assert.ok(index.includes('router.use("/users", studentAccountDeletionRouter)'));

console.log('student account deletion contract guard: PASS');
