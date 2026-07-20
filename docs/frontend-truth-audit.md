# ExamTree frontend truth audit

Date: 2026-07-20

This document defines which frontend surfaces are connected to ExamTree's canonical APIs and database. Student production navigation exposes only usable student journeys. The admin console exposes its complete intended information architecture, but every workspace is explicitly labelled `LIVE`, `IN_PROGRESS`, or `PLANNED`; non-live routes render an honest roadmap page and never display prototype records.

## Status definitions

- `LIVE`: backed by canonical API routes and namespaced database tables.
- `LIVE_INCOMPLETE`: uses canonical data for its primary journey but still contains secondary local or retired integrations.
- `IN_PROGRESS`: visible in the admin roadmap and actively prioritised, but its canonical operational workflow is not ready.
- `PENDING` / `PLANNED`: design or product scope exists, canonical backend does not.
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

### Admin navigation policy

The admin console displays the complete product map rather than only the currently implemented subset. Each item carries a visible status:

- `Live`: fully operational canonical workspace.
- `Next`: an `IN_PROGRESS` workspace in the active implementation queue.
- `Planned`: visible roadmap scope without a canonical implementation yet.

Selecting a non-live item opens `PendingWorkspacePage`, which shows its purpose, current status, activation milestone, canonical-data requirement, and release standard. It never renders mock business records.

The compact sidebar must retain every navigation icon and show a status dot; collapsing navigation must not make workspaces disappear.

### Live canonical workspaces

| Route | Status | Canonical responsibility |
| --- | --- | --- |
| `/dashboard` | LIVE | Truthful launchpad for canonical workflows. |
| `/content/questions/generate` | LIVE | Question Studio generation, quality gates, immutable revision, regeneration, review, and conversion. |
| `/content/questions` | LIVE | Canonical Question Bank list, taxonomy, lifecycle, and reconciliation. |
| `/content/questions/:id` | LIVE | Canonical question versions, editing, taxonomy, and lifecycle actions. |
| `/content/review` | LIVE | Unified generated/authored queue, reviewer ownership, threaded discussion, SLA ageing, lifecycle actions and current-versus-previous comparison. |
| `/content/coverage` | LIVE | Exam-version coverage targets and recursive Question Bank readiness rollups. |
| `/content/taxonomy` | LIVE | Canonical taxonomy node, edge, exam mapping, activation and target management. |
| `/tests` | LIVE | Canonical test drafts, QA states, schedules, and published versions. |
| `/tests/:id` | LIVE | Canonical test detail, validation, lifecycle, schedule, and publication. |
| `/tests/builder` | LIVE | Build canonical test versions from approved questions. |
| `/tests/qa` | LIVE | Canonical QA queue, reviewer ownership, issue resolution, immutable version comparison, candidate-content preview and server-enforced approval/publication gate. |

The taxonomy release uses the existing `catalog.taxonomy_nodes`, `catalog.taxonomy_edges`, and `catalog.exam_taxonomy_nodes` tables. It requires no schema migration. All writes require `content.taxonomy.manage`, are transactionally validated, cycle-safe, soft-archivable, and recorded in `platform.audit_events`. Coverage counts use the canonical current question version and recursively roll descendant links into parent nodes; leaf-only summaries avoid double counting.

Content Review coordinates the existing Question Studio and Question Bank lifecycle engines instead of creating another approval engine. Reviewer assignments, comments, replies, resolutions and ownership changes are immutable `platform.audit_events`; generated-item ownership is also reflected in `content.generation_run_items.reviewer_user_id`. Saved review views are browser UI preferences only and contain filters, not business records.

Test QA extends the existing canonical test lifecycle rather than replacing it. It reads `assessment.tests`, `assessment.test_versions`, `assessment.test_sections`, `assessment.test_questions`, and `assessment.test_publications`; reviewer assignment, comments, replies, resolutions and reopen events are immutable `platform.audit_events`. Approval, scheduling and publication are blocked server-side until the current test version has an assigned reviewer, no unresolved QA comments, and no existing structural/content validation errors. No database migration is required.

