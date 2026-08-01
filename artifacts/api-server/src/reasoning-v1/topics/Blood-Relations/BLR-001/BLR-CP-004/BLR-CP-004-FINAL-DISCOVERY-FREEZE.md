# BLR-CP-004 — Final English Discovery Freeze

Status: **checkpoint complete; English discovery frozen; permanent review runtime available; delivery surfaces locked**.

## Owner directive

On 2026-08-01, the project owner directed:

> Approved continue and finish next CP

This authorises completion of the CP-004 discovery and permanent review-runtime gates. It does not authorise Question Studio activation, localisation, publication or merge.

## Scope

CP-004 owns definite counts and family-composition quantities over an explicit, closed family universe:

- distinct named members;
- male and female members;
- members with a named spouse;
- explicitly unmarried members;
- members whose marital status remains unstated;
- members on a requested generation row;
- direct, extended, blood and affinal relatives of a named reference;
- children shared by a named couple;
- married, sibling, parent-child and cousin pairs;
- occupied generations;
- multi-component family-composition profiles.

Minimum, maximum, possible and indeterminate counts remain owned by `BLR-CP-005`. Coded relations remain in `BLR-CP-006/007`. Profession, city, colour, floor and seating composition remain puzzle content. Statement-wise sufficiency remains Data Sufficiency.

## Discovery result

```text
approved English review questions          612
approved shared-passage groups             102
source graph topologies                       9
source prototypes                            13
frozen solve authorities                      5
permanent QLs                                 5
full learner-item signatures unique         612 / 612
```

Each of the 102 approved CP-003 family graphs supplies six independently solved CP-004 items:

1. a filtered member count;
2. a direct or extended relative count;
3. a shared-child or second relative count;
4. a relation-pair count;
5. a generation count;
6. a family-composition profile.

Counts were discovered through source, edge, inverse and overlap audits. They were not selected as quotas.

## Permanent QLs

```text
BLR-QL-013  COUNT_MEMBERS_BY_FILTER
BLR-QL-014  COUNT_RELATIVES_OF_REFERENCE
BLR-QL-015  COUNT_RELATION_PAIRS
BLR-QL-016  COUNT_GENERATIONS
BLR-QL-017  SELECT_FAMILY_COMPOSITION_PROFILE
```

The next available chapter identity is `BLR-QL-018`.

### Merge decisions

`BLR-QL-013` keeps total, gender, marital-status and generation-row predicates as parameters because all count people inside an explicit universe.

`BLR-QL-014` keeps direct/extended relation vocabulary and one-person/two-parent references as parameters because the solver still enumerates matching people and returns their cardinality.

`BLR-QL-015` keeps marriage, sibling, parent-child and cousin predicates as parameters because every mode canonicalises relation pairs, removes duplicates and returns a number.

`BLR-QL-016` stays separate because the counted entities are occupied generation rows rather than people or person pairs.

`BLR-QL-017` stays separate because the answer is a four-component vector and every component must be jointly correct.

## Cross-checkpoint boundary

CP-003 person/set answers and CP-004 number answers remain separate contracts:

- identifying one or all relatives is not the same as returning only the count;
- selecting one unordered family pair is not the same as enumerating all matching pairs;
- comparing the generation of two people is not the same as counting all occupied generations;
- no earlier QL owns a composition-vector answer.

## Runtime and independent proof

The permanent runtime supports:

- deterministic generation by QL and seed;
- deterministic generation of an intact six-item shared-passage group;
- graph-derived options and personalised explanations;
- independent recomputation of every answer from family nodes and edges;
- explicit zero-count cases without inventing people or relations;
- canonical unordered-pair counting;
- strict separation of married, explicitly unmarried and unresolved status.

Every record remains English review-only and retains the approved SVG family tree and ASCII fallback inherited from the frozen family graph.

## Release boundary

```text
structural saturation                    approved
final English discovery freeze           approved
permanent CP-004 QLs                      5
permanent QL range                        BLR-QL-013..BLR-QL-017
next available chapter QL                BLR-QL-018
English permanent review runtime         available
Question Studio                          disabled
Question Bank                            disabled
mock tests                               disabled
Hindi/Punjabi localisation               disabled
public publication                       disabled
production staging                       disabled
merge                                    not authorised
```
