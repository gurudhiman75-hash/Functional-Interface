# RNK-CP-005 — Partial Order and Ranking Uncertainty

Status: **EDITORIAL V2 REVIEW READY — no permanent QL allocated**

This checkpoint studies ranking questions in which the displayed comparisons permit more than one complete ranking. The learner must reason across all valid rankings instead of forcing one arrangement.

## Raw discovery

```text
raw prototypes:                 8
questions per prototype:       32
raw discovery questions:      256
valid rankings/question:      >=2
answer positions:       64 / 64 / 64 / 64
unique fingerprints:           256
```

Every answer is independently replayed from the learner-visible comparison graph and optional fixed-rank anchor.

## Editorial V2 source forms

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
```

Rejected:

```text
ORDER_UNIQUENESS_STATUS
```

It repeatedly produced the same multiple-order conclusion and did not justify a separate authority.

## Provisional authority consolidation

Seven source forms are consolidated into four authority candidates:

```text
RELATION_TRUTH_STATUS
  must be true
  could be true
  cannot be true

RELATIVE_RANK_DETERMINACY
  named pair cannot be determined uniquely

POSSIBLE_RANK_BOUND
  highest possible rank
  lowest possible rank

EXACT_RANK_DETERMINACY
  exact rank or cannot be determined uniquely
```

These are provisional authority candidates, not allocated QLs.

See `RNK-CP-005-EDITORIAL-V2-MERGE-SPLIT-AUDIT.md`.

## Editorial V2 evidence

```text
source forms:                    7
questions per source form:      24
questions checked:             168
provisional authorities:         4
answer positions:       42 / 42 / 42 / 42

Easy:                           12
Medium:                         84
Hard:                           72

permanent QLs allocated:         0
```

Exact-head proof:

```text
workflow run: 31309207564
head:         434c950620262d3b2297cc81d72b5ece7d2de036
result:       PASS
```

## V2 option-design correction

The previous pack repeatedly fixed one person in three or four options. V2 prohibits that pattern in generic relation questions.

```text
comparison options:            4
ordered pairs represented:     4
unordered pairs represented:   4
minimum distinct people:       4
maximum appearances/person:    2
```

A named pair may repeat across options only when the stem explicitly asks about that pair's relative ranks.

## Other V2 gates

- a must-be-true answer cannot merely repeat a displayed clue;
- a cannot-be-true answer cannot merely reverse a displayed clue;
- an endpoint fixed-rank anchor cannot independently reveal the correct relation;
- rank-bound targets require at least two compulsory predecessors or successors;
- rank-bound explanations prove both the limit and attainability;
- definite exact ranks use structural universal proof, not two examples;
- indeterminate answers use two valid witness orders;
- learner explanations do not expose permutation counts;
- ambiguous phrases such as “lower merit rank” and “lower score rank” are prohibited;
- difficulty is based on the required proof, not merely the number of names;
- Seating Arrangement vocabulary and geometry remain prohibited.

## Core proof rule

For every displayed clue set:

1. enumerate every strict ranking satisfying all comparisons and fixed-rank anchors;
2. reject contradictory states with zero valid rankings;
3. retain at least two valid rankings for uncertainty discovery;
4. evaluate every option against the complete valid-order set;
5. mark a relation definite only when true in every valid ranking;
6. mark it possible when true in at least one valid ranking;
7. mark it impossible when true in none;
8. prove bounds with a compulsory-count limit and an attainable witness;
9. prove indeterminacy with two valid rankings giving different conclusions.

## Ownership boundary

Included:

- incomplete strict-comparison graphs;
- truth status across several valid rankings;
- named-pair determinacy;
- possible rank bounds;
- exact-rank invariance or indeterminacy.

Excluded:

- unique complete strict-order reconstruction, owned by CP-004;
- left/right placement, facing, adjacency and neighbours, owned by Seating Arrangement;
- shared-passage delivery as a standalone QL;
- arithmetic-heavy marks, ages, speeds or scores;
- statement-wise sufficiency labels, owned by Data Sufficiency.

## Decision still required

Before allocating `RNK-QL-036`, human review and exam-source evidence must decide whether:

- all four provisional authorities remain separate;
- relative-rank determinacy merges into relation truth status;
- partial definite-relation mode extends CP-004 `RNK-QL-034` rather than creating a new authority.

## Lifecycle

```text
permanent QLs:        0
next available QL:    RNK-QL-036
English freeze:       false
Question Studio:      DISABLED
Question Bank:        NOT_STORED
test eligibility:     INELIGIBLE
public publication:   false
Hindi/Punjabi:        NOT_STARTED
```
