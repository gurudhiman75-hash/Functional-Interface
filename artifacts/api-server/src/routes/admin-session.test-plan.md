# Admin identity RBAC route coverage

The production route is deliberately wired to real Firebase verification and the two database clients. Automated API coverage should run against the deployment's disposable admin database with Firebase Admin mocked at its boundary:

- no `Authorization` header returns `401` from `authenticate`;
- a verified Firebase user whose legacy `users.role` is not `admin` receives `403` and writes no identity rows;
- the first verified legacy admin creates one `identity.users` row, one `identity.admin_profiles` row, a `super_admin` user-role link, and the three required audit events;
- a repeated bootstrap is idempotent (no duplicate profile, link, or audit records);
- `requireAdminPermission` permits keys resolved through `role_permissions` and rejects missing keys with `403`;
- Question Studio returns `403` for read/run/review requests whose effective permissions lack the corresponding `content.generation.*` key.

This repository currently has no API HTTP-test runner or disposable admin-schema fixture. The pure effective-permission assertion lives in `src/lib/admin-rbac.test.ts`; the remaining cases are intentionally specified here rather than introducing a database migration or test-only schema that could touch the student database.
