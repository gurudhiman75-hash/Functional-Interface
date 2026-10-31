# Explicit test access policy — release instructions

Scope: issue #3500. Separates test eligibility from the current price/sale status of a package. Existing orders, entitlement snapshots and attempts remain unchanged.

## Predeployment requirements

1. Back up and inspect the canonical assessment and commerce database; confirm its schema matches the versioned source migrations.
2. Apply `docs/database-migrations/2026-10-31-explicit-test-access-policies.sql` to staging first; **do not deploy the new routes before this migration**. Validate all test rows were backfilled and investigate premium classifications arising from old/archived priced products.
3. Confirm `SELECT COUNT(*) FROM assessment.tests` equals `SELECT COUNT(*) FROM commerce.test_access_policies` immediately after the migration (assuming no concurrent test creation).
4. Test user journeys in staging: free preview, purchased premium, not-purchased premium, expired and revoked entitlement, archived product, new paid package version, and series membership.
5. Apply migration to production only with approved release controls, then deploy API/admin app in a controlled rollout. Watch access-denied errors and preserve rollback options.

## Policy

- `free`: no purchase entitlement required, but normal publication/series progression rules still apply.
- `premium`: requires an active, unexpired entitlement for the test.
- Unclassified newly created tests default to **premium**, so no unclassified test becomes a free preview by mistake.
- The migration classifies a test as premium if **any historical priced canonical product version** contains it, even if the product is currently archived. This is deliberately conservative.
- Other existing tests are classified free. Any misclassified historical content must be corrected by an authorized admin.
- Activating an eligible positively priced package or version promotes existing automatic-free classifications to premium. Explicitly admin-set free previews are respected.
- Administrators can set either classification in the Packages workspace; a change reason and audit record are required.
- Deactivating or archiving a package does **not** downgrade its tests to free. An administrator must explicitly make that decision.

## Verification scope

Disposable PostgreSQL integration tests validate migration idempotency, historical paid memberships, archived offers, explicit free previews, automatic paid promotion, entitlement expiry and revocation, and new unclassified tests. The existing Commerce Freeze suite and admin builds must also remain green.

## Deployment boundaries

No production migration or deployment is part of the source-code PR. Do not mark this issue production-resolved until the staged and production rollout checks have been executed.
