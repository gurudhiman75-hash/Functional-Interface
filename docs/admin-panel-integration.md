# ExamTree admin panel integration

The complete Admin Prototype frontend is vendored into `artifacts/admin-app` and served from `/admin/` on the same Firebase Hosting site as the student application.

## Source pin

- Repository: `gurudhiman75-hash/Admin-Prototyoe`
- Branch: `main`
- Imported commit: `81144ae5c7d3c0156af95141bfdf4c150e6d11dc`

## Boundaries

- `artifacts/examtree` remains the student-facing application.
- `artifacts/admin-app` owns all `/admin/**` routes.
- Firebase authentication state is shared by origin; the admin shell also requires the stored ExamTree role to be `admin`.
- Backend APIs remain responsible for token verification and authorization.
- The old `admin.tsx` and `admin-generator.tsx` files are retained temporarily for rollback, but active routing redirects to the new application.

## Commands

- `pnpm run dev:admin`
- `pnpm run typecheck:admin`
- `pnpm run build:admin`
- `pnpm run build:hosting`
