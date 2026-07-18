# ExamTree frontend truth audit

Date: 2026-07-18

This document defines which frontend surfaces are connected to ExamTree's canonical APIs and database. Production navigation must expose only `LIVE` surfaces. Known unfinished routes may remain addressable only when they render an explicit pending-integration notice.

## Status definitions

- `LIVE`: backed by canonical API routes and namespaced database tables.
- `LIVE_INCOMPLETE`: uses canonical data for its primary journey but still contains secondary local or retired integrations.
- `PENDING`: design exists, canonical backend does not.
- `STATIC`: informational page with no operational data dependency.
- `RETIRED_PROTOTYPE`: browser/mock-backed operational UI that must not appear as real production state.

## Student application

| Route | Status | Current production behaviour | Next work |
| --- | --- | --- | --- |
| `/` | LIVE_INCOMPLETE | Public landing and canonical exam catalog entry points. | Audit all promotional claims and remove links to pending features. |
| `/tests`, `/exams` | LIVE | Lists canonical published tests. | Add pagination, richer filters, and API-backed counts. |
| `/category/:id`, `/subcategory/:id` | LIVE | Canonical test discovery by exam family/exam. | Improve empty states and mobile layouts. |
| `/published-tests/:id` | LIVE | Canonical published-test detail/runner bridge. | Add complete instruction and eligibility metadata. |
| `/test/:id` | LIVE | Test runner with canonical submission and result persistence. | Harden resume, offline, timer, duplicate-submit, and multi-tab behaviour. |
| `/result?attemptId=...` | LIVE_INCOMPLETE | Loads the canonical stored result snapshot. | Remove retired leaderboard/package/daily-challenge queries from the result page. |
| `/dashboard` | LIVE | Canonical server-backed attempt history and published-test count. | Add topic/section insights after analytics APIs exist. |
| `/profile` | LIVE_INCOMPLETE | Authentication/profile shell. | Persist editable profile fields canonically. |
| `/performance` | PENDING | Explicit analytics-unavailable page. | Build canonical ranking, percentile, weak-area, and trend APIs. |
| `/packages*`, `/my-packages` | PENDING | Explicit commerce-unavailable page. | Build packages, orders, Razorpay, coupons, and entitlements. |
| `/mock-tests`, `/pyqs`, SEO landing routes | LIVE_INCOMPLETE | Public discovery/content surfaces. | Verify content truth, canonical test links, and SEO metadata. |
| `/about`, `/contact`, policy pages, `/faq`, `/blog` | STATIC | Informational pages. | Legal/content review and contact-form persistence. |
| `/report-question` | LIVE_INCOMPLETE | Report UI exists. | Persist reports to canonical support/content-quality workflow. |

### Student navigation policy

Production sidebar exposes only:

1. Home
2. Tests & Exams
3. My Activity
4. Admin and Question Studio for authenticated administrators

Commerce and analytics links remain hidden until their canonical services are live.

## Admin application

### Live canonical workspaces

| Route | Status | Canonical responsibility |
| --- | --- | --- |
| `/dashboard` | LIVE | Truthful launchpad listing only live workspaces. |
| `/content/questions/generate` | LIVE | Question Studio generation, run/item persistence, review, and reconciliation. |
| `/content/questions` | LIVE | Canonical Question Bank list, taxonomy, lifecycle, and reconciliation. |
| `/content/questions/:id` | LIVE | Canonical question versions, editing, taxonomy, and lifecycle actions. |
| `/tests` | LIVE | Canonical test drafts, QA states, schedules, and published versions. |
| `/tests/:id` | LIVE | Canonical test detail, validation, lifecycle, schedule, and publication. |
| `/tests/builder` | LIVE | Build canonical test versions from approved questions. |

### Pending canonical integrations

These known routes render `PendingWorkspacePage`; they never render prototype records:

- Content review, coverage planner, taxonomy editor, DI/passage sets, media library
- Test QA workspace, test series, exam blueprints, publishing calendar
- Packages, orders, payments, coupons, entitlements
- Students, admin team, support requests, notifications
- Business, test, question, content-quality, and system-health analytics
- Exam configuration, languages, roles, branding, audit logs, integrations

### Retired prototype behaviour

The production admin shell no longer exposes:

- mock notification counts and events;
- prototype role switching;
- fake administrator names;
- the `PrototypeStoreProvider` as the runtime application store;
- mock entity search across students, orders, packages, support, and generated batches;
- an "all systems operational" claim without monitoring evidence.

Prototype files may remain temporarily as design references, but they are outside the production route graph and navigation.

## Canonical API boundary observed during audit

Mounted operational API groups:

- admin session and RBAC;
- Question Studio;
- Question Bank;
- Test Builder and publishing;
- categories/subcategories and published tests;
- test runner, submission, canonical results, and attempt history.

Compatibility/retired responses still exist for packages, bundles, leaderboard, daily challenge, billing, purchases, and several legacy writes. Frontend surfaces for those features must remain pending until replaced with canonical implementations.

## Ranked fire list

### P0 — production truth and reliability

1. Deploy and smoke-test this truth-surface change on the real Firebase/Render environment.
2. Remove retired queries from the result page while preserving canonical result display.
3. Add end-to-end tests for login, discovery, attempt, submit, refresh result, and attempt history.
4. Harden test runner recovery: refresh, network loss, duplicate submit, zero-time auto-submit, and multiple tabs.

### P1 — student value

1. Canonical analytics foundation: topic/section accuracy, time analysis, trends, rank, percentile.
2. Expand My Activity with recommended next tests and weak-area actions.
3. Canonical question reports and support workflow.
4. Complete profile persistence and account controls.

### P1 — content production

1. Improve Question Studio retries, duplicate detection, review speed, and traceability.
2. Complete Percentage and Ratio manual review.
3. Add Average, Profit & Loss, Interest, Time & Work, Speed/Distance, Mixture, Number System, Algebra, Geometry, Mensuration, Trigonometry, and DI.
4. Add Reasoning, English, General Awareness, Banking, Punjab GK, Punjabi, and Computer Knowledge engines.
5. Replace structural Hindi/Punjabi mirrors with reviewed localization.

### P2 — monetization and operations

1. Packages, orders, Razorpay verification, coupons, entitlements, refunds, and expiry.
2. Admin student/support/notification workspaces.
3. Monitoring, error tracking, rate limiting, backups, recovery drills, audit logs, staging, and load tests.

## Definition of done for exposing a pending route

A pending route may enter production navigation only when:

1. its primary reads and writes use canonical namespaced tables;
2. authentication and RBAC are enforced server-side;
3. loading, empty, error, and permission states are implemented;
4. destructive actions are auditable and recoverable;
5. API, typecheck, frontend build, and end-to-end tests pass;
6. the route contains no prototype/localStorage business records presented as real data.
