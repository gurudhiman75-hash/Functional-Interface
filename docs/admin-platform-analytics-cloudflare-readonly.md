# Admin Platform Analytics — Cloudflare Web Analytics bridge

## Scope

The `/admin/analytics/overview` admin page combines existing canonical Test Analytics and Business Analytics with a **read-only** Web Analytics aggregate.

Cloudflare Web Analytics is already enabled on the `examtree.in` zone with automatic beacon installation. No additional browser beacon should be added.

The new endpoint is `GET /api/admin/analytics/traffic?window=7|30`; it requires Firebase admin authentication and `users.students.read` authorization. It does **not** expose Cloudflare API credentials to the browser.

## Configuration required on the API service

Set the following **server-only** environment variables using the existing Secret Manager / Cloud Run secret deployment process:

- `CLOUDFLARE_ANALYTICS_READ_TOKEN`: a least-privilege Cloudflare API token with account Analytics **Read** access.
- `CLOUDFLARE_ANALYTICS_ACCOUNT_TAG`: the Cloudflare account ID for the Examtree site.
- `CLOUDFLARE_ANALYTICS_SITE_TAG`: the Web Analytics site tag (not the public beacon token).

Do not put any of these in `VITE_*` variables, frontend source, logs, GitHub, or chat. Grant the production API runtime service identity access only through the existing secret infrastructure; do not broaden worker or Question Studio permissions.

If these variables are absent or invalid, the route returns `503 TRAFFIC_NOT_CONFIGURED`. If the provider fails, the route returns a generic error without leaking headers or query credentials. The UI displays a failure/unconfigured state rather than zero traffic.

## Measurement and limitations

- `pageLoads`: Cloudflare Web Analytics `rumPageloadEventsAdaptiveGroups.count` for the configured site.
- `visits`: `sum.visits` from the same RUM groups, **not unique visitors**.
- Device and referring-host groupings are separate and can include direct/unknown referrers.
- Reporting is limited to 7 and 30 days; existing learning and commerce metrics continue to support 7/30/90/365.
- The API reports the sampling indicator when a grouping's sample interval exceeds 1. Do not present sampled counts as precise totals.
- These are measured client-side beacon events, not all requests, not distinct people, and not signed-in student counts.
- Visitor-to-registration conversion cannot be calculated from this bridge alone.
- Data is aggregated and read-only; there is no new database table, cookies, test-attempt instrumentation, or production Cloudflare setting change.

## Validation/release checklist

1. Validate frontend and API type checks; run the admin integration test suite.
2. With no token configured, confirm a properly authorized admin receives `503 TRAFFIC_NOT_CONFIGURED`.
3. Confirm a non-admin request is denied, and traffic credentials are absent from browser network responses.
4. Configure the secrets in a **staging** API revision and verify 7-day metrics match the Cloudflare dashboard within provider sampling and reporting-lag allowances.
5. Verify invalid 90/365 traffic requests return `400 TRAFFIC_WINDOW_UNSUPPORTED` without calling Cloudflare.
6. Check source dimensions and sample indicators; verify UI labels say *visits*, not *unique visitors*.
7. Production secret/configuration changes and deployment require separate explicit approval. Merging frontend/backend source is not a live cutover.