### In-progress admin workspaces

These are visible with a `Next` badge and render roadmap detail until canonical integration is complete:

- Test Series and Exam Blueprints
- Students and Admin Team
- Test Analytics, Question Analytics, Content Quality, System Health
- Exam Configuration, Languages, Roles & Permissions, Audit Logs

### Planned admin workspaces

These remain visible with a `Planned` badge:

- DI & Passage Sets, Media Library
- Publishing Calendar
- Packages, Orders & Payments, Coupons, Entitlements
- Support Requests, Notifications
- Business Analytics
- Branding and Integrations

### Retired prototype behaviour

The production admin shell does not expose:

- mock notification counts and events;
- prototype role switching;
- fake administrator names;
- the `PrototypeStoreProvider` as the runtime application store;
- mock entity search across students, orders, packages, support, and generated batches;
- an "all systems operational" claim without monitoring evidence;
- the former browser-store coverage tree or locally calculated mock coverage records;
- the former prototype Content Review queue, fake reviewers, local comments, or mock similarity results;
- the former browser-store Test QA pipeline, fake reviewers, local QA comments, or locally simulated publication versions.

Prototype files may remain temporarily as design references, but they are outside the production route graph. Visibility in the admin navigation represents product scope and implementation status, not availability of prototype data.

## Canonical API boundary observed during audit

Mounted operational API groups:

- admin session and RBAC;
- Question Studio;
- Question Bank;
- Content Review collaboration and queue composition;
- taxonomy hierarchy and coverage planning;
- Test Builder and publishing;
- Test QA collaboration, version comparison and release gate;
- categories/subcategories and published tests;
- test runner, submission, canonical results, and attempt history.

Compatibility/retired responses still exist for packages, bundles, leaderboard, daily challenge, billing, purchases, and several legacy writes. Frontend surfaces for those features must remain non-live until replaced with canonical implementations.

## Ranked fire list

### P0 — admin operations

1. Add full Question Bank duplicate comparison and chapter-freeze readiness into Content Review.
2. Add blueprint-driven test production and canonical Test Series management.
3. Add administrator-facing audit logs and operational health.
4. Add translation review and language-specific publication gates.

### P0 — student production truth and reliability

1. Deploy and smoke-test current `New-main` on the real Firebase/Render environment.
2. Remove retired queries from the result page while preserving canonical result display.
3. Add end-to-end tests for login, discovery, attempt, submit, refresh result, and attempt history.
4. Harden test runner recovery: refresh, network loss, duplicate submit, zero-time auto-submit, and multiple tabs.

### P1 — student value

1. Canonical analytics foundation: topic/section accuracy, time analysis, trends, rank, percentile.
2. Expand My Activity with recommended next tests and weak-area actions.
3. Canonical question reports and support workflow.
4. Complete profile persistence and account controls.

### P1 — content production

1. Complete Percentage and Ratio manual review.
2. Add Average, Profit & Loss, Interest, Time & Work, Speed/Distance, Mixture, Number System, Algebra, Geometry, Mensuration, Trigonometry, and DI.
3. Add Reasoning, English, General Awareness, Banking, Punjab GK, Punjabi, and Computer Knowledge engines.
4. Replace structural Hindi/Punjabi mirrors with reviewed localization.

### P2 — monetization and operations

1. Packages, orders, Razorpay verification, coupons, entitlements, refunds, and expiry.
2. Admin student/support/notification workspaces.
3. Monitoring, error tracking, rate limiting, backups, recovery drills, staging, and load tests.

## Definition of done for promoting an admin workspace to Live

A workspace may change to `LIVE` only when:

1. its primary reads and writes use canonical namespaced tables;
2. authentication and RBAC are enforced server-side;
3. loading, empty, error, and permission states are implemented;
4. destructive actions are auditable and recoverable;
5. API, typecheck, frontend build, and end-to-end tests pass;
6. the route contains no prototype/localStorage business records presented as real data.
