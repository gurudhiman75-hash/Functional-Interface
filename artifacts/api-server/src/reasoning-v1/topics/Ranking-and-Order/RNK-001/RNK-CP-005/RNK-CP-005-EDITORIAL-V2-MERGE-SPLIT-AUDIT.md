# RNK-CP-005 — Editorial V2 Merge/Split Audit

Status: **PROVISIONAL AUTHORITY CONSOLIDATION — no permanent QL allocated**

Date: 2026-08-09

## Decision summary

The seven surviving source forms do **not** justify seven permanent QLs.

They consolidate into four provisional authority candidates:

```text
RELATION_TRUTH_STATUS
  - DEFINITELY_TRUE_RELATION
  - POSSIBLE_RELATION
  - IMPOSSIBLE_RELATION

RELATIVE_RANK_DETERMINACY
  - PAIR_RELATION_CANNOT_BE_DETERMINED

POSSIBLE_RANK_BOUND
  - MINIMUM_POSSIBLE_RANK
  - MAXIMUM_POSSIBLE_RANK

EXACT_RANK_DETERMINACY
  - DEFINITE_RANK_OR_INDETERMINATE
```

`ORDER_UNIQUENESS_STATUS` remains rejected.

No identity from `RNK-QL-036` onward is allocated by this audit.

## 1. Relation truth status

### Included source forms

```text
must be true
could be true
cannot be true
```

### Why they merge

All three forms use the same proof object:

1. construct the incomplete comparison graph;
2. obtain every valid strict ranking;
3. evaluate one ordered relation across that same set;
4. classify the relation as universal, possible or impossible.

The wording of the question changes the acceptance condition, not the underlying authority.

### CP-004 boundary

CP-004 `RNK-QL-034` owns a definitely-true transitive relation when the displayed evidence belongs to strict-order reconstruction.

The CP-005 candidate is narrower and different only when:

- more than one complete ranking remains valid; and
- the answer must be proved across all of those valid rankings.

Source validation is still required before deciding whether this deserves a new QL or should extend `RNK-QL-034` through an uncertainty mode.

## 2. Relative-rank determinacy

### Included source form

```text
PAIR_RELATION_CANNOT_BE_DETERMINED
```

### Why it provisionally remains separate

Its answer contract is not merely “could be true.” The learner must establish both directions:

```text
one valid ranking places A above B
and
another valid ranking places B above A
```

The output is a three-way conclusion about a named pair:

```text
A must be above B
B must be above A
cannot be determined uniquely
```

This may later merge into `RELATION_TRUTH_STATUS`, but only after exam-source evidence and human review show that a separate named-pair determinacy contract adds no value.

## 3. Possible rank bound

### Included source forms

```text
highest possible rank
lowest possible rank
```

### Why they merge

Both forms calculate one boundary of the same attainable-rank set.

Direction is a parameter:

```text
highest possible rank -> minimum numbered attainable rank
lowest possible rank  -> maximum numbered attainable rank
```

Every accepted explanation must contain:

1. a limit proof naming the compulsory predecessors or successors; and
2. a witness ranking showing the limit is attainable.

A separate QL for each direction would duplicate the same solver and proof contract.

## 4. Exact rank determinacy

### Included source form

```text
exact rank or cannot be determined uniquely
```

### Why it remains separate

This authority asks whether a person's rank is invariant across every valid ranking.

It differs from a rank-bound question because the final answer may be:

- one exact fixed rank; or
- an indeterminate conclusion supported by two different attainable ranks.

For a definite exact rank, structural proof must account for every other person as necessarily above or necessarily below the target. Two example rankings are not a universal proof.

## 5. Editorial V2 gates

The V2 corpus enforces the following corrections:

```text
generic relation options:
  four distinct ordered pairs
  four distinct unordered pairs
  at least four people represented
  no person appears more than twice

must/cannot relation answers:
  no direct clue repetition
  no direct clue reversal
  no endpoint-anchor-only conclusion

possible-rank bounds:
  target is not fixed by a rank clue
  at least two compulsory predecessors or successors
  bound impossibility proof
  attainable witness proof

exact-rank determinacy:
  target is not fixed by a rank clue
  definite rank uses structural universal proof
  indeterminate rank uses two valid witness orders

all source forms:
  no Seating Arrangement geometry
  no permutation-count leakage
  no ambiguous “lower merit rank” or “lower score rank” wording
  answer positions balanced
  Easy/Medium/Hard based on proof burden
```

## 6. Executable evidence

```text
raw discovery prototypes:             8
raw discovery questions:            256
editorial V2 source forms:             7
editorial V2 questions checked:      168
provisional authority candidates:      4
answer positions:          42 / 42 / 42 / 42
V2 difficulty:
  Easy:                              12
  Medium:                            84
  Hard:                              72
permanent QLs allocated:              0
```

Exact-head validation run:

```text
workflow run: 31309207564
head:         434c950620262d3b2297cc81d72b5ece7d2de036
result:       PASS
```

Artifacts:

```text
editorial V2 evidence: 9036868337
sha256:ccb7c1a14cea1bcf8a74167c4a8cd667bbc69b395fc1a0f22ea7dbcb84d5d556

V2 human review pack: 9036868521
sha256:9d587693a5cbb43807c6aa2bb4d5ce06f4b3b3116353e6a1eb5749a618cbd3ab
```

## 7. Human-review conclusion

The V2 review pack corrects the systematic single-person option fixation found in the previous pack.

For generic relation questions:

```text
maximum appearances of one person: 2 of 4 options
minimum distinct comparison pairs: 4
minimum distinct people:           4
```

The pack is suitable for authority-level human review, but not yet for permanent allocation.

## 8. Remaining decision before RNK-QL-036

Manual review must decide one of these outcomes:

```text
Outcome A — 4 QLs
  keep all four provisional authority candidates separate

Outcome B — 3 QLs
  merge RELATIVE_RANK_DETERMINACY into RELATION_TRUTH_STATUS

Outcome C — extend CP-004 plus 2 or 3 new QLs
  absorb partial definite-relation mode into RNK-QL-034
  retain rank-bound and exact-rank uncertainty authorities
```

No option may be chosen from architecture preference alone. The decision requires competitive-exam source evidence and question-level human approval.

## Lifecycle

```text
next available identity: RNK-QL-036
CP-005 permanent QLs:   0
English freeze:         false
Question Studio:        DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```
