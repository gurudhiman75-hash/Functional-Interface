# ExamTree Frontend Production Readiness Audit

Date: 2026-08-18
Branch audited: `New-main`
CP01 implementation branch: `feature/frontend-production-cp01`

## Release judgement

The student test engine and canonical test-series/result journeys are materially stronger than the public product shell around them. The repository already has Playwright-based student reliability E2E coverage for authentication, canonical Test Series discovery/gating, server-draft resume, duplicate-submit protection, committed-result reload, progression unlock, and fresh dashboard history. The frontend is suitable for controlled beta after CP01A, but broad public launch still requires the remaining runner edge-case/device matrix, accessibility/mobile certification, and SEO/public-shell work.

## Severity model

- **P0** — launch blocker or trust/reliability risk on a primary student journey.
- **P1** — required for broad production quality but can follow a tightly controlled beta.
- **P2** — scale, polish, performance, or maintainability improvement.

## File-by-file gap audit

| Surface / file | Severity | Finding | Required release condition | CP01 status |
| --- | --- | --- | --- | --- |
| `artifacts/examtree/src/pages/home.tsx` | P0 | Homepage contained forced million-question and active-user counters, hard-coded mastery percentages, prototype testimonials, a fixed challenge timer, stale pattern/PYQ claims, and a CTA to pending analytics. | All visible claims must be canonical, directly derivable from current catalog/session data, or removed. Pending capabilities must not be promoted. | **Implemented** |
| `artifacts/examtree/src/pages/home.tsx` | P0 | Latest-attempt review navigation did not include the canonical `attemptId`. | Result/review navigation must identify the committed attempt snapshot. | **Implemented** |
| `artifacts/examtree/src/pages/home.tsx` | P0 | Paid/unlock language was promoted while packages/payments remain pending. | Homepage must feature immediately usable journeys only. | **Implemented** — featured list is free-test only. |
| `artifacts/examtree/src/pages/tests.tsx` | P0 | API load failure exposed backend configuration (`API_BASE_URL`) to students. | Student errors must be actionable, non-technical, and must not expose deployment configuration. | **Implemented** |
| `artifacts/examtree/src/pages/activity.tsx` | P0 | Time derived from real attempts was labelled `Practice time`; roadmap features were advertised in the activity shell. | Labels must match their actual data source; unavailable roadmap functionality must not be marketed as product UI. | **Implemented** |
| `scripts/e2e/tests/student-reliability.spec.ts` | P0 | Existing Playwright coverage already proves login protection, live Test Series + standalone discovery, server score gates, series-context delivery, canonical server-draft resume, duplicate-submit suppression, committed-result reload, progression unlock, and fresh dashboard history. It does not yet cover all destructive edge cases. | Extend the existing suite for timer/background sleep, network interruption, stale revisions/tabs, auth expiry, practice-progression isolation, language switching, and mobile viewport behaviour. | **PARTIAL — CP01B** |
| `artifacts/examtree/package.json` | P0 | Student package had build/typecheck only and no production-truth release command, even though a separate Playwright workflow already existed. | A repeatable student frontend quality command must run typecheck, production assertions, and production build alongside the existing E2E workflow. | **Implemented** |
| `.github/workflows/frontend-production-quality.yml` | P0 | No dedicated typecheck + truth + production-build PR workflow existed for the student package. | Frontend changes targeting `New-main` must automatically run the student production gate. | **Implemented** |
| `.github/workflows/student-reliability-e2e.yml` | P0 | Existing canonical student browser suite is valuable and already triggers on student frontend changes. | Preserve it and extend it rather than introducing a competing E2E stack. | **EXISTING / ACTIVE** |
| `artifacts/examtree/src/components/AppLayout.tsx` | P1 | Public/acquisition pages and authenticated app surfaces share the sidebar-oriented application shell. | Split public acquisition shell from logged-in preparation shell without changing test-runner behaviour. | OPEN — CP02 |
| `artifacts/examtree/src/components/StickyHeader.tsx` | P1 | Custom exam selector needs formal focus, Escape, keyboard, zoom and mobile-overflow certification. | WCAG-oriented keyboard/screen-reader and 200% zoom pass. | OPEN — CP02 |
| `artifacts/examtree/index.html` | P1 | Initial SPA document has generic title and constrains viewport zoom; public metadata is incomplete at first response. | Remove zoom restriction; establish complete route metadata strategy and SEO rendering. | OPEN — CP02/CP03 |
| `artifacts/examtree/src/components/PublicPage.tsx` | P1 | Title/description are changed client-side only; canonical/OG/Twitter/schema coverage is incomplete. | Search-facing pages need canonical metadata and crawlable route output. | OPEN — CP03 |
| `artifacts/examtree/public` | P1 | No complete sitemap/robots/manifest release package is established. | Production robots policy, sitemap generation and PWA decision must be explicit. | OPEN — CP03 |
| `artifacts/examtree/src/pages/profile.tsx` | P1 | Profile remains live-incomplete until editable fields are canonically persisted. | No UI control may imply successful persistence unless server-backed. | OPEN |
| `artifacts/examtree/src/pages/report-question.tsx` | P1 | Reporting UI exists but canonical support/content-quality persistence remains incomplete. | A submitted report must produce a durable server-side record and recoverable status. | OPEN |
| `artifacts/examtree/src/pages/category.tsx`, `subcategory.tsx`, `tests.tsx` | P1 | Discovery needs scale work: search, filters, pagination, richer empty states, mobile layouts. | Large catalog remains navigable on low-width devices and with hundreds/thousands of tests. | OPEN — CP04 |
| `artifacts/examtree/src/App.tsx` | P2 | Route lazy loading and global error boundary are good, but MathJax wraps the full application. | Measure bundle/runtime cost and load maths infrastructure only where useful if the gain is material. | OPEN — CP05 |
| `artifacts/examtree/src/index.css` and visual components | P2 | Motion, blur and shadow usage has not been certified on low-end Android or reduced-motion settings. | Core Web Vitals/device budget and `prefers-reduced-motion` pass. | OPEN — CP05 |

