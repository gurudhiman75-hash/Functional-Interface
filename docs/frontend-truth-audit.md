# ExamTree frontend truth audit

Date: 2026-07-22

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
| `/tests`, `/exams` | LIVE | Lists canonical Test Series and standalone published tests. Series-bound tests are removed from generic discovery. | Add pagination, exam filters, search and richer series artwork. |
| `/test-series/:id` | LIVE | Authenticated canonical series progress, availability, lock reasons, best scores and next-test action. | Add release notifications and richer completion summaries. |
| `/category/:id`, `/subcategory/:id` | LIVE | Canonical standalone-test discovery by exam family/exam. | Improve empty states and mobile layouts. |
| `/published-tests/:id` | LIVE | Canonical standalone published-test detail. Series-bound tests are reserved for their series journey. | Add complete instruction and eligibility metadata. |
| `/test/:id` | LIVE | Durable authenticated attempt session with cross-refresh resume, optimistic draft revisions, offline retry, server-checked series context and idempotent transactional submission. Approved multilingual tests deliver approved question, option, explanation and test metadata while preserving the source answer key for scoring. | Add stronger timer and multi-device UX. |
| `/result?attemptId=...` | LIVE | Reads only the committed canonical result snapshot, preserves immutable solution review and returns students to their Test Series when applicable. | Add canonical rank, percentile and weak-area analytics after those services exist. |
| `/dashboard` | LIVE | Canonical server-backed attempt history and published-test count. | Add topic/section insights after analytics APIs exist. |
| `/profile` | LIVE_INCOMPLETE | Authentication/profile shell. | Persist editable profile fields canonically. |
| `/performance` | PENDING | Explicit analytics-unavailable page. | Build canonical ranking, percentile, weak-area, and trend APIs. |
| `/packages*`, `/my-packages` | PENDING | Explicit commerce-unavailable page. | Build packages, orders, Razorpay, coupons, and entitlements. |
| `/mock-tests`, `/pyqs`, SEO landing routes | LIVE_INCOMPLETE | Public discovery/content surfaces. | Verify content truth, canonical test links, and SEO metadata. |
| `/about`, `/contact`, policy pages, `/faq`, `/blog` | STATIC | Informational pages. | Legal/content review and contact-form persistence. |
| `/report-question` | LIVE_INCOMPLETE | Report UI exists. | Persist reports to canonical support/content-quality workflow. |

Student Test Series reads the current immutable records in `assessment.test_series`, `assessment.test_series_versions`, and `assessment.test_series_items`. Progress is calculated exclusively from the authenticated student's real evaluated `learning.attempts`, linked through the canonical test publication, and uses the best stored percentage score. Practice results are retained canonically under a separate completed state and never unlock progression. Open, sequential and score-gated rules, series/member release windows, required versus optional members, publication state and lock reasons are evaluated server-side. The same gate runs before question delivery and again before submission. Browser state cannot unlock a test, and series-bound tests are excluded from standalone test lists and standalone published-test detail routes.

