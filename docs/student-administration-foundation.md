# Canonical Student Administration

Date: 2026-07-22

## Purpose

Replace the unmounted prototype student screens with an active administration workspace backed only by ExamTree's canonical namespaced database.

## Canonical sources

- `identity.users`
- `identity.student_profiles`
- `identity.auth_identities`
- `identity.sessions`
- `learning.attempts`
- `assessment.test_publications`
- `assessment.tests`
- `assessment.test_versions`
- `platform.audit_events`
- `platform.audit_event_changes`

No database migration is required. The production permission catalogue already contains `users.students.read` and `users.students.manage` with their intended role grants.

## Read foundation

- Server-side search by name, email, phone, registration code or canonical user ID.
- Account-status and preferred-language filters.
- Bounded pagination and canonical directory statistics.
- Student profile identity and account state.
- Recent canonical attempt inspection.
- Session visibility with IP masking and no refresh-token exposure.
- Timeline derived from identity, session, attempt and audit records.
- Honest loading, empty, not-found, error and permission-denied behaviour.
- Dedicated CI contracts proving the workspace remains canonical and prototype-store free.

## Audited account operations

Administrators with `users.students.manage` can:

- suspend an active or invited student and revoke active sessions transactionally;
- reactivate a suspended student without recreating revoked sessions;
- revoke active sessions without changing account status.

Every operation requires a meaningful reason, locks the canonical user row, supports idempotent retries, detects stale conflicting state, and appends an immutable `platform.audit_events` record. Actual status/session changes also append field-level `platform.audit_event_changes` evidence. Deleted or missing profiles are rejected, disabled accounts are not silently restored, Firebase authentication is not modified, and refresh-token hashes never leave the server.

## Production truth

At the start of the foundation release, production contained zero `identity.student_profiles`. The Students workspace therefore treats an empty directory as a valid canonical state. It does not display prototype students or infer student accounts from unrelated/orphan attempt rows.

## Read-foundation runtime validation evidence

A disposable Neon branch, `student-admin-pr67-runtime-validation` (`br-shy-art-atnxl13f`), was cloned from the production branch. A temporary canonical student, Firebase identity, active session and evaluated attempt were inserted only on that branch.

The production-shaped queries verified search/filtering, attempt aggregates, profile/authentication reads, attempt-to-publication joins and session selection without refresh-token hashes. The fixture returned one evaluated attempt with an average score of `72.5` and one active session. The server masking contract converted the fixture IP to `49.36.x.x`. The disposable branch was deleted after validation; production was not modified.

## Account-operation runtime validation evidence

A second disposable Neon branch, `student-account-operations-pr68-runtime-validation` (`br-super-tree-at3kuk08`), was cloned from production. Temporary student and session fixtures exercised the production-shaped transactional sequence.

Validation proved:

- suspension locked the student row, changed the account to `suspended`, and revoked two active sessions in one transaction;
- repeating suspension produced an audited idempotent no-op with no additional state change;
- standalone session revocation removed one newly created active session without changing the suspended account status;
- reactivation restored the account to `active` without recreating any revoked session;
- four immutable operation audit events and four field-level changes were stored with mandatory reasons and state metadata;
- the final account was active with zero active sessions.

The disposable branch was deleted after validation. Production schema and data were not modified.

## Still deferred

- Grant, revoke or extend entitlements.
- Add durable support notes.
- Inspect or modify payments.
- Direct Firebase account disablement or deletion.

These capabilities require their own canonical commerce/support contracts, retention rules and recovery paths.
