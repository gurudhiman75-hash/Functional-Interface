import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const index = read('artifacts/api-server/src/routes/index.ts');
const attempts = read('artifacts/api-server/src/routes/admin-attempts.ts');
const integrity = read('artifacts/api-server/src/routes/admin-attempt-integrity.ts');
const investigations = read('artifacts/api-server/src/routes/admin-attempt-investigations.ts');
const exportsRoute = read('artifacts/api-server/src/routes/admin-attempt-exports.ts');
const migration = read('docs/database-migrations/2026-07-25-attempt-abandonment-status.sql');
const app = read('artifacts/admin-app/src/App.tsx');
const nav = read('artifacts/admin-app/src/app/nav/navigation.ts');

const ordered = [
  'adminAttemptExportsRouter)',
  'adminAttemptInvestigationsRouter)',
  'adminAttemptIntegrityRouter)',
  'adminAttemptsRouter)',
].map((token) => index.indexOf(token));
assert(ordered.every((value) => value >= 0), 'Every Attempt Administration router must be mounted');
assert(ordered.every((value, index) => index === 0 || ordered[index - 1] < value), 'Specific attempt routers must be mounted before the generic router');

for (const source of [attempts, integrity, investigations, exportsRoute]) {
  assert(source.includes("requireAdminPermission('users.students.read')"), 'Every attempt module must enforce read RBAC');
  assert(!/SET\s+(raw_score|final_score|correct_count|incorrect_count|unattempted_count|result_snapshot)/i.test(source), 'Administrative modules must not mutate score evidence');
}

assert(attempts.includes("requireAdminPermission('users.students.manage')"), 'Attempt abandonment must require manage permission');
assert(attempts.includes('ATTEMPT_STATE_CHANGED'), 'Single-attempt abandonment must enforce optimistic concurrency');
assert(attempts.includes('ATTEMPT_NOT_STALE'), 'Attempt abandonment must enforce stale-state validation');
assert(attempts.includes("'student.attempt.abandoned'"), 'Attempt abandonment must be audited');
assert(integrity.includes("'student.attempt.review_note.added'"), 'Review notes must be immutable audit events');
assert(investigations.includes('ATTEMPT_INVESTIGATION_ALREADY_ACTIVE'), 'Duplicate active investigations must be rejected');
assert(investigations.includes('ATTEMPT_INVESTIGATION_REVIEW_REQUIRED'), 'Investigations must enter review before closure');
assert(investigations.includes('COUNT(*) FILTER (WHERE state ='), 'Investigation counts must be global aggregates, not filtered-row counts');
assert(exportsRoute.includes("'student.attempt.evidence_exported'"), 'Evidence exports must be audited');
assert(exportsRoute.includes("res.setHeader('Cache-Control', 'no-store')"), 'Evidence exports must not be cached');
assert(exportsRoute.includes('excludesAuthenticationIdentities: true'), 'Evidence exports must exclude authentication identities');
assert(exportsRoute.includes('excludesSessionsAndTokens: true'), 'Evidence exports must exclude sessions and tokens');
assert(migration.includes("ALTER TYPE %s ADD VALUE IF NOT EXISTS %L"), 'Abandoned status migration must be idempotent');
assert(migration.includes("typtype FROM pg_type"), 'Migration must detect enum-backed status columns');
assert(app.includes("path: '/users/attempts'"), 'Attempt directory route must exist');
assert(app.includes("path: '/users/attempt-investigations'"), 'Investigation route must exist');
assert(app.includes("path: '/users/attempt-exports'"), 'Evidence export route must exist');
assert(nav.includes("label: 'Attempt Administration'"), 'Attempt Administration navigation must exist');
assert(nav.includes("label: 'Attempt Investigations'"), 'Attempt Investigations navigation must exist');
assert(nav.includes("label: 'Attempt Evidence Exports'"), 'Attempt Evidence Exports navigation must exist');

console.log('Attempt Administration freeze contracts passed.');
