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

## Completed checkpoint 7 — CP-006 selection then arrangement/roles

Ten QLs, `PNC-QL-095` through `PNC-QL-104`, implemented:

- selecting a committee/team before one, two or three distinct appointments;
- shortlisting finalists before ranked awards;
- selecting a subset before arranging every selected item;
- explicit `nCs × sPk` and `nCs × s! = nPs` evidence;
- the role-assignment multiplier `sPk`;
- bounded unique recovery of the pool size, selected-group size or role count.

Four solve contracts were sufficient at semantic saturation:

- `selectThenAssignDistinctRoles`;
- `selectThenArrangeAllSelected`;
- `findRoleAssignmentMultiplier`;
- `recoverSelectionRoleParameter`.

The current PNC-001 snapshot is 104 English QLs and 34 active solve modes. These are descriptive regression values, not targets.

## Next package action — PNC-001 saturation and freeze-readiness audit

All six PNC-001 ownership boundaries now have runtime coverage. Before beginning PNC-002, run a package-wide review across CP-001 through CP-006 for:

- coverage saturation and important PYQ/reference gaps;
- ownership overlap between CP-002, CP-003 and CP-006;
- exact and near duplicates;
- editorial realism and exam-style stems;
- context concentration;
- solver/verifier stability across representative and stress seeds;
- placeholder and localization readiness;
- CP-005 word/letter completeness;
- integration and freeze readiness.

The audit may justify targeted additions or corrections within an existing CP. It must not expand the corpus merely to meet a count.

## After PNC-001 maturity review

Only after the package-level review should PNC-002 implementation begin with:

```text
PNC-CP-007 — Together, Apart & Block Restrictions
```

## Merge rule

Every checkpoint must preserve registry/language parity, deterministic generation, independent verification where practical and complete runtime support for every active QL. Generation-engine integration, publication and localization remain deferred until package-level maturity approval.
