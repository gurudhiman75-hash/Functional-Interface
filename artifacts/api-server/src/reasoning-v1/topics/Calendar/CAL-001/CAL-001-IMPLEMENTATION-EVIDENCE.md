# CAL-001 Implementation Evidence

## Implemented discovery authority

- Family/package: `REAS-CAL` / `CAL-001`
- Checkpoints: 10
- Prototype authorities: 44 / 44 executable
- Permanent QLs: 0
- Locales rendered: `en-IN`, `hi-IN`, `pa-IN`
- Lifecycle: closed discovery; no storage/test/publication activation
- English editorial review: approved on `2026-08-08`
- Formal English discovery/identity freeze: pending source and authority audits

## Foundation

Implemented without JavaScript `Date` as answer authority:

- Gregorian date validator;
- timezone-free ordinal solver and inverse;
- independent odd-day weekday engine;
- three separately structured leap-year implementations;
- signed/absolute/inclusive/exclusive span contracts;
- explicit day addition/subtraction;
- full-year and month-calendar repetition engines;
- weekday-frequency formula and enumeration oracle;
- deterministic PRNG and deep canonical digests;
- checkpoint-grouped runtime modules, with one orchestration layer and no renderer-side answer recalculation.

## Proof result

`foundation-proof.test.ts` produces:

```text
PASS_CAL_001_END_TO_END_FOUNDATION
proof range                         1600–2399
fixed-vector checks                 27
exhaustive date checks              1,168,776
400-year sampled cycle checks       14,400
span/count/frequency checks          40,000
month/year frequency checks          21,600
calendar-repetition checks           305,794
prototype authorities               44
seeds per prototype                  1,000
English generated packages           44,000
deterministic replay checks          44,000
independent package verifier checks  44,000
locale parity comparisons            4,400
lifecycle violations                 0
permanent QLs                        0
```

The proof includes the fixed dates mandated by the design, exhaustive ordinal round trips, weekday continuity, a separately coded test-only weekday oracle, century mutations, 400-year invariants, Feb-29 spans, full-year repetition, month matching and formula-versus-enumeration frequency checks.

## Distractor and explanation controls

- exactly four semantic options;
- exactly one correct answer;
- no duplicate dates, weekday sets or classifications after canonicalisation;
- every wrong option has a named misconception ID and reproducible derivation;
- generic/random offset fallback is absent;
- candidates with colliding misconception outputs are deterministically rejected and regenerated;
- option diagnoses state the actual displayed wrong value and its error method;
- structured explanations carry observation, rule, actual working and conclusion.

## Review evidence

The exam-readiness export produces:

- 5 curated English questions per provisional authority;
- 220 curated English questions in total;
- 12 extended-audit candidates per provisional authority;
- 528 extended-audit English questions in total;
- JSON with full semantic and lifecycle evidence;
- CSV for editorial sorting;
- Markdown samples for human reading.

The project owner approved the corrected English review evidence on `2026-08-08`. The approved scope and retained locks are recorded in `CAL-001-ENGLISH-EDITORIAL-APPROVAL.md`.

Accepted review integrity:

```text
Future-date “was” defects          0
Duplicate-option rows              0
Empty explanation conclusions      0
Answer/explanation disagreements   0
```

## Deliberately unpassed gates

The following remain external editorial/governance decisions and remain false in code:

- final source audit;
- final merge/split, inverse and gap audits;
- formal English discovery/identity freeze;
- permanent QL allocation;
- Hindi human freeze;
- Punjabi human freeze;
- multilingual parity freeze;
- Question Bank writes;
- mock-test eligibility;
- public publication.
