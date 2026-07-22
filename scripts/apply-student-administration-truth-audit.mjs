import { readFile, writeFile } from 'node:fs/promises';

const path = 'docs/frontend-truth-audit.md';
let content = await readFile(path, 'utf8');

function replaceOnce(search, replacement, label) {
  const first = content.indexOf(search);
  if (first < 0) throw new Error(`Missing truth-audit source: ${label}`);
  if (content.indexOf(search, first + search.length) >= 0) throw new Error(`Truth-audit source is not unique: ${label}`);
  content = content.slice(0, first) + replacement + content.slice(first + search.length);
}

replaceOnce('Date: 2026-07-21', 'Date: 2026-07-22', 'audit date');
replaceOnce(
  '| `/users/team` | LIVE | Canonical administrator invitations, profiles, reporting lines, role grants, suspension, disablement and session revocation. |',
  '| `/users/students` | LIVE | Read-only canonical student directory with server-side search, status/language filters, attempt summaries and honest empty state. |\n| `/users/students/:id` | LIVE | Canonical identity, account state, recent attempts, privacy-safe sessions and audit-derived account timeline. |\n| `/users/team` | LIVE | Canonical administrator invitations, profiles, reporting lines, role grants, suspension, disablement and session revocation. |',
  'student live routes',
);
replaceOnce(
  'The admin control plane reuses the existing `identity.users`, `identity.auth_identities`, `identity.admin_profiles`, `identity.roles`, `identity.permissions`, `identity.role_permissions`, `identity.user_roles`, and `identity.sessions` tables.',
  'Student Administration reuses `identity.users`, `identity.student_profiles`, `identity.auth_identities`, `identity.sessions`, `learning.attempts`, `assessment.test_publications`, `assessment.tests`, `assessment.test_versions`, and `platform.audit_events`. It requires no migration and its foundation release is read-only under `users.students.read`. Directory search and filters execute server-side, session IP addresses are masked before response serialization, refresh-token hashes are never returned, and only users with canonical `identity.student_profiles` are listed. Production currently has no student-profile rows, so the live workspace truthfully renders an empty canonical state rather than prototype records. Student suspension, session revocation, entitlement overrides and support notes remain a separate audited mutation release.\n\nThe admin control plane reuses the existing `identity.users`, `identity.auth_identities`, `identity.admin_profiles`, `identity.roles`, `identity.permissions`, `identity.role_permissions`, `identity.user_roles`, and `identity.sessions` tables.',
  'student foundation explanation',
);
replaceOnce('- Students\n- Test Analytics, Question Analytics and Content Quality', '- Test Analytics, Question Analytics and Content Quality', 'in-progress students entry');
replaceOnce(
  '- mock entity search across students, orders, packages, support, and generated batches;',
  '- mock entity search across students, orders, packages, support, and generated batches;\n- prototype student profiles, hard-coded attempts/devices/events, local suspension controls or browser-store entitlement actions presented as canonical Student Administration;',
  'retired prototype students',
);
replaceOnce(
  '- administrator team, role and permission management;\n- immutable audit-event exploration and export;',
  '- administrator team, role and permission management;\n- canonical read-only Student Administration directory, profile, attempts, masked sessions and account timeline;\n- immutable audit-event exploration and export;',
  'canonical API boundary',
);
replaceOnce(
  'Completed in the current releases: chapter-scoped duplicate intelligence and freeze governance, canonical System Health visibility, and canonical multilingual Translation Operations with language-specific publication gates and production schema activation.\n\n1. Complete canonical student administration: identity search, attempts, access state, sessions and account history.\n2. Connect the persistent request-exception sink and deploy/observe the background worker and outbox publisher through the live System Health surface.\n3. Complete canonical Exam Configuration and remove the final settings roadmap shell.',
  'Completed in the current releases: chapter-scoped duplicate intelligence and freeze governance, canonical System Health visibility, canonical multilingual Translation Operations with language-specific publication gates and production schema activation, and the read-only canonical Student Administration directory/profile foundation.\n\n1. Add audited Student Administration mutations: suspension/reactivation, session revocation and later entitlement/support operations.\n2. Connect the persistent request-exception sink and deploy/observe the background worker and outbox publisher through the live System Health surface.\n3. Complete canonical Exam Configuration and remove the final settings roadmap shell.',
  'ranked admin fire list',
);
replaceOnce(
  '2. Admin student/support/notification workspaces.',
  '2. Student mutation, support and notification workspaces.',
  'P2 student wording',
);

await writeFile(path, content, 'utf8');
console.log('Student Administration truth audit synchronized.');
