# Test Analytics freeze readiness

## Decision

The source implementation is freeze-ready for its declared aggregate scope. Production release remains blocked until build, deployment and authenticated database verification succeed.

## Frozen scope

- Canonical attempt-volume and completion aggregates
- Immutable-publication performance
- Equal-window period comparison
- Aggregate cohort percentiles and score deciles
- Aggregate CSV export
- Analytics data-quality diagnostics

## Explicitly excluded

- Student rank or leaderboard position
- Section analytics
- Question analytics
- Any write, correction or repair of attempt data from analytics routes

## Audit fixes completed

1. Missing score and time baselines no longer become false negative-one-hundred-percent deltas.
2. Completion-rate comparison returns no baseline when the preceding period has no attempts.
3. CSV cells beginning with spreadsheet formula characters are neutralized before export.
4. Data-quality summary totals are calculated across the full matched publication set; only the visible detail list is capped.
5. Static export and quality routes are ordered before the dynamic publication route.

## Production verification still required

1. API build and admin typecheck/test/build on the release commit.
2. Authenticated requests against production-like PostgreSQL data for all three analytics endpoints.
3. Verification that the canonical schema contains every referenced attempt and publication column.
4. CSV download verification through the deployed proxy, including `Content-Disposition` and `Cache-Control: no-store`.
5. Cohort percentile checks for empty, one-row, fewer-than-ten-row and large samples.
6. RBAC verification for administrators with and without `users.students.read`.
7. Performance review with realistic attempt volume and query plans.

## Change policy after freeze

Only production-verification defects should modify this module until canonical response linkage is separately audited for section and question analytics.
