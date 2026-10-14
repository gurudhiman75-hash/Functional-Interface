import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const gate = readFileSync('artifacts/admin-app/src/integrations/ExamTreeAdminGate.tsx', 'utf8');
const app = readFileSync('artifacts/admin-app/src/App.tsx', 'utf8');
test('Google login transitions to a visible state while Cloud Run validates role', () => {
 assert.match(gate, /await signInWithPopup\(auth, provider\)/);
 assert.match(gate, /onGoogleAuthenticated\(\)/);
 assert.match(gate, /setState\(\{ status: 'loading' \}\)/);
 assert.match(gate, /Verifying Firebase sign-in and checking your ExamTree admin role/);
});
test('admin API bootstrap cannot silently hang and exposes actionable failure', () => {
 assert.match(gate, /window\.setTimeout\(\(\) => controller\.abort\(\), 30000\)/);
 assert.match(gate, /signal: controller\.signal/);
 assert.match(gate, /ADMIN_BOOTSTRAP_TIMEOUT/);
 assert.match(gate, /ADMIN_BOOTSTRAP_NETWORK_ERROR/);
 assert.match(gate, /window\.clearTimeout\(timer\)/);
});
test('the previously shared admin URL points at the real Question Studio route', () => {
 assert.ok(app.includes("{path:'/question-studio',element:<Navigate to=\"/content/questions/generate\" replace/>}"));
 assert.ok(app.includes("{path:'/content/questions/generate',element:<QuestionStudioPage/>}"));
});