## CP01 production-truth contract

`artifacts/examtree/scripts/check-production-truth.mjs` now fails the build if known prototype/trust regressions return. It specifically prevents:

- fake active-user telemetry;
- generated-question marketing counters without a canonical source;
- unverifiable `Most Advanced` superlatives;
- prototype testimonials;
- hard-coded challenge countdowns;
- stale pattern/PYQ marketing claims;
- homepage promotion of pending analytics;
- incorrect `Practice time` labelling;
- roadmap advertising in the activity page;
- student-facing backend URL diagnostics.

It also requires the homepage to retain catalog-backed published-test/question counts, a live primary CTA, and canonical attempt-id result navigation.

## CP01 quality gates

From repo root:

```bash
pnpm run quality:web
```

This resolves to:

1. student TypeScript check;
2. production-truth regression audit;
3. production Vite build.

The new GitHub Actions workflow runs the same gate for pull requests into `New-main` when student frontend or relevant workspace files change.

Separately, the pre-existing `.github/workflows/student-reliability-e2e.yml` installs Playwright/Chromium, builds the student application, and runs `scripts/e2e/tests/student-reliability.spec.ts`. CP01 keeps that suite as the canonical browser-level reliability harness.

## CP01B — remaining P0 before broad launch

The existing Playwright suite already covers several items that were initially suspected to be missing. CP01B should extend that suite only for the remaining destructive/edge scenarios:

1. Expire the overall timer while foregrounded and after background-tab sleep.
2. Expire fixed sectional timing and prove locked-section behaviour.
3. Lose network during draft persistence; recover without losing the latest authoritative state.
4. Lose network during final submit; retry idempotently and reach exactly one committed result.
5. Open the same attempt in two tabs or simulate a stale revision; stale state must not silently overwrite the authoritative revision.
6. Expire authentication during an active attempt and recover without false submission/data loss.
7. Verify practice mode never unlocks score-gated progression.
8. Verify language switching does not alter answer identity/scoring and unavailable language falls back safely.
9. Run the core attempt flow at representative mobile widths and at least one constrained/low-end browser profile.

Already covered and therefore not duplicated in CP01B: student-login protection, canonical series discovery, score-gated lock reasons, series-context question delivery, canonical server-draft resume, duplicate-click submit suppression, committed-result reload, next-test unlock after a qualifying result, and fresh-navigation attempt history.

Until the remaining matrix is automated and green, the frontend can be treated as **beta-ready after CP01A**, not fully broad-production frozen.

## Next checkpoints

- **CP01A (this branch):** production truth, safe public CTAs/errors, canonical result navigation, automated typecheck/truth/build gate, preservation of existing student E2E.
- **CP01B:** extend the existing student Playwright reliability suite for destructive edge cases and mobile/device coverage.
- **CP02:** public/app shell split, accessibility and mobile certification.
- **CP03:** SEO/prerender/metadata/sitemap/robots.
- **CP04:** catalog discovery/search/filter/pagination plus incomplete account/support journeys.
- **CP05:** performance budgets, low-end device validation, reduced motion, bundle/runtime optimization and final browser matrix.
