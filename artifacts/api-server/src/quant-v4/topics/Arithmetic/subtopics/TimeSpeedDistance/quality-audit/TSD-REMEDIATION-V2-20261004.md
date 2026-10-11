# TSD remediation review V2 — 2026-10-04

This batch is review-ready, not chapter closure or content approval.

| Area | Result | Authority and limits |
|---|---|---|
| CP004 localization | Recovered earlier candidate work and created 120 Hindi/Punjabi V2 rows | Source branch `audit/tsd-cp004-localization-20261004`, head `796c19ba5d87ab7624025cb9115e34ff9d4e8f4f`; no native freeze or registration created. |
| CP004 explanations | Explicit numeric calculations, direction/target clarification and prompt grammar corrections | Input, solution, option order, correct index and mathematical fingerprint match the 60 frozen English rows. Plain Unicode arithmetic. |
| CP007 options | 1,854 multilingual V2 candidate rows with named misconception calculations and collision filtering | No arbitrary ±1/±2 answer-offset fallback. Endpoint-count adjustments represent stated counting errors. Nonpositive or duplicate scalar choices rejected. |
| CP007 explanations | Substituted calculations in English, Hindi and Punjabi, including unit conversion and clock/endpoint arithmetic | Original frozen stems retained. New options/explanations are unapproved. |
| CP010 parity | Closure audit now imports the existing official-paper V3 wrapper | The wrapper already existed; the prior audit incorrectly exercised its older base adapter. No new CP010 registration or release. |

## Validation

- CP004 V2: 120 rows passed native-script, source math/options parity, no-placeholder and lifecycle-lock checks.
- CP007 V2: 1,854 rows passed independent source-answer verification, four distinct options, one correct answer, misconception provenance, worked-step and release-lock checks.
- CP007 English/Hindi/Punjabi frozen registry digest unchanged before/after candidate construction.
- CP003–CP012 frozen proof suite passed.
- Current-main closure audit passed all 255 cases with the corrected CP010 wrapper.
- API build and git whitespace checks passed locally.

These checks do not grant editorial approval and do not independently certify every distractor's pedagogical strength. The new layer remains outside active Studio registration. Source approvals and all Bank/test/mock/public release locks are unchanged. CP010–CP012 remain unregistered.

## Remaining work

CP004 needs native editorial review and an explicitly approved freeze. CP007 V2 needs review before promotion. Continue with CP008/CP009 calculative explanations and river-start assignments, CP005 simultaneous-departure clarity, foundational contract coverage, later checkpoint scenario diversity and rendering. Scenario expansion in the earlier audit is still a proposal, not implemented coverage. TSD stays open; RAP stays closed.

## Review artifacts and reproduction

`revision-review-export.ts` writes all 1,974 candidate rows to JSON and a Markdown review containing all 120 CP004 rows plus 198 representative CP007 family/locale rows. Bundle with esbuild using `--bundle --platform=node --format=esm --packages=external`, then pass an output directory as the first argument to the resulting module.

`revision-v2-proof-suite.ts` runs the candidate, frozen-authority and current closure proofs. Local execution used Node v24; remote CI has not run for these local commits.

GitHub push credentials are unavailable. PR #3148 is unchanged.
