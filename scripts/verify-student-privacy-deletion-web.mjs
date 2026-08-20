import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('artifacts/examtree/src/App.tsx', 'utf8');
const page = fs.readFileSync('artifacts/examtree/src/pages/account-deletion.tsx', 'utf8');
const privacy = fs.readFileSync('artifacts/examtree/src/pages/privacy-policy.tsx', 'utf8');
const footer = fs.readFileSync('artifacts/examtree/src/components/PublicFooter.tsx', 'utf8');
const auth = fs.readFileSync('artifacts/examtree/src/lib/auth.ts', 'utf8');

assert.ok(app.includes('import("@/pages/account-deletion")'));
assert.ok(app.includes('<Route path="/account-deletion"'));
assert.ok(app.includes('<Route path="/privacy"'));
assert.ok(app.includes('<Route path="/privacy-policy"'));

assert.ok(page.includes('apiRequest<DeletionResponse>("/users/me"'));
assert.ok(page.includes('method: "DELETE"'));
assert.ok(page.includes('DELETE MY ACCOUNT'));
assert.ok(page.includes('REAUTH_REQUIRED'));
assert.ok(page.includes('/login/student?next='));
assert.ok(page.includes('clearStudentLocalData()'));
assert.ok(!page.includes('deleteUser('));

assert.ok(auth.includes('deleteCurrentStudentAccount'));
assert.ok(auth.includes('apiRequest<StudentAccountDeletionResponse>("/users/me"'));
assert.ok(auth.includes('method: "DELETE"'));
assert.ok(auth.includes('DELETE MY ACCOUNT'));
assert.ok(!auth.includes('deleteUser,'));
assert.ok(!auth.includes('deleteUser(auth.currentUser)'));

assert.ok(privacy.includes('Account deletion'));
assert.ok(privacy.includes('Limited retention'));
assert.ok(privacy.includes('support@examtree.in'));
assert.ok(privacy.includes('/account-deletion'));

assert.ok(footer.includes('{ label: "Privacy Policy", href: "/privacy" }'));
assert.ok(footer.includes('{ label: "Delete Account", href: "/account-deletion" }'));

console.log('student privacy/deletion web guard: PASS');
