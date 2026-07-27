# PNC-CP-009 Saturation Evidence

## Decision

`PNC-CP-009 — Conditional Selection from Categories` is saturated for its current English exam ownership at `RUNTIME_PROOF` maturity.

## Admission history

The first checkpoint admitted 25 QLs, `PNC-QL-148` through `PNC-QL-172`. Review then identified two distinct condition families that could not be represented truthfully by changing nouns or numeric values:

1. a lower-and-upper inclusive range for the number selected from a specified subset;
2. simultaneous category bounds, including two lower bounds or a bounded Category-A interval.

These became `PNC-QL-173` through `PNC-QL-176` under `countSpecifiedMemberRange` and `countTwoCategoryRange`.

## Rejected non-admissions

No new QL was admitted for:

- changing committee, team, panel or group nouns without changing the selection predicate;
- changing category labels such as women/men, teachers/students or departments;
- changing the actual quota values while retaining the same exact, at-least, at-most or range contract;
- unrestricted committee selection, owned by CP-003;
- office or role assignment after selection, owned by CP-006;
- circular selection/arrangement variants, owned by CP-010;
- partitioning into groups, owned by CP-011;
- broader mixed inclusion–exclusion systems, owned by CP-012.

## Final evidence

- QLs: `PNC-QL-148` through `PNC-QL-176`;
- active QLs: 29;
- solve modes: 21;
- QL-specific natural explanations: 29;
- deterministic seeds per QL: 12;
- generated cases: 348;
- each generated twice: yes;
- exact duplicate templates: 0;
- duplicate explanation narratives: 0;
- unresolved placeholders: 0;
- solver/enumerator disagreements: 0;
- validation failures: 0;
- option-contract failures: 0;
- CP-007 and CP-008 regression failures: 0;
- English only;
- `publiclyPublishable: false`.

## Boundary after saturation

The next fixed package boundary is `PNC-CP-010 — Circular Arrangements & Rotational Symmetry`. The next available immutable family ID is `PNC-QL-177`.
