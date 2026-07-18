# ExamTree admin panel integration

The complete Admin Prototype frontend is vendored into `artifacts/admin-app` and served from `/admin/` on the same Firebase Hosting site as the student application.

## Canonical source pin

- Repository: `gurudhiman75-hash/Admin-Prototype`
- Branch: `main`
- Canonical repair merge: `fda8626e69a596b2918da665d9f208a1f9801580`

That canonical repository contains the standalone admin frontend and the verified namespaced Drizzle schema/migrations on one normal Git history. Earlier prototype snapshots and disconnected branches are historical references only.

## Application boundaries

- `artifacts/examtree` remains the student-facing application.
- `artifacts/admin-app` owns all `/admin/**` routes.
- Firebase Hosting serves one domain and rewrites `/admin/**` to the dedicated admin bundle.
- The combined hosting build copies `artifacts/admin-app/dist/public` into `artifacts/examtree/dist/public/admin`.

## Authentication and authorization

- Firebase authentication state is shared because both applications run on the same origin.
- The admin login route returns users to the exact requested `/admin/**` path.
- Every live admin API request includes a Firebase ID token.
- The API verifies the token and resolves administrator access from canonical `identity.auth_identities`, `identity.user_roles`, and `identity.roles` records.
- Frontend route guards are not treated as a security boundary.

## Database boundary

ExamTree uses one canonical Neon database configured only through `DATABASE_URL`.

The database contains the namespaced schemas used by the complete platform:

- `identity`
- `catalog`
- `content`
- `platform`
- `operations`
- `assessment`
- `learning`

Student test delivery, result persistence, admin RBAC, Question Studio, Question Bank, and test publishing all use this same canonical connection. A second production database connection is forbidden by CI.

Never expose the connection string to Vite or browser code.

## Live Question Studio flow

The active admin route `/admin/content/studio` supports:

1. loading enabled Quant V4 generation packages;
2. generating a controlled batch with the existing ExamTree engine;
3. transactionally persisting a generation run, item records, immutable item versions, an audit event, and an outbox event;
4. loading generation history and current recipe versions;
5. inspecting question payloads, options, explanations, patterns, and metadata;
6. bulk approving, rejecting, marking needs-fix, or returning items to review;
7. recalculating the parent generation-run status after review decisions.

API routes are mounted under `/api/admin/question-studio`.

## Required deployment settings

The API deployment must define:

- `DATABASE_URL`
- Firebase Admin credentials used by the token verifier

The frontend deployment uses the existing public Firebase client settings. `VITE_API_URL` defaults to same-origin `/api`.

## Commands

- `pnpm run dev:admin`
- `pnpm run typecheck:admin`
- `pnpm run test:admin`
- `pnpm run build:admin`
- `pnpm --dir artifacts/api-server build`
- `pnpm run build:hosting`

## Validation

The integration workflow verifies:

- one canonical database configuration and no second database environment variable;
- locked workspace installation;
- production API bundle containing authenticated Question Studio, Question Bank, test publishing, and result routes;
- canonical admin identity and RBAC tests;
- complete admin typecheck and test suite;
- admin production build;
- student production build;
- combined Firebase hosting output containing both `/index.html` and `/admin/index.html`.
