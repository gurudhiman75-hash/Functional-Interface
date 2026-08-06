# MEN-CP-011 Foundation Wave 01 — Exam-Readiness Remediation

## Status

This record implements the immediate correctness and integrity actions from the Wave 01 critical exam-readiness review.

```text
Checkpoint:                 MEN-CP-011
Wave:                       MEN-CP-011-FOUNDATION-WAVE-01
Runtime diagram authority:  TUBE_EXAMTREE_EXAM_READY_V2
Permanent QLs:              0
Question Studio:            disabled
Question Bank:              NOT_STORED
Test eligibility:           INELIGIBLE
Public publication:         false
```

This remediation does **not** declare the 48-record review batch publishable. It closes the immediate prompt-integrity, option-order, TeX and rendering-surface defects while preserving explicit blockers for state-pool diversity, chapter coverage and manual review.

## P0 closures

### Prompt-safe and solution-specific diagrams

The runtime now produces two diagrams:

- `diagram`: prompt-safe diagram;
- `solutionDiagram`: post-submission solution diagram.

For `OUTER_RADIUS_AND_THICKNESS` and `INVERSE_INNER_RADIUS`:

```text
Prompt:   r = ?
Solution: r = derived numeric value
```

The prompt validator rejects any numerical inner radius that was not explicitly supplied in the stem.

### Improved dimension geometry

`TUBE_EXAMTREE_EXAM_READY_V2` enforces:

- one uncut tube;
- white background;
- matching top and bottom outer ellipses;
- dashed hidden bore walls and bottom inner ellipse;
- centre point `O`;
- radius guides connected from `O` to the measured boundary;
- detached label boxes so numbers do not overlap dimension lines;
- diameter extension lines outside the top face;
- wall thickness aligned radially across the annular rim;
- height outside the right side;
- viewBox-driven responsive SVG with no fixed width or minimum-width contract.

### Independent option permutation

Canonical options are created first. A separate namespace then shuffles them:

```text
MEN-CP011-OPTION-PERMUTATION-V2|<question seed>
```

The 48-record review batch uses four different answer-position plans and balances correct answers exactly:

```text
A: 12
B: 12
C: 12
D: 12
```

No two prototypes may share the same 12-question answer sequence.

### Duplicate-safe review batch

The batch assembler retries deterministic candidate seeds until it satisfies:

- no exact duplicate stems;
- no exact duplicate stem-and-option packages;
- normalized stem skeleton repeated at most three times;
- one physical state repeated at most twice inside a prototype;
- independently targeted balanced answer positions.

This is a review-batch gate, not a substitute for the larger publishable state pool still required.

### TeX correction and linting

The runtime repairs the malformed command:

```text
\pih  ->  \pi h
```

Visible TeX is checked for:

- unsupported commands;
- unbalanced dollar delimiters;
- the invalid `\pih` sequence.

### Learner/admin data separation

The runtime now exposes distinct contracts:

```text
Attempt:
  no diagram for these text-complete items
  no internal codes

Practice:
  optional prompt-safe diagram
  no internal codes

Solution:
  solution diagram
  concise formula and steps
  natural wrong-option analysis
  no trap codes or verifier tokens

Admin:
  full five-element explanation
  coded misconception metadata
  exact verifier
  canonical state and validation
```

## Automated proof

The canonical workflow now proves:

- existing 320-package base mathematics and distractor authority;
- 128 deterministic exam-ready V2 runtime packages;
- 48 duplicate-safe batch records;
- prompt-versus-solution diagram safety;
- detached labels and centre-connected radii;
- independent option placement and exact A/B/C/D balance;
- no visible `\pih`;
- learner metadata isolation;
- lifecycle locks.

## Remaining blockers

The batch audit intentionally remains:

```text
publicationEligible: false
```

with blockers:

- `INSUFFICIENT_PHYSICAL_STATE_DIVERSITY`;
- `CHAPTER_COVERAGE_INCOMPLETE`;
- `PERMANENT_QLS_UNALLOCATED`;
- `MANUAL_ENGLISH_REVIEW_PENDING`.

The current eight-state parity fixture must not be treated as the future student pool. Phase 2 must expand number families, units, representations and coverage before any permanent QL allocation.
