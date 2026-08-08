# RNK-CP-005 — Partial Order and Ranking Uncertainty

Status: **DISCOVERY_ACTIVE — no permanent QL allocated**

This checkpoint owns ranking questions in which the displayed comparisons allow more than one complete ranking. The learner must reason across all valid rankings rather than force one arrangement.

## Provisional discovery families

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
ORDER_UNIQUENESS_STATUS
```

These are prototypes, not permanent QLs. `RNK-QL-036` remains available.

## Core proof rule

For every displayed clue set:

1. enumerate every strict ranking satisfying all comparisons and any fixed-rank anchor;
2. reject contradictory states with zero valid rankings;
3. retain at least two valid rankings for genuine uncertainty discovery;
4. evaluate each option against the full valid-order set;
5. mark a relation definite only when true in every valid ranking;
6. mark it possible when true in at least one valid ranking;
7. mark it impossible when true in none.

## Included contexts

- merit lists;
- interview shortlists;
- performance rankings;
- race finishing order;
- examination score order.

Context changes are language parameters and do not create separate QLs.

## Protected boundary

Excluded from this checkpoint:

- left/right seat placement;
- facing direction;
- adjacency and neighbours;
- circular, parallel-row or floor arrangements;
- complete-order reconstruction where one total order is forced, already owned by CP-004;
- arithmetic-heavy marks, ages, speeds or scores;
- shared-passage delivery as a standalone authority.

## Discovery target

The first executable wave generates 32 instances for each of eight provisional families: 256 questions in total.

The discovery gate requires:

- at least two valid complete rankings per clue set;
- independent valid-order replay;
- exactly one correct option;
- all four answer positions balanced;
- all five ranking contexts;
- four partial-order graph topologies;
- no Seating Arrangement vocabulary;
- no permanent QL allocation;
- all product lifecycle locks closed.

## Lifecycle

```text
permanent QLs:        0
next available QL:    RNK-QL-036
Question Studio:      DISABLED
Question Bank:        NOT_STORED
test eligibility:     INELIGIBLE
public publication:   false
Hindi/Punjabi:        NOT_STARTED
```
