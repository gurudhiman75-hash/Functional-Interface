# ExamTree Frontend Production Readiness Audit

Date: 2026-08-18
Branch audited: `New-main`
CP01 implementation branch: `feature/frontend-production-cp01`

## Release judgement

The student test engine and canonical test-series/result journeys are materially stronger than the public product shell around them. The repository already has Playwright-based student reliability E2E coverage for authentication, canonical Test Series discovery/gating, server-draft resume, duplicate-submit protection, committed-result reload, progression unlock, and fresh dashboard history.

CP01 now hardens production truth across the primary discovery path (`home -> category -> exam -> result`) and adds deterministic recovery for background-tab timer throttling. The frontend remains a controlled-beta candidate rather than broad-production frozen until the remaining destructive runner, mobile, accessibility, and SEO matrices are closed.

## Severity model

- **P0** — launch blocker or trust/reliability risk on a primary student journey.
- **P1** — required for broad production quality but can follow a tightly controlled beta.
- **P2** — scale, polish, performance, or maintainability improvement.

## CP01 implemented

### Truthful student surfaces

- Homepage catalog counts are derived from the current published catalog rather than fabricated marketing counters.
- Prototype testimonials, hard-coded countdowns, fake mastery values, stale pattern/PYQ claims, and pending analytics promotion are removed.
- Category and exam discovery pages no longer expose fabricated ratings/enrollment counts or unverified `Latest Pattern` / official-format claims.
- Category/exam catalog failures use student-safe recovery copy and do not expose `API_BASE_URL`.
- Category commerce language is neutral (`Browse Packages`) rather than inventing a savings offer.
- Activity time derived from real attempts is labelled `Test time` rather than `Practice time`.
- Roadmap advertising is removed from the activity surface.

### Canonical result integrity

- Homepage and exam-page review actions carry the exact committed `attemptId`.
- A result page without a committed `attemptId` never renders browser-local or an older same-test score as canonical.
- Missing-commit result state explicitly says `Submission is not confirmed yet` and offers recovery to the saved test/activity.
- With an `attemptId`, the result is fetched through the canonical `/attempts/:id` path.
- Existing canonical attempt-session durability remains authoritative: local draft recovery is retained until the server commit succeeds.

### Background timer recovery

The live runner still uses its existing interval-driven display timer, but browser/mobile background throttling is now reconciled on visibility return:

- timer mode is inferred only from successive actively ticking REAL-attempt drafts;
- paused/non-ticking drafts are never classified as active timers;
- elapsed hidden time is anchored to the most recent saved draft so seconds that actually ticked while hidden are not double-counted;
- overall timers subtract the missed interval;
- fixed sectional timers can expire the active section and consume the remainder from following sections;
- recovered state is persisted through the same canonical draft pipeline and the runner reloads from that corrected state.

`artifacts/examtree/scripts/check-timer-recovery.mjs` contains deterministic assertions for overall-mode inference, sectional-mode inference, paused-draft rejection, overall subtraction, sectional rollover, final expiry, and zero-elapsed stability.

## Production quality gates

From repo root:

```bash
pnpm run quality:web
```

This resolves to:

1. student TypeScript check;
2. production-truth regression audit;
3. deterministic timer-recovery audit;
4. production Vite build.

`.github/workflows/frontend-production-quality.yml` runs that command for relevant pull requests/pushes targeting `New-main`.

The production-truth audit now guards the primary discovery/result chain against known regressions including fake telemetry/social proof, unverified freshness/official-parity claims, student-facing backend URLs on catalog discovery, roadmap claims, result links without an exact attempt ID, and browser-local score fallback on canonical result pages.

Separately, the pre-existing `.github/workflows/student-reliability-e2e.yml` remains the canonical browser-level suite. It already covers login protection, live Test Series + standalone discovery, score-gated locks, series-context delivery, canonical server-draft resume, duplicate-submit suppression, committed-result reload, next-test unlock, and fresh dashboard history.

## Remaining P0 before broad-production freeze — CP01B

Extend the existing Playwright suite rather than creating a competing E2E stack:

1. Prove overall timer expiry after a real background-tab/app sleep at browser level.
2. Prove fixed sectional expiry/rollover and locked-section behaviour at browser level.
3. Lose network during draft persistence; recover without losing the latest authoritative state.
4. Lose network during final submit; retry idempotently and reach exactly one committed result.
5. Open the same attempt in two tabs or simulate a stale revision; stale state must not silently overwrite the authoritative revision.
6. Expire authentication during an active attempt and recover without false submission/data loss.
7. Verify practice mode never unlocks score-gated progression.
8. Verify language switching does not alter answer identity/scoring and unavailable language falls back safely.
9. Run the core attempt flow at representative mobile widths and at least one constrained/low-end browser profile.
10. Remove the remaining developer-oriented API diagnostic in the direct test-detail error path and migrate any legacy testId-only review buttons to exact attempt IDs; strict result handling already prevents these links from showing an incorrect canonical score.

Already covered and therefore not duplicated in CP01B: student-login protection, canonical series discovery, score-gated lock reasons, series-context question delivery, canonical server-draft resume, duplicate-click submit suppression, committed-result reload, next-test unlock after a qualifying result, and fresh-navigation attempt history.

## P1 / P2 backlog after CP01

| Surface | Severity | Remaining release condition |
| --- | --- | --- |
| Public/app shell split | P1 | Separate acquisition/public navigation from the logged-in preparation shell without changing runner behaviour. |
| Accessibility | P1 | Keyboard/focus/Escape, screen reader labels, 200% zoom, contrast, touch targets, reduced-motion decisions. |
| Mobile certification | P1 | Dedicated narrow-width/device matrix for discovery, runner, results and account flows. |
| SEO/public rendering | P1 | Canonical/OG/Twitter metadata, robots, sitemap and crawlable/prerendered acquisition routes. |
| Catalog scale | P1 | Search/filter/sort/pagination and stronger empty states for large inventories. |
| Profile/report/support persistence | P1 | Every successful-looking write must be server-backed and recoverable. |
| Performance | P2 | Bundle/runtime budgets, MathJax loading review, low-end Android profiling, Core Web Vitals. |
| Design polish | P2 | Reduced motion, consistent copy/token usage, final cross-browser visual certification. |

## Checkpoint sequence

- **CP01:** production truth, canonical result integrity, background-timer recovery, automated frontend quality gate, preservation of existing reliability E2E.
- **CP01B:** destructive runner/network/auth/tab/mobile browser matrix plus remaining direct-runner error/review-link cleanup.
- **CP02:** public/app shell split plus accessibility/mobile certification.
- **CP03:** SEO/prerender/metadata/sitemap/robots.
- **CP04:** catalog discovery/search/filter/pagination plus incomplete account/support journeys.
- **CP05:** performance budgets, low-end-device validation, reduced motion, bundle/runtime optimization and final browser matrix.
