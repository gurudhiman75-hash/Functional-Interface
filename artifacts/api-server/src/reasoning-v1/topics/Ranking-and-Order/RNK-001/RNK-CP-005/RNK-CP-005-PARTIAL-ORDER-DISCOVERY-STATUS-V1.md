# RNK-CP-005 — Partial-Order Discovery Status V1

Status: **EDITORIAL_DISCOVERY_READY — NOT FROZEN**

## Purpose

This record captures the first executable discovery of ranking uncertainty after the book-to-QL audit rejected presentation-led shared sets and Seating Arrangement overlap.

No permanent identity is allocated by this record.

## Discovery identity

```text
checkpoint:             RNK-CP-005
discovery version:      RNK_CP005_PARTIAL_ORDER_DISCOVERY_V1
editorial version:      RNK_CP005_PARTIAL_ORDER_EDITORIAL_V1
next available QL:      RNK-QL-036
permanent QLs:          0
permanent runtime:      none
Question Studio entry:  none
```

## Raw executable wave

```text
provisional prototypes:       8
questions per prototype:     32
total questions:            256
valid orders per question:  >=2
answer positions:     64 / 64 / 64 / 64
unique fingerprints:        256
```

The engine covers:

- five ranking contexts;
- four partial-order graph topologies;
- optional fixed-rank anchors;
- exhaustive bounded enumeration of all compatible strict rankings;
- independent answer replay from the complete valid-order set.

## Editorial decision

Seven source forms advance to human review:

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
```

Editorial gate:

```text
questions per candidate:      24
candidate questions:         168
answer positions:      42 / 42 / 42 / 42
unique fingerprints:         168
```

One source form is rejected:

```text
ORDER_UNIQUENESS_STATUS
```

Reason: it always asked the learner to identify that several orders were possible, duplicated strict-order uniqueness ownership and lacked enough answer diversity to justify advancement.

## Quality protections

The editorial layer rejects:

- a definite conclusion copied directly from one clue;
- an impossible conclusion formed only by reversing one clue;
- an exact rank copied from a displayed fixed-rank anchor;
- seating, facing, adjacency or neighbour geometry;
- verbose option prefixes;
- learner explanations based on raw permutation counts.

The retained explanation styles are:

- transitive comparison chain for definite/impossible conclusions;
- one witness order for a possible conclusion;
- two opposite witness orders for an indeterminate pair;
- attainable extreme order for minimum/maximum possible rank;
- contrasting rank witnesses for an indeterminate exact rank.

## Merge/split audit still required

The seven candidate forms must not become seven QLs automatically.

Required decisions:

1. determine whether partial-order definite relation extends or duplicates `RNK-QL-034`;
2. test whether possible, impossible and cannot-determine pair relations share one certainty-classification contract;
3. merge minimum and maximum possible rank if direction is only a parameter;
4. separate exact-rank indeterminacy only if its proof and answer contract remain materially distinct;
5. verify sufficient SSC, banking and Punjab-state exam frequency before allocation.

## Lifecycle

```text
English freeze:        false
manual approval:       pending
permanent QL:          none
Question Studio:       DISABLED
persistence:           DISABLED
Question Bank:         NOT_STORED
test eligibility:      INELIGIBLE
public publication:    false
Hindi/Punjabi:         NOT_STARTED
```