Attempt reliability uses the existing `learning.attempts` table without a schema migration. Opening a published test creates or reuses one authenticated `in_progress` row for the student and publication. Browser drafts remain a local recovery cache but are mirrored into that row with an optimistic revision number. A stale tab receives the authoritative server revision rather than silently overwriting progress. Submission locks and finalises the same attempt row in one transaction; repeated or concurrent submissions return the stored result and cannot create duplicate evaluated attempts. The result page reads only the committed snapshot, so navigation, refresh and cross-instance reads do not depend on process memory or a delayed background write.

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
| `/content/review` | LIVE | Unified generated/authored queue, reviewer ownership, threaded discussion, SLA ageing, immutable version comparison, chapter-scoped duplicate intelligence, readiness reporting and audited freeze governance. |
| `/content/coverage` | LIVE | Exam-version coverage targets and recursive Question Bank readiness rollups. |
| `/content/taxonomy` | LIVE | Canonical taxonomy node, edge, exam mapping, activation and target management. |
| `/tests` | LIVE | Canonical test drafts, QA states, schedules, and published versions. |
| `/tests/:id` | LIVE | Canonical test detail, validation, lifecycle, schedule, and publication. |
| `/tests/builder` | LIVE | Build canonical test versions from approved questions. |
| `/tests/qa` | LIVE | Canonical QA queue, reviewer ownership, issue resolution, immutable version comparison, candidate-content preview and server-enforced approval/publication gate. |
| `/tests/series` | LIVE | Immutable series versions, ordered test membership, availability windows, progression policy and release readiness. |
| `/tests/blueprints` | LIVE | Immutable exam patterns, taxonomy/language/difficulty quotas, Question Bank shortage preview and deterministic draft assembly. |
| `/users/students` | LIVE | Read-only canonical student directory with server-side search, status/language filters, attempt summaries and honest empty state. |
| `/users/students/:id` | LIVE | Canonical identity, account state, recent attempts, privacy-safe sessions and audit-derived account timeline. |
| `/users/team` | LIVE | Canonical administrator invitations, profiles, reporting lines, role grants, suspension, disablement and session revocation. |
| `/analytics/system-health` | LIVE | Canonical API/database status, background-job queues and attempts, worker signals, generation/validation failures, outbox backlog, redacted operational errors and audited safe job actions. |
| `/settings/languages` | LIVE | Canonical language availability, exam mappings, question/test translation queues, terminology governance, reviewer ownership, lifecycle review and language-specific publication readiness. |
| `/settings/roles` | LIVE | Server-enforced role definitions and granular permission assignment with protected system roles. |
| `/settings/audit-logs` | LIVE | Immutable event search, actor/entity/date filtering, field-change detail and CSV export. |

The taxonomy release uses the existing `catalog.taxonomy_nodes`, `catalog.taxonomy_edges`, and `catalog.exam_taxonomy_nodes` tables. It requires no schema migration. All writes require `content.taxonomy.manage`, are transactionally validated, cycle-safe, soft-archivable, and recorded in `platform.audit_events`. Coverage counts use the canonical current question version and recursively roll descendant links into parent nodes; leaf-only summaries avoid double counting.

Content Review coordinates the existing Question Studio and Question Bank lifecycle engines instead of creating another approval engine. Reviewer assignments, comments, replies, resolutions and ownership changes are immutable `platform.audit_events`; generated-item ownership is also reflected in `content.generation_run_items.reviewer_user_id`. Saved review views are browser UI preferences only and contain filters, not business records.

Content intelligence extends that same workspace without adding a parallel workflow or schema. It scans current canonical Question Bank versions inside a selected chapter or subtopic subtree, detects exact normalized stems, number/variable-template matches and high-confidence lexical-semantic near duplicates, and stores editorial decisions as immutable `content.duplicate.decision.recorded` audit events. Freeze readiness combines target coverage, approval completeness, unresolved placeholders, critical duplicate decisions, open Content Review comments, test usage and scan completeness. A freeze records the exact deterministic SHA-256 report hash through `content.chapter.freeze.changed`; later content changes make the recorded freeze visibly stale. Hindi and Punjabi readiness is now resolved through canonical per-language translation review rather than structural placeholder mirrors.

Translation Operations uses `catalog.languages`, `catalog.exam_version_languages`, `content.question_translations`, `content.question_translation_options`, `content.translation_terms`, `assessment.test_version_translations`, and `assessment.test_section_translations`. Question and test translations have translator/reviewer ownership, quality snapshots, comments, audited lifecycle transitions and approved-only publication gates. Test approval, scheduling and publication are blocked until every configured non-source language has approved test metadata, complete translated section labels, approved question translations and exact option parity. Student scoring continues to use the immutable source option answer key. Production migration `5c96a8a8-3d31-4278-80a4-b85ba934ca0d` was applied to the canonical Neon branch. A scheduled production synthetic checks service health, authentication enforcement, CORS, admin SPA delivery and optional authenticated translation reads without mutating business data.

Test QA extends the existing canonical test lifecycle rather than replacing it. It reads `assessment.tests`, `assessment.test_versions`, `assessment.test_sections`, `assessment.test_questions`, and `assessment.test_publications`; reviewer assignment, comments, replies, resolutions and reopen events are immutable `platform.audit_events`. Approval, scheduling and publication are blocked server-side until the current test version has an assigned reviewer, no unresolved QA comments, no existing structural/content validation errors and complete localization readiness. No additional Test QA schema is required.

