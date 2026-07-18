# ExamTree admin panel integration

The complete admin application lives in `artifacts/admin-app` and is served from `/admin/` on the same Firebase Hosting site as the student application.

## Application boundaries

- `artifacts/examtree` is the student-facing application.
- `artifacts/admin-app` owns all `/admin/**` routes.
- Firebase Hosting serves both bundles on one origin.
- The hosting assembly copies `artifacts/admin-app/dist/public` into `artifacts/examtree/dist/public/admin`.

## Authentication and authorization

- Firebase authentication state is shared because both applications use the same origin.
- Every protected API request includes a Firebase ID token.
- The API verifies the token and resolves the Firebase UID through `identity.auth_identities`.
- Administrative access is granted only by active canonical RBAC rows in `identity.user_roles` and `identity.roles`.
- Frontend route guards are not a security boundary.

## Database architecture

ExamTree uses one canonical Neon database configured only through `DATABASE_URL`.

The database contains the namespaced schemas used by the platform, including:

- `identity`
- `catalog`
- `content`
- `assessment`
- `learning`
- `operations`
- `platform`

Runtime code must use schema-qualified canonical SQL through the single `sqlClient` exported by `artifacts/api-server/src/lib/db.ts`.

The former public-schema database, public-schema Drizzle configuration, and runtime routes for legacy tests, attempts, responses, commerce, leaderboard, catalog snapshots, and generators have been retired. No runtime migration may recreate those tables.

Never expose `DATABASE_URL` to Vite or browser code.

## Canonical runtime routes

Student runtime:

- published-test discovery and delivery;
- canonical submission and scoring;
- durable result snapshots in `learning.attempts`;
- canonical attempt history;
- canonical identity profile creation and lookup.

Administration:

- `/api/admin/session`
- `/api/admin/question-studio`
- `/api/admin/questions`
- `/api/admin/tests`

Question Studio persists generation runs, immutable item versions, review decisions, audit events, and outbox events in the canonical namespaced database.

## Required deployment settings

The API deployment must define:

- `DATABASE_URL`
- Firebase Admin credentials used by the token verifier

The frontend uses the public Firebase client configuration and the configured API base URL.

## Validation

The integration workflow verifies:

- the canonical database freeze guard;
- exactly one runtime PostgreSQL client;
- absence of transitional database variables and compatibility clients;
- absence of retired public-schema route files;
- canonical admin RBAC and content-management tests;
- API, admin, and student production builds;
- combined Firebase hosting output.

Run the freeze check locally with:

```bash
node scripts/check-canonical-db-freeze.mjs
```
