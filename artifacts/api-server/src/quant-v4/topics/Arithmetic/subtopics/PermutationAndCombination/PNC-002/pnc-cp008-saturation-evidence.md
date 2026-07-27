# PNC-CP-008 Saturation Evidence

## Decision

`PNC-CP-008 — Position, Relative Order, Alternation & Gap Constraints` is saturated for its current English exam ownership at `RUNTIME_PROOF` maturity.

## Admission history

The first checkpoint admitted 18 QLs, `PNC-QL-125` through `PNC-QL-142`. A material-gap review then identified five distinct contracts that could not be represented truthfully by noun substitution or by reusing an existing validator unchanged:

1. several named objects fixed to several prescribed positions;
2. a specified set occupying a named position set in any order;
3. an at-most gap condition;
4. a directional exact-gap condition;
5. an at-least count within a position class.

These became `PNC-QL-143` through `PNC-QL-147` and five companion solve modes.

## Rejected non-admissions

No new QL was admitted for:

- changing people to books, files, cards or seats without changing the counting contract;
- changing an exact position number while preserving the same evidence path;
- longer relative-order chains beyond the represented two, three and four cases when the solver remains `n! / r!`;
- swapping odd and even position wording without changing the position-class contract;
- changing the named category in a gap-placement question;
- circular versions of any restriction, which belong to CP-010;
- compulsory/excluded member or category-quota selection, which belongs to CP-009;
- grouping and distribution, which belongs to CP-011;
- exactly-one or broader mixed event systems, which belong to CP-012.

## Final evidence

- QLs: `PNC-QL-125` through `PNC-QL-147`;
- active QLs: 23;
- solve modes: 17;
- QL-specific natural explanations: 23;
- deterministic seeds per QL: 12;
- generated cases: 276;
- each generated twice: yes;
- exact duplicate templates: 0;
- duplicate explanation narratives: 0;
- unresolved placeholders: 0;
- solver/enumerator disagreements: 0;
- validation failures: 0;
- option-contract failures: 0;
- CP-007 regression failures: 0;
- English only;
- `publiclyPublishable: false`.

## Boundary after saturation

The next fixed package boundary is `PNC-CP-009 — Conditional Selection from Categories`. The next available immutable family ID is `PNC-QL-148`.
