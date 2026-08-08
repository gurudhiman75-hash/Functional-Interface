# NUM-CP-007 Wave 01 — Division Algorithm Foundation

**Package:** `NUM-002 — Remainders, Digits, Powers, Bases and Number-Theory Synthesis`  
**Checkpoint:** `NUM-CP-007 — Division Algorithm and Elementary Remainder Transformation`  
**Lifecycle:** executable discovery only  
**Permanent QLs:** `0`  
**Next available chapter identity:** `NUM-QL-098` — not allocated by this wave

## Purpose

Wave 01 establishes the exact arithmetic foundation for one-stage division states and elementary compatible remainder propagation. It does not attempt simultaneous congruences, power remainders, terminal digits or same-remainder HCF optimisation.

## Temporary prototype contracts

```text
NUM-CP007-PROT-001 — recover remainder from dividend, divisor and quotient
NUM-CP007-PROT-002 — recover dividend from divisor, quotient and remainder
NUM-CP007-PROT-003 — recover divisor from dividend, quotient and remainder
NUM-CP007-PROT-004 — recover quotient from dividend, divisor and remainder
NUM-CP007-PROT-005 — select a valid division-algorithm state
NUM-CP007-PROT-006 — remainder of a sum from component remainders
NUM-CP007-PROT-007 — remainder of a product from component remainders
NUM-CP007-PROT-008 — least non-negative addition or subtraction for exact divisibility
```

## Mathematical authority

For positive divisor `d`:

```text
N = dq + r
0 ≤ r < d
```

Every generator is built from a complete valid state. An independent verifier reconstructs the answer from hidden rendered givens rather than trusting the option-authoring route.

## Explanation contract

The learner explanation is intentionally clutter-free:

1. core concept;
2. brief strategy;
3. numbered working;
4. one final answer.

Exam-speed, common-trap and repeated-answer sections are excluded from this checkpoint authority.

## Ownership boundaries

- same-remainder greatest-divisor optimisation → `NUM-CP-006`;
- simultaneous congruences, power remainders and independent modular systems → `NUM-CP-008`;
- terminal-digit outputs → `NUM-CP-009`;
- divisibility-only missing-digit problems → `NUM-CP-003`;
- generic linear equations without an essential division state → Algebra;
- frozen n-digit extremum-multiple authority remains `NUM-CP-003`.

## Required proof

```text
Temporary prototypes:            8
Seeds per prototype:           100
Runtime packages:              800
Deterministic replay checks:   800
Independent verifier checks:   800
Structural audit packages:     480
English review questions:       24
Permanent QLs:                   0
```

Each prototype must reach all four answer positions, at least two state-derived difficulty bands and at least forty distinct mathematical fingerprints. All Question Studio, Question Bank, test and public routes remain closed.

## Open after Wave 01

Later discovery waves must cover difference/scaling/nested propagation, bounded polynomial remainders, linked divisor-quotient-remainder relations, range-bounded reconstruction, one/many/no-solution states, nearest-multiple ties, claims, data sufficiency, mini-caselets, source saturation and final merge/split review.
