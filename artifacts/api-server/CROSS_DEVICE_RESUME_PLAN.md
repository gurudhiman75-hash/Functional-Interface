# Cross-Device Resume Backend Plan

## File-by-file implementation plan

- `lib/db/src/index.ts`: add the `attemptDrafts` Drizzle table for in-progress resumable state.
- `lib/db/src/index.d.ts`: expose `attemptDrafts` for consumers that still read the declaration shim.
- `artifacts/api-server/migrations/20260608_attempt_drafts.sql`: provide the standalone SQL migration for production review/application.
- `artifacts/api-server/migrate.ts`: add the same idempotent `attempt_drafts` DDL to the existing migration runner.
- `artifacts/api-server/src/types/attempt-drafts.ts`: define the draft state, request, and row types plus a small state validator.
- `artifacts/api-server/src/services/attempt-draft-service.ts`: centralize list/get/save/delete/cleanup behavior and stale-version detection.
- `artifacts/api-server/src/routes/attempt-drafts.ts`: expose authenticated draft APIs under `/api/attempt-drafts`.
- `artifacts/api-server/src/routes/index.ts`: mount the draft router.
- `artifacts/api-server/src/routes/attempts.ts`: delete the owned draft inside the existing final-submit transaction after the attempt and responses are written.

## Migration plan

1. Deploy the backend code.
2. Run the idempotent migration through the existing command:
   `pnpm --dir artifacts/api-server run db:migrate`
3. Confirm `attempt_drafts`, `attempt_drafts_user_updated_idx`, and `attempt_drafts_user_test_idx` exist.
4. Confirm the `attempt_drafts_set_updated_at` trigger exists.
5. Release web/mobile clients that save and restore drafts through `/api/attempt-drafts`.

## Rollback plan

1. Roll back the backend/client code that calls `/api/attempt-drafts`.
2. Existing completed attempts remain safe because `attempts`, `responses`, analytics, and leaderboard are unchanged.
3. If the table must be removed after code rollback:
   ```sql
   DROP TRIGGER IF EXISTS attempt_drafts_set_updated_at ON attempt_drafts;
   DROP FUNCTION IF EXISTS set_attempt_drafts_updated_at();
   DROP TABLE IF EXISTS attempt_drafts;
   ```
4. No historical data migration is needed because the table only stores unfinished drafts.
