# RNK-CP-004 — Multi-Entity Comparison and Explicit Order Reconstruction

Status: **truthful-metadata English Remodel V4 implemented; manual approval and source expansion pending; permanent QL count open**.

This checkpoint owns questions in which several named entities are compared and one exact total order is reconstructed or made unique by one additional comparison.

## Current provisional authorities

```text
HIGHEST_ENTITY
LOWEST_ENTITY
ENTITY_AT_EXACT_RANK
RANK_OF_NAMED_ENTITY
MIDDLE_ENTITY
COMPLETE_ORDER
RELATIVE_ORDER_OF_PAIR
EXACT_RANK_DIFFERENCE_OF_PAIR
IMMEDIATE_NEIGHBOUR
VALID_RANK_STATEMENT
MISSING_COMPARISON
```

Direction-only pair comparison and exact rank difference remain separate provisional authorities.

## Boundary

```text
unique total order from multi-entity comparisons -> RNK-CP-004
row/queue/merit/race presentation ownership      -> RNK-CP-005
auto-generated height/age/marks vocabulary       -> RNK-CP-006
non-unique, possible, definite or impossible     -> RNK-CP-007
shared multi-question passages                   -> RNK-CP-008
```

Ties, incomparable entities and genuine cannot-determine answers are not forced into CP-004. Branched or partially determined orders remain owned by CP-007 unless a separate exact contract is proved.

## Executable Remodel V4 discovery

```text
provisional authorities:             11
runtime seeds per authority:        240
runtime questions:                2,640
English review pack:                 66
permanent QLs:                     none
next available RNK identity:  RNK-QL-027
```

These counts remain discovery evidence rather than a fixed final inventory.

## Explanation model

The internal proof remains structured, while the learner renderer shows the few decisive steps needed by the question:

```text
CHAIN_BUILD
POSITION_LINE
PAIR_DIRECTION
PAIR_DISTANCE
NEIGHBOUR_HIGHLIGHT
OPTION_CONTRADICTION
TRANSITIVE_PROOF
BLOCK_BRIDGE
```

V4 retains the proof-safe fields:

```text
shortestDirectionalPathClues
shortestExactPositionProofClues
fullOrderProofClues
```

and adds:

```text
shortestAnswerProofClues
```

Wrong-option teaching is available through a collapsed progressive-disclosure component rather than being forced into the default explanation.

## Truthful clue accounting

Every displayed clue receives exactly one proof role:

```text
ESSENTIAL_FOR_FULL_ORDER
ESSENTIAL_FOR_BLOCK_ORDER
CONFIRMATORY
REDUNDANT_OTHER
```

Edge distance and proof role are stored separately. A non-adjacent edge may be confirmatory without representing a new reasoning topology.

The review pack contains:

```text
ordinary-question essential clues: 322
ordinary-question confirmatory clues: 45
unclassified clues: 0
```

## Core topology reporting

A unique total order produced only from pairwise comparisons has a chain as its transitive reduction. V4 therefore reports:

```text
TOTAL_ORDER_CHAIN
TWO_ORDERED_BLOCKS
```

Confirmatory non-adjacent edges are reported separately as added evidence and are not claimed as a new core topology.

## Remodel V4 guarantees

- every statement is counted and classified;
- clue accounting is independently checked by removal testing;
- shortest-answer proof is recorded for every authority;
- difficulty uses task-specific proof size, irrelevant clues, entity count and option closeness;
- direction-only pair questions cannot make an immediate-neighbour distractor simultaneously true;
- exact-distance explanations show both ranks and subtraction;
- neighbour explanations establish the complete order before adjacency;
- numbered rank displays use compact rows;
- confirmatory clues are explained through an optional clue-role note;
- wrong-option help is collapsed by default;
- missing-comparison explanations demonstrate ambiguity using concrete alternate orders;
- semantic duplicates and answer-sequence patterns are rejected;
- lifecycle and publication locks remain active.

`RNK-CP-004-REMODEL-V4-REMEDIATION.md` records the complete V4 correction set.

## Current executable evidence

```text
runtime questions:                     2,640
review questions:                         66
runtime clue-accounting failures:          0
review essential clues:                  322
review confirmatory clues:                45
review unclassified clues:                 0
average visible explanation words:      47.64
normalized semantic duplicates:             0
answer positions:                   16/17/17/16
repeated four-answer sequences:              0
```

## Next gate

```text
manual review of Remodel V4 English pack
  -> source and inverse expansion
  -> ownership and boundary audit
  -> merge/split consolidation
  -> permanent runtime proof
  -> English discovery freeze
```

## Safety boundary

```text
English manual approval:       pending
English discovery frozen:      false
permanent QL count:            open
Hindi/Punjabi:                 not started
Question Studio:               disabled
Question Bank:                 NOT_STORED
test eligibility:              INELIGIBLE
public publication:            false
```
