# RNK-CP-005 — Partial Order and Ranking Uncertainty

Status: **EDITORIAL_DISCOVERY_READY — no permanent QL allocated**

This checkpoint studies ranking questions in which the displayed comparisons permit more than one complete ranking. The learner must reason across all valid rankings instead of forcing one arrangement.

## Executable discovery wave

The first wave implemented eight provisional prototypes and generated 32 questions per prototype:

```text
raw prototypes:                 8
raw discovery questions:      256
valid-order replay failures:     0
answer positions:       64 / 64 / 64 / 64
unique fingerprints:           256
permanent QLs allocated:         0
```

Every clue set has at least two valid complete rankings and is independently replayed from learner-visible evidence.

## Editorial candidates

Seven families survived the first self-review:

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
```

The editorial gate checks 24 questions per candidate family:

```text
editorial candidates:           7
editorial questions checked:  168
questions per family:           24
answer positions:       42 / 42 / 42 / 42
permanent QLs allocated:         0
```

These remain candidate source forms, not seven assumed QLs. A later merge/split audit may consolidate them or merge some into CP-004.

## Rejected prototype

```text
ORDER_UNIQUENESS_STATUS
```

It was rejected because the partial-order generator necessarily made “more than one complete ranking is possible” the repeated answer. The family added little beyond existing strict-order uniqueness work and did not justify a separate authority.

## Editorial corrections already enforced

- a must-be-true answer cannot merely repeat one displayed statement;
- a cannot-be-true answer cannot merely reverse one displayed statement;
- a definite-rank answer cannot be copied from a fixed-rank clue;
- relation options use compact exam-style statements;
- explanations use a transitive chain or one/two witness rankings instead of listing permutation counts;
- all five ranking contexts remain language parameters;
- Seating Arrangement vocabulary and geometry are prohibited.

## Core proof rule

For every displayed clue set:

1. enumerate every strict ranking satisfying all comparisons and fixed-rank anchors;
2. reject contradictory states with zero valid rankings;
3. retain at least two valid rankings for uncertainty discovery;
4. evaluate every option against the complete valid-order set;
5. treat a relation as definite only when true in every valid ranking;
6. treat it as possible when true in at least one valid ranking;
7. treat it as impossible when true in none;
8. use witness rankings to prove possible and indeterminate answers.

## Included contexts

- merit lists;
- interview shortlists;
- performance rankings;
- race finishing order;
- examination score order.

Context changes do not create separate QLs.

## Protected boundary

Excluded from this checkpoint:

- left/right seat placement;
- facing direction;
- adjacency and neighbours;
- circular, parallel-row or floor arrangements;
- complete-order reconstruction where one total order is forced, already owned by CP-004;
- arithmetic-heavy marks, ages, speeds or scores;
- shared-passage delivery as a standalone authority.

## Open consolidation questions

Before allocating `RNK-QL-036`, the audit must decide whether:

- `DEFINITELY_TRUE_RELATION` extends or duplicates CP-004 `RNK-QL-034`;
- possible, impossible and pair-indeterminate relations are one certainty-classification authority or separate answer contracts;
- minimum and maximum possible rank are one bounds authority with a direction parameter;
- definite-rank-versus-indeterminate remains separate from rank bounds.

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
