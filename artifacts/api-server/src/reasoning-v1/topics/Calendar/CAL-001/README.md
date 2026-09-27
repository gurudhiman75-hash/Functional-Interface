# CAL-001 — Calendar

Current production-integrated Calendar package for Reasoning V1.

## Current authority

```text
Permanent QLs:                 CAL-QL-001..036
Checkpoint span:               CAL-CP-001..010
Languages:                     English, Hindi, Punjabi
Question Studio:               ACTIVE
Question Bank status:          READY_FOR_STORAGE after manual approval
Test eligibility:              ELIGIBLE after manual approval
Mock-test eligibility:         enabled after manual approval
Publication workflow:          eligible after manual approval
Automatic student publication: false
```

The current production lifecycle is defined by `question-studio-runtime.ts` and
`CAL-001-QUESTION-STUDIO-COMPLETION.md`.

Older discovery/freeze records remain immutable historical evidence and may show
earlier locked states. They must not be interpreted as the current package
lifecycle.

## Structure

```text
foundation.ts                 Gregorian, odd-day, span, repetition, frequency and PRNG engines
registry.ts                   44 original provisional prototype authorities across CAL-CP-001…010
runtime-shared.ts             semantic rendering, options, explanations and structural difficulty helpers
runtime-cp001.ts              basic weekday-shift authorities
runtime-cp002.ts              ordinary date-relation authorities
runtime-cp003.ts              leap-boundary and count-semantics authorities
runtime-cp004-005.ts          absolute-date and cross-year authorities
runtime-cp006-007.ts          leap-classification and century authorities
runtime-cp008.ts              calendar-repetition authorities
runtime-cp009.ts              month/year boundary authorities
runtime-cp010.ts              weekday-frequency authorities
runtime.ts                    deterministic source-package orchestration
permanent-contracts.ts        CAL-QL-001..036 semantic ownership
question-studio-runtime.ts    active permanent-QL Question Studio projection
question-studio-runtime.test.ts
                              production lifecycle and multilingual parity proof
verifier.ts                   package-level independent recomputation and lifecycle checks
foundation-proof.test.ts      exhaustive Gregorian foundation proof
source-audit-gate.ts          source-coverage gate
review-export.ts              English prototype review pack
multilingual-review-export.ts multilingual review evidence
```

## Deep-audit status

The 2026-09-27 Reasoning V1 deep audit is active.

Wave 1 corrected learner-explanation projection so QA-only trap/verification
diagnostics are not forced into the learner surface.

Wave 2 removes seed-driven difficulty inflation and audits honest
QL × difficulty reachability. Novelty remains deferred to the later final
Reasoning novelty pass.

See:

- `CAL-001-DEEP-AUDIT-WAVE-01.md`
- `cal-001-deep-audit-wave1.test.ts`
- `cal-001-difficulty-reachability.test.ts`

## Historical evidence

The following documents are retained as historical audit/freeze records:

- `CAL-001-FINAL-SOURCE-GAP-AUDIT.md`
- `CAL-001-FINAL-DISCOVERY-FREEZE.md`
- `CAL-001-ENGLISH-EDITORIAL-FREEZE-V2.md`
- `CAL-001-MULTILINGUAL-HUMAN-FREEZE-V1.md`
- `CAL-001-QUESTION-STUDIO-COMPLETION.md`

Historical lifecycle locks in those records are superseded only by later,
explicit release authorities; the records themselves should not be rewritten.
