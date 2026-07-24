# PNC-001 Need-Based Implementation Plan

The six CP ownership boundaries in PNC-001 are fixed by the family roadmap. QLs, solve modes and checkpoint sizes inside them remain need-based.

## Completed checkpoint 1 — CP-001 counting foundations

The initial 48 English QLs covered counting principles, case partition, simple complement and exact missing-factor recovery.

## Completed checkpoint 2 — CP-001 factorial foundation extension

A reference-led review admitted ten factorial QLs, `PNC-QL-049` through `PNC-QL-058`, and the five runtime contracts they required.

## Completed checkpoint 3 — CP-002 distinct permutations

Eight QLs, `PNC-QL-059` through `PNC-QL-066`, introduced all-object arrangements, partial `nPr` and bounded inverse parameters.

## Completed checkpoint 4 — CP-003 basic combinations

Eight QLs, `PNC-QL-067` through `PNC-QL-074`, introduced direct unordered selection, bounded inverse combinations and complementary-index symmetry.

## Completed checkpoint 5 — CP-005 repeated-object/multiset portion

Eight QLs, `PNC-QL-075` through `PNC-QL-082`, implemented direct multiset arrangements, fixed-position multiplicity reduction, overcount factors and bounded multiplicity recovery.

This work belongs to `PNC-CP-005 — Word, Letter & Multiset Arrangements`. CP-005 remains open to additional need-based word/letter directions.

## Completed checkpoint 6 — CP-004 digit, number and code formation

Twelve QLs, `PNC-QL-083` through `PNC-QL-094`, implemented:

- leading-zero semantics;
- repetition allowed/forbidden;
- number versus code distinction;
- parity and divisibility-by-5 final-digit cases;
- controlled prefix thresholds;
- alphanumeric stages;
- inverse code alphabet size;
- exactly-one-pair code patterns.

The current package snapshot is 94 English QLs and 30 active solve modes. These are descriptive regression values, not targets.

## Next fixed ownership target — CP-006

The only wholly unimplemented CP in PNC-001 is:

```text
PNC-CP-006 — Selection-Then-Arrangement & Role Assignment
```

Before implementing its first checkpoint:

1. compare reference/PYQ motifs against CP-002 and CP-003 coverage;
2. admit only mixed select-then-order constructions that neither earlier CP owns cleanly;
3. document the required QLs and solve modes without assigning a quota;
4. implement solver, evidence, independent verification, explanation, distractors and validators together;
5. keep complex multi-condition systems deferred to CP-012.

Likely CP-006 candidate directions include committees with offices, selecting finalists and assigning ranks, captain/vice-captain selection, and choosing a subset before arranging all or some selected members. These are candidates within a fixed CP boundary, not pre-approved QLs.

## After CP-006

Run a package-wide review across CP-001 through CP-006 for:

- coverage saturation;
- ownership overlap;
- exact and near duplicates;
- editorial realism;
- context concentration;
- solver/verifier stability;
- placeholder and localization readiness;
- integration and freeze readiness.

Only after that review should package PNC-002 implementation begin with CP-007.

## Merge rule

Every checkpoint must preserve registry/language parity, deterministic generation, independent verification where practical and complete runtime support for every active QL. Generation-engine integration, publication and localization remain deferred until package-level maturity approval.