Exam Blueprints uses the existing `assessment.test_blueprints`, `assessment.test_blueprint_versions`, and `assessment.test_blueprint_sections` tables. Blueprint edits create immutable versions. Each section stores canonical taxonomy targets, language, easy/medium/hard quotas, marks, timing and negative marking rules. Coverage preview resolves published Question Bank versions recursively through taxonomy descendants, requires approved translations where applicable, prevents question/stem reuse within one test, and reports shortages before any draft is created. Successful assembly creates an ordinary canonical draft in `assessment.tests`, `assessment.test_versions`, `assessment.test_sections`, and `assessment.test_questions`, so the result continues through Test Builder and Test QA. No database migration is required.

Test Series uses `assessment.test_series`, `assessment.test_series_versions`, and `assessment.test_series_items`. Series edits create immutable versions and never rewrite previous membership. Every member test must belong to the selected exam version, and duplicate membership is blocked. Current versions store optional availability windows, open/sequential/score-gated progression, default completion score and ordered member-level unlock/score/required rules. Release readiness is blocked when a series is archived, empty, expired, or contains tests that are not QA approved, scheduled, live or completed. All create, version, archive and restore actions are immutable `platform.audit_events`. Migration `b4ea416f-eea3-4033-8503-bd21fe6f5faa` was applied additively to the canonical Neon project and is recorded in `docs/database-migrations/2026-07-20-canonical-test-series.sql`.

Student Administration reuses `identity.users`, `identity.student_profiles`, `identity.auth_identities`, `identity.sessions`, `learning.attempts`, `assessment.test_publications`, `assessment.tests`, `assessment.test_versions`, and `platform.audit_events`. It requires no migration and its foundation release is read-only under `users.students.read`. Directory search and filters execute server-side, session IP addresses are masked before response serialization, refresh-token hashes are never returned, and only users with canonical `identity.student_profiles` are listed. Production currently has no student-profile rows, so the live workspace truthfully renders an empty canonical state rather than prototype records. Student suspension, session revocation, entitlement overrides and support notes remain a separate audited mutation release.

The admin control plane reuses the existing `identity.users`, `identity.auth_identities`, `identity.admin_profiles`, `identity.roles`, `identity.permissions`, `identity.role_permissions`, `identity.user_roles`, and `identity.sessions` tables. It requires no schema migration. Administrators are pre-authorized by verified email, linked to Firebase on first sign-in, and resolved through the existing server-side RBAC middleware. Role changes, profile changes, invitations, suspension, disablement and session revocation are transactional and append immutable `platform.audit_events` plus `platform.audit_event_changes`. The API prevents removal or suspension of the final active super administrator and prevents weakening or deactivating the protected `super_admin` role.

System Health reuses `operations.jobs`, `operations.job_attempts`, `operations.job_logs`, `content.generation_runs`, `content.generation_run_items`, `content.validation_runs`, `content.validation_checks`, and `platform.outbox_events`; it requires no migration. Read access requires `jobs.read`, and manual retry/cancel requires `jobs.manage`. Retry is limited to failed/cancelled jobs, cancellation is limited to queued/retrying jobs, and every mutation appends an immutable audit event. API responses recursively redact sensitive keys and embedded authorization, credential and database-URL text. Component states are derived from persisted signals and thresholds rather than mock status. The current canonical database has generation/outbox history but no observed worker jobs, attempts, logs or validation runs, so those components are explicitly shown as `unknown`/`not observed`. Persistent request-level exception storage and an active worker/outbox publisher remain separate operational follow-up work.

### In-progress admin workspaces

These are visible with a `Next` badge and render roadmap detail until canonical integration is complete:

- Test Analytics, Question Analytics and Content Quality
- Exam Configuration

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
- prototype student profiles, hard-coded attempts/devices/events, local suspension controls or browser-store entitlement actions presented as canonical Student Administration;
- an "all systems operational" claim without monitoring evidence;
- the former browser-store coverage tree or locally calculated mock coverage records;
- the former prototype Content Review queue, fake reviewers, local comments, or mock similarity results;
- the former browser-store Test QA pipeline, fake reviewers, local QA comments, or locally simulated publication versions;
- prototype blueprint rules, browser-local blueprint versions, or local test assembly presented as canonical data;
- prototype series membership, browser-local release windows, or local progression state presented as canonical data;
- prototype administrator arrays, role matrices, role switching or local audit entries presented as production access control;
- mock worker heartbeats, fake queue failures, browser-local job state or unredacted operational payloads presented as monitoring truth.

