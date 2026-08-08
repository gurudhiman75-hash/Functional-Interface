# CAL-001 — Calendar

Executable discovery implementation of the Calendar master design for Reasoning V1 Family F.

## Structure

```text
foundation.ts                 Gregorian, odd-day, span, repetition, frequency and PRNG engines
registry.ts                   44 provisional prototype authorities across CAL-CP-001…010
runtime-shared.ts             semantic rendering, options, explanations and difficulty helpers
runtime-cp001.ts              basic weekday-shift authorities
runtime-cp002.ts              ordinary date-relation authorities
runtime-cp003.ts              leap-boundary and count-semantics authorities
runtime-cp004-005.ts          absolute-date and cross-year authorities
runtime-cp006-007.ts          leap-classification and century authorities
runtime-cp008.ts              calendar-repetition authorities
runtime-cp009.ts              month/year boundary authorities
runtime-cp010.ts              weekday-frequency authorities
runtime.ts                    deterministic package orchestration and lifecycle closure
verifier.ts                   package-level independent recomputation and lifecycle checks
foundation-proof.test.ts      exhaustive 1600–2399 and 1,000-seed-per-prototype proof
source-audit-gate.ts          initial uploaded-book audit and hard source-coverage gate
question-studio-contract.ts   review metadata adapter, filters and activation lock
review-export.ts              528-row English prototype review pack
index.ts                      package exports
```

## Run proof

From this directory on Node 22 or later:

```bash
node --experimental-strip-types foundation-proof.test.ts
```

## Generate review evidence

```bash
CAL_REVIEW_OUTPUT_DIR=./dist node --experimental-strip-types review-export.ts
```

## Lifecycle

This package is executable for internal discovery only.

```text
Permanent QLs:                0
Question Studio public view:  false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
```

Do not bypass `assertCalendarActivationAllowed`. Source, merge/split, inverse, gap and human-language gates must be approved separately.
