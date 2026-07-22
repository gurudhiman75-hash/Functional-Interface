# Canonical Student Administration foundation

Date: 2026-07-22

## Purpose

Replace the unmounted prototype student screens with an active, read-only administration workspace backed only by ExamTree's canonical namespaced database.

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

No database migration is required. The production permission catalogue already contains `users.students.read` and `users.students.manage`; this release uses only the read permission.

## Delivered foundation

- Server-side search by name, email, phone, registration code or canonical user ID.
- Account-status and preferred-language filters.
- Bounded pagination and canonical directory statistics.
- Student profile identity and account state.
- Recent canonical attempt inspection.
- Session visibility with IP masking and no refresh-token exposure.
- Read-only timeline derived from identity, session, attempt and audit records.
- Honest loading, empty, not-found, error and permission-denied behaviour.
- Dedicated CI contract proving the route remains read-only and prototype-store free.

## Production truth

At the start of this release, production contained zero `identity.student_profiles`. The Students workspace therefore treats an empty directory as a valid canonical state. It does not display prototype students or infer student accounts from unrelated/orphan attempt rows.

## Explicitly deferred mutation release

- Suspend or reactivate a student.
- Revoke student sessions.
- Grant, revoke or extend entitlements.
- Add support notes.
- Inspect or modify payments.

These actions require mandatory reasons, confirmation UX, transactional guards and immutable `platform.audit_events` evidence in a separate release.
