# INT-CP-003 — Annual Compound Interest Fundamentals and Inverses

Status: `SECOND_REMEDIATION_REVIEW_CANDIDATE — STAGING_LOCKED`

## Ownership boundary

This checkpoint owns one principal under one constant annual compound rate for complete annual periods, with no intervening cash flow and no sub-annual conversion.

It does not own half-yearly or broken-period compounding, variable rates, SI-versus-CI differences, instalments or dated cash flows. Those remain assigned to later Interest checkpoints.

## Permanent mathematical inventory

```text
Legacy families owned:        14 / 14
Permanent English QLs:        14
QL range:                     INT-QL-053..INT-QL-066
Open mathematical gaps:       0
Next available identity:      INT-QL-067
```

The mathematical inventory remains unchanged after the second editorial rejection.

## Second rejection and replacement architecture

The first remediation corrected formatting and option-analysis alignment but did not remove deeper generation coupling. The second remediation therefore replaces the learner-facing architecture with the following independent chain:

```text
QL authority
    ↓
contract-specific exact mathematical state
    ↓
independent visible presentation selector
    ↓
misconception-calculated options + deterministic shuffle
    ↓
feature-derived difficulty
    ↓
method-aware explanation composer
```

### Contract-specific states and fingerprints

Every solve mode has a discriminated state containing only fields that affect that contract. The mathematical fingerprint is generated only from those relevant fields and the exact answer. Unused timing fields cannot inflate diversity.

### Exact weighted rate library

The authority contains 16 exact rational rates:

```text
4%, 5%, 6.25%, 8%, 8⅓%, 10%, 12.5%, 15%, 16⅔%,
20%, 25%, 30%, 33⅓%, 40%, 50%, 14 2/7%
```

Principals are constructed to remain compatible with annual-factor denominators and required powers. Amount-ratio rate recovery uses two complete years; nth-year rate recovery is restricted to the second or third year.

### Visible representations

```text
STANDARD_PROSE
ACCOUNT_TABLE
BALANCE_LEDGER
GROWTH_RATIO
BANK_STATEMENT
MISSING_ENTRY
```

Non-prose representations contain an actual rendered table or ledger. Rate, representation, stem family and difficulty are sampled independently.

### Options, difficulty and explanations

Every wrong option stores its exact wrong calculation, diagnostic misconception code and student feedback. Options are shuffled deterministically, while audits reject fixed cycles and excessive position runs.

Difficulty is derived from conceptual transformations, direct/inverse/multi-stage direction, arithmetic burden, year gap and representation-reading burden.

The explanation composer stores exam, student and foundation depths. Shortcut and verification sections are optional. Learner-facing engineering terminology and malformed MathJax delimiter patterns are runtime-blocked.

### QL-065 correction

The learner receives principal, rate and required durations, not the two derived amounts. Consecutive durations use the later-year-interest relationship; wider gaps require calculating both amounts.

## Exact-head proof

```text
Validated head:                    6ddd4a5063aab3a47c4543cf525bb1f61030c12c
CP-003 workflow run:               30826643529 — PASS
```

Full 1,400-question audit:

```text
Questions:                         1,400
Deterministic checks:              1,400
State/fingerprint key checks:      8,800
Option checks:                     5,600
Visible representation checks:    1,400
Explanation checks:               7,000
Lifecycle checks:                 9,800
Rate coverage:                    16 / 16
Representation coverage:           6 / 6
Numerical families:                  922
Mathematical fingerprints:         1,088
Difficulty:              201 Easy / 751 Medium / 448 Hard
Answer positions:        360 / 339 / 350 / 351
Maximum same-position run:             6
```

Stratified review pack:

```text
Questions:                         56
QLs:                               14
Samples per QL:                     4
Distinct mathematical states:      56
Distinct numerical families:       56
Rate coverage:                 16 / 16
Representation coverage:        6 / 6
Difficulty:              9 Easy / 30 Medium / 17 Hard
Answer positions:         13 / 14 / 15 / 14
Option-analysis alignments:   224 / 224
Tagged wrong options:         168 / 168
Rendered templates per QL:       3–4
Malformed MathJax delimiters:       0
```

Evidence artifact:

```text
Name:    int-cp003-exam-readiness-remediation-review-candidate
ID:      8861122318
Digest:  sha256:30d9e63c1381053df67e3ea13cfdd8ecc54ab4e5025c7e3ca820ff95f05101e9
Expires: 2026-08-17
```

## Lifecycle locks

```text
releaseCandidateId:          INT-CP-003-EN-v1-candidate
editorialStatus:             SECOND_REMEDIATION_REVIEW_CANDIDATE
approvalStatus:              WITHDRAWN_PENDING_REAUDIT
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

No immutable English freeze may be created until this second-remediation corpus receives fresh explicit approval.
