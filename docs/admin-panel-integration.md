# ExamTree admin panel integration

The complete Admin Prototype frontend is vendored into `artifacts/admin-app` and served from `/admin/` on the same Firebase Hosting site as the student application.

## Source pin

- Repository: `gurudhiman75-hash/Admin-Prototyoe`
- Branch: `main`
- Imported commit: `81144ae5c7d3c0156af95141bfdf4c150e6d11dc`

The private `Admin-Prototype` repository remains the source of the namespaced Drizzle schema and migrations. UI and database histories are deliberately kept separate and pinned.

## Application boundaries

- `artifacts/examtree` remains the student-facing application.
- `artifacts/admin-app` owns all `/admin/**` routes.
- The old `admin.tsx` and `admin-generator.tsx` files are retained temporarily for rollback, but active routing redirects to the new application.
- Firebase Hosting serves one domain and rewrites `/admin/**` to the dedicated admin bundle.
- The combined hosting build copies `artifacts/admin-app/dist/public` into `artifacts/examtree/dist/public/admin`.

## Authentication and authorization

- Firebase authentication state is shared because both applications run on the same origin.
- The admin shell requires the stored ExamTree profile role to be `admin` and a current Firebase session.
- Every live admin API request includes a Firebase ID token.
- The API verifies the token and independently confirms the administrator role against the existing ExamTree `public.users` table.
- Frontend route guards are not treated as a security boundary.

## Database boundary

ExamTree currently uses two database connections:

- `DATABASE_URL` — existing student platform and legacy/public schema.
- `ADMIN_DATABASE_URL` — new namespaced admin schema (`identity`, `catalog`, `content`, `platform`, `operations`, `assessment`, and `learning`).

The separation is intentional. The new Neon project does not contain the legacy student tables, while the legacy ExamTree project does not contain the new namespaced admin tables. The API performs the Firebase/admin-role check through `DATABASE_URL`, then Question Studio persistence through `ADMIN_DATABASE_URL`.

Never expose either connection string to Vite or browser code.

## Live Question Studio flow

The active admin route `/admin/content/studio` now supports:

1. loading enabled Quant V4 generation packages;
2. generating a controlled batch with the existing ExamTree engine;
3. transactionally persisting a generation run, item records, immutable item versions, an audit event, and an outbox event;
4. loading generation history and current recipe versions from Neon;
5. inspecting question payloads, options, explanations, patterns, and metadata;
6. bulk approving, rejecting, marking needs-fix, or returning items to review;
7. recalculating the parent generation-run status after review decisions.

API routes are mounted under `/api/admin/question-studio`.

## Required deployment settings

The API deployment must define:

- `DATABASE_URL`
- `ADMIN_DATABASE_URL`
- Firebase Admin credentials used by the existing token verifier

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

- locked workspace installation;
- shared workspace-library typecheck;
- production API bundle with the admin Question Studio route;
- complete admin typecheck and test suite;
- admin production build;
- student production build;
- combined Firebase hosting output containing both `/index.html` and `/admin/index.html`.