Prototype files may remain temporarily as design references, but they are outside the production route graph. Visibility in the admin navigation represents product scope and implementation status, not availability of prototype data.

## Canonical API boundary observed during audit

Mounted operational API groups:

- admin session and RBAC;
- administrator team, role and permission management;
- canonical read-only Student Administration directory, profile, attempts, masked sessions and account timeline;
- immutable audit-event exploration and export;
- Question Studio;
- Question Bank;
- Content Review collaboration, queue composition, duplicate intelligence and chapter freeze governance;
- taxonomy hierarchy and coverage planning;
- Test Builder and publishing;
- Test QA collaboration, version comparison and release gate;
- Exam Blueprint CRUD, coverage preview and deterministic draft assembly;
- Test Series CRUD, immutable versioning, ordered membership and release readiness;
- Translation Operations coverage, language/exam configuration, question/test translation lifecycle, terminology, comments, ownership and publication readiness;
- System Health, canonical job inspection, safe queue actions and redacted pipeline/error telemetry;
- student Test Series discovery, canonical progress and server-enforced access;
- multilingual published-test delivery with source-key scoring;
- durable attempt sessions, revisioned draft recovery, transactional idempotent submission and committed result reads;
- categories/subcategories and standalone published tests;
- canonical attempt history.

Compatibility/retired responses still exist for packages, bundles, leaderboard, daily challenge, billing, purchases, and several legacy writes. Frontend surfaces for those features must remain non-live until replaced with canonical implementations.

## Ranked fire list

### P0 — admin operations

Completed in the current releases: chapter-scoped duplicate intelligence and freeze governance, canonical System Health visibility, canonical multilingual Translation Operations with language-specific publication gates and production schema activation, and the read-only canonical Student Administration directory/profile foundation.

1. Add audited Student Administration mutations: suspension/reactivation, session revocation and later entitlement/support operations.
2. Connect the persistent request-exception sink and deploy/observe the background worker and outbox publisher through the live System Health surface.
3. Complete canonical Exam Configuration and remove the final settings roadmap shell.

### P0 — student production truth and reliability

1. Restore the strict student TypeScript baseline without weakening compiler settings.
2. Add explicit multi-device takeover UX and background-sync observability around canonical draft retries.
3. Maintain authenticated Firebase/Render browser smoke coverage after releases that change shared authentication, translation or publication behaviour.

### P1 — student value

1. Canonical analytics foundation: topic/section accuracy, time analysis, trends, rank, percentile.
2. Expand My Activity with recommended next tests and weak-area actions.
3. Canonical question reports and support workflow.
4. Complete profile persistence and account controls.

### P1 — content production

1. Complete Percentage and Ratio manual review.
2. Add Average, Profit & Loss, Interest, Time & Work, Speed/Distance, Mixture, Number System, Algebra, Geometry, Mensuration, Trigonometry, and DI.
3. Add Reasoning, English, General Awareness, Banking, Punjab GK, Punjabi, and Computer Knowledge engines.
4. Replace structural Hindi/Punjabi mirrors with reviewed localization through the live Translation Operations workflow.

### P2 — monetization and operations

1. Packages, orders, Razorpay verification, coupons, entitlements, refunds, and expiry.
2. Student mutation, support and notification workspaces.
3. External alerting, rate limiting, backups, recovery drills, staging, load tests and production observability drills.

## Definition of done for promoting an admin workspace to Live

A workspace may change to `LIVE` only when:

1. its primary reads and writes use canonical namespaced tables;
2. authentication and RBAC are enforced server-side;
3. loading, empty, error, and permission states are implemented;
4. destructive actions are auditable and recoverable;
5. API, typecheck, frontend build, and end-to-end tests pass;
6. the route contains no prototype/localStorage business records presented as real data.
