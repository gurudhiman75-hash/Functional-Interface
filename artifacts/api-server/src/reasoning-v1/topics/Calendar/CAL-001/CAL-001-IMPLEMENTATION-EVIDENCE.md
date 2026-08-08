# CAL-001 Implementation Evidence

## Current authority state

- Family/package: `REAS-CAL` / `CAL-001`
- Checkpoints: 10
- Approved discovery prototypes: 44 / 44 executable
- Source-gap prototypes: 3 / 3 executable
- Frozen source prototypes: 47
- Permanent English solve identities: `CAL-QL-001..036`
- Next available identity: `CAL-QL-037`
- English editorial review: approved on `2026-08-08`
- English discovery/identity freeze: `CAL_001_ENGLISH_DISCOVERY_FREEZE_V1`
- Runtime and permanent contracts: review-only
- Question Studio, Question Bank writes, mock tests and publication: disabled

## Foundation proof

The existing foundation remains unchanged and does not use JavaScript `Date` as answer authority. It provides:

- Gregorian validation and timezone-free ordinal arithmetic;
- independent odd-day and leap-rule engines;
- signed, absolute, inclusive and exclusive date-span contracts;
- date addition/subtraction;
- full-year and month-calendar matching;
- weekday-frequency formula and enumeration oracles;
- deterministic generation and independent package verification.

`foundation-proof.test.ts` continues to prove:

```text
proof range                         1600–2399
exhaustive date checks              1,168,776
400-year sampled cycle checks       14,400
span/count/frequency checks          40,000
month/year frequency checks          21,600
calendar-repetition checks           305,794
approved prototype authorities       44
English generated packages           44,000
deterministic replay checks          44,000
independent verifier checks          44,000
locale parity comparisons             4,400
lifecycle violations                      0
```

## Approved English review evidence

- 5 curated English questions × 44 approved prototypes = 220 questions;
- 12 extended-audit questions × 44 prototypes = 528 questions;
- future-date `was` defects: 0;
- duplicate-option rows: 0;
- empty explanation conclusions: 0;
- answer/explanation disagreements: 0.

The project owner approved this evidence before the final identity audit.

## Final source-gap and identity proof

Three source-backed gaps were added without modifying the approved 44-prototype runtime:

- `CAL-GAP-PROT-001`: next same-date same-weekday year;
- `CAL-GAP-PROT-002`: enumerate named-weekday dates in a month;
- `CAL-GAP-PROT-003`: count 29 February in an inclusive year range.

`final-discovery-freeze.test.ts` proves:

```text
required source classes reviewed       6
approved discovery prototypes         44
source-gap prototypes                  3
frozen source prototypes              47
permanent QLs                          36
source-gap packages checked         1,500
curated source-gap questions checked  15
unowned source prototypes               0
duplicate source ownership              0
release-lock violations                  0
```

The permanent mapping is encoded in `permanent-contracts.ts`; the governance result is recorded in `CAL-001-FINAL-SOURCE-GAP-AUDIT.md` and `CAL-001-FINAL-DISCOVERY-FREEZE.md`.

## Gates intentionally still closed

- Hindi human freeze;
- Punjabi human freeze;
- multilingual parity freeze;
- Question Studio activation;
- Question Bank storage or writes;
- mock-test eligibility;
- public publication.
