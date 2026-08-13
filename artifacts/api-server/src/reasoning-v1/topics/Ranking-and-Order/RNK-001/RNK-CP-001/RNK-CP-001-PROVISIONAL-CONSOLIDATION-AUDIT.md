# RNK-CP-001 — Provisional Consolidation Audit

Status: **executable merge/split decision; permanent QL allocation still prohibited**.

## 1. Input inventory

CP-001 discovery currently contains 13 provisional prototypes proven across 3,120 deterministic questions:

```text
first foundation wave                 6 prototypes / 1,440 questions
source and inverse-gap wave           6 prototypes / 1,440 questions
final mirrored inverse addendum       1 prototype  /   240 questions
------------------------------------------------------------------
combined discovery                   13 prototypes / 3,120 questions
```

The consolidation question is not how few identities can be forced into one runtime. It is whether two prototypes share the same learner demand, answer semantic, solver family, ambiguity boundary, explanation structure and localisation behaviour after ordinary side/context parameters are removed.

## 2. Consolidation principles

Merge when the difference is only:

- start versus end;
- top/bottom, left/right or front/back vocabulary;
- row, queue or merit-list context;
- numeric instance size;
- answer-position rotation;
- difficulty produced by the generated instance.

Keep separate when the contract changes materially through:

- a different requested quantity;
- a different required evidence set;
- an odd-total or exact-middle validity condition;
- a distinct off-by-one explanation;
- a different inverse direction;
- a separate ambiguity or rejection rule.

## 3. Provisional authority result

Thirteen prototypes consolidate into nine provisional authorities.

### `RNK-CP001-AUTH-01 — CONVERT_RANK_BETWEEN_ENDS`

Retains:

```text
RNK-CP001-PROT-OPPOSITE-END-RANK
```

Given total and rank from one end, return rank from the opposite end.

### `RNK-CP001-AUTH-02 — TOTAL_FROM_BOTH_END_RANKS`

Retains:

```text
RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS
```

Both supplied values are inclusive ranks; the target person is counted twice and must be removed once.

### `RNK-CP001-AUTH-03 — SIDE_COUNT_FROM_SAME_SIDE_RANK`

Merges:

```text
RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK
RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK
```

The side is a parameter. In both cases:

```text
count outside the target on the named side = rank from that side − 1
```

### `RNK-CP001-AUTH-04 — OPPOSITE_SIDE_COUNT_FROM_TOTAL_AND_RANK`

Merges:

```text
RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK
RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK
```

The named end is a parameter. In both cases:

```text
count on the opposite side = total − rank from the supplied side
```

### `RNK-CP001-AUTH-05 — SAME_SIDE_RANK_FROM_SIDE_COUNT`

Merges:

```text
RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE
RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER
```

The side is a parameter. In both cases:

```text
rank from a side = people outside the target on that side + 1
```

### `RNK-CP001-AUTH-06 — OPPOSITE_END_RANK_FROM_TOTAL_AND_SIDE_COUNT`

Merges:

```text
RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL
RNK-CP001-PROT-END-RANK-FROM-COUNT-BEFORE-AND-TOTAL
```

The requested end is a parameter. In both cases:

```text
rank from the opposite end = total − people on the supplied side
```

### `RNK-CP001-AUTH-07 — EXACT_MIDDLE_RANK_FROM_ODD_TOTAL`

Retains:

```text
RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL
```

Requires an odd total and asks for the one exact middle rank.

### `RNK-CP001-AUTH-08 — ODD_TOTAL_FROM_EXACT_MIDDLE_RANK`

Retains:

```text
RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK
```

The inverse answer demand is total size, with the exact-middle condition supplying symmetry.

### `RNK-CP001-AUTH-09 — TOTAL_FROM_BEFORE_AND_AFTER_COUNTS`

Retains:

```text
RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS
```

Both supplied values exclude the target, so the target must be added once.

## 4. Rejected over-merges

### Do not merge all total-answer prototypes

`TOTAL_FROM_BOTH_END_RANKS`, `ODD_TOTAL_FROM_EXACT_MIDDLE_RANK`, and `TOTAL_FROM_BEFORE_AND_AFTER_COUNTS` all return a total, but they have different evidence semantics and different central-person adjustments:

```text
rank + rank − 1
2 × middle rank − 1
before + after + 1
```

Their distractors, validity checks and explanations are materially different.

### Do not merge the two exact-middle directions

Finding the middle rank from an odd total and reconstructing the odd total from a middle rank are inverse tasks with different requested quantities and option semantics.

### Do not merge rank conversion with side-count conversion

Both may use total subtraction, but one answer is an inclusive rank and the other is an exclusive count. Their off-by-one traps differ.

## 5. Cross-checkpoint boundary

The following remain outside CP-001:

- two named people and people-between questions — CP-002;
- relative position of one named person from another — CP-002;
- minimum/maximum total under uncertain relative order — CP-002;
- interchange and rank movement — CP-003;
- clue-based multi-person ordering — CP-004;
- shared passages — CP-005;
- Data Sufficiency answer semantics — `REAS-DSF`;
- seating/puzzle hidden arrangements — Family D chapters.

## 6. Freeze disposition

```text
provisional prototypes:        13
provisional authorities:        9
clean symmetric merges:         4 pairs
retained one-prototype rules:    5
permanent QLs:                   0
English manual approval:        pending
final source-gap audit:         pending
Question Studio:                disabled
Question Bank:                  NOT_STORED
mock-test eligibility:          INELIGIBLE
public publication:             false
```

This audit authorises a nine-authority review runtime only. It does not authorise `RNK-QL-*` allocation. Permanent identity requires final source-gap closure and explicit English manual approval.
