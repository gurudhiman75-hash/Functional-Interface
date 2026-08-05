# RNK-001 — Open QL Discovery Register

Status: **CP-001, CP-002 and CP-003 frozen at `RNK-QL-001..026`; CP-004 English Remodel V3 review is active**.

This register prevents premature chapter sizing. Each checkpoint discovers permanent identities from source evidence, executable solver contracts, inverse directions, edge states, representations and ownership audits. Counts are never quotas.

## 1. Frozen checkpoint — RNK-CP-001

```text
combined discovery:             13 prototypes / 3,120 questions
approved English review corpus: 54 questions
frozen authorities:              9
permanent range:                 RNK-QL-001..009
freeze version:                  RNK_CP001_ENGLISH_DISCOVERY_FREEZE_V1
```

## 2. Frozen checkpoint — RNK-CP-002

```text
combined discovery:             13 prototypes / 3,120 questions
approved English review corpus: 48 questions
frozen authorities:              8
permanent runtime:               1,536 questions
permanent range:                 RNK-QL-010..017
freeze version:                  RNK_CP002_ENGLISH_DISCOVERY_FREEZE_V1
projection: sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

Open CP-002 source dimensions: `0`.

## 3. Frozen checkpoint — RNK-CP-003

```text
combined discovery:             13 prototypes / 3,120 questions
approved English review corpus: 78 questions
frozen authorities:              9
permanent runtime:               1,728 questions
permanent range:                 RNK-QL-018..026
freeze version:                  RNK_CP003_ENGLISH_DISCOVERY_FREEZE_V1
projection: sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
```

### Frozen authorities

```text
RNK-QL-018  INTERCHANGE_RANKS_DIRECT_OR_INVERSE
RNK-QL-019  TOTAL_FROM_INTERCHANGE_RANK_CHANGE
RNK-QL-020  OWN_RANK_BEFORE_OR_AFTER_SINGLE_MOVEMENT
RNK-QL-021  PEOPLE_PASSED_FROM_RANK_CHANGE
RNK-QL-022  TARGET_RANK_AFTER_INSERTION
RNK-QL-023  TARGET_RANK_AFTER_REMOVAL
RNK-QL-024  OWN_RANK_AFTER_SEQUENTIAL_MOVES
RNK-QL-025  TARGET_RANK_EFFECT_OF_ANOTHER_PERSON_MOVE
RNK-QL-026  OWN_RANK_WITH_MOVEMENT_AND_MEMBERSHIP_CHANGE
```

Open CP-003 source dimensions: `0`.

## 4. Active checkpoint — RNK-CP-004

### Remodel V3 executable wave

```text
provisional authorities:         11
runtime seeds per authority:    240
runtime questions:            2,640
English review questions:        66
manual English approval:    pending
permanent QLs:                  none
next available identity: RNK-QL-027
```

The current provisional authorities are:

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

`RELATIVE_ORDER_OF_PAIR` owns direction only. `EXACT_RANK_DIFFERENCE_OF_PAIR` is a separate provisional authority because it requires complete-position proof and rank arithmetic.

### Proof model

The exact-order engine constructs a strict hidden order and independently reconstructs one unique topological order from displayed evidence.

Remodel V3 records three distinct proof demands:

```text
shortestDirectionalPathClues
shortestExactPositionProofClues
fullOrderProofClues
```

A directional path is not treated as proof of exact distance or immediate adjacency.

### Topology boundary

A unique total order from pairwise comparisons requires an adjacent-pair backbone. CP-004 therefore uses:

```text
CHAIN_BACKBONE
CHAIN_WITH_NON_ADJACENT_VERIFICATION
TWO_ORDERED_BLOCKS
```

Genuinely branched, partial and non-unique orders remain owned by CP-007.

### Current executable evidence

```text
average visible explanation words:       41.95
review adjacent-edge ratio:               0.8855
runtime questions with non-adjacent links: 1,602
normalized semantic duplicates:               0
answer positions:                     16/17/17/16
repeated four-answer sequences:                0
```

### Current proof targets passed

- deterministic generation and independent answer proof;
- entity counts 5–8;
- Easy, Medium and Hard reachability;
- direction-only versus exact-distance ownership separation;
- exact-position proof for distance and adjacency;
- distinct complete-order contradiction targets;
- neutral missing-comparison block labels;
- consistent-but-insufficient wrong bridge options;
- semantic duplicate and answer-sequence controls;
- lifecycle and publication locks.

### Still open before consolidation

- manual English approval of the 66-question Remodel V3 pack;
- source saturation beyond the first reference pass;
- inverse and reverse query audit;
- endpoint, exact-rank, relation and distance merge/split proof;
- ownership audit against CP-005, CP-006 and CP-007;
- final provisional-authority consolidation;
- permanent QL allocation and freeze proof.

No CP-004 QL count is allocated.

## 5. Open later checkpoints

### RNK-CP-005 — Presentation-led and shared ranking sets

Row, queue, merit-list and race-order presentations, plus shared evidence where ownership is primarily presentation or caselet structure.

### RNK-CP-006 — Attribute-led ranking ownership

Height, age, marks, weight and performance when comparison language and localisation materially affect the contract.

### RNK-CP-007 — Partial order and uncertainty

Definite, possible, impossible, cannot determine, minimum/maximum rank and uniqueness.

### RNK-CP-008 — Advanced synthesis

Multi-stage narratives, bounded grid/table forms and mixed ranking evidence.

## 6. Protected exclusions

```text
lexicographic/dictionary position              -> Word and Dictionary Order
seating adjacency/facing/geometry              -> Seating Arrangement
multi-attribute assignment                     -> Logic Puzzles
league points, brackets and tournament scoring -> Games and Tournament
statement I/II sufficiency labels              -> Data Sufficiency
alphabet position without a ranked group       -> Alphabet Test
age/speed/marks arithmetic as main burden       -> relevant Quant chapter
```

## 7. Current lifecycle

```text
cumulative permanent range:   RNK-QL-001..026
next available RNK ID:        RNK-QL-027
CP-001 discovery frozen:      true
CP-002 discovery frozen:      true
CP-003 discovery frozen:      true
CP-004 discovery frozen:      false
CP-004 manual review:         pending
CP-004 permanent QL count:    open
chapter-wide freeze:          false
English review-only:          true
Hindi/Punjabi:                not started
Question Studio:              disabled
Question Bank:                NOT_STORED
test eligibility:             INELIGIBLE
public publication:           false
```
