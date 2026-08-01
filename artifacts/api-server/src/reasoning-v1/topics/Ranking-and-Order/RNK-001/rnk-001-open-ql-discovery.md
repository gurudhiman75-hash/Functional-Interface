# RNK-001 — Open QL Discovery Register

Status: **CP-001 source discovery closed and awaiting English review; chapter-wide permanent QL allocation remains open**.

This register prevents premature chapter sizing. Candidate families are discovered from source evidence, task semantics, inverse directions, representation changes, edge states and solver boundaries. A candidate becomes a permanent QL only after executable proof, merge/split review, final gap closure and explicit human approval.

## 1. Discovery dimensions

Every checkpoint must audit:

- evidence shape;
- requested answer semantic;
- direct and inverse directions;
- context and representation;
- boundary and degenerate states;
- hidden-order structure;
- ambiguity and uniqueness;
- distractor ownership;
- explanation and localisation behaviour;
- checkpoint and cross-chapter ownership.

Counts are discovered rather than set as quotas.

## 2. RNK-CP-001 — One-person rank arithmetic

### Executable discovery inventory

```text
first foundation wave                 6 prototypes / 1,440 questions
source and inverse-gap wave           6 prototypes / 1,440 questions
final mirrored inverse addendum       1 prototype  /   240 questions
------------------------------------------------------------------
combined discovery                   13 prototypes / 3,120 questions
```

### Provisional consolidation

The 13 prototypes consolidate into nine authorities:

```text
RNK-CP001-AUTH-01  CONVERT_RANK_BETWEEN_ENDS
RNK-CP001-AUTH-02  TOTAL_FROM_BOTH_END_RANKS
RNK-CP001-AUTH-03  SIDE_COUNT_FROM_SAME_SIDE_RANK
RNK-CP001-AUTH-04  OPPOSITE_SIDE_COUNT_FROM_TOTAL_AND_RANK
RNK-CP001-AUTH-05  SAME_SIDE_RANK_FROM_SIDE_COUNT
RNK-CP001-AUTH-06  OPPOSITE_END_RANK_FROM_TOTAL_AND_SIDE_COUNT
RNK-CP001-AUTH-07  EXACT_MIDDLE_RANK_FROM_ODD_TOTAL
RNK-CP001-AUTH-08  ODD_TOTAL_FROM_EXACT_MIDDLE_RANK
RNK-CP001-AUTH-09  TOTAL_FROM_BEFORE_AND_AFTER_COUNTS
```

Clean symmetric merges:

```text
count before from start-rank
count after from end-rank
  -> AUTH-03 with counted-side parameter

count after from total and start-rank
count before from total and end-rank
  -> AUTH-04 with known-end parameter

start-rank from people before
end-rank from people after
  -> AUTH-05 with requested-end parameter

start-rank from total and people after
end-rank from total and people before
  -> AUTH-06 with requested-end parameter
```

Retained separately:

- rank conversion between ends;
- total from inclusive ranks at both ends;
- exact middle rank from odd total;
- odd total from exact middle rank;
- total from exclusive before/after counts.

Those contracts differ in evidence semantics, requested quantity, validity conditions, central-person adjustment, distractors or explanation logic.

### Closed CP-001 dimensions

- rank from either end;
- total from both inclusive end-ranks;
- exclusive count before/after from same-side rank;
- opposite side-count from total and one end-rank;
- same-side rank from exclusive side-count;
- opposite-end rank from total and side-count;
- exact middle rank under an odd total;
- odd total from exact middle rank;
- total from before and after counts;
- top/bottom, left/right and front/back representation parity;
- first/last, zero/one side-count and interior edges;
- Rank, Count and Total answer semantics.

### Current CP-001 evidence

```text
prototype discovery questions                  3,120
consolidation equation checks                   3,120
authority-runtime dispatches                    2,880
English review questions                           54
open one-person source dimensions                   0
provisional authorities                             9
permanent QLs                                       0
```

### CP-001 verdict

`ELIGIBLE_FOR_ENGLISH_MANUAL_REVIEW`

Permanent allocation is still blocked by:

1. explicit human review of the nine-authority corpus;
2. remediation of any accepted editorial findings;
3. post-review no-new-gap confirmation;
4. final English discovery-freeze decision.

## 3. RNK-CP-002 — Two-person positions

Candidate families remain open:

- people between two known ranks;
- rank difference;
- second rank from first rank plus relative offset;
- total from mixed ranks of different people plus between count;
- minimum/maximum possible total under uncertain relative order;
- identify nearer/farther person from an end;
- mixed-direction normalization before comparison.

## 4. RNK-CP-003 — Interchange and movement

Candidate families remain open:

- new ranks after interchange;
- original ranks from new ranks after interchange;
- total count from rank change after interchange;
- new rank after moving forward/backward;
- number passed or overtaken;
- original rank from final rank and movement;
- insertion/removal effects;
- sequential multiple moves.

## 5. Later checkpoints

### RNK-CP-004 — Multi-entity ordering

- complete order from pairwise comparisons;
- highest/lowest or first/last;
- exact rank and middle entity;
- relative order of a pair;
- valid/invalid order;
- missing comparison.

### RNK-CP-005 — Shared passages

- one order set feeding several questions;
- combined direct, between and movement queries;
- shared partial order with exact and possibility questions.

### RNK-CP-006 — Attribute-led ranking ownership

- height, age, marks, weight and price order where ranking is the dominant burden;
- reassign arithmetic-dominant tasks to the relevant Quant chapter;
- reassign multi-attribute matching to Logic Puzzles.

### RNK-CP-007 — Partial order and uncertainty

- definite, possible and impossible rank claims;
- cannot-determine exact rank;
- minimum/maximum possible rank;
- number of possible positions;
- clue redundancy and uniqueness.

### RNK-CP-008 — Advanced synthesis

- multi-stage ranking narratives;
- bounded grid/table presentations;
- mixed contexts where ranking remains dominant.

## 6. Protected ownership exclusions

```text
lexicographic/dictionary position              -> Word and Dictionary Order
seating adjacency/facing/geometry              -> Seating Arrangement
multi-attribute assignment                     -> Logic Puzzles
league points, brackets and tournament scoring -> Games and Tournament
statement I/II sufficiency labels              -> Data Sufficiency
alphabet position without a ranked group       -> Alphabet Test
age/speed/marks arithmetic as main burden       -> relevant Quant chapter
```

## 7. Current lifecycle verdict

```text
permanentQlCount:             0
frozenSolveModeCount:         0
cp001SourceGapCount:          0
cp001ProvisionalAuthorities:  9
cp001EnglishReviewRequired:   true
cp001EnglishFreezeGranted:    false
chapterFreezeReady:           false
questionStudioDiscoverable:   false
questionBankWritable:         false
testEligible:                 false
publiclyPublishable:          false
```
